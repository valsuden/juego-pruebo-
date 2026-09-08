// js/multiplayer.js

const Multiplayer = {
    pollingInterval: null,

    init() {
        if (!window.leaderboardAPI) return;

        const loop = () => {
            // Optimization: Skip network checks when tab is hidden or during active gameplay
            if (document.hidden || (window.game && window.game.isPlaying)) {
                this.pollingInterval = setTimeout(loop, 12000);
                return;
            }
            this.checkAttacks();
            const delay = window.PerformanceManager 
                ? window.PerformanceManager.getNetworkDelay() 
                : (window.potatoMode ? 35000 : 14000);
            this.pollingInterval = setTimeout(loop, delay);
        };
        
        // Initial delay
        this.pollingInterval = setTimeout(loop, 3000);
    },

    stop() {
        if (this.pollingInterval) {
            clearTimeout(this.pollingInterval);
            this.pollingInterval = null;
        }
    },

    sendAttack(attacker, target, runeId) {
        if (!window.leaderboardAPI || !attacker || !target || !runeId) return;

        const cbName = 'sendRuneCb_' + Date.now() + Math.floor(Math.random() * 1000);
        window[cbName] = function (data) {
            delete window[cbName];
            const script = document.getElementById(cbName);
            if (script) script.remove();
            
            if (data && data.success) {
                if (typeof applyAttackBenefits === 'function') applyAttackBenefits(runeId, target);
                if (typeof window.fetchProfileFromCloud === 'function') window.fetchProfileFromCloud(attacker);
            } else if (data) {
                if (typeof showRuneAlert === 'function') showRuneAlert("Falló: " + data.error, "#ff0000");
            }
        };

        const hash = window.generateHash ? window.generateHash(attacker + target + runeId, '', '') : '';
        const s = document.createElement('script');
        s.id = cbName;
        s.src = window.leaderboardAPI + '?action=sendAttack&attacker=' + encodeURIComponent(attacker) + '&target=' + encodeURIComponent(target) + '&runeId=' + encodeURIComponent(runeId) + '&hash=' + hash + '&callback=' + cbName + '&t=' + Date.now();
        document.body.appendChild(s);
    },

    checkAttacks() {
        if (typeof Users === 'undefined' || !Users.current || !window.leaderboardAPI) return;

        const cbName = 'runeAttackCb_' + Date.now() + Math.floor(Math.random() * 1000);
        window[cbName] = function (data) {
            var payload = (data && data.data) ? data.data : data;
            if (data && data.success && payload && payload.attacks && payload.attacks.length > 0) {
                payload.attacks.forEach(attack => {
                    if (typeof receiveRuneAttack === 'function') {
                        receiveRuneAttack(attack.attacker, attack.runeId);
                    }
                    Multiplayer.clearAttack(attack.id);
                });
                
                // Immediately sync profile to reflect server-side point/coin damage
                if (typeof window.fetchProfileFromCloud === 'function') {
                    window.fetchProfileFromCloud(Users.current);
                }
            }
            delete window[cbName];
            const script = document.getElementById(cbName);
            if (script) script.remove();
        };

        const s = document.createElement('script');
        s.id = cbName;
        s.src = window.leaderboardAPI + '?action=getAttacks&name=' + encodeURIComponent(Users.current) + '&callback=' + cbName + '&t=' + Date.now();
        document.body.appendChild(s);
    },

    clearAttack(attackId) {
        if (!window.leaderboardAPI) return;
        var formData = new URLSearchParams();
        formData.append('action', 'clearAttack');
        formData.append('attackId', attackId);

        fetch(window.leaderboardAPI, {
            method: 'POST',
            mode: 'no-cors',
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            body: formData.toString()
        }).catch(function () {});
    }
};

document.addEventListener('DOMContentLoaded', () => {
    Multiplayer.init();
});
