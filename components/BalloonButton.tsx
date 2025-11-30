import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface BalloonButtonProps {
  onClick: () => void;
  text: string;
  color: string;
  disabled?: boolean;
  delay?: number;
}

const CONFETTI_COLORS = [
    '#FF6B6B', // vibPink
    '#9B59B6', // vibPurple
    '#4ECDC4', // vibBlue
    '#FFE66D', // vibYellow
    '#FF9F43', // vibOrange
];

export const BalloonButton: React.FC<BalloonButtonProps> = ({ onClick, text, color, disabled, delay = 0 }) => {
  const [isPopped, setIsPopped] = useState(false);

  // If text changes (e.g. Next -> Finish), reset the popped state to show the new button
  useEffect(() => {
    setIsPopped(false);
  }, [text]);

  const handleClick = (e: React.MouseEvent) => {
    if (disabled || isPopped) return;
    
    setIsPopped(true);
    
    // Play a simulated pop logic delay
    setTimeout(() => {
        onClick();
    }, 400); // Wait for pop animation to finish mostly before triggering action

    // Reset balloon state after a while so it reappears for the next letter
    setTimeout(() => {
        setIsPopped(false);
    }, 1500); 
  };

  return (
    <div className="relative w-32 h-40 flex justify-center items-center">
      <AnimatePresence>
        {!isPopped && (
          <motion.div
            className="absolute cursor-pointer flex flex-col items-center"
            initial={{ scale: 0, y: 100 }}
            animate={{ 
                scale: 1, 
                y: 0,
                rotate: [0, 5, -5, 0],
            }}
            exit={{ 
                scale: 1.5, 
                opacity: 0,
                transition: { duration: 0.15 } 
            }}
            transition={{ 
                y: { type: 'spring', delay: delay },
                rotate: { repeat: Infinity, duration: 4, ease: "easeInOut" },
            }}
            whileHover={{ scale: 1.1, y: -10 }}
            onClick={handleClick}
            style={{ opacity: disabled ? 0.5 : 1, pointerEvents: disabled ? 'none' : 'auto' }}
          >
            {/* Balloon Shape */}
            <div className="relative flex justify-center items-center">
                <svg width="100" height="120" viewBox="0 0 100 120" className="drop-shadow-xl">
                    {/* String */}
                    <path d="M50 95 Q 50 110 55 120" stroke="rgba(0,0,0,0.3)" strokeWidth="2" fill="none" />
                    
                    {/* Balloon Body */}
                    <path 
                        d="M50 95 C 20 95 0 70 0 45 C 0 20 22 0 50 0 C 78 0 100 20 100 45 C 100 70 80 95 50 95 Z" 
                        fill={color}
                    />
                    {/* Knot */}
                    <path d="M45 95 L55 95 L50 102 Z" fill={color} />
                    
                    {/* Shine */}
                    <ellipse cx="30" cy="25" rx="10" ry="5" fill="white" opacity="0.3" transform="rotate(-45 30 25)" />
                </svg>
                
                {/* Text centered in balloon */}
                <div className="absolute top-8 w-full text-center p-2">
                    <span className="font-serif font-bold text-black/80 text-sm md:text-base leading-tight block">
                        {text}
                    </span>
                </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Pop Particles Effect */}
      {isPopped && (
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              {[...Array(20)].map((_, i) => (
                  <motion.div
                    key={i}
                    className="absolute w-3 h-3 rounded-full"
                    style={{ backgroundColor: CONFETTI_COLORS[Math.floor(Math.random() * CONFETTI_COLORS.length)] }}
                    initial={{ scale: 1, x: 0, y: 0 }}
                    animate={{ 
                        scale: 0, 
                        x: (Math.random() - 0.5) * 250, 
                        y: (Math.random() - 0.5) * 250,
                        rotate: Math.random() * 360
                    }}
                    transition={{ duration: 0.8, ease: "easeOut" }}
                  />
              ))}
              <motion.span 
                initial={{ scale: 0.5, opacity: 1 }}
                animate={{ scale: 2, opacity: 0 }}
                className="font-bold text-vibPink text-2xl drop-shadow-md"
              >
                POP!
              </motion.span>
          </div>
      )}
    </div>
  );
};
