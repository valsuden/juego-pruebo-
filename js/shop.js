// =============================================================================
// TRADUCCIONES DE RUNAS AL ESPAÑOL (botón "VER EN ESPAÑOL" dentro de la tienda)
// =============================================================================
const RUNES_ES = {
    rune_focus:         { name: 'Runa de Enfoque',              desc: 'La mente tranquila siempre encuentra la respuesta. (+10 segundos)' },
    rune_recovery:      { name: 'Runa de Recuperación',         desc: 'Un error no es el final. (Recupera 1 vida)' },
    rune_shield:        { name: 'Runa de Escudo',               desc: 'La barrera resiste. (Bloquea el próximo efecto negativo)' },
    rune_wisdom:        { name: 'Runa de Sabiduría',            desc: 'El conocimiento deja pistas. (Revela una letra)' },
    rune_calm:          { name: 'Runa de Calma',                desc: 'Mantén la concentración. (Un error no rompe tu racha)' },
    rune_coin_spark:    { name: 'Runa de Chispa de Monedas',    desc: 'Las pequeñas fortunas crecen. (+0.25 monedas por cada respuesta correcta)' },
    rune_small_boost:   { name: 'Runa de Pequeño Impulso',      desc: 'Cada punto cuenta. (La siguiente respuesta correcta da +1 punto extra)' },
    rune_purify:        { name: 'Runa de Purificación',         desc: 'La oscuridad se desvanece. (Elimina los efectos negativos activos)' },
    rune_double:        { name: 'Runa de Doble',                desc: 'El doble de recompensa. (Puntos x2 durante 30 segundos)' },
    rune_combo:         { name: 'Runa de Combo',                desc: 'El impulso crea campeones. (Empiezas con racha x2)' },
    rune_time_lock:     { name: 'Runa de Cerrojo Temporal',     desc: 'El reloj obedece. (Congela el tiempo 15 segundos)' },
    rune_stamina:       { name: 'Runa de Aguante',              desc: 'La resistencia gana batallas. (Recupera 2 vidas)' },
    rune_lucky_roll:    { name: 'Runa de Tirada de Suerte',     desc: 'La fortuna favorece a los audaces. (Más probabilidad de multiplicador aleatorio)' },
    rune_quick_mind:    { name: 'Runa de Mente Rápida',         desc: 'La velocidad se vuelve poder. (+1 punto extra por acierto durante 20 segundos)' },
    rune_safe_step:     { name: 'Runa de Paso Seguro',          desc: 'Un error gratis. (El próximo error no te quita vida)' },
    rune_coin_burst:    { name: 'Runa de Estallido de Monedas', desc: 'Gana con el conocimiento. (+1 moneda por cada respuesta correcta)' },
    rune_point_drain:   { name: 'Runa de Drenaje de Puntos',    desc: 'El poder cambia de manos. (Roba 5 puntos a otro jugador)' },
    rune_streak_break:  { name: 'Runa Rompe Rachas',            desc: 'Toda racha termina algún día. (Destruye la racha del objetivo)' },
    rune_silence:       { name: 'Runa de Silencio',             desc: 'Magia sellada. (El objetivo no puede usar runas en su próxima partida)' },
    rune_time_curse:    { name: 'Runa de Maldición Temporal',   desc: 'El reloj se vuelve tu enemigo. (Quita 10 segundos al objetivo)' },
    rune_lockdown:      { name: 'Runa de Bloqueo',              desc: 'Tu poder queda sellado. (Bloquea la próxima runa que use el objetivo)' },
    rune_score_echo:    { name: 'Runa de Eco de Puntaje',       desc: 'El dolor se vuelve fuerza. (Recuperas el 50% de los puntos que te roben)' },
    rune_pressure:      { name: 'Runa de Presión',              desc: 'Empieza la cacería. (El objetivo pierde 1 segundo cada vez que aciertas, por un minuto)' },
    rune_shadow_copy:   { name: 'Runa de Copia Sombría',        desc: 'Camina junto a los grandes. (Copia el puntaje de otro jugador sin robárselo)' },
    rune_crown_breaker: { name: 'Runa Rompe Coronas',           desc: 'La corona cambia de dueño. (Quedas 10 puntos por encima del objetivo)' },
    rune_position_swap: { name: 'Runa de Cambio de Puesto',     desc: 'El destino intercambia lugares. (Intercambias tu puesto con el jugador elegido)' },
    rune_time_freeze:   { name: 'Runa de Congelación',          desc: 'Por un momento, el tiempo se detiene. (Congela el tiempo 30 segundos)' },
    rune_stolen_crown:  { name: 'Runa de Corona Robada',        desc: 'El trono ahora es tuyo. (Roba 10 puntos y la racha del objetivo)' },
    rune_guardian:      { name: 'Runa Guardiana',               desc: 'Nada mueve al guardián. (Protección de 24 horas contra runas negativas)' },
    rune_reflect:       { name: 'Runa de Reflejo',              desc: 'Lo que se envía, regresa. (Devuelve el próximo ataque que recibas)' },
    rune_leader_seal:   { name: 'Runa del Sello del Líder',     desc: 'El camino hacia arriba se cierra. (El objetivo no puede subir puestos durante una partida)' },
    rune_final_chance:  { name: 'Runa de Última Oportunidad',   desc: 'Un último esfuerzo. (Si llegas a 0 vidas: recuperas 1 vida y +15s. Pierdes la racha)' },
    rune_reality_shift: { name: 'Runa de Cambio de Realidad',   desc: 'La realidad se dobla. (Intercambias tu puntaje total con el objetivo)' },
    rune_overdrive:     { name: 'Runa de Sobrecarga',           desc: 'Ya no hay límites. (Puntos x3 durante 30 segundos)' },
    rune_emperor:       { name: 'Runa del Emperador',           desc: 'Gobierna por encima de todos. (+15 puntos y +2 vidas al instante)' },
    rune_fate_rewind:   { name: 'Runa del Destino',             desc: 'El tiempo se dobla, pero nunca gratis. (Restaura vidas y tiempo. Pierdes la racha y no puedes ganar racha)' },
    rune_two_time:      { name: 'Runa de Segunda Vez',          desc: 'El Spawn vio tu caída... y decidió darte otra oportunidad. (Restaura vidas y tiempo, quita efectos negativos. Pierdes la racha)' }
};

const CATEGORY_LABELS = {
    Gameplay: { en: 'GAMEPLAY RUNES', es: 'RUNAS DE JUEGO' },
    Defense:  { en: 'DEFENSE RUNES',  es: 'RUNAS DE DEFENSA' },
    Attack:   { en: 'ATTACK RUNES',   es: 'RUNAS DE ATAQUE' }
};

function runeText(rune) {
    const lang = (typeof Shop !== 'undefined' && Shop.lang === 'es') ? 'es' : 'en';
    if (lang === 'es' && RUNES_ES[rune.id]) {
        return { name: rune.name, desc: RUNES_ES[rune.id].desc };
    }
    return { name: rune.name, desc: rune.description };
}
function toast(msg, type = 'success') {
    const t = document.createElement('div');
    t.className = `tom-toast ${type}`;
    t.innerHTML = msg;
    document.body.appendChild(t);
    setTimeout(() => t.remove(), 3000);
}

const Shop = {
    lang: (function () {
        try { return localStorage.getItem('shopLang') === 'es' ? 'es' : 'en'; } catch (e) { return 'en'; }
    })(),
    toggleLang() {
        this.lang = (this.lang === 'es') ? 'en' : 'es';
        try { localStorage.setItem('shopLang', this.lang); } catch (e) { }
        this.renderRunes();
    },
    currentRuneStock: [],
    consecutiveMisses: 0,
    lastRefreshTime: 0,

    init() {
        this.loadStock();
        setInterval(() => this.checkRefresh(), 60000);
    },

    loadStock() {
        if (window.TEST_MODE) { this.refreshRuneStock(); return; }
        try {
            const data = JSON.parse(localStorage.getItem('shopRuneStock'));
            if (data && Date.now() - data.time < 600000) {
                this.currentRuneStock = data.stock;
                this.consecutiveMisses = data.misses || 0;
                this.lastRefreshTime = data.time;
            } else {
                this.refreshRuneStock();
            }
        } catch (e) {
            this.refreshRuneStock();
        }
    },

    checkRefresh() {
        if (window.TEST_MODE) { this.refreshRuneStock(); return; }
        if (Date.now() - this.lastRefreshTime >= 600000) {
            this.refreshRuneStock();
            const ov = document.getElementById('shop-overlay');
            if (ov && ov.classList.contains('open')) {
                this.render();
            }
        }
    },

    refreshRuneStock() {
        if (typeof RUNES === 'undefined') return;

        if (window.TEST_MODE) {
            this.currentRuneStock = RUNES.slice();
            this.lastRefreshTime = Date.now();
            return;
        }

        let availableRunes = RUNES.filter(r => r.rarity !== 'Secret');
        let stockSize = 6;
        this.currentRuneStock = [];
        let hasLegendaryOrMythic = false;

        if (this.consecutiveMisses >= 3) {
            let highTierRunes = availableRunes.filter(r => r.rarity === 'Legendary' || r.rarity === 'Mythic');
            if (highTierRunes.length > 0) {
                let guaranteed = highTierRunes[Math.floor(Math.random() * highTierRunes.length)];
                this.currentRuneStock.push(guaranteed);
                hasLegendaryOrMythic = true;
                this.consecutiveMisses = 0;
                stockSize--;
            }
        }

        for (let i = 0; i < stockSize; i++) {
            let randomRune = availableRunes[Math.floor(Math.random() * availableRunes.length)];
            this.currentRuneStock.push(randomRune);
            if (randomRune.rarity === 'Legendary' || randomRune.rarity === 'Mythic') {
                hasLegendaryOrMythic = true;
                this.consecutiveMisses = 0;
            }
        }

        if (!hasLegendaryOrMythic) {
            this.consecutiveMisses++;
        }

        this.lastRefreshTime = Date.now();
        localStorage.setItem('shopRuneStock', JSON.stringify({
            stock: this.currentRuneStock,
            time: this.lastRefreshTime,
            misses: this.consecutiveMisses
        }));
    },

    open() {
        if (!Users.current) { toast('¡Selecciona un usuario primero!', 'error'); return; }
        if (window.TEST_MODE && Users.data) {
            Users.data.coins = 5000;
            if (typeof Users.save === 'function') Users.save();
            if (typeof Users.updateUI === 'function') Users.updateUI();
        }
        this.checkRefresh();
        this.render();
        const ov = document.getElementById('shop-overlay');
        if (ov) ov.classList.add('open');
    },
    close() {
        const ov = document.getElementById('shop-overlay');
        if (ov) ov.classList.remove('open');
    },
    render() {
        const grid = document.getElementById('shop-grid');
        if (!grid || !Users.data) return;
        grid.innerHTML = '';

        const bal = document.getElementById('shop-bal');
        if (bal) bal.textContent = Users.data.coins;

        BANNERS.forEach(b => {
            const rows = Storage.getLeaderboard ? Storage.getLeaderboard() : [];
            const isTop1 = rows.length > 0 && rows[0].name === Users.current;
            const isTopBanner = b.id === 'royal_zenith' || b.id === 'celestial_king';
            const owned = (Users.data.ownedBanners || []).includes(b.id) || (isTopBanner && isTop1);
            const equipped = Users.data.equippedBanner === b.id;
            const rar = getRarity(b.rarity);

            const card = document.createElement('div');
            card.className = 'shop-card' + (owned ? ' owned' : '') + (equipped ? ' equipped-card' : '');

            const prev = document.createElement('div');
            prev.className = `card-banner-preview ${b.css}`;
            prev.textContent = b.name;
            card.appendChild(prev);

            const nm = document.createElement('div');
            nm.className = 'card-name';
            nm.textContent = b.name;
            card.appendChild(nm);

            const rt = document.createElement('div');
            rt.className = `card-rarity rarity-tag rarity-${b.rarity}`;
            rt.textContent = b.rarity;
            card.appendChild(rt);

            const pr = document.createElement('div');
            pr.className = 'card-price' + (owned ? ' owned-label' : '');
            if (owned) {
                pr.textContent = equipped ? '✓ EQUIPADO' : '✓ TUYO';
            } else {
                pr.innerHTML = `${window.HWIcon ? window.HWIcon("coin", "coin-icon") : "🪙"} ${b.price}`;
            }
            card.appendChild(pr);

            const btn = document.createElement('button');
            btn.className = 'card-btn';
            if (!owned) {
                btn.classList.add('btn-buy');
                btn.textContent = 'COMPRAR';
                btn.onclick = () => this.buy(b.id);
            } else if (equipped) {
                btn.classList.add('btn-unequip');
                btn.textContent = 'DESEQUIPAR';
                btn.onclick = () => { Users.unequipBanner(); this.render(); };
            } else {
                btn.classList.add('btn-equip');
                btn.textContent = 'EQUIPAR';
                btn.onclick = () => { Users.equipBanner(b.id); this.render(); };
            }
            card.appendChild(btn);

            grid.appendChild(card);
        });

        this.renderRunes();
    },
    renderRunes() {
        const runesGrid = document.getElementById('runes-grid');
        if (!runesGrid || !Users.data) return;
        runesGrid.innerHTML = '';

        const es = (this.lang === 'es');

        // Botón de idioma
        const langBar = document.createElement('div');
        langBar.style.gridColumn = '1 / -1';
        langBar.style.textAlign = 'center';
        langBar.style.marginBottom = '10px';
        const langBtn = document.createElement('button');
        langBtn.className = 'card-btn';
        langBtn.style.background = 'linear-gradient(135deg,#0ea5e9,#0f172a)';
        langBtn.style.color = '#fff';
        langBtn.style.border = '2px solid #38bdf8';
        langBtn.style.padding = '8px 14px';
        langBtn.style.cursor = 'pointer';
        langBtn.textContent = es ? '🌐 VIEW IN ENGLISH' : '🌐 VER EN ESPAÑOL';
        langBtn.onclick = () => this.toggleLang();
        langBar.appendChild(langBtn);
        runesGrid.appendChild(langBar);

        if (!this.currentRuneStock || this.currentRuneStock.length === 0) return;

        const makeHeader = (text, color) => {
            const h = document.createElement('div');
            h.style.gridColumn = '1 / -1';
            h.style.textAlign = 'center';
            h.style.fontSize = '0.8em';
            h.style.color = color;
            h.style.margin = '12px 0 4px 0';
            h.style.paddingBottom = '6px';
            h.style.borderBottom = '2px solid ' + color;
            h.style.textShadow = '0 0 8px ' + color;
            h.textContent = text;
            return h;
        };

        const groups = [
            { cat: 'Gameplay', color: '#00ff4c' },
            { cat: 'Defense', color: '#00ccff' },
            { cat: 'Attack', color: '#ff4444' }
        ];

        groups.forEach(g => {
            const items = [];
            this.currentRuneStock.forEach((r, idx) => {
                if ((r.category || 'Gameplay') === g.cat) items.push({ rune: r, idx: idx });
            });
            if (items.length === 0) return;

            const label = CATEGORY_LABELS[g.cat] ? CATEGORY_LABELS[g.cat][es ? 'es' : 'en'] : g.cat;
            runesGrid.appendChild(makeHeader(label, g.color));

            items.forEach(item => {
                const r = item.rune;
                const txt = runeText(r);
                const rar = typeof getRuneRarity === 'function' ? getRuneRarity(r.rarity) : null;
                const color = rar ? rar.color : '#fff';

                const card = document.createElement('div');
                card.className = 'shop-card';

                const prev = document.createElement('div');
                prev.className = `card-banner-preview ${r.css}`;
                prev.style.display = 'flex';
                prev.style.justifyContent = 'center';
                prev.style.alignItems = 'center';
                prev.style.fontSize = '2em';
                prev.style.color = color;
                prev.innerHTML = window.HWIcon ? window.HWIcon('rune') : (r.glyph || '?');
                card.appendChild(prev);

                const nm = document.createElement('div');
                nm.className = 'card-name';
                nm.textContent = txt.name;
                card.appendChild(nm);

                const desc = document.createElement('div');
                desc.style.fontSize = '0.5em';
                desc.style.color = '#ccc';
                desc.style.marginBottom = '5px';
                desc.style.padding = '0 5px';
                desc.textContent = txt.desc;
                card.appendChild(desc);

                const rt = document.createElement('div');
                rt.className = `card-rarity rarity-tag rarity-${r.rarity}`;
                rt.textContent = r.rarity;
                card.appendChild(rt);

                const pr = document.createElement('div');
                pr.innerHTML = `<span class="hw-icon-placeholder" data-icon="coins">${window.HWIcon ? window.HWIcon('coins') : ''}</span> ${r.price}`;
                card.appendChild(pr);

                const btn = document.createElement('button');
                btn.className = 'card-btn btn-buy';
                btn.textContent = es ? 'COMPRAR' : 'BUY';
                btn.onclick = () => this.buyRune(r.id, item.idx);
                card.appendChild(btn);

                runesGrid.appendChild(card);
            });
        });
        const secretRune = typeof RUNES !== 'undefined' ? RUNES.find(r => r.id === 'rune_two_time') : null;
        if (secretRune) {
            const rar = typeof getRuneRarity === 'function' ? getRuneRarity(secretRune.rarity) : null;
            const color = rar ? rar.color : '#ff00ff';

            const card = document.createElement('div');
            card.className = 'shop-card out-of-stock';
            card.style.opacity = '0.7';
            card.style.filter = 'grayscale(0.5)';

            const prev = document.createElement('div');
            prev.className = `card-banner-preview ${secretRune.css}`;
            prev.style.display = 'flex';
            prev.style.justifyContent = 'center';
            prev.style.alignItems = 'center';
            prev.style.fontSize = '2em';
            prev.style.color = color;

            if (secretRune.imageUrl) {
                const img = document.createElement('img');
                img.src = secretRune.imageUrl;
                img.style.maxWidth = '100%';
                img.style.maxHeight = '100%';
                img.style.objectFit = 'contain';
                prev.appendChild(img);
            } else {
                prev.textContent = secretRune.glyph || '🌌';
            }

            card.appendChild(prev);

            const secretTxt = runeText(secretRune);

            const nm = document.createElement('div');
            nm.className = 'card-name';
            nm.textContent = secretTxt.name;
            card.appendChild(nm);

            const desc = document.createElement('div');
            desc.style.fontSize = '0.5em';
            desc.style.color = '#ccc';
            desc.style.marginBottom = '5px';
            desc.style.padding = '0 5px';
            desc.textContent = secretTxt.desc;
            card.appendChild(desc);

            const rt = document.createElement('div');
            rt.className = `card-rarity rarity-tag rarity-${secretRune.rarity}`;
            rt.textContent = secretRune.rarity;
            card.appendChild(rt);

            const pr = document.createElement('div');
            pr.innerHTML = `<span class="hw-icon-placeholder" data-icon="coins">${window.HWIcon ? window.HWIcon('coins') : ''}</span> ???`;
            card.appendChild(pr);

            const btn = document.createElement('button');
            btn.className = 'card-btn';
            btn.style.background = '#333';
            btn.style.color = '#888';
            btn.style.cursor = 'not-allowed';
            btn.textContent = 'SIN STOCK';
            card.appendChild(btn);

            runesGrid.appendChild(card);
        }

        if (this.countdownInterval) clearInterval(this.countdownInterval);

        const timerLabel = document.createElement('div');
        timerLabel.style.gridColumn = '1 / -1';
        timerLabel.style.textAlign = 'center';
        timerLabel.style.fontSize = '0.8em';
        timerLabel.style.color = '#ffcc00';
        timerLabel.style.marginTop = '15px';
        runesGrid.appendChild(timerLabel);

        const updateTimer = () => {
            let remaining = (this.lastRefreshTime + 600000) - Date.now();
            if (remaining <= 0) {
                timerLabel.innerHTML = `Restocking...`;
                this.checkRefresh();
                return;
            }
            let mins = Math.floor(remaining / 60000);
            let secs = Math.floor((remaining % 60000) / 1000);
            timerLabel.innerHTML = `Próximo restock: ${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
        };

        updateTimer();
        this.countdownInterval = setInterval(updateTimer, 1000);
    },
    buy(id) {
        const b = getBanner(id);
        if (!b) return;
        if (Users.buyBanner(id)) {
            toast(`¡${b.name} desbloqueado!`, 'success');
            this.render();
        } else {
            toast('Arcane Coins insuficientes', 'error');
        }
    },
    buyRune(id, stockIndex) {
        const r = typeof getRune === 'function' ? getRune(id) : null;
        if (!r) return;
        if (Users.buyRune && Users.buyRune(id)) {
            toast(`¡Runa ${r.name} comprada!`, 'success');
            this.currentRuneStock.splice(stockIndex, 1);
            localStorage.setItem('shopRuneStock', JSON.stringify({
                stock: this.currentRuneStock,
                time: this.lastRefreshTime,
                misses: this.consecutiveMisses
            }));
            this.render();
        } else {
            toast('Arcane Coins insuficientes', 'error');
        }
    },
    redeemCode() {
        const input = document.getElementById('promo-code-input');
        const feedback = document.getElementById('promo-code-feedback');
        if (!input || !feedback) return;

        const enteredCode = input.value.trim().toUpperCase();
        if (!enteredCode) {
            feedback.textContent = 'INGRESA UN CÓDIGO';
            feedback.style.color = '#ff3300';
            return;
        }

        const now = Date.now();
        let rateLimit = { attempts: 0, last: 0 };
        try {
            const storedRate = localStorage.getItem('promoRateLimit');
            if (storedRate) rateLimit = JSON.parse(storedRate);
        } catch (e) { }

        if (now - rateLimit.last < 60000) {
            if (rateLimit.attempts >= 5) {
                feedback.textContent = 'DEMASIADOS INTENTOS. ESPERA 1 MINUTO.';
                feedback.style.color = '#ff3300';
                return;
            }
        } else {
            rateLimit.attempts = 0;
        }
        rateLimit.attempts++;
        rateLimit.last = now;
        localStorage.setItem('promoRateLimit', JSON.stringify(rateLimit));

        if (!Users.current || !Users.data) {
            feedback.textContent = 'ERROR: SELECCIONA UN USUARIO PRIMERO';
            feedback.style.color = '#ff3300';
            return;
        }

        if (!window.CONFIG || !window.CONFIG.API_URL) {
            feedback.textContent = 'ERROR: API NO CONFIGURADA';
            feedback.style.color = '#ff3300';
            return;
        }

        feedback.textContent = 'VALIDANDO EN EL SERVIDOR...';
        feedback.style.color = '#ffff00';

        const cbName = 'redeemCb_' + Date.now();

        window[cbName] = function(data) {
            delete window[cbName];
            const script = document.getElementById(cbName);
            if (script) script.remove();

            if (!data) {
                feedback.textContent = 'SIN RESPUESTA DEL SERVIDOR';
                feedback.style.color = '#ff3300';
                return;
            }

            if (!data.success) {
                if (data.error && (data.error.includes('Acci') || data.error.includes('no reconocida'))) {
                    feedback.textContent = 'EL SERVIDOR NO ESTÁ ACTUALIZADO.';
                    feedback.style.color = '#ffaa00';
                } else {
                    feedback.textContent = 'ERROR: ' + data.error;
                    feedback.style.color = '#ff3300';
                }
                return;
            }

            // Extract rewards safely (support new and legacy formats)
            const rewards = data.rewards || data || {};
            const prizeCoins = parseInt(rewards.coins) || 0;
            const runeId = rewards.runeId || null;
            const exp = parseInt(rewards.exp) || 0;
            const energy = parseInt(rewards.energy) || 0;
            const bannerId = rewards.bannerId || null;
            
            let messageParts = [];

            if (prizeCoins > 0) {
                Users.addCoins(prizeCoins);
                messageParts.push(`+${prizeCoins} Coins`);
            }

            if (runeId) {
                Users.data.ownedRunes = Users.data.ownedRunes || [];
                if (!Users.data.ownedRunes.includes(runeId)) Users.data.ownedRunes.push(runeId);
                Users.data.runeQuantities = Users.data.runeQuantities || {};
                Users.data.runeQuantities[runeId] = (Users.data.runeQuantities[runeId] || 0) + 1;
                const r = typeof getRune === 'function' ? getRune(runeId) : null;
                messageParts.push(r ? r.name : 'Runa Especial');
            }
            
            if (bannerId) {
                Users.data.ownedBanners = Users.data.ownedBanners || [];
                if (!Users.data.ownedBanners.includes(bannerId)) Users.data.ownedBanners.push(bannerId);
                messageParts.push('Banner Nuevo');
            }
            
            if (exp > 0) {
                Users.data.exp = (Users.data.exp || 0) + exp;
                messageParts.push(`+${exp} EXP`);
            }
            
            if (energy > 0) {
                Users.data.energy = (Users.data.energy || 0) + energy;
                messageParts.push(`+${energy} Energía`);
            }
            
            if (rewards.specialAction) {
                console.log("Acción especial de código:", rewards.specialAction);
                // Aquí se podría desbloquear historia, etc.
                messageParts.push('Recompensa Especial');
            }

            Users.data.redeemedCodes = Users.data.redeemedCodes || [];
            crypto.subtle.digest('SHA-256', new TextEncoder().encode(enteredCode)).then(buffer => {
                const hashHex = Array.from(new Uint8Array(buffer)).map(b => b.toString(16).padStart(2, '0')).join('');
                if (!Users.data.redeemedCodes.includes(hashHex)) Users.data.redeemedCodes.push(hashHex);
                Users.save();

                const bal = document.getElementById('shop-bal');
                if (bal) bal.textContent = Users.data.coins;

                if (messageParts.length === 0) messageParts.push("Recompensa validada");
                feedback.textContent = `¡CÓDIGO CANJEADO! ` + messageParts.join(' & ');
                if (typeof toast === 'function') toast(`¡Recibiste: ${messageParts.join(', ')}!`, 'success');

                feedback.style.color = '#00ff4c';
                input.value = '';
                if (typeof Users._updateHUD === 'function') Users._updateHUD();
            });
        };

        const s = document.createElement('script');
        s.id = cbName;
        
        var codesUrl = (window.CONFIG && window.CONFIG.CODES_API_URL) ? window.CONFIG.CODES_API_URL : null;
        if (!codesUrl) {
             feedback.textContent = 'ERROR: API DE CÓDIGOS NO CONFIGURADA.';
             feedback.style.color = '#ff3300';
             return;
        }

        s.src = codesUrl + '?action=redeemCode&code=' + encodeURIComponent(enteredCode)
            + '&player=' + encodeURIComponent(Users.current)
            + '&callback=' + cbName
            + '&t=' + Date.now();

        s.onerror = () => {
            if (window[cbName]) delete window[cbName];
            s.remove();
            feedback.textContent = 'ERROR DE RED. VERIFICA TU CONEXIÓN.';
            feedback.style.color = '#ff3300';
        };

        document.body.appendChild(s);
    }
}

const LB = {
    open() {
        this.render();
        const ov = document.getElementById('lb-overlay');
        if (ov) ov.classList.add('open');
    },
    close() {
        const ov = document.getElementById('lb-overlay');
        if (ov) ov.classList.remove('open');
    },
    render() {
        const list = document.getElementById('lb-list');
        if (!list) return;
        list.innerHTML = '';

        const rows = Storage.getLeaderboard().filter(r => r.score > 0);
        if (rows.length === 0) {
            list.innerHTML = '<p style="font-size:0.7em;color:#aaa;text-align:center;padding:30px 10px">¡Aún no hay puntajes locales!<br><br>Juega una partida y aparece aquí.</p>';
            return;
        }

        const medals = ['🥇', '🥈', '🥉'];
        rows.slice(0, 20).forEach((r, i) => {
            const row = document.createElement('div');
            row.className = 'lb-row' + (i === 0 ? ' rank-1' : '');

            const rank = document.createElement('span');
            rank.className = 'lb-rank';
            rank.textContent = medals[i] || `#${i + 1}`;
            row.appendChild(rank);

            const name = document.createElement('span');
            name.className = 'lb-name';
            if (i === 0) {
                name.classList.add('top1-aura');
                const crownHtml = document.createElement('span');
                crownHtml.innerHTML = (window.HWIcon ? window.HWIcon('leaderboard') : '👑') + ' ';
                crownHtml.style.cssText = 'font-size:1.3em; margin-right:4px;';
                name.appendChild(crownHtml);
            }
            if (r.banner) {
                const b = getBanner(r.banner);
                if (b) row.classList.add(b.css);
            }
            name.appendChild(document.createTextNode(r.name));
            row.appendChild(name);

            const score = document.createElement('span');
            score.className = 'lb-score';
            score.textContent = r.score + ' pts';
            if (i === 0) score.style.cssText = 'color:#ffd700; font-size:1.1em; font-weight:bold;';
            row.appendChild(score);

            list.appendChild(row);
        });
    },
    renderTop3() {
        const el = document.getElementById('top3-list');
        if (!el) return;
        const rows = Storage.getLeaderboard().filter(r => r.score > 0).slice(0, 3);
        if (rows.length === 0) { el.innerHTML = '<p style="color:#888;font-size:0.6em;">Sin puntajes aún</p>'; return; }
        const medals = ['🥇', '🥈', '🥉'];
        el.innerHTML = rows.map((r, i) => {
            const b = r.banner ? getBanner(r.banner) : null;
            const cls = b ? b.css : '';
            const top = i === 0 ? 'top1-aura' : '';
            return `<div style="font-size:0.6em;margin:4px 0">${medals[i]} <span class="${cls} ${top}">${r.name}</span> <span style="color:#ffcc00">${r.score}</span></div>`;
        }).join('');
    }
};

window.shopSwitchTab = function (tab) {
    var secBanners = document.getElementById('shop-section-banners');
    var secRunas = document.getElementById('shop-section-runas');
    var tabBanners = document.getElementById('tab-banners');

    var submenuBanners = document.getElementById('submenu-banners');
    var submenuRunas = document.getElementById('submenu-runas');
    var tabRunas = document.getElementById('tab-runas');

    var shopPanel = document.querySelector('.shop-panel');

    if (tab === 'runas') {
        if (secBanners) secBanners.style.display = 'none';
        if (secRunas) secRunas.style.display = 'block';
        if (tabBanners) {
            tabBanners.classList.remove('active');
            tabBanners.innerHTML = (window.HWIcon ? window.HWIcon('rune') : '🔮') + ' RUNAS ▾';
        }
        if (tabRunas) tabRunas.classList.add('active');
        if (submenuBanners) submenuBanners.classList.remove('active');
        if (submenuRunas) submenuRunas.classList.add('active');
        if (shopPanel) shopPanel.classList.remove('theme-beach');
    } else {
        if (secRunas) secRunas.style.display = 'none';
        if (secBanners) secBanners.style.display = 'block';
        if (tabBanners) {
            tabBanners.classList.add('active');
            tabBanners.innerHTML = 'ESTANDARTES ▾';
        }
        if (tabRunas) tabRunas.classList.remove('active');
        if (submenuBanners) submenuBanners.classList.add('active');
        if (submenuRunas) submenuRunas.classList.remove('active');
        if (shopPanel) shopPanel.classList.add('theme-beach');
    }
};

