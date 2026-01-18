import PhotoSphereScene from '@/components/PhotoSphere/PhotoSphereScene';

const Index = () => {
  return (
    <div className="relative w-full h-screen">
      <h1 className="absolute top-8 left-0 right-0 z-10 text-4xl md:text-6xl font-bold text-yellow-300 animate-bounce-glow tracking-wide text-center">
        Happy Birthday! 🎉
      </h1>
      <PhotoSphereScene />
    </div>
  );
};

export default Index;
