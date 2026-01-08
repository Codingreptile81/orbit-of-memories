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

export const getPlaceholderImage = (index: number): string => {
  if (localPhotos.length === 0) {
    return '/photos/photo1.jpg'; // Fallback
  }
  return localPhotos[index % localPhotos.length];
};
