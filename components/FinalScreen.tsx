import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { BalloonButton } from './BalloonButton'; // We can reuse the confetti colors or logic if needed, but we'll build a custom big balloon here.

const CONFETTI_COLORS = [
    '#FF6B6B', // vibPink
    '#9B59B6', // vibPurple
    '#4ECDC4', // vibBlue
    '#FFE66D', // vibYellow
    '#FF9F43', // vibOrange
    '#FFD700', // Gold
];

export const FinalScreen: React.FC = () => {
  const [isPopped, setIsPopped] = useState(false);

  const handlePop = () => {
    setIsPopped(true);
  };

  return (
    <div className="flex flex-col items-center justify-center w-full h-full min-h-[60vh] relative z-20">
      <AnimatePresence mode="wait">
        {!isPopped ? (
          <motion.div
            key="balloon"
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 1.5, opacity: 0, transition: { duration: 0.2 } }}
            transition={{ type: "spring", stiffness: 100, damping: 15 }}
            className="cursor-pointer group relative"
            onClick={handlePop}
            whileHover={{ scale: 1.05, rotate: 2 }}
            whileTap={{ scale: 0.95 }}
          >
            {/* Giant Balloon SVG */}
            <div className="relative w-64 h-80 md:w-80 md:h-96 filter drop-shadow-2xl">
               {/* String */}
               <motion.path 
                 d="M160 320 Q 160 360 170 380" 
                 stroke="rgba(0,0,0,0.4)" 
                 strokeWidth="3" 
                 fill="none" 
                 initial={{ pathLength: 0 }}
                 animate={{ pathLength: 1 }}
                 transition={{ duration: 1 }}
               />
               
               {/* Balloon Body */}
               <svg viewBox="0 0 320 380" className="w-full h-full overflow-visible">
                 <motion.path 
                    d="M160 320 C 60 320 0 240 0 160 C 0 70 70 0 160 0 C 250 0 320 70 320 160 C 320 240 260 320 160 320 Z" 
                    fill="#FF6B6B" // VibPink as base
                    animate={{ 
                        d: [
                            "M160 320 C 60 320 0 240 0 160 C 0 70 70 0 160 0 C 250 0 320 70 320 160 C 320 240 260 320 160 320 Z",
                            "M160 325 C 55 325 -5 245 -5 160 C -5 65 65 -5 160 -5 C 255 -5 325 65 325 160 C 325 245 265 325 160 325 Z",
                            "M160 320 C 60 320 0 240 0 160 C 0 70 70 0 160 0 C 250 0 320 70 320 160 C 320 240 260 320 160 320 Z"
                        ]
                    }}
                    transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                 />
                 {/* Knot */}
                 <path d="M145 320 L175 320 L160 340 Z" fill="#FF6B6B" />
                 
                 {/* Shine */}
                 <ellipse cx="100" cy="80" rx="30" ry="15" fill="white" opacity="0.3" transform="rotate(-45 100 80)" />
                 
                 {/* Text on Balloon */}
                 <text x="160" y="160" textAnchor="middle" fill="white" className="font-serif text-3xl font-bold opacity-90 tracking-widest" style={{ pointerEvents: 'none' }}>
                    FOR SIFU
                 </text>
                 <text x="160" y="190" textAnchor="middle" fill="white" className="font-sans text-sm font-light opacity-80 uppercase tracking-widest" style={{ pointerEvents: 'none' }}>
                    (Achu)
                 </text>
               </svg>
            </div>
          </motion.div>
        ) : (
          <motion.div
            key="message"
            className="text-center px-4 max-w-2xl"
          >
            {/* Massive Confetti Explosion */}
            <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
                {[...Array(50)].map((_, i) => (
                    <motion.div
                        key={i}
                        className="absolute w-4 h-4 rounded-full"
                        style={{ backgroundColor: CONFETTI_COLORS[Math.floor(Math.random() * CONFETTI_COLORS.length)] }}
                        initial={{ scale: 0, x: 0, y: 0 }}
                        animate={{ 
                            scale: [0, 1, 0], 
                            x: (Math.random() - 0.5) * 800, 
                            y: (Math.random() - 0.5) * 800,
                            rotate: Math.random() * 720
                        }}
                        transition={{ duration: 2.5, ease: "easeOut" }}
                    />
                ))}
            </div>

            {/* The Message */}
            <motion.div
                initial={{ opacity: 0, y: 50, scale: 0.9 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ delay: 0.5, duration: 1, type: "spring" }}
                className="bg-white/90 backdrop-blur-sm p-8 md:p-12 rounded-lg shadow-2xl border border-vibPink/20 relative overflow-hidden"
            >
                {/* Decorative background hearts */}
                <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none opacity-5">
                     {[...Array(10)].map((_, i) => (
                        <div key={i} className="absolute text-6xl" style={{ top: `${Math.random()*100}%`, left: `${Math.random()*100}%` }}>❤️</div>
                     ))}
                </div>

                <h1 className="text-4xl md:text-6xl font-serif font-bold text-darkRed mb-8 drop-shadow-sm">
                    Happy Birthday, Sifu
                </h1>
                
                <div className="space-y-6">
                    <p className="text-xl md:text-2xl font-cursive text-gray-800 leading-relaxed">
                        ~ I love you with all my heart
                    </p>
                    <p className="text-xl md:text-2xl font-cursive text-gray-800 leading-relaxed">
                        and I'll always love you and pray for you...
                    </p>
                </div>

                <motion.div 
                    className="mt-12"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 2.5 }}
                >
                    <span className="text-4xl animate-pulse">❤️</span>
                </motion.div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
