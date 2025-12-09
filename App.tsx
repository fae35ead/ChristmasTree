
import React, { useState, useRef, Suspense, useEffect } from 'react';
import { Scene } from './components/Scene';
import { UIOverlay } from './components/UIOverlay';
import { Loader } from './components/Loader';
import { playExplosionSound, playMagicSound, initAudio, toggleMute, getMuteState } from './services/audioService';

const App: React.FC = () => {
  const [isExploded, setIsExploded] = useState(false);
  const [isMuted, setIsMuted] = useState(getMuteState());
  
  // Refs for tracking drag vs click
  const dragStartPos = useRef<{x: number, y: number} | null>(null);
  const isDragging = useRef(false);

  // Attempt autoplay on mount
  useEffect(() => {
    initAudio();
  }, []);

  const handlePointerDown = (e: React.PointerEvent) => {
    // Attempt to initialize audio on interaction (mobile policy unlock)
    // This is safe to call repeatedly as it handles its own state checks
    initAudio();
    
    dragStartPos.current = { x: e.clientX, y: e.clientY };
    isDragging.current = false;
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!dragStartPos.current) return;
    
    // Calculate distance moved
    const dx = e.clientX - dragStartPos.current.x;
    const dy = e.clientY - dragStartPos.current.y;
    const distance = Math.sqrt(dx * dx + dy * dy);
    
    // If moved more than 5 pixels, consider it a drag operation (orbiting)
    if (distance > 5) {
      isDragging.current = true;
    }
  };

  const handlePointerUp = () => {
    // Only trigger interaction if it wasn't a drag
    if (!isDragging.current && !isExploded) {
      playExplosionSound();
      setIsExploded(true);
    }
    // Reset
    dragStartPos.current = null;
    isDragging.current = false;
  };

  const handleReset = (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent triggering handleInteraction immediately
    playMagicSound();
    setIsExploded(false);
  };

  const handleToggleAudio = () => {
    const newState = !isMuted;
    setIsMuted(newState);
    toggleMute(newState);
    
    // Force init if not already (in case user clicks this button first to UNMUTE)
    if (!newState) {
      initAudio();
    }
  };

  return (
    <div 
      className="relative w-full h-screen overflow-hidden bg-emerald-950 text-gold-100 selection:bg-gold-500 selection:text-emerald-950 cursor-pointer"
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
    >
      <Suspense fallback={<Loader />}>
        {/* 3D Scene Background */}
        <Scene isExploded={isExploded} />
      </Suspense>
      
      {/* UI Overlay */}
      <UIOverlay 
        isExploded={isExploded} 
        onReset={handleReset} 
        onToggleAudio={handleToggleAudio}
        isMuted={isMuted}
      />
      
      {/* Texture Overlay for Grain */}
      <div className="pointer-events-none fixed inset-0 opacity-[0.03] z-40 mix-blend-overlay" 
           style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")` }}>
      </div>
    </div>
  );
};

export default App;
