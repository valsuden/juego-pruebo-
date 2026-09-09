/**
 * =============================================================================
 * WITCH'S WHEEL — HALLOWEEN SUMMONING SYSTEM
 * Trials of Mastery: Halloween Edition
 * 
 * Features:
 * - 100% In-Game Economy: Coins (200) or Pumpkin Coins (100) per spin (NO real money).
 * - Pity System (Garantía): Epic @ 20, Legendary @ 50, Mythic @ 80.
 * - Mythic Rewards: Rune of Reality Shift (Runa de Cambio), Witch's Soul, Witch's Night Banner.
 * - Duplicate Compensation: Automatic shards / pumpkin coin refund on owned banners.
 * - Transparent Drop Rates Table & Catalog Preview.
 * - Summon History & Event Statistics.
 * - Procedural Web Audio SFX with Mute & Volume settings.
 * - Potato Mode / Reduced Motion support.
 * - Direct integration with Users state, Storage, Inventory, and Halloween Pass.
 * =============================================================================
 */

const WitchWheel = {
    CONFIG: {
        costSingleCoins: 200,
        costSinglePumpkin: 100,
        costTenCoins: 1800,       // 10% de descuento
        costTenPumpkin: 900,      // 10% de descuento
        pityEpicThreshold: 20,
        pityLegendaryThreshold: 50,
        pityMythicThreshold: 80,
        dropRates: {
            Common: 0.55,
            Rare: 0.26,
            Epic: 0.13,
            Legendary: 0.045,
            Mythic: 0.015
        }
    },

    // 12 Slices on the physical wheel
    SLICES: [
        { id: 'slice_mythic',    tier: 'Mythic',    label: 'MÍTICO',      glyph: '🌌', color: '#e11d48', stroke: '#fda4af' },
        { id: 'slice_common_1',  tier: 'Common',    label: '+250 Coins',  glyph: '🪙', color: '#334155', stroke: '#94a3b8' },
        { id: 'slice_rare_1',    tier: 'Rare',      label: 'Runa Rara',   glyph: '💠', color: '#0284c7', stroke: '#38bdf8' },
        { id: 'slice_epic_1',    tier: 'Epic',      label: 'Runa Épica',  glyph: '🔮', color: '#7e22ce', stroke: '#c084fc' },
        { id: 'slice_common_2',  tier: 'Common',    label: 'Cofre Menor', glyph: '📦', color: '#1e293b', stroke: '#64748b' },
        { id: 'slice_legend_1',  tier: 'Legendary', label: 'LEGENDARIO',  glyph: '🔥', color: '#c2410c', stroke: '#fdba74' },
        { id: 'slice_rare_2',    tier: 'Rare',      label: '+150 🎃',     glyph: '🎃', color: '#0369a1', stroke: '#7dd3fc' },
        { id: 'slice_common_3',  tier: 'Common',    label: '+200 XP',     glyph: '📜', color: '#334155', stroke: '#94a3b8' },
        { id: 'slice_epic_2',    tier: 'Epic',      label: 'Cofre Bruja', glyph: '✨', color: '#6b21a8', stroke: '#d8b4fe' },
        { id: 'slice_rare_3',    tier: 'Rare',      label: 'Shards x4',   glyph: '💎', color: '#0284c7', stroke: '#38bdf8' },
        { id: 'slice_common_4',  tier: 'Common',    label: 'Poción Bruja',glyph: '🧪', color: '#1e293b', stroke: '#64748b' },
        { id: 'slice_legend_2',  tier: 'Legendary', label: 'Runa Fénix',  glyph: '⚡', color: '#ea580c', stroke: '#fef08a' }
    ],

    // Complete Rewards Catalog
    REWARDS: [
        // --- MYTHIC (1.5%) ---
        {
            id: 'mythic_reality_shift',
            name: 'Runa de Cambio de Realidad',
            tier: 'Mythic',
            type: 'rune',
            runeId: 'rune_reality_shift',
            icon: 'rune',
            glyph: '🌌',
            desc: 'Intercambia tu puntaje total con el objetivo o con el líder del tablero.',
            weight: 35
        },
        {
            id: 'mythic_witch_banner',
            name: "Banner: Witch's Night",
            tier: 'Mythic',
            type: 'banner',
            bannerId: 'witch_coven',
            icon: 'witch',
            glyph: '🧙‍♀️',
            desc: 'Estandarte exclusivo del aquelarre: caldero de fuego fatuo y luna carmesí.',
            duplicateCompensation: { shards: 450, pumpkinCoins: 250 },
            weight: 35
        },
        {
            id: 'mythic_witch_soul',
            name: 'Runa del Alma de la Bruja',
            tier: 'Mythic',
            type: 'rune',
            runeId: 'rune_witch_soul',
            icon: 'rune',
            glyph: '🔥',
            desc: '+25s de tiempo, restaura todas tus vidas y otorga puntos dobles por 20s.',
            weight: 30
        },

        // --- LEGENDARY (4.5%) ---
        {
            id: 'legend_halloween_haunt',
            name: 'Banner: Halloween Haunt',
            tier: 'Legendary',
            type: 'banner',
            bannerId: 'halloween_haunt',
            icon: 'pumpkin',
            glyph: '🎃',
            desc: 'Estandarte legendario de calabazas flotantes y niebla espectral.',
            duplicateCompensation: { shards: 250, pumpkinCoins: 150 },
            weight: 30
        },
        {
            id: 'legend_rune_phoenix',
            name: 'Runa de Fénix',
            tier: 'Legendary',
            type: 'rune',
            runeId: 'rune_phoenix',
            icon: 'rune',
            glyph: '🦅',
            desc: 'Resucita automáticamente al llegar a 0 vidas conservando el 50% de tu racha.',
            weight: 25
        },
        {
            id: 'legend_rune_time_stop',
            name: 'Runa de Parada Temporal',
            tier: 'Legendary',
            type: 'rune',
            runeId: 'rune_time_stop',
            icon: 'rune',
            glyph: '⏳',
            desc: 'Detiene el reloj durante 15 segundos enteros de pura concentración.',
            weight: 25
        },
        {
            id: 'legend_chest',
            name: 'Cofre Legendario de Halloween',
            tier: 'Legendary',
            type: 'chest',
            icon: 'chest',
            glyph: '👑',
            desc: 'Otorga +1,500 Coins, +500 Pumpkin Coins y +10 Fragmentos Rúnicos.',
            bundle: { coins: 1500, pumpkinCoins: 500, shards: 10 },
            weight: 20
        },

        // --- EPIC (13%) ---
        {
            id: 'epic_witch_frame',
            name: 'Marco Espectral de Bruja',
            tier: 'Epic',
            type: 'frame',
            frameId: 'frame-witch',
            icon: 'witch',
            glyph: '🔮',
            desc: 'Marco de avatar con aura púrpura espectral y llamas verdes.',
            duplicateCompensation: { shards: 150, pumpkinCoins: 100 },
            weight: 25
        },
        {
            id: 'epic_rune_freeze',
            name: 'Runa de Congelación',
            tier: 'Epic',
            type: 'rune',
            runeId: 'rune_freeze',
            icon: 'rune',
            glyph: '❄️',
            desc: 'Congela el tiempo durante 30 segundos sin penalización.',
            weight: 25
        },
        {
            id: 'epic_rune_lightning',
            name: 'Runa de Relámpago',
            tier: 'Epic',
            type: 'rune',
            runeId: 'rune_lightning',
            icon: 'rune',
            glyph: '⚡',
            desc: 'Destruye instantáneamente la palabra actual sumando sus puntos completos.',
            weight: 25
        },
        {
            id: 'epic_chest',
            name: 'Cofre de la Bruja',
            tier: 'Epic',
            type: 'chest',
            icon: 'chest',
            glyph: '✨',
            desc: 'Otorga +750 Coins, +250 Pumpkin Coins y +5 Fragmentos Rúnicos.',
            bundle: { coins: 750, pumpkinCoins: 250, shards: 5 },
            weight: 25
        },

        // --- RARE (26%) ---
        {
            id: 'rare_rune_double',
            name: 'Runa de Doble Moneda',
            tier: 'Rare',
            type: 'rune',
            runeId: 'rune_double_coin',
            icon: 'rune',
            glyph: '🪙',
            desc: 'Duplica las monedas obtenidas durante toda tu partida.',
            weight: 25
        },
        {
            id: 'rare_rune_drain',
            name: 'Runa de Drenaje de Puntos',
            tier: 'Rare',
            type: 'rune',
            runeId: 'rune_point_drain',
            icon: 'rune',
            glyph: '🩸',
            desc: 'Drena 5 puntos de tu rival directo y te los transfiere a ti.',
            weight: 25
        },
        {
            id: 'rare_pumpkin_bundle',
            name: 'Saco de Pumpkin Coins',
            tier: 'Rare',
            type: 'pumpkin_coins',
            amount: 250,
            icon: 'pumpkin',
            glyph: '🎃',
            desc: '+250 Monedas de Calabaza para el evento de Halloween.',
            weight: 25
        },
        {
            id: 'rare_shards_bundle',
            name: 'Alijo de Fragmentos Rúnicos',
            tier: 'Rare',
            type: 'shards',
            amount: 5,
            icon: 'gem',
            glyph: '💎',
            desc: '+5 Fragmentos Rúnicos para crafteo o compra en la tienda.',
            weight: 25
        },

        // --- COMMON (55%) ---
        {
            id: 'common_coins_1',
            name: 'Bolsa de Monedas Arcanas',
            tier: 'Common',
            type: 'coins',
            amount: 300,
            icon: 'coins',
            glyph: '🪙',
            desc: '+300 Monedas Arcanas añadidas a tu perfil.',
            weight: 25
        },
        {
            id: 'common_coins_2',
            name: 'Monedas de Oro Antiguo',
            tier: 'Common',
            type: 'coins',
            amount: 500,
            icon: 'coins',
            glyph: '💰',
            desc: '+500 Monedas Arcanas añadidas a tu perfil.',
            weight: 20
        },
        {
            id: 'common_pumpkin_1',
            name: 'Puñado de Calabazas',
            tier: 'Common',
            type: 'pumpkin_coins',
            amount: 80,
            icon: 'pumpkin',
            glyph: '🎃',
            desc: '+80 Monedas de Calabaza para la tienda de Halloween.',
            weight: 20
        },
        {
            id: 'common_event_xp',
            name: 'Pergamino de Sabiduría',
            tier: 'Common',
            type: 'xp',
            amount: 350,
            icon: 'scroll',
            glyph: '📜',
            desc: '+350 Puntos de Experiencia para tu progreso.',
            weight: 20
        },
        {
            id: 'common_potion',
            name: 'Poción de Claridad',
            tier: 'Common',
            type: 'potion',
            icon: 'potion',
            glyph: '🧪',
            desc: 'Poción mística que asiste en tu siguiente prueba mágica (+1 Vida extra).',
            weight: 15
        }
    ],

    // Runtime state
    selectedCurrency: 'coins', // 'coins' or 'pumpkin'
    isSpinning: false,
    audioMuted: false,
    audioCtx: null,
    currentRotation: 0,

    init() {
        this.ensureUserDataProps();
        this.mountLobbyCard();
        this.mountModalMarkup();
        this.bindEvents();
        this.renderCanvasWheel();
        this.updateHUD();
    },

    ensureUserDataProps() {
        if (!window.Users || !Users.data) return;
        const d = Users.data;
        if (!d.summonPity) {
            d.summonPity = { epic: 0, legendary: 0, mythic: 0 };
        }
        if (!d.summonStats) {
            d.summonStats = {
                totalSpins: 0,
                coinsSpent: 0,
                pumpkinCoinsSpent: 0,
                commonCount: 0,
                rareCount: 0,
                epicCount: 0,
                legendaryCount: 0,
                mythicCount: 0
            };
        }
        if (!Array.isArray(d.summonHistory)) {
            d.summonHistory = [];
        }
        if (typeof d.halloweenCoins !== 'number') {
            d.halloweenCoins = 0;
        }
        if (typeof d.runeShards !== 'number') {
            d.runeShards = 0;
        }
    },

    mountLobbyCard() {
        const mount = document.getElementById('hw-lobby-wheel-mount');
        if (!mount) return;

        mount.innerHTML = `
            <div id="witch-wheel-lobby-card" class="wheel-lobby-card" title="Abrir Ruleta de Noche de Brujas">
                <div class="wheel-lobby-card-left">
                    <div class="wheel-lobby-cauldron-icon">
                        <svg xmlns="http://www.w3.org/2000/svg" width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M4 10h16"></path><path d="M5 10c0 6 3 10 7 10s7-4 7-10"></path><path d="M7 6c0-2 2-3 2-3"></path><path d="M12 6c0-2 2-3 2-3"></path><path d="M17 6c0-2 2-3 2-3"></path></svg>
                    </div>
                    <div class="wheel-lobby-info">
                        <h3>WITCH'S WHEEL — RULETA DE HALLOWEEN</h3>
                        <p>INVOCA RUNAS MÍTICAS & BANNER EXCLUSIVO DE BRUJA</p>
                    </div>
                </div>
                <button class="wheel-lobby-cta">GIRAR AHORA</button>
            </div>
        `;

        const card = document.getElementById('witch-wheel-lobby-card');
        if (card) {
            card.addEventListener('click', () => this.open());
        }
    },

    mountModalMarkup() {
        if (document.getElementById('witch-wheel-overlay')) return;

        const overlay = document.createElement('div');
        overlay.id = 'witch-wheel-overlay';
        overlay.innerHTML = `
            <div id="witch-wheel-modal">
                <div class="wheel-atmosphere-glow"></div>

                <!-- Header -->
                <div class="wheel-header">
                    <div class="wheel-header-left">
                        <div class="wheel-header-icon">
                            <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M4 10h16"></path><path d="M5 10c0 6 3 10 7 10s7-4 7-10"></path><path d="M7 6c0-2 2-3 2-3"></path><path d="M12 6c0-2 2-3 2-3"></path><path d="M17 6c0-2 2-3 2-3"></path></svg>
                        </div>
                        <div class="wheel-header-titles">
                            <h2>WITCH'S WHEEL — NOCHE DE BRUJAS</h2>
                            <p>INVOCACIÓN ARCANO-ESTACIONAL</p>
                        </div>
                    </div>
                    <div class="wheel-header-controls">
                        <button id="wheel-audio-toggle" class="wheel-btn-audio" title="Alternar Sonido">
                            <span id="wheel-audio-icon">🔊</span>
                        </button>
                        <button id="wheel-close-btn" class="wheel-btn-close" title="Cerrar Ruleta">&times;</button>
                    </div>
                </div>

                <!-- Currency and Balance Strip -->
                <div class="wheel-currency-bar">
                    <div class="wheel-balances">
                        <div class="wheel-balance-chip" id="wheel-chip-coins">
                            <span>🪙</span>
                            <span>COINS:</span>
                            <strong id="wheel-val-coins">0</strong>
                        </div>
                        <div class="wheel-balance-chip" id="wheel-chip-pumpkin">
                            <span>🎃</span>
                            <span>PUMPKIN:</span>
                            <strong id="wheel-val-pumpkin">0</strong>
                        </div>
                    </div>
                    <div class="wheel-currency-toggle-wrap">
                        <span>Pagar con:</span>
                        <button class="wheel-currency-tab selected" data-currency="coins">🪙 Coins</button>
                        <button class="wheel-currency-tab" data-currency="pumpkin">🎃 Pumpkin</button>
                    </div>
                </div>

                <!-- Featured Banner Strip -->
                <div class="wheel-featured-strip">
                    <div class="wheel-featured-label">
                        <span>⭐ DESTACADOS:</span>
                    </div>
                    <div class="wheel-featured-items">
                        <span class="wheel-featured-badge mythic">🌌 Runa de Cambio (Reality Shift)</span>
                        <span class="wheel-featured-badge mythic">🧙‍♀️ Banner Witch's Night</span>
                        <span class="wheel-featured-badge mythic">🔥 Runa Alma de Bruja</span>
                        <span class="wheel-featured-badge legendary">🎃 Banner Halloween Haunt</span>
                    </div>
                </div>

                <!-- Body with Pity and Wheel -->
                <div class="wheel-modal-body">
                    <!-- Pity Indicators -->
                    <div class="wheel-pity-container">
                        <div class="wheel-pity-box epic">
                            <div class="wheel-pity-label">
                                <span class="tier-name">ÉPICO GARANTIZADO</span>
                                <span id="pity-epic-count">0 / 20</span>
                            </div>
                            <div class="wheel-pity-bar-bg">
                                <div id="pity-epic-fill" class="wheel-pity-bar-fill" style="width: 0%;"></div>
                            </div>
                        </div>
                        <div class="wheel-pity-box legendary">
                            <div class="wheel-pity-label">
                                <span class="tier-name">LEGENDARIO</span>
                                <span id="pity-legendary-count">0 / 50</span>
                            </div>
                            <div class="wheel-pity-bar-bg">
                                <div id="pity-legendary-fill" class="wheel-pity-bar-fill" style="width: 0%;"></div>
                            </div>
                        </div>
                        <div class="wheel-pity-box mythic">
                            <div class="wheel-pity-label">
                                <span class="tier-name">MÍTICO</span>
                                <span id="pity-mythic-count">0 / 80</span>
                            </div>
                            <div class="wheel-pity-bar-bg">
                                <div id="pity-mythic-fill" class="wheel-pity-bar-fill" style="width: 0%;"></div>
                            </div>
                        </div>
                    </div>

                    <!-- The Wheel Stage -->
                    <div class="wheel-stage-wrapper">
                        <div class="wheel-cauldron-backdrop"></div>
                        <div class="wheel-pointer" id="wheel-pointer">
                            <svg viewBox="0 0 24 32">
                                <polygon points="12,30 2,4 22,4" />
                            </svg>
                        </div>
                        <div class="wheel-container-outer">
                            <canvas id="witch-wheel-canvas" width="300" height="300"></canvas>
                        </div>
                        <div class="wheel-center-orb">
                            <span>🔮</span>
                        </div>
                    </div>

                    <!-- Buttons & Controls -->
                    <div class="wheel-actions-panel">
                        <div class="wheel-spin-buttons-row">
                            <button id="wheel-spin-1x-btn" class="wheel-spin-btn">
                                <span class="wheel-spin-title">GIRAR x1</span>
                                <span class="wheel-spin-cost" id="wheel-spin-1x-cost">200 Coins</span>
                            </button>
                            <button id="wheel-spin-10x-btn" class="wheel-spin-btn btn-10x">
                                <span class="wheel-spin-discount-badge">-10% DESCUENTO</span>
                                <span class="wheel-spin-title">GIRAR x10</span>
                                <span class="wheel-spin-cost" id="wheel-spin-10x-cost">1,800 Coins</span>
                            </button>
                        </div>
                        <div class="wheel-subnav-row">
                            <button id="wheel-btn-rates" class="wheel-subnav-btn">
                                <span>ℹ</span> Ver Probabilidades & Recompensas
                            </button>
                            <button id="wheel-btn-history" class="wheel-subnav-btn">
                                <span>📜</span> Historial
                            </button>
                            <button id="wheel-btn-stats" class="wheel-subnav-btn">
                                <span>📊</span> Estadísticas
                            </button>
                        </div>
                    </div>
                </div>

                <!-- Sub-Modals: Rates, History, Stats, Confirm -->
                <div id="wheel-submodal-container" class="wheel-submodal-backdrop">
                    <div class="wheel-submodal-card">
                        <div class="wheel-submodal-header">
                            <h3 id="wheel-submodal-title">DETALLES</h3>
                            <button id="wheel-submodal-close" class="wheel-btn-close">&times;</button>
                        </div>
                        <div class="wheel-submodal-body" id="wheel-submodal-content">
                            <!-- Dynamic Content -->
                        </div>
                    </div>
                </div>

                <!-- Reward Reveal Dialog -->
                <div id="wheel-reveal-backdrop">
                    <div class="wheel-reveal-card" id="wheel-reveal-card">
                        <!-- Populated dynamically -->
                    </div>
                </div>
            </div>
        `;

        document.body.appendChild(overlay);
    },

    bindEvents() {
        // Close modal buttons
        const closeBtn = document.getElementById('wheel-close-btn');
        if (closeBtn) closeBtn.addEventListener('click', () => this.close());

        const overlay = document.getElementById('witch-wheel-overlay');
        if (overlay) {
            overlay.addEventListener('click', (e) => {
                if (e.target === overlay && !this.isSpinning) {
                    this.close();
                }
            });
        }

        // Submodal close
        const subClose = document.getElementById('wheel-submodal-close');
        if (subClose) {
            subClose.addEventListener('click', () => {
                const submodal = document.getElementById('wheel-submodal-container');
                if (submodal) submodal.classList.remove('active');
            });
        }

        // Audio toggle
        const audioBtn = document.getElementById('wheel-audio-toggle');
        if (audioBtn) {
            audioBtn.addEventListener('click', () => {
                this.audioMuted = !this.audioMuted;
                const icon = document.getElementById('wheel-audio-icon');
                if (icon) icon.textContent = this.audioMuted ? '🔇' : '🔊';
            });
        }

        // Currency switcher tabs
        document.querySelectorAll('.wheel-currency-tab').forEach(tab => {
            tab.addEventListener('click', () => {
                const cur = tab.getAttribute('data-currency');
                this.setCurrency(cur);
            });
        });

        // Spin buttons
        const spin1x = document.getElementById('wheel-spin-1x-btn');
        if (spin1x) spin1x.addEventListener('click', () => this.requestSpin(1));

        const spin10x = document.getElementById('wheel-spin-10x-btn');
        if (spin10x) spin10x.addEventListener('click', () => this.requestSpin(10));

        // Subnav buttons
        const ratesBtn = document.getElementById('wheel-btn-rates');
        if (ratesBtn) ratesBtn.addEventListener('click', () => this.showRatesModal());

        const histBtn = document.getElementById('wheel-btn-history');
        if (histBtn) histBtn.addEventListener('click', () => this.showHistoryModal());

        const statsBtn = document.getElementById('wheel-btn-stats');
        if (statsBtn) statsBtn.addEventListener('click', () => this.showStatsModal());

        // Header HUD button
        const hudWheelBtn = document.getElementById('hud-wheel-btn');
        if (hudWheelBtn) {
            hudWheelBtn.addEventListener('click', () => this.open());
        }

        // Topbar nav pass/wheel button if created
        const topbarBtn = document.getElementById('hw-topbar-wheel-btn');
        if (topbarBtn) {
            topbarBtn.addEventListener('click', () => this.open());
        }

        // Global Escape Key Listener
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                const reveal = document.getElementById('wheel-reveal-backdrop');
                if (reveal && reveal.classList.contains('active')) {
                    reveal.classList.remove('active');
                    return;
                }
                const submodal = document.getElementById('wheel-submodal-container');
                if (submodal && submodal.classList.contains('active')) {
                    submodal.classList.remove('active');
                    return;
                }
                const ov = document.getElementById('witch-wheel-overlay');
                if (ov && ov.classList.contains('active') && !this.isSpinning) {
                    this.close();
                }
            }
        });
    },

    open() {
        this.ensureUserDataProps();
        this.updateHUD();
        const ov = document.getElementById('witch-wheel-overlay');
        if (ov) {
            ov.classList.add('active');
            this.playWhooshSound(0.08);
        }
    },

    close() {
        if (this.isSpinning) return;
        const ov = document.getElementById('witch-wheel-overlay');
        if (ov) ov.classList.remove('active');
    },

    setCurrency(currency) {
        this.selectedCurrency = currency;
        document.querySelectorAll('.wheel-currency-tab').forEach(tab => {
            const isCur = tab.getAttribute('data-currency') === currency;
            tab.classList.toggle('selected', isCur);
        });

        const chipCoins = document.getElementById('wheel-chip-coins');
        const chipPump = document.getElementById('wheel-chip-pumpkin');
        if (chipCoins && chipPump) {
            chipCoins.classList.toggle('active', currency === 'coins');
            chipPump.classList.toggle('active', currency === 'pumpkin');
        }

        this.updateSpinButtonLabels();
    },

    updateSpinButtonLabels() {
        const cost1xEl = document.getElementById('wheel-spin-1x-cost');
        const cost10xEl = document.getElementById('wheel-spin-10x-cost');
        if (!cost1xEl || !cost10xEl) return;

        if (this.selectedCurrency === 'coins') {
            cost1xEl.textContent = `${this.CONFIG.costSingleCoins} Coins`;
            cost10xEl.textContent = `${this.CONFIG.costTenCoins.toLocaleString()} Coins`;
        } else {
            cost1xEl.textContent = `${this.CONFIG.costSinglePumpkin} Pumpkin Coins`;
            cost10xEl.textContent = `${this.CONFIG.costTenPumpkin.toLocaleString()} Pumpkin Coins`;
        }
    },

    updateHUD() {
        if (!window.Users || !Users.data) return;
        this.ensureUserDataProps();

        const user = Users.data;
        const coinsVal = document.getElementById('wheel-val-coins');
        const pumpVal = document.getElementById('wheel-val-pumpkin');
        if (coinsVal) coinsVal.textContent = (user.coins || 0).toLocaleString();
        if (pumpVal) pumpVal.textContent = (user.halloweenCoins || 0).toLocaleString();

        // Pity bars
        const pity = user.summonPity;
        const epicCount = document.getElementById('pity-epic-count');
        const epicFill = document.getElementById('pity-epic-fill');
        if (epicCount && epicFill) {
            epicCount.textContent = `${pity.epic} / ${this.CONFIG.pityEpicThreshold}`;
            const pct = Math.min(100, (pity.epic / this.CONFIG.pityEpicThreshold) * 100);
            epicFill.style.width = `${pct}%`;
        }

        const legCount = document.getElementById('pity-legendary-count');
        const legFill = document.getElementById('pity-legendary-fill');
        if (legCount && legFill) {
            legCount.textContent = `${pity.legendary} / ${this.CONFIG.pityLegendaryThreshold}`;
            const pct = Math.min(100, (pity.legendary / this.CONFIG.pityLegendaryThreshold) * 100);
            legFill.style.width = `${pct}%`;
        }

        const mytCount = document.getElementById('pity-mythic-count');
        const mytFill = document.getElementById('pity-mythic-fill');
        if (mytCount && mytFill) {
            mytCount.textContent = `${pity.mythic} / ${this.CONFIG.pityMythicThreshold}`;
            const pct = Math.min(100, (pity.mythic / this.CONFIG.pityMythicThreshold) * 100);
            mytFill.style.width = `${pct}%`;
        }

        this.updateSpinButtonLabels();
    },

    renderCanvasWheel() {
        const canvas = document.getElementById('witch-wheel-canvas');
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        const size = canvas.width;
        const center = size / 2;
        const radius = center - 4;
        const total = this.SLICES.length;
        const sliceAngle = (2 * Math.PI) / total;

        ctx.clearRect(0, 0, size, size);

        this.SLICES.forEach((slice, i) => {
            const startAngle = i * sliceAngle - Math.PI / 2;
            const endAngle = startAngle + sliceAngle;

            // Draw wedge
            ctx.beginPath();
            ctx.moveTo(center, center);
            ctx.arc(center, center, radius, startAngle, endAngle);
            ctx.closePath();
            ctx.fillStyle = slice.color;
            ctx.fill();

            // Border
            ctx.strokeStyle = slice.stroke;
            ctx.lineWidth = 1.5;
            ctx.stroke();

            // Label & glyph
            ctx.save();
            ctx.translate(center, center);
            ctx.rotate(startAngle + sliceAngle / 2);

            // Glyph
            ctx.font = '16px serif';
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.fillText(slice.glyph, radius * 0.72, 0);

            // Label
            ctx.font = 'bold 8px "Press Start 2P", monospace';
            ctx.fillStyle = '#fff';
            ctx.fillText(slice.label, radius * 0.44, 0);

            ctx.restore();
        });

        // Outer rim
        ctx.beginPath();
        ctx.arc(center, center, radius, 0, 2 * Math.PI);
        ctx.strokeStyle = '#ffd700';
        ctx.lineWidth = 2.5;
        ctx.stroke();
    },

    requestSpin(count) {
        console.log("Spin requested, count:", count);
        if (this.isSpinning) {
            console.log("Spin blocked: already spinning");
            return;
        }

        const isCoins = this.selectedCurrency === 'coins';
        const cost = count === 10
            ? (isCoins ? this.CONFIG.costTenCoins : this.CONFIG.costTenPumpkin)
            : (isCoins ? this.CONFIG.costSingleCoins : this.CONFIG.costSinglePumpkin);
        
        console.log("Currency:", this.selectedCurrency, "Cost:", cost);

        const currentBalance = isCoins
            ? (Users.data.coins || 0)
            : (Users.data.halloweenCoins || 0);
        
        console.log("Current balance:", currentBalance);

        if (currentBalance < cost) {
            console.log("Insufficient funds");
            const curName = isCoins ? 'Monedas Arcanas' : 'Pumpkin Coins';
            this.showSubmodalAlert('FONDOS INSUFICIENTES', `
                <div style="text-align:center; padding:16px;">
                    <p style="color:#f87171; font-size:1.1rem; font-weight:bold;">¡No tienes suficientes ${curName}!</p>
                    <p style="margin-top:8px; color:#cbd5e1;">Costo requerido: <strong>${cost.toLocaleString()}</strong><br>Tienes actualmente: <strong>${currentBalance.toLocaleString()}</strong></p>
                    <p style="margin-top:14px; font-size:0.75rem; color:#94a3b8;">Juega partidas en el modo clásico o completa misiones del Halloween Pass para conseguir más monedas.</p>
                </div>
            `);
            return;
        }

        console.log("Funds sufficient, proceeding to spin");

        // If 10x, show confirmation dialog first
        if (count === 10) {
            this.showConfirmationDialog(cost, currentBalance, isCoins, () => {
                this.executeSpin(10, cost, isCoins);
            });
        } else {
            this.executeSpin(1, cost, isCoins);
        }
    },

    showConfirmationDialog(cost, balance, isCoins, onConfirm) {
        const curName = isCoins ? 'Monedas Arcanas (🪙)' : 'Pumpkin Coins (🎃)';
        const afterBalance = balance - cost;

        const content = `
            <div style="text-align:center; padding:14px; display:flex; flex-direction:column; gap:12px;">
                <p style="font-size:1rem; color:#fef08a; font-weight:bold;">¿Deseas realizar una invocación x10?</p>
                <div style="background:rgba(0,0,0,0.5); padding:12px; border-radius:8px; border:1px solid rgba(255,117,24,0.3); font-size:0.75rem; text-align:left;">
                    <p>• <strong>Costo Total:</strong> <span style="color:#ff9a3c;">${cost.toLocaleString()} ${curName}</span></p>
                    <p style="margin-top:4px;">• <strong>Balance Actual:</strong> ${balance.toLocaleString()}</p>
                    <p style="margin-top:4px;">• <strong>Balance Restante:</strong> <span style="color:#4ade80;">${afterBalance.toLocaleString()}</span></p>
                </div>
                <div style="display:flex; justify-content:center; gap:12px; margin-top:8px;">
                    <button id="wheel-confirm-cancel" class="wheel-subnav-btn" style="padding:8px 18px;">CANCELAR</button>
                    <button id="wheel-confirm-accept" class="wheel-lobby-cta" style="padding:8px 22px; cursor:pointer;">CONFIRMAR x10</button>
                </div>
            </div>
        `;

        this.showSubmodalAlert('CONFIRMAR INVOCACIÓN x10', content);

        const cancelBtn = document.getElementById('wheel-confirm-cancel');
        const acceptBtn = document.getElementById('wheel-confirm-accept');

        if (cancelBtn) {
            cancelBtn.onclick = () => {
                const submodal = document.getElementById('wheel-submodal-container');
                if (submodal) submodal.classList.remove('active');
            };
        }

        if (acceptBtn) {
            acceptBtn.onclick = () => {
                const submodal = document.getElementById('wheel-submodal-container');
                if (submodal) submodal.classList.remove('active');
                onConfirm();
            };
        }
    },

    executeSpin(count, cost, isCoins) {
        this.isSpinning = true;
        this.setSpinButtonsDisabled(true);

        // Deduct currency
        if (isCoins) {
            Users.spendCoins(cost);
        } else {
            Users.spendPumpkins(cost);
        }

        // Track stats
        const stats = Users.data.summonStats;
        stats.totalSpins += count;
        if (isCoins) stats.coinsSpent += cost;
        else stats.pumpkinCoinsSpent += cost;

        // Progress Halloween Pass if active
        if (typeof HalloweenPass !== 'undefined' && HalloweenPass.recordCoinsEarned) {
            // Give event progress bonus for spinning
            HalloweenPass.recordCoinsEarned(Math.round(cost * 0.25));
        }

        // Generate rewards
        const results = [];
        for (let i = 0; i < count; i++) {
            const res = this.rollReward();
            results.push(res);
        }

        // Save immediately to prevent state loss
        Users.save();
        this.updateHUD();

        // Animate wheel
        const targetResult = count === 1 ? results[0] : this.getBestReward(results);
        const targetSliceIndex = this.findMatchingSliceIndex(targetResult.tier);

        this.animateWheelSpin(targetSliceIndex, () => {
            this.isSpinning = false;
            this.setSpinButtonsDisabled(false);
            this.presentRewardReveal(results);
        });
    },

    rollReward() {
        const pity = Users.data.summonPity;
        let chosenTier = 'Common';

        // Check Pity Thresholds
        if (pity.mythic >= this.CONFIG.pityMythicThreshold) {
            chosenTier = 'Mythic';
        } else if (pity.legendary >= this.CONFIG.pityLegendaryThreshold) {
            chosenTier = 'Legendary';
        } else if (pity.epic >= this.CONFIG.pityEpicThreshold) {
            chosenTier = 'Epic';
        } else {
            // RNG based on transparent drop rates
            const rand = Math.random();
            const rates = this.CONFIG.dropRates;
            if (rand < rates.Mythic) {
                chosenTier = 'Mythic';
            } else if (rand < rates.Mythic + rates.Legendary) {
                chosenTier = 'Legendary';
            } else if (rand < rates.Mythic + rates.Legendary + rates.Epic) {
                chosenTier = 'Epic';
            } else if (rand < rates.Mythic + rates.Legendary + rates.Epic + rates.Rare) {
                chosenTier = 'Rare';
            } else {
                chosenTier = 'Common';
            }
        }

        // Update Pity Counters
        if (chosenTier === 'Mythic') {
            pity.mythic = 0;
            pity.legendary = 0;
            pity.epic = 0;
        } else if (chosenTier === 'Legendary') {
            pity.legendary = 0;
            pity.epic = 0;
            pity.mythic++;
        } else if (chosenTier === 'Epic') {
            pity.epic = 0;
            pity.legendary++;
            pity.mythic++;
        } else {
            pity.epic++;
            pity.legendary++;
            pity.mythic++;
        }

        // Update stats counter
        const stats = Users.data.summonStats;
        if (chosenTier === 'Common') stats.commonCount++;
        else if (chosenTier === 'Rare') stats.rareCount++;
        else if (chosenTier === 'Epic') stats.epicCount++;
        else if (chosenTier === 'Legendary') stats.legendaryCount++;
        else if (chosenTier === 'Mythic') stats.mythicCount++;

        // Pick item from catalog for chosenTier
        const pool = this.REWARDS.filter(r => r.tier === chosenTier);
        const totalWeight = pool.reduce((sum, item) => sum + item.weight, 0);
        let roll = Math.random() * totalWeight;
        let selected = pool[0];

        for (const item of pool) {
            if (roll < item.weight) {
                selected = item;
                break;
            }
            roll -= item.weight;
        }

        // Check for duplicates (Banners / Frames)
        const granted = this.grantRealReward(selected);

        // Add to summon history (capped to last 20)
        const hist = Users.data.summonHistory;
        hist.unshift({
            name: selected.name,
            tier: selected.tier,
            glyph: selected.glyph,
            time: Date.now(),
            isDuplicate: granted.isDuplicate
        });
        if (hist.length > 20) hist.pop();

        return {
            ...selected,
            isDuplicate: granted.isDuplicate,
            compensation: granted.compensation
        };
    },

    grantRealReward(item) {
        const u = Users.data;
        let isDuplicate = false;
        let compensation = null;

        if (item.type === 'coins') {
            Users.addCoins(item.amount);
        } else if (item.type === 'pumpkin_coins') {
            u.halloweenCoins = (u.halloweenCoins || 0) + item.amount;
        } else if (item.type === 'shards') {
            u.runeShards = (u.runeShards || 0) + item.amount;
        } else if (item.type === 'xp') {
            if (typeof HalloweenPass !== 'undefined' && HalloweenPass.recordCoinsEarned) {
                HalloweenPass.recordCoinsEarned(item.amount);
            }
        } else if (item.type === 'potion') {
            // Grant a bonus rune charge or potion consumable
            u.runeQuantities = u.runeQuantities || {};
            u.runeQuantities['rune_shield'] = (u.runeQuantities['rune_shield'] || 0) + 1;
            if (!u.ownedRunes.includes('rune_shield')) u.ownedRunes.push('rune_shield');
        } else if (item.type === 'chest') {
            if (item.bundle) {
                if (item.bundle.coins) Users.addCoins(item.bundle.coins);
                if (item.bundle.pumpkinCoins) u.halloweenCoins = (u.halloweenCoins || 0) + item.bundle.pumpkinCoins;
                if (item.bundle.shards) u.runeShards = (u.runeShards || 0) + item.bundle.shards;
            }
        } else if (item.type === 'rune') {
            u.runeQuantities = u.runeQuantities || {};
            u.runeQuantities[item.runeId] = (u.runeQuantities[item.runeId] || 0) + 1;
            if (!u.ownedRunes.includes(item.runeId)) {
                u.ownedRunes.push(item.runeId);
            }
        } else if (item.type === 'banner') {
            u.ownedBanners = u.ownedBanners || [];
            if (u.ownedBanners.includes(item.bannerId)) {
                isDuplicate = true;
                const comp = item.duplicateCompensation || { shards: 150, pumpkinCoins: 100 };
                u.runeShards = (u.runeShards || 0) + comp.shards;
                u.halloweenCoins = (u.halloweenCoins || 0) + comp.pumpkinCoins;
                compensation = `+${comp.shards} Shards & +${comp.pumpkinCoins} 🎃`;
            } else {
                u.ownedBanners.push(item.bannerId);
            }
        } else if (item.type === 'frame') {
            u.ownedAvatarFrames = u.ownedAvatarFrames || [];
            if (u.ownedAvatarFrames.includes(item.frameId)) {
                isDuplicate = true;
                const comp = item.duplicateCompensation || { shards: 100, pumpkinCoins: 75 };
                u.runeShards = (u.runeShards || 0) + comp.shards;
                u.halloweenCoins = (u.halloweenCoins || 0) + comp.pumpkinCoins;
                compensation = `+${comp.shards} Shards & +${comp.pumpkinCoins} 🎃`;
            } else {
                u.ownedAvatarFrames.push(item.frameId);
            }
        }

        return { isDuplicate, compensation };
    },

    getBestReward(list) {
        const tierRank = { Mythic: 5, Legendary: 4, Epic: 3, Rare: 2, Common: 1 };
        return [...list].sort((a, b) => (tierRank[b.tier] || 0) - (tierRank[a.tier] || 0))[0];
    },

    findMatchingSliceIndex(tier) {
        const matchingIndices = [];
        this.SLICES.forEach((slice, idx) => {
            if (slice.tier === tier) matchingIndices.push(idx);
        });
        if (matchingIndices.length === 0) return 0;
        return matchingIndices[Math.floor(Math.random() * matchingIndices.length)];
    },

    animateWheelSpin(targetSliceIndex, onComplete) {
        const canvas = document.getElementById('witch-wheel-canvas');
        const pointer = document.getElementById('wheel-pointer');
        if (!canvas) {
            onComplete();
            return;
        }

        const isPotato = document.body.classList.contains('potato-mode') || window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        const totalSlices = this.SLICES.length;
        const sliceDegrees = 360 / totalSlices;

        // Pointer is at the top (0 degrees). A slice at index i is centered at (i + 0.5) * sliceDegrees.
        // To bring slice i to the top, we need rotation % 360 = (360 - (i + 0.5) * sliceDegrees)
        const targetOffset = 360 - (targetSliceIndex + 0.5) * sliceDegrees;
        const extraRotations = isPotato ? 1 : 5; // 5 full loops
        const finalRotation = this.currentRotation + (extraRotations * 360) + ((targetOffset - (this.currentRotation % 360) + 360) % 360);

        this.currentRotation = finalRotation;

        this.playWhooshSound(0.25);

        // Ticking audio loop
        let tickInterval = null;
        if (!this.audioMuted && !isPotato) {
            let tickCount = 0;
            const maxTicks = 35;
            tickInterval = setInterval(() => {
                tickCount++;
                this.playTickSound();
                if (pointer) {
                    pointer.classList.add('tick');
                    setTimeout(() => pointer.classList.remove('tick'), 60);
                }
                if (tickCount >= maxTicks) {
                    clearInterval(tickInterval);
                }
            }, 100);
        }

        if (isPotato) {
            canvas.style.transition = 'transform 0.4s ease-out';
            canvas.style.transform = `rotate(${finalRotation}deg)`;
            setTimeout(() => {
                if (tickInterval) clearInterval(tickInterval);
                onComplete();
            }, 450);
        } else {
            canvas.style.transition = 'transform 4s cubic-bezier(0.12, 0.8, 0.32, 1)';
            canvas.style.transform = `rotate(${finalRotation}deg)`;
            setTimeout(() => {
                if (tickInterval) clearInterval(tickInterval);
                onComplete();
            }, 4150);
        }
    },

    presentRewardReveal(results) {
        const backdrop = document.getElementById('wheel-reveal-backdrop');
        const card = document.getElementById('wheel-reveal-card');
        if (!backdrop || !card) return;

        const best = this.getBestReward(results);
        this.playTierFanfare(best.tier);

        if (results.length === 1) {
            const item = results[0];
            const starCount = item.tier === 'Mythic' ? '★★★★★★' : (item.tier === 'Legendary' ? '★★★★★' : (item.tier === 'Epic' ? '★★★★' : (item.tier === 'Rare' ? '★★★' : '★★')));
            const tierColor = item.tier === 'Mythic' ? '#f43f5e' : (item.tier === 'Legendary' ? '#f59e0b' : (item.tier === 'Epic' ? '#c084fc' : (item.tier === 'Rare' ? '#38bdf8' : '#94a3b8')));

            card.innerHTML = `
                <div class="wheel-reveal-eyebrow" style="color: ${tierColor};">¡INVOCACIÓN COMPLETADA!</div>
                <div class="wheel-reveal-stars">${starCount}</div>
                <div class="wheel-reveal-single-content">
                    <div class="wheel-reveal-icon-large" style="background: rgba(255,255,255,0.06); border: 2px solid ${tierColor};">
                        <span>${item.glyph}</span>
                    </div>
                    <div class="wheel-reveal-name" style="color: ${tierColor};">${item.name}</div>
                    <div class="wheel-reveal-desc">${item.desc}</div>
                    ${item.isDuplicate
                        ? `<div class="wheel-reveal-dup">DUPLICADO: ¡Ya poseías este cosmético!<br>Compensación: ${item.compensation}</div>`
                        : `<div class="wheel-reveal-added">✔ AÑADIDO DIRECTAMENTE A TU INVENTARIO REAL</div>`
                    }
                </div>
                <button id="wheel-reveal-btn-ok" class="wheel-lobby-cta" style="margin-top:10px; padding:10px 24px; cursor:pointer;">RECOGER RECOMPENSA</button>
            `;
        } else {
            // 10-Pull grid
            let miniCards = '';
            results.forEach(item => {
                const tierClass = item.tier.toLowerCase();
                miniCards += `
                    <div class="wheel-reveal-mini-card ${tierClass}">
                        <div class="mini-icon">${item.glyph}</div>
                        <div class="mini-name" title="${item.name}">${item.name}</div>
                        <div class="mini-rarity" style="color:${item.tier === 'Mythic' ? '#f43f5e' : (item.tier === 'Legendary' ? '#f59e0b' : '#c084fc')};">${item.tier}</div>
                        ${item.isDuplicate ? '<span style="font-size:0.5rem; color:#f59e0b;">(DUP)</span>' : ''}
                    </div>
                `;
            });

            card.innerHTML = `
                <div class="wheel-reveal-eyebrow">¡INVOCACIÓN MÚLTIPLE x10 COMPLETADA!</div>
                <div class="wheel-reveal-grid-10">
                    ${miniCards}
                </div>
                <div class="wheel-reveal-added" style="margin-top:4px;">✔ TODAS LAS RECOMPENSAS GUARDADAS EN TU PERFIL REAL</div>
                <button id="wheel-reveal-btn-ok" class="wheel-lobby-cta" style="margin-top:10px; padding:10px 24px; cursor:pointer;">RECOGER TODO</button>
            `;
        }

        backdrop.classList.add('active');

        const okBtn = document.getElementById('wheel-reveal-btn-ok');
        if (okBtn) {
            okBtn.onclick = () => {
                backdrop.classList.remove('active');
            };
        }
    },

    setSpinButtonsDisabled(disabled) {
        const b1 = document.getElementById('wheel-spin-1x-btn');
        const b10 = document.getElementById('wheel-spin-10x-btn');
        if (b1) b1.disabled = disabled;
        if (b10) b10.disabled = disabled;
    },

    // -------------------------------------------------------------------------
    // Submodals: Rates, History, Stats
    // -------------------------------------------------------------------------
    showRatesModal() {
        let catalogRows = '';
        this.REWARDS.forEach(r => {
            const tierColor = r.tier === 'Mythic' ? '#f43f5e' : (r.tier === 'Legendary' ? '#f59e0b' : (r.tier === 'Epic' ? '#c084fc' : (r.tier === 'Rare' ? '#38bdf8' : '#94a3b8')));
            let statusBadge = '';
            const u = Users.data;
            if (r.type === 'banner' && u.ownedBanners && u.ownedBanners.includes(r.bannerId)) {
                statusBadge = '<span style="color:#22c55e;">[POSEÍDO]</span>';
            } else if (r.type === 'rune' && u.runeQuantities && u.runeQuantities[r.runeId] > 0) {
                statusBadge = `<span style="color:#22c55e;">[TIENES x${u.runeQuantities[r.runeId]}]</span>`;
            }

            catalogRows += `
                <div class="wheel-preview-item ${r.tier.toLowerCase()}">
                    <div class="wheel-preview-item-top">
                        <span class="wheel-preview-item-name" style="color:${tierColor};">${r.glyph} ${r.name}</span>
                        <span style="font-size:0.6rem; font-weight:bold; color:${tierColor};">${r.tier.toUpperCase()}</span>
                    </div>
                    <div class="wheel-preview-item-desc">${r.desc}</div>
                    <div class="wheel-preview-item-status">${statusBadge}</div>
                </div>
            `;
        });

        const content = `
            <div>
                <h4 style="color:#ff9a3c; font-size:0.85rem; margin-bottom:8px;">PROBABILIDADES TRANSPARENTES (DROP RATES)</h4>
                <table class="wheel-rates-table">
                    <thead>
                        <tr>
                            <th>RAREZA</th>
                            <th>PROBABILIDAD</th>
                            <th>GARANTÍA (PITY)</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td style="color:#f43f5e; font-weight:bold;">MÍTICO (Mythic)</td>
                            <td>1.50%</td>
                            <td>Garantizado cada 80 giros</td>
                        </tr>
                        <tr>
                            <td style="color:#f59e0b; font-weight:bold;">LEGENDARIO (Legendary)</td>
                            <td>4.50%</td>
                            <td>Garantizado cada 50 giros</td>
                        </tr>
                        <tr>
                            <td style="color:#c084fc; font-weight:bold;">ÉPICO (Epic)</td>
                            <td>13.00%</td>
                            <td>Garantizado cada 20 giros</td>
                        </tr>
                        <tr>
                            <td style="color:#38bdf8; font-weight:bold;">RARO (Rare)</td>
                            <td>26.00%</td>
                            <td>Probabilidad estándar</td>
                        </tr>
                        <tr>
                            <td style="color:#94a3b8; font-weight:bold;">COMÚN (Common)</td>
                            <td>55.00%</td>
                            <td>Probabilidad estándar</td>
                        </tr>
                    </tbody>
                </table>

                <h4 style="color:#ff9a3c; font-size:0.85rem; margin:16px 0 8px 0;">CATÁLOGO DE RECOMPENSAS POSIBLES</h4>
                <div class="wheel-preview-grid">
                    ${catalogRows}
                </div>
            </div>
        `;

        this.showSubmodalAlert('PROBABILIDADES Y CATÁLOGO', content);
    },

    showHistoryModal() {
        const hist = (Users.data && Users.data.summonHistory) || [];
        if (hist.length === 0) {
            this.showSubmodalAlert('HISTORIAL DE INVOCACIONES', '<p style="text-align:center; padding:20px; color:#94a3b8;">Aún no has realizado invocaciones en este evento.</p>');
            return;
        }

        let listHtml = '<div style="display:flex; flex-direction:column; gap:8px;">';
        hist.forEach((item, idx) => {
            const dateStr = new Date(item.time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
            const tierColor = item.tier === 'Mythic' ? '#f43f5e' : (item.tier === 'Legendary' ? '#f59e0b' : (item.tier === 'Epic' ? '#c084fc' : (item.tier === 'Rare' ? '#38bdf8' : '#94a3b8')));
            listHtml += `
                <div style="background:rgba(0,0,0,0.4); border:1px solid rgba(255,255,255,0.08); padding:8px 12px; border-radius:6px; display:flex; justify-content:space-between; align-items:center;">
                    <div style="display:flex; align-items:center; gap:8px;">
                        <span>${item.glyph}</span>
                        <strong style="color:${tierColor}; font-size:0.78rem;">${item.name}</strong>
                        ${item.isDuplicate ? '<span style="font-size:0.55rem; color:#f59e0b; border:1px solid #f59e0b; padding:1px 4px; border-radius:3px;">DUPLICADO</span>' : ''}
                    </div>
                    <div style="display:flex; align-items:center; gap:12px;">
                        <span style="font-size:0.6rem; color:${tierColor}; font-weight:bold;">${item.tier}</span>
                        <span style="font-size:0.55rem; color:#64748b;">${dateStr}</span>
                    </div>
                </div>
            `;
        });
        listHtml += '</div>';

        this.showSubmodalAlert('HISTORIAL DE INVOCACIONES (ÚLTIMAS 20)', listHtml);
    },

    showStatsModal() {
        const stats = (Users.data && Users.data.summonStats) || {
            totalSpins: 0, coinsSpent: 0, pumpkinCoinsSpent: 0,
            commonCount: 0, rareCount: 0, epicCount: 0, legendaryCount: 0, mythicCount: 0
        };

        const total = stats.totalSpins || 0;
        const calcPct = count => total > 0 ? ((count / total) * 100).toFixed(1) + '%' : '0.0%';

        const content = `
            <div style="display:flex; flex-direction:column; gap:12px;">
                <div style="display:grid; grid-template-columns:repeat(3, 1fr); gap:8px;">
                    <div style="background:rgba(0,0,0,0.5); padding:10px; border-radius:8px; border:1px solid rgba(255,117,24,0.3); text-align:center;">
                        <div style="font-size:0.55rem; color:#cbd5e1; font-family:'Press Start 2P';">TOTAL GIROS</div>
                        <div style="font-size:1.2rem; font-weight:bold; color:#ff9a3c; margin-top:4px;">${total}</div>
                    </div>
                    <div style="background:rgba(0,0,0,0.5); padding:10px; border-radius:8px; border:1px solid rgba(255,117,24,0.3); text-align:center;">
                        <div style="font-size:0.55rem; color:#cbd5e1; font-family:'Press Start 2P';">COINS GASTADAS</div>
                        <div style="font-size:1.1rem; font-weight:bold; color:#fef08a; margin-top:4px;">${stats.coinsSpent.toLocaleString()}</div>
                    </div>
                    <div style="background:rgba(0,0,0,0.5); padding:10px; border-radius:8px; border:1px solid rgba(255,117,24,0.3); text-align:center;">
                        <div style="font-size:0.55rem; color:#cbd5e1; font-family:'Press Start 2P';">🎃 GASTADAS</div>
                        <div style="font-size:1.1rem; font-weight:bold; color:#fb923c; margin-top:4px;">${stats.pumpkinCoinsSpent.toLocaleString()}</div>
                    </div>
                </div>

                <h4 style="color:#ff9a3c; font-size:0.85rem; margin-top:6px;">DISTRIBUCIÓN POR RAREZA OBTENIDA</h4>
                <div style="display:flex; flex-direction:column; gap:6px; font-size:0.75rem;">
                    <div style="display:flex; justify-content:space-between; background:rgba(244,63,94,0.1); border:1px solid rgba(244,63,94,0.3); padding:6px 12px; border-radius:6px;">
                        <span style="color:#f43f5e; font-weight:bold;">Mítico:</span>
                        <span><strong>${stats.mythicCount}</strong> (${calcPct(stats.mythicCount)})</span>
                    </div>
                    <div style="display:flex; justify-content:space-between; background:rgba(245,158,11,0.1); border:1px solid rgba(245,158,11,0.3); padding:6px 12px; border-radius:6px;">
                        <span style="color:#f59e0b; font-weight:bold;">Legendario:</span>
                        <span><strong>${stats.legendaryCount}</strong> (${calcPct(stats.legendaryCount)})</span>
                    </div>
                    <div style="display:flex; justify-content:space-between; background:rgba(168,85,247,0.1); border:1px solid rgba(168,85,247,0.3); padding:6px 12px; border-radius:6px;">
                        <span style="color:#c084fc; font-weight:bold;">Épico:</span>
                        <span><strong>${stats.epicCount}</strong> (${calcPct(stats.epicCount)})</span>
                    </div>
                    <div style="display:flex; justify-content:space-between; background:rgba(56,189,248,0.1); border:1px solid rgba(56,189,248,0.3); padding:6px 12px; border-radius:6px;">
                        <span style="color:#38bdf8; font-weight:bold;">Raro:</span>
                        <span><strong>${stats.rareCount}</strong> (${calcPct(stats.rareCount)})</span>
                    </div>
                    <div style="display:flex; justify-content:space-between; background:rgba(148,163,184,0.1); border:1px solid rgba(148,163,184,0.3); padding:6px 12px; border-radius:6px;">
                        <span style="color:#94a3b8; font-weight:bold;">Común:</span>
                        <span><strong>${stats.commonCount}</strong> (${calcPct(stats.commonCount)})</span>
                    </div>
                </div>
            </div>
        `;

        this.showSubmodalAlert('ESTADÍSTICAS DEL EVENTO', content);
    },

    showSubmodalAlert(title, htmlContent) {
        const titleEl = document.getElementById('wheel-submodal-title');
        const contentEl = document.getElementById('wheel-submodal-content');
        const submodal = document.getElementById('wheel-submodal-container');
        if (!titleEl || !contentEl || !submodal) return;

        titleEl.textContent = title;
        contentEl.innerHTML = htmlContent;
        submodal.classList.add('active');
    },

    // -------------------------------------------------------------------------
    // Procedural Audio Synthesizer (Web Audio API)
    // -------------------------------------------------------------------------
    getAudioContext() {
        if (!this.audioCtx) {
            const AudioContext = window.AudioContext || window.webkitAudioContext;
            if (AudioContext) {
                this.audioCtx = new AudioContext();
            }
        }
        if (this.audioCtx && this.audioCtx.state === 'suspended') {
            this.audioCtx.resume().catch(() => {});
        }
        return this.audioCtx;
    },

    playTickSound() {
        if (this.audioMuted) return;
        try {
            const ctx = this.getAudioContext();
            if (!ctx) return;
            const osc = ctx.createOscillator();
            const gain = ctx.createGain();

            osc.type = 'triangle';
            osc.frequency.setValueAtTime(420, ctx.currentTime);
            osc.frequency.exponentialRampToValueAtTime(120, ctx.currentTime + 0.04);

            gain.gain.setValueAtTime(0.08, ctx.currentTime);
            gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.04);

            osc.connect(gain);
            gain.connect(ctx.destination);

            osc.start();
            osc.stop(ctx.currentTime + 0.04);
        } catch (e) {}
    },

    playWhooshSound(duration = 0.25) {
        if (this.audioMuted) return;
        try {
            const ctx = this.getAudioContext();
            if (!ctx) return;
            const osc = ctx.createOscillator();
            const gain = ctx.createGain();

            osc.type = 'sine';
            osc.frequency.setValueAtTime(180, ctx.currentTime);
            osc.frequency.exponentialRampToValueAtTime(450, ctx.currentTime + duration * 0.5);
            osc.frequency.exponentialRampToValueAtTime(110, ctx.currentTime + duration);

            gain.gain.setValueAtTime(0.01, ctx.currentTime);
            gain.gain.linearRampToValueAtTime(0.12, ctx.currentTime + duration * 0.4);
            gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + duration);

            osc.connect(gain);
            gain.connect(ctx.destination);

            osc.start();
            osc.stop(ctx.currentTime + duration);
        } catch (e) {}
    },

    playTierFanfare(tier) {
        if (this.audioMuted) return;
        try {
            const ctx = this.getAudioContext();
            if (!ctx) return;

            const chords = {
                Common: [261.63, 329.63], // C, E
                Rare: [329.63, 392.00, 523.25], // E, G, C
                Epic: [392.00, 493.88, 587.33, 783.99], // G, B, D, G
                Legendary: [440.00, 554.37, 659.25, 880.00, 1108.73], // A, C#, E, A, C#
                Mythic: [523.25, 659.25, 783.99, 1046.50, 1318.51, 1567.98] // Grand celestial arpeggio
            };

            const notes = chords[tier] || chords.Common;
            notes.forEach((freq, idx) => {
                const osc = ctx.createOscillator();
                const gain = ctx.createGain();
                const startTime = ctx.currentTime + (idx * 0.08);

                osc.type = tier === 'Mythic' ? 'sine' : (tier === 'Legendary' ? 'triangle' : 'sine');
                osc.frequency.setValueAtTime(freq, startTime);

                gain.gain.setValueAtTime(0.001, startTime);
                gain.gain.linearRampToValueAtTime(0.12, startTime + 0.04);
                gain.gain.exponentialRampToValueAtTime(0.001, startTime + 0.7);

                osc.connect(gain);
                gain.connect(ctx.destination);

                osc.start(startTime);
                osc.stop(startTime + 0.75);
            });
        } catch (e) {}
    }
};

// Auto-initialize when document is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => WitchWheel.init());
} else {
    WitchWheel.init();
}

window.WitchWheel = WitchWheel;
