
import { useEffect, useState } from "react";
import { motion, useMotionValue, useSpring } from "motion/react";

export default function Cursor() {
  const [isVisible, setIsVisible] = useState(false);
  const cursorX = useMotionValue(0);
  const cursorY = useMotionValue(0);
  const springX = useSpring(cursorX, { stiffness: 100, damping: 30 });
  const springY = useSpring(cursorY, { stiffness: 100, damping: 30 });

  useEffect(() => {
    const move = (e: MouseEvent) => {
      cursorX.set(e.clientX);
      cursorY.set(e.clientY);
    };
    const enter = () => setIsVisible(true);
    const leave = () => setIsVisible(false);
    document.addEventListener("mousemove", move);
    document.addEventListener("mouseenter", enter);
    document.addEventListener("mouseleave", leave);
    return () => {
      document.removeEventListener("mousemove", move);
      document.removeEventListener("mouseenter", enter);
      document.removeEventListener("mouseleave", leave);
    };
  }, [cursorX, cursorY]);

  return (
    <motion.div
      className="pointer-events-none fixed top-0 left-0 z-[9999] mix-blend-difference"
      style={{
        x: springX,
        y: springY,
        translateX: "-50%",
        translateY: "-50%",
      }}
    >
      {/* Aura circle */}
      <motion.div
        className="rounded-full bg-gradient-to-r from-hotpink via-violet to-teal opacity-70 blur-sm"
        style={{
          width: 40,
          height: 40,
          opacity: isVisible ? 0.7 : 0,
          scale: isVisible ? 1 : 0,
        }}
        animate={{ scale: isVisible ? 1 : 0 }}
        transition={{ duration: 0.2 }}
      />
      {/* Inner dot */}
      <motion.div
        className="absolute top-1/2 left-1/2 h-3 w-3 -translate-x-1/2 -translate-y-1/2 rounded-full bg-white"
        style={{ opacity: isVisible ? 1 : 0 }}
        animate={{ scale: isVisible ? 1 : 0 }}
        transition={{ duration: 0.2 }}
      />
    </motion.div>
  );
}