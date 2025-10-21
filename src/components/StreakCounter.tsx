
import { motion } from "framer-motion";

type StreakCounterProps = {
  streak: number;
};

export default function StreakCounter({ streak }: StreakCounterProps) {
  return (
    <div className="flex flex-row gap-2 items-center justify-center mb-2 animate-fade-in">
      <span className="text-2xl">🔥</span>
      <motion.span
        key={streak}
        initial={{ scale: 1.5, color: "#d97706" }}
        animate={{ scale: 1, color: "#22c55e" }}
        exit={{ scale: 0.8 }}
        className="font-extrabold text-2xl tracking-wide"
        transition={{ duration: 0.2 }}
      >
        {streak}
      </motion.span>
      <span className="text-md font-semibold text-muted-foreground ml-1">day streak</span>
    </div>
  );
}
