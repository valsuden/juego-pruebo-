// =============================================================================
// SETTINGS — Trials of Mastery
// =============================================================================

// ---------------------------------------------------------------------------
// applySettings — Apply a settings object to the UI and audio elements.
// Exposed globally so it can be called from Users.load() after cloud sync.
// ---------------------------------------------------------------------------
function _updateToggleState(btn, isOn) {
    if (!btn) return;
    // Clear legacy inline styles that might break CSS themes
    btn.style.background = '';
    btn.style.color = '';
    
    btn.classList.toggle('is-on', !!isOn);
    btn.classList.toggle('is-off', !isOn);
    btn.setAttribute('aria-checked', isOn ? 'true' : 'false');
    btn.innerHTML = `<span class="toggle-indicator"></span><span class="toggle-text">${isOn ? 'ON' : 'OFF'}</span>`;
}

window.applySettings = function (settings) {
    settings = settings || {};

    const musicEnabled  = settings.musicEnabled !== undefined ? settings.musicEnabled : true;
    const vfxEnabled    = settings.vfxEnabled   !== undefined ? settings.vfxEnabled   : true;
    const potatoEnabled = settings.potatoEnabled !== undefined ? settings.potatoEnabled : false;
    const graphicsQuality = settings.graphicsQuality || 'auto';

    // Apply audio mute state
    document.querySelectorAll('audio').forEach(audio => {
        audio.muted = !musicEnabled;
    });
    if (window.HWAudio) {
        window.HWAudio.setSFXEnabled(vfxEnabled);
    }

    // Update Potato Mode globals and CSS
    window.potatoMode = potatoEnabled || graphicsQuality === 'potato';
    if (window.potatoMode) {
        document.body.classList.add('potato-mode');
    } else {
        document.body.classList.remove('potato-mode');
    }

    // Update toggle buttons with clean state classes
    _updateToggleState(document.getElementById('toggle-music-btn'), musicEnabled);
    _updateToggleState(document.getElementById('toggle-vfx-btn'), vfxEnabled);
    _updateToggleState(document.getElementById('toggle-potato-btn'), potatoEnabled);

    // Update graphics quality select
    const graphicsSelect = document.getElementById('graphics-quality-select');
    if (graphicsSelect) {
        graphicsSelect.value = graphicsQuality;
    }
};

// ---------------------------------------------------------------------------
// _getSettings — Read settings from profile if logged in, else localStorage
// ---------------------------------------------------------------------------
function _getSettings() {
    if (typeof Users !== 'undefined' && Users.data && Users.data.settings) {
        return Users.data.settings;
    }
    return {
        musicEnabled:  localStorage.getItem('musicEnabled') !== 'false',
        vfxEnabled:    localStorage.getItem('vfxEnabled')   !== 'false',
        potatoEnabled: localStorage.getItem('potatoEnabled') === 'true',
        graphicsQuality: localStorage.getItem('graphicsQuality') || 'auto'
    };
}

// ---------------------------------------------------------------------------
// _saveSettings — Write settings to profile (syncs to cloud) + localStorage
// ---------------------------------------------------------------------------
function _saveSettings(settings) {
    // Always persist in localStorage as fallback
    localStorage.setItem('musicEnabled',  settings.musicEnabled);
    localStorage.setItem('vfxEnabled',    settings.vfxEnabled);
    localStorage.setItem('potatoEnabled', settings.potatoEnabled);
    localStorage.setItem('graphicsQuality', settings.graphicsQuality || 'auto');

    // Persist in user profile if a user is logged in (syncs across devices)
    if (typeof Users !== 'undefined' && Users.data) {
        Users.data.settings = settings;
        Users.save();
    }
}

