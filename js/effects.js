class EffectsSystem {
    constructor() {
        this.container = document.createElement('div');
        this.container.id = 'vfx-layer';
        this.container.style.position = 'fixed';
        this.container.style.top = '0';
        this.container.style.left = '0';
        this.container.style.width = '100vw';
        this.container.style.height = '100vh';
        this.container.style.pointerEvents = 'none';
        this.container.style.zIndex = '9999';
        
        document.addEventListener('DOMContentLoaded', () => {
            document.body.appendChild(this.container);
        });
    }

    spawnParticles(x, y, count = 10, color = '#ff6600', type = 'normal') {
        if (window.potatoMode || localStorage.getItem('vfxEnabled') === 'false') return;
        
        const perf = window.PerformanceManager;
        const multiplier = perf ? perf.getParticleMultiplier() : 1.0;
        if (multiplier <= 0) return;

        const maxTotal = perf ? perf.getMaxParticles() : 30;
        const currentTotal = this.container.children.length;
        if (currentTotal >= maxTotal) return;

        const realCount = Math.min(maxTotal - currentTotal, Math.max(1, Math.round(count * multiplier)));
        
        for(let i=0; i<realCount; i++) {
            const particle = document.createElement('div');
            particle.className = `particle ${type}`;
            particle.style.left = `${x}px`;
            particle.style.top = `${y}px`;
            particle.style.backgroundColor = color;
            if (multiplier >= 0.5) {
                particle.style.boxShadow = `0 0 8px ${color}`;
            }
            
            const angle = Math.random() * Math.PI * 2;
            const velocity = Math.random() * 40 + 15;
            const vx = Math.cos(angle) * velocity;
            const vy = Math.sin(angle) * velocity - 15;
            
            particle.style.setProperty('--vx', `${vx}px`);
            particle.style.setProperty('--vy', `${vy}px`);
            
            this.container.appendChild(particle);
            
            setTimeout(() => {
                if(particle.parentNode) particle.remove();
            }, 800);
        }
    }

    playAura(type) {
        if (window.potatoMode || localStorage.getItem('vfxEnabled') === 'false') return;
        const body = document.body;
        body.classList.remove('aura-cosmic', 'aura-inferno', 'aura-divine');
        body.classList.add(`aura-${type}`);
        
        setTimeout(() => {
            body.classList.remove(`aura-${type}`);
        }, 2500);
    }

    /* ---- VFX: Pérdida de energía ---- */
    triggerEnergyLossVFX() {
        if (localStorage.getItem('vfxEnabled') === 'false' || window.potatoMode) {
            // Potato fallback: simple shake, zero extra DOM nodes created
            const cont = document.querySelector('.container');
            if (cont) {
                cont.classList.add('shake');
                setTimeout(() => cont.classList.remove('shake'), 300);
            }
            return;
        }

        // Lightweight Flash
        const flash = document.createElement('div');
        flash.className = 'energy-loss-flash';
        document.body.appendChild(flash);
        setTimeout(() => flash.remove(), 400);

        // Shake del contenedor
        const cont = document.querySelector('.container');
        if (cont) {
            cont.classList.add('shake');
            setTimeout(() => cont.classList.remove('shake'), 400);
        }
    }

    /* ---- VFX: Respuesta correcta (confetti mini) ---- */
    triggerCorrectVFX() {
        if (localStorage.getItem('vfxEnabled') === 'false' || window.potatoMode) return;
        
        const perf = window.PerformanceManager;
        const multiplier = perf ? perf.getParticleMultiplier() : 1.0;
        if (multiplier <= 0) return;

        const count = multiplier < 0.6 ? 3 : 6;
        const colors = ['#ff6600', '#9333ea', '#39ff14', '#ffd700'];
        
        for (let i = 0; i < count; i++) {
            const p = document.createElement('div');
            p.className = 'confetti-particle';
            p.style.cssText = `left:${42 + Math.random() * 16}%; top:48%; background:${colors[i % colors.length]}; --cx:${Math.random() * 60 - 30}px;`;
            document.body.appendChild(p);
            setTimeout(() => p.remove(), 600);
        }
    }
}

const Effects = new EffectsSystem();
window.Effects = Effects;
window._vfx = { 
    energyLoss: () => Effects.triggerEnergyLossVFX(), 
    correct: () => Effects.triggerCorrectVFX() 
};
