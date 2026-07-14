import { useEffect, useRef, useState } from "react";
import { motion, useMotionValue, useSpring } from "motion/react";

type TrailDot = {
  id: number;
  x: number;
  y: number;
  size: number;
  driftX: number;
  driftY: number;
  rotate: number;
  variant: number;
};

const trailBackgrounds = [
  "radial-gradient(circle at 32% 30%, color-mix(in oklab, white 54%, var(--color-hotpink) 46%) 0 13%, transparent 33%), radial-gradient(circle at 66% 64%, color-mix(in oklab, var(--color-teal) 55%, transparent) 0 32%, transparent 64%), radial-gradient(circle, color-mix(in oklab, var(--color-hotpink) 62%, transparent) 0 48%, transparent 78%)",
  "radial-gradient(circle at 34% 32%, color-mix(in oklab, white 48%, var(--color-violet) 52%) 0 13%, transparent 34%), radial-gradient(circle at 66% 70%, color-mix(in oklab, var(--color-hotpink) 52%, transparent) 0 32%, transparent 64%), radial-gradient(circle, color-mix(in oklab, var(--color-violet) 60%, transparent) 0 48%, transparent 78%)",
  "radial-gradient(circle at 34% 32%, color-mix(in oklab, white 50%, var(--color-teal) 50%) 0 13%, transparent 34%), radial-gradient(circle at 68% 68%, color-mix(in oklab, var(--color-violet) 52%, transparent) 0 32%, transparent 64%), radial-gradient(circle, color-mix(in oklab, var(--color-teal) 58%, transparent) 0 48%, transparent 78%)",
];

export default function Cursor() {
  const [visible, setVisible] = useState(false);
  const [pressed, setPressed] = useState(false);
  const [trail, setTrail] = useState<TrailDot[]>([]);
  const cursorX = useMotionValue(0);
  const cursorY = useMotionValue(0);
  const ringX = useSpring(cursorX, { stiffness: 780, damping: 42, mass: 0.18 });
  const ringY = useSpring(cursorY, { stiffness: 780, damping: 42, mass: 0.18 });
  const trailTimeouts = useRef<number[]>([]);
  const lastTrailAt = useRef(0);
  const nextTrailId = useRef(0);

  useEffect(() => {
    const addTrailDot = (x: number, y: number) => {
      const now = performance.now();
      if (now - lastTrailAt.current < 34) return;

      lastTrailAt.current = now;
      const id = nextTrailId.current++;
      const direction = id % 2 === 0 ? 1 : -1;
      const wave = Math.sin(id * 1.7);
      const dot = {
        id,
        x: x - wave * 5,
        y: y + Math.cos(id * 1.1) * 4,
        size: 10 + (id % 5) * 2,
        driftX: wave * 18 + direction * 5,
        driftY: -10 - (id % 5) * 3,
        rotate: direction * (16 + (id % 4) * 14),
        variant: id % trailBackgrounds.length,
      };

      setTrail((current) => [...current.slice(-9), dot]);

      const timeout = window.setTimeout(() => {
        setTrail((current) => current.filter((item) => item.id !== id));
        trailTimeouts.current = trailTimeouts.current.filter((item) => item !== timeout);
      }, 950);
      trailTimeouts.current.push(timeout);
    };

    const move = (event: MouseEvent) => {
      cursorX.set(event.clientX);
      cursorY.set(event.clientY);
      setVisible(true);
      addTrailDot(event.clientX, event.clientY);
    };

    const leave = () => {
      setVisible(false);
      setTrail([]);
    };

    const down = () => setPressed(true);
    const up = () => setPressed(false);

    document.addEventListener("mousemove", move);
    document.addEventListener("mouseleave", leave);
    document.addEventListener("mousedown", down);
    document.addEventListener("mouseup", up);

    return () => {
      document.removeEventListener("mousemove", move);
      document.removeEventListener("mouseleave", leave);
      document.removeEventListener("mousedown", down);
      document.removeEventListener("mouseup", up);
      trailTimeouts.current.forEach((timeout) => window.clearTimeout(timeout));
    };
  }, [cursorX, cursorY]);

  return (
    <>
      {trail.map((dot) => (
        <motion.div
          key={dot.id}
          className="pointer-events-none fixed left-0 top-0 rounded-full blur-sm"
          style={{
            x: dot.x,
            y: dot.y,
            zIndex: 9998,
            width: dot.size,
            height: dot.size,
            translateX: "-50%",
            translateY: "-50%",
            background: trailBackgrounds[dot.variant],
            boxShadow:
              "0 0 18px color-mix(in oklab, var(--color-hotpink) 42%, transparent), 0 0 34px color-mix(in oklab, var(--color-violet) 30%, transparent), 0 0 52px color-mix(in oklab, var(--color-teal) 24%, transparent)",
          }}
          initial={{ opacity: 0.66, scale: 0.42, rotate: 0 }}
          animate={{
            opacity: 0,
            scale: 2.65,
            x: dot.x + dot.driftX,
            y: dot.y + dot.driftY,
            rotate: dot.rotate,
          }}
          transition={{ duration: 0.95, ease: [0.16, 1, 0.3, 1] }}
        />
      ))}

      <motion.div
        className="pointer-events-none fixed left-0 top-0 h-4 w-4 rounded-full"
        style={{
          x: ringX,
          y: ringY,
          zIndex: 9999,
          translateX: "-50%",
          translateY: "-50%",
          background: "conic-gradient(from 180deg, var(--color-hotpink), var(--color-violet), var(--color-teal), var(--color-hotpink))",
          boxShadow:
            "0 0 0 1px color-mix(in oklab, var(--color-hotpink) 34%, transparent), 0 0 14px color-mix(in oklab, var(--color-hotpink) 42%, transparent), 0 0 26px color-mix(in oklab, var(--color-teal) 26%, transparent), 0 0 38px color-mix(in oklab, var(--color-violet) 18%, transparent)",
        }}
        animate={{
          opacity: visible ? 1 : 0,
          scale: visible ? (pressed ? 0.72 : 1) : 0.45,
          rotate: pressed ? 135 : 0,
        }}
        transition={{ type: "spring", stiffness: 540, damping: 34, mass: 0.32 }}
      >
        <span
          className="absolute inset-[2px] rounded-full border border-white/45 backdrop-blur-md"
          style={{ background: "color-mix(in oklab, var(--background) 78%, transparent)" }}
        />
        <span
          className="absolute inset-[5px] rounded-full"
          style={{
            background:
              "radial-gradient(circle, color-mix(in oklab, white 82%, var(--color-teal) 18%) 0 32%, var(--color-hotpink) 33% 58%, var(--color-violet) 59% 100%)",
            boxShadow:
              "0 0 8px color-mix(in oklab, var(--color-hotpink) 48%, transparent), 0 0 16px color-mix(in oklab, var(--color-violet) 34%, transparent)",
          }}
        />
      </motion.div>

      <motion.div
        className="pointer-events-none fixed left-0 top-0 h-1 w-1 rounded-full"
        style={{
          x: cursorX,
          y: cursorY,
          zIndex: 10000,
          translateX: "-50%",
          translateY: "-50%",
          background: "var(--color-hotpink)",
          boxShadow: "0 0 8px color-mix(in oklab, var(--color-hotpink) 64%, transparent), 0 0 14px color-mix(in oklab, var(--color-teal) 36%, transparent)",
        }}
        animate={{ opacity: visible ? 1 : 0, scale: pressed ? 1.55 : 1 }}
        transition={{ type: "spring", stiffness: 700, damping: 28, mass: 0.18 }}
      />
    </>
  );
}