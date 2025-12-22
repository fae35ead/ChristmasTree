import React, { useState, useRef, Suspense, useEffect } from 'react';
import { Scene } from './components/Scene';
import { UIOverlay } from './components/UIOverlay';
import { Loader } from './components/Loader';
// 注意：删除了 unlockAudio，因为它在 service 内部自动处理了
import { playExplosionSound, playMagicSound, initAudio, toggleMute, getMuteState } from './services/audioService';

const App: React.FC = () => {
  const [isExploded, setIsExploded] = useState(false);
  // 这里的初始状态直接获取，不要放在 useState 初始值函数里调用，防止SSR问题（虽然这里是SPA）
  const [isMuted, setIsMuted] = useState(false); 
  
  const dragStartPos = useRef<{x: number, y: number} | null>(null);
  const isDragging = useRef(false);

  useEffect(() => {
    // 同步一下初始静音状态
    setIsMuted(getMuteState());

    // 1. 初始化音频服务
    // 新版 audioService 会自动添加全局点击监听来处理 BGM
    initAudio();

    // 这里不需要再手动添加 window.addEventListener 了
    // audioService.ts 内部已经做好了这一切
  }, []);

  const handlePointerDown = (e: React.PointerEvent) => {
    // 这里不需要显式调用 unlockAudio，因为 initAudio 里的全局监听器会捕捉到这次点击
    
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
      // 播放爆炸音效
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
    // toggleMute 内部也会处理 AudioContext 的 resume，不需要手动 unlock
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