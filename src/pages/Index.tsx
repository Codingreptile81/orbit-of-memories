import PhotoSphereScene from '@/components/PhotoSphere/PhotoSphereScene';

const Index = () => {
  return (
    <div className="relative w-full h-screen flex items-center justify-center">
      <h1 className="absolute z-10 text-4xl md:text-6xl font-bold text-yellow-300 animate-bounce-glow tracking-wide">
        Happy Birthday! 🎉
      </h1>
      <PhotoSphereScene />
    </div>
  );
};

export default Index;
