class SoundEngine {
  private ctx: AudioContext | null = null;
  private currentTrackId: string = "";
  private currentStep: number = 0;
  private sequencerTimer: any = null;
  private isMusicMuted: boolean = true;
  private musicGainNode: GainNode | null = null;

  constructor() {
    if (typeof window !== "undefined") {
      const resumeAudio = () => {
        if (this.ctx) {
          if (this.ctx.state === "suspended") {
            this.ctx.resume().then(() => {
              console.log("🔊 AudioContext resumed successfully via user gesture!");
              if (!this.isMusicMuted && this.currentTrackId) {
                this.restartSequencer();
              }
            }).catch(e => console.warn("Failed to resume AudioContext:", e));
          }
        } else {
          try {
            this.getContext();
            console.log("🔊 AudioContext initialized via user gesture!");
          } catch (e) {}
        }
        
        // Remove listeners if active and running
        if (this.ctx && this.ctx.state === "running") {
          window.removeEventListener("click", resumeAudio);
          window.removeEventListener("keydown", resumeAudio);
          window.removeEventListener("touchstart", resumeAudio);
        }
      };

      window.addEventListener("click", resumeAudio, { passive: true });
      window.addEventListener("keydown", resumeAudio, { passive: true });
      window.addEventListener("touchstart", resumeAudio, { passive: true });
    }
  }

  private getContext(): AudioContext {
    if (!this.ctx) {
      // @ts-ignore
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      this.ctx = new AudioCtx();
    }
    if (this.ctx.state === "suspended") {
      this.ctx.resume().catch((e) => console.warn("Error resuming context:", e));
    }
    return this.ctx;
  }

  // Quick retro click beep
  playBeep() {
    try {
      const ctx = this.getContext();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = "square";
      osc.frequency.setValueAtTime(600, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(150, ctx.currentTime + 0.1);

      gain.gain.setValueAtTime(0.25, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.1);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start();
      osc.stop(ctx.currentTime + 0.1);
    } catch (e) {
      // Ignore audio constraints
    }
  }

  // Retro attack strike sound
  playHit() {
    try {
      const ctx = this.getContext();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = "triangle";
      osc.frequency.setValueAtTime(150, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(40, ctx.currentTime + 0.2);

      gain.gain.setValueAtTime(0.4, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.25);

      // Noise component for texture
      const bufferSize = ctx.sampleRate * 0.1;
      const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
      const data = buffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        data[i] = Math.random() * 2 - 1;
      }
      const noise = ctx.createBufferSource();
      noise.buffer = buffer;
      const noiseGain = ctx.createGain();
      noiseGain.gain.setValueAtTime(0.15, ctx.currentTime);
      noiseGain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.1);

      noise.connect(noiseGain);
      noiseGain.connect(ctx.destination);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start();
      osc.stop(ctx.currentTime + 0.25);
      noise.start();
      noise.stop(ctx.currentTime + 0.1);
    } catch (e) {}
  }

