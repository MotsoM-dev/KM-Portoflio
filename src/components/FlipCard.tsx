import { useState } from "react";
import { motion } from "motion/react";

interface FlipCardProps {
  icon: React.ElementType;
  label: string;
  value: string;
  detail?: string;
}

export default function FlipCard({ icon: Icon, label, value, detail }: FlipCardProps) {
  const [flipped, setFlipped] = useState(false);

  return (
    <motion.div
      className="relative h-52 w-full cursor-pointer perspective-midrange group"
      onClick={() => setFlipped(!flipped)}
      whileHover={{ scale: 1.03 }}
      whileTap={{ scale: 0.97 }}
    >
      {/* Animated gradient border on hover */}
      <div className="absolute -inset-[1px] rounded-2xl bg-gradient-to-r from-hotpink via-violet to-teal opacity-0 blur-sm transition-opacity duration-300 group-hover:opacity-60" />

      <motion.div
        className="relative h-full w-full rounded-2xl transition-all duration-500"
        style={{ transformStyle: "preserve-3d" }}
        animate={{ rotateY: flipped ? 180 : 0 }}
      >
        {/* Front */}
        <div className="glass card-shadow absolute inset-0 flex flex-col items-center justify-center gap-4 rounded-2xl border border-border p-4 backface-hidden">
          <motion.div
            className="gradient-pink-bg grid h-16 w-16 place-items-center rounded-2xl text-white shadow-lg"
            whileHover={{ scale: 1.1 }}
            transition={{ type: "spring", stiffness: 300 }}
          >
            <Icon className="h-8 w-8" />
          </motion.div>
          <span className="text-sm font-semibold uppercase tracking-widest text-foreground text-center">
            {label}
          </span>
        </div>

        {/* Back */}
        <div
          className="glass absolute inset-0 flex flex-col items-center justify-center gap-3 rounded-2xl border border-border p-4 text-center backface-hidden"
          style={{ transform: "rotateY(180deg)" }}
        >
          <div className="text-2xl font-bold gradient-text">{value}</div>
          {detail && <p className="text-xs text-muted-foreground px-2">{detail}</p>}
          <div className="mt-2 h-1 w-16 rounded-full bg-gradient-to-r from-hotpink to-violet" />
          <span className="mt-1 text-xs text-muted-foreground">(tap to flip back)</span>
        </div>
      </motion.div>
    </motion.div>
  );
}