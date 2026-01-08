import { useRef, useState, useEffect } from 'react';
import { useFrame, useThree, useLoader } from '@react-three/fiber';
import { Mesh, Vector3, MathUtils, TextureLoader, SRGBColorSpace } from 'three';
import { SPHERE_CONFIG } from './config';

interface PhotoMeshProps {
  imageUrl: string;
  position: Vector3;
  index: number;
  isFocused: boolean;
  anyFocused: boolean;
  onClick: () => void;
}

const PhotoMesh = ({
  imageUrl,
  position,
  index,
  isFocused,
  anyFocused,
  onClick,
}: PhotoMeshProps) => {
  const meshRef = useRef<Mesh>(null);
  const [hovered, setHovered] = useState(false);
  const { camera } = useThree();
  
  // Use useLoader for reliable texture loading
  const texture = useLoader(TextureLoader, imageUrl);
  
  // Center the texture on the geometry
  useEffect(() => {
    if (texture) {
      texture.colorSpace = SRGBColorSpace;
      texture.center.set(0.5, 0.5);
      texture.needsUpdate = true;
    }
  }, [texture]);
  
  // Target opacity based on focus state
  const targetOpacity = anyFocused ? SPHERE_CONFIG.unfocusedOpacity : 1;
  
  // Make photos always face camera (billboard effect) and animate opacity
  useFrame((state, delta) => {
    if (!meshRef.current) return;
    
    const speed = 5 * delta;
    
    // Make photo always face camera so it's visible from all angles
    meshRef.current.lookAt(camera.position);
    
    // Update material opacity
    const material = meshRef.current.material as any;
    if (material.opacity !== undefined) {
      material.opacity = MathUtils.lerp(material.opacity, targetOpacity, speed);
    }
  });
  
  const radius = SPHERE_CONFIG.photoSize / 2;
  const frameThickness = 0.03;
  const frameDepth = 0.08;
  
  return (
    <group
      ref={meshRef as any}
      position={position.clone()}
      onClick={(e) => {
        e.stopPropagation();
        onClick();
      }}
      onPointerOver={(e) => {
        e.stopPropagation();
        setHovered(true);
        document.body.style.cursor = 'pointer';
      }}
      onPointerOut={() => {
        setHovered(false);
        document.body.style.cursor = 'auto';
      }}
    >
      {/* Photo face - flat circle so image isn't distorted */}
      <mesh position={[0, 0, frameDepth / 2 + 0.001]}>
        <circleGeometry args={[radius, 64]} />
        <meshBasicMaterial map={texture} transparent opacity={1} />
      </mesh>
      
      {/* Back face */}
      <mesh position={[0, 0, -frameDepth / 2 - 0.001]} rotation={[0, Math.PI, 0]}>
        <circleGeometry args={[radius, 64]} />
        <meshBasicMaterial color="#1a1a2e" />
      </mesh>
      
      {/* 3D frame ring */}
      <mesh>
        <torusGeometry args={[radius, frameThickness, 16, 64]} />
        <meshStandardMaterial 
          color="#c9a96e" 
          metalness={0.8} 
          roughness={0.2}
        />
      </mesh>
      
      {/* Depth cylinder edge */}
      <mesh rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[radius + frameThickness, radius + frameThickness, frameDepth, 64, 1, true]} />
        <meshStandardMaterial 
          color="#8b7355" 
          metalness={0.6} 
          roughness={0.3}
          side={2}
        />
      </mesh>
    </group>
  );
};

export default PhotoMesh;
