
import React, { useRef, useMemo, useState, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import { Float, Sparkles, Extrude } from '@react-three/drei';
import * as THREE from 'three';

// Manually define intrinsic elements for Three.js to resolve TypeScript JSX errors.
declare global {
  namespace JSX {
    interface IntrinsicElements {
      group: any;
      mesh: any;
      meshStandardMaterial: any;
      meshPhysicalMaterial: any;
      sphereGeometry: any;
      coneGeometry: any;
      torusGeometry: any;
      cylinderGeometry: any;
      pointLight: any;
      boxGeometry: any;
      octahedronGeometry: any;
      dodecahedronGeometry: any;
      tetrahedronGeometry: any;
      capsuleGeometry: any;
      planeGeometry: any;
      meshBasicMaterial: any;
      ambientLight: any;
      spotLight: any;
      fog: any;
      color: any;
    }
  }
}

// --- High Fidelity Materials ---

const GoldMaterial = () => (
  // Using meshPhysicalMaterial defined in global JSX namespace
  <meshPhysicalMaterial 
    color="#fbbf24" 
    emissive="#B8860B"
    emissiveIntensity={0.2}
    roughness={0.15}
    metalness={1.0}
    clearcoat={1.0}
    clearcoatRoughness={0.1}
  />
);

const GlowingGoldMaterial = () => (
    // Using meshBasicMaterial defined in global JSX namespace
    <meshBasicMaterial 
      color={[2, 1.5, 0.5]} 
      toneMapped={false}
    />
);

const PineLeafMaterial = () => (
  // Using meshStandardMaterial defined in global JSX namespace
  <meshStandardMaterial 
    color="#047857" 
    emissive="#064e3b" 
    emissiveIntensity={0.2} 
    roughness={0.8} 
    metalness={0.1} 
  />
);

const RedVelvetMaterial = () => (
    // Using meshStandardMaterial defined in global JSX namespace
    <meshStandardMaterial
        color="#991b1b"
        roughness={0.7}
        metalness={0.1}
    />
);

const PaperMaterial = () => (
    // Using meshStandardMaterial defined in global JSX namespace
    <meshStandardMaterial
        color="#f3f4f6"
        roughness={0.9}
        metalness={0}
    />
);

const CookieMaterial = () => (
    // Using meshStandardMaterial defined in global JSX namespace
    <meshStandardMaterial
        color="#d97706"
        roughness={0.9}
        metalness={0}
    />
);

const GlowingHeartMaterial = () => (
    // Using meshPhysicalMaterial defined in global JSX namespace
    <meshPhysicalMaterial
        color="#e11d48"
        emissive="#ff0033"
        emissiveIntensity={2.0}
        roughness={0.2}
        metalness={0.2}
        transmission={0.2}
        thickness={1}
    />
);

// --- Geometries ---

const ShapeExtrusion = ({ pathShape, color, scale = 1, ...props }: any) => (
    // Extrude and meshStandardMaterial defined in JSX namespace
    <Extrude args={[pathShape, { depth: 0.2, bevelEnabled: true, bevelThickness: 0.02, bevelSize: 0.02, bevelSegments: 3, steps: 1 }]} {...props} scale={[scale, scale, scale]} rotation={[Math.PI, 0, 0]}>
       <meshStandardMaterial color={color} roughness={0.3} metalness={0.6} />
    </Extrude>
);

const HeartGeometry = (props: any) => {
  const shape = useMemo(() => {
    const s = new THREE.Shape();
    const x = 0, y = 0;
    s.moveTo(x + 0.5, y + 0.5);
    s.bezierCurveTo(x + 0.5, y + 0.5, x + 0.4, y, x, y);
    s.bezierCurveTo(x - 0.6, y, x - 0.6, y + 0.7, x - 0.6, y + 0.7);
    s.bezierCurveTo(x - 0.6, y + 1.1, x - 0.2, y + 1.54, x + 0.5, y + 1.9);
    s.bezierCurveTo(x + 1.2, y + 1.54, x + 1.6, y + 1.1, x + 1.6, y + 0.7);
    s.bezierCurveTo(x + 1.6, y + 0.7, x + 1.6, y, x + 1.0, y);
    s.bezierCurveTo(x + 0.7, y, x + 0.5, y + 0.5, x + 0.5, y + 0.5);
    return s;
  }, []);
  return <ShapeExtrusion pathShape={shape} color="#be123c" position={[-0.5, 1, 0]} {...props} />;
};

const MoonGeometry = (props: any) => {
    const shape = useMemo(() => {
        const s = new THREE.Shape();
        s.absarc(0, 0, 1, 0, Math.PI * 2, false);
        const hole = new THREE.Path();
        hole.absarc(0.5, 0.2, 0.9, 0, Math.PI * 2, true);
        s.holes.push(hole);
        return s;
    }, []);
    return (
        <Extrude args={[shape, { depth: 0.2, bevelEnabled: true, bevelThickness: 0.05, bevelSize: 0.05, steps: 1 }]} {...props} scale={0.6} rotation={[0, 0, Math.PI / 4]}>
            <GoldMaterial />
        </Extrude>
    );
};

const StarShape = (props: any) => {
    const shape = useMemo(() => {
        const s = new THREE.Shape();
        const outerRadius = 1;
        const innerRadius = 0.4;
        const numPoints = 5;
        for (let i = 0; i < numPoints * 2; i++) {
            const radius = i % 2 === 0 ? outerRadius : innerRadius;
            const angle = (i / (numPoints * 2)) * Math.PI * 2;
            const x = Math.sin(angle) * radius;
            const y = Math.cos(angle) * radius;
            if (i === 0) s.moveTo(x, y);
            else s.lineTo(x, y);
        }
        s.closePath();
        return s;
    }, []);
    return (
        <Extrude args={[shape, { depth: 0.3, bevelEnabled: true, bevelThickness: 0.1, bevelSize: 0.05, steps: 1 }]} {...props}>
             <GlowingGoldMaterial />
        </Extrude>
    )
}

// --- Logic Components ---

const ExplodingPart = ({ 
    children, 
    isExploded, 
    distance = 5, 
    rotationSpeed = 1,
    speed,
    randomDelay = 0
}: { 
    children: React.ReactNode, 
    isExploded: boolean, 
    distance?: number, 
    rotationSpeed?: number,
    speed?: number,
    randomDelay?: number
}) => {
    const meshRef = useRef<THREE.Group>(null);
    const originalPos = useRef<THREE.Vector3>(new THREE.Vector3());
    const direction = useRef(new THREE.Vector3());
    const rotationAxis = useRef(new THREE.Vector3(Math.random(), Math.random(), Math.random()).normalize());
    
    const progress = useRef(0);
    const initialized = useRef(false);

    useEffect(() => {
        if (meshRef.current && !initialized.current) {
            originalPos.current.copy(meshRef.current.position);
            direction.current.copy(originalPos.current).normalize();
            if (direction.current.lengthSq() < 0.1) {
                 direction.current.set(Math.random()-0.5, Math.random(), Math.random()-0.5).normalize();
            }
            direction.current.y += 0.4;
            direction.current.normalize();
            initialized.current = true;
        }
    }, []);
    
    useFrame((state, delta) => {
        if (!meshRef.current || !initialized.current) return;
        
        const target = isExploded ? 1 : 0;
        const currentSpeed = speed !== undefined ? speed : (isExploded ? 3 : 1.5); 
        
        if (Math.abs(progress.current - target) > 0.001) {
             progress.current = THREE.MathUtils.lerp(progress.current, target, delta * currentSpeed);
        } else {
            progress.current = target;
        }

        const explosionDistance = distance * progress.current;
        
        meshRef.current.position.copy(originalPos.current).add(
            direction.current.clone().multiplyScalar(explosionDistance)
        );

        if (progress.current > 0.01) {
             meshRef.current.rotation.x += rotationAxis.current.x * delta * rotationSpeed * progress.current;
             meshRef.current.rotation.y += rotationAxis.current.y * delta * rotationSpeed * progress.current;
             meshRef.current.rotation.z += rotationAxis.current.z * delta * rotationSpeed * progress.current;
        } else {
             meshRef.current.rotation.set(0,0,0);
        }
    });

    // Using group defined in global JSX namespace
    return <group ref={meshRef}>{children}</group>;
};

// --- Tree Branch ---

const PineBranch = () => {
    return (
        // Using group, mesh, and coneGeometry defined in global JSX namespace
        <group rotation={[Math.PI * 0.15, 0, 0]}>
            <mesh position={[0, 0, 0]} scale={[1, 1, 1]}>
                <coneGeometry args={[1.2, 2.5, 32]} />
                <PineLeafMaterial />
            </mesh>
        </group>
    );
};

// --- Ornaments ---

const GiftOrnament = () => (
    // Using group, mesh, and boxGeometry defined in global JSX namespace
    <group scale={0.4} rotation={[Math.random(), Math.random(), Math.random()]}>
        <mesh castShadow>
            <boxGeometry args={[1, 0.8, 1]} />
            <RedVelvetMaterial />
        </mesh>
        <mesh scale={[1.02, 1, 0.2]}>
            <boxGeometry args={[1, 0.82, 1]} />
            <GoldMaterial />
        </mesh>
        <mesh scale={[0.2, 1, 1.02]}>
            <boxGeometry args={[1, 0.82, 1]} />
            <GoldMaterial />
        </mesh>
    </group>
);

const GingerbreadMan = () => (
    // Using group, mesh, sphereGeometry, and capsuleGeometry defined in global JSX namespace
    <group scale={0.35}>
        <mesh position={[0, 0.8, 0]}>
            <sphereGeometry args={[0.4, 16, 16]} />
            <CookieMaterial />
        </mesh>
        <mesh position={[0, 0, 0]} scale={[1, 1, 0.5]}>
            <sphereGeometry args={[0.5, 16, 16]} />
            <CookieMaterial />
        </mesh>
        <mesh position={[-0.5, 0.2, 0]} rotation={[0, 0, 1]}>
             <capsuleGeometry args={[0.15, 0.5, 4, 8]} />
             <CookieMaterial />
        </mesh>
        <mesh position={[0.5, 0.2, 0]} rotation={[0, 0, -1]}>
             <capsuleGeometry args={[0.15, 0.5, 4, 8]} />
             <CookieMaterial />
        </mesh>
        <mesh position={[-0.3, -0.6, 0]} rotation={[0, 0, 0.2]}>
             <capsuleGeometry args={[0.15, 0.6, 4, 8]} />
             <CookieMaterial />
        </mesh>
        <mesh position={[0.3, -0.6, 0]} rotation={[0, 0, -0.2]}>
             <capsuleGeometry args={[0.15, 0.6, 4, 8]} />
             <CookieMaterial />
        </mesh>
    </group>
);

const PolaroidPhoto = () => (
    // Using group, mesh, boxGeometry, planeGeometry, and meshBasicMaterial defined in global JSX namespace
    <group scale={0.35} rotation={[0, 0, Math.random() * 0.4 - 0.2]}>
        <mesh>
            <boxGeometry args={[1, 1.2, 0.05]} />
            <PaperMaterial />
        </mesh>
        <mesh position={[0, 0.1, 0.05]}>
            <planeGeometry args={[0.8, 0.8]} />
            <meshBasicMaterial color="#333" />
        </mesh>
    </group>
);

const Stocking = () => (
    // Using group, mesh, and capsuleGeometry defined in global JSX namespace
    <group scale={0.35}>
        <mesh position={[0, 0.3, 0]}>
            <capsuleGeometry args={[0.25, 0.6, 4, 16]} />
            <RedVelvetMaterial />
        </mesh>
        <mesh position={[0.2, -0.1, 0]} rotation={[0, 0, -1.2]}>
             <capsuleGeometry args={[0.26, 0.4, 4, 16]} />
             <RedVelvetMaterial />
        </mesh>
    </group>
);

const Doll = () => (
    // Using group, mesh, sphereGeometry, dodecahedronGeometry, and meshStandardMaterial defined in global JSX namespace
    <group scale={0.3}>
         <mesh position={[0,0.5,0]}>
            <sphereGeometry args={[0.4, 16, 16]} />
            <PaperMaterial />
         </mesh>
         <mesh position={[0,-0.2,0]}>
            <dodecahedronGeometry args={[0.5, 0]} />
            <meshStandardMaterial color="#3b82f6" roughness={0.8} />
         </mesh>
    </group>
)

const Ornament = ({ type }: { type: string }) => {
    const randomRot = useMemo(() => [Math.random() * 0.5, Math.random() * Math.PI, Math.random() * 0.5], []);
    
    switch (type) {
        case 'gift': return <GiftOrnament />;
        case 'star': return <mesh scale={0.3} rotation={randomRot as any}><octahedronGeometry args={[1, 0]} /><GoldMaterial /></mesh>;
        case 'heart': return <group scale={0.25} rotation={randomRot as any}><HeartGeometry /></group>;
        case 'moon': return <group scale={0.25}><MoonGeometry /></group>;
        case 'gingerbread': return <GingerbreadMan />;
        case 'polaroid': return <PolaroidPhoto />;
        case 'stocking': return <Stocking />;
        case 'doll': return <Doll />;
        case 'bulb':
        default:
            return (
                // Using group, mesh, sphereGeometry, cylinderGeometry, and materials defined in global JSX namespace
                <group scale={0.25}>
                    <mesh position={[0, -0.5, 0]}>
                        <sphereGeometry args={[0.8, 32, 32]} />
                        <meshPhysicalMaterial 
                            color={Math.random() > 0.6 ? "#f59e0b" : "#b91c1c"} 
                            emissiveIntensity={0.2} 
                            roughness={0.1} 
                            metalness={0.4}
                            clearcoat={1}
                        />
                    </mesh>
                    <mesh position={[0, 0.4, 0]}>
                        <cylinderGeometry args={[0.15, 0.25, 0.6, 12]} />
                        <GoldMaterial />
                    </mesh>
                </group>
            );
    }
};

const BobbingOrnament = ({ type, isExploded }: { type: string, isExploded: boolean }) => {
    const groupRef = useRef<THREE.Group>(null);
    const phase = useMemo(() => Math.random() * 10, []);

    useFrame((state) => {
        if (groupRef.current && !isExploded) {
            const t = state.clock.elapsedTime + phase;
            groupRef.current.rotation.z = Math.sin(t * 1.5) * 0.1; 
            groupRef.current.rotation.y = Math.sin(t * 0.8) * 0.2;
            groupRef.current.position.y = Math.sin(t * 1) * 0.05;
        }
    });

    // Using group defined in global JSX namespace
    return (
        <group ref={groupRef}>
            <Ornament type={type} />
        </group>
    )
}

// --- Procedural Spiral Tree Generator ---

const ProceduralTree = ({ isExploded }: { isExploded: boolean }) => {
    const branchCount = 140; 
    const goldenRatio = (1 + Math.sqrt(5)) / 2;
    const angleIncrement = Math.PI * 2 * goldenRatio;
    
    const branches = useMemo(() => {
        const temp = [];
        const height = 11;
        const maxRadius = 4.2;

        for (let i = 0; i < branchCount; i++) {
            const t = i / branchCount; 
            const y = height / 2 - (t * height); 
            const radius = maxRadius * Math.pow(t, 0.85); 
            const angle = i * angleIncrement;
            
            const x = Math.cos(angle) * radius;
            const z = Math.sin(angle) * radius;

            const isOrnament = Math.random() > 0.4; 
            let type = 'branch';
            
            if (isOrnament) {
                const rand = Math.random();
                if (rand < 0.20) type = 'gift';
                else if (rand < 0.30) type = 'star';
                else if (rand < 0.38) type = 'heart';
                else if (rand < 0.45) type = 'moon';
                else if (rand < 0.55) type = 'gingerbread';
                else if (rand < 0.65) type = 'polaroid';
                else if (rand < 0.75) type = 'stocking';
                else if (rand < 0.85) type = 'doll';
                else type = 'bulb';
            }

            const scale = 1.0 - (t * 0.3); 

            temp.push({ position: [x, y, z], rotation: [0, -angle, 0], scale, type, id: i });
        }
        return temp;
    }, []);

    // Using group defined in global JSX namespace
    return (
        <group>
            {branches.map((b) => (
                <ExplodingPart 
                    key={b.id} 
                    isExploded={isExploded} 
                    distance={4 + Math.random() * 8} 
                    speed={2 + Math.random() * 2} 
                >
                    <group position={b.position as any} rotation={b.rotation as any} scale={b.scale}>
                        {b.type === 'branch' ? (
                            <PineBranch />
                        ) : (
                            <group position={[0, 0.2, 0.2]}> 
                                <BobbingOrnament type={b.type} isExploded={isExploded} />
                            </group>
                        )}
                    </group>
                </ExplodingPart>
            ))}
        </group>
    );
};


const CentralHeartGift = ({ show }: { show: boolean }) => {
    const ref = useRef<THREE.Group>(null);
    const [scale, setScale] = useState(0);

    useFrame((state, delta) => {
        if (ref.current) {
            const heartbeat = show ? 1 + Math.sin(state.clock.getElapsedTime() * 4) * 0.05 : 1;
            ref.current.rotation.y += delta * 0.5;
            ref.current.scale.setScalar(scale * heartbeat);
        }
        
        const targetScale = show ? 1 : 0;
        const speed = show ? 3 : 5; 
        if (Math.abs(scale - targetScale) > 0.001) {
            const newScale = THREE.MathUtils.lerp(scale, targetScale, delta * speed);
            setScale(newScale);
        } else {
            setScale(targetScale);
        }
    });

    // Using group and pointLight defined in global JSX namespace
    return (
        <group ref={ref} scale={scale}>
            <group scale={1.8}>
                <ShapeExtrusion pathShape={new THREE.Shape().moveTo(0,0).bezierCurveTo(0,0,0,0,0,0)} >
                     <GlowingHeartMaterial />
                </ShapeExtrusion>
                 <HeartGeometry />
            </group>
            
            <pointLight color="#ff0033" intensity={show ? 8 : 0} distance={8} decay={2} position={[0,0,1]} />
            
            {show && (
                <>
                    <Sparkles count={40} scale={4} size={4} speed={0.4} opacity={0.8} color="#ffd700" />
                </>
            )}
        </group>
    );
};

// --- Particles & Atmosphere ---

const Atmosphere = ({ isExploded }: { isExploded: boolean }) => {
    // Using group defined in global JSX namespace
    return (
        <group visible={!isExploded}>
            {/* Soft White Snow (Small Flurries) */}
            <Sparkles 
                count={80} 
                scale={[12, 18, 12]} 
                size={2} 
                speed={0.1} 
                opacity={0.6} 
                color="#ffffff" 
            />
            {/* Golden Dust Motes */}
            <Sparkles 
                count={100} 
                scale={[10, 12, 10]} 
                size={3} 
                speed={0.2} 
                opacity={0.8} 
                color="#FFD700"
                noise={0.2} 
            />
            {/* Gentle, falling large snowflakes */}
            <Sparkles 
                count={120} 
                scale={[15, 20, 15]} 
                size={1.5} 
                speed={0.04} 
                opacity={0.35} 
                color="#eef2ff"
                noise={0.8} 
            />
        </group>
    );
}

// --- Glowing Rings ---
const HoloRings = ({ isExploded }: { isExploded: boolean }) => {
    const ringRef = useRef<THREE.Group>(null);
    const [opacity, setOpacity] = useState(1);
    
    useFrame((state, delta) => {
        if (ringRef.current) {
            ringRef.current.rotation.y -= delta * 0.2;
            ringRef.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.5) * 0.05;
        }
        const targetOpacity = isExploded ? 0 : 0.6;
        setOpacity(THREE.MathUtils.lerp(opacity, targetOpacity, delta * 3));
    });

    // Using group, mesh, torusGeometry, and meshBasicMaterial defined in global JSX namespace
    return (
        <group ref={ringRef} visible={opacity > 0.01}>
            <mesh rotation={[Math.PI / 2, 0, 0]} position={[0, -3, 0]}>
                <torusGeometry args={[5, 0.03, 16, 100]} />
                <meshBasicMaterial color={[3, 3, 3]} transparent opacity={opacity} toneMapped={false} />
            </mesh>
             <mesh rotation={[Math.PI / 2.1, 0, 0]} position={[0, 0, 0]}>
                <torusGeometry args={[3.5, 0.03, 16, 100]} />
                <meshBasicMaterial color={[3, 3, 3]} transparent opacity={opacity} toneMapped={false} />
            </mesh>
             <mesh rotation={[Math.PI / 1.9, 0, 0]} position={[0, 3, 0]}>
                <torusGeometry args={[2, 0.03, 16, 100]} />
                <meshBasicMaterial color={[3, 3, 3]} transparent opacity={opacity} toneMapped={false} />
            </mesh>
        </group>
    )
}


