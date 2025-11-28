import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion } from 'framer-motion';
import { Cake } from './Cake';

interface LandingPageProps {
  onEnter: () => void;
}

const PARTICLE_COLORS = ['#FF6B6B', '#9B59B6', '#4ECDC4', '#FFE66D', '#FF9F43'];

export const LandingPage: React.FC<LandingPageProps> = ({ onEnter }) => {
  const [isBlown, setIsBlown] = useState(false);
  const [micPermission, setMicPermission] = useState<'prompt' | 'granted' | 'denied'>('prompt');
  const [audioLevel, setAudioLevel] = useState(0);
  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const dataArrayRef = useRef<Uint8Array | null>(null);
  const rafRef = useRef<number | null>(null);

  const BLOW_THRESHOLD = 50; // Threshold for "blowing" sound intensity

  const startListening = useCallback(async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      setMicPermission('granted');
      
      const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
      audioContextRef.current = new AudioContextClass();
      analyserRef.current = audioContextRef.current.createAnalyser();
      const source = audioContextRef.current.createMediaStreamSource(stream);
      
      source.connect(analyserRef.current);
      analyserRef.current.fftSize = 256;
      const bufferLength = analyserRef.current.frequencyBinCount;
      dataArrayRef.current = new Uint8Array(bufferLength);

      const checkAudioLevel = () => {
        if (!analyserRef.current || !dataArrayRef.current) return;

        analyserRef.current.getByteFrequencyData(dataArrayRef.current);
        
        // Calculate average volume
        let sum = 0;
        for (let i = 0; i < bufferLength; i++) {
          sum += dataArrayRef.current[i];
        }
        const average = sum / bufferLength;
        setAudioLevel(average);

        if (average > BLOW_THRESHOLD && !isBlown) {
            setIsBlown(true);
            if(stream) stream.getTracks().forEach(track => track.stop());
        } else {
            rafRef.current = requestAnimationFrame(checkAudioLevel);
        }
      };

      checkAudioLevel();

    } catch (err) {
      console.error("Mic access denied or error:", err);
      setMicPermission('denied');
    }
  }, [isBlown]);

  useEffect(() => {
    return () => {
        if (rafRef.current) cancelAnimationFrame(rafRef.current);
        if (audioContextRef.current) audioContextRef.current.close();
    };
  }, []);

  const handleManualBlow = () => {
    setIsBlown(true);
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 relative overflow-hidden bg-offWhite">
        {/* Colorful Background Particles */}
        <div className="absolute inset-0 pointer-events-none">
            {[...Array(20)].map((_, i) => (
                <motion.div
                    key={i}
                    className="absolute rounded-full opacity-40"
                    style={{
                        width: Math.random() * 25 + 10,
                        height: Math.random() * 25 + 10,
                        backgroundColor: PARTICLE_COLORS[Math.floor(Math.random() * PARTICLE_COLORS.length)],
                        top: `${Math.random() * 100}%`,
                        left: `${Math.random() * 100}%`,
                    }}
                    animate={{
                        y: [0, -100, 0],
                        opacity: [0.3, 0.7, 0.3],
                        scale: [1, 1.2, 1],
                    }}
                    transition={{
                        duration: Math.random() * 5 + 5,
                        repeat: Infinity,
                        ease: "easeInOut"
                    }}
                />
            ))}
        </div>

      {/* Main Content */}
      <div className="z-10 text-center space-y-8 max-w-lg w-full">
        
        <Cake isBlown={isBlown} />

        <div className="space-y-4">
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 1 }}
            className="text-4xl md:text-5xl font-serif font-bold tracking-wide text-black"
          >
            Happy Birthday, <span className="text-vibPink drop-shadow-sm">Sifu</span> ❤️
          </motion.h1>
          
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.5, duration: 1 }}
            className="text-lg md:text-xl font-cursive text-gray-700 glow-text"
          >
            I wrote every letter on this website by hand, only for you.
          </motion.p>
        </div>

        <div className="h-24 flex items-center justify-center">
          {!isBlown ? (
            <div className="space-y-3">
              {micPermission === 'prompt' && (
                <button 
                  onClick={startListening}
                  className="bg-black text-offWhite px-6 py-3 rounded-full font-sans text-sm tracking-widest hover:scale-105 transition-transform duration-300 hover:bg-vibPurple"
                >
                  ENABLE MIC TO BLOW 🎤
                </button>
              )}
              
              {micPermission === 'granted' && (
                 <div className="flex flex-col items-center gap-2">
                     <p className="text-sm font-sans uppercase tracking-widest animate-pulse text-vibPink font-bold">
                        Blow into the mic...
                     </p>
                     {/* Visualizer Bar */}
                     <div className="w-32 h-2 bg-gray-200 rounded-full overflow-hidden">
                        <motion.div 
                            className="h-full bg-gradient-to-r from-vibPink to-vibPurple"
                            style={{ width: `${Math.min(audioLevel * 2, 100)}%` }}
                        />
                     </div>
                 </div>
              )}

              {/* Fallback or manual override */}
              {(micPermission === 'denied' || micPermission === 'prompt') && (
                <button 
                    onClick={handleManualBlow}
                    className="block mx-auto text-xs text-gray-500 underline mt-2 hover:text-vibPink"
                >
                    Or tap here to blow manually
                </button>
              )}
            </div>
          ) : (
            <motion.button
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={onEnter}
              className="bg-gradient-to-r from-vibPink to-vibOrange text-white px-8 py-4 rounded-full font-serif text-lg shadow-xl flex items-center gap-2 relative overflow-hidden group"
            >
              <span className="relative z-10 font-bold">Read Your 20 Letters</span>
              <span className="relative z-10">✈️</span>
              {/* Button shimmer effect */}
              <motion.div 
                className="absolute inset-0 bg-white opacity-20"
                animate={{ x: ['-100%', '100%'] }}
                transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
              />
            </motion.button>
          )}
        </div>
      </div>
    </div>
  );
};