import { useEffect, useState, useRef } from "react";
import { motion, useMotionValue, useSpring, useMotionTemplate } from "motion/react";
import { useTheme } from "@/hooks/use-theme";

export default function Cursor() {
  const { theme } = useTheme();
  const [visible, setVisible] = useState(false);
  const cursorX = useMotionValue(0);
  const cursorY = useMotionValue(0);

  // Spring for the main aura – fast but smooth
  const springX = useSpring(cursorX, { stiffness: 250, damping: 15 });
  const springY = useSpring(cursorY, { stiffness: 250, damping: 15 });

  // Slightly delayed spring for the inner dot (creates a trailing effect)
  const dotX = useSpring(cursorX, { stiffness: 180, damping: 25 });
  const dotY = useSpring(cursorY, { stiffness: 180, damping: 25 });

  // Pulsing ring scale
  const [pulse, setPulse] = useState(1);
  const pulseRef = useRef<number | null>(null);

  useEffect(() => {
    const move = (e: MouseEvent) => {
      cursorX.set(e.clientX);
      cursorY.set(e.clientY);
      // Trigger a quick pulse on every move
      setPulse(1.2);
      if (pulseRef.current) clearTimeout(pulseRef.current);
      pulseRef.current = window.setTimeout(() => setPulse(1), 150);
    };
    const enter = () => setVisible(true);
    const leave = () => setVisible(false);
    document.addEventListener("mousemove", move);
    document.addEventListener("mouseenter", enter);
    document.addEventListener("mouseleave", leave);
    return () => {
      document.removeEventListener("mousemove", move);
      document.removeEventListener("mouseenter", enter);
      document.removeEventListener("mouseleave", leave);
      if (pulseRef.current) clearTimeout(pulseRef.current);
    };
  }, [cursorX, cursorY]);

  const auraGradient =
    theme === "dark"
      ? "bg-gradient-to-r from-hotpink via-violet to-teal opacity-80"
      : "bg-gradient-to-r from-pink-400 via-purple-400 to-fuchsia-400 opacity-80";

  return (
    <motion.div
      className="pointer-events-none fixed top-0 left-0 z-9999"
      style={{ x: springX, y: springY, translateX: "-50%", translateY: "-50%" }}
    >
      {/* Pulsing ring */}
      <motion.div
        className="absolute top-1/2 left-1/2 h-12 w-12 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-white/50"
        animate={{
          scale: pulse,
          opacity: visible ? 0.6 : 0,
        }}
        transition={{ duration: 0.15 }}
      />

      {/* Main gradient aura */}
      <motion.div
        className={`rounded-full blur-sm ${auraGradient}`}
        style={{ width: 36, height: 36 }}
        animate={{ opacity: visible ? 1 : 0, scale: visible ? 1 : 0 }}
        transition={{ duration: 0.15 }}
      />

      {/* Trailing inner dot */}
      <motion.div
        className="absolute top-1/2 left-1/2 h-3 w-3 -translate-x-1/2 -translate-y-1/2 rounded-full bg-white"
        style={{ x: dotX, y: dotY }} // This uses the delayed spring for trailing effect
        animate={{ opacity: visible ? 1 : 0, scale: visible ? 1 : 0 }}
        transition={{ duration: 0.15 }}
      />
    </motion.div>
  );
}