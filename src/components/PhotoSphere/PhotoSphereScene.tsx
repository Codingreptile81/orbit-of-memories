import { useRef, useState, useMemo, Suspense, useEffect } from 'react';
import { Canvas, useThree } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import { Vector3, Group } from 'three';
import PhotoMesh from './PhotoMesh';
import { SPHERE_CONFIG, getPlaceholderImage } from './config';

// Generate evenly distributed points on a sphere using golden spiral
const generateSpherePoints = (count: number, radius: number): Vector3[] => {
  const points: Vector3[] = [];
  const goldenRatio = (1 + Math.sqrt(5)) / 2;
  const angleIncrement = Math.PI * 2 * goldenRatio;

  for (let i = 0; i < count; i++) {
    const t = i / count;
    const inclination = Math.acos(1 - 2 * t);
    const azimuth = angleIncrement * i;

    const x = Math.sin(inclination) * Math.cos(azimuth) * radius;
    const y = Math.sin(inclination) * Math.sin(azimuth) * radius;
    const z = Math.cos(inclination) * radius;

    points.push(new Vector3(x, y, z));
  }

  return points;
};

interface PhotoSphereContentProps {
  focusedIndex: number | null;
  onPhotoClick: (index: number | null) => void;
}

const PhotoSphereContent = ({ focusedIndex, onPhotoClick }: PhotoSphereContentProps) => {
  const groupRef = useRef<Group>(null);
  const controlsRef = useRef<any>(null);

  // Generate photo positions on sphere
  const photoPositions = useMemo(
    () => generateSpherePoints(SPHERE_CONFIG.photoCount, SPHERE_CONFIG.sphereRadius),
    []
  );

  // Generate placeholder image URLs
  const photoUrls = useMemo(
    () => Array.from({ length: SPHERE_CONFIG.photoCount }, (_, i) => getPlaceholderImage(i)),
    []
  );

  // Calculate focus position (in front of camera)
  const focusPosition = useMemo(() => {
    return new Vector3(0, 0, 2);
  }, []);

  // Disable controls when photo is focused
  useEffect(() => {
    if (controlsRef.current) {
      controlsRef.current.enabled = focusedIndex === null;
    }
  }, [focusedIndex]);

  return (
    <>
      <OrbitControls
        ref={controlsRef}
        enableZoom={true}
        enablePan={false}
        dampingFactor={SPHERE_CONFIG.rotationDamping}
        enableDamping={true}
        minDistance={3}
        maxDistance={15}
      />
      
      <group ref={groupRef}>
        {photoPositions.map((position, index) => (
          <PhotoMesh
            key={index}
            imageUrl={photoUrls[index]}
            position={position}
            index={index}
            isFocused={focusedIndex === index}
            anyFocused={focusedIndex !== null}
            onClick={() => onPhotoClick(focusedIndex === index ? null : index)}
            focusPosition={focusPosition}
          />
        ))}
      </group>
    </>
  );
};

const PhotoSphereScene = () => {
  const [focusedIndex, setFocusedIndex] = useState<number | null>(null);

  const handleBackgroundClick = () => {
    if (focusedIndex !== null) {
      setFocusedIndex(null);
    }
  };

  return (
    <div className="w-full h-screen bg-white">
      <Canvas
        camera={{ position: [0, 0, 10], fov: 60 }}
        onPointerMissed={handleBackgroundClick}
      >
        <color attach="background" args={['#ffffff']} />
        <ambientLight intensity={1} />
        <PhotoSphereContent
          focusedIndex={focusedIndex}
          onPhotoClick={setFocusedIndex}
        />
      </Canvas>
      
      {/* Optional: Caption overlay - ready for future use */}
      {focusedIndex !== null && (
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 pointer-events-none">
          {/* Caption will go here when implemented */}
        </div>
      )}
    </div>
  );
};

export default PhotoSphereScene;
