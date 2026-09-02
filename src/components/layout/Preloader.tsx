'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';

export function Preloader() {
  const [show, setShow] = useState(false);
  const shouldReduceMotion = useReducedMotion();

  useEffect(() => {
    const hasSeenIntro = sessionStorage.getItem('optiplan_intro_seen');
    if (!hasSeenIntro) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setShow(true);
      // Faster, more energetic preloader (1.2 seconds total duration)
      const timer = setTimeout(() => {
        setShow(false);
        sessionStorage.setItem('optiplan_intro_seen', 'true');
      }, 1200);
      return () => clearTimeout(timer);
    }
  }, []);

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, y: shouldReduceMotion ? 0 : -20 }}
          transition={{ duration: 0.4, ease: 'easeInOut' }}
          className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-emerald-950 text-white selection:bg-emerald-500/30"
        >
          <div className="flex flex-col items-center justify-center space-y-4">
            <motion.div
              initial={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, scale: 0.8, rotate: -10 }}
              animate={shouldReduceMotion ? { opacity: 1 } : { opacity: 1, scale: 1, rotate: 0 }}
              transition={{ duration: 0.5, type: 'spring', bounce: 0.4 }}
              className="w-16 h-16 rounded-2xl bg-emerald-500 flex items-center justify-center shadow-2xl shadow-emerald-500/30"
            >
              <span className="text-2xl font-black text-emerald-950">OP</span>
            </motion.div>
            
            <motion.div
              initial={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, y: 10 }}
              animate={shouldReduceMotion ? { opacity: 1 } : { opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.2, ease: 'easeOut' }}
              className="text-center"
            >
              <h1 className="text-3xl font-extrabold tracking-tight">Opti-Plan</h1>
            </motion.div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
