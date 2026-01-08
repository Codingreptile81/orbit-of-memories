import { useRef, useState, useMemo } from 'react';
import { useFrame, useThree, useLoader } from '@react-three/fiber';
import { Vector3, TextureLoader, SRGBColorSpace, DoubleSide } from 'three';
import { SPHERE_CONFIG } from './config';

interface PhotoMeshProps {
  imageUrl: string;
  position: Vector3;
  index: number;
  size: number;
  isFocused: boolean;
  anyFocused: boolean;
  onClick: () => void;
}

const PhotoMesh = ({
  imageUrl,
  position,
  index,
  size,
  isFocused,
  anyFocused,
  onClick,
}: PhotoMeshProps) => {
  const groupRef = useRef<any>(null);
  const [hovered, setHovered] = useState(false);
  const { camera } = useThree();
  
  const texture = useLoader(TextureLoader, imageUrl);
  
  useMemo(() => {
    if (texture) {
      texture.colorSpace = SRGBColorSpace;
    }
  }, [texture]);
  
  const targetOpacity = anyFocused && !isFocused ? SPHERE_CONFIG.unfocusedOpacity : 1;
  
  useFrame(() => {
    if (!groupRef.current) return;
    groupRef.current.lookAt(camera.position);
  });
  
  const radius = size / 2;
  
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
      {/* Photo circle */}
      <mesh>
        <circleGeometry args={[radius, 64]} />
        <meshBasicMaterial 
          map={texture} 
          transparent 
          opacity={targetOpacity}
        />
      </mesh>
    </group>
  );
};

export default PhotoMesh;
