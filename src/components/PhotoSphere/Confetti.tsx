import { useEffect } from 'react';
import confetti from 'canvas-confetti';

const Confetti = () => {
  useEffect(() => {
    // Initial burst
    const duration = 5000;
    const end = Date.now() + duration;

    const colors = ['#FFD700', '#FF69B4', '#00CED1', '#FF6347', '#9370DB', '#00FA9A'];

    const frame = () => {
      confetti({
        particleCount: 3,
        angle: 60,
        spread: 55,
        origin: { x: 0, y: 0.6 },
        colors: colors,
      });
      confetti({
        particleCount: 3,
        angle: 120,
        spread: 55,
        origin: { x: 1, y: 0.6 },
        colors: colors,
      });

      if (Date.now() < end) {
        requestAnimationFrame(frame);
      }
    };

    // Big initial burst
    confetti({
      particleCount: 100,
      spread: 100,
      origin: { y: 0.6 },
      colors: colors,
    });

    frame();

    // Cleanup
    return () => {
      confetti.reset();
    };
  }, []);

  return null;
};

export default Confetti;
