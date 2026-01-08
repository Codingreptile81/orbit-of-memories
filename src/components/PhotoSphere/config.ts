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

// Local photos from the photos folder
const localPhotos = [
  '/photos/photo1.jpg',
  '/photos/photo2.jpg',
  '/photos/photo3.jpg',
  '/photos/photo4.jpg',
  '/photos/photo5.jpg',
  '/photos/photo6.jpg',
  '/photos/photo7.jpg',
  '/photos/photo8.jpg',
];

export const getPlaceholderImage = (index: number): string => {
  return localPhotos[index % localPhotos.length];
};
