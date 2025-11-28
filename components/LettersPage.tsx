import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence, useMotionValue, useTransform } from 'framer-motion';
import { LETTERS } from '../constants';
import { PaperPlane } from './PaperPlane';
import { Cat } from './Cat';
import { BalloonButton } from './BalloonButton';
import { MouseTrail } from './MouseTrail';

export const LettersPage: React.FC = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const [direction, setDirection] = useState(1);
  const [showMusic, setShowMusic] = useState(true);
  const [triggerPlane, setTriggerPlane] = useState(false);

  // Audio ref for background music
  const audioRef = useRef<HTMLAudioElement>(null);

  // Motion values for 3D Tilt Effect
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  // 3D Card tilt transforms
  // These will rely on the mouse position relative to the center of the screen
  const rotateX = useTransform(mouseY, [0, window.innerHeight], [3, -3]);
  const rotateY = useTransform(mouseX, [0, window.innerWidth], [-3, 3]);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = 0.2;
      if (showMusic) {
        audioRef.current.play().catch(e => console.log("Auto-play prevented"));
      } else {
        audioRef.current.pause();
      }
    }
  }, [showMusic]);

  // Track global mouse movement for 3D effects
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
        mouseX.set(e.clientX);
        mouseY.set(e.clientY);
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [mouseX, mouseY]);

  const handleNext = () => {
    if (isAnimating) return;
    setIsAnimating(true);
    setDirection(1);
    
    // Trigger plane slightly after pop
    setTimeout(() => {
        setTriggerPlane(true);
    }, 100);

    // Delay the content change until plane covers screen
    setTimeout(() => {
        setCurrentIndex((prev) => (prev + 1) % LETTERS.length);
    }, 600); // Sync with plane animation speed
  };

  const handlePrev = () => {
    if (isAnimating || currentIndex === 0) return;
    setIsAnimating(true);
    setDirection(-1);
    setCurrentIndex((prev) => (prev - 1 + LETTERS.length) % LETTERS.length);
    setTimeout(() => setIsAnimating(false), 800);
  };

  const onPlaneComplete = () => {
    setTriggerPlane(false);
    setIsAnimating(false);
  };

  const currentLetter = LETTERS[currentIndex];

  return (
    <motion.div 
        className="min-h-screen flex flex-col items-center py-6 relative overflow-hidden"
        style={{ 
            backgroundColor: '#FDFBF7',
        }}
    >
      <MouseTrail />
      
      {/* Interactive Background Gradient Layer - Vibrant */}
      <motion.div 
        className="absolute inset-0 pointer-events-none opacity-40"
        style={{
            background: `linear-gradient(135deg, rgba(78, 205, 196, 0.2) 0%, rgba(253,251,247,0) 50%, rgba(255, 107, 107, 0.15) 100%)`,
            filter: 'blur(60px)',
            x: useTransform(mouseX, [0, window.innerWidth], [-30, 30]),
            y: useTransform(mouseY, [0, window.innerHeight], [-30, 30]),
        }}
      />
      
      {/* --- BACKGROUND ELEMENTS --- */}
      
      {/* Dynamic Animated Blobs - Vibrant */}
      <motion.div 
        className="absolute -top-[20%] -left-[10%] w-[80vw] h-[80vw] bg-vibBlue/20 rounded-full blur-[100px] pointer-events-none"
        animate={{ 
            scale: [1, 1.2, 0.9, 1], 
            rotate: [0, 20, -10, 0],
            x: [0, 50, -30, 0],
            y: [0, 30, -50, 0]
        }}
        transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
      />
      <motion.div 
        className="absolute top-[30%] -right-[20%] w-[70vw] h-[70vw] bg-vibPurple/20 rounded-full blur-[120px] pointer-events-none"
        animate={{ 
            scale: [1, 1.3, 0.8, 1], 
            rotate: [0, -15, 10, 0],
            x: [0, -60, 40, 0],
            y: [0, -40, 60, 0]
        }}
        transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
      />
      <motion.div 
        className="absolute -bottom-[20%] left-[20%] w-[60vw] h-[60vw] bg-vibYellow/20 rounded-full blur-[100px] pointer-events-none"
        animate={{ 
            scale: [0.9, 1.1, 1], 
            rotate: [0, 10, -10, 0],
            x: [0, 30, -30, 0],
        }}
        transition={{ duration: 18, repeat: Infinity, ease: "linear" }}
      />

      {/* Floating Sparkles/Fireflies - Multicolor */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {['#FF6B6B', '#4ECDC4', '#FFE66D'].map((color, groupIdx) => (
             <React.Fragment key={groupIdx}>
                {[...Array(5)].map((_, i) => (
                    <motion.div
                        key={`${groupIdx}-${i}`}
                        className="absolute rounded-full opacity-60 shadow-[0_0_8px_rgba(255,255,255,0.4)]"
                        style={{
                            backgroundColor: color,
                            width: Math.random() * 6 + 2,
                            height: Math.random() * 6 + 2,
                            left: Math.random() * 100 + '%',
                            top: Math.random() * 100 + '%',
                        }}
                        animate={{
                            y: [0, -120],
                            x: [0, Math.random() * 40 - 20],
                            opacity: [0, 0.8, 0],
                            scale: [0, 1.2, 0],
                        }}
                        transition={{
                            duration: Math.random() * 8 + 8,
                            repeat: Infinity,
                            delay: Math.random() * 10,
                            ease: "easeInOut",
                        }}
                    />
                ))}
             </React.Fragment>
        ))}
      </div>

      {/* Walking Cats (Interactive) */}
      <Cat startDelay={0} yPosition={85} duration={15} direction="right" />
      <Cat startDelay={7} yPosition={15} duration={20} direction="left" />
      <Cat startDelay={2} yPosition={45} duration={25} direction="right" />

      {/* Decorative Background Balloons - Vibrant */}
      <motion.div 
        className="absolute top-20 left-[10%] opacity-40 pointer-events-none"
        animate={{ y: [0, -20, 0], rotate: [0, 5, -5, 0] }} 
        transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
      >
        <svg width="50" height="60" viewBox="0 0 100 120">
           <path d="M50 95 C 20 95 0 70 0 45 C 0 20 22 0 50 0 C 78 0 100 20 100 45 C 100 70 80 95 50 95 Z" fill="#4ECDC4" />
           <path d="M50 95 Q 50 110 55 120" stroke="#000" strokeWidth="1" fill="none" />
        </svg>
      </motion.div>
      <motion.div 
        className="absolute bottom-40 right-[15%] opacity-30 pointer-events-none"
        animate={{ y: [0, -30, 0], rotate: [0, -5, 5, 0] }} 
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut", delay: 1 }}
      >
        <svg width="70" height="85" viewBox="0 0 100 120">
           <path d="M50 95 C 20 95 0 70 0 45 C 0 20 22 0 50 0 C 78 0 100 20 100 45 C 100 70 80 95 50 95 Z" fill="#FF6B6B" />
           <path d="M50 95 Q 50 110 55 120" stroke="#000" strokeWidth="1" fill="none" />
        </svg>
      </motion.div>


      {/* --- FOREGROUND CONTENT --- */}

      {/* Music Toggle */}
      <button
        onClick={() => setShowMusic(!showMusic)}
        className="absolute top-4 right-4 z-40 p-3 bg-white/80 backdrop-blur-md rounded-full hover:bg-vibBlue hover:text-white transition-all shadow-sm border border-gray-100"
      >
        {showMusic ? '🔊' : '🔇'}
      </button>
      <audio ref={audioRef} loop src="https://cdn.pixabay.com/download/audio/2022/05/27/audio_1808fbf07a.mp3?filename=piano-moment-111005.mp3" />

      {/* Progress */}
      <div className="w-full max-w-xl px-6 mb-2 flex items-center justify-between z-10 relative">
        <span className="font-serif italic text-gray-500 text-sm">Letter {currentIndex + 1}</span>
        <div className="h-1 flex-1 mx-4 bg-gray-200 rounded-full overflow-hidden shadow-inner">
            <motion.div 
                className="h-full bg-gradient-to-r from-vibBlue via-vibPink to-vibOrange"
                initial={{ width: 0 }}
                animate={{ width: `${((currentIndex + 1) / LETTERS.length) * 100}%` }}
                transition={{ duration: 0.5 }}
            />
        </div>
        <span className="font-serif italic text-gray-500 text-sm">{LETTERS.length}</span>
      </div>

      <PaperPlane trigger={triggerPlane} onComplete={onPlaneComplete} />

      {/* Carousel Area */}
      <div className="relative w-full h-full max-w-6xl px-4 flex-1 flex items-center justify-center perspective-1000 py-4">
        
        {/* Navigation Balloons - Desktop (Vibrant) */}
        <div className="absolute left-4 lg:left-20 z-30 hidden md:block">
             <BalloonButton 
                text="Previous" 
                color="#4ECDC4" // VibBlue
                onClick={handlePrev} 
                disabled={currentIndex === 0 || isAnimating} 
                delay={0.2}
             />
        </div>

        <AnimatePresence mode="wait" initial={false}>
          <motion.div
            key={currentIndex}
            className="bg-white p-4 md:p-6 shadow-2xl relative z-20 border border-stone-100 rounded-sm flex flex-col items-center"
            style={{ 
                perspective: 1000,
                rotateX: rotateX,
                rotateY: rotateY,
                transformStyle: "preserve-3d",
                width: 'min(90vw, 500px)', // Limit width but allow full mobile width
                minHeight: '60vh',
            }}
            initial={{ 
                x: direction > 0 ? 150 : -150, 
                opacity: 0,
                rotate: direction > 0 ? 5 : -5,
                scale: 0.9
            }}
            animate={{ 
                x: 0, 
                opacity: 1,
                rotate: Math.random() * 2 - 1, 
                scale: 1
            }}
            exit={{ 
                x: direction > 0 ? -150 : 150, 
                opacity: 0,
                transition: { duration: 0.4 } 
            }}
            transition={{ duration: 0.7, type: "spring", stiffness: 90, damping: 15 }}
          >
            {/* Realistic Paper Texture Overlay */}
            <div className="absolute inset-0 bg-stone-50 opacity-50 pointer-events-none mix-blend-multiply rounded-sm" style={{ backgroundImage: 'url("https://www.transparenttextures.com/patterns/cream-paper.png")' }}></div>
            
            {/* Glare Effect */}
            <motion.div 
                className="absolute inset-0 pointer-events-none z-30 rounded-sm"
                style={{
                    background: 'linear-gradient(120deg, rgba(255,255,255,0) 30%, rgba(255,255,255,0.4) 50%, rgba(255,255,255,0) 70%)',
                    backgroundSize: '200% 100%',
                }}
                animate={{ backgroundPosition: ['100% 0%', '0% 0%'] }}
                transition={{ duration: 3, repeat: Infinity, repeatDelay: 5 }}
            />
            
            {/* Washi Tape - Vibrant */}
            <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 w-32 h-8 bg-vibPink/70 rotate-[-1deg] shadow-sm backdrop-blur-[1px] z-40 opacity-90"></div>

            <div className="relative z-10 flex flex-col items-center w-full h-full" style={{ transform: "translateZ(10px)" }}>
                
                {/* Header */}
                <h2 className="text-3xl md:text-4xl font-serif font-bold text-darkRed mb-6 mt-4 tracking-wide shadow-sm">
                    Letter #{currentIndex + 1}
                </h2>

                {/* Image Container - The Letter Itself */}
                <div className="relative w-full flex-1 bg-gray-50 p-1 md:p-2 shadow-[inset_0_0_15px_rgba(0,0,0,0.05)] border border-gray-100 rotate-[0.5deg] transition-transform hover:rotate-0">
                    <div className="w-full h-full overflow-hidden relative min-h-[400px]">
                        <img 
                            src={currentLetter.image} 
                            alt={`Letter ${currentIndex + 1}`} 
                            className="w-full h-full object-cover rounded-sm"
                        />
                         {/* Subtle vignette over image */}
                        <div className="absolute inset-0 shadow-[inset_0_0_30px_rgba(122,31,40,0.1)] pointer-events-none"></div>
                    </div>
                </div>

                <div className="mt-4 w-full flex justify-between items-center text-gray-400 text-xs font-sans tracking-widest uppercase opacity-70">
                    <span>{new Date().getFullYear()}</span>
                    <span>♥ Sifu</span>
                </div>
            </div>
          </motion.div>
        </AnimatePresence>

        <div className="absolute right-4 lg:right-20 z-30 hidden md:block">
             <BalloonButton 
                text="Next Letter" 
                color="#FF6B6B" // VibPink
                onClick={handleNext} 
                disabled={isAnimating} 
                delay={0.4}
             />
        </div>
      </div>

      {/* Mobile Navigation Balloons (Bottom) - Vibrant */}
      <div className="flex justify-between w-full px-8 md:hidden z-30 mb-4 mt-auto">
           <BalloonButton 
                text="Prev" 
                color="#4ECDC4" // VibBlue
                onClick={handlePrev} 
                disabled={currentIndex === 0 || isAnimating} 
           />
           <BalloonButton 
                text="Next" 
                color="#FF6B6B" // VibPink
                onClick={handleNext} 
                disabled={isAnimating} 
           />
      </div>

    </motion.div>
  );
};