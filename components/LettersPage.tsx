
import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence, useMotionValue, useTransform } from 'framer-motion';
import { LETTERS } from '../constants';
import { PaperPlane } from './PaperPlane';
import { Cat } from './Cat';
import { BalloonButton } from './BalloonButton';
import { MouseTrail } from './MouseTrail';
import { FinalScreen } from './FinalScreen';

// A more emotional, romantic background track
const BACKGROUND_MUSIC = "./violin.mp3"; 

const NAV_COLORS = [
    '#FF6B6B', // vibPink
    '#4ECDC4', // vibBlue
    '#9B59B6', // vibPurple
    '#FFE66D', // vibYellow
    '#FF9F43', // vibOrange
];

interface MiniBalloonProps {
    index: number;
    isActive: boolean;
    onClick: () => void;
    color: string;
}

const MiniBalloon: React.FC<MiniBalloonProps> = ({ index, isActive, onClick, color }) => (
    <motion.button
        whileHover={{ scale: 1.2, rotate: Math.random() * 10 - 5 }}
        whileTap={{ scale: 0.9 }}
        onClick={onClick}
        className="relative group flex items-center justify-center m-2 w-12 h-14 focus:outline-none flex-shrink-0"
        style={{ opacity: isActive ? 1 : 0.6 }}
        title={`Go to Letter ${index + 1}`}
    >
        {/* Simple SVG Balloon */}
        <svg width="100%" height="100%" viewBox="0 0 40 50" className="drop-shadow-sm overflow-visible">
            <motion.path 
                d="M20 38 C 5 38 0 25 0 15 C 0 5 10 0 20 0 C 30 0 40 5 40 15 C 40 25 35 38 20 38 Z" 
                fill={color} 
                animate={isActive ? { scale: [1, 1.1, 1] } : {}}
                transition={{ repeat: Infinity, duration: 2 }}
            />
            <path d="M20 38 Q 20 45 22 50" stroke="rgba(0,0,0,0.3)" strokeWidth="1" fill="none" />
            {/* Shine */}
            <ellipse cx="12" cy="10" rx="4" ry="2" fill="white" opacity="0.4" transform="rotate(-45 12 10)" />
        </svg>
        <span className="absolute top-2 text-[12px] font-bold text-white drop-shadow-md pointer-events-none">
            {index + 1}
        </span>
    </motion.button>
);

