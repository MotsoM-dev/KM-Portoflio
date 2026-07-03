import { motion } from "motion/react";

export default function MovingBackground() {
  return (
    <div className="pointer-events-none fixed inset-0 -z-20 overflow-hidden">
      <motion.div
        className="absolute -top-1/2 -left-1/2 h-[200%] w-[200%] bg-[radial-gradient(circle_at_30%_20%,rgba(236,72,153,0.2),transparent_40%),radial-gradient(circle_at_70%_60%,rgba(147,51,234,0.2),transparent_40%),radial-gradient(circle_at_50%_80%,rgba(20,184,166,0.2),transparent_40%)]"
        animate={{ rotate: 360 }}
        transition={{ repeat: Infinity, duration: 60, ease: "linear" }}
      />
      <motion.div
        className="absolute -bottom-1/2 -right-1/2 h-[150%] w-[150%] bg-[radial-gradient(circle_at_20%_80%,rgba(236,72,153,0.15),transparent_40%),radial-gradient(circle_at_80%_20%,rgba(59,130,246,0.15),transparent_40%)]"
        animate={{ rotate: -360 }}
        transition={{ repeat: Infinity, duration: 80, ease: "linear" }}
      />
    </div>
  );
}