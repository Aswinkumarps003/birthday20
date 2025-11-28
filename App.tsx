import React, { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { LandingPage } from './components/LandingPage';
import { LettersPage } from './components/LettersPage';

const App: React.FC = () => {
  const [showLetters, setShowLetters] = useState(false);

  return (
    <main className="w-full h-screen overflow-hidden bg-offWhite text-black">
      <AnimatePresence mode="wait">
        {!showLetters ? (
          <motion.div
            key="landing"
            exit={{ opacity: 0, y: -50 }}
            transition={{ duration: 0.8 }}
            className="w-full h-full"
          >
            <LandingPage onEnter={() => setShowLetters(true)} />
          </motion.div>
        ) : (
          <motion.div
            key="letters"
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="w-full h-full"
          >
            <LettersPage />
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  );
};

export default App;
