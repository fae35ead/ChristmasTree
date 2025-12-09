
import React from 'react';
import { useProgress } from '@react-three/drei';

export const Loader: React.FC = () => {
  const { progress } = useProgress();

  return (
    <div className="absolute inset-0 z-50 flex flex-col items-center justify-center bg-emerald-950 text-gold-100">
      <div className="flex flex-col items-center p-8 animate-pulse">
        <h2 className="font-chinese text-xl md:text-2xl tracking-[0.2em] mb-4 text-center text-gold-300">
          请耐心等待，属于你的圣诞树即将来临...
        </h2>
        <div className="w-64 h-1 bg-emerald-900 rounded-full overflow-hidden border border-gold-600/30">
          <div 
            className="h-full bg-gold-400 transition-all duration-300 ease-out shadow-[0_0_10px_#fbbf24]"
            style={{ width: `${progress}%` }}
          />
        </div>
        <p className="font-mono text-gold-500/60 mt-2 text-sm">
          {Math.floor(progress)}%
        </p>
      </div>
    </div>
  );
};
