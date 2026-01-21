import { useRef, useState, useMemo, useEffect, Suspense } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import { Vector3, Group } from 'three';
import PhotoMesh from './PhotoMesh';
import Confetti from './Confetti';
import { SPHERE_CONFIG, getPlaceholderImage, getPhotoCount, getPhotoSize } from './config';

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

  const photoCount = getPhotoCount();

  // Generate photo positions on sphere
  const photoPositions = useMemo(
    () => generateSpherePoints(photoCount, SPHERE_CONFIG.sphereRadius),
    [photoCount]
  );

  // Generate placeholder image URLs
  const photoUrls = useMemo(
    () => Array.from({ length: photoCount }, (_, i) => getPlaceholderImage(i)),
    [photoCount]
  );

  // Disable controls when photo is focused
  useEffect(() => {
    if (controlsRef.current) {
      controlsRef.current.enabled = focusedIndex === null;
    }
  }, [focusedIndex]);

  // Auto-rotate on all 3 axes
  useFrame((_, delta) => {
    if (groupRef.current && focusedIndex === null) {
      groupRef.current.rotation.x += delta * 0.08;
      groupRef.current.rotation.y += delta * 0.12;
      groupRef.current.rotation.z += delta * 0.05;
    }
  });

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
      
      <Suspense fallback={null}>
        <group ref={groupRef}>
          {photoPositions.map((position, index) => (
            <PhotoMesh
              key={index}
              imageUrl={photoUrls[index]}
              position={position}
              index={index}
              size={getPhotoSize(index)}
              isFocused={focusedIndex === index}
              anyFocused={focusedIndex !== null}
              onClick={() => onPhotoClick(focusedIndex === index ? null : index)}
            />
          ))}
        </group>
      </Suspense>
    </>
  );
};

interface FocusedPhotoOverlayProps {
  imageUrl: string;
  onClose: () => void;
}

const FocusedPhotoOverlay = ({ imageUrl, onClose }: FocusedPhotoOverlayProps) => {
  const [isVisible, setIsVisible] = useState(false);
  
  useEffect(() => {
    // Trigger animation after mount
    requestAnimationFrame(() => setIsVisible(true));
  }, []);
  
  return (
    <div 
      className="absolute inset-0 flex items-center justify-center z-10 cursor-pointer"
      onClick={onClose}
    >
      {/* Blurred backdrop */}
      <div 
        className={`absolute inset-0 bg-black/20 backdrop-blur-sm transition-opacity duration-500 ${
          isVisible ? 'opacity-100' : 'opacity-0'
        }`}
      />
      
      {/* Focused photo */}
      <div 
        className={`relative transition-all duration-500 ease-out ${
          isVisible 
            ? 'scale-100 opacity-100' 
            : 'scale-50 opacity-0'
        }`}
        onClick={(e) => e.stopPropagation()}
      >
        <img
          src={imageUrl}
          alt="Focused photo"
          className="max-w-[90vw] max-h-[85vh] w-auto h-auto rounded-3xl shadow-2xl object-cover"
          style={{
            minWidth: '400px',
            minHeight: '400px',
          }}
        />
        
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute -top-4 -right-4 w-10 h-10 bg-white rounded-full shadow-lg flex items-center justify-center text-gray-600 hover:text-gray-900 hover:scale-110 transition-all"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="18" y1="6" x2="6" y2="18"></line>
            <line x1="6" y1="6" x2="18" y2="18"></line>
          </svg>
        </button>
        
        {/* Caption placeholder - ready for future use */}
        <div className="absolute -bottom-16 left-1/2 -translate-x-1/2 text-center">
          {/* Caption will go here when implemented */}
        </div>
      </div>
    </div>
  );
};

const PhotoSphereScene = () => {
  const [focusedIndex, setFocusedIndex] = useState<number | null>(null);
  const photoCount = getPhotoCount();
  
  // Generate placeholder image URLs
  const photoUrls = useMemo(
    () => Array.from({ length: photoCount }, (_, i) => getPlaceholderImage(i)),
    [photoCount]
  );

  const handleBackgroundClick = () => {
    if (focusedIndex !== null) {
      setFocusedIndex(null);
    }
  };

  return (
    <div 
      className="w-full h-screen relative overflow-hidden bg-[linear-gradient(135deg,#0d0a08_0%,#1a1512_60%,#8b7355_90%,#c9a227_100%)]"
    >
      <Confetti />
      <Canvas
        camera={{ position: [0, 0, 10], fov: 60 }}
        onPointerMissed={handleBackgroundClick}
        style={{ background: 'transparent' }}
      >
        <ambientLight intensity={0.6} />
        <pointLight position={[10, 10, 10]} intensity={1} />
        <pointLight position={[-10, -10, -10]} intensity={0.5} />
        <PhotoSphereContent
          focusedIndex={focusedIndex}
          onPhotoClick={setFocusedIndex}
        />
      </Canvas>
      
      {/* Focused photo overlay with blur and rounded corners */}
      {focusedIndex !== null && (
        <FocusedPhotoOverlay
          imageUrl={photoUrls[focusedIndex]}
          onClose={() => setFocusedIndex(null)}
        />
      )}
    </div>
  );
};

export default PhotoSphereScene;