document.addEventListener('DOMContentLoaded', () => {
    Shop.init();
    const shopBtn = document.getElementById('hud-shop-btn');
    if (shopBtn) {
        shopBtn.addEventListener('click', () => {
            shopSwitchTab('banners');
            Shop.open();
        });
    }

    const closeShop = document.getElementById('close-shop');
    if (closeShop) closeShop.addEventListener('click', () => Shop.close());

    const closeLB = document.getElementById('close-lb');
    if (closeLB) closeLB.addEventListener('click', () => LB.close());

    document.getElementById('shop-overlay')?.addEventListener('click', e => {
        if (e.target.id === 'shop-overlay') Shop.close();
    });
    document.getElementById('lb-overlay')?.addEventListener('click', e => {
        if (e.target.id === 'lb-overlay') LB.close();
    });

    const promoBtn = document.getElementById('promo-code-btn');
    if (promoBtn) {
        promoBtn.addEventListener('click', () => Shop.redeemCode());
    }
    const promoInput = document.getElementById('promo-code-input');
    if (promoInput) {
        promoInput.addEventListener('keypress', e => {
            if (e.key === 'Enter') Shop.redeemCode();
        });
    }

    var tabBannersBtn = document.getElementById('tab-banners');
    if (tabBannersBtn) {
        tabBannersBtn.addEventListener('click', function (e) {
            e.stopPropagation();
            var wrapper = this.parentNode;
            if (wrapper) {
                wrapper.classList.toggle('open');
            }
        });
    }

    document.addEventListener('click', function () {
        var wrapper = document.querySelector('.shop-tab-wrapper');
        if (wrapper) {
            wrapper.classList.remove('open');
        }
    });

    var returnMenuBtn = document.getElementById('return-menu-btn');
    if (returnMenuBtn) {
        returnMenuBtn.addEventListener('click', function () {
            setTimeout(function () {
                if (window.UI) {
                    UI.stopSound('background');
                    UI.playSound('lobby');
                    UI.playSound('lobby-seagulls');
                }
            }, 300);
        });
    }
});
