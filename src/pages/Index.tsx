import PhotoSphereScene from '@/components/PhotoSphere/PhotoSphereScene';

const Index = () => {
  return (
    <div className="relative w-full h-screen">
      <h1 className="absolute top-8 left-1/2 -translate-x-1/2 z-10 text-4xl md:text-6xl font-bold text-white drop-shadow-lg tracking-wide">
        Happy Birthday! 🎉
      </h1>
      <PhotoSphereScene />
    </div>
  );
};

export default Index;
