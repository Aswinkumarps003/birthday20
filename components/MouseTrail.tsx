import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface Point {
  x: number;
  y: number;
  id: number;
  color: string;
}

// Updated Vibrant Palette
const COLORS = [
  '#FF6B6B', // vibPink
  '#9B59B6', // vibPurple
  '#4ECDC4', // vibBlue
  '#FFE66D', // vibYellow
  '#FF9F43', // vibOrange
  '#FFD700', // Gold
];

export const MouseTrail: React.FC = () => {
  const [points, setPoints] = useState<Point[]>([]);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const newPoint = {
        x: e.clientX,
        y: e.clientY,
        id: Date.now(),
        color: COLORS[Math.floor(Math.random() * COLORS.length)],
      };

      setPoints((prev) => [...prev.slice(-20), newPoint]);
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setPoints((prev) => prev.filter((p) => Date.now() - p.id < 1000));
    }, 100);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="pointer-events-none fixed inset-0 z-50 overflow-hidden">
      <AnimatePresence>
        {points.map((point) => (
          <motion.div
            key={point.id}
            initial={{ opacity: 1, scale: 0.5 }}
            animate={{ opacity: 0, scale: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.8 }}
            className="absolute rounded-full"
            style={{
              left: point.x,
              top: point.y,
              width: '12px',
              height: '12px',
              backgroundColor: point.color,
              boxShadow: `0 0 15px ${point.color}`,
              transform: 'translate(-50%, -50%)',
            }}
          />
        ))}
      </AnimatePresence>
    </div>
  );
};