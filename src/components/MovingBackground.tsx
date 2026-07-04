import { motion, useReducedMotion } from "motion/react";

export default function MovingBackground() {
  const reduceMotion = useReducedMotion();

  return (
    <div className="pointer-events-none fixed inset-0 -z-20 overflow-hidden">
      {/* Large rotating gradient mesh */}
      <motion.div
        className="absolute -top-1/2 -left-1/2 h-[200%] w-[200%] bg-[radial-gradient(circle_at_30%_20%,rgba(236,72,153,0.3),transparent_40%),radial-gradient(circle_at_70%_60%,rgba(147,51,234,0.3),transparent_40%),radial-gradient(circle_at_50%_80%,rgba(20,184,166,0.2),transparent_40%)]"
        animate={reduceMotion ? undefined : { rotate: 360 }}
        transition={{ repeat: Infinity, duration: 80, ease: "linear" }}
      />
      <motion.div
        className="absolute -bottom-1/2 -right-1/2 h-[150%] w-[150%] bg-[radial-gradient(circle_at_20%_80%,rgba(236,72,153,0.25),transparent_40%),radial-gradient(circle_at_80%_20%,rgba(59,130,246,0.25),transparent_40%)]"
        animate={reduceMotion ? undefined : { rotate: -360 }}
        transition={{ repeat: Infinity, duration: 100, ease: "linear" }}
      />
      {/* Floating orbs — smaller & softer on small screens to keep mobile scrolling smooth */}
      <motion.div
        className="absolute top-16 left-1/4 h-36 w-36 rounded-full bg-hotpink/20 blur-2xl sm:top-20 sm:h-64 sm:w-64 sm:blur-3xl"
        animate={reduceMotion ? undefined : { y: [0, -30, 0], scale: [1, 1.2, 1] }}
        transition={{ repeat: Infinity, duration: 10, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute bottom-32 right-1/4 h-44 w-44 rounded-full bg-violet/20 blur-2xl sm:bottom-40 sm:h-80 sm:w-80 sm:blur-3xl"
        animate={reduceMotion ? undefined : { y: [0, 40, 0], scale: [1, 0.9, 1] }}
        transition={{ repeat: Infinity, duration: 12, ease: "easeInOut" }}
      />
    </div>
  );
}