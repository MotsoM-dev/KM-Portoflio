import { motion } from "motion/react";

export default function MovingBackground() {
  return (
    <div className="pointer-events-none fixed inset-0 -z-20 overflow-hidden">
      {/* Large rotating gradient mesh */}
      <motion.div
        className="absolute -top-1/2 -left-1/2 h-[200%] w-[200%] bg-[radial-gradient(circle_at_30%_20%,rgba(236,72,153,0.4),transparent_40%),radial-gradient(circle_at_70%_60%,rgba(147,51,234,0.4),transparent_40%),radial-gradient(circle_at_50%_80%,rgba(20,184,166,0.3),transparent_40%)]"
        animate={{ rotate: 360 }}
        transition={{ repeat: Infinity, duration: 80, ease: "linear" }}
      />
      <motion.div
        className="absolute -bottom-1/2 -right-1/2 h-[150%] w-[150%] bg-[radial-gradient(circle_at_20%_80%,rgba(236,72,153,0.4),transparent_40%),radial-gradient(circle_at_80%_20%,rgba(59,130,246,0.4),transparent_40%)]"
        animate={{ rotate: -360 }}
        transition={{ repeat: Infinity, duration: 100, ease: "linear" }}
      />
      {/* Bright floating orbs */}
      <motion.div
        className="absolute top-20 left-1/4 h-64 w-64 rounded-full bg-hotpink/30 blur-3xl"
        animate={{ y: [0, -40, 0], scale: [1, 1.3, 1] }}
        transition={{ repeat: Infinity, duration: 8, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute bottom-40 right-1/4 h-80 w-80 rounded-full bg-violet/30 blur-3xl"
        animate={{ y: [0, 40, 0], scale: [1, 0.9, 1] }}
        transition={{ repeat: Infinity, duration: 10, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute top-1/2 left-1/2 h-72 w-72 rounded-full bg-teal/25 blur-3xl"
        animate={{ y: [0, -30, 0], scale: [1, 1.2, 1] }}
        transition={{ repeat: Infinity, duration: 12, ease: "easeInOut" }}
      />
    </div>
  );
}
