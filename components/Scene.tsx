
import React, { Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Environment } from '@react-three/drei';
import { ChristmasTree } from './ChristmasTree';
import { Effects } from './Effects';

declare global {
  namespace JSX {
    interface IntrinsicElements {
      color: any;
      fog: any;
      ambientLight: any;
      spotLight: any;
      pointLight: any;
    }
  }
}

interface SceneProps {
    isExploded: boolean;
}

export const Scene: React.FC<SceneProps> = ({ isExploded }) => {
  return (
    <div className="w-full h-full absolute inset-0 bg-emerald-950 transition-colors duration-1000 ease-in-out">
      <Canvas
        shadows
        dpr={[1, 2]} // High res for quality
        gl={{ antialias: true, toneMappingExposure: 1.2 }}
        camera={{ position: [0, 2, 35], fov: 35 }}
      >
        <Suspense fallback={null}>
          <color attach="background" args={['#011c16']} />
          <fog attach="fog" args={['#011c16', 10, isExploded ? 50 : 45]} />

          <ambientLight intensity={0.5} />
          <pointLight position={[10, 10, 10]} intensity={8} color="#fcd34d" />
          <pointLight position={[-10, 5, 10]} intensity={4} color="#34d399" />
          
          <ChristmasTree isExploded={isExploded} />
          
          <Environment preset="night" blur={1} />
          
          <Effects />
          
          <OrbitControls 
            enablePan={false} 
            autoRotate={!isExploded}
            autoRotateSpeed={0.8} 
            minPolarAngle={Math.PI / 4} 
            maxPolarAngle={Math.PI / 1.5}
            enableZoom={false}
            target={[0, 1, 0]}
          />
        </Suspense>
      </Canvas>
    </div>
  );
};
