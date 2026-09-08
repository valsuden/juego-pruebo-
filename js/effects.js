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
        if (window.potatoMode) return;
        
        for(let i=0; i<count; i++) {
            const particle = document.createElement('div');
            particle.className = `particle ${type}`;
            particle.style.left = `${x}px`;
            particle.style.top = `${y}px`;
            particle.style.backgroundColor = color;
            particle.style.boxShadow = `0 0 10px ${color}, 0 0 20px ${color}`;
            
            const angle = Math.random() * Math.PI * 2;
            const velocity = Math.random() * 50 + 20;
            const vx = Math.cos(angle) * velocity;
            const vy = Math.sin(angle) * velocity - 20;
            
            particle.style.setProperty('--vx', `${vx}px`);
            particle.style.setProperty('--vy', `${vy}px`);
            
            this.container.appendChild(particle);
            
            setTimeout(() => {
                if(particle.parentNode) particle.remove();
            }, 1000);
        }
    }

    playAura(type) {
        if (window.potatoMode) return;
        const body = document.body;
        body.classList.remove('aura-cosmic', 'aura-inferno', 'aura-divine');
        body.classList.add(`aura-${type}`);
        
        setTimeout(() => {
            body.classList.remove(`aura-${type}`);
        }, 3000);
    }

    /* ---- VFX: Pérdida de energía ---- */
    triggerEnergyLossVFX() {
        if (localStorage.getItem('vfxEnabled') === 'false' || window.potatoMode) return;
        // Flash rojo en pantalla
        var flash = document.createElement('div');
        flash.className = 'energy-loss-flash';
        document.body.appendChild(flash);
        setTimeout(function () { flash.remove(); }, 500);

        // Icono flotante
        var icon = document.createElement('div');
        icon.className = 'energy-loss-icon';
        icon.innerHTML = `<span class="hw-icon-placeholder" data-icon="energy_empty">${window.HWIcon ? window.HWIcon('energy_empty') : ''}</span>`;
        document.body.appendChild(icon);
        setTimeout(function () { icon.remove(); }, 800);

        // Shake del contenedor
        var cont = document.querySelector('.container');
        if (cont) {
            cont.classList.add('shake');
            setTimeout(function () { cont.classList.remove('shake'); }, 500);
        }
    }

    /* ---- VFX: Respuesta correcta (confetti mini) ---- */
    triggerCorrectVFX() {
        if (localStorage.getItem('vfxEnabled') === 'false' || window.potatoMode) return;
        var colors = ['#ff6600', '#9333ea', '#39ff14', '#cc0000', '#f5e6d3'];
        for (var i = 0; i < 8; i++) {
            (function (idx) {
                setTimeout(() => {
                    var p = document.createElement('div');
                    p.className = 'confetti-particle';
                    p.style.cssText = 'left:' + (40 + Math.random() * 20) + '%; top:50%;' +
                        'background:' + colors[Math.floor(Math.random() * colors.length)] + ';' +
                        '--cx:' + (Math.random() * 80 - 40) + 'px;' +
                        'box-shadow: 0 0 4px ' + colors[Math.floor(Math.random() * colors.length)];
                    document.body.appendChild(p);
                    setTimeout(function () { p.remove(); }, 700);
                }, idx * 40);
            })(i);
        }
    }
}

const Effects = new EffectsSystem();
window.Effects = Effects;
window._vfx = { 
    energyLoss: () => Effects.triggerEnergyLossVFX(), 
    correct: () => Effects.triggerCorrectVFX() 
};
