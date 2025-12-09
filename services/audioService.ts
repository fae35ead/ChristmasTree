
// A service to handle background music and sound effects

let audioCtx: AudioContext | null = null;
let bgmAudio: HTMLAudioElement | null = null;
let isMuted = false;
let isInitialized = false;

// URL for a gentle instrumental Christmas track (We Wish You a Merry Christmas)
// Using a reliable public domain/CC0 source
const BGM_URL = "https://cdn.pixabay.com/audio/2022/11/22/audio_febc508520.mp3"; 

const getContext = () => {
  if (!audioCtx) {
    audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
  }
  return audioCtx;
};

export const initAudio = () => {
  if (isInitialized) return;
  
  // 1. Initialize Web Audio Context (needed for SFX)
  const ctx = getContext();
  if (ctx.state === 'suspended') {
    ctx.resume();
  }

  // 2. Initialize Background Music
  if (!bgmAudio) {
    bgmAudio = new Audio(BGM_URL);
    bgmAudio.loop = true;
    bgmAudio.volume = 0.4; // Gentle background level
    
    // Try to play immediately if not muted
    if (!isMuted) {
      bgmAudio.play().catch(e => {
        console.log("Autoplay blocked, waiting for interaction", e);
      });
    }
  }

  isInitialized = true;
};

export const toggleMute = (muted: boolean) => {
  isMuted = muted;
  
  // Handle BGM
  if (bgmAudio) {
    if (isMuted) {
      bgmAudio.pause();
    } else {
      // Resume if initialized
      bgmAudio.play().catch(console.error);
    }
  }

  // Handle SFX Context
  const ctx = getContext();
  if (isMuted) {
    ctx.suspend();
  } else {
    ctx.resume();
  }
};

export const getMuteState = () => isMuted;

// --- SFX Generators ---

const createGain = (ctx: AudioContext, t: number, duration: number, vol: number) => {
    const gain = ctx.createGain();
    gain.gain.setValueAtTime(vol, t);
    gain.gain.exponentialRampToValueAtTime(0.001, t + duration);
    return gain;
};

export const playExplosionSound = () => {
  if (isMuted) return;
  
  try {
    const ctx = getContext();
    if(ctx.state === 'suspended') ctx.resume();
    const t = ctx.currentTime;

    // 1. Warm Low Thrum
    const osc1 = ctx.createOscillator();
    osc1.type = 'sine';
    const gain1 = createGain(ctx, t, 2.0, 0.8);
    
    osc1.frequency.setValueAtTime(120, t);
    osc1.frequency.exponentialRampToValueAtTime(40, t + 1.5);
    
    osc1.connect(gain1);
    gain1.connect(ctx.destination);
    osc1.start(t);
    osc1.stop(t + 2.0);

    // 2. Magical Wind Chimes
    const frequencies = [880, 1174, 1318, 1760, 2093];
    frequencies.forEach((freq, i) => {
        const osc = ctx.createOscillator();
        osc.type = 'triangle';
        const gain = createGain(ctx, t + (i * 0.08), 1.2, 0.1);
        osc.frequency.setValueAtTime(freq, t);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(t + (i * 0.08));
        osc.stop(t + (i * 0.08) + 1.2);
    });

  } catch (e) {
    console.error("Audio playback failed", e);
  }
};

export const playMagicSound = () => {
  if (isMuted) return;

  try {
    const ctx = getContext();
    if(ctx.state === 'suspended') ctx.resume();
    const t = ctx.currentTime;

    // Reset/Magic Swell
    const osc2 = ctx.createOscillator();
    osc2.type = 'sine';
    const gain2 = ctx.createGain();
    gain2.gain.setValueAtTime(0, t);
    gain2.gain.linearRampToValueAtTime(0.2, t + 0.5);
    gain2.gain.linearRampToValueAtTime(0, t + 1.5);
    
    osc2.frequency.setValueAtTime(300, t);
    osc2.frequency.linearRampToValueAtTime(600, t + 1.5);
    
    osc2.connect(gain2);
    gain2.connect(ctx.destination);
    osc2.start(t);
    osc2.stop(t + 2);

  } catch (e) {
    console.error("Audio playback failed", e);
  }
};

export const playRevealSound = () => {
    if (isMuted) return;

    try {
        const ctx = getContext();
        if(ctx.state === 'suspended') ctx.resume();
        const t = ctx.currentTime;
    
        const osc = ctx.createOscillator();
        osc.type = 'sine';
        const gain = createGain(ctx, t, 1.5, 0.3);
        
        osc.frequency.setValueAtTime(800, t);
        osc.frequency.exponentialRampToValueAtTime(1200, t + 0.2);
        
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(t);
        osc.stop(t + 1.5);
    
      } catch (e) {
        console.error("Audio playback failed", e);
      }
}