export const LettersPage: React.FC = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const [direction, setDirection] = useState(1);
  const [showMusic, setShowMusic] = useState(true);
  const [triggerPlane, setTriggerPlane] = useState(false);
  const [showFinalScreen, setShowFinalScreen] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);

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
      audioRef.current.volume = 0.3; // Slightly higher volume for this track
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
    
    // Check if we are at the last letter
    if (currentIndex === LETTERS.length - 1) {
        // Trigger exit animation for the letter card
        setIsAnimating(true);
        setDirection(1);
        
        // Wait for pop/plane effect before showing final screen
        setTimeout(() => {
             setShowFinalScreen(true);
             setIsAnimating(false);
        }, 800);
        return;
    }

    setIsAnimating(true);
    setDirection(1);
    
    // Trigger plane slightly after pop
    setTimeout(() => {
        setTriggerPlane(true);
    }, 100);

    // Delay the content change until plane covers screen
    setTimeout(() => {
        setCurrentIndex((prev) => prev + 1);
    }, 600); // Sync with plane animation speed
  };

  const handlePrev = () => {
    if (isAnimating || currentIndex === 0) return;
    setIsAnimating(true);
    setDirection(-1);
    setCurrentIndex((prev) => prev - 1);
    setTimeout(() => setIsAnimating(false), 800);
  };

  const handleJumpTo = (index: number) => {
    if (isAnimating || index === currentIndex) return;
    setIsAnimating(true);
    setDirection(index > currentIndex ? 1 : -1);
    
    // Simple transition for jumping
    setTimeout(() => {
        setCurrentIndex(index);
        setIsAnimating(false);
    }, 500);
  };

  const onPlaneComplete = () => {
    setTriggerPlane(false);
    setIsAnimating(false);
  };

  const currentLetter = LETTERS[currentIndex];

  return (
    <motion.div 
        className="min-h-screen flex flex-col items-center py-6 pt-16 xl:pt-6 relative overflow-hidden"
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

      {/* Left Sidebar Navigation (Desktop) */}
      {!showFinalScreen && (
          <motion.div 
            initial={{ x: -100, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            className="fixed left-2 top-0 bottom-0 z-40 hidden xl:flex flex-col justify-center items-center py-4"
          >
              <div className="bg-white/40 backdrop-blur-md rounded-full px-2 py-4 shadow-lg border border-white/50 max-h-[90vh] overflow-y-auto no-scrollbar flex flex-col items-center gap-1">
                  {LETTERS.map((_, i) => (
                      <MiniBalloon 
                        key={i}
                        index={i}
                        isActive={i === currentIndex}
                        onClick={() => handleJumpTo(i)}
                        color={NAV_COLORS[i % NAV_COLORS.length]}
                      />
                  ))}
              </div>
          </motion.div>
      )}

      {/* Mobile Jump Button (Top Left) */}
      {!showFinalScreen && (
          <motion.button
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="fixed top-4 left-4 z-50 p-3 bg-white/80 backdrop-blur-md rounded-full shadow-sm xl:hidden border border-gray-100 hover:bg-vibPurple/10 text-vibPurple"
            onClick={() => setShowMobileMenu(true)}
            aria-label="Jump to Letter"
          >
            {/* Grid Icon */}
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="3" y="3" width="7" height="7"></rect>
                <rect x="14" y="3" width="7" height="7"></rect>
                <rect x="14" y="14" width="7" height="7"></rect>
                <rect x="3" y="14" width="7" height="7"></rect>
            </svg>
          </motion.button>
      )}

      {/* Mobile Jump Overlay Menu */}
      <AnimatePresence>
        {showMobileMenu && !showFinalScreen && (
            <motion.div 
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="fixed inset-0 z-[60] bg-offWhite/95 backdrop-blur-xl flex flex-col items-center justify-center p-6"
            >
                <button 
                    onClick={() => setShowMobileMenu(false)} 
                    className="absolute top-6 right-6 p-2 rounded-full bg-white shadow-sm hover:bg-gray-50 transition-colors"
                >
                    <svg width="24" height="24" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                        <path d="M6 18L18 6M6 6l12 12" />
                    </svg>
                </button>
                
                <h3 className="text-3xl font-serif font-bold text-darkRed mb-8">Jump to Letter</h3>
                
                <div className="grid grid-cols-4 sm:grid-cols-5 gap-4 max-h-[70vh] overflow-y-auto p-4 w-full max-w-lg">
                    {LETTERS.map((_, i) => (
                        <div key={i} className="flex justify-center">
                            <MiniBalloon 
                                index={i} 
                                isActive={i === currentIndex} 
                                onClick={() => {
                                    handleJumpTo(i);
                                    setShowMobileMenu(false);
                                }}
                                color={NAV_COLORS[i % NAV_COLORS.length]} 
                            />
                        </div>
                    ))}
                </div>
            </motion.div>
        )}
      </AnimatePresence>

      {/* Music Toggle */}
      <button
        onClick={() => setShowMusic(!showMusic)}
        className="fixed top-4 right-4 z-50 p-3 bg-white/80 backdrop-blur-md rounded-full hover:bg-vibBlue hover:text-white transition-all shadow-sm border border-gray-100"
      >
        {showMusic ? '🔊' : '🔇'}
      </button>
      <audio ref={audioRef} loop src={BACKGROUND_MUSIC} />

      {/* Progress (Hide on final screen) */}
      {!showFinalScreen && (
          <div className="w-full max-w-xl px-12 md:px-6 mb-2 flex items-center justify-between z-10 relative">
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
      )}

      <PaperPlane trigger={triggerPlane} onComplete={onPlaneComplete} />

      {/* Main Content Area */}
      <div className="relative w-full h-full max-w-6xl px-4 flex-1 flex flex-col md:flex-row items-center justify-center perspective-1000 py-2">
        
        {/* Render Final Screen OR Carousel */}
        {showFinalScreen ? (
            <FinalScreen />
        ) : (
            <>
                {/* Navigation Balloons - Desktop (Left Side) */}
                <div className="absolute left-16 lg:left-24 z-30 hidden md:block">
                     <BalloonButton 
                        text="Previous" 
                        color="#4ECDC4" // VibBlue
                        onClick={handlePrev} 
                        disabled={currentIndex === 0 || isAnimating} 
                        delay={0.2}
                     />
                </div>

                {/* Letter Card */}
                <AnimatePresence mode="wait" initial={false}>
                  <motion.div
                    key={currentIndex}
                    className="bg-white p-4 md:p-6 shadow-2xl relative z-20 border border-stone-100 rounded-sm flex flex-col items-center"
                    style={{ 
                        perspective: 1000,
                        rotateX: rotateX,
                        rotateY: rotateY,
                        transformStyle: "preserve-3d",
                        width: 'min(90vw, 500px)', // Responsive width
                        minHeight: '55vh', // Slightly shorter on mobile to fit buttons
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
                        <h2 className="text-3xl md:text-4xl font-serif font-bold text-darkRed mb-4 mt-4 tracking-wide shadow-sm">
                            Letter #{currentIndex + 1}
                        </h2>

                        {/* Image Container - The Letter Itself */}
                        <div className="relative w-full flex-1 bg-gray-50 p-1 md:p-2 shadow-[inset_0_0_15px_rgba(0,0,0,0.05)] border border-gray-100 rotate-[0.5deg] transition-transform hover:rotate-0">
                            <div className="w-full h-full overflow-hidden relative min-h-[350px] md:min-h-[400px]">
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

                {/* Navigation Balloons - Desktop (Right Side) */}
                <div className="absolute right-4 lg:right-20 z-30 hidden md:block">
                     <BalloonButton 
                        text={currentIndex === LETTERS.length - 1 ? "Finish" : "Next Letter"} 
                        color="#FF6B6B" // VibPink
                        onClick={handleNext} 
                        disabled={isAnimating} 
                        delay={0.4}
                     />
                </div>
            </>
        )}
      </div>

      {/* Mobile Navigation Balloons (Bottom) - Centered Below Card */}
      {!showFinalScreen && (
          <div className="flex justify-between w-full max-w-sm px-6 md:hidden z-30 pb-4">
               <BalloonButton 
                    text="Prev" 
                    color="#4ECDC4" // VibBlue
                    onClick={handlePrev} 
                    disabled={currentIndex === 0 || isAnimating} 
               />
               <BalloonButton 
                    text={currentIndex === LETTERS.length - 1 ? "Finish" : "Next"} 
                    color="#FF6B6B" // VibPink
                    onClick={handleNext} 
                    disabled={isAnimating} 
               />
          </div>
      )}

    </motion.div>
  );
};