  // Retro heal chime arpeggio
  playHeal() {
    try {
      const ctx = this.getContext();
      const now = ctx.currentTime;
      const notes = [261.63, 329.63, 392.00, 523.25, 659.25, 783.99, 1046.50]; // C Major arpeggio

      notes.forEach((freq, idx) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();

        osc.type = "sine";
        osc.frequency.setValueAtTime(freq, now + idx * 0.06);

        gain.gain.setValueAtTime(0.18, now + idx * 0.06);
        gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.06 + 0.15);

        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.start(now + idx * 0.06);
        osc.stop(now + idx * 0.06 + 0.15);
      });
    } catch (e) {}
  }

  // Pokemon fainting down-sweep
  playFaint() {
    try {
      const ctx = this.getContext();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = "sawtooth";
      osc.frequency.setValueAtTime(300, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(30, ctx.currentTime + 0.5);

      gain.gain.setValueAtTime(0.3, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.5);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start();
      osc.stop(ctx.currentTime + 0.5);
    } catch (e) {}
  }

  // Mew Cry (Cute double squeak)
  playMewCry() {
    try {
      const ctx = this.getContext();
      const now = ctx.currentTime;

      // Squeak 1
      const osc1 = ctx.createOscillator();
      const gain1 = ctx.createGain();
      osc1.type = "sine";
      osc1.frequency.setValueAtTime(800, now);
      osc1.frequency.exponentialRampToValueAtTime(1400, now + 0.15);
      gain1.gain.setValueAtTime(0.25, now);
      gain1.gain.exponentialRampToValueAtTime(0.01, now + 0.15);
      osc1.connect(gain1);
      gain1.connect(ctx.destination);
      osc1.start(now);
      osc1.stop(now + 0.15);

      // Squeak 2
      const osc2 = ctx.createOscillator();
      const gain2 = ctx.createGain();
      osc2.type = "sine";
      osc2.frequency.setValueAtTime(1000, now + 0.1);
      osc2.frequency.exponentialRampToValueAtTime(1600, now + 0.3);
      gain2.gain.setValueAtTime(0.2, now + 0.1);
      gain2.gain.exponentialRampToValueAtTime(0.001, now + 0.3);
      osc2.connect(gain2);
      gain2.connect(ctx.destination);
      osc2.start(now + 0.1);
      osc2.stop(now + 0.3);
    } catch (e) {}
  }

  // Retro level up fan-fare
  playLevelUp() {
    try {
      const ctx = this.getContext();
      const now = ctx.currentTime;
      // Retro success arpeggio
      const notes = [440.00, 440.00, 440.00, 440.00, 554.37, 493.88, 554.37, 587.33, 659.25];
      const durations = [0.1, 0.1, 0.1, 0.2, 0.1, 0.1, 0.1, 0.1, 0.4];
      let cumulativeTime = 0;

      notes.forEach((freq, idx) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();

        osc.type = "square";
        osc.frequency.setValueAtTime(freq, now + cumulativeTime);

        gain.gain.setValueAtTime(0.2, now + cumulativeTime);
        gain.gain.exponentialRampToValueAtTime(0.001, now + cumulativeTime + durations[idx]);

        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.start(now + cumulativeTime);
        osc.stop(now + cumulativeTime + durations[idx]);

        cumulativeTime += durations[idx] - 0.02;
      });
    } catch (e) {}
  }

  // Background Music Sequencer Methods
  setMusicTrack(trackId: string) {
    if (this.currentTrackId === trackId) return;
    this.currentTrackId = trackId;
    this.currentStep = 0; // reset sequence to start of song
    this.restartSequencer();
  }

  setMuteMusic(muted: boolean) {
    this.isMusicMuted = muted;
    if (muted) {
      if (this.musicGainNode) {
        try {
          this.musicGainNode.gain.setValueAtTime(0, this.getContext().currentTime);
        } catch (e) {}
      }
    } else {
      this.restartSequencer();
    }
  }

  private getStepDuration(): number {
    if (this.currentTrackId === "gsc-trainerbattle" || this.currentTrackId === "rby-gym" || this.currentTrackId === "gsc-wildbattle") {
      return 0.13; // fast battle tempo
    }
    if (this.currentTrackId === "gsc-pkmncenter" || this.currentTrackId === "pallet-town") {
      return 0.22; // soothing center / peaceful town tempo
    }
    if (this.currentTrackId === "lavender-town") {
      return 0.25; // slow creepy spooky tempo
    }
    return 0.18; // route adventure tempo
  }

  private restartSequencer() {
    if (this.sequencerTimer) {
      clearInterval(this.sequencerTimer);
      this.sequencerTimer = null;
    }

    if (this.isMusicMuted || !this.currentTrackId) return;

    // Ensure AudioContext is running
    try {
      this.getContext();
    } catch (e) {}

    const intervalMs = this.getStepDuration() * 1000;
    
    // Play first step immediately
    this.playSequencerStep();
    
    this.sequencerTimer = setInterval(() => {
      this.playSequencerStep();
    }, intervalMs);
  }

  private playSequencerStep() {
    try {
      if (this.isMusicMuted || !this.currentTrackId) return;
      const ctx = this.getContext();
      
      // Initialize music gain node if not present
      if (!this.musicGainNode) {
        this.musicGainNode = ctx.createGain();
        this.musicGainNode.connect(ctx.destination);
      }
      
      // Retro chiptune comfortable background volume (raised from 0.04 to 0.35)
      this.musicGainNode.gain.setValueAtTime(0.35, ctx.currentTime);

      let melody: string[] = [];
      let bass: string[] = [];
      let type: OscillatorType = "square";
      let bassType: OscillatorType = "triangle";

      if (this.currentTrackId === "gsc-route29") {
        melody = ROUTE29_MELODY;
        bass = ROUTE29_BASS;
        type = "square";
        bassType = "triangle";
      } else if (this.currentTrackId === "gsc-route30") {
        melody = ROUTE30_MELODY;
        bass = ROUTE30_BASS;
        type = "square";
        bassType = "triangle";
      } else if (this.currentTrackId === "gsc-trainerbattle") {
        melody = BATTLE_TRAINER_MELODY;
        bass = BATTLE_TRAINER_BASS;
        type = "square";
        bassType = "triangle";
      } else if (this.currentTrackId === "rby-gym") {
        melody = BATTLE_GYM_MELODY;
        bass = BATTLE_GYM_BASS;
        type = "square";
        bassType = "sawtooth";
      } else if (this.currentTrackId === "gsc-wildbattle") {
        melody = BATTLE_WILD_MELODY;
        bass = BATTLE_WILD_BASS;
        type = "square";
        bassType = "triangle";
      } else if (this.currentTrackId === "gsc-pkmncenter") {
        melody = POKECENTER_MELODY;
        bass = POKECENTER_BASS;
        type = "sine";
        bassType = "triangle";
      } else if (this.currentTrackId === "pallet-town") {
        melody = PALLET_MELODY;
        bass = PALLET_BASS;
        type = "sine";
        bassType = "triangle";
      } else if (this.currentTrackId === "lavender-town") {
        melody = LAVENDER_MELODY;
        bass = LAVENDER_BASS;
        type = "sine";
        bassType = "sine";
      } else {
        melody = ROUTE29_MELODY;
        bass = ROUTE29_BASS;
        type = "square";
        bassType = "triangle";
      }

      if (melody.length === 0) return;

      const step = this.currentStep % melody.length;
      const mNote = melody[step];
      const bNote = bass[step];

      const now = ctx.currentTime;
      const stepDuration = this.getStepDuration();

      // Play Melody Note
      if (mNote && mNote !== "R") {
        const freq = NOTES[mNote];
        if (freq) {
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          osc.type = type;
          osc.frequency.setValueAtTime(freq, now);
          
          if (this.currentTrackId === "gsc-pkmncenter") {
            gain.gain.setValueAtTime(0.2, now);
            gain.gain.exponentialRampToValueAtTime(0.001, now + stepDuration - 0.02);
          } else {
            gain.gain.setValueAtTime(0.25, now);
            gain.gain.exponentialRampToValueAtTime(0.001, now + stepDuration - 0.03);
          }

          osc.connect(gain);
          gain.connect(this.musicGainNode);
          osc.start(now);
          osc.stop(now + stepDuration - 0.01);
        }
      }

      // Play Bass Note
      if (bNote && bNote !== "R") {
        const freq = NOTES[bNote];
        if (freq) {
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          osc.type = bassType;
          osc.frequency.setValueAtTime(freq, now);

          gain.gain.setValueAtTime(0.15, now);
          gain.gain.exponentialRampToValueAtTime(0.001, now + stepDuration - 0.02);

          osc.connect(gain);
          gain.connect(this.musicGainNode);
          osc.start(now);
          osc.stop(now + stepDuration - 0.01);
        }
      }

      this.currentStep++;
    } catch (e) {
      console.warn("Error in sequencer step:", e);
    }
  }
}

