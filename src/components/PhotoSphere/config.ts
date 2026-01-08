// Configuration for the Memory Universe photo sphere
// Easy to adjust these values to customize the experience

export const SPHERE_CONFIG = {
  // Number of photos to display on the sphere
  photoCount: 36,
  
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

// Placeholder image generator - uses Lorem Picsum for beautiful placeholders
export const getPlaceholderImage = (index: number): string => {
  // Using Lorem Picsum with different seeds for variety
  return `https://picsum.photos/seed/${index + 100}/300/300`;
};
