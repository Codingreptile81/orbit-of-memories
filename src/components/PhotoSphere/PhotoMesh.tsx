import { useRef, useState } from 'react';
import { useFrame, useThree, useLoader } from '@react-three/fiber';
import { Mesh, Vector3, MathUtils, TextureLoader } from 'three';
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
  
  // Target opacity based on focus state
  const targetOpacity = anyFocused ? SPHERE_CONFIG.unfocusedOpacity : 1;
  
  // Animate opacity only (photos maintain fixed orientation)
  useFrame((state, delta) => {
    if (!meshRef.current) return;
    
    const speed = 5 * delta;
    
    // Update material opacity
    const material = meshRef.current.material as any;
    if (material.opacity !== undefined) {
      material.opacity = MathUtils.lerp(material.opacity, targetOpacity, speed);
    }
  });
  
  return (
    <mesh
      ref={meshRef}
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
      <circleGeometry args={[SPHERE_CONFIG.photoSize / 2, 64]} />
      <meshBasicMaterial map={texture} transparent opacity={1} />
    </mesh>
  );
};

export default PhotoMesh;