// Retro Note Frequencies
const NOTES: { [key: string]: number } = {
  'C3': 130.81, 'C#3': 138.59, 'D3': 146.83, 'D#3': 155.56, 'E3': 164.81, 'F3': 174.61, 'F#3': 185.00, 'G3': 196.00, 'G#3': 207.65, 'A3': 220.00, 'A#3': 233.08, 'B3': 246.94,
  'C4': 261.63, 'C#4': 277.18, 'D4': 293.66, 'D#4': 311.13, 'E4': 329.63, 'F4': 349.23, 'F#4': 369.99, 'G4': 392.00, 'G#4': 415.30, 'A4': 440.00, 'A#4': 466.16, 'B4': 493.88,
  'C5': 523.25, 'C#5': 554.37, 'D5': 587.33, 'D#5': 622.25, 'E5': 659.25, 'F5': 698.46, 'F#5': 739.99, 'G5': 783.99, 'G#5': 830.61, 'A5': 880.00, 'A#5': 932.33, 'B5': 987.77,
  'C6': 1046.50, 'C#6': 1109.73, 'D6': 1174.66, 'D#6': 1244.51, 'E6': 1318.51, 'F6': 1396.91, 'F#6': 1479.98, 'G6': 1567.98, 'A6': 1760.00,
  'R': 0 // Rest
};

