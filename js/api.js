// =============================================================================
// API Y RED — Trials of Mastery
// =============================================================================
(function () {
    'use strict';

    // =========================================================================
    // 1. URL DEL SERVIDOR — Obtenida de CONFIG si está disponible
    // =========================================================================
    window.leaderboardAPI = (window.CONFIG && window.CONFIG.API_URL) || "https://script.google.com/macros/s/AKfycbw77UBbMpDOm939suu_AbseJ2jENBNtBJ8qPNUTQmcq8HsVlbJ-E6TXyU0jJ3Qo06M/exec";

    // =========================================================================
    // 2. CÓDIGOS PROMOCIONALES PREDETERMINADOS
    // =========================================================================
    const _defaultCodes = (typeof _getSecretCodes === 'function' ? _getSecretCodes() : []); // hashes now

    var _initCustomCodes = [];
    try {
        var raw = localStorage.getItem('tom_cc_data');
        if (raw) {
            try {
                _initCustomCodes = JSON.parse(atob(raw));
            } catch (e) {
                console.warn("⚠️ Datos corruptos en tom_cc_data. Reiniciando.");
                localStorage.removeItem('tom_cc_data');
                _initCustomCodes = [];
            }
        }
    } catch (e) {
        console.warn("⚠️ Error al leer tom_cc_data:", e);
        _initCustomCodes = [];
    }
    window.CODES_DATA = _defaultCodes.concat(_initCustomCodes);

    // =========================================================================
    // 3. ANTI-CHEAT: Generación de Hash de Firma
    // =========================================================================
    window.generateHash = function (name, score, streak) {
        if (score > 3000 || streak > 3000) {
            console.warn("Anti-Cheat: Valores inválidos detectados. El servidor rechazará este guardado.");
            return "CHEAT_DETECTED_INVALID_HASH_REJECTED";
        }
        var salt = (window.CONFIG && window.CONFIG.SECURITY_SALT_API) || "trialsofmastery2025";
        var str = name + score + streak + salt;
        var hash = 0;
        for (var i = 0; i < str.length; i++) {
            hash = ((hash << 5) - hash) + str.charCodeAt(i);
            hash |= 0;
        }
        return Math.abs(hash).toString(36);
    };

    // =========================================================================
    // 4. GUARDAR PUNTUACIÓN EN EL LEADERBOARD GLOBAL -> SYNC PROFILE
    // =========================================================================
    window.saveToLeaderboard = function (playerName, score) {
        if (typeof Users !== 'undefined' && Users.current && Users.data) {
            // Sincronizar todo el perfil en lugar de solo algunas variables
            Users.save();
        }
    };

    window.syncProfile = function (name, profileObj) {
        try {
            var rawName = name || 'Player';
            if (rawName === 'Guest') return;

            var profileStr = JSON.stringify(profileObj);
            var salt = (window.CONFIG && window.CONFIG.SECURITY_SALT_API) || "trialsofmastery2025";
            var str = rawName + salt;
            var hash = 0;
            for (var i = 0; i < str.length; i++) {
                hash = ((hash << 5) - hash) + str.charCodeAt(i);
                hash |= 0;
            }
            var finalHash = Math.abs(hash).toString(36);

            var formData = new URLSearchParams();
            formData.append('action', 'syncProfile');
            formData.append('name', rawName);
            formData.append('profile', profileStr);
            formData.append('hash', finalHash);

            fetch(window.leaderboardAPI, {
                method: 'POST',
                mode: 'no-cors',
                headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
                body: formData.toString()
            }).then(function () {
                localStorage.removeItem('pendingProfileSync');
                console.log('Leaderboard: perfil sincronizado vía fetch POST (no-cors)');
            }).catch(function (e) {
                console.error('Error de red al sincronizar:', e);
                _saveProfilePending(rawName, profileObj);
            });

        } catch (e) {
            console.error('Error al sincronizar perfil:', e);
            _saveProfilePending(name, profileObj);
        }
    };

    window.saveMatchRecord = function (params) {
        try {
            var salt = (window.CONFIG && window.CONFIG.SECURITY_SALT_API) || "trialsofmastery2025";
            var validationStr = (params.player || '') + (params.matchStatus || '') + (params.score || 0) + (params.streak || 0) + salt;
            var hash = 0;
            for (var i = 0; i < validationStr.length; i++) {
                hash = ((hash << 5) - hash) + validationStr.charCodeAt(i);
                hash |= 0;
            }
            var finalHash = Math.abs(hash).toString(36);

            var formData = new URLSearchParams();
            formData.append('action', 'saveMatch');
            formData.append('player', params.player || 'Player');
            formData.append('grade', params.grade || '');
            formData.append('matchStatus', params.matchStatus || 'completed');
            formData.append('duration', params.duration || '0');
            formData.append('score', params.score || 0);
            formData.append('streak', params.streak || 0);
            formData.append('coins', params.coins || 0);
            formData.append('device', params.device || '');
            formData.append('browser', params.browser || '');
            formData.append('gameVersion', params.gameVersion || '');
            formData.append('hash', finalHash);

            var apiUrl = (window.CONFIG && window.CONFIG.API_URL) || window.leaderboardAPI;

            fetch(apiUrl, {
                method: 'POST',
                mode: 'no-cors',
                headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
                body: formData.toString()
            }).then(function () {
                console.log('☁️ Partida registrada en el historial.');
            }).catch(function (e) {
                console.error('Error al registrar partida:', e);
            });
        } catch (e) {
            console.error('Error al preparar registro de partida:', e);
        }
    };

    function _saveProfilePending(name, profileObj) {
        try {
            localStorage.setItem('pendingProfileSync', JSON.stringify({ name: name, profile: profileObj }));
        } catch (e) {
            console.warn("⚠️ No se pudo guardar pendingProfileSync:", e);
        }
        console.warn('Leaderboard: sincronización pendiente para el próximo intento.');
    }

    // =========================================================================
    // 5. REINTENTAR GUARDADO PENDIENTE
    // =========================================================================
    window.retrySendPending = function () {
        var pending = localStorage.getItem('pendingProfileSync');
        if (!pending) return;
        try {
            var data = JSON.parse(pending);
            window.syncProfile(data.name, data.profile);
        } catch (e) {
            console.error('Error en reintento:', e);
            localStorage.removeItem('pendingProfileSync');
        }
    };

    // =========================================================================
    // 6. MOSTRAR LEADERBOARD GLOBAL (JSONP)
    // =========================================================================
    window.showLeaderboard = function () {
        var list = document.getElementById('leaderboard-list');
        if (!list) return;
        list.innerHTML = '<p>Cargando puntajes...</p>';

        var oldScript = document.getElementById('leaderboard-jsonp-script');
        if (oldScript) oldScript.remove();

        var script = document.createElement('script');
        script.id = 'leaderboard-jsonp-script';
        script.src = window.leaderboardAPI + '?action=getLeaderboard&callback=handleLeaderboardData&t=' + Date.now();
        script.onerror = function () {
            list.innerHTML = '<p style="color:#ff3333;">Error de conexión (Posible 403).<br>Verifica que publicaste el Google Apps Script con acceso a "Anyone" (Cualquier persona).</p>';
            window.openLeaderboardModal();
        };
        document.body.appendChild(script);

        setTimeout(function () {
            if (list.innerHTML.includes('Cargando')) {
                list.innerHTML = '<p>Tiempo de espera agotado.</p>';
                window.openLeaderboardModal();
            }
        }, 8000);
    };

    window.handleLeaderboardData = function (data) {
        var list = document.getElementById('leaderboard-list');
        try {
            if (data && data.success && data.data && Array.isArray(data.data.leaderboard)) {
                data = data.data.leaderboard;
            }
            if (data && data.error) {
                var errMsg = _escapeHtml(data.error);
                var isNoSheet = data.error.toLowerCase().includes('no sheet') ||
                    data.error.toLowerCase().includes('sheet') ||
                    data.error.toLowerCase().includes('cannot read');
                var extraHint = isNoSheet
                    ? '<br><span style="color:#ff9900;">⚠️ El admin debe ejecutar <b>setupSheets()</b> en Google Apps Script para crear las hojas.</span>'
                    : '';
                list.innerHTML = '<p style="color:#ffcc00;">⚠️ Error del servidor: "' + errMsg + '".' + extraHint + '</p>';
                if (isNoSheet) {
                    setTimeout(function () {
                        if (list.innerHTML.includes('setupSheets')) {
                            list.innerHTML = '<p style="color:#aaffaa;">🔄 Reintentando conexión...</p>';
                            window.showLeaderboard();
                        }
                    }, 5000);
                }
                window.openLeaderboardModal();
                return;
            }
            if (!Array.isArray(data) || data.length === 0) {
                list.innerHTML = '<p>¡No hay puntajes aún. Sé el primero!</p>';
                window.openLeaderboardModal();
                return;
            }

            var uniquePlayers = {};
            data.forEach(function (entry) {
                if (!entry || !entry.name) return;
                // Normalise key to lowercase for dedup but keep original entry for display
                var nKey = String(entry.name).trim().toLowerCase();
                var s = Number(entry.score) || 0;
                if (!uniquePlayers[nKey] || s > (Number(uniquePlayers[nKey].score) || 0)) {
                    uniquePlayers[nKey] = entry;
                }
            });
            var uniqueData = Object.values(uniquePlayers);
            uniqueData.sort(function (a, b) { return Number(b.score) - Number(a.score); });
            var top20 = uniqueData.slice(0, 20);
            var medals = ['🥇', '🥈', '🥉'];

            var html = top20.map(function (r, i) {
                var isTop1 = i === 0;
                var medal = medals[i] || '';
                var localU = typeof Storage !== 'undefined' ? Storage.getUser(r.name) : null;
                var bannerId = r.banner || (localU ? localU.equippedBanner : null);
                var bannerCss = '';
                if (bannerId && typeof getBanner !== 'undefined') {
                    var b = getBanner(bannerId);
                    if (b) bannerCss = b.css;
                }

                var rowClass = isTop1 ? 'lb-global-row top1-row' : 'lb-global-row';
                var nameClass = 'lb-global-name';
                if (isTop1 && !bannerCss) nameClass += ' lb-king-name';
                if (bannerCss) {
                    rowClass += ' ' + bannerCss;
                    if (isTop1) rowClass += ' top1-has-banner';
                }
                var crownHtml = isTop1 ? '<span class="top1-crown">👑</span>' : '';
                var scoreStyle = isTop1 ? 'color:#ffd700;font-size:1.1em;font-weight:bold;' : '';
                return '<div class="' + rowClass + '">' +
                    '<span class="lb-global-medal">' + medal + '</span>' +
                    '<span class="lb-global-num">' + (i + 1) + '.</span>' +
                    '<span class="' + nameClass + '">' + crownHtml + _escapeHtml(r.name) + '</span>' +
                    '<span class="lb-global-score" style="' + scoreStyle + '">' + _escapeHtml(String(r.score)) + ' pts</span>' +
                    '<span class="lb-global-streak">🔥' + _escapeHtml(String(r.streak || 0)) + '</span>' +
                    '</div>';
            }).join('');

            var totalPlayers = uniqueData.length;
            var footer = totalPlayers > 20
                ? '<p style="margin-top:15px;color:#00ff4c;font-size:0.6em;">Mostrando top 20 de ' + totalPlayers + ' jugadores</p>'
                : '';
            list.innerHTML = html + footer;
            window.openLeaderboardModal();
        } catch (e) {
            console.error('Error mostrando leaderboard:', e);
            list.innerHTML = '<p>Error mostrando puntajes.</p>';
            window.openLeaderboardModal();
        }
    };

    // =========================================================================
    // 7. TOP 3 EN VIVO DURANTE EL JUEGO
    // =========================================================================
    var _top3Interval = null;

    window.loadTop3Display = function () {
        var top3List = document.getElementById('top3-list');
        if (!top3List) return;
        top3List.innerHTML = '<p style="color:#00ff4c;">Cargando...</p>';

        window.top3Callback = function (data) {
            try {
                if (data && data.error) {
                    top3List.innerHTML = '<p style="color:#ffcc00;">Error: ' + _escapeHtml(data.error) + '</p>';
                    return;
                }
                var leaderData = (data && data.data && Array.isArray(data.data.leaderboard)) ? data.data.leaderboard
                               : (Array.isArray(data) ? data : []);
                if (leaderData.length === 0) {
                    top3List.innerHTML = '<p style="color:#ffffff;">¡Sé el primero en jugar!</p>';
                    return;
                }
                window.globalLeaderboard = leaderData;
                leaderData.sort(function (a, b) { return Number(b.score) - Number(a.score); });
                var top3 = leaderData.slice(0, 3);
                var medals = ['🥇', '🥈', '🥉'];
                top3List.innerHTML = top3.map(function (player, i) {
                    return '<p style="color:#ffffff;margin:5px 0;">' +
                        medals[i] + ' ' + _escapeHtml(player.name) +
                        ': <span style="color:#ffcc00;">' + player.score + '</span></p>';
                }).join('') || '<p style="color:#ffffff;">¡Sin puntajes aún!</p>';
            } catch (e) {
                top3List.innerHTML = '<p style="color:#ff3333;">Error cargando</p>';
            }
            const oldScript = document.getElementById('top3-jsonp-script');
            if (oldScript) oldScript.remove();
        };

        var oldScript = document.getElementById('top3-jsonp-script');
        if (oldScript) oldScript.remove();

        var script = document.createElement('script');
        script.id = 'top3-jsonp-script';
        // CORRECCIÓN B-21: Agregar action=getLeaderboard
        script.src = window.leaderboardAPI + '?action=getLeaderboard&callback=top3Callback&t=' + Date.now();
        document.body.appendChild(script);
    };

    window.startTop3Updates = function () {
        window.loadTop3Display();
        if (_top3Interval) clearInterval(_top3Interval);
        _top3Interval = setInterval(function () { window.loadTop3Display(); }, 30000);
    };

    window.stopTop3Updates = function () {
        if (_top3Interval) { clearInterval(_top3Interval); _top3Interval = null; }
    };

    // =========================================================================
    // 8. MODAL DE LEADERBOARD GLOBAL
    // =========================================================================
    window.openLeaderboardModal = function () {
        var backdrop = document.getElementById('leaderboard-modal-backdrop');
        if (!backdrop) return;
        backdrop.style.display = 'flex';
        backdrop.setAttribute('aria-hidden', 'false');
        _playModalSound();
    };

    window.closeLeaderboardModal = function () {
        var backdrop = document.getElementById('leaderboard-modal-backdrop');
        if (!backdrop) return;
        backdrop.style.display = 'none';
        backdrop.setAttribute('aria-hidden', 'true');
    };

    function _playModalSound() {
        try {
            var audio = new Audio('https://freesound.org/data/previews/522/522375_11682929-lq.mp3');
            audio.volume = 0.3;
            audio.play().catch(function () { });
        } catch (e) { }
    }

    // =========================================================================
    // 9. DESCARGAR CSV DEL LEADERBOARD
    // =========================================================================
    window.downloadLeaderboardCSV = function () {
        if (typeof Storage === 'undefined') return;
        var rows = Storage.getLeaderboard();
        if (!rows || rows.length === 0) { alert('No hay puntajes locales para exportar.'); return; }
        var csv = 'Pos,Nombre,Puntaje\n';
        rows.forEach(function (r, i) {
            csv += (i + 1) + ',' + r.name.replace(/,/g, '') + ',' + r.score + '\n';
        });
        var blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
        var url = URL.createObjectURL(blob);
        var a = document.createElement('a');
        a.href = url;
        a.download = 'leaderboard_arcane.csv';
        a.click();
        URL.revokeObjectURL(url);
    };

    // =========================================================================
    // 10. CÓDIGOS ONLINE (JSONP) - REMOVIDO (Manejado por TOMApi)
    // =========================================================================

    function _clientDeepMerge(local, online, onlineIsNewer) {
        var result = {};
        var allKeys = Object.keys(Object.assign({}, local, online));

        allKeys.forEach(function (key) {
            var lv = local[key];
            var ov = online[key];

            if (key === 'settings') {
                result[key] = Object.assign({}, ov || {}, lv || {});
            } else if (key === 'lastSaved') {
                result[key] = Math.max(parseInt(lv) || 0, parseInt(ov) || 0);
            } else if (key === 'cheatFlags') {
                var merged = (lv || []).concat(ov || []);
                var seen = {};
                result[key] = merged.filter(function (cf) {
                    var k = cf.id || (cf.type + (cf.time || cf.date || ''));
                    if (seen[k]) return false;
                    seen[k] = true;
                    return true;
                });
            } else if (key === 'highScore' || key === 'maxStreak') {
                // Records are ALWAYS the maximum — they never regress regardless of timestamp
                result[key] = Math.max(parseInt(lv) || 0, parseInt(ov) || 0);
            } else if (key === 'coins') {
                // Coins = current economic state → most-recent timestamp wins
                if (onlineIsNewer) {
                    result[key] = (ov !== undefined && ov !== null) ? Math.max(0, parseInt(ov)) : Math.max(0, parseInt(lv) || 0);
                } else {
                    result[key] = (lv !== undefined && lv !== null) ? Math.max(0, parseInt(lv)) : Math.max(0, parseInt(ov) || 0);
                }
            } else if (key === 'runeQuantities') {
                // When online is newer (server applied rune cost) trust the server
                if (onlineIsNewer) {
                    result[key] = ov || {};
                } else {
                    var rq = Object.assign({}, lv || {});
                    var oq = ov || {};
                    Object.keys(oq).forEach(function (rid) {
                        // Never give MORE runes than the server says
                        rq[rid] = Math.min(
                            parseInt(rq[rid]) || 0,
                            parseInt(oq[rid]) || 0
                        );
                        if (rq[rid] <= 0) delete rq[rid];
                    });
                    result[key] = rq;
                }
            } else if (key === 'stats' && typeof ov === 'object' && ov !== null) {
                result[key] = _clientDeepMerge(lv || {}, ov, onlineIsNewer);
            } else if (Array.isArray(ov) || Array.isArray(lv)) {
                var arr = (lv || []).concat(ov || []);
                result[key] = arr.filter(function (v, i, a) { return a.indexOf(v) === i; });
            } else if (typeof ov === 'object' && ov !== null && typeof lv === 'object' && lv !== null) {
                result[key] = _clientDeepMerge(lv, ov, onlineIsNewer);
            } else {
                result[key] = (lv !== undefined && lv !== null) ? lv : ov;
            }
        });

        return result;
    }

    window.syncProfileCallback = function (res) {
        if (!res || !res.success) return;
        var data = (res.data && res.data.profile) ? res.data : res;
        if (!data.profile || data.profile === '{}') return;
        try {
            var onlineData = JSON.parse(data.profile);
            var name = data.name;
            if (typeof Users === 'undefined' || Users.current !== name || !Users.data) return;

            var changed = false;

            // ---- Reinicio de temporada ----
            var cloudStamp = onlineData.seasonStamp || '';
            var localStamp = Users.data.seasonStamp || '';
            if (cloudStamp && cloudStamp !== localStamp) {
                Users.data.coins = 0;
                Users.data.ownedRunes = [];
                Users.data.runeQuantities = {};
                Users.data.equippedRune = null;
                Users.data.ownedBanners = [];
                Users.data.equippedBanner = null;
                Users.data.guardianUntil = 0;
                Users.data.dailyCoinsEarned = 0;
                Users.data.seasonStamp = cloudStamp;
                changed = true;
                if (typeof toast === 'function') {
                    toast('🏁 Nueva temporada: monedas, runas y banners reiniciados.', 'info');
                }
            }

            // ---- Records (lo único que se toma de la nube) ----
            var cloudScore = Math.max(0, parseInt(onlineData.highScore) || 0);
            var cloudStreak = Math.max(0, parseInt(onlineData.maxStreak) || 0);

            if (cloudScore !== (parseInt(Users.data.highScore) || 0)) {
                Users.data.highScore = cloudScore;
                changed = true;
            }
            if (cloudStreak !== (parseInt(Users.data.maxStreak) || 0)) {
                Users.data.maxStreak = cloudStreak;
                changed = true;
            }

            // La copia interna de la racha también debe seguir a la nube,
            // si no, una racha vieja reaparece en el leaderboard tras el reinicio
            if (!Users.data.stats) Users.data.stats = {};
            if ((parseInt(Users.data.stats.maxStreak) || 0) !== cloudStreak) {
                Users.data.stats.maxStreak = cloudStreak;
                changed = true;
            }

            if (changed) {
                if (typeof Users.save === 'function') Users.save();
                if (typeof Users.updateUI === 'function') Users.updateUI();
            }
        } catch (e) { console.error('Error al leer el perfil de la nube:', e); }
    };

    window.fetchProfileFromCloud = function (name) {
        if (!name || name === 'Guest' || !window.leaderboardAPI) return;
        var cbName = 'syncProfileCallback';
        var s = document.createElement('script');
        s.src = window.leaderboardAPI +
            '?action=getProfile&name=' + encodeURIComponent(name) +
            '&callback=' + cbName + '&t=' + Date.now();
        document.body.appendChild(s);
    };

    // =========================================================================
    // 12. SISTEMA DE ADMINISTRADOR (protegido por contraseña)
    // =========================================================================
    var _adminUnlocked = false;
    var _adminLocked = true;

    function _adminDenied(type) {
        console.log('%c ¿ERES IDIOTA? ', 'background:#ff0000;color:#fff;font-size:16px;font-family:monospace;padding:4px 10px;border-radius:3px;');

        type = type || 'desconocido';

        if (typeof window.reportCheat === 'function') {
            window.reportCheat({
                cheatType: 'console_tampering',
                reason: 'Unauthorized access attempt via browser console: ' + type,
                alteredValue: type,
                evidence: 'Admin-locked property accessed without valid password'
            });
        }
    }
    function _adminOk(msg) {
        console.log('%c ✓ ' + msg, 'background:#003300;color:#00ff4c;font-size:13px;font-family:monospace;padding:3px 8px;border-radius:3px;');
    }

    async function _sha256(message) {
        if (typeof crypto !== 'undefined' && crypto.subtle) {
            const msgBuffer = new TextEncoder().encode(message);
            const hashBuffer = await crypto.subtle.digest('SHA-256', msgBuffer);
            const hashArray = Array.from(new Uint8Array(hashBuffer));
            return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
        } else {
            var hash = 5381;
            for (var i = 0; i < message.length; i++) {
                hash = ((hash << 5) + hash) + message.charCodeAt(i);
            }
            var hex = (hash >>> 0).toString(16);
            if (hex === "6c766fab") {
                return "92115aa11c4ebbd8547544c0d18015d06f5787e79e89936805cb110403725f7e";
            }
            return "unsupported";
        }
    }

    window.adminLogin = async function (password) {
        if (!password) {
            _adminUnlocked = false;
            _adminLocked = true;
            _adminDenied('admin login');
            return;
        }
        try {
            const enteredHash = await _sha256(password);
            const targetHash = (window.CONFIG && window.CONFIG.ADMIN_PASSWORD_HASH) || "92115aa11c4ebbd8547544c0d18015d06f5787e79e89936805cb110403725f7e";
            if (enteredHash === targetHash) {
                _adminUnlocked = true;
                _adminLocked = false;
                _adminOk('Modo Admin desbloqueado. Comandos disponibles: score, coins, saveLeader, modLeader, addCode, addnota');
            } else {
                _adminUnlocked = false;
                _adminLocked = true;
                _adminDenied('admin login');
            }
        } catch (e) {
            console.error("Error en adminLogin:", e);
            _adminUnlocked = false;
            _adminLocked = true;
            _adminDenied('admin login');
        }
    };

    function _addCodeFunc(codeName) {
        if (_adminLocked) { _adminDenied('codes'); return; }
        if (!codeName || typeof codeName !== 'string' || !codeName.trim()) {
            console.error("❌ Código inválido."); return;
        }
        var name = codeName.trim().toUpperCase();
        var daysInput = prompt("🔑 [ADMIN] DÍAS de validez (0 = configurar por horas):");
        if (daysInput === null) { console.log("❌ Cancelado."); return; }
        var days = parseInt(daysInput.trim());
        if (isNaN(days) || days < 0) { alert("❌ Días inválido."); return; }

        var expiresAt = "";
        if (days === 0) {
            var hoursInput = prompt("🕒 [ADMIN] HORAS de validez:");
            if (hoursInput === null) { console.log("❌ Cancelado."); return; }
            var hours = parseInt(hoursInput.trim());
            if (isNaN(hours) || hours <= 0) { alert("❌ Horas inválidas."); return; }
            var dt = new Date(Date.now() + hours * 3600 * 1000);
            expiresAt = dt.toISOString();
        } else {
            var dt2 = new Date(Date.now() + days * 24 * 3600 * 1000);
            expiresAt = dt2.toISOString();
        }

        var maxUsesInput = prompt("👥 [ADMIN] Límite de usos totales (0 = ilimitado):", "0");
        if (maxUsesInput === null) { console.log("❌ Cancelado."); return; }
        var maxUses = parseInt(maxUsesInput.trim()) || 0;

        var coinsInput = prompt("[COINS] [ADMIN] Arcane Coins de recompensa:");
        if (coinsInput === null) { console.log("❌ Cancelado."); return; }
        var coins = parseInt(coinsInput.trim()) || 0;

        var runeIdInput = prompt("[RUNE] [ADMIN] ID de la RUNA de recompensa (deja vacío si no tiene):");
        if (runeIdInput === null) { console.log("❌ Cancelado."); return; }
        var runeId = runeIdInput.trim() || "";
        
        var expInput = prompt("⚡ [ADMIN] EXP de recompensa (0 si no tiene):", "0");
        if (expInput === null) { console.log("❌ Cancelado."); return; }
        var expReward = parseInt(expInput.trim()) || 0;
        
        var energyInput = prompt("🔋 [ADMIN] Energía de recompensa (0 si no tiene):", "0");
        if (energyInput === null) { console.log("❌ Cancelado."); return; }
        var energyReward = parseInt(energyInput.trim()) || 0;

        var rewardsObj = {};
        if (coins > 0) rewardsObj.coins = coins;
        if (runeId) rewardsObj.runeId = runeId;
        if (expReward > 0) rewardsObj.exp = expReward;
        if (energyReward > 0) rewardsObj.energy = energyReward;

        var addCbName = 'addCodeCb_' + Math.round(Math.random() * 999999);
        var addScript = document.createElement('script');
        addScript.id = addCbName;
        
        var codesUrl = (window.CONFIG && window.CONFIG.CODES_API_URL) ? window.CONFIG.CODES_API_URL : null;
        if (!codesUrl) {
             console.error('❌ ERROR: API DE CÓDIGOS NO CONFIGURADA.');
             alert('❌ ERROR: API DE CÓDIGOS NO CONFIGURADA.');
             return;
        }

        addScript.src = codesUrl + '?action=addCode&token=trial2026&code=' + encodeURIComponent(name) + '&rewards=' + encodeURIComponent(JSON.stringify(rewardsObj)) + '&expiresAt=' + encodeURIComponent(expiresAt) + '&maxUses=' + maxUses + '&callback=' + addCbName + '&t=' + Date.now();
        window[addCbName] = function (resp) {
            delete window[addCbName];
            var el = document.getElementById(addCbName);
            if (el) el.remove();
            if (resp && resp.success) {
                console.log('☁️ Código ' + name + ' creado en el servidor global.');
                alert('✅ Código ' + name + ' creado con éxito.');
            } else {
                console.warn('⚠️ Error creando código:', resp ? resp.error : 'sin respuesta');
                alert('❌ Error: ' + (resp ? resp.error : 'Error de red'));
            }
        };
        document.body.appendChild(addScript);
        _adminOk('Código "' + name + '" creado. 🎁 ' + coins + ' coins | 📅 ' + expiresAt);
    }


    Object.defineProperty(window, 'score', {
        get: function () {
            var el = document.getElementById('score');
            return el ? parseInt(el.textContent) || 0 : 0;
        },
        set: function (v) {
            if (_adminLocked) { _adminDenied('puntos'); return; }
            var n = parseInt(v);
            if (isNaN(n)) { _adminDenied('puntos'); return; }
            var el = document.getElementById('score');
            if (el) el.textContent = n;
            try { window._gameScore = n; } catch (e) { }
            if (typeof Users !== 'undefined' && Users.data) Users.updateHighScore(n);
            _adminOk('score → ' + n);
        },
        configurable: false, enumerable: false
    });

    Object.defineProperty(window, 'saveLeader', {
        get: function () {
            if (_adminLocked) { _adminDenied('leaderboard'); return null; }
            var nameEl = document.getElementById('player-name-display');
            var scoreEl = document.getElementById('score');
            var name = (nameEl ? nameEl.textContent : null) || (typeof Users !== 'undefined' ? Users.current : 'Player') || 'Player';
            var s = parseInt(scoreEl ? scoreEl.textContent : 0) || 0;
            if (typeof Users !== 'undefined' && Users.data) {
                Users.updateHighScore(s);
                _adminOk('Leaderboard guardado — ' + name + ' → ' + s + ' pts');
            }
            return true;
        },
        configurable: false, enumerable: false
    });

    Object.defineProperty(window, 'addnota', {
        get: function () {
            if (_adminLocked) { _adminDenied('notas'); return "Acceso denegado."; }

            var modal = document.getElementById('admin-note-overlay');
            var innerModal = document.getElementById('admin-note-modal');
            if (modal && innerModal) {
                modal.style.display = 'flex';
                innerModal.style.display = 'flex';
                document.getElementById('admin-note-title').value = '';
                document.getElementById('admin-note-content').value = '';
                var anonBox = document.getElementById('btn-anon');
                if (anonBox) anonBox.checked = false;

                var btnCancelar = document.getElementById('btn-cancelar-nota');
                var btnGuardar = document.getElementById('btn-guardar-nota');

                btnCancelar.onclick = function () {
                    modal.style.display = 'none';
                    innerModal.style.display = 'none';
                };

                btnGuardar.onclick = function () {
                    var title = document.getElementById('admin-note-title').value.trim();
                    var content = document.getElementById('admin-note-content').value.trim();
                    var anonBox = document.getElementById('btn-anon');
                    var isAnon = anonBox && anonBox.checked;
                    var author = isAnon ? 'Anónimo' : ((typeof Users !== 'undefined' ? Users.current : 'Admin') || 'Admin');

                    if (!title || !content) {
                        alert("❌ Título y Contenido son obligatorios.");
                        return;
                    }

                    modal.style.display = 'none';
                    innerModal.style.display = 'none';
                    _adminOk('⏳ Guardando nota en la nube...');

                    var cbName = 'addNotaCb_' + Math.round(Math.random() * 999999);
                    var script = document.createElement('script');
                    script.id = cbName;
                    var apiUrl = window.CONFIG && window.CONFIG.NOTES_API_URL ? window.CONFIG.NOTES_API_URL : null;
                    if (!apiUrl) {
                        _adminOk('❌ ERROR: NOTES_API_URL no configurado.');
                        return;
                    }

                    script.src = apiUrl + '?action=addNote&token=trial2026' +
                        '&title=' + encodeURIComponent(title) +
                        '&content=' + encodeURIComponent(content) +
                        '&author=' + encodeURIComponent(author) +
                        '&callback=' + cbName + '&t=' + Date.now();

                    window[cbName] = function (resp) {
                        delete window[cbName];
                        var el = document.getElementById(cbName);
                        if (el) el.remove();
                        if (resp && resp.success) {
                            _adminOk('✅ ¡Nota guardada correctamente!');
                            if (typeof NotesSystem !== 'undefined') NotesSystem.cache = null;
                        } else {
                            _adminOk('❌ Error guardando nota: ' + (resp ? resp.error : ''));
                        }
                    };
                    script.onerror = function () {
                        delete window[cbName];
                        script.remove();
                        _adminOk('❌ Error de red al guardar nota.');
                    };
                    document.body.appendChild(script);
                };
            }
            return "[NOTAS] Abriendo editor de notas...";
        },
        configurable: false, enumerable: false
    });

    Object.defineProperty(window, 'coins', {
        get: function () {
            if (_adminLocked) { _adminDenied('monedas'); return null; }
            return typeof Users !== 'undefined' && Users.data ? Users.data.coins : null;
        },
        set: function (v) {
            if (_adminLocked) { _adminDenied('monedas'); return; }
            var str = String(v).trim();
            var parts = str.split(' ');
            var lastPart = parts[parts.length - 1];
            var amount, targetName;
            if (!isNaN(parseInt(lastPart))) {
                amount = parseInt(lastPart);
                targetName = parts.slice(0, -1).join(' ').trim() || null;
            } else {
                amount = parseInt(str); targetName = null;
            }
            if (isNaN(amount)) { _adminDenied('monedas'); return; }
            var name = targetName || (typeof Users !== 'undefined' ? Users.current : null) || 'Player';
            try {
                if (typeof Storage !== 'undefined' && typeof Storage.saveUser === 'function') {
                    var u = Storage.getUser(name);
                    u.coins = amount;
                    Storage.saveUser(name, u);
                } else {
                    console.error('B-23: Operación de administrador denegada porque Storage no está disponible (evita bypass de seguridad).');
                }
                if (typeof Users !== 'undefined' && Users.current === name) {
                    Users.data.coins = amount;
                    if (typeof Users._updateHUD === 'function') Users._updateHUD();
                    else if (typeof Users.updateUI === 'function') Users.updateUI();
                }
                _adminOk('coins → ' + name + ' : ' + amount);
            } catch (e) { console.error('Error coins:', e); }
        },
        configurable: false, enumerable: false
    });

    Object.defineProperty(window, 'modLeader', {
        get: function () { return _adminLocked ? (_adminDenied('puntos'), null) : 'ready'; },
        set: function (v) {
            if (_adminLocked) { _adminDenied('puntos'); return; }
            var str = String(v).trim();
            var parts = str.split(' ');
            var lastPart = parts[parts.length - 1];
            if (isNaN(parseInt(lastPart))) { _adminDenied('puntos'); return; }
            var amount = parseInt(lastPart);
            var name = parts.slice(0, -1).join(' ').trim();
            if (!name || isNaN(amount)) { _adminDenied('puntos'); return; }
            try {
                if (typeof Storage !== 'undefined' && typeof Storage.saveUser === 'function') {
                    var u = Storage.getUser(name);
                    u.highScore = amount;
                    Storage.saveUser(name, u);
                } else {
                    console.error('B-23: Operación de administrador denegada porque Storage no está disponible (evita bypass de seguridad).');
                }
                if (typeof Users !== 'undefined' && Users.current === name) {
                    Users.data.highScore = amount;
                    if (typeof Users.updateUI === 'function') Users.updateUI();
                }
                _adminOk('modLeader → ' + name + ' score set to ' + amount);
            } catch (e) { console.error('modLeader failed', e); }
        },
        configurable: false, enumerable: false
    });

    Object.defineProperty(window, 'addCode', {
        get: function () { return _adminLocked ? (_adminDenied('codes'), null) : _addCodeFunc; },
        set: function (v) { if (_adminLocked) { _adminDenied('codes'); return; } _addCodeFunc(v); },
        configurable: false, enumerable: false
    });

    // =========================================================================
    // 13. LISTENER DE LEADERBOARD Y RETRY AL INICIO
    // =========================================================================
    // NOTE: Leaderboard click listeners are registered in DOMContentLoaded below.
    // The delegated listener that was here was removed to prevent double-firing.

    document.addEventListener('DOMContentLoaded', function () {
        var viewStart = document.getElementById('view-leaderboard-start');
        var closeBtn = document.getElementById('close-leaderboard');
        var downloadBtn = document.getElementById('download-csv');
        var showBtn = document.getElementById('show-leaderboard-btn');

        if (viewStart) viewStart.addEventListener('click', function (e) { e.stopPropagation(); window.showLeaderboard(); });
        if (closeBtn) closeBtn.addEventListener('click', window.closeLeaderboardModal);
        if (downloadBtn) downloadBtn.addEventListener('click', window.downloadLeaderboardCSV);
        if (showBtn) showBtn.addEventListener('click', function (e) { e.stopPropagation(); window.showLeaderboard(); });

        var backdrop = document.getElementById('leaderboard-modal-backdrop');
        if (backdrop) {
            backdrop.addEventListener('click', function (e) { if (e.target === backdrop) window.closeLeaderboardModal(); });
        }

        var title = document.querySelector('h1');
        if (title) {
            title.style.cursor = 'pointer';
            title.addEventListener('dblclick', function () {
                var pass = prompt("🔑 [ADMIN] Enter password:");
                if (pass) window.adminLogin(pass);
            });
        }

        document.addEventListener('keydown', function (e) {
            if (e.ctrlKey && e.shiftKey && (e.key === 'A' || e.key === 'a')) {
                e.preventDefault();
                var pass = prompt("🔑 [ADMIN] Enter password:");
                if (pass) window.adminLogin(pass);
            }
        });

        setTimeout(window.retrySendPending, 3000);
    });

    function _escapeHtml(s) {
        if (!s) return '';
        return s.replace(/[&<>"]/g, function (c) {
            return ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]);
        });
    }
    window.escapeHtml = _escapeHtml;

    // =========================================================================
    // 14. SYNC ENGINE (Incremental Global Sync via TOMApi)
    // =========================================================================
    window.TOMApi = {
        globalSyncTimeMain: 0,
        globalSyncTimeCodes: 0,
        globalSyncTimeNotes: 0,
        isSyncing: false,
        syncInterval: null,

        init: function() {
            this.startSync();
        },

        startSync: function() {
            if (this.syncInterval) clearInterval(this.syncInterval);
            var interval = (window.CONFIG && window.CONFIG.SYNC_INTERVAL) || 30000;
            var self = this;
            this.syncInterval = setInterval(function() { self.sync(); }, interval);
            // Fetch everything on first load
            this.fetchCodes();
            this.fetchNotes();
            this.sync();
        },

        sync: function() {
            if (this.isSyncing) return;
            this.isSyncing = true;
            
            var playerName = (typeof Users !== 'undefined') ? Users.current : null;
            var self = this;
            
            // 1. Sync Main API
            var mainUrl = (window.CONFIG && window.CONFIG.API_URL) ? window.CONFIG.API_URL : window.leaderboardAPI;
            if (mainUrl) {
                this.jsonp(mainUrl, {
                    action: 'getState',
                    includeLeaderboard: 'true',
                    playerName: playerName && playerName !== 'Guest' ? playerName : ''
                }, function(data) {
                    if (data && data.success) {
                        self.globalSyncTimeMain = data.globalSyncTime || Date.now();
                        if (data.data.leaderboard) window.LEADERBOARD_DATA = data.data.leaderboard;
                        if (data.data.profile && typeof window.syncProfileCallback === 'function') {
                            window.syncProfileCallback({ success: true, profile: data.data.profile, name: playerName });
                        }
                    }
                });
            }

            // 2. Poll Codes API
            if (window.CONFIG && window.CONFIG.CODES_API_URL) {
                this.jsonp(window.CONFIG.CODES_API_URL, { action: 'getSyncTime' }, function(res) {
                    if (res && res.success && res.globalSyncTime > self.globalSyncTimeCodes) {
                        self.fetchCodes();
                    }
                });
            }

            // 3. Poll Notes API
            if (window.CONFIG && window.CONFIG.NOTES_API_URL) {
                this.jsonp(window.CONFIG.NOTES_API_URL, { action: 'getSyncTime' }, function(res) {
                    if (res && res.success && res.globalSyncTime > self.globalSyncTimeNotes) {
                        self.fetchNotes();
                    }
                });
            }
            
            setTimeout(function() { self.isSyncing = false; }, 3000);
        },

        fetchCodes: function(callback) {
            var url = window.CONFIG && window.CONFIG.CODES_API_URL ? window.CONFIG.CODES_API_URL : null;
            if (!url) return;
            var self = this;
            this.jsonp(url, { action: 'getCodes' }, function(data) {
                if (data && data.success) {
                    self.globalSyncTimeCodes = data.globalSyncTime || 0;
                    var baseCodes = typeof _getSecretCodes === 'function' ? _getSecretCodes() : [];
                    var onlineCodes = data.codes || [];
                    
                    var localCustom = [];
                    try {
                        var rawCC = localStorage.getItem('tom_cc_data');
                        if (rawCC) localCustom = JSON.parse(atob(rawCC));
                    } catch(e) {}
                    
                    var allCustom = localCustom.concat(onlineCodes);
                    var unique = [];
                    var seen = {};
                    for (var i = allCustom.length - 1; i >= 0; i--) {
                        var c = allCustom[i];
                        if (!seen[c.code]) { seen[c.code] = true; unique.unshift(c); }
                    }
                    window.CODES_DATA = baseCodes.concat(unique);
                    console.log("☁️ Códigos sincronizados.");
                    if (callback) callback(unique);
                }
            });
        },

        fetchNotes: function(callback) {
            var url = window.CONFIG && window.CONFIG.NOTES_API_URL ? window.CONFIG.NOTES_API_URL : null;
            if (!url) return;
            var self = this;
            this.jsonp(url, { action: 'getNotes' }, function(data) {
                if (data && data.success) {
                    self.globalSyncTimeNotes = data.globalSyncTime || 0;
                    if (typeof NotesSystem !== 'undefined') {
                        NotesSystem.cache = data.notes || [];
                        if (NotesSystem.isOpen && typeof NotesSystem.renderNotes === 'function') {
                            NotesSystem.renderNotes(NotesSystem.cache);
                        }
                    }
                    console.log("☁️ Notas sincronizadas.");
                    if (callback) callback(data.notes);
                }
            });
        },

        jsonp: function(url, params, callback) {
            var cbName = 'jsonpCb_' + Date.now() + Math.round(Math.random() * 999999);
            params.callback = cbName;
            params.t = Date.now();
            var qs = Object.keys(params).map(function(k) { return encodeURIComponent(k) + '=' + encodeURIComponent(params[k]); }).join('&');
            var script = document.createElement('script');
            script.id = cbName;
            script.src = url + '?' + qs;
            
            window[cbName] = function(data) {
                delete window[cbName];
                var el = document.getElementById(cbName);
                if (el) el.remove();
                if (callback) callback(data);
            };
            script.onerror = function() {
                delete window[cbName];
                var el = document.getElementById(cbName);
                if (el) el.remove();
                if (callback) callback({ success: false, error: 'Network error' });
            };
            document.body.appendChild(script);
        }
    };
    // =====================================================================
    // DÍAS JUGADOS EN LA TEMPORADA (solo del jugador seleccionado)
    // =====================================================================
    window.fetchPlayerDays = function (name) {
        if (!name) return;
        var panel = ensurePlayerDaysPanel();
        if (!panel) return;

        var cbName = 'playerDaysCb_' + Date.now();
        window[cbName] = function (res) {
            delete window[cbName];
            var el = document.getElementById(cbName);
            if (el) el.remove();
            var days = (res && res.data && Array.isArray(res.data.days)) ? res.data.days : [];
            renderPlayerDays(panel, days);
        };

        var script = document.createElement('script');
        script.id = cbName;
        script.src = window.leaderboardAPI + '?action=getPlayerDays&name=' + encodeURIComponent(name) +
                     '&callback=' + cbName + '&t=' + Date.now();
        script.onerror = function () {
            delete window[cbName];
            renderPlayerDays(panel, []);
        };
        document.body.appendChild(script);
    };

    function ensurePlayerDaysPanel() {
        var panel = document.getElementById('player-days-panel');
        if (panel) { panel.style.display = 'block'; return panel; }

        var card = document.getElementById('selected-user-card');
        if (!card || !card.parentNode) return null;

        panel = document.createElement('div');
        panel.id = 'player-days-panel';
        panel.style.cssText = 'margin-top:8px; padding:10px 12px; background:rgba(0,100,150,0.45);' +
            'border:2px solid #00ffcc; border-radius:8px; font-size:0.55em; text-align:left;' +
            'line-height:1.9; box-shadow:0 0 10px rgba(0,255,204,0.25); max-height:150px; overflow-y:auto;';
        panel.innerHTML = '<span style="color:#00ffcc;">Cargando tus días...</span>';
        card.parentNode.insertBefore(panel, card.nextSibling);
        return panel;
    }

    function renderPlayerDays(panel, days) {
        var head = '<span style="color:#ffffff; display:block; margin-bottom:6px;">' +
                   'DÍAS QUE HAS JUGADO ESTA TEMPORADA: ' +
                   '<span style="color:#ffd700;">' + days.length + '</span></span>';

        if (days.length === 0) {
            panel.innerHTML = head +
                '<span style="color:#8fd3ff;">Aún no has jugado. Tu primer día aparecerá aquí.</span>';
            return;
        }

        var rows = '';
        for (var i = days.length - 1; i >= 0; i--) {
            var d = days[i];
            rows += '<div style="display:flex; justify-content:space-between; gap:10px;">' +
                    '<span style="color:#00ff9d;">&#10003; ' + d.date + '</span>' +
                    '<span style="color:#fbd786;">&#127942; ' + (d.best || 0) + ' pts</span>' +
                    '</div>';
        }
        panel.innerHTML = head + rows;
    }
    document.addEventListener('DOMContentLoaded', function () {
        window.TOMApi.init();
    });

})();
