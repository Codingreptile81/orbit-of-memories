import { useRef, useState, useEffect } from 'react';
import { useFrame, useThree, useLoader } from '@react-three/fiber';
import { Mesh, Vector3, MathUtils, TextureLoader, Texture } from 'three';
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
  const [texture, setTexture] = useState<Texture | null>(null);
  const [loaded, setLoaded] = useState(false);
  const { camera } = useThree();
  
  // Load texture manually with proper error handling
  useEffect(() => {
    const loader = new TextureLoader();
    let isMounted = true;
    
    loader.load(
      imageUrl,
      (tex) => {
        if (isMounted) {
          setTexture(tex);
          setLoaded(true);
        }
      },
      undefined,
      () => {
        if (isMounted) {
          setLoaded(true); // Still mark as loaded to show fallback
        }
      }
    );
    
    return () => {
      isMounted = false;
    };
  }, [imageUrl]);
  
  // Target opacity based on focus state
  const targetOpacity = anyFocused ? SPHERE_CONFIG.unfocusedOpacity : 1;
  
  // Animate opacity and face camera
  useFrame((state, delta) => {
    if (!meshRef.current) return;
    
    const speed = 5 * delta;
    
    // Make photo face camera
    meshRef.current.lookAt(camera.position);
    
    // Update material opacity
    const material = meshRef.current.material as any;
    if (material.opacity !== undefined) {
      material.opacity = MathUtils.lerp(material.opacity, targetOpacity, speed);
    }
  });

  // Generate a color based on index for fallback
  const fallbackColor = `hsl(${(index * 37) % 360}, 70%, 80%)`;
  
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
      {texture ? (
        <meshBasicMaterial map={texture} transparent opacity={1} />
      ) : (
        <meshBasicMaterial color={fallbackColor} transparent opacity={1} />
      )}
    </mesh>
  );
};

export default PhotoMesh;