// ---------------------------------------------------------------------------
// DOMContentLoaded — Wire up settings UI
// ---------------------------------------------------------------------------
document.addEventListener('DOMContentLoaded', () => {
    const settingsBtn    = document.getElementById('settings-btn');
    const settingsOverlay = document.getElementById('settings-overlay');
    const closeSettings  = document.getElementById('close-settings');
    const toggleMusicBtn = document.getElementById('toggle-music-btn');
    const toggleVfxBtn   = document.getElementById('toggle-vfx-btn');
    const togglePotatoBtn = document.getElementById('toggle-potato-btn');

    const termsLink      = document.getElementById('terms-link');
    const termsOverlay   = document.getElementById('terms-overlay');
    const termsModal     = document.getElementById('terms-modal');
    const closeTerms     = document.getElementById('close-terms');
    const termsContainer = document.getElementById('terms-content-container');

    // Load terms
    if (termsContainer && typeof gameTermsAndConditions !== 'undefined') {
        termsContainer.innerHTML = gameTermsAndConditions + '<br><br><br>';
    }

    // Apply initial settings (profile may not be loaded yet; uses localStorage fallback)
    window.applySettings(_getSettings());

    // Settings panel open/close
    if (settingsBtn) {
        settingsBtn.addEventListener('click', () => {
            // Re-apply current settings when opening the panel so toggles are in sync
            window.applySettings(_getSettings());
            settingsOverlay.style.display = 'flex';
            if (typeof window.renderHWIcons === 'function') {
                window.renderHWIcons(settingsOverlay);
            }
            settingsBtn.style.transform   = 'rotate(90deg)';
            setTimeout(() => { settingsBtn.style.transform = 'rotate(0deg)'; }, 200);
        });
    }

    if (closeSettings) {
        closeSettings.addEventListener('click', () => {
            settingsOverlay.style.display = 'none';
        });
    }

    if (settingsOverlay) {
        settingsOverlay.addEventListener('click', (e) => {
            if (e.target === settingsOverlay) {
                settingsOverlay.style.display = 'none';
            }
        });
    }

    // Escape key listener for settings and terms modals
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            if (settingsOverlay && settingsOverlay.style.display !== 'none') {
                settingsOverlay.style.display = 'none';
            }
            if (termsOverlay && termsOverlay.style.display !== 'none') {
                hideTerms();
            }
        }
    });

    // Music toggle
    if (toggleMusicBtn) {
        toggleMusicBtn.addEventListener('click', () => {
            const s = _getSettings();
            s.musicEnabled = !s.musicEnabled;
            _saveSettings(s);
            window.applySettings(s);
        });
    }

    // VFX toggle
    if (toggleVfxBtn) {
        toggleVfxBtn.addEventListener('click', () => {
            const s = _getSettings();
            s.vfxEnabled = !s.vfxEnabled;
            _saveSettings(s);
            window.applySettings(s);
        });
    }

    // Potato Mode toggle
    if (togglePotatoBtn) {
        togglePotatoBtn.addEventListener('click', () => {
            const s = _getSettings();
            s.potatoEnabled = !s.potatoEnabled;
            _saveSettings(s);
            window.applySettings(s);
            if (s.potatoEnabled && typeof toast === 'function') {
                toast('🥔 Potato Mode Activado: Rendimiento mejorado.', 'info');
            }
        });
    }

    const graphicsSelect = document.getElementById('graphics-quality-select');
    if (graphicsSelect) {
        graphicsSelect.value = _getSettings().graphicsQuality || 'auto';
        graphicsSelect.addEventListener('change', (e) => {
            const val = e.target.value;
            const s = _getSettings();
            s.graphicsQuality = val;
            _saveSettings(s);
            if (window.PerformanceManager) {
                window.PerformanceManager.setProfile(val, true);
            } else {
                window.applySettings(s);
            }
        });
    }

    // Terms modal
    if (termsLink) {
        termsLink.addEventListener('click', () => {
            termsOverlay.style.display = 'flex';
            setTimeout(() => { termsModal.style.height = '75vh'; }, 10);
        });
    }

    const hideTerms = () => {
        termsModal.style.height = '0';
        setTimeout(() => { termsOverlay.style.display = 'none'; }, 400);
    };

    if (closeTerms) closeTerms.addEventListener('click', hideTerms);
    if (termsOverlay) {
        termsOverlay.addEventListener('click', e => { if (e.target === termsOverlay) hideTerms(); });
    }
});