interface ChristmasTreeProps {
    isExploded: boolean;
}

export const ChristmasTree: React.FC<ChristmasTreeProps> = ({ isExploded }) => {
  const [showHeart, setShowHeart] = useState(false);

  useEffect(() => {
      let t: ReturnType<typeof setTimeout>;
      if (isExploded) {
          t = setTimeout(() => setShowHeart(true), 400);
      } else {
          setShowHeart(false);
      }
      return () => clearTimeout(t);
  }, [isExploded]);

  // Using group and other Three.js elements defined in global JSX namespace
  return (
    <group>
      <Float speed={isExploded ? 0 : 0.8} rotationIntensity={isExploded ? 0 : 0.1} floatIntensity={isExploded ? 0 : 0.2}>
        <group position={[0, 0, 0]}>
            <ProceduralTree isExploded={isExploded} />
        </group>

        <ExplodingPart isExploded={isExploded} distance={7} rotationSpeed={0.5}>
            <mesh position={[0, -5.5, 0]}>
                <cylinderGeometry args={[0.3, 1.2, 1.5, 32]} />
                <GoldMaterial />
            </mesh>
        </ExplodingPart>

        <ExplodingPart isExploded={isExploded} distance={10} speed={4}>
            <group position={[0, 7.5, 0]} scale={1} rotation={[0,0,0]}>
                 <StarShape />
                <pointLight distance={8} intensity={5} color="#fbbf24" decay={2} />
            </group>
        </ExplodingPart>
        
        <HoloRings isExploded={isExploded} />
        <Atmosphere isExploded={isExploded} />
      </Float>

      <group position={[0, 0.5, 0]}>
          <CentralHeartGift show={showHeart} />
      </group>
    </group>
  );
};
