
import React, { useEffect, useState } from 'react';
import { playRevealSound } from '../services/audioService';

interface UIOverlayProps {
  isExploded: boolean;
  onReset: (e: React.MouseEvent) => void;
}

export const UIOverlay: React.FC<UIOverlayProps> = ({ isExploded, onReset }) => {
  const [showContent, setShowContent] = useState(false);

  useEffect(() => {
    if (isExploded) {
      // Delay showing text to allow explosion animation to play out
      const timer = setTimeout(() => {
          setShowContent(true);
          playRevealSound();
      }, 800);
      return () => clearTimeout(timer);
    } else {
      setShowContent(false);
    }
  }, [isExploded]);

  return (
    <div className="absolute inset-0 pointer-events-none flex flex-col justify-between p-6 z-10 font-chinese">
      
      {/* Header */}
      <header className={`flex justify-between items-start transition-opacity duration-1000 ${isExploded ? 'opacity-0' : 'opacity-100'}`}>
        <div>
          <h1 className="font-serif font-bold text-4xl md:text-5xl text-transparent bg-clip-text bg-gradient-to-r from-gold-300 via-gold-100 to-gold-400 drop-shadow-lg tracking-wide">
            给小V的圣诞树
          </h1>
          <p className="font-chinese text-emerald-400/80 text-sm tracking-[0.2em] mt-2 ml-1">
            2025 CHRISTMAS
          </p>
        </div>
      </header>

      {/* Center Message Area */}
      <main className="flex-1 flex items-center justify-center pointer-events-none px-4">
        {showContent && (
            <div className="flex flex-col items-center">
                <div className="bg-emerald-950/80 backdrop-blur-md border border-gold-600/30 p-8 md:p-12 max-w-2xl text-center shadow-[0_0_80px_rgba(251,191,36,0.2)] animate-in fade-in zoom-in duration-700 slide-in-from-bottom-10 pointer-events-auto relative overflow-hidden group rounded-sm">
                    
                    {/* Decorative corners */}
                    <div className="absolute top-0 left-0 w-6 h-6 border-t-2 border-l-2 border-gold-400"></div>
                    <div className="absolute top-0 right-0 w-6 h-6 border-t-2 border-r-2 border-gold-400"></div>
                    <div className="absolute bottom-0 left-0 w-6 h-6 border-b-2 border-l-2 border-gold-400"></div>
                    <div className="absolute bottom-0 right-0 w-6 h-6 border-b-2 border-r-2 border-gold-400"></div>

                    <div className="relative z-10">
                        <h2 className="font-serif text-3xl text-gold-300 mb-6 drop-shadow-md">Surprise!</h2>
                        {/* Hardcoded line breaks for better typography as requested */}
                        <p className="font-chinese text-lg md:text-xl text-gold-50 leading-loose mb-8 drop-shadow-sm font-light whitespace-nowrap md:whitespace-normal">
                            祝小V老师圣诞快乐，开开心心，<br/>
                            拍更多好看的照片、赚更多的工资，<br/>
                            以及希望你可以无忧无虑地做真实的自己！
                        </p>
                        <div className="w-16 h-[1px] bg-gold-500/50 mx-auto mb-6"></div>
                        <p className="font-chinese text-gold-400 text-base tracking-[0.2em] italic">
                            爱来自椰椰
                        </p>
                    </div>
                </div>

                {/* Return Button */}
                <button 
                    onClick={onReset}
                    className="mt-8 pointer-events-auto px-6 py-2 border border-gold-500/30 text-gold-300 font-chinese text-sm tracking-widest hover:bg-gold-500/10 transition-colors duration-300 rounded-full animate-in fade-in slide-in-from-bottom-4 delay-500"
                >
                    再看一次
                </button>
            </div>
        )}
      </main>

      {/* Footer Hint */}
      <footer className={`pointer-events-none flex flex-col items-center justify-center pb-12 transition-all duration-700 ${isExploded ? 'opacity-0 translate-y-10' : 'opacity-100'}`}>
        <div className="animate-bounce">
            <p className="font-chinese text-gold-300 text-sm tracking-[0.3em] uppercase opacity-80 bg-emerald-950/40 px-4 py-2 rounded-full backdrop-blur-sm border border-gold-500/20">
                点击屏幕 开启惊喜
            </p>
        </div>
      </footer>
      
      {/* Decorative Borders */}
      <div className={`fixed top-4 left-4 right-4 bottom-4 border border-gold-500/10 pointer-events-none z-50 mix-blend-screen rounded-lg transition-opacity duration-1000 ${isExploded ? 'opacity-20' : 'opacity-100'}`}></div>
    </div>
  );
};
