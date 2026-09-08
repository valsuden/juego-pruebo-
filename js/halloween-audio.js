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

  init() {
    this.music.lobby = document.getElementById('lobby-music');
    this.music.game = document.getElementById('background-music');
    
    // Set volumes
    this.updateVolumes();
    
    // Attempt to play lobby music immediately if allowed by browser
    if (this.music.lobby) {
       this.music.lobby.volume = this.musicVolume;
    }
  },

  updateVolumes() {
    Object.values(this.sfx).forEach(audio => {
      audio.volume = this.volume;
    });
    if (this.music.lobby) this.music.lobby.volume = this.musicVolume;
    if (this.music.game) this.music.game.volume = this.musicVolume;
  },

  play(soundName) {
    if (!this.enabled || !this.sfx[soundName]) return;
    
    // Clone node to allow overlapping sounds
    const sound = this.sfx[soundName].cloneNode();
    sound.volume = this.volume;
    
    sound.play().catch(e => {
        // Ignore playback errors (e.g., user hasn't interacted yet)
        console.warn("Audio play blocked:", e);
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
