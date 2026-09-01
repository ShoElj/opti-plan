'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export function Preloader() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    const hasSeenIntro = sessionStorage.getItem('optiplan_intro_seen');
    if (!hasSeenIntro) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setShow(true);
      // Automatically hide after 2 seconds
      const timer = setTimeout(() => {
        setShow(false);
        sessionStorage.setItem('optiplan_intro_seen', 'true');
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, []);

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.5, ease: 'easeInOut' }}
          className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-emerald-950 text-white"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.7, ease: 'easeOut' }}
            className="text-center"
          >
            <h1 className="text-4xl font-bold tracking-tight mb-3">OPTI-PLAN</h1>
            <motion.p
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              className="text-emerald-200 text-lg font-medium"
            >
              Your money. Made clearer.
            </motion.p>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
