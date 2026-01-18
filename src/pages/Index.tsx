import PhotoSphereScene from '@/components/PhotoSphere/PhotoSphereScene';

const Index = () => {
  return (
    <div className="relative w-full h-screen">
      <div className="absolute top-8 left-0 right-0 z-10 text-center">
        <h1 className="text-4xl md:text-6xl font-bold text-yellow-300 animate-bounce-glow tracking-wide">
          Happy Birthday! 🎉
        </h1>
        <p className="mt-2 text-2xl md:text-3xl font-semibold text-white drop-shadow-lg">
          Dear Shubhankar! 💖
        </p>
      </div>
      <PhotoSphereScene />
    </div>
  );
};

export default Index;
