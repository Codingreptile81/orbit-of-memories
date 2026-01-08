// Configuration for the Memory Universe photo sphere
// Easy to adjust these values to customize the experience

// Dynamically import all images from the photos folder
const photoModules = import.meta.glob<{ default: string }>(
  '/src/assets/photos/*.{jpg,jpeg,png,webp,gif}',
  { eager: true }
);

// Extract the image URLs and sort them for consistent ordering
const localPhotos: string[] = Object.keys(photoModules)
  .sort()
  .map((key) => photoModules[key].default);

// Minimum number of nodes to display
const MIN_NODES = 50;

// Calculate actual photo count: at least MIN_NODES, or more if we have more images
export const getPhotoCount = (): number => {
  return Math.max(MIN_NODES, localPhotos.length);
};

export const SPHERE_CONFIG = {
  // Radius of the invisible sphere
  sphereRadius: 5,
  
  // Size range for photos (varying sizes - subtle difference)
  photoSizeMin: 0.65,
  photoSizeMax: 0.95,
  
  // Damping factor for rotation momentum (higher = more friction)
  rotationDamping: 0.05,
  
  // Animation duration for focus transition (in seconds)
  focusAnimationDuration: 0.8,
  
  // Scale of focused photo
  focusedScale: 3,
  
  // Opacity of non-focused photos when one is selected
  unfocusedOpacity: 0.7,
};

// Seeded random for consistent sizes across refreshes
export const getPhotoSize = (index: number): number => {
  const seed = (index * 9301 + 49297) % 233280;
  const random = seed / 233280;
  return SPHERE_CONFIG.photoSizeMin + random * (SPHERE_CONFIG.photoSizeMax - SPHERE_CONFIG.photoSizeMin);
};

export const getPlaceholderImage = (index: number): string => {
  if (localPhotos.length === 0) {
    return '/photos/photo1.jpg'; // Fallback
  }
  return localPhotos[index % localPhotos.length];
};
