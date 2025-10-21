import React, { useEffect } from 'react';
import { motion } from 'framer-motion'; // Assuming framer-motion is installed for animations

interface StreakCompletionAnimationProps {
  streak: number;
  onComplete: () => void;
}

const StreakCompletionAnimation: React.FC<StreakCompletionAnimationProps> = ({ streak, onComplete }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onComplete();
    }, 2500); // Animation duration + small delay

    return () => clearTimeout(timer);
  }, [onComplete]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/90 backdrop-blur-sm">
      <motion.div
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: "spring", stiffness: 260, damping: 20 }}
        className="flex flex-col items-center justify-center text-center p-8 rounded-full bg-primary text-primary-foreground shadow-2xl"
      >
        <motion.span
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.5 }}
          className="text-6xl font-extrabold mb-2"
        >
          {streak}
        </motion.span>
        <motion.span
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.4, duration: 0.5 }}
          className="text-xl font-semibold"
        >
          Day Streak! 🔥
        </motion.span>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8, duration: 0.5 }}
          className="text-sm mt-4 text-primary-foreground/80"
        >
          Keep up the great work!
        </motion.p>
      </motion.div>
    </div>
  );
};

export default StreakCompletionAnimation; 