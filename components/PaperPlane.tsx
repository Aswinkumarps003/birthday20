import React, { useEffect } from 'react';
import { motion, useAnimation } from 'framer-motion';

interface PaperPlaneProps {
  trigger: boolean;
  onComplete: () => void;
}

export const PaperPlane: React.FC<PaperPlaneProps> = ({ trigger, onComplete }) => {
  const controls = useAnimation();

  useEffect(() => {
    if (trigger) {
      const sequence = async () => {
        // Reset position to bottom left off-screen
        await controls.set({ x: '-100vw', y: '50vh', opacity: 1, rotate: 15 });
        
        // Fly across to top right
        await controls.start({
          x: '150vw',
          y: '-50vh',
          rotate: -10,
          transition: { duration: 1.5, ease: "easeInOut" }
        });

        onComplete();
      };
      sequence();
    }
  }, [trigger, controls, onComplete]);

  return (
    <motion.div
      className="fixed z-50 pointer-events-none top-0 left-0 w-32 h-32 md:w-48 md:h-48"
      animate={controls}
      initial={{ x: '-100vw', y: '50vh' }}
    >
      <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-lg">
        <path
          d="M10 50 L90 20 L50 80 L50 50 Z"
          fill="#F8F5F0"
          stroke="#000"
          strokeWidth="2"
          strokeLinejoin="round"
        />
        <path
          d="M50 50 L90 20"
          stroke="#000"
          strokeWidth="1"
        />
        <path
           d="M30 65 L50 80"
           stroke="#000"
           strokeWidth="1"
        />
      </svg>
    </motion.div>
  );
};