// Route 29 Theme Melody & Bassline (GSC)
const ROUTE29_MELODY = [
  "D5", "E5", "F#5", "G5", "A5", "D6", "C#6", "B5", "A5", "G5", "F#5", "E5", "D5", "E5", "F#5", "G5",
  "A5", "F#5", "D5", "E5", "G5", "B5", "A5", "G5", "F#5", "E5", "D5", "E5", "F#5", "G5", "A5", "R"
];
const ROUTE29_BASS = [
  "D3", "A3", "D3", "A3", "F#3", "C#4", "F#3", "C#4", "G3", "D4", "G3", "D4", "A3", "E4", "A3", "E4",
  "D3", "A3", "D3", "A3", "F#3", "C#4", "F#3", "C#4", "G3", "D4", "A3", "E4", "D3", "A3", "D3", "R"
];

// Route 30 Theme Melody & Bassline (GSC)
const ROUTE30_MELODY = [
  "E5", "G#5", "B5", "E6", "D#6", "B5", "G#5", "E5", "A5", "C#6", "E6", "A6", "G#6", "E6", "C#6", "A5",
  "B5", "D#6", "F#6", "B6", "A#6", "F#6", "D#6", "B5", "E6", "B5", "G#5", "E5", "F#5", "A5", "B5", "R"
];
const ROUTE30_BASS = [
  "E3", "B3", "E3", "B3", "A3", "E4", "A3", "E4", "B3", "F#4", "B3", "F#4", "E3", "B3", "E3", "R",
  "E3", "B3", "E3", "B3", "A3", "E4", "A3", "E4", "B3", "F#4", "B3", "F#4", "E3", "B3", "E3", "R"
];

// Pokémon Center Theme Melody & Bassline (GSC)
const POKECENTER_MELODY = [
  "C5", "E5", "G5", "C6", "B5", "A5", "G5", "E5", "F5", "A5", "C6", "F6", "E6", "D6", "C6", "G5",
  "C5", "E5", "G5", "C6", "B5", "A5", "G5", "C6", "D6", "B5", "G5", "F5", "E5", "D5", "C5", "R"
];
const POKECENTER_BASS = [
  "C3", "G3", "C4", "G3", "C3", "G3", "C4", "G3", "F3", "C4", "F4", "C4", "C3", "G3", "C4", "G3",
  "C3", "G3", "C4", "G3", "F3", "C4", "F4", "C4", "G3", "D4", "G4", "D4", "C3", "G3", "C4", "R"
];

