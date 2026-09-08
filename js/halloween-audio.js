// halloween-audio.js
const HWAudio = {
  enabled: true,
  volume: 0.5,
  musicVolume: 0.3,
  
  // Create audio instances
  sfx: {
    correct: new Audio('https://dl.dropboxusercontent.com/scl/fi/rurdyi741m2lja9ccmxvj/Correct-Answer-Sound-Effect.mp3?rlkey=eiu254jzz26g4yqoita04ncb7&st=guya9v63'), // Spooky chime
    incorrect: new Audio('https://dl.dropboxusercontent.com/scl/fi/lqwt9s6ozvfzu7mxftdqv/Error-Sound-Effect-Non-copyright-sound-effects-TCW-SoundEffects.mp3?rlkey=qyjqzt0qu2ackt33koalcfzct&st=ajpz8dad'), // Dark thud
    victory: new Audio('https://docs.google.com/uc?export=download&id=1Xb-UHzYqt676FAhXtfjVxZ_inOCTwIx3'), // Triumphant
    purchase: new Audio('https://cdn.pixabay.com/download/audio/2021/08/04/audio_3d19eb2056.mp3?filename=coins-purchase-sound-effect.mp3'),
    click: new Audio('https://cdn.pixabay.com/download/audio/2022/03/15/audio_2491bb4c03.mp3?filename=menu-click-89198.mp3') // Subtle click
  },
  
  music: {
    lobby: null, // Will reference DOM element
    game: null   // Will reference DOM element
  },

  _pools: {},
  _poolIndices: {},

  init() {
    this.music.lobby = document.getElementById('lobby-music');
    this.music.game = document.getElementById('background-music');
    
    // Set volumes
    this.updateVolumes();
    
    // Attempt to play lobby music immediately if allowed by browser
    if (this.music.lobby) {
       this.music.lobby.volume = this.musicVolume;
    }

    // Pre-initialize pools for low latency & 0 garbage collection pauses
    Object.keys(this.sfx).forEach(name => {
      this._pools[name] = [
        this.sfx[name],
        this.sfx[name].cloneNode()
      ];
      this._poolIndices[name] = 0;
    });

    // Pause music when tab is hidden to save battery & CPU
    window.addEventListener('tom:visibilitySuspended', () => {
      if (this.music.lobby && !this.music.lobby.paused) {
        this._wasPlayingLobby = true;
        this.music.lobby.pause();
      }
      if (this.music.game && !this.music.game.paused) {
        this._wasPlayingGame = true;
        this.music.game.pause();
      }
    });

    window.addEventListener('tom:visibilityResumed', () => {
      if (this.enabled) {
        if (this._wasPlayingLobby && this.music.lobby) {
          this.music.lobby.play().catch(() => {});
          this._wasPlayingLobby = false;
        }
        if (this._wasPlayingGame && this.music.game) {
          this.music.game.play().catch(() => {});
          this._wasPlayingGame = false;
        }
      }
    });
  },

  updateVolumes() {
    Object.values(this.sfx).forEach(audio => {
      audio.volume = this.volume;
    });
    if (this._pools) {
      Object.values(this._pools).forEach(pool => {
        pool.forEach(audio => { audio.volume = this.volume; });
      });
    }
    if (this.music.lobby) this.music.lobby.volume = this.musicVolume;
    if (this.music.game) this.music.game.volume = this.musicVolume;
  },

  play(soundName) {
    if (!this.enabled || !this.sfx[soundName]) return;
    
    // Use pre-allocated audio pool instead of cloneNode() to prevent GC micro-stutter
    if (!this._pools[soundName]) {
      this._pools[soundName] = [this.sfx[soundName], this.sfx[soundName].cloneNode()];
      this._poolIndices[soundName] = 0;
    }

    const pool = this._pools[soundName];
    const idx = this._poolIndices[soundName] || 0;
    this._poolIndices[soundName] = (idx + 1) % pool.length;

    const sound = pool[idx];
    sound.volume = this.volume;
    sound.currentTime = 0;
    
    sound.play().catch(e => {
        // Handled silently for un-interacted states
    });
  },
  
  playMusic(trackName) {
    if (!this.enabled) return;
    
    this.stopMusic();
    
    if (this.music[trackName]) {
      this.music[trackName].play().catch(e => console.warn("Music play blocked:", e));
    }
  },
  
  stopMusic() {
    if (this.music.lobby) {
      this.music.lobby.pause();
      this.music.lobby.currentTime = 0;
    }
    if (this.music.game) {
      this.music.game.pause();
      this.music.game.currentTime = 0;
    }
  },
  
  toggle(state) {
    this.enabled = state;
    if (!this.enabled) {
      this.stopMusic();
    } else {
      // Logic for what music to resume should be handled by the game state
    }
  }
};

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
  HWAudio.init();
});

// Override the global playSound function if it exists, or create it
window.playSound = function(type) {
  if (type === 'correct') HWAudio.play('correct');
  else if (type === 'incorrect') HWAudio.play('incorrect');
  else if (type === 'victory') HWAudio.play('victory');
  else if (type === 'purchase') HWAudio.play('purchase');
  else if (type === 'click' || type === 'select') HWAudio.play('click');
};
