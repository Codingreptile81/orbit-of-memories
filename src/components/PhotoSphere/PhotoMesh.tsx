import { useRef, useState, useMemo } from 'react';
import { useFrame, useLoader } from '@react-three/fiber';
import { TextureLoader, Mesh, Vector3, MathUtils } from 'three';
import { SPHERE_CONFIG } from './config';

interface PhotoMeshProps {
  imageUrl: string;
  position: Vector3;
  index: number;
  isFocused: boolean;
  anyFocused: boolean;
  onClick: () => void;
  focusPosition: Vector3;
}

const PhotoMesh = ({
  imageUrl,
  position,
  index,
  isFocused,
  anyFocused,
  onClick,
  focusPosition,
}: PhotoMeshProps) => {
  const meshRef = useRef<Mesh>(null);
  const [hovered, setHovered] = useState(false);
  
  // Load texture
  const texture = useLoader(TextureLoader, imageUrl);
  
  // Store original position
  const originalPosition = useMemo(() => position.clone(), [position]);
  
  // Target values for animation
  const targetPosition = isFocused ? focusPosition : originalPosition;
  const targetScale = isFocused ? SPHERE_CONFIG.focusedScale : 1;
  const targetOpacity = anyFocused && !isFocused ? SPHERE_CONFIG.unfocusedOpacity : 1;
  
  // Animate position, scale, and opacity
  useFrame((state, delta) => {
    if (!meshRef.current) return;
    
    const speed = 5 * delta;
    
    // Lerp position
    meshRef.current.position.lerp(targetPosition, speed);
    
    // Lerp scale
    const currentScale = meshRef.current.scale.x;
    const newScale = MathUtils.lerp(currentScale, targetScale, speed);
    meshRef.current.scale.setScalar(newScale);
    
    // Make focused photo face camera
    if (isFocused) {
      meshRef.current.lookAt(state.camera.position);
    }
    
    // Update material opacity
    const material = meshRef.current.material as any;
    if (material.opacity !== undefined) {
      material.opacity = MathUtils.lerp(material.opacity, targetOpacity, speed);
    }
  });
  
  return (
    <mesh
      ref={meshRef}
      position={position}
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
      <meshBasicMaterial
        map={texture}
        transparent
        opacity={1}
      />
    </mesh>
  );
};

export default PhotoMesh;
