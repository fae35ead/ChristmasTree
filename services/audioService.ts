
// A simple synthesizer using the Web Audio API to create magical sounds
// avoiding the need for external MP3 assets that might link-rot.

let audioCtx: AudioContext | null = null;

const getContext = () => {
  if (!audioCtx) {
    audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
  }
  return audioCtx;
};

const createGain = (ctx: AudioContext, t: number, duration: number, vol: number) => {
    const gain = ctx.createGain();
    gain.gain.setValueAtTime(vol, t);
    gain.gain.exponentialRampToValueAtTime(0.001, t + duration);
    return gain;
};

export const playExplosionSound = () => {
  try {
    const ctx = getContext();
    if(ctx.state === 'suspended') ctx.resume();
    const t = ctx.currentTime;

    // 1. Warm Low Thrum (instead of harsh noise)
    // Simulates a heavy object moving through air / magical release
    const osc1 = ctx.createOscillator();
    osc1.type = 'sine';
    const gain1 = createGain(ctx, t, 2.0, 0.8);
    
    osc1.frequency.setValueAtTime(120, t);
    osc1.frequency.exponentialRampToValueAtTime(40, t + 1.5);
    
    osc1.connect(gain1);
    gain1.connect(ctx.destination);
    osc1.start(t);
    osc1.stop(t + 2.0);

    // 2. Magical Wind Chimes (Cascading) to replace the shatter sound
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
    try {
        const ctx = getContext();
        if(ctx.state === 'suspended') ctx.resume();
        const t = ctx.currentTime;
    
        // A soft "Ting" or "Whoosh"
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
