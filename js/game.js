// =============================================================================
// GAME SYSTEM — Trials of Mastery
// =============================================================================
(function () {
    'use strict';

    window.Game = {
        // Core game state
        currentLevel: 0,
        playerName: 'Player',
        score: 0,
        levelScore: 0,
        timeLeft: 0,
        timerInterval: null,
        currentWord: '',
        selectedWords: [],
        wordIndex: 0,

        // Power-ups
        bonusTimeUsed: false,
        skipWordUsed: false,

        // Error & state management
        errorCount: 0,
        magicEnergy: 5,
        isRecovering: false,
        wordColors: {},
        usedWordsByLevel: {},
        sessionMistakeWords: new Set(),
        isFTFromGameOver: false,

        // Events
        eventActive: false,
        currentEvent: null,
        eventTimeLeft: 0,

        // Streaks
        currentStreak: 0,
        maxStreak: 0,
        streakLevels: [3, 5, 7, 10],

        // Recovery System
        recoveryWords: [],
        recoveryWordsCorrect: 0,
        currentRecoveryIndex: 0,

        // Focus Training
        ftWords: [],
        ftIndex: 0,

        // Settings
        musicEnabled: true,

        init() {
            window._gameData = {
                getScore: () => this.score,
                getPlayerName: () => this.playerName,
                getMaxStreak: () => this.maxStreak,
                getWordFailCount: () => this.wordFailCount
            };

            // Bind buttons
            const startBtn = document.getElementById('start-btn');
            if (startBtn) startBtn.addEventListener('click', () => this.startGame());

            const submitBtn = document.getElementById('submit-btn');
            if (submitBtn) submitBtn.addEventListener('click', () => this.checkAnswer());

            const nextLevelBtn = document.getElementById('next-level-btn');
            if (nextLevelBtn) nextLevelBtn.addEventListener('click', () => this.loadNextLevel());

            const answerInput = document.getElementById('answer');
            if (answerInput) {
                answerInput.addEventListener('keypress', (e) => {
                    if (e.key === 'Enter') this.checkAnswer();
                });
            }

            const tryAgainBtn = document.getElementById('try-again-btn');
            if (tryAgainBtn) tryAgainBtn.addEventListener('click', () => this.tryAgain());

            // Events for power-up buttons
            const bonusTimeBtn = document.getElementById('bonus-time-btn');
            if (bonusTimeBtn) bonusTimeBtn.addEventListener('click', () => this.addBonusTime());

            const skipWordBtn = document.getElementById('skip-word-btn');
            if (skipWordBtn) skipWordBtn.addEventListener('click', () => this.skipWord());

            const ftAnswerInput = document.getElementById('ft-answer');
            if (ftAnswerInput) {
                ftAnswerInput.addEventListener('keypress', (e) => {
                    if (e.key === 'Enter') {
                        const ftSubmitBtn = document.getElementById('ft-submit-btn');
                        if (ftSubmitBtn) ftSubmitBtn.click();
                    }
                });
            }
        },

        startGame() {
            // Hide the game image when starting the game
            const headerImage = document.getElementById('game-header-image');
            if (headerImage) headerImage.classList.add('hidden');

            // Ocultar el botón del leaderboard durante el juego
            const viewLB = document.getElementById('view-leaderboard-start');
            if (viewLB) viewLB.classList.add('hidden');

            // Pausa lobby music y arranca música del juego
            if (window.UI) {
                UI.stopSound('lobby');
                UI.stopSound('lobby-seagulls');
                // CORRECCIÓN B-14: Leer música desde el perfil de usuario (cloud) si es posible
                let savedMusicPref = null;
                if (typeof Users !== 'undefined' && Users.data && Users.data.settings) {
                    savedMusicPref = Users.data.settings.musicEnabled ? 'true' : 'false';
                } else {
                    savedMusicPref = localStorage.getItem('musicEnabled');
                }

                if (typeof window.applySettings === 'function') {
                    var _s = {};
                    if (typeof Users !== 'undefined' && Users.data && Users.data.settings) {
                        _s = Users.data.settings;
                    }
                    window.applySettings({
                        musicEnabled: savedMusicPref !== 'false',
                        vfxEnabled: _s.vfxEnabled !== undefined ? _s.vfxEnabled : true,
                        potatoEnabled: _s.potatoEnabled !== undefined ? _s.potatoEnabled : false
                    });
                }                
                setTimeout(() => {
                    UI.playSound('background');
                }, 500);
            }

            // Get player name
            const nameInput = document.getElementById('player-name-input');
            this.playerName = (nameInput && nameInput.value.trim()) || 'Player';

            const display = document.getElementById('player-name-display');
            if (display) display.textContent = this.playerName;

            if (typeof Users !== 'undefined' && Users._applyBannerToName) {
                Users._applyBannerToName();
            }

            this.currentLevel = 0;
            this.score = 0;
            if (window.UI) UI.updateScore(this.score);

            const setupSection = document.getElementById('player-setup');
            if (setupSection) setupSection.classList.add('hidden');

            const passMount = document.getElementById('hw-lobby-pass-mount');
            if (passMount) passMount.classList.add('hidden');
            const wheelMount = document.getElementById('hw-lobby-wheel-mount');
            if (wheelMount) wheelMount.classList.add('hidden');

            const top3Display = document.getElementById('top3-display');
            if (top3Display) top3Display.classList.add('hidden');

            const startBtn = document.getElementById('start-btn');
            if (startBtn) startBtn.classList.add('hidden');

            const gameContainer = document.getElementById('game');
            if (gameContainer) gameContainer.classList.remove('hidden');

            const completeContainer = document.getElementById('level-complete');
            if (completeContainer) completeContainer.classList.add('hidden');

            const gameOverContainer = document.getElementById('game-over');
            if (gameOverContainer) gameOverContainer.classList.add('hidden');

            // Reset power-ups
            this.resetPowerups();

            // Reset state
            if (typeof resetRuneState === 'function') resetRuneState();

            this.isPlaying = true;
            if (window.PerformanceManager) {
                window.PerformanceManager.setContext('Gameplay');
            }

            this.errorCount = 0;
            this.sessionMistakeWords = new Set();
            this.magicEnergy = 5;
            this.isRecovering = false;

            // CORRECCIÓN B-15: Cargar wordColors del perfil (sync en la nube)
            if (typeof Users !== 'undefined' && Users.data && Users.data.wordColors) {
                this.wordColors = Users.data.wordColors;
            } else {
                const savedColors = localStorage.getItem('wordColors');
                this.wordColors = savedColors ? JSON.parse(savedColors) : {};
            }

            this.eventActive = false;
            this.currentEvent = null;
            this.currentStreak = 0;
            this.maxStreak = 0;
            this.isPlaying = true;

            if (typeof window.startTop3Updates === 'function') {
                window.startTop3Updates();
            }

            const focusWords = this.getFocusWords().filter(w => !this.checkWordMastered(w));
            if (focusWords.length > 0) {
                this.showFocusTraining(false);
            } else {
                this.loadLevel();
            }
        },

        loadLevel() {
            const viewLB = document.getElementById('view-leaderboard-start');
            if (viewLB) viewLB.classList.add('hidden');

            this.levelScore = 0;
            this.wordIndex = 0;

            // Reset power-ups for each level
            this.resetPowerups();

            // Reset error count for each level
            this.errorCount = 0;

            if (typeof levels !== 'undefined' && levels[this.currentLevel]) {
                const level = levels[this.currentLevel];
                const levelTitle = document.getElementById('level-title');
                if (levelTitle) levelTitle.textContent = level.name;

                this.timeLeft = level.time;
                if (window.UI) {
                    UI.updateTimer(this.timeLeft, this.currentStreak >= 3);
                    UI.updateEnergyDisplay(this.magicEnergy);
                }

                this.selectWordsWithDifficulty();
                this.nextWord();
                this.startTimer();
            }
        },

        loadNextLevel() {
            this.currentLevel++;
            if (typeof levels !== 'undefined' && this.currentLevel < levels.length) {
                const completeContainer = document.getElementById('level-complete');
                if (completeContainer) completeContainer.classList.add('hidden');
                this.loadLevel();
            } else {
                // Game completed
                clearInterval(this.timerInterval);
                this.isPlaying = false;
                if (window.PerformanceManager) {
                    window.PerformanceManager.setContext('Lobby');
                }
                if (typeof Users !== 'undefined' && Users.current && Users.data) {
                    Users.updateHighScore(this.score);
                    Users.data.maxStreak = Math.max(Users.data.maxStreak || 0, this.maxStreak);
                    if (!Users.data.stats) Users.data.stats = {};
                    Users.data.stats.gamesPlayed = (Users.data.stats.gamesPlayed || 0) + 1;
                    Users.data.stats.maxStreak = Users.data.maxStreak;
                }
                this.showEpicVictoryScreen();

                const completeContainer = document.getElementById('level-complete');
                if (completeContainer) completeContainer.classList.add('hidden');

                const gameContainer = document.getElementById('game');
                if (gameContainer) gameContainer.classList.add('hidden');

                const setupSection = document.getElementById('player-setup');
                if (setupSection) setupSection.classList.remove('hidden');

                const passMount = document.getElementById('hw-lobby-pass-mount');
                if (passMount) passMount.classList.remove('hidden');
                const wheelMount = document.getElementById('hw-lobby-wheel-mount');
                if (wheelMount) wheelMount.classList.remove('hidden');

                const top3Display = document.getElementById('top3-display');
                if (top3Display) top3Display.classList.remove('hidden');

                const startBtn = document.getElementById('start-btn');
                if (startBtn) startBtn.classList.remove('hidden');

                const viewLB = document.getElementById('view-leaderboard-start');
                if (viewLB) viewLB.classList.remove('hidden');

                const headerImage = document.getElementById('game-header-image');
                if (headerImage) headerImage.classList.remove('hidden');

                if (window.UI) {
                    UI.stopSound('background');
                }
            }
        },

        startTimer() {
            clearInterval(this.timerInterval);
            this.timerInterval = setInterval(() => {
                if (window.RuneState && RuneState.timeLockedUntil && RuneState.timeLockedUntil > Date.now()) {
                    // Time is locked
                } else {
                    this.timeLeft--;
                }

                if (window.UI) {
                    UI.updateTimer(this.timeLeft, this.currentStreak >= 3);
                }
                if (this.timeLeft <= 0) {
                    this.gameOver();
                }
            }, 1000);
        },

        nextWord() {
            if (!Array.isArray(this.pendingWords)) this.pendingWords = this.selectedWords.slice();

            if (this.pendingWords.length === 0) {
                this.levelComplete();
                return;
            }

            this.currentWord = this.pendingWords.shift();

            if (window.UI) {
                UI.showWord(this.currentWord);
                UI.updateWordCounter(this.wordIndex, this.selectedWords.length);
            }

            const ans = document.getElementById('answer');
            if (ans) ans.value = '';
        },

        checkAnswer() {
            const ansInput = document.getElementById('answer');
            const userAnswer = (ansInput && ansInput.value.trim().toLowerCase()) || '';

            // Seleccionar el mapeo adecuado según modo de recuperación
            const currentWordsMapping = (typeof levels !== 'undefined' && levels[this.currentLevel]) ? levels[this.currentLevel].words : null;
            const recoveryWordsMapping = (typeof levels !== 'undefined' && levels[0]) ? levels[0].words : null;

            const mapping = this.isRecovering ? recoveryWordsMapping : currentWordsMapping;
            const correctAnswers = mapping ? mapping[this.currentWord] : undefined;

            // Si no hay mapeo para la palabra actual, registrar y tratar como incorrecta segura
            if (!Array.isArray(correctAnswers)) {
                console.warn('checkAnswer: no mapping found for word', this.currentWord, 'level', this.isRecovering ? 0 : this.currentLevel);
                if (window.UI) {
                    UI.setFeedback('No mapping for this word.', '#ff9900');
                }
                this.handleIncorrectAnswer([]);
                return;
            }

            // Comparar respuestas en minúsculas
            const normalized = correctAnswers.map(a => a.toLowerCase());
            if (normalized.includes(userAnswer)) {
                this.handleCorrectAnswer();
            } else {
                this.handleIncorrectAnswer(correctAnswers);
            }
        },

        handleCorrectAnswer() {
            if (this.isRecovering) {
                // Modo recuperación
                this.recoveryWordsCorrect++;
                this.currentRecoveryIndex++;

                if (window.UI) {
                    UI.setFeedback(`Correct! Energy recovering... (${this.recoveryWordsCorrect}/3)`, '#00ff00');
                    UI.playSound('correct');
                }

                if (this.recoveryWordsCorrect >= 3) {
                    this.completeEnergyRecovery();
                } else {
                    setTimeout(() => {
                        this.showNextRecoveryWord();
                    }, 1000);
                }
            } else {
                // Modo normal
                this.registerAnswer(this.currentWord, true);
                let pointsToAdd = 1;
                if (this.currentEvent === 'star_rain') {
                    pointsToAdd = 2; // Doble puntos durante lluvia de estrellas
                }
                if (window.RuneState && RuneState.smallBoostActive) {
                    pointsToAdd += 1;
                    RuneState.smallBoostActive = false;
                    if (typeof showRuneAlert === 'function') {
                        showRuneAlert("📈 Small Boost — +1 punto extra en esta palabra.", "#ccffaa");
                    }
                }
                if (window.RuneState && RuneState.doublePointsUntil && RuneState.doublePointsUntil > Date.now()) {
                    pointsToAdd *= 2;
                }
                if (window.RuneState && RuneState.triplePointsUntil && RuneState.triplePointsUntil > Date.now()) {
                    pointsToAdd *= 3;
                }
                if (window.RuneState && RuneState.randomMultiplierUntil && RuneState.randomMultiplierUntil > Date.now()) {
                    pointsToAdd *= RuneState.currentMultiplier;
                }
                             if (window.RuneState && RuneState.leaderSealActive) {
                    pointsToAdd = 0; // Leader seal blocks score gain
                }

                this.score += pointsToAdd;
                this.levelScore += pointsToAdd;

                if (window.UI) {
                    UI.updateScore(this.score);
                    UI.setFeedback('Correct!', '#00ff00', true);
                    UI.playSound('correct');
                }
                // Award coins for correct answer
                if (typeof Users !== 'undefined') {
                    let coinsToAdd = 2;
                    if (window.RuneState && RuneState.coinBonus > 0) {
                        coinsToAdd += RuneState.coinBonus;
                    }
                    Users.addCoins(coinsToAdd);
                }

                // Halloween Pass Event Progression
                if (typeof HalloweenPass !== 'undefined' && typeof HalloweenPass.recordWordCorrect === 'function') {
                    HalloweenPass.recordWordCorrect();
                }

                this.wordIndex++;
                const ansInput = document.getElementById('answer');
                if (ansInput) ansInput.value = '';

                this.errorCount = 0;

                if (!(window.RuneState && RuneState.blockStreakGain)) {
                    this.currentStreak++;
                    if (this.currentStreak > this.maxStreak) {
                        this.maxStreak = this.currentStreak;
                    }
                }

                // Aplicar efectos visuales según la racha
                this.updateStreakVisuals();

                // Verificar evento sorpresa después de respuesta correcta
                this.checkForRandomEvent();

                setTimeout(() => {
                    this.nextWord();
                }, (window.RuneState && RuneState.quickMindUntil > Date.now()) ? 100 : 500);
            }
        },

        handleIncorrectAnswer(correctAnswers) {
            if (this.isRecovering) {
                // Mostrar la respuesta correcta
                const correctAnswerText = correctAnswers.join(', ');
                if (window.UI) {
                    UI.setFeedback(`Incorrect! Correct: ${correctAnswerText}`, '#ff0000');
                    UI.playSound('incorrect');
                }

                setTimeout(() => {
                    const ansInput = document.getElementById('answer');
                    if (ansInput) ansInput.value = '';
                    this.currentRecoveryIndex++;
                    this.showNextRecoveryWord();
                }, 1500);
            } else {
                // Modo normal

                if (window.RuneState && RuneState.safeStepActive) {
                    RuneState.safeStepActive = false;
                    if (window.UI) {
                        UI.setFeedback(`Safe Step saved you! Correct: ${correctAnswers.join(', ')}`, '#00ffcc');
                        UI.playSound('correct'); // Optional
                    }
                    setTimeout(() => {
                        const ansInput = document.getElementById('answer');
                        if (ansInput) ansInput.value = '';
                        this.showDifferentWord();
                    }, 1500);
                    return; // Prevent energy loss and streak reset
                }

                // reducir energía mágica
                this.magicEnergy--;

                if (window.UI) {
                    UI.updateEnergyDisplay(this.magicEnergy);
                    UI.playSound('incorrect');
                }

                // Trigger screen shake/flash VFX directly without MutationObserver
                if (window.Effects) {
                    Effects.triggerEnergyLossVFX();
                }

                // Reiniciar racha en respuesta incorrecta (salvo Rune of Calm)
                if (window.RuneState && RuneState.streakGuardActive) {
                    RuneState.streakGuardActive = false;
                    if (typeof showRuneAlert === 'function') {
                        showRuneAlert("🧘 Rune of Calm — Tu racha se mantiene intacta.", "#99ffcc");
                    }
                } else {
                    this.currentStreak = 0;
                    this.removeStreakVisuals();
                }

                // Registrar el fallo en el sistema de colores
                this.registerAnswer(this.currentWord, false);

                // La palabra fallada vuelve al final de la cola del nivel
                if (Array.isArray(this.pendingWords) && this.currentWord &&
                    this.pendingWords.indexOf(this.currentWord) === -1) {
                    this.pendingWords.push(this.currentWord);
                }

                // Registrar fallo en la sesión
                this.sessionMistakeWords.add(this.currentWord);

                const correctAnswerText = correctAnswers.join(', ');
                if (window.UI) {
                    UI.setFeedback(`Energy lost! Correct: ${correctAnswerText}`, '#ff0000', false);
                }

                // Verificar si se acabó la energía
                if (this.magicEnergy <= 0) {
                    if (typeof Users !== 'undefined' && Users.hasRune('rune_final_chance')) {
                        Users.consumeRune('rune_final_chance');
                        this.magicEnergy = 3;
                        if (window.UI) UI.updateEnergyDisplay(this.magicEnergy);
                        if (typeof showRuneAlert === 'function') showRuneAlert("🔥 Rune of Final Chance te ha revivido con 3 vidas.", "#ff5555");
                        setTimeout(() => {
                            const ansInput = document.getElementById('answer');
                            if (ansInput) ansInput.value = '';
                            this.showDifferentWord();
                        }, 1500);
                        return;
                    }

                    setTimeout(() => {
                        this.startEnergyRecovery();
                    }, 1000);
                    return;
                }

                // Continuar con palabra diferente
                setTimeout(() => {
                    const ansInput = document.getElementById('answer');
                    if (ansInput) ansInput.value = '';
                    this.showDifferentWord();
                }, 1500);
            }
        },

        completeEnergyRecovery() {
            const viewLB = document.getElementById('view-leaderboard-start');
            if (viewLB) viewLB.classList.add('hidden');

            this.magicEnergy = 3; // Recuperar energía parcialmente
            this.isRecovering = false;
            this.recoveryWordsCorrect = 0;

            // Restaurar interfaz normal
            if (typeof levels !== 'undefined' && levels[this.currentLevel]) {
                const levelTitle = document.getElementById('level-title');
                if (levelTitle) levelTitle.textContent = levels[this.currentLevel].name;
            }

            if (window.UI) {
                UI.setFeedback('Energy restored! Continue your trial!', '#00ff4c');
                UI.updateEnergyDisplay(this.magicEnergy);
            }

            // Reanudar timer
            this.startTimer();

            // Continuar con el juego normal
            setTimeout(() => {
                this.nextWord();
            }, 1500);
        },

        // Sistema de colores de dominio (igual que Arcane Trials)
        getWordColor(word) {
            var entry = this.wordColors[word];
            return entry ? entry.color : null; // null = nunca vista
        },

        registerAnswer(word, isCorrect) {
            var today = new Date().toDateString();
            var entry = this.wordColors[word];

            if (isCorrect) {
                if (!entry || entry.color === 'rojo') {
                    this.wordColors[word] = { color: 'amarillo', lastCorrectDay: today };
                } else if (entry.color === 'amarillo') {
                    if (entry.lastCorrectDay !== today) {
                        entry.color = 'verde';
                    }
                    entry.lastCorrectDay = today;
                }
            } else {
                if (!entry) {
                    this.wordColors[word] = { color: 'rojo', lastCorrectDay: null };
                } else {
                    entry.color = (entry.color === 'verde') ? 'amarillo' : 'rojo';
                }
            }

            // CORRECCIÓN B-15: Guardar wordColors en el perfil del jugador
            if (typeof Users !== 'undefined' && Users.data) {
                Users.data.wordColors = this.wordColors;
            } else {
                localStorage.setItem('wordColors', JSON.stringify(this.wordColors));
            }
        },

        selectWordsWithDifficulty() {
            if (typeof levels === 'undefined' || !levels[this.currentLevel]) return;
            const level = levels[this.currentLevel];
            const allWords = Object.keys(level.words || {});
            const TARGET = 10;

            const shuffle = (arr) => {
                for (let i = arr.length - 1; i > 0; i--) {
                    const j = Math.floor(Math.random() * (i + 1));
                    [arr[i], arr[j]] = [arr[j], arr[i]];
                }
                return arr;
            };

            const colorOf = (w) => (this.wordColors[w] ? this.wordColors[w].color : null);

            const nuevas    = shuffle(allWords.filter(w => !this.wordColors[w]));
            const rojas     = shuffle(allWords.filter(w => colorOf(w) === 'rojo'));
            const amarillas = shuffle(allWords.filter(w => colorOf(w) === 'amarillo'));
            const verdes    = shuffle(allWords.filter(w => colorOf(w) === 'verde'));

            const cuotas = [
                { pool: rojas,     max: 4 },
                { pool: nuevas,    max: 4 },
                { pool: amarillas, max: 1 },
                { pool: verdes,    max: 1 }
            ];

            this.selectedWords = [];
            cuotas.forEach(c => {
                for (let i = 0; i < c.pool.length && i < c.max && this.selectedWords.length < TARGET; i++) {
                    if (this.selectedWords.indexOf(c.pool[i]) === -1) this.selectedWords.push(c.pool[i]);
                }
            });

            const relleno = rojas.concat(nuevas, amarillas, verdes);
            for (let i = 0; i < relleno.length && this.selectedWords.length < TARGET; i++) {
                if (this.selectedWords.indexOf(relleno[i]) === -1) this.selectedWords.push(relleno[i]);
            }

            shuffle(this.selectedWords);
            this.pendingWords = this.selectedWords.slice();
        },

        checkForRandomEvent() {
            if (this.eventActive) return;
            const randomNum = Math.random() * 1000;
            if (randomNum < 5) {
                this.triggerEvent('legendary_power');
            } else if (randomNum < 15) {
                this.triggerEvent('star_rain');
            }
        },

        triggerEvent(eventType) {
            this.eventActive = true;
            this.currentEvent = eventType;

            if (eventType === 'star_rain') {
                this.startStarRainEvent();
            } else if (eventType === 'legendary_power') {
                this.startLegendaryPowerEvent();
            }
        },

        startStarRainEvent() {
            this.eventTimeLeft = 20;
            if (window.UI) {
                UI.showEventNotification('⭐ STAR RAIN EVENT! ⭐', 'Double points for 20 seconds!');
            }

            this.eventInterval = setInterval(() => {
                this.eventTimeLeft--;
                this.updateEventDisplay();

                if (this.eventTimeLeft <= 0) {
                    this.endStarRainEvent();
                    clearInterval(this.eventInterval);
                }
            }, 1000);
        },

        startLegendaryPowerEvent() {
            const powers = [
                'Time Freeze: +30 seconds',
                'Energy Shield: +3 magic energy',
                'Word Reveal: See next 3 answers',
                'Double XP: 2x points for this level',
                'Phoenix Resurrection: Immunity to next 3 errors'
            ];

            const randomPower = powers[Math.floor(Math.random() * powers.length)];
            if (window.UI) {
                UI.showEventNotification('🌟 LEGENDARY POWER! 🌟', `You gained: ${randomPower}`);
            }

            this.applyLegendaryPower(randomPower);
            this.eventActive = false; // Los poderes legendarios son instantáneos
        },

        applyLegendaryPower(power) {
            if (power.includes('Time Freeze')) {
                this.timeLeft += 30;
                if (window.UI) UI.updateTimer(this.timeLeft, this.currentStreak >= 3);
            } else if (power.includes('Energy Shield')) {
                this.magicEnergy = Math.min(5, this.magicEnergy + 3);
                if (window.UI) UI.updateEnergyDisplay(this.magicEnergy);
            } else if (power.includes('Double XP')) {
                this.currentEvent = 'double_xp';
            }
        },

        endStarRainEvent() {
            this.eventActive = false;
            this.currentEvent = null;
            this.hideEventDisplay();
        },

        updateEventDisplay() {
            if (this.currentEvent === 'star_rain') {
                const minutes = Math.floor(this.eventTimeLeft / 60);
                const seconds = this.eventTimeLeft % 60;
                if (window.UI) {
                    UI.setFeedback(`⭐ STAR RAIN: ${minutes}:${seconds.toString().padStart(2, '0')} ⭐`, '#ffcc00');
                }
            }
        },

        hideEventDisplay() {
            const fb = document.getElementById('feedback');
            if (fb && fb.textContent.includes('STAR RAIN')) {
                fb.textContent = '';
            }
        },

        updateStreakVisuals() {
            const timerCircle = document.getElementById('timer');
            const container = document.querySelector('.container');
            const streakIndicator = this.getOrCreateStreakIndicator();

            if (!container || !timerCircle || !streakIndicator) return;

            container.classList.remove(
                'inferno-background',
                'stormy-background',
                'cosmic-background',
                'streak-glow'
            );
            timerCircle.classList.remove(
                'inferno-effect',
                'thunderstorm-effect',
                'energy-effect',
                'timer-streak'
            );
            document.body.style.background = '';

            timerCircle.classList.add('timer-smooth');

            if (this.currentStreak >= 60) {
                timerCircle.classList.add('timer-streak', 'energy-effect');
                container.classList.add('streak-glow', 'cosmic-background');
                streakIndicator.textContent = `🌌 COSMIC STREAK: ${this.currentStreak} 🌌`;
                streakIndicator.style.color = '#bb00ff';

                for (let i = 0; i < 20; i++) {
                    const particle = document.createElement('div');
                    particle.className = 'particle';
                    particle.style.top = Math.random() * container.offsetHeight + "px";
                    particle.style.left = Math.random() * container.offsetWidth + "px";
                    container.appendChild(particle);
                    setTimeout(() => particle.remove(), 2000);
                }
            } else if (this.currentStreak >= 40) {
                timerCircle.classList.add('timer-streak', 'energy-effect', 'thunderstorm-effect');
                container.classList.add('streak-glow', 'stormy-background');
                streakIndicator.textContent = `⚡ THUNDERSTORM STREAK: ${this.currentStreak} ⚡`;
                streakIndicator.style.color = '#00ccff';
                streakIndicator.style.textShadow = '0 0 10px #00ccff';
            } else if (this.currentStreak >= 20) {
                timerCircle.classList.add('timer-streak', 'energy-effect', 'inferno-effect');
                container.classList.add('streak-glow', 'inferno-background');
                streakIndicator.textContent = `🔥 INFERNO STREAK: ${this.currentStreak} 🔥`;
                streakIndicator.style.color = '#ff3300';
                document.body.style.background = "linear-gradient(45deg, #660000, #ff3300, #660000)";
            } else if (this.currentStreak >= 10) {
                timerCircle.classList.add('timer-streak', 'energy-effect');
                container.classList.add('streak-glow');
                streakIndicator.textContent = `🔥 MASTER STREAK: ${this.currentStreak} 🔥`;
                streakIndicator.style.color = '#ff6b35';
            } else if (this.currentStreak >= 7) {
                timerCircle.classList.add('timer-streak');
                container.classList.add('streak-glow');
                streakIndicator.textContent = `⚡ LIGHTNING STREAK: ${this.currentStreak} ⚡`;
                streakIndicator.style.color = '#ffcc00';
            } else if (this.currentStreak >= 5) {
                timerCircle.classList.add('timer-streak');
                streakIndicator.textContent = `💫 SPEED STREAK: ${this.currentStreak} 💫`;
                streakIndicator.style.color = '#00ff4c';
            } else if (this.currentStreak >= 3) {
                timerCircle.style.background = 'linear-gradient(45deg, #00ff4c, #33ff66)';
                timerCircle.style.boxShadow = '0 0 10px #00ff4c';
                streakIndicator.textContent = `✨ STREAK: ${this.currentStreak} ✨`;
                streakIndicator.style.color = '#00ff4c';
            } else {
                this.removeStreakVisuals();
            }
        },

        removeStreakVisuals() {
            const timerCircle = document.getElementById('timer');
            const container = document.querySelector('.container');
            const streakIndicator = this.getOrCreateStreakIndicator();

            if (!timerCircle || !container || !streakIndicator) return;

            timerCircle.classList.remove(
                'timer-streak',
                'energy-effect',
                'inferno-effect',
                'thunderstorm-effect'
            );

            container.classList.remove(
                'streak-glow',
                'inferno-background',
                'stormy-background',
                'cosmic-background'
            );

            document.querySelectorAll('.particle, .lightning-overlay, .ripple, .fire-spark, .lightning-bolt').forEach(el => el.remove());

            streakIndicator.textContent = '';
            streakIndicator.style.color = '';
            streakIndicator.style.textShadow = '';

            timerCircle.style.background = '';
            timerCircle.style.backgroundColor = '';
            timerCircle.style.boxShadow = '';
            timerCircle.style.border = '';

            document.body.style.background = '';

            setTimeout(() => {
                if (window.UI) UI.updateTimer(this.timeLeft, false);
            }, 50);
        },

        getOrCreateStreakIndicator() {
            let indicator = document.getElementById('streak-indicator');
            if (!indicator) {
                indicator = document.createElement('div');
                indicator.id = 'streak-indicator';
                indicator.className = 'streak-indicator';
                const timer = document.getElementById('timer');
                if (timer && timer.parentNode) {
                    timer.parentNode.insertBefore(indicator, timer.nextSibling);
                }
            }
            return indicator;
        },

        levelComplete() {
            clearInterval(this.timerInterval);
            const levelScoreEl = document.getElementById('level-score');
            if (levelScoreEl) levelScoreEl.textContent = this.score;

            const levelCompleteContent = document.querySelector('.level-complete-content');
            const nextButton = document.getElementById('next-level-btn');

            if (!levelCompleteContent || !nextButton) return;

            // Limpiar cualquier elemento previo
            const prevDT = document.getElementById('level-complete-datetime');
            if (prevDT) prevDT.remove();

            const existingStreak = document.getElementById('current-streak-display');
            if (existingStreak) existingStreak.remove();

            // Mostrar racha actual si aplica
            if (this.currentStreak > 0) {
                const streakDisplay = document.createElement('p');
                streakDisplay.id = 'current-streak-display';
                streakDisplay.innerHTML = `Current Streak: ${this.currentStreak}`;
                streakDisplay.style.color = '#ffcc00';
                streakDisplay.style.fontSize = '1em';
                streakDisplay.style.marginTop = '10px';
                levelCompleteContent.insertBefore(streakDisplay, nextButton);
            }

            // Agregar fecha y hora actual
            const levelDateTime = document.createElement('p');
            levelDateTime.id = 'level-complete-datetime';
            levelDateTime.style.cssText = 'font-size: 0.7em; color: #00ff4c; margin-top: 10px;';
            levelDateTime.textContent = new Date().toLocaleString('en-US', {
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit',
                second: '2-digit'
            });
            levelCompleteContent.insertBefore(levelDateTime, nextButton);

            if (this.currentEvent === 'double_xp') {
                this.score += this.levelScore; // Add the base score again to effectively double it
                this.levelScore *= 2; // Double for display purposes
                if (window.UI) {
                    UI.updateScore(this.score);
                }
                if (levelScoreEl) levelScoreEl.textContent = this.levelScore;
            }

            const completeContainer = document.getElementById('level-complete');
            if (completeContainer) completeContainer.classList.remove('hidden');

            if (window.UI) {
                UI.playSound('victory');
            }
            // Award coins for completing a level
            if (typeof Users !== 'undefined') {
                Users.addCoins(10);
                // Bonus for perfect streak of 70
                if (this.currentStreak >= 70) {
                    Users.addCoins(40);
                }
            }

            // Halloween Pass Event Progression
            if (typeof HalloweenPass !== 'undefined' && typeof HalloweenPass.recordTrialComplete === 'function') {
                HalloweenPass.recordTrialComplete(this.score, this.currentStreak);
            }

            },

        gameOver() {
            this.isPlaying = false;
            if (window.PerformanceManager) {
                window.PerformanceManager.setContext('Lobby');
            }
            const viewLB = document.getElementById('view-leaderboard-start');
            if (viewLB) viewLB.classList.remove('hidden');

            clearInterval(this.timerInterval);
            if (this.eventInterval) clearInterval(this.eventInterval);

            if (typeof window.retrySendPending === 'function') {
                window.retrySendPending();
            }
            if (typeof window.startTop3Updates === 'function') {
                window.startTop3Updates();
            }
            if (typeof Users !== 'undefined' && Users.current) {
                Users.updateHighScore(this.score);
                Users.data.maxStreak = Math.max(Users.data.maxStreak || 0, this.maxStreak);
                if (!Users.data.stats) Users.data.stats = {};
                Users.data.stats.gamesPlayed = (Users.data.stats.gamesPlayed || 0) + 1;
                Users.data.stats.maxStreak = Users.data.maxStreak;
                // No need to call save() manually here because saveToLeaderboard will do it
            }

            if (typeof window.saveToLeaderboard === 'function') {
                window.saveToLeaderboard(this.playerName, this.score);
            }

            if (typeof window.saveMatchRecord === 'function') {
                window.saveMatchRecord({
                    player: this.playerName,
                    matchStatus: 'completed',
                    score: this.score,
                    streak: this.maxStreak
                });
            }

            this.removeStreakVisuals();
            // Reset in-game counters AFTER all saves are queued
            this.currentStreak = 0;
            this.maxStreak = 0;

            // Añadir fecha y hora en la pantalla de Game Over
            const existingFinalDt = document.getElementById('final-datetime');
            if (existingFinalDt) existingFinalDt.remove();

            const finalDateTime = document.createElement('p');
            finalDateTime.id = 'final-datetime';
            finalDateTime.style.cssText = 'font-size: 0.8em; color: #ff3333; margin-top: 10px;';
            finalDateTime.textContent = new Date().toLocaleString('en-US', {
                weekday: 'long', year: 'numeric', month: 'long', day: 'numeric',
                hour: '2-digit', minute: '2-digit', second: '2-digit'
            });

            const goContent = document.querySelector('.game-over-content');
            if (goContent) goContent.appendChild(finalDateTime);

            const finalScoreEl = document.getElementById('final-score');
            if (finalScoreEl) finalScoreEl.textContent = this.score;

            // Mostrar las 3 palabras más problemáticas
            this.showFocusWordsFeedback();

            // Verificar si se activa Focus Training (al menos 3 palabras falladas en esta sesión y hay palabras para entrenar)
            var focusWords = this.getFocusWords().filter((w) => !this.checkWordMastered(w));
            if (this.sessionMistakeWords.size >= 3 && focusWords.length > 0) {
                this.showFocusTraining(true);
            } else {
                this.showGameOverScreenDirectly();
            }
        },

        showGameOverScreenDirectly() {
            const goContainer = document.getElementById('game-over');
            if (goContainer) goContainer.classList.remove('hidden');

            // Desactivado temporalmente para probar la carga del servidor
            // if (typeof window.fetchPlayerDays === 'function' && typeof Users !== 'undefined' && Users.current) {
            //     const who = Users.current;
            //     setTimeout(() => window.fetchPlayerDays(who), 4000);
            // }

            if (typeof window.showLeaderboard === 'function') {
                window.showLeaderboard();
            }

            const setupSection = document.getElementById('player-setup');
            if (setupSection) setupSection.classList.remove('hidden');

            const passMount = document.getElementById('hw-lobby-pass-mount');
            if (passMount) passMount.classList.remove('hidden');
            const wheelMount = document.getElementById('hw-lobby-wheel-mount');
            if (wheelMount) wheelMount.classList.remove('hidden');

            const top3Display = document.getElementById('top3-display');
            if (top3Display) top3Display.classList.remove('hidden');

            const startBtn = document.getElementById('start-btn');
            if (startBtn) startBtn.classList.remove('hidden');

            const gameContainer = document.getElementById('game');
            if (gameContainer) gameContainer.classList.add('hidden');

            const headerImage = document.getElementById('game-header-image');
            if (headerImage) headerImage.classList.remove('hidden');

            if (window.UI) {
                UI.stopSound('background');
                if (this.musicEnabled) {
                    UI.playSound('lobby');
                    UI.playSound('lobby-seagulls');
                }
            }
        },

        startEnergyRecovery() {
            this.isRecovering = true;
            clearInterval(this.timerInterval); // Pausar el timer principal

            const wordDisplay = document.getElementById('word-to-translate');
            if (wordDisplay) wordDisplay.textContent = 'RECOVERING ENERGY...';

            const levelTitle = document.getElementById('level-title');
            if (levelTitle) levelTitle.textContent = 'Energy Recovery';

            if (window.UI) {
                UI.setFeedback('Answer 3 easy words correctly to restore your magic energy!', '#00ff4c');
            }

            // Reiniciar contador de errores para la recuperación
            this.errorCount = 0;
            this.recoveryWordsCorrect = 0;

            // Seleccionar palabras fáciles para recuperación
            this.selectRecoveryWords();
            this.showNextRecoveryWord();
        },

        selectRecoveryWords() {
            if (typeof levels === 'undefined' || !levels[0]) return;
            const easyWords = Object.keys(levels[0].words);

            for (let i = easyWords.length - 1; i > 0; i--) {
                const j = Math.floor(Math.random() * (i + 1));
                [easyWords[i], easyWords[j]] = [easyWords[j], easyWords[i]];
            }

            this.recoveryWords = easyWords.slice(0, 5);
            this.currentRecoveryIndex = 0;
        },

        showNextRecoveryWord() {
            if (this.currentRecoveryIndex < this.recoveryWords.length) {
                this.currentWord = this.recoveryWords[this.currentRecoveryIndex];
                if (window.UI) {
                    UI.showWord(this.currentWord);
                    UI.setFeedback(`Recovery word ${this.recoveryWordsCorrect + 1}/3`, '#00ff4c');
                }

                const ansInput = document.getElementById('answer');
                if (ansInput) ansInput.value = '';
            } else {
                this.gameOver();
            }
        },

        tryAgain() {
            if (typeof window.stopTop3Updates === 'function') {
                window.stopTop3Updates();
            }
            const goContainer = document.getElementById('game-over');
            if (goContainer) goContainer.classList.add('hidden');
            this.startGame();
        },

        showDifferentWord() {
            if (!Array.isArray(this.pendingWords)) this.pendingWords = [];

            if (this.currentWord && this.pendingWords.indexOf(this.currentWord) === -1) {
                this.pendingWords.push(this.currentWord);
            }

            if (this.pendingWords.length === 0) {
                this.levelComplete();
                return;
            }

            this.currentWord = this.pendingWords.shift();

            if (window.UI) {
                UI.showWord(this.currentWord);
            }

            const ansInput = document.getElementById('answer');
            if (ansInput) ansInput.value = '';
        },

        addBonusTime() {
            if (!this.bonusTimeUsed) {
                this.timeLeft += 10;
                if (window.UI) {
                    UI.updateTimer(this.timeLeft, this.currentStreak >= 3);
                    UI.playSound('correct');
                }
                this.bonusTimeUsed = true;
                const bonusBtn = document.getElementById('bonus-time-btn');
                if (bonusBtn) bonusBtn.classList.add('disabled');
            }
        },

        skipWord() {
            if (!this.skipWordUsed) {
                this.wordIndex++;
                const ansInput = document.getElementById('answer');
                if (ansInput) ansInput.value = '';

                this.skipWordUsed = true;
                const skipBtn = document.getElementById('skip-word-btn');
                if (skipBtn) skipBtn.classList.add('disabled');

                if (window.UI) {
                    UI.playSound('correct');
                }

                this.nextWord();
            }
        },

        resetPowerups() {
            this.bonusTimeUsed = false;
            this.skipWordUsed = false;

            const bonusBtn = document.getElementById('bonus-time-btn');
            if (bonusBtn) bonusBtn.classList.remove('disabled');

            const skipBtn = document.getElementById('skip-word-btn');
            if (skipBtn) skipBtn.classList.remove('disabled');
        },

        // updateHighestScore removed — Users.updateHighScore() is the single
        // source of truth. Raw localStorage access was causing dual storage state.

        showEpicVictoryScreen() {
            // Se actualiza endpoint para victoria (Removido para usar config global)
            // window.leaderboardAPI = "https://script.google.com/macros/s/AKfycbwaMPSGNLt_O6wrVPyrRCYncqah78qWaq1Z4jFoyin_ve0LjcC3ughzEzlPDAw4RfHUVg/exec";
            if (typeof window.saveToLeaderboard === 'function') {
                window.saveToLeaderboard(this.playerName, this.score);
            }

            if (typeof window.saveMatchRecord === 'function') {
                window.saveMatchRecord({
                    player: this.playerName,
                    matchStatus: 'victory',
                    score: this.score,
                    streak: this.maxStreak
                });
            }

            if (!document.getElementById('epic-victory-styles')) {
                const style = document.createElement('style');
                style.id = 'epic-victory-styles';
                style.innerHTML = `
                    .epic-overlay { position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: radial-gradient(circle, #001a33 0%, #000 100%); display: flex; justify-content: center; align-items: center; z-index: 2000; overflow: hidden; animation: epicFadeIn 2s ease-out; }
                    .epic-content { text-align: center; z-index: 2001; background: rgba(0, 0, 0, 0.7); border: 4px solid #ffcc00; border-radius: 15px; padding: 40px; box-shadow: 0 0 30px #ffcc00, inset 0 0 20px #ff9900; animation: floatAndGlow 4s infinite alternate; max-width: 90%; }
                    .epic-title { font-size: 2.5em; color: #ffcc00; text-shadow: 0 0 10px #ff3300, 0 0 20px #ffcc00; margin-bottom: 10px; animation: pulseGlow 2s infinite; }
                    .epic-subtitle { font-size: 1.2em; color: #00ffcc; margin-bottom: 30px; text-shadow: 0 0 5px #00ccff; }
                    .stats-container { display: flex; flex-direction: column; gap: 15px; margin-bottom: 30px; background: rgba(0, 20, 0, 0.8); padding: 20px; border-radius: 10px; border: 2px solid #00ffcc; }
                    .stat-item { display: flex; justify-content: space-between; font-size: 1.1em; border-bottom: 1px dashed #00ffcc; padding-bottom: 5px; }
                    .stat-label { color: #aaaaaa; }
                    .stat-value { font-weight: bold; }
                    .epic-score { color: #ffcc00; text-shadow: 0 0 5px #ff9900; }
                    .epic-streak { color: #ff3300; text-shadow: 0 0 5px #ff0000; }
                    .epic-level { color: #bb00ff; text-shadow: 0 0 8px #ff00ff; }
                    .epic-message { font-size: 0.9em; color: #fff; margin-bottom: 30px; line-height: 1.5; text-shadow: 1px 1px 2px #000; }
                    .epic-button { background: linear-gradient(45deg, #ff9900, #ffcc00); color: #000; font-family: 'Press Start 2P', cursive; font-size: 1.2em; padding: 15px 30px; border: none; border-radius: 5px; cursor: pointer; box-shadow: 0 0 15px #ffcc00; transition: transform 0.2s, box-shadow 0.2s; }
                    .epic-button:hover { transform: scale(1.1); box-shadow: 0 0 25px #ffcc00; }
                    .particles-container { position: absolute; top: 0; left: 0; width: 100%; height: 100%; pointer-events: none; }
                    .particle { position: absolute; width: 5px; height: 5px; background: #ffcc00; border-radius: 50%; box-shadow: 0 0 10px #ffcc00; animation: starTwinkle 2s infinite, floatUp 5s infinite linear; }
                    @keyframes epicFadeIn { from { opacity: 0; transform: scale(0.8); } to { opacity: 1; transform: scale(1); } }
                    @keyframes floatAndGlow { 0% { transform: translateY(0); box-shadow: 0 0 30px #ffcc00, inset 0 0 20px #ff9900; } 100% { transform: translateY(-10px); box-shadow: 0 0 50px #ffcc00, inset 0 0 30px #ff9900; } }
                    @keyframes pulseGlow { 0% { text-shadow: 0 0 10px #ff3300, 0 0 20px #ffcc00; } 50% { text-shadow: 0 0 20px #ff3300, 0 0 40px #ffcc00; } 100% { text-shadow: 0 0 10px #ff3300, 0 0 20px #ffcc00; } }
                    @keyframes floatUp { from { transform: translateY(100vh); opacity: 0; } 50% { opacity: 1; } to { transform: translateY(-10vh); opacity: 0; } }
                `;
                document.head.appendChild(style);
            }

            const epicContainer = document.createElement('div');
            epicContainer.id = 'epic-victory-screen';
            epicContainer.innerHTML = `
                <div class="epic-overlay">
                    <div class="epic-content">
                        <div class="epic-title">` + window.HWIcon('trophy') + ` LEGENDARY MASTER! ` + window.HWIcon('trophy') + `</div>
                        <div class="epic-subtitle">You have conquered ALL trials!</div>
                        
                        <div class="stats-container">
                            <div class="stat-item">
                                <span class="stat-label">FINAL SCORE:</span>
                                <span class="stat-value epic-score">${this.score}</span>
                            </div>
                            <div class="stat-item">
                                <span class="stat-label">HIGHEST STREAK:</span>
                                <span class="stat-value epic-streak">${this.maxStreak}</span>
                            </div>
                            <div class="stat-item">
                                <span class="stat-label">MASTERY LEVEL:</span>
                                <span class="stat-value epic-level">LEGENDARY</span>
                            </div>
                        </div>
                        
                        <div class="epic-message">
                            You are now a TRUE WORD MASTER FROM ARCANIS!<br>
                            Your legend will be remembered forever! 🌟
                        </div>
                        
                        <button class="epic-button" id="claim-glory-btn">
                            ✨ CLAIM YOUR GLORY ✨
                        </button>
                    </div>
                    
                    <div class="particles-container">
                        <div class="particle"></div><div class="particle"></div>
                        <div class="particle"></div><div class="particle"></div>
                        <div class="particle"></div><div class="particle"></div>
                        <div class="particle"></div><div class="particle"></div>
                        <div class="particle"></div><div class="particle"></div>
                    </div>
                </div>
            `;

            document.body.appendChild(epicContainer);

            const claimBtn = document.getElementById('claim-glory-btn');
            if (claimBtn) {
                claimBtn.addEventListener('click', () => {
                    this.closeEpicVictory();
                });
            }
        },

        closeEpicVictory() {
            const screen = document.getElementById('epic-victory-screen');
            if (screen) screen.remove();

            if (typeof Users !== 'undefined') {
                Users.updateHighScore(this.score);
                Users.addCoins(500); // Bonus victoria
            }

            if (typeof LB !== 'undefined') {
                LB.renderTop3();
            }

            // Restore UI to main menu
            const gameContainer = document.getElementById('game');
            if (gameContainer) gameContainer.classList.add('hidden');
            const setupSection = document.getElementById('player-setup');
            if (setupSection) setupSection.classList.remove('hidden');
            const passMount = document.getElementById('hw-lobby-pass-mount');
            if (passMount) passMount.classList.remove('hidden');
            const wheelMount = document.getElementById('hw-lobby-wheel-mount');
            if (wheelMount) wheelMount.classList.remove('hidden');
            if (top3Display) top3Display.classList.remove('hidden');
            const startBtn = document.getElementById('start-btn');
            if (startBtn) startBtn.classList.remove('hidden');
            const headerImage = document.getElementById('game-header-image');
            if (headerImage) headerImage.classList.remove('hidden');
            const viewLB = document.getElementById('view-leaderboard-start');
            if (viewLB) viewLB.classList.remove('hidden');

            this.musicEnabled = localStorage.getItem('musicEnabled') !== 'false';
            if (this.musicEnabled && window.UI) {
                UI.stopSound('background');
                UI.playSound('lobby');
                UI.playSound('lobby-seagulls');
            }
        },

        // Word Mastery & Translation helpers
        getTranslation(word) {
            if (typeof levels === 'undefined') return '?';
            for (let i = 0; i < levels.length; i++) {
                if (levels[i].words && levels[i].words[word]) {
                    return levels[i].words[word][0];
                }
            }
            return '?';
        },

        getAllCorrectAnswers(word) {
            if (typeof levels === 'undefined') return [];
            for (let i = 0; i < levels.length; i++) {
                if (levels[i].words && levels[i].words[word]) {
                    return levels[i].words[word].map(a => a.toLowerCase());
                }
            }
            return [];
        },

        getFocusWords() {
            return Object.keys(this.wordColors).filter(w => this.wordColors[w].color === 'rojo').slice(0, 5);
        },

        checkWordMastered(word) {
            return this.getWordColor(word) === 'verde';
        },

            showFocusWordsFeedback() {
            const feedbackDiv = document.getElementById('focus-words-feedback');
            if (!feedbackDiv) return;

            feedbackDiv.setAttribute('translate', 'no');
            feedbackDiv.classList.add('notranslate');

            // 1) Palabras falladas en ESTA sesión  2) si no hubo, las rojas pendientes
            let words = Array.from(this.sessionMistakeWords || []);
            const fromSession = words.length > 0;
            if (!fromSession) {
                words = Object.keys(this.wordColors).filter(w => this.wordColors[w].color === 'rojo');
            }
            words = words.slice(0, 3);

            if (words.length === 0) {
                feedbackDiv.innerHTML = '<p style="color:#00ff4c; font-size:0.7em; text-align:center;">No problematic words this session!</p>';
                return;
            }

            const title = fromSession ? 'FOCUS ON THESE WORDS:' : 'STILL PENDING FROM BEFORE:';
            let html = '<p style="color:#f2c94c; font-size:0.7em; margin-bottom:8px;">' + title + '</p>';
            html += '<div style="background:rgba(0,92,138,0.3); border-radius:8px; padding:10px; border:1px solid rgba(242,201,76,0.3);">';
            words.forEach(word => {
                const translation = this.getTranslation(word);
                const color = (this.wordColors[word] && this.wordColors[word].color) ? this.wordColors[word].color : 'rojo';
                const colorHex = color === 'rojo' ? '#ff4444' : (color === 'verde' ? '#00ff4c' : '#f2c94c');
                const mark = color === 'rojo' ? '&#9679;' : '&#10003;';
                html += `
                    <div style="display:flex; justify-content:space-between; align-items:center;
                                padding:6px 8px; margin-bottom:4px; background:rgba(0,131,176,0.2);
                                border-left:3px solid #f2c94c; border-radius:4px;">
                        <span style="color:#ffffff; font-size:0.75em;">
                            <span style="color:#f2c94c;">${word}</span>
                            <span style="color:#81d4fa;"> &rarr; </span>
                            <span style="color:#69f0ae;">${translation}</span>
                        </span>
                        <span style="color:${colorHex}; font-size:0.6em;">${mark}</span>
                    </div>`;
            });
            html += '</div>';

            feedbackDiv.innerHTML = html;
        },

        // Focus Training system
        showFocusTraining(fromGameOver) {
            this.isFTFromGameOver = !!fromGameOver;
            this.ftWords = this.getFocusWords().filter(w => !this.checkWordMastered(w));
            if (this.ftWords.length === 0) {
                if (this.isFTFromGameOver) {
                    this.showGameOverScreenDirectly();
                } else {
                    this.startGameCore();
                }
                return;
            }
            this.ftIndex = 0;
            const ftTotal = document.getElementById('ft-total');
            if (ftTotal) ftTotal.textContent = this.ftWords.length;

            const ftOverlay = document.getElementById('focus-training');
            if (ftOverlay) ftOverlay.style.display = 'flex';

            this.showFTWord();
        },

        showFTWord() {
            var word = this.ftWords[this.ftIndex];
            const ftCurrent = document.getElementById('ft-current');
            if (ftCurrent) ftCurrent.textContent = this.ftIndex + 1;

            const ftWord = document.getElementById('ft-word');
            if (ftWord) ftWord.textContent = word;

            const ftAns = document.getElementById('ft-answer');
            if (ftAns) {
                ftAns.value = '';
                ftAns.focus();
            }

            const ftFeedback = document.getElementById('ft-feedback');
            if (ftFeedback) {
                ftFeedback.textContent = '';
                ftFeedback.style.color = '';
            }

            const ftSubmit = document.getElementById('ft-submit-btn');
            if (ftSubmit) {
                ftSubmit.textContent = 'CHECK';
                ftSubmit.onclick = () => this.checkFTAnswer();
            }
        },

        checkFTAnswer() {
            var word = this.ftWords[this.ftIndex];
            const ftAns = document.getElementById('ft-answer');
            var userAnswer = (ftAns && ftAns.value.trim().toLowerCase()) || '';
            var allCorrect = this.getAllCorrectAnswers(word);
            var isCorrect = allCorrect.indexOf(userAnswer) !== -1;
            this.registerAnswer(word, isCorrect);
            var entry = this.wordColors[word];

            const ftFeedback = document.getElementById('ft-feedback');
            const ftSubmit = document.getElementById('ft-submit-btn');

            if (isCorrect) {
                if (ftFeedback) {
                    if (entry.color === 'verde') {
                        ftFeedback.innerHTML = window.HWIcon('trophy') + ' <span style="color:#ffd700;">You mastered</span> <span style="color:#00ff9d;">"' + word + '"</span>!<br><span style="color:#888; font-size:0.85em;">It will no longer appear in Focus Training</span>';
                        ftFeedback.style.color = '#ffd700';
                    } else {
                        ftFeedback.textContent = '✓ Correct!';
                        ftFeedback.style.color = '#00ff4c';
                    }
                }
                if (ftSubmit) {
                    ftSubmit.textContent = 'NEXT →';
                    ftSubmit.onclick = () => this.advanceFT();
                }
            } else {
                var correctAnswer = this.getTranslation(word);
                if (ftFeedback) {
                    ftFeedback.innerHTML = '✗ Correct answer: <span style="color:#ffcc00;">' + correctAnswer + '</span><br><span style="color:#aaaaaa; font-size:0.85em;">Type it to continue...</span>';
                    ftFeedback.style.color = '#ff4444';
                }
                if (ftAns) {
                    ftAns.value = '';
                    ftAns.focus();
                }
                if (ftSubmit) {
                    ftSubmit.textContent = 'CHECK';
                    ftSubmit.onclick = () => {
                        var retryAnswer = (ftAns && ftAns.value.trim().toLowerCase()) || '';
                        var retryCorrect = this.getAllCorrectAnswers(word);
                        if (retryCorrect.indexOf(retryAnswer) !== -1) {
                            if (ftFeedback) {
                                ftFeedback.textContent = '✓ Good! Now you can continue.';
                                ftFeedback.style.color = '#00ff4c';
                            }
                            ftSubmit.textContent = 'NEXT →';
                            ftSubmit.onclick = () => this.advanceFT();
                        } else {
                            if (ftFeedback) {
                                ftFeedback.innerHTML = '✗ Not yet. Write: <span style="color:#ffcc00;">' + correctAnswer + '</span>';
                                ftFeedback.style.color = '#ff4444';
                            }
                            if (ftAns) {
                                ftAns.value = '';
                                ftAns.focus();
                            }
                        }
                    };
                }
            }
        },

        advanceFT() {
            this.ftIndex++;
            if (this.ftIndex >= this.ftWords.length) {
                const ftOverlay = document.getElementById('focus-training');
                if (ftOverlay) ftOverlay.style.display = 'none';

                if (this.isFTFromGameOver) {
                    this.showGameOverScreenDirectly();
                } else {
                    this.startGameCore();
                }
            } else {
                this.showFTWord();
            }
        },

        startGameCore() {
            const ftOverlay = document.getElementById('focus-training');
            if (ftOverlay) ftOverlay.style.display = 'none';

            this.currentLevel = 0;
            this.score = 0;
            if (window.UI) {
                UI.updateScore(this.score);
            }
            this.errorCount = 0;
            this.magicEnergy = 5;
            this.isRecovering = false;
            this.eventActive = false;
            this.currentEvent = null;
            this.currentStreak = 0;
            this.maxStreak = 0;
            this.usedWordsByLevel = {};
            if (this.eventInterval) clearInterval(this.eventInterval);
            this.loadLevel();
        },

        updateUI() {
            if (window.UI) {
                UI.updateScore(this.score);
                if (typeof UI.updateEnergyDisplay === 'function') {
                    UI.updateEnergyDisplay(this.magicEnergy);
                }
                UI.updateTimer(this.timeLeft, this.currentStreak >= 3);
            }
        }
    };
        // Pausa/reanuda el cronómetro cuando se abre un panel encima de la partida
    window.pauseGameTimer = function () {
        const G = window.Game;
        if (G && G.isPlaying && !G.isRecovering && !G._timerPaused) {
            clearInterval(G.timerInterval);
            G._timerPaused = true;
        }
    };
    window.resumeGameTimer = function () {
        const G = window.Game;
        if (G && G._timerPaused) {
            G._timerPaused = false;
            if (G.isPlaying && !G.isRecovering) G.startTimer();
        }
    };

    // Expose helpers for API
    Object.defineProperty(window, '_gameMaxStreak', {
        get() { return window.Game ? window.Game.maxStreak : 0; }
    });
    Object.defineProperty(window, '_gameWordFailCount', {
        get() { return window.Game ? window.Game.wordFailCount : {}; }
    });
    Object.defineProperty(window, '_gameScore', {
        get() { return window.Game ? window.Game.score : 0; }
    });

    // Run Game setup
    document.addEventListener('DOMContentLoaded', () => {
        window.Game.init();
    });

})();
