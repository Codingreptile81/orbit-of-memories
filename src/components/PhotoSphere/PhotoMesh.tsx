import { useRef, useState, useMemo } from 'react';
import { useFrame, useThree, useLoader } from '@react-three/fiber';
import { Mesh, Vector3, MathUtils, TextureLoader, SRGBColorSpace, DoubleSide } from 'three';
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
  const groupRef = useRef<any>(null);
  const [hovered, setHovered] = useState(false);
  const { camera } = useThree();
  
  // Use useLoader for reliable texture loading
  const texture = useLoader(TextureLoader, imageUrl);
  
  // Configure texture once
  useMemo(() => {
    if (texture) {
      texture.colorSpace = SRGBColorSpace;
    }
  }, [texture]);
  
  // Target opacity based on focus state
  const targetOpacity = anyFocused ? SPHERE_CONFIG.unfocusedOpacity : 1;
  
  // Make photos always face camera (billboard effect)
  useFrame((state, delta) => {
    if (!groupRef.current) return;
    
    // Make photo always face camera
    groupRef.current.lookAt(camera.position);
  });
  
  const radius = SPHERE_CONFIG.photoSize / 2;
  const frameThickness = 0.025;
  
  return (
    <group
      ref={groupRef}
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
      {/* Photo on a flat plane - perfectly centered */}
      <mesh position={[0, 0, 0.01]}>
        <planeGeometry args={[radius * 2, radius * 2]} />
        <meshBasicMaterial 
          map={texture} 
          transparent 
          opacity={targetOpacity}
          side={DoubleSide}
        />
      </mesh>
      
      {/* Circular mask overlay to create round appearance */}
      <mesh position={[0, 0, 0.02]}>
        <ringGeometry args={[radius, radius + 0.5, 64]} />
        <meshBasicMaterial color="#0a0a0a" side={DoubleSide} />
      </mesh>
      
      {/* Golden frame ring */}
      <mesh position={[0, 0, 0.015]}>
        <ringGeometry args={[radius - 0.01, radius + frameThickness, 64]} />
        <meshStandardMaterial 
          color="#d4af37" 
          metalness={0.9} 
          roughness={0.15}
          side={DoubleSide}
        />
      </mesh>
    </group>
  );
};

export default PhotoMesh;
