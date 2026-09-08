// =============================================================================
// STORAGE — Trials of Mastery
// =============================================================================

const Storage = {

    salt: (window.CONFIG && window.CONFIG.SECURITY_SALT_STORAGE) || "tom_secure_salt_2026_X",
    _cachedUsers: null,
    _saveTimer: null,
    _isPendingSave: false,

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
        if (this._cachedUsers) {
            return this._cachedUsers;
        }

        try {
            const raw       = localStorage.getItem('tom_users');
            const signature = localStorage.getItem('tom_users_sig');
            if (!raw) {
                this._cachedUsers = {};
                return this._cachedUsers;
            }

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

                this._cachedUsers = {};
                return this._cachedUsers;
            }

            try {
                this._cachedUsers = JSON.parse(raw);
                return this._cachedUsers;
            } catch (parseError) {
                console.warn("⚠️ Error al parsear tom_users.");
                this._cachedUsers = {};
                return this._cachedUsers;
            }
        } catch (e) { 
            console.warn("⚠️ Error en _getAll:", e);
            this._cachedUsers = {};
            return this._cachedUsers; 
        }
    },

    _flushPendingSave() {
        if (!this._isPendingSave || !this._cachedUsers) return;
        this._isPendingSave = false;
        if (this._saveTimer) {
            clearTimeout(this._saveTimer);
            this._saveTimer = null;
        }
        this._writeDirect(this._cachedUsers);
    },

    _writeDirect(data) {
        // Server-side caps enforced locally too
        for (const name in data) {
            if ((data[name].coins || 0) > 5000) {
                data[name].coins = 5000;
            }
            if ((data[name].highScore || 0) > 9999) {
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

    _saveAll(data, immediate = false) {
        this._cachedUsers = data;
        this._isPendingSave = true;

        if (immediate) {
            this._flushPendingSave();
            return;
        }

        // Debounce writes (150ms) to prevent UI micro-stutters during rapid operations
        if (this._saveTimer) clearTimeout(this._saveTimer);
        this._saveTimer = setTimeout(() => {
            this._flushPendingSave();
        }, 150);
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
            this._saveAll(all, true);
        }
        return all[name];
    },

    saveUser(name, data, immediate = false) {
        const all = this._getAll();
        all[name] = data;
        this._saveAll(all, immediate);
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

// Ensure zero data loss on tab close or navigation
window.addEventListener('beforeunload', () => Storage._flushPendingSave());
window.addEventListener('pagehide', () => Storage._flushPendingSave());

