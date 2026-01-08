import { useRef, useState, useMemo, useEffect } from 'react';
import { Canvas } from '@react-three/fiber';
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
          />
        ))}
      </group>
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
        className={`absolute inset-0 bg-black/30 backdrop-blur-md transition-opacity duration-500 ${
          isVisible ? 'opacity-100' : 'opacity-0'
        }`}
      />
      
      {/* Focused photo */}
      <div 
        className={`relative transition-all duration-500 ease-out ${
          isVisible 
            ? 'scale-100 opacity-100' 
            : 'scale-75 opacity-0'
        }`}
        onClick={(e) => e.stopPropagation()}
      >
        <img
          src={imageUrl}
          alt="Focused photo"
          className="max-w-[80vw] max-h-[70vh] w-auto h-auto rounded-3xl shadow-2xl object-cover"
          style={{
            minWidth: '300px',
            minHeight: '300px',
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
  
  // Generate placeholder image URLs
  const photoUrls = useMemo(
    () => Array.from({ length: SPHERE_CONFIG.photoCount }, (_, i) => getPlaceholderImage(i)),
    []
  );

  const handleBackgroundClick = () => {
    if (focusedIndex !== null) {
      setFocusedIndex(null);
    }
  };

  return (
    <div className="w-full h-screen bg-white relative overflow-hidden">
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
