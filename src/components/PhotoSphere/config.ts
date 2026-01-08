// Configuration for the Memory Universe photo sphere
// Easy to adjust these values to customize the experience

export const SPHERE_CONFIG = {
  // Number of photos to display on the sphere
  photoCount: 60,
  
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
  unfocusedOpacity: 0.3,
};

// Placeholder image generator - using picsum with .jpg extension for better compatibility
export const getPlaceholderImage = (index: number): string => {
  // Using picsum.photos with specific image IDs for reliability
  const imageIds = [
    10, 11, 12, 13, 14, 15, 16, 17, 18, 19,
    20, 21, 22, 23, 24, 25, 26, 27, 28, 29,
    30, 31, 32, 33, 34, 35, 36, 37, 38, 39,
    40, 41, 42, 43, 44, 45, 46, 47, 48, 49,
  ];
  const id = imageIds[index % imageIds.length];
  return `https://picsum.photos/id/${id}/300/300`;
};
