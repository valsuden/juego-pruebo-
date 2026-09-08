// =============================================================================
// STORAGE — Trials of Mastery
// =============================================================================

const Storage = {

    salt: (window.CONFIG && window.CONFIG.SECURITY_SALT_STORAGE) || "tom_secure_salt_2026_X",

    _hash(str) {
        let hash = 0;
        for (let i = 0; i < str.length; i++) {
            const char = str.charCodeAt(i);
            hash = ((hash << 5) - hash) + char;
            hash = hash & hash;
        }
        return Math.abs(hash).toString(36);
    },

    _getAll() {
        try {
            const raw       = localStorage.getItem('tom_users');
            const signature = localStorage.getItem('tom_users_sig');
            if (!raw) return {};

            const expectedSig = this._hash(raw + this.salt);
            if (signature !== expectedSig) {
                console.warn("⚠️ SEGURIDAD: Modificación no autorizada detectada en el almacenamiento local. Restableciendo datos.");

                if (typeof window.reportCheat === 'function') {
                    window.reportCheat({
                        cheatType:    'localstorage_tampering',
                        reason:       'tom_users signature mismatch — storage was modified externally',
                        alteredValue: raw ? raw.slice(0, 200) : 'null',
                        evidence:     'Expected sig: ' + expectedSig + ', Found: ' + (signature || 'none')
                    });
                }

                // CORRECCIÓN B-09: No borramos los datos para evitar pérdida catastrófica
                // si hay un bug en la carga del salt de configuración.
                return {};
            }

            try {
                return JSON.parse(raw);
            } catch (parseError) {
                console.warn("⚠️ Error al parsear tom_users.");
                return {};
            }
        } catch (e) { 
            console.warn("⚠️ Error en _getAll:", e);
            return {}; 
        }
    },

    _saveAll(data) {
        // Server-side caps enforced locally too
        for (const name in data) {
            if ((data[name].coins || 0) > 5000) {
                console.warn(`Anti-Cheat: Coins cap exceeded for ${name}. Capping.`);
                data[name].coins = 5000;
            }
            if ((data[name].highScore || 0) > 9999) {
                console.warn(`Anti-Cheat: Score cap exceeded for ${name}. Capping.`);
                data[name].highScore = 9999;
            }
            if (data[name].stats && (data[name].stats.maxStreak || 0) > 9999) {
                data[name].stats.maxStreak = 9999;
            }
        }

        try {
            const raw = JSON.stringify(data);
            localStorage.setItem('tom_users', raw);
            localStorage.setItem('tom_users_sig', this._hash(raw + this.salt));
        } catch (e) {
            console.warn("⚠️ Error al guardar datos en localStorage:", e);
        }
    },

    getUser(name) {
        const all = this._getAll();
        if (!all[name]) {
            all[name] = {
                coins:          0,
                highScore:      0,
                maxStreak:      0,
                equippedBanner: null,
                equippedRune:   null,
                ownedBanners:   [],
                ownedRunes:     [],
                runeQuantities: {},
                redeemedCodes:  [],
                wordFailCount:  {},
                difficultWords: {},
                cheatFlags:     [],
                settings:       { musicEnabled: true, vfxEnabled: true },
                stats:          { gamesPlayed: 0, wordsCorrect: 0, maxStreak: 0 },
                lastSaved:      0
            };
            this._saveAll(all);
        }
        return all[name];
    },

    saveUser(name, data) {
        const all = this._getAll();
        all[name] = data;
        this._saveAll(all);
    },

    getAllUsers() {
        return this._getAll();
    },

    getLeaderboard() {
        const users = this._getAll();
        return Object.entries(users)
            .filter(([name]) => name !== 'Guest')
            .map(([name, d]) => ({
                name,
                score:  d.highScore  || 0,
                streak: d.stats ? (d.stats.maxStreak || 0) : (d.maxStreak || 0),
                banner: d.equippedBanner || null
            }))
            .sort((a, b) => b.score - a.score);
    }
};
