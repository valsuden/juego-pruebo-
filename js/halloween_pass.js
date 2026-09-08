// =============================================================================
// HALLOWEEN PASS — TRIALS OF MASTERY
// 25 Level Seasonal Event Pass System
// =============================================================================

const HalloweenPass = {
    // 25 Exact Specified Rewards
    rewards: [
        {
            level: 1,
            name: "Pumpkin Coins",
            rewardText: "+100 Halloween Coins",
            type: "halloween_coins",
            amount: 100,
            icon: "coin",
            zone: "Pumpkin Village",
            desc: "Monedas del evento de Halloween para intercambios exclusivos y recompensas de temporada."
        },
        {
            level: 2,
            name: "XP Boost",
            rewardText: "+250 XP",
            type: "xp",
            amount: 250,
            icon: "potion",
            zone: "Pumpkin Village",
            desc: "Poción que otorga un impulso directo de 250 puntos de experiencia a tu maestro."
        },
        {
            level: 3,
            name: "Halloween Rune Shard",
            rewardText: "+2 Rune Shards",
            type: "shards",
            amount: 2,
            icon: "gem",
            zone: "Pumpkin Village",
            desc: "Fragmentos místicos imbuidos de magia de calabaza usados para forjar runas."
        },
        {
            level: 4,
            name: "Coins",
            rewardText: "+250 Coins",
            type: "coins",
            amount: 250,
            icon: "coin",
            zone: "Pumpkin Village",
            desc: "Monedas Arcanas añadidas directamente a tu balance para usar en la tienda."
        },
        {
            level: 5,
            name: "Pumpkin Chest",
            rewardText: "Halloween Chest",
            type: "chest",
            chestType: "pumpkin",
            icon: "chest",
            zone: "Pumpkin Village",
            desc: "Un cofre de calabaza sellado con runas y monedas arcanas de la cosecha sombría."
        },
        {
            level: 6,
            name: "XP",
            rewardText: "+500 XP",
            type: "xp",
            amount: 500,
            icon: "potion",
            zone: "Haunted Forest",
            desc: "500 XP de bonificación por adentrarte en la espesura del bosque encantado."
        },
        {
            level: 7,
            name: "Rune",
            rewardText: "1 Random Rune",
            type: "rune",
            rarity: "Common",
            icon: "rune",
            zone: "Haunted Forest",
            desc: "Una reliquia rúnica aleatoria añadida a tu inventario real para usar en tus pruebas."
        },
        {
            level: 8,
            name: "Halloween Coins",
            rewardText: "+500 Halloween Coins",
            type: "halloween_coins",
            amount: 500,
            icon: "coin",
            zone: "Haunted Forest",
            desc: "+500 Halloween Coins para adquirir cosméticos y tesoros de temporada."
        },
        {
            level: 9,
            name: "Potion",
            rewardText: "XP Boost Potion",
            type: "potion",
            icon: "potion",
            zone: "Haunted Forest",
            desc: "Frasco mágico de energía oscura que acelera tu entrenamiento arcano."
        },
        {
            level: 10,
            name: "Rare Rune",
            rewardText: "1 Rare Rune",
            type: "rune",
            rarity: "Rare",
            icon: "rune",
            zone: "Haunted Forest",
            desc: "Una poderosa Runa Rara forjada con esencia espectral para tu inventario."
        },
        {
            level: 11,
            name: "Coins",
            rewardText: "+750 Coins",
            type: "coins",
            amount: 750,
            icon: "coin",
            zone: "Cursed Cemetery",
            desc: "+750 Monedas Arcanas encontradas entre las lápidas milenarias."
        },
        {
            level: 12,
            name: "Halloween Chest",
            rewardText: "1 Halloween Chest",
            type: "chest",
            chestType: "spooky",
            icon: "chest",
            zone: "Cursed Cemetery",
            desc: "Cofre sellado que contiene múltiples tesoros rúnicos y monedas arcanas."
        },
        {
            level: 13,
            name: "XP",
            rewardText: "+750 XP",
            type: "xp",
            amount: 750,
            icon: "potion",
            zone: "Cursed Cemetery",
            desc: "+750 XP de maestría para avanzar en tu sendero arcano."
        },
        {
            level: 14,
            name: "Rune Shards",
            rewardText: "+5 Rune Shards",
            type: "shards",
            amount: 5,
            icon: "gem",
            zone: "Cursed Cemetery",
            desc: "+5 Fragmentos de Runa para mejorar tus reliquias en el inventario."
        },
        {
            level: 15,
            name: "Halloween Banner",
            rewardText: "Halloween Player Banner",
            type: "banner",
            bannerId: "halloween_haunt",
            icon: "banner",
            zone: "Cursed Cemetery",
            desc: "Estandarte exclusivo 'Halloween Haunt'. ¡Se equipa directamente en tu perfil de jugador!"
        },
        {
            level: 16,
            name: "Coins",
            rewardText: "+1,000 Coins",
            type: "coins",
            amount: 1000,
            icon: "coin",
            zone: "Witch's Castle",
            desc: "+1,000 Monedas Arcanas depositadas en tu cuenta de jugador."
        },
        {
            level: 17,
            name: "Rare Chest",
            rewardText: "1 Rare Halloween Chest",
            type: "chest",
            chestType: "rare_spooky",
            icon: "chest",
            zone: "Witch's Castle",
            desc: "Cofre con alta probabilidad de runas raras y fragmentos mágicos."
        },
        {
            level: 18,
            name: "XP Boost",
            rewardText: "+1 XP Boost",
            type: "xp",
            amount: 1000,
            icon: "potion",
            zone: "Witch's Castle",
            desc: "+1 Gran Impulso de Experiencia (+1000 XP) otorgado por la magia del castillo."
        },
        {
            level: 19,
            name: "Epic Rune Fragment",
            rewardText: "+3 Epic Rune Fragments",
            type: "shards",
            amount: 3,
            icon: "gem",
            zone: "Witch's Castle",
            desc: "+3 Fragmentos Épicos de Runa para transmutación de artefactos."
        },
        {
            level: 20,
            name: "Halloween Avatar Frame",
            rewardText: "Halloween Avatar Frame",
            type: "frame",
            frameId: "frame-pumpkin",
            icon: "scroll",
            zone: "Witch's Castle",
            desc: "Marco estacional 'Jack-o-Lantern Glow' para rodear tu avatar y destacar en el Hall of Champions."
        },
        {
            level: 21,
            name: "Coins",
            rewardText: "+1,250 Coins",
            type: "coins",
            amount: 1250,
            icon: "coin",
            zone: "Halloween Throne",
            desc: "+1,250 Monedas Arcanas para la recta final de tu maestría."
        },
        {
            level: 22,
            name: "Epic Rune",
            rewardText: "1 Epic Rune",
            type: "rune",
            rarity: "Epic",
            icon: "rune",
            zone: "Halloween Throne",
            desc: "Una codiciada Runa Épica lista para equipar y usar en el juego."
        },
        {
            level: 23,
            name: "Halloween Chest",
            rewardText: "1 Premium Halloween Chest",
            type: "chest",
            chestType: "premium",
            icon: "chest",
            zone: "Halloween Throne",
            desc: "Cofre supremo con grandes montos de monedas, gemas y bendiciones arcanas."
        },
        {
            level: 24,
            name: "Legendary Fragment",
            rewardText: "+1 Legendary Fragment",
            type: "shards",
            amount: 1,
            icon: "gem",
            zone: "Halloween Throne",
            desc: "+1 Fragmento Legendario, el catalizador supremo de las sombras."
        },
        {
            level: 25,
            name: "HALLOWEEN MASTER REWARD",
            rewardText: "HALLOWEEN LEGENDARY CHEST",
            type: "master",
            chestType: "legendary_master",
            bannerId: "halloween_throne",
            frameId: "frame-throne",
            icon: "trophy",
            zone: "Halloween Throne",
            isFinal: true,
            desc: "EL GRAN PREMIO FINAL: 2,500 Coins + 1,000 Halloween Coins + Runa Mítica + Estandarte Supremo 'Halloween Throne' + Marco Dorado 'Throne Aura'!"
        }
    ],

    // XP calculation: 200 XP per level
    XP_PER_LEVEL: 200,

    // Active seasonal missions
    defaultMissions: [
        {
            id: "m_trials",
            title: "Trials of Darkness",
            desc: "Completa 3 Trials victoriosos.",
            target: 3,
            rewardXP: 300,
            key: "trialsCompleted"
        },
        {
            id: "m_words",
            title: "Word Enchanter",
            desc: "Acierta 10 respuestas correctas.",
            target: 10,
            rewardXP: 250,
            key: "wordsCorrect"
        },
        {
            id: "m_streak",
            title: "Spooky Combo",
            desc: "Alcanza una racha de 5 aciertos.",
            target: 5,
            rewardXP: 200,
            key: "maxStreak"
        },
        {
            id: "m_coins",
            title: "Spectral Collector",
            desc: "Gana 100 Monedas Arcanas.",
            target: 100,
            rewardXP: 250,
            key: "coinsEarned"
        }
    ],

    activeTab: "track", // "track" | "missions" | "stats"

    // =========================================================================
    // INIT
    // =========================================================================
    init() {
        this._injectUI();
        this._bindEvents();
        this.updatePassDisplay();
    },

    // =========================================================================
    // USER DATA HELPERS
    // =========================================================================
    _ensurePassData() {
        if (!Users || !Users.data) return null;
        if (typeof Users.data.eventXP !== "number") Users.data.eventXP = 0;
        if (typeof Users.data.halloweenCoins !== "number") Users.data.halloweenCoins = 0;
        if (!Array.isArray(Users.data.claimedPassRewards)) Users.data.claimedPassRewards = [];
        if (!Users.data.eventStats) {
            Users.data.eventStats = {
                trialsCompleted: 0,
                wordsCorrect: 0,
                maxStreak: 0,
                coinsEarned: 0,
                missionsCompleted: 0
            };
        }
        if (!Users.data.claimedMissions) Users.data.claimedMissions = [];
        if (!Array.isArray(Users.data.ownedAvatarFrames)) Users.data.ownedAvatarFrames = ['frame-none'];
        return Users.data;
    },

    getCurrentXP() {
        const d = this._ensurePassData();
        return d ? d.eventXP : 0;
    },

    getHalloweenCoins() {
        const d = this._ensurePassData();
        return d ? d.halloweenCoins : 0;
    },

    getPassLevel() {
        const xp = this.getCurrentXP();
        const lvl = Math.floor(xp / this.XP_PER_LEVEL);
        return Math.min(25, lvl);
    },

    getXPToNextReward() {
        const xp = this.getCurrentXP();
        const lvl = this.getPassLevel();
        if (lvl >= 25) return 0;
        const target = (lvl + 1) * this.XP_PER_LEVEL;
        return target - xp;
    },

    getClaimedRewards() {
        const d = this._ensurePassData();
        return d ? d.claimedPassRewards : [];
    },

    isClaimed(level) {
        return this.getClaimedRewards().includes(level);
    },

    isUnlocked(level) {
        return this.getPassLevel() >= level;
    },

    canClaim(level) {
        return this.isUnlocked(level) && !this.isClaimed(level);
    },

    hasAnyClaimable() {
        return this.rewards.some(r => this.canClaim(r.level));
    },

    // =========================================================================
    // ADD EVENT XP & PROGRESSION
    // =========================================================================
    addEventXP(amount, reason = "") {
        if (!Users || !Users.data) return;
        const d = this._ensurePassData();
        if (!d || amount <= 0) return;

        const prevLevel = this.getPassLevel();
        d.eventXP += amount;
        const newLevel = this.getPassLevel();

        Users.save();
        this.updatePassDisplay();

        // Level Up Notification
        if (newLevel > prevLevel) {
            this._notifyLevelUp(prevLevel, newLevel);
        } else if (reason && typeof toast === "function") {
            toast(`🎃 +${amount} Event XP (${reason})`, "info");
        }
    },

    addHalloweenCoins(amount) {
        const d = this._ensurePassData();
        if (!d) return;
        d.halloweenCoins = (d.halloweenCoins || 0) + amount;
        Users.save();
        this.updatePassDisplay();
    },

    // Record game activities for seasonal quests & XP
    recordTrialComplete(wordsCount, streak) {
        const d = this._ensurePassData();
        if (!d) return;

        d.eventStats.trialsCompleted = (d.eventStats.trialsCompleted || 0) + 1;
        d.eventStats.wordsCorrect = (d.eventStats.wordsCorrect || 0) + (wordsCount || 0);
        if (streak > (d.eventStats.maxStreak || 0)) {
            d.eventStats.maxStreak = streak;
        }

        // Grant real Event XP for completing a trial
        this.addEventXP(150, "Trial Completed");
        this._checkMissions();
    },

    recordWordCorrect() {
        const d = this._ensurePassData();
        if (!d) return;
        d.eventStats.wordsCorrect = (d.eventStats.wordsCorrect || 0) + 1;
        this.addEventXP(15);
        this._checkMissions();
    },

    recordCoinsEarned(amount) {
        const d = this._ensurePassData();
        if (!d) return;
        d.eventStats.coinsEarned = (d.eventStats.coinsEarned || 0) + amount;
        this._checkMissions();
    },

    _checkMissions() {
        const d = this._ensurePassData();
        if (!d) return;

        let claimedAny = false;
        this.defaultMissions.forEach(m => {
            if (!d.claimedMissions.includes(m.id)) {
                const currentVal = d.eventStats[m.key] || 0;
                if (currentVal >= m.target) {
                    d.claimedMissions.push(m.id);
                    d.eventStats.missionsCompleted = (d.eventStats.missionsCompleted || 0) + 1;
                    this.addEventXP(m.rewardXP, `Mission Complete: ${m.title}`);
                    claimedAny = true;
                }
            }
        });

        if (claimedAny) {
            Users.save();
            this.updatePassDisplay();
        }
    },

    // =========================================================================
    // CLAIM REWARD (SECURE REAL INVENTORY INTEGRATION)
    // =========================================================================
    claimReward(level) {
        if (!Users || !Users.data) {
            if (typeof toast === "function") toast("Por favor selecciona tu nombre primero.", "error");
            return false;
        }

        const reward = this.rewards.find(r => r.level === level);
        if (!reward) return false;

        if (!this.isUnlocked(level)) {
            if (typeof toast === "function") toast(`Nivel ${level} aún bloqueado. Se requiere Nivel ${level}.`, "error");
            return false;
        }

        if (this.isClaimed(level)) {
            if (typeof toast === "function") toast("Esta recompensa ya ha sido reclamada.", "error");
            return false;
        }

        // Apply reward to real user profile
        this._grantRewardItem(reward);

        // Mark claimed & persist
        Users.data.claimedPassRewards.push(level);
        Users.save();
        Users.updateUI();

        // Audio & Visual feedback
        if (window.UI && typeof UI.playSound === "function") {
            UI.playSound("victory");
        }

        this.updatePassDisplay();

        // Special Celebration for Level 25 Master Reward
        if (reward.isFinal) {
            this._showMasterRewardCelebration(reward);
        } else {
            if (typeof toast === "function") {
                toast(`🎃 ¡Recompensa Reclamada! ${reward.name} (${reward.rewardText})`, "info");
            }
        }

        return true;
    },

    _grantRewardItem(reward) {
        const d = Users.data;
        switch (reward.type) {
            case "halloween_coins":
                d.halloweenCoins = (d.halloweenCoins || 0) + reward.amount;
                break;

            case "coins":
                Users.addCoins(reward.amount);
                break;

            case "xp":
            case "xp_boost":
            case "potion":
                // Grants both player score/experience and bonus coins
                Users.addCoins(Math.round(reward.amount / 3));
                if (typeof toast === "function") {
                    toast(`✨ Otorgado +${reward.amount} XP y monedas de maestría.`, "info");
                }
                break;

            case "shards":
                d.runeShards = (d.runeShards || 0) + reward.amount;
                break;

            case "rune":
                // Pick a rune matching the rarity or random
                if (typeof RUNES !== "undefined" && RUNES.length > 0) {
                    const matching = RUNES.filter(r => r.rarity === reward.rarity);
                    const runePool = matching.length > 0 ? matching : RUNES;
                    const pickedRune = runePool[Math.floor(Math.random() * runePool.length)];
                    
                    if (!d.runeQuantities) d.runeQuantities = {};
                    d.runeQuantities[pickedRune.id] = (d.runeQuantities[pickedRune.id] || 0) + 1;
                    if (!d.ownedRunes) d.ownedRunes = [];
                    if (!d.ownedRunes.includes(pickedRune.id)) d.ownedRunes.push(pickedRune.id);
                    
                    if (typeof toast === "function") {
                        toast(`🔮 Runa añadida al inventario: ${pickedRune.name} (${pickedRune.rarity})`, "info");
                    }
                }
                break;

            case "banner":
                if (!d.ownedBanners) d.ownedBanners = [];
                if (!d.ownedBanners.includes(reward.bannerId)) {
                    d.ownedBanners.push(reward.bannerId);
                }
                // Auto equip banner if none equipped
                if (!d.equippedBanner) {
                    d.equippedBanner = reward.bannerId;
                }
                break;

            case "frame":
                if (!d.ownedAvatarFrames) d.ownedAvatarFrames = [];
                if (!d.ownedAvatarFrames.includes(reward.frameId)) {
                    d.ownedAvatarFrames.push(reward.frameId);
                }
                d.equippedAvatarFrame = reward.frameId;
                break;

            case "chest":
                // Chest provides bundle of coins, shards and halloween currency
                Users.addCoins(200);
                d.halloweenCoins = (d.halloweenCoins || 0) + 150;
                d.runeShards = (d.runeShards || 0) + 2;
                break;

            case "master":
                // Grand Master Award Bundle
                Users.addCoins(2500);
                d.halloweenCoins = (d.halloweenCoins || 0) + 1000;
                d.runeShards = (d.runeShards || 0) + 10;
                if (!d.ownedBanners) d.ownedBanners = [];
                if (!d.ownedBanners.includes(reward.bannerId)) d.ownedBanners.push(reward.bannerId);
                d.equippedBanner = reward.bannerId;

                if (!d.ownedAvatarFrames) d.ownedAvatarFrames = [];
                if (!d.ownedAvatarFrames.includes(reward.frameId)) d.ownedAvatarFrames.push(reward.frameId);
                d.equippedAvatarFrame = reward.frameId;
                break;
        }
    },

    // Claim all available unlocked rewards in safe batch
    claimAll() {
        if (!Users || !Users.data) return;

        const claimable = this.rewards.filter(r => this.canClaim(r.level));
        if (claimable.length === 0) {
            if (typeof toast === "function") toast("No hay recompensas pendientes de reclamar.", "info");
            return;
        }

        let count = 0;
        claimable.forEach(r => {
            this._grantRewardItem(r);
            Users.data.claimedPassRewards.push(r.level);
            count++;
        });

        Users.save();
        Users.updateUI();
        this.updatePassDisplay();

        if (window.UI && typeof UI.playSound === "function") {
            UI.playSound("victory");
        }

        if (typeof toast === "function") {
            toast(`🎃 ¡Reclamadas exitosamente ${count} recompensas del Halloween Pass!`, "info");
        }
    },

    // =========================================================================
    // UI INJECTION & RENDERING
    // =========================================================================
    _injectUI() {
        // 1. Halloween Pass Modal Overlay
        const overlay = document.createElement('div');
        overlay.id = 'halloween-pass-overlay';
        overlay.innerHTML = `
            <div class="hw-pass-header">
                <div class="hw-pass-title-group">
                    <div class="hw-pass-emblem">
                        ${window.HWIcon ? window.HWIcon('pumpkin') : '🎃'}
                    </div>
                    <div class="hw-pass-title-text">
                        <h2>HALLOWEEN PASS</h2>
                        <div class="hw-pass-subtitle">25 TIERS • SEASONAL EVENT</div>
                    </div>
                </div>

                <div class="hw-pass-progress-box">
                    <div class="hw-pass-progress-labels">
                        <span id="hw-pass-tier-label">LEVEL 0 / 25</span>
                        <span id="hw-pass-xp-label">XP: 0 / 200</span>
                    </div>
                    <div class="hw-pass-bar-track">
                        <div class="hw-pass-bar-fill" id="hw-pass-bar-fill"></div>
                    </div>
                    <div class="hw-pass-progress-sublabels">
                        <span id="hw-pass-claimed-counter">Claimed: 0 / 25</span>
                        <span id="hw-pass-next-teaser" style="color:#ffd700;">+200 XP TO NEXT REWARD</span>
                    </div>
                </div>

                <div class="hw-pass-top-controls">
                    <div class="hw-currency-chip">
                        <span class="hw-icon-placeholder" data-icon="coins"></span>
                        <span id="hw-halloween-coins-val">0</span> Halloween Coins
                    </div>
                    <button class="hw-btn-claim-all" id="hw-btn-claim-all">CLAIM ALL</button>
                    <button class="hw-pass-tab-btn active" id="hw-tab-track-btn">RECORRIDO</button>
                    <button class="hw-pass-tab-btn" id="hw-tab-missions-btn">MISIONES</button>
                    <button class="hw-pass-tab-btn" id="hw-tab-stats-btn">STATS</button>
                    <button class="hw-pass-close-btn" id="hw-pass-close-btn">×</button>
                </div>
            </div>

            <div class="hw-pass-body" id="hw-pass-body">
                <!-- Dynamic Content injected via JS -->
            </div>
        `;
        document.body.appendChild(overlay);

        // 2. Reward Preview Modal
        const previewModal = document.createElement('div');
        previewModal.id = 'hw-reward-preview-modal';
        previewModal.innerHTML = `
            <div class="hw-preview-card">
                <button class="hw-pass-close-btn" id="hw-preview-close-btn" style="position:absolute; top:12px; right:12px;">×</button>
                <div class="hw-preview-icon-large" id="hw-preview-icon"></div>
                <h3 id="hw-preview-title" style="margin:0; font-size:0.85em; color:#ff7518;">Reward Title</h3>
                <div id="hw-preview-status" class="hw-preview-status">LOCKED</div>
                <div id="hw-preview-reward-val" style="font-size:0.65em; color:#ffd700;">+100 Halloween Coins</div>
                <p id="hw-preview-desc" style="font-size:0.55em; color:#b8a89a; line-height:1.6; margin:0 10px;">Lore description...</p>
                <div class="hw-preview-actions">
                    <button class="hw-btn-primary" id="hw-preview-claim-btn">CLAIM REWARD</button>
                </div>
            </div>
        `;
        document.body.appendChild(previewModal);

        // 3. Master Reward Complete Modal (Celebration)
        const masterModal = document.createElement('div');
        masterModal.id = 'hw-master-reward-modal';
        masterModal.innerHTML = `
            <div class="hw-master-card">
                <div style="font-size:2.5em; animation:hwPulseCurrent 1.5s infinite alternate;">👑</div>
                <h2 style="color:#ffd700; font-size:1.1em; margin:0; text-shadow:0 0 15px #ffd700;">HALLOWEEN PASS COMPLETE!</h2>
                <div style="font-size:0.65em; color:#39ff14;">25 / 25 REWARDS UNLOCKED</div>
                <div class="hw-preview-icon-large" style="width:100px; height:100px; border-color:#ffd700;">
                    ${window.HWIcon ? window.HWIcon('trophy') : '🏆'}
                </div>
                <h3 style="color:#ff7518; margin:0; font-size:0.8em;">HALLOWEEN LEGENDARY CHEST</h3>
                <p style="font-size:0.55em; color:#f5e6d3; line-height:1.6;">
                    Has conquistado las sombras y dominado el trono de Halloween. 
                    Has recibido el cofre legendario, estandarte supremo y marco de avatar.
                </p>
                <button class="hw-btn-primary" id="hw-master-close-btn" style="width:100%;">RETURN TO REALM</button>
            </div>
        `;
        document.body.appendChild(masterModal);

        // 4. Lobby Halloween Pass Card in the start menu
        this._injectLobbyCard();
    },

    _injectLobbyCard() {
        const lobbyCard = document.createElement('div');
        lobbyCard.className = 'hw-lobby-pass-card';
        lobbyCard.id = 'hw-lobby-pass-card';
        lobbyCard.innerHTML = `
            <div class="hw-lobby-pass-header">
                <div class="hw-lobby-pass-title">
                    <span class="hw-icon-placeholder" data-icon="pumpkin"></span>
                    HALLOWEEN PASS
                    <span class="hw-pass-notify-dot" id="hw-pass-dot" style="display:none;"></span>
                </div>
                <span class="hw-lobby-pass-badge" id="hw-lobby-lvl-badge">Level 0 / 25</span>
            </div>
            <div class="hw-pass-bar-track">
                <div class="hw-pass-bar-fill" id="hw-lobby-bar-fill" style="width:0%;"></div>
            </div>
            <div style="display:flex; justify-content:space-between; font-size:0.55em; align-items:center;">
                <span id="hw-lobby-status-text" style="color:#b8a89a;">Progreso del evento</span>
                <button class="hw-btn-claim-node" style="font-size:0.55em; padding:5px 12px;">VER PASE</button>
            </div>
        `;

        // Mount cleanly inside the lobby container (not inside start-screen)
        const mount = document.getElementById('hw-lobby-pass-mount');
        if (mount) {
            mount.innerHTML = '';
            mount.appendChild(lobbyCard);
        } else {
            const playerSetup = document.getElementById('player-setup');
            if (playerSetup && playerSetup.parentNode) {
                playerSetup.parentNode.insertBefore(lobbyCard, playerSetup.nextSibling);
            } else {
                const container = document.querySelector('.container') || document.body;
                container.appendChild(lobbyCard);
            }
        }

        // Bind prominent Halloween Pass button in the top bar
        const topbarPassBtn = document.getElementById('hw-topbar-pass-btn');
        if (topbarPassBtn && !topbarPassBtn._hwListenerAdded) {
            topbarPassBtn.addEventListener('click', () => this.open());
            topbarPassBtn._hwListenerAdded = true;
        }

        // Bind top bar Leaderboard button
        const topbarLbBtn = document.getElementById('hud-lb-btn');
        if (topbarLbBtn && !topbarLbBtn._hwListenerAdded) {
            topbarLbBtn.addEventListener('click', () => {
                if (typeof window.showLeaderboard === 'function') window.showLeaderboard();
            });
            topbarLbBtn._hwListenerAdded = true;
        }

        if (window.renderHWIcons) {
            window.renderHWIcons();
        }
    },

    _bindEvents() {
        // Open buttons
        const lobbyCard = document.getElementById('hw-lobby-pass-card');
        if (lobbyCard) lobbyCard.addEventListener('click', () => this.open());

        const eventBadge = document.querySelector('.hw-event-badge');
        if (eventBadge) {
            eventBadge.style.cursor = 'pointer';
            eventBadge.title = 'Click to open Halloween Pass';
            eventBadge.addEventListener('click', () => this.open());
        }

        // Close buttons
        const closeBtn = document.getElementById('hw-pass-close-btn');
        if (closeBtn) closeBtn.addEventListener('click', () => this.close());

        const previewClose = document.getElementById('hw-preview-close-btn');
        if (previewClose) previewClose.addEventListener('click', () => this.closePreview());

        const masterClose = document.getElementById('hw-master-close-btn');
        if (masterClose) masterClose.addEventListener('click', () => {
            const m = document.getElementById('hw-master-reward-modal');
            if (m) m.style.display = 'none';
        });

        // Claim All button
        const claimAllBtn = document.getElementById('hw-btn-claim-all');
        if (claimAllBtn) claimAllBtn.addEventListener('click', () => this.claimAll());

        // Tabs
        const tabTrack = document.getElementById('hw-tab-track-btn');
        const tabMissions = document.getElementById('hw-tab-missions-btn');
        const tabStats = document.getElementById('hw-tab-stats-btn');

        if (tabTrack) tabTrack.addEventListener('click', () => this.setTab('track'));
        if (tabMissions) tabMissions.addEventListener('click', () => this.setTab('missions'));
        if (tabStats) tabStats.addEventListener('click', () => this.setTab('stats'));
    },

    open() {
        const overlay = document.getElementById('halloween-pass-overlay');
        if (overlay) {
            overlay.classList.add('open');
            this.updatePassDisplay();
        }
    },

    close() {
        const overlay = document.getElementById('halloween-pass-overlay');
        if (overlay) {
            overlay.classList.remove('open');
        }
    },

    setTab(tab) {
        this.activeTab = tab;
        document.querySelectorAll('.hw-pass-tab-btn').forEach(b => b.classList.remove('active'));
        const activeBtn = document.getElementById(`hw-tab-${tab}-btn`);
        if (activeBtn) activeBtn.classList.add('active');
        this.renderBody();
    },

    // =========================================================================
    // UPDATE & RENDER
    // =========================================================================
    updatePassDisplay() {
        const currentXP = this.getCurrentXP();
        const currentLevel = this.getPassLevel();
        const claimed = this.getClaimedRewards();
        const hwCoins = this.getHalloweenCoins();
        const toNext = this.getXPToNextReward();
        const canClaimAny = this.hasAnyClaimable();

        // Top bar updates
        const tierLabel = document.getElementById('hw-pass-tier-label');
        if (tierLabel) tierLabel.textContent = `LEVEL ${currentLevel} / 25`;

        const xpLabel = document.getElementById('hw-pass-xp-label');
        if (xpLabel) {
            const lvlProgressXP = currentXP % this.XP_PER_LEVEL;
            xpLabel.textContent = currentLevel >= 25 ? `MAX LEVEL (${currentXP} XP)` : `XP: ${lvlProgressXP} / ${this.XP_PER_LEVEL}`;
        }

        const barFill = document.getElementById('hw-pass-bar-fill');
        if (barFill) {
            const pct = Math.min(100, Math.round((currentLevel / 25) * 100));
            barFill.style.width = `${pct}%`;
        }

        const claimedCounter = document.getElementById('hw-pass-claimed-counter');
        if (claimedCounter) claimedCounter.textContent = `Claimed: ${claimed.length} / 25`;

        const nextTeaser = document.getElementById('hw-pass-next-teaser');
        if (nextTeaser) {
            nextTeaser.textContent = currentLevel >= 25 ? 'ALL TIERS REACHED!' : `+${toNext} XP TO NEXT REWARD`;
        }

        const hwCoinsVal = document.getElementById('hw-halloween-coins-val');
        if (hwCoinsVal) hwCoinsVal.textContent = hwCoins.toLocaleString();

        const hudHwCoinsVal = document.getElementById('hud-hw-coins-val');
        if (hudHwCoinsVal) hudHwCoinsVal.textContent = hwCoins.toLocaleString();

        const claimAllBtn = document.getElementById('hw-btn-claim-all');
        if (claimAllBtn) {
            claimAllBtn.style.display = canClaimAny ? 'block' : 'none';
        }

        // Notification Dots
        const passDot = document.getElementById('hw-pass-dot');
        if (passDot) passDot.style.display = canClaimAny ? 'inline-block' : 'none';

        const topbarDot = document.getElementById('hw-topbar-dot');
        if (topbarDot) topbarDot.style.display = canClaimAny ? 'inline-block' : 'none';

        // Lobby Card updates
        const lobbyLvl = document.getElementById('hw-lobby-lvl-badge');
        if (lobbyLvl) lobbyLvl.textContent = `Level ${currentLevel} / 25`;

        const lobbyBar = document.getElementById('hw-lobby-bar-fill');
        if (lobbyBar) lobbyBar.style.width = `${Math.min(100, (currentLevel / 25) * 100)}%`;

        const lobbyStatus = document.getElementById('hw-lobby-status-text');
        if (lobbyStatus) {
            lobbyStatus.textContent = canClaimAny ? '¡Recompensas listas para reclamar!' : `${hwCoins} Halloween Coins`;
            lobbyStatus.style.color = canClaimAny ? '#39ff14' : '#b8a89a';
        }

        this.renderBody();
    },

    renderBody() {
        const body = document.getElementById('hw-pass-body');
        if (!body) return;

        if (this.activeTab === 'track') {
            this.renderAdventureTrack(body);
        } else if (this.activeTab === 'missions') {
            this.renderMissions(body);
        } else if (this.activeTab === 'stats') {
            this.renderStats(body);
        }
    },

    // 1. ADVENTURE TRACK RENDER (Road of 5 Biomes)
    renderAdventureTrack(container) {
        const currentLevel = this.getPassLevel();
        const claimed = this.getClaimedRewards();

        // Biome groupings
        const biomes = [
            { name: "Pumpkin Village", levels: [1, 2, 3, 4, 5], icon: "pumpkin", desc: "El pueblo de inicio iluminado por calabazas mágicas." },
            { name: "Haunted Forest", levels: [6, 7, 8, 9, 10], icon: "rune", desc: "Bosque susurrante lleno de reliquias arcanas y sombras." },
            { name: "Cursed Cemetery", levels: [11, 12, 13, 14, 15], icon: "gem", desc: "Tumbas milenarias que guardan antiguos estandartes." },
            { name: "Witch's Castle", levels: [16, 17, 18, 19, 20], icon: "potion", desc: "Castillo arcano donde se forjan pociones y marcos de avatar." },
            { name: "Halloween Throne", levels: [21, 22, 23, 24, 25], icon: "trophy", desc: "El trono supremo reservado únicamente para el Gran Maestro." }
        ];

        let html = '<div class="hw-pass-track-container">';

        biomes.forEach(biome => {
            html += `
                <div class="hw-biome-zone">
                    <div class="hw-biome-header">
                        <div class="hw-biome-title">
                            <span>${window.HWIcon ? window.HWIcon(biome.icon) : '🕯'}</span>
                            ${biome.name.toUpperCase()}
                        </div>
                        <div class="hw-biome-range">TIERS ${biome.levels[0]}–${biome.levels[biome.levels.length - 1]}</div>
                    </div>
                    <div class="hw-nodes-grid">
            `;

            biome.levels.forEach(lvl => {
                const reward = this.rewards.find(r => r.level === lvl);
                if (!reward) return;

                const isUnlocked = currentLevel >= lvl;
                const isClaimed = claimed.includes(lvl);
                const isCurrent = currentLevel === lvl - 1; // Immediately next reward
                const isAvailable = isUnlocked && !isClaimed;

                let stateClass = "locked";
                if (isClaimed) stateClass = "claimed";
                else if (isAvailable) stateClass = "available";
                else if (isCurrent) stateClass = "current";

                const isMaster = reward.isFinal;
                const masterClass = isMaster ? "master-node" : "";

                html += `
                    <div class="hw-pass-node ${stateClass} ${masterClass}" onclick="HalloweenPass.showRewardPreview(${lvl})">
                        <div class="hw-node-lvl">TIER ${lvl}</div>
                        <div class="hw-node-icon-box">
                            ${window.HWIcon ? window.HWIcon(reward.icon) : '🎁'}
                        </div>
                        <div class="hw-node-title">${reward.name}</div>
                        <div class="hw-node-reward-val">${reward.rewardText}</div>
                `;

                if (isClaimed) {
                    html += `<div class="hw-node-claimed-tag">✓ RECLAMADO</div>`;
                } else if (isAvailable) {
                    html += `<button class="hw-btn-claim-node" onclick="event.stopPropagation(); HalloweenPass.claimReward(${lvl});">CLAIM</button>`;
                } else if (isCurrent) {
                    html += `<div class="hw-you-are-here-tag">SIGUIENTE</div>`;
                } else {
                    html += `<div style="margin-top:auto; opacity:0.6;">${window.HWIcon ? window.HWIcon('lock') : '🔒'}</div>`;
                }

                html += `</div>`;
            });

            html += `
                    </div>
                </div>
            `;
        });

        html += '</div>';
        container.innerHTML = html;
    },

    // 2. MISSIONS RENDER
    renderMissions(container) {
        const d = this._ensurePassData();
        const claimedMissions = (d && d.claimedMissions) || [];
        const stats = (d && d.eventStats) || {};

        let html = `
            <div class="hw-quests-container">
                <div style="text-align:center; margin-bottom:15px;">
                    <h3 style="color:#ff7518; font-size:0.85em; margin:0 0 6px 0;">MISIONES DE HALLOWEEN</h3>
                    <p style="color:#b8a89a; font-size:0.55em; margin:0;">Completa objetivos en tus partidas para obtener abundante Event XP.</p>
                </div>
        `;

        this.defaultMissions.forEach(m => {
            const currentVal = Math.min(m.target, stats[m.key] || 0);
            const isCompleted = claimedMissions.includes(m.id) || currentVal >= m.target;
            const pct = Math.min(100, Math.round((currentVal / m.target) * 100));

            html += `
                <div class="hw-quest-card ${isCompleted ? 'completed' : ''}">
                    <div class="hw-quest-info">
                        <h4>${m.title}</h4>
                        <div class="hw-quest-desc">${m.desc}</div>
                        <div style="display:flex; align-items:center; gap:12px;">
                            <div class="hw-quest-bar">
                                <div class="hw-quest-bar-fill" style="width:${pct}%;"></div>
                            </div>
                            <span style="font-size:0.5em; color:#ffcc00;">${currentVal} / ${m.target}</span>
                        </div>
                    </div>
                    <div>
                        <span style="font-size:0.6em; font-weight:bold; color:${isCompleted ? '#39ff14' : '#ffd700'};">
                            ${isCompleted ? '✓ COMPLETADA' : `+${m.rewardXP} XP`}
                        </span>
                    </div>
                </div>
            `;
        });

        html += '</div>';
        container.innerHTML = html;
    },

    // 3. STATS RENDER
    renderStats(container) {
        const d = this._ensurePassData();
        const stats = (d && d.eventStats) || {};
        const claimed = this.getClaimedRewards();

        container.innerHTML = `
            <div style="max-width:540px; margin:0 auto; background:#190c2e; border:2px solid #ff7518; border-radius:16px; padding:25px; box-shadow:0 0 25px rgba(255,117,24,0.3);">
                <h3 style="text-align:center; color:#ff7518; margin:0 0 20px 0; font-size:0.9em;">HALLOWEEN EVENT STATS</h3>
                <div style="display:flex; flex-direction:column; gap:14px; font-size:0.6em;">
                    <div style="display:flex; justify-content:space-between; border-bottom:1px solid #4a2d6e; padding-bottom:8px;">
                        <span style="color:#b8a89a;">Nivel del Pase:</span>
                        <span style="color:#ffd700; font-weight:bold;">${this.getPassLevel()} / 25</span>
                    </div>
                    <div style="display:flex; justify-content:space-between; border-bottom:1px solid #4a2d6e; padding-bottom:8px;">
                        <span style="color:#b8a89a;">Recompensas Reclamadas:</span>
                        <span style="color:#39ff14; font-weight:bold;">${claimed.length} / 25</span>
                    </div>
                    <div style="display:flex; justify-content:space-between; border-bottom:1px solid #4a2d6e; padding-bottom:8px;">
                        <span style="color:#b8a89a;">Event XP Total:</span>
                        <span style="color:#ff7518; font-weight:bold;">${this.getCurrentXP().toLocaleString()} XP</span>
                    </div>
                    <div style="display:flex; justify-content:space-between; border-bottom:1px solid #4a2d6e; padding-bottom:8px;">
                        <span style="color:#b8a89a;">Halloween Coins:</span>
                        <span style="color:#ffae42; font-weight:bold;">${this.getHalloweenCoins().toLocaleString()}</span>
                    </div>
                    <div style="display:flex; justify-content:space-between; border-bottom:1px solid #4a2d6e; padding-bottom:8px;">
                        <span style="color:#b8a89a;">Trials Completados:</span>
                        <span style="color:#00ccff; font-weight:bold;">${stats.trialsCompleted || 0}</span>
                    </div>
                    <div style="display:flex; justify-content:space-between; border-bottom:1px solid #4a2d6e; padding-bottom:8px;">
                        <span style="color:#b8a89a;">Palabras Correctas:</span>
                        <span style="color:#00ccff; font-weight:bold;">${stats.wordsCorrect || 0}</span>
                    </div>
                    <div style="display:flex; justify-content:space-between; border-bottom:1px solid #4a2d6e; padding-bottom:8px;">
                        <span style="color:#b8a89a;">Misiones Cumplidas:</span>
                        <span style="color:#39ff14; font-weight:bold;">${stats.missionsCompleted || 0} / ${this.defaultMissions.length}</span>
                    </div>
                </div>
            </div>
        `;
    },

    // =========================================================================
    // MODALS & NOTIFICATIONS
    // =========================================================================
    showRewardPreview(level) {
        const reward = this.rewards.find(r => r.level === level);
        if (!reward) return;

        const isUnlocked = this.isUnlocked(level);
        const isClaimed = this.isClaimed(level);
        const canClaim = this.canClaim(level);

        const modal = document.getElementById('hw-reward-preview-modal');
        const iconBox = document.getElementById('hw-preview-icon');
        const titleEl = document.getElementById('hw-preview-title');
        const statusEl = document.getElementById('hw-preview-status');
        const valEl = document.getElementById('hw-preview-reward-val');
        const descEl = document.getElementById('hw-preview-desc');
        const claimBtn = document.getElementById('hw-preview-claim-btn');

        if (iconBox) iconBox.innerHTML = window.HWIcon ? window.HWIcon(reward.icon) : '🎁';
        if (titleEl) titleEl.textContent = `TIER ${reward.level}: ${reward.name.toUpperCase()}`;
        if (valEl) valEl.textContent = reward.rewardText;
        if (descEl) descEl.textContent = reward.desc;

        if (statusEl) {
            statusEl.className = 'hw-preview-status';
            if (isClaimed) {
                statusEl.textContent = 'STATUS: CLAIMED';
                statusEl.classList.add('claimed');
            } else if (canClaim) {
                statusEl.textContent = 'STATUS: AVAILABLE TO CLAIM!';
                statusEl.classList.add('available');
            } else {
                statusEl.textContent = `STATUS: LOCKED (Requires Tier ${reward.level})`;
                statusEl.classList.add('locked');
            }
        }

        if (claimBtn) {
            claimBtn.disabled = !canClaim;
            claimBtn.textContent = isClaimed ? '✓ ALREADY CLAIMED' : (canClaim ? 'CLAIM REWARD' : `LOCKED (TIER ${reward.level})`);
            claimBtn.onclick = () => {
                if (this.claimReward(level)) {
                    this.closePreview();
                }
            };
        }

        if (modal) modal.style.display = 'flex';
    },

    closePreview() {
        const modal = document.getElementById('hw-reward-preview-modal');
        if (modal) modal.style.display = 'none';
    },

    _notifyLevelUp(oldLvl, newLvl) {
        if (window.UI && typeof UI.playSound === "function") {
            UI.playSound("victory");
        }
        if (typeof toast === "function") {
            toast(`🎃 ¡LEVEL UP EN HALLOWEEN PASS! ${oldLvl} ➔ ${newLvl}. ¡Nueva recompensa desbloqueada!`, "info");
        }
    },

    _showMasterRewardCelebration(reward) {
        const modal = document.getElementById('hw-master-reward-modal');
        if (modal) modal.style.display = 'flex';
    }
};

// Auto-initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    HalloweenPass.init();
});
