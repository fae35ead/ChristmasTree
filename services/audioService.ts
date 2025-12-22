
// A service to handle background music and sound effects

let audioCtx: AudioContext | null = null;
let bgmAudio: HTMLAudioElement | null = null;
let isMuted = false;
let isBgmStarted = false;

// Kevin MacLeod - Jingle Bells (Reliable Source from Archive.org)
const BGM_URL = "https://ia800501.us.archive.org/6/items/kevin-mac-leod-jingle-bells/Kevin_MacLeod_-_Jingle_Bells.mp3"; 

const getContext = () => {
  if (!audioCtx) {
    audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 44100 });
  }
  return audioCtx;
};

// Robust unlocker for mobile devices
export const unlockAudio = async () => {
  if (isMuted) return;

  const ctx = getContext();
  
  // 1. Resume AudioContext (Web Audio API)
  if (ctx.state === 'suspended') {
    try {
      await ctx.resume();
    } catch (e) {
      console.warn("Failed to resume AudioContext:", e);
    }
  }

  // 2. Play Background Music (HTML5 Audio)
  if (bgmAudio) {
    if (bgmAudio.paused) {
      try {
        // Essential for mobile: play must be triggered inside the call stack of a user gesture
        const playPromise = bgmAudio.play();
        if (playPromise !== undefined) {
          await playPromise;
          isBgmStarted = true;
        }
      } catch (error) {
        // This is expected if the gesture wasn't recognized yet or still loading
      }
    }
  }

  // 3. Optional: Play a silent buffer for Web Audio API "priming"
  if (ctx.state === 'running') {
    const buffer = ctx.createBuffer(1, 1, 22050);
    const source = ctx.createBufferSource();
    source.buffer = buffer;
    source.connect(ctx.destination);
    source.start(0);
  }
};

export const initAudio = () => {
  // Purely setup objects without trying to play immediately (to avoid blocking errors)
  if (!bgmAudio) {
    bgmAudio = new Audio();
    bgmAudio.src = BGM_URL;
    bgmAudio.loop = true;
    bgmAudio.volume = 0.25;
    bgmAudio.preload = 'auto';
    bgmAudio.crossOrigin = "anonymous";
    bgmAudio.load();
  }
  getContext();
};

export const toggleMute = (muted: boolean) => {
  isMuted = muted;
  
  if (bgmAudio) {
    if (isMuted) {
      bgmAudio.pause();
    } else {
      unlockAudio();
    }
  }

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

const ensureAudioReady = () => {
    if (isMuted) return false;
    unlockAudio(); // Attempt unlock on every sound effect play
    return true;
};

export const playExplosionSound = () => {
  if (!ensureAudioReady()) return;
  
  try {
    const ctx = getContext();
    const t = ctx.currentTime;

    const osc1 = ctx.createOscillator();
    osc1.type = 'sine';
    const gain1 = createGain(ctx, t, 2.0, 0.8);
    
    osc1.frequency.setValueAtTime(120, t);
    osc1.frequency.exponentialRampToValueAtTime(40, t + 1.5);
    
    osc1.connect(gain1);
    gain1.connect(ctx.destination);
    osc1.start(t);
    osc1.stop(t + 2.0);

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
  } catch (e) {}
};

export const playMagicSound = () => {
  if (!ensureAudioReady()) return;
  try {
    const ctx = getContext();
    const t = ctx.currentTime;
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
  } catch (e) {}
};

export const playRevealSound = () => {
    if (!ensureAudioReady()) return;
    try {
        const ctx = getContext();
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
      } catch (e) {}
}
