
import React from 'react';
import { EffectComposer, Bloom, Vignette } from '@react-three/postprocessing';

export const Effects: React.FC = () => {
  return (
    <EffectComposer enableNormalPass={false}>
      {/* Ethereal Glow - Softer radius, balanced intensity for a dreamy look */}
      <Bloom 
        luminanceThreshold={0.2} 
        mipmapBlur 
        intensity={1.5} 
        radius={0.8}
        levels={9}
      />
      
      {/* Subtle Vignette for cinematic focus */}
      <Vignette 
        eskil={false} 
        offset={0.1} 
        darkness={0.8} 
      />
    </EffectComposer>
  );
};