// Trainer Battle Theme Melody & Bassline (GSC)
const BATTLE_TRAINER_MELODY = [
  "D5", "F5", "A5", "D6", "C#6", "A5", "F5", "D5", "E5", "G5", "A#5", "E6", "D#6", "A#5", "G5", "E5",
  "F5", "A5", "C6", "F6", "E6", "C6", "A5", "F5", "G5", "A#5", "D6", "G6", "F#6", "D6", "A#5", "G5"
];
const BATTLE_TRAINER_BASS = [
  "D3", "D3", "A3", "A3", "D3", "D3", "A3", "A3", "G3", "G3", "D4", "D4", "G3", "G3", "D4", "D4",
  "F3", "F3", "C4", "C4", "F3", "F3", "C4", "C4", "A3", "A3", "E4", "E4", "A3", "A3", "E4", "E4"
];

// Gym Leader Theme Melody & Bassline (RBY)
const BATTLE_GYM_MELODY = [
  "A4", "C5", "E5", "A5", "G5", "E5", "C5", "A4", "F4", "A4", "C5", "F5", "E5", "C5", "A4", "F4",
  "G4", "B4", "D5", "G5", "F5", "D5", "B4", "G4", "A4", "B4", "C5", "D5", "E5", "F#5", "G#5", "R"
];
const BATTLE_GYM_BASS = [
  "A2", "A2", "A2", "A2", "F2", "F2", "F2", "F2", "G2", "G2", "G2", "G2", "E2", "E2", "E2", "E2",
  "A2", "A2", "A2", "A2", "F2", "F2", "F2", "F2", "G2", "G2", "G2", "G2", "E2", "B2", "E3", "R"
];

// Wild Pokémon Theme Melody & Bassline (GSC)
const BATTLE_WILD_MELODY = [
  "F#5", "A5", "C#6", "F#6", "E6", "C#6", "A5", "F#5", "G5", "B5", "D6", "G6", "F#6", "D6", "B5", "G5",
  "E5", "G5", "B5", "E6", "D#6", "B5", "G5", "E5", "A5", "C5", "E5", "A5", "G#5", "E5", "C5", "A4"
];
const BATTLE_WILD_BASS = [
  "F#3", "F#3", "F#3", "F#3", "G3", "G3", "G3", "G3", "E3", "E3", "E3", "E3", "A3", "A3", "A3", "A3",
  "F#3", "F#3", "F#3", "F#3", "G3", "G3", "G3", "G3", "E3", "E3", "E3", "E3", "A2", "E3", "A3", "R"
];

// Pallet Town (RBY)
const PALLET_MELODY = [
  "G5", "B5", "D6", "B5", "C6", "A5", "F#5", "D5", "G5", "B5", "D6", "G6", "F#6", "E6", "D6", "R",
  "C6", "E6", "G6", "E6", "D6", "B5", "G5", "D5", "A5", "B5", "C6", "A5", "B5", "G5", "D5", "R"
];
const PALLET_BASS = [
  "G3", "D4", "G3", "D4", "D3", "A3", "D3", "A3", "G3", "D4", "G3", "D4", "C3", "G3", "C3", "R",
  "C3", "G3", "C3", "G3", "G3", "D4", "G3", "D4", "A3", "E4", "A3", "E4", "G3", "D4", "G3", "R"
];

// Lavender Town (RBY)
const LAVENDER_MELODY = [
  "B5", "G5", "F#5", "B5", "C6", "G5", "F#5", "C6", "B5", "G5", "F#5", "B5", "A5", "F#5", "D#5", "A5",
  "G5", "E5", "D5", "G5", "F#5", "D5", "C5", "F#5", "E5", "B4", "G4", "E5", "D#5", "B4", "F#4", "R"
];
const LAVENDER_BASS = [
  "E3", "E3", "E3", "E3", "C3", "C3", "C3", "C3", "G3", "G3", "G3", "G3", "B2", "B2", "B2", "B2",
  "C3", "C3", "C3", "C3", "D3", "D3", "D3", "D3", "E3", "E3", "E3", "E3", "B2", "F#3", "B3", "R"
];

export const sound = new SoundEngine();
