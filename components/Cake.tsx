import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface CakeProps {
  isBlown: boolean;
}

const Candle = ({ isBlown, index }: { isBlown: boolean; index: number }) => {
  return (
    <g transform={`translate(${index * 40}, 0)`}>
      {/* Candle Stick */}
      <rect x="0" y="20" width="10" height="40" fill="#CFE8CC" stroke="#000" strokeWidth="2" rx="2" />
      {/* Stripe */}
      <rect x="0" y="30" width="10" height="5" fill="#7A1F28" opacity="0.3" />
      <rect x="0" y="45" width="10" height="5" fill="#7A1F28" opacity="0.3" />

      {/* Flame Area */}
      <AnimatePresence>
        {!isBlown && (
          <motion.path
            initial={{ scale: 0, opacity: 0 }}
            animate={{
              scale: [1, 1.2, 0.9, 1.1, 1],
              opacity: [0.8, 1, 0.7, 1],
              y: [0, -2, 0, -1]
            }}
            exit={{ scale: 0, opacity: 0, transition: { duration: 0.2 } }}
            transition={{
              duration: 1.5,
              repeat: Infinity,
              ease: "easeInOut",
              delay: index * 0.1
            }}
            d="M5 0 Q0 10 0 15 Q0 20 5 20 Q10 20 10 15 Q10 10 5 0Z"
            fill="#FFD700"
          />
        )}
      </AnimatePresence>
      
      {/* Inner Blue Flame */}
      <AnimatePresence>
        {!isBlown && (
          <motion.path
            initial={{ scale: 0 }}
            animate={{ scale: [1, 1.1, 0.9] }}
            exit={{ scale: 0, opacity: 0 }}
            transition={{ duration: 1, repeat: Infinity, delay: index * 0.1 }}
            d="M5 10 Q3 15 3 17 Q3 19 5 19 Q7 19 7 17 Q7 15 5 10Z"
            fill="#00BFFF"
            opacity="0.6"
          />
        )}
      </AnimatePresence>

      {/* Smoke Effect on Extinguish */}
      <AnimatePresence>
        {isBlown && (
          <motion.g
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: [0.6, 0], y: -60, x: [0, (index % 2 === 0 ? 10 : -10)] }}
            transition={{ duration: 2, ease: "easeOut" }}
          >
            <circle cx="5" cy="0" r="2" fill="#888" />
            <circle cx="5" cy="-10" r="3" fill="#888" />
            <circle cx="5" cy="-20" r="4" fill="#888" />
          </motion.g>
        )}
      </AnimatePresence>
    </g>
  );
};

export const Cake: React.FC<CakeProps> = ({ isBlown }) => {
  return (
    <div className="relative w-64 h-64 md:w-80 md:h-80 mx-auto flex justify-center items-center">
      <motion.svg
        viewBox="0 0 200 200"
        className="w-full h-full drop-shadow-2xl"
        initial={{ y: 50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 1 }}
      >
        {/* Cake Base Layer 1 */}
        <path d="M20 120 Q100 140 180 120 L180 170 Q100 190 20 170 Z" fill="#F8F5F0" stroke="#000" strokeWidth="2" />
        <ellipse cx="100" cy="120" rx="80" ry="20" fill="#F8F5F0" stroke="#000" strokeWidth="2" />
        
        {/* Frosting Detail */}
        <path d="M20 120 Q30 130 40 120 Q50 130 60 120 Q70 130 80 120 Q90 130 100 120 Q110 130 120 120 Q130 130 140 120 Q150 130 160 120 Q170 130 180 120" fill="none" stroke="#7A1F28" strokeWidth="2" />

        {/* Cake Layer 2 */}
        <path d="M40 80 Q100 100 160 80 L160 120 Q100 140 40 120 Z" fill="#CFE8CC" stroke="#000" strokeWidth="2" />
        <ellipse cx="100" cy="80" rx="60" ry="15" fill="#CFE8CC" stroke="#000" strokeWidth="2" />

        {/* Candles Container */}
        <g transform="translate(65, 30)">
           {/* 3 Candles */}
           <Candle isBlown={isBlown} index={0} />
           <Candle isBlown={isBlown} index={1} />
           <Candle isBlown={isBlown} index={2} />
        </g>
      </motion.svg>
    </div>
  );
};
