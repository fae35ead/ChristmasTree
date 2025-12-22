import React, { useState, useRef, Suspense, useEffect } from 'react';
import { Scene } from './components/Scene';
import { UIOverlay } from './components/UIOverlay';
import { Loader } from './components/Loader';
import { playExplosionSound, playMagicSound, initAudio, toggleMute, getMuteState, unlockAudio } from './services/audioService';

const App: React.FC = () => {
  const [isExploded, setIsExploded] = useState(false);
  const [isMuted, setIsMuted] = useState(false); 
  
  const dragStartPos = useRef<{x: number, y: number} | null>(null);
  const isDragging = useRef(false);

  useEffect(() => {
    // 1. 初始化状态和音频对象
    setIsMuted(getMuteState());
    initAudio();

    // 2. 核心修复：移动端音频解锁必须依赖全局的用户交互事件
    const handleGlobalInteraction = () => {
      unlockAudio();
      // 一旦解锁成功，移除监听器以节省资源
      window.removeEventListener('click', handleGlobalInteraction);
      window.removeEventListener('touchstart', handleGlobalInteraction);
    };

    window.addEventListener('click', handleGlobalInteraction);
    window.addEventListener('touchstart', handleGlobalInteraction);

    return () => {
      window.removeEventListener('click', handleGlobalInteraction);
      window.removeEventListener('touchstart', handleGlobalInteraction);
    };
  }, []);

  const handlePointerDown = (e: React.PointerEvent) => {
    // 交互时再次尝试解锁，确保万无一失
    unlockAudio();
    dragStartPos.current = { x: e.clientX, y: e.clientY };
    isDragging.current = false;
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!dragStartPos.current) return;
    const dx = e.clientX - dragStartPos.current.x;
    const dy = e.clientY - dragStartPos.current.y;
    const distance = Math.sqrt(dx * dx + dy * dy);
    if (distance > 5) {
      isDragging.current = true;
    }
  };

  const handlePointerUp = () => {
    if (!isDragging.current && !isExploded) {
      playExplosionSound();
      setIsExploded(true);
    }
    dragStartPos.current = null;
    isDragging.current = false;
  };

  const handleReset = (e: React.MouseEvent) => {
    e.stopPropagation();
    playMagicSound();
    setIsExploded(false);
  };

  const handleToggleAudio = () => {
    const newState = !isMuted;
    setIsMuted(newState);
    toggleMute(newState);
  };

  return (
    <div 
      className="relative w-full h-screen overflow-hidden bg-emerald-950 text-gold-100 selection:bg-gold-500 selection:text-emerald-950 cursor-pointer"
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
    >
      <Suspense fallback={<Loader />}>
        <Scene isExploded={isExploded} />
      </Suspense>
      
      <UIOverlay 
        isExploded={isExploded} 
        onReset={handleReset} 
        onToggleAudio={handleToggleAudio}
        isMuted={isMuted}
      />
      
      <div className="pointer-events-none fixed inset-0 opacity-[0.03] z-40 mix-blend-overlay" 
           style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")` }}>
      </div>
    </div>
  );
};

export default App;