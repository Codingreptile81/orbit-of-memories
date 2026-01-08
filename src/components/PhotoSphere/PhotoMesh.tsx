import { useRef, useState, useMemo, useEffect } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import { Mesh, Vector3, MathUtils, TextureLoader, Texture } from 'three';
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
  const circleMeshRef = useRef<Mesh>(null);
  const rectMeshRef = useRef<Mesh>(null);
  const [hovered, setHovered] = useState(false);
  const [texture, setTexture] = useState<Texture | null>(null);
  const { camera } = useThree();
  
  // Load texture with error handling
  useEffect(() => {
    const loader = new TextureLoader();
    loader.load(
      imageUrl,
      (loadedTexture) => {
        setTexture(loadedTexture);
      },
      undefined,
      (error) => {
        console.warn(`Failed to load image ${index}, using fallback`);
        setTexture(null);
      }
    );
    
    return () => {
      if (texture) {
        texture.dispose();
      }
    };
  }, [imageUrl, index]);
  
  // Store original position
  const originalPosition = useMemo(() => position.clone(), [position]);
  
  // Target values for animation
  const targetPosition = isFocused ? focusPosition : originalPosition;
  const targetScale = isFocused ? SPHERE_CONFIG.focusedScale : 1;
  const targetOpacity = anyFocused && !isFocused ? SPHERE_CONFIG.unfocusedOpacity : 1;
  
  // Rectangle dimensions for focused view (4:3 aspect ratio)
  const rectWidth = SPHERE_CONFIG.photoSize * 1.5;
  const rectHeight = SPHERE_CONFIG.photoSize * 1.1;
  
  // Animate both meshes
  useFrame((state, delta) => {
    const speed = 5 * delta;
    
    // Animate circle mesh (unfocused state)
    if (circleMeshRef.current) {
      if (!isFocused) {
        circleMeshRef.current.position.lerp(targetPosition, speed);
        circleMeshRef.current.lookAt(camera.position);
      }
      
      const currentScale = circleMeshRef.current.scale.x;
      const circleTargetScale = isFocused ? 0 : 1;
      const newScale = MathUtils.lerp(currentScale, circleTargetScale, speed);
      circleMeshRef.current.scale.setScalar(Math.max(0.01, newScale));
      
      const material = circleMeshRef.current.material as any;
      if (material.opacity !== undefined) {
        material.opacity = MathUtils.lerp(material.opacity, isFocused ? 0 : targetOpacity, speed);
      }
    }
    
    // Animate rectangle mesh (focused state)
    if (rectMeshRef.current) {
      rectMeshRef.current.position.lerp(targetPosition, speed);
      rectMeshRef.current.lookAt(camera.position);
      
      const currentScale = rectMeshRef.current.scale.x;
      const rectTargetScale = isFocused ? targetScale : 0;
      const newScale = MathUtils.lerp(currentScale, rectTargetScale, speed);
      rectMeshRef.current.scale.setScalar(Math.max(0.01, newScale));
      
      const material = rectMeshRef.current.material as any;
      if (material.opacity !== undefined) {
        material.opacity = MathUtils.lerp(material.opacity, isFocused ? 1 : 0, speed);
      }
    }
  });

  // Generate a color based on index for fallback
  const fallbackColor = `hsl(${(index * 37) % 360}, 70%, 80%)`;
  
  return (
    <group>
      {/* Circular photo (visible when not focused) */}
      <mesh
        ref={circleMeshRef}
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
      
      {/* Rectangular photo (visible when focused) */}
      <mesh
        ref={rectMeshRef}
        position={position.clone()}
        scale={0.01}
        onClick={(e) => {
          e.stopPropagation();
          onClick();
        }}
      >
        <planeGeometry args={[rectWidth, rectHeight]} />
        {texture ? (
          <meshBasicMaterial map={texture} transparent opacity={0} />
        ) : (
          <meshBasicMaterial color={fallbackColor} transparent opacity={0} />
        )}
      </mesh>
    </group>
  );
};

export default PhotoMesh;
