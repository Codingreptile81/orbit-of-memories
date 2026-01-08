// Configuration for the Memory Universe photo sphere
// Easy to adjust these values to customize the experience

export const SPHERE_CONFIG = {
  // Number of photos to display on the sphere
  photoCount: 50,
  
  // Radius of the invisible sphere
  sphereRadius: 5,
  
  // Size of each circular photo
  photoSize: 0.8,
  
  // Damping factor for rotation momentum (higher = more friction)
  rotationDamping: 0.05,
  
  // Animation duration for focus transition (in seconds)
  focusAnimationDuration: 0.8,
  
  // Scale of focused photo
  focusedScale: 3,
  
  // Opacity of non-focused photos when one is selected
  unfocusedOpacity: 0.7,
};

// Import photos from src/assets for reliable bundling
import photo1 from '@/assets/photos/photo1.jpg';
import photo2 from '@/assets/photos/photo2.jpg';
import photo3 from '@/assets/photos/photo3.jpg';
import photo4 from '@/assets/photos/photo4.jpg';
import photo5 from '@/assets/photos/photo5.jpg';
import photo6 from '@/assets/photos/photo6.jpg';
import photo7 from '@/assets/photos/photo7.jpg';
import photo8 from '@/assets/photos/photo8.jpg';

const localPhotos = [
  photo1,
  photo2,
  photo3,
  photo4,
  photo5,
  photo6,
  photo7,
  photo8,
];

export const getPlaceholderImage = (index: number): string => {
  return localPhotos[index % localPhotos.length];
};
