import React, { useState, useMemo } from 'react';
import { motion, useAnimation } from 'framer-motion';

interface CatProps {
  startDelay: number;
  yPosition: number; // Percentage from top
  duration: number;
  direction?: 'left' | 'right';
}

// Vibrant Cat Colors
const CAT_COLORS = [
    '#FF6B6B', // Pinkish Red
    '#4ECDC4', // Teal Blue
    '#9B59B6', // Purple
    '#FF9F43', // Orange
    '#555555', // Dark Grey (Classic)
    '#2C3E50', // Navy
];

export const Cat: React.FC<CatProps> = ({ startDelay, yPosition, duration, direction = 'right' }) => {
  const controls = useAnimation();
  const [isRunning, setIsRunning] = useState(false);
  
  // Assign a random stable color for this cat instance
  const baseColor = useMemo(() => CAT_COLORS[Math.floor(Math.random() * CAT_COLORS.length)], []);
  const [currentColor, setCurrentColor] = useState(baseColor);

  React.useEffect(() => {
    if (!isRunning) {
      controls.start({
        x: direction === 'right' ? ['-20vw', '120vw'] : ['120vw', '-20vw'],
        transition: { 
          duration: duration, 
          repeat: Infinity, 
          ease: "linear", 
          delay: startDelay 
        }
      });
    }
  }, [controls, duration, startDelay, isRunning, direction]);

  const handleScare = () => {
    if (isRunning) return;
    setIsRunning(true);
    setCurrentColor('#FF0000'); // Bright red when scared
    
    // Run away fast!
    controls.start({
      x: direction === 'right' ? '150vw' : '-50vw',
      scaleX: direction === 'right' ? 1.2 : -1.2, // Stretch slightly for speed effect
      transition: { duration: 0.8, ease: "easeIn" }
    }).then(() => {
      // Reset after running away
      setTimeout(() => {
        setIsRunning(false);
        setCurrentColor(baseColor); // Revert color
      }, 2000 + Math.random() * 3000); // Random delay before coming back
    });
  };

  return (
    <motion.div
      className="absolute z-0 cursor-pointer w-16 h-16 md:w-24 md:h-24 hover:opacity-100 opacity-90 transition-opacity"
      style={{ top: `${yPosition}%` }}
      animate={controls}
      initial={{ x: direction === 'right' ? '-20vw' : '120vw' }}
      whileHover={{ scale: 1.15 }}
      onClick={handleScare}
    >
      {/* Cat SVG */}
      <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-md">
        <g transform={direction === 'right' ? "scale(1, 1)" : "scale(-1, 1) translate(-100, 0)"}>
           {/* Tail */}
           <motion.path 
             d="M10 50 Q 5 30 20 20" 
             stroke={currentColor} 
             strokeWidth="4" 
             fill="none"
             animate={{ d: ["M10 50 Q 5 30 20 20", "M10 50 Q 15 30 0 20", "M10 50 Q 5 30 20 20"] }}
             transition={{ duration: 1, repeat: Infinity }}
           />
           {/* Body */}
           <motion.ellipse 
             cx="50" cy="60" rx="30" ry="20" 
             fill={currentColor} 
           />
           {/* Head */}
           <motion.circle 
             cx="75" cy="40" r="15" 
             fill={currentColor} 
           />
           {/* Ears */}
           <motion.path d="M65 30 L70 15 L78 28 Z" fill={currentColor} />
           <motion.path d="M82 28 L90 15 L95 30 Z" fill={currentColor} />
           {/* Legs */}
           <motion.path 
             d="M30 75 L30 90" 
             stroke={currentColor} 
             strokeWidth="6" 
             strokeLinecap="round"
             animate={{ rotate: [-10, 10, -10] }}
             transition={{ duration: 0.5, repeat: Infinity }}
           />
           <motion.path 
             d="M45 78 L45 90" 
             stroke={currentColor} 
             strokeWidth="6" 
             strokeLinecap="round"
             animate={{ rotate: [10, -10, 10] }}
             transition={{ duration: 0.5, repeat: Infinity, delay: 0.1 }}
           />
           <motion.path 
             d="M60 78 L60 90" 
             stroke={currentColor} 
             strokeWidth="6" 
             strokeLinecap="round"
             animate={{ rotate: [-15, 15, -15] }}
             transition={{ duration: 0.5, repeat: Infinity, delay: 0.2 }}
           />
           <motion.path 
             d="M75 75 L75 90" 
             stroke={currentColor} 
             strokeWidth="6" 
             strokeLinecap="round"
             animate={{ rotate: [15, -15, 15] }}
             transition={{ duration: 0.5, repeat: Infinity, delay: 0.3 }}
           />
           {/* Eyes */}
           <circle cx="78" cy="38" r="2" fill="#fff" />
           <circle cx="85" cy="38" r="2" fill="#fff" />
        </g>
      </svg>
      {isRunning && (
        <motion.div 
          initial={{ opacity: 1, scale: 0 }}
          animate={{ opacity: 0, scale: 2 }}
          className="absolute top-0 right-0 text-xs font-bold text-vibPink whitespace-nowrap"
        >
          Meow!
        </motion.div>
      )}
    </motion.div>
  );
};