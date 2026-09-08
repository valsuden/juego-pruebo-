// =============================================================================
// PERFORMANCE MANAGER & PROFILES — TRIALS OF MASTERY
// Extreme Optimization, Profiling, Stutter Detection & Hardware Scaler
// =============================================================================

(function (window, document) {
    'use strict';

    // -------------------------------------------------------------------------
    // 1. CONSTANTS & PROFILES
    // -------------------------------------------------------------------------
    const PROFILES = {
        MAXIMUM: 'maximum',
        HEAVY:   'heavy',
        MEDIUM:  'medium',
        POTATO:  'potato',
        AUTO:    'auto'
    };

    const PROFILE_CONFIGS = {
        maximum: {
            name: 'Maximum',
            tagline: 'PC / Laptop de Alto Rendimiento',
            particleMultiplier: 1.0,
            maxParticles: 35,
            enableFog: 'dual',
            enableAtmosphere: true,
            enableBackdropFilter: true,
            enableShadows: 'full',
            enableVFX: true,
            networkDelay: 15000,
            transitionDuration: '0.25s',
            cssClass: 'profile-maximum'
        },
        heavy: {
            name: 'Heavy',
            tagline: 'PC / Laptop Equilibrado (60 FPS)',
            particleMultiplier: 0.5,
            maxParticles: 16,
            enableFog: 'single',
            enableAtmosphere: true,
            enableBackdropFilter: true,
            enableShadows: 'moderate',
            enableVFX: true,
            networkDelay: 20000,
            transitionDuration: '0.2s',
            cssClass: 'profile-heavy'
        },
        medium: {
            name: 'Medium',
            tagline: 'Móvil / Tablet / Portátil Estándar',
            particleMultiplier: 0.25,
            maxParticles: 6,
            enableFog: 'static',
            enableAtmosphere: false,
            enableBackdropFilter: false,
            enableShadows: 'subtle',
            enableVFX: false,
            networkDelay: 30000,
            transitionDuration: '0.12s',
            cssClass: 'profile-medium'
        },
        potato: {
            name: 'Potato',
            tagline: 'Optimización Extrema / Dispositivos Débiles',
            particleMultiplier: 0.0,
            maxParticles: 0,
            enableFog: 'none',
            enableAtmosphere: false,
            enableBackdropFilter: false,
            enableShadows: 'none',
            enableVFX: false,
            networkDelay: 45000,
            transitionDuration: '0.0s',
            cssClass: 'profile-potato'
        }
    };

    // -------------------------------------------------------------------------
    // 2. HARDWARE & CAPABILITY DETECTOR
    // -------------------------------------------------------------------------
    function detectHardwareCapabilities() {
        const cores = navigator.hardwareConcurrency || 4;
        const memory = navigator.deviceMemory || 4; // GB (if exposed)
        const isTouch = ('ontouchstart' in window) || (navigator.maxTouchPoints > 0);
        const isMobileScreen = window.innerWidth <= 768 || window.innerHeight <= 600;
        const prefersReducedMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        
        // Fast GPU hint: check canvas gl capabilities if available
        let hasFastGPU = true;
        try {
            const canvas = document.createElement('canvas');
            const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
            if (gl) {
                const debugInfo = gl.getExtension('WEBGL_debug_renderer_info');
                if (debugInfo) {
                    const renderer = gl.getParameter(debugInfo.UNMASKED_RENDERER_WEBGL) || '';
                    if (/swiftshader|llvmpipe|software/i.test(renderer)) {
                        hasFastGPU = false;
                    }
                }
            }
        } catch (e) {
            hasFastGPU = false;
        }

        return {
            cores,
            memory,
            isTouch,
            isMobileScreen,
            prefersReducedMotion,
            hasFastGPU
        };
    }

    function determineOptimalProfile(hw) {
        if (hw.prefersReducedMotion) {
            return PROFILES.POTATO;
        }

        if (hw.isMobileScreen || hw.isTouch) {
            // Mobile devices
            if (hw.cores <= 4 || hw.memory <= 3 || !hw.hasFastGPU) {
                return PROFILES.POTATO;
            }
            if (hw.cores <= 6 || hw.memory <= 4) {
                return PROFILES.MEDIUM;
            }
            return PROFILES.HEAVY;
        }

        // Desktop / Laptop
        if (hw.cores <= 2 || hw.memory <= 3 || !hw.hasFastGPU) {
            return PROFILES.POTATO;
        }
        if (hw.cores <= 4 || hw.memory <= 6) {
            return PROFILES.HEAVY;
        }
        return PROFILES.MAXIMUM;
    }

    // -------------------------------------------------------------------------
    // 3. PERFORMANCE MANAGER CLASS
    // -------------------------------------------------------------------------
    class PerformanceEngine {
        constructor() {
            this.hardware = detectHardwareCapabilities();
            this.selectedProfile = localStorage.getItem('graphicsQuality') || PROFILES.AUTO;
            this.effectiveProfile = this.selectedProfile === PROFILES.AUTO
                ? determineOptimalProfile(this.hardware)
                : (PROFILE_CONFIGS[this.selectedProfile] ? this.selectedProfile : PROFILES.MEDIUM);

            // Frame metrics
            this.fps = 60;
            this.avgFps = 60;
            this.onePercentLow = 60;
            this.frameTime = 16.6;
            this.frameSpikes = 0;
            this.longFrames = 0;
            this.totalFramesSampled = 0;
            this.recentFrameTimes = [];
            this.lastFrameTimestamp = performance.now();
            this.rafId = null;

            // Stutter context tracking
            this.stutterEvents = [];
            this.currentContext = 'Lobby';

            // Auto-adaptive tuning state
            this.autoTuneCounter = 0;
            this.isAutoDowngraded = false;

            // API Latency Tracking
            this.lastApiLatency = 0;
            this.apiLatencySamples = [];

            // HUD State
            this.hudVisible = localStorage.getItem('showPerfHUD') === 'true';
            this.hudElement = null;
            this.hudUpdateInterval = null;

            // Bind methods
            this._tick = this._tick.bind(this);
            this._onVisibilityChange = this._onVisibilityChange.bind(this);
        }

        init() {
            this.applyProfile(this.effectiveProfile, false);
            this._initVisibilityListener();
            this._startLoop();

            if (this.hudVisible) {
                this.showHUD();
            }

            // Keyboard shortcut to toggle HUD: Ctrl+Shift+P or F2
            window.addEventListener('keydown', (e) => {
                if ((e.ctrlKey && e.shiftKey && (e.key === 'P' || e.key === 'p')) || e.key === 'F2') {
                    e.preventDefault();
                    this.toggleHUD();
                }
            });

            // Expose globally
            window.PerformanceManager = this;
            console.log(`⚡ PerformanceManager initialized: [Selected: ${this.selectedProfile}, Effective: ${this.effectiveProfile}] (Cores: ${this.hardware.cores}, Memory: ~${this.hardware.memory}GB, Touch: ${this.hardware.isTouch})`);
        }

        // ---------------------------------------------------------------------
        // Profile Management
        // ---------------------------------------------------------------------
        getProfile() {
            return this.selectedProfile;
        }

        getEffectiveProfile() {
            return this.effectiveProfile;
        }

        getConfig() {
            return PROFILE_CONFIGS[this.effectiveProfile] || PROFILE_CONFIGS.medium;
        }

        isPotato() {
            return this.effectiveProfile === PROFILES.POTATO;
        }

        getParticleMultiplier() {
            return this.getConfig().particleMultiplier;
        }

        getMaxParticles() {
            return this.getConfig().maxParticles;
        }

        getNetworkDelay() {
            return this.getConfig().networkDelay;
        }

        setProfile(profile, persist = true) {
            if (!PROFILES[profile.toUpperCase()] && profile !== 'auto') {
                console.warn(`Invalid profile: ${profile}`);
                return;
            }

            this.selectedProfile = profile;
            if (persist) {
                localStorage.setItem('graphicsQuality', profile);
                if (typeof Users !== 'undefined' && Users.data) {
                    Users.data.settings = Users.data.settings || {};
                    Users.data.settings.graphicsQuality = profile;
                    Users.save();
                }
            }

            if (profile === PROFILES.AUTO) {
                this.effectiveProfile = determineOptimalProfile(this.hardware);
                this.isAutoDowngraded = false;
            } else {
                this.effectiveProfile = profile;
            }

            this.applyProfile(this.effectiveProfile, persist);
            this.updateHUD();

            // Dispatch event for UI components to adjust
            window.dispatchEvent(new CustomEvent('tom:profileChanged', {
                detail: {
                    selected: this.selectedProfile,
                    effective: this.effectiveProfile,
                    config: this.getConfig()
                }
            }));
        }

        applyProfile(profile, notify = true) {
            const body = document.body;
            if (!body) return;

            // Remove all profile classes
            body.classList.remove(
                'profile-maximum',
                'profile-heavy',
                'profile-medium',
                'profile-potato',
                'potato-mode'
            );

            // Apply specific profile class
            const config = PROFILE_CONFIGS[profile] || PROFILE_CONFIGS.medium;
            body.classList.add(config.cssClass);

            // Backward compatibility for existing potatoMode checks
            const isPotatoMode = (profile === PROFILES.POTATO);
            window.potatoMode = isPotatoMode;
            if (isPotatoMode) {
                body.classList.add('potato-mode');
            }

            // Sync settings UI toggle buttons if they exist
            const potatoToggleBtn = document.getElementById('toggle-potato-btn');
            if (potatoToggleBtn && typeof window._updateToggleState === 'function') {
                window._updateToggleState(potatoToggleBtn, isPotatoMode);
            }

            const qualitySelect = document.getElementById('graphics-quality-select');
            if (qualitySelect && qualitySelect.value !== this.selectedProfile) {
                qualitySelect.value = this.selectedProfile;
            }

            // Atmospheric elements handling
            const atmoContainer = document.querySelector('.hw-atmosphere');
            if (atmoContainer) {
                if (config.enableAtmosphere) {
                    atmoContainer.style.display = 'block';
                } else {
                    atmoContainer.style.display = 'none';
                }
            }

            if (notify && typeof window.toast === 'function') {
                const badge = isPotatoMode ? '🥔' : '⚡';
                window.toast(`${badge} Perfil Gráfico: ${config.name} (${config.tagline})`, 'info');
            }
        }

        togglePotato() {
            if (this.effectiveProfile === PROFILES.POTATO) {
                this.setProfile(PROFILES.AUTO, true);
            } else {
                this.setProfile(PROFILES.POTATO, true);
            }
        }

        setContext(ctx) {
            this.currentContext = ctx || 'General';
        }

        // ---------------------------------------------------------------------
        // Frame Rate & Stutter Detection Engine
        // ---------------------------------------------------------------------
        _startLoop() {
            if (this.rafId) cancelAnimationFrame(this.rafId);
            this.lastFrameTimestamp = performance.now();
            this.rafId = requestAnimationFrame(this._tick);
        }

        _stopLoop() {
            if (this.rafId) {
                cancelAnimationFrame(this.rafId);
                this.rafId = null;
            }
        }

        _tick(now) {
            const delta = now - this.lastFrameTimestamp;
            this.lastFrameTimestamp = now;

            // Ignore abnormally long frame after tab was hidden/frozen
            if (delta < 500) {
                this.frameTime = delta;
                const instantFps = 1000 / (delta || 16.6);

                this.recentFrameTimes.push(delta);
                if (this.recentFrameTimes.length > 120) {
                    this.recentFrameTimes.shift();
                }

                // Calculate Average FPS
                const sum = this.recentFrameTimes.reduce((a, b) => a + b, 0);
                this.avgFps = Math.round(1000 / (sum / this.recentFrameTimes.length));
                this.fps = Math.round(instantFps);

                // Calculate 1% Low FPS (worst 1% of frames)
                if (this.recentFrameTimes.length >= 20) {
                    const sorted = [...this.recentFrameTimes].sort((a, b) => b - a);
                    const onePercentCount = Math.max(1, Math.floor(sorted.length * 0.05));
                    const worstSum = sorted.slice(0, onePercentCount).reduce((a, b) => a + b, 0);
                    this.onePercentLow = Math.round(1000 / (worstSum / onePercentCount));
                } else {
                    this.onePercentLow = this.avgFps;
                }

                // Stutter Detection: Frame Spikes (> 33.3ms = dropped frame, > 50ms = severe hitch)
                if (delta > 33.3) {
                    this.frameSpikes++;
                    if (delta > 50.0) {
                        this.longFrames++;
                        this._recordStutter(delta, this.currentContext);
                    }
                }

                // Auto-Adaptive Tuning: Downgrade profile if persistent stutter in Auto Mode
                if (this.selectedProfile === PROFILES.AUTO && !this.isAutoDowngraded) {
                    if (this.avgFps < 32 && this.recentFrameTimes.length >= 60) {
                        this.autoTuneCounter++;
                        if (this.autoTuneCounter > 180) { // ~3 seconds of low FPS
                            this._autoStepDown();
                        }
                    } else {
                        this.autoTuneCounter = Math.max(0, this.autoTuneCounter - 1);
                    }
                }
            }

            this.rafId = requestAnimationFrame(this._tick);
        }

        _recordStutter(duration, context) {
            const entry = {
                timestamp: Date.now(),
                duration: Math.round(duration),
                context: context,
                profile: this.effectiveProfile
            };
            this.stutterEvents.push(entry);
            if (this.stutterEvents.length > 20) {
                this.stutterEvents.shift();
            }
        }

        _autoStepDown() {
            this.autoTuneCounter = 0;
            const current = this.effectiveProfile;
            let nextProfile = current;

            if (current === PROFILES.MAXIMUM) nextProfile = PROFILES.HEAVY;
            else if (current === PROFILES.HEAVY) nextProfile = PROFILES.MEDIUM;
            else if (current === PROFILES.MEDIUM) nextProfile = PROFILES.POTATO;

            if (nextProfile !== current) {
                this.effectiveProfile = nextProfile;
                this.isAutoDowngraded = true;
                this.applyProfile(nextProfile, false);
                if (typeof window.toast === 'function') {
                    window.toast(`⚡ Auto-Optimización activada: perfil ajustado a ${nextProfile.toUpperCase()} para mantener fluidez.`, 'info');
                }
            }
        }

        // ---------------------------------------------------------------------
        // Background & Visibility Management
        // ---------------------------------------------------------------------
        _initVisibilityListener() {
            document.addEventListener('visibilitychange', this._onVisibilityChange);
        }

        _onVisibilityChange() {
            if (document.hidden) {
                // Tab hidden: suspend intensive work
                this._stopLoop();
                window.dispatchEvent(new CustomEvent('tom:visibilitySuspended'));
            } else {
                // Tab visible: resume loop smoothly
                this.lastFrameTimestamp = performance.now();
                this._startLoop();
                window.dispatchEvent(new CustomEvent('tom:visibilityResumed'));
            }
        }

        // ---------------------------------------------------------------------
        // API Latency Tracking
        // ---------------------------------------------------------------------
        recordApiLatency(ms) {
            this.lastApiLatency = Math.round(ms);
            this.apiLatencySamples.push(this.lastApiLatency);
            if (this.apiLatencySamples.length > 10) this.apiLatencySamples.shift();
            this.updateHUD();
        }

        getAverageApiLatency() {
            if (this.apiLatencySamples.length === 0) return 0;
            const sum = this.apiLatencySamples.reduce((a, b) => a + b, 0);
            return Math.round(sum / this.apiLatencySamples.length);
        }

        // ---------------------------------------------------------------------
        // In-Game FPS & Metrics HUD Overlay
        // ---------------------------------------------------------------------
        toggleHUD() {
            if (this.hudVisible) {
                this.hideHUD();
            } else {
                this.showHUD();
            }
        }

        showHUD() {
            this.hudVisible = true;
            localStorage.setItem('showPerfHUD', 'true');

            if (!this.hudElement) {
                this._createHUDElement();
            }
            this.hudElement.style.display = 'block';

            if (!this.hudUpdateInterval) {
                this.hudUpdateInterval = setInterval(() => this.updateHUD(), 250);
            }
            this.updateHUD();
        }

        hideHUD() {
            this.hudVisible = false;
            localStorage.setItem('showPerfHUD', 'false');

            if (this.hudElement) {
                this.hudElement.style.display = 'none';
            }
            if (this.hudUpdateInterval) {
                clearInterval(this.hudUpdateInterval);
                this.hudUpdateInterval = null;
            }
        }

        _createHUDElement() {
            const hud = document.createElement('div');
            hud.id = 'tom-perf-hud';
            hud.innerHTML = `
                <div class="perf-hud-header">
                    <span class="perf-hud-title">⚡ PERF MONITOR</span>
                    <button class="perf-hud-close" id="tom-perf-hud-close" title="Cerrar Monitor">×</button>
                </div>
                <div class="perf-hud-body">
                    <div class="perf-hud-metric">
                        <span class="lbl">FPS / 1% Low:</span>
                        <span class="val" id="perf-hud-fps">60 / 60</span>
                    </div>
                    <div class="perf-hud-metric">
                        <span class="lbl">Frame Time:</span>
                        <span class="val" id="perf-hud-frametime">16.6 ms</span>
                    </div>
                    <div class="perf-hud-metric">
                        <span class="lbl">Spikes (>33ms):</span>
                        <span class="val" id="perf-hud-spikes">0</span>
                    </div>
                    <div class="perf-hud-metric">
                        <span class="lbl">Memory Heap:</span>
                        <span class="val" id="perf-hud-mem">N/A</span>
                    </div>
                    <div class="perf-hud-metric">
                        <span class="lbl">Active DOM:</span>
                        <span class="val" id="perf-hud-nodes">0</span>
                    </div>
                    <div class="perf-hud-metric">
                        <span class="lbl">API Latency:</span>
                        <span class="val" id="perf-hud-latency">0 ms</span>
                    </div>
                    <div class="perf-hud-metric">
                        <span class="lbl">Active Profile:</span>
                        <span class="val highlight" id="perf-hud-profile">AUTO (MAX)</span>
                    </div>
                    <div class="perf-hud-actions">
                        <button class="perf-hud-btn" id="perf-hud-bench-btn">BENCHMARK (3s)</button>
                    </div>
                </div>
            `;
            document.body.appendChild(hud);
            this.hudElement = hud;

            const closeBtn = document.getElementById('tom-perf-hud-close');
            if (closeBtn) closeBtn.addEventListener('click', () => this.hideHUD());

            const benchBtn = document.getElementById('perf-hud-bench-btn');
            if (benchBtn) benchBtn.addEventListener('click', () => this.runBenchmark());
        }

        updateHUD() {
            if (!this.hudVisible || !this.hudElement) return;

            const fpsEl = document.getElementById('perf-hud-fps');
            const ftEl = document.getElementById('perf-hud-frametime');
            const spikesEl = document.getElementById('perf-hud-spikes');
            const memEl = document.getElementById('perf-hud-mem');
            const nodesEl = document.getElementById('perf-hud-nodes');
            const latencyEl = document.getElementById('perf-hud-latency');
            const profileEl = document.getElementById('perf-hud-profile');

            if (fpsEl) {
                fpsEl.textContent = `${this.avgFps} / ${this.onePercentLow}`;
                fpsEl.className = 'val ' + (this.avgFps >= 50 ? 'good' : (this.avgFps >= 30 ? 'warn' : 'bad'));
            }

            if (ftEl) {
                ftEl.textContent = `${this.frameTime.toFixed(1)} ms`;
            }

            if (spikesEl) {
                spikesEl.textContent = `${this.frameSpikes} (Stutter: ${this.longFrames})`;
                spikesEl.className = 'val ' + (this.longFrames > 5 ? 'bad' : (this.frameSpikes > 0 ? 'warn' : 'good'));
            }

            if (memEl) {
                if (performance && performance.memory && performance.memory.usedJSHeapSize) {
                    const mb = (performance.memory.usedJSHeapSize / (1024 * 1024)).toFixed(1);
                    memEl.textContent = `${mb} MB`;
                } else {
                    memEl.textContent = 'Browser Locked';
                }
            }

            if (nodesEl) {
                nodesEl.textContent = document.getElementsByTagName('*').length;
            }

            if (latencyEl) {
                latencyEl.textContent = `${this.lastApiLatency || 0} ms`;
            }

            if (profileEl) {
                profileEl.textContent = `${this.selectedProfile.toUpperCase()} (${this.effectiveProfile.toUpperCase()})`;
            }
        }

        // ---------------------------------------------------------------------
        // Built-in Stress Test & Hardware Benchmark
        // ---------------------------------------------------------------------
        runBenchmark() {
            const benchBtn = document.getElementById('perf-hud-bench-btn');
            if (benchBtn) {
                benchBtn.disabled = true;
                benchBtn.textContent = 'PROBANDO...';
            }

            const startTime = performance.now();
            let framesCounted = 0;
            let longFramesCounted = 0;
            const durations = [];

            let lastT = performance.now();
            const sampleFrame = () => {
                const now = performance.now();
                const d = now - lastT;
                lastT = now;
                durations.push(d);
                framesCounted++;
                if (d > 33.3) longFramesCounted++;

                if (now - startTime < 2500) {
                    requestAnimationFrame(sampleFrame);
                } else {
                    // Benchmark complete
                    const totalTime = performance.now() - startTime;
                    const realFps = Math.round((framesCounted / (totalTime / 1000)));
                    const avgDuration = (durations.reduce((a, b) => a + b, 0) / durations.length).toFixed(1);

                    let recommended = PROFILES.MAXIMUM;
                    if (realFps < 35 || longFramesCounted > 8) recommended = PROFILES.POTATO;
                    else if (realFps < 48 || longFramesCounted > 4) recommended = PROFILES.MEDIUM;
                    else if (realFps < 58) recommended = PROFILES.HEAVY;

                    if (benchBtn) {
                        benchBtn.disabled = false;
                        benchBtn.textContent = `PUNTAJE: ${realFps} FPS`;
                    }

                    if (typeof window.toast === 'function') {
                        window.toast(`🏁 Benchmark Finalizado: ${realFps} FPS Promedio (${avgDuration}ms por frame). Perfil recomendado: ${recommended.toUpperCase()}`, 'info');
                    }
                }
            };

            requestAnimationFrame(sampleFrame);
        }
    }

    // Instantiate and auto-initialize on script execution
    const engine = new PerformanceEngine();
    engine.init();

})(window, document);
