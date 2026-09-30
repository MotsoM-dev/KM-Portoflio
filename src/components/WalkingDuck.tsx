"use client";

import { useId } from "react";
import { motion, useReducedMotion } from "motion/react";

const times = [0, 0.25, 0.5, 0.75, 1];

/** Compact, friendly Dukie with a soft duckling silhouette and visible foot flap. */
export default function WalkingDuck() {
  const id = useId().replace(/:/g, "");
  const reducedMotion = useReducedMotion();
  const fill = (name: string) => `url(#${id}-${name})`;
  const cycle = { duration: 1.18, times, repeat: Infinity, ease: "easeInOut" as const };

  return (
    <svg viewBox="0 0 240 270" role="img" aria-label="Dukie, a tiny pink baby duck with rosy cheeks and flapping golden feet, walking along Motso's timeline" className="block h-auto w-full overflow-visible">
      <defs>
        <radialGradient id={`${id}-pink`} cx="30%" cy="20%" r="85%"><stop stopColor="#fff1f6" /><stop offset=".42" stopColor="#ffcddd" /><stop offset=".8" stopColor="#f49cbe" /><stop offset="1" stopColor="#d96f9e" /></radialGradient>
        <radialGradient id={`${id}-body`} cx="28%" cy="20%" r="85%"><stop stopColor="#ffe7f1" /><stop offset=".55" stopColor="#fbb4d0" /><stop offset="1" stopColor="#de78a4" /></radialGradient>
        <linearGradient id={`${id}-wing`} x1="0" y1="0" x2="1" y2="1"><stop stopColor="#ffdeea" /><stop offset="1" stopColor="#e98ab2" /></linearGradient>
        <radialGradient id={`${id}-blush`}><stop stopColor="#f36c9d" stopOpacity=".85" /><stop offset="1" stopColor="#f36c9d" stopOpacity="0" /></radialGradient>
        <radialGradient id={`${id}-eye`} cx="35%" cy="25%" r="80%"><stop stopColor="#70505e" /><stop offset=".55" stopColor="#342330" /><stop offset="1" stopColor="#201621" /></radialGradient>
        <linearGradient id={`${id}-gold`} x1="0" y1="0" x2=".4" y2="1"><stop stopColor="#ffe39a" /><stop offset=".5" stopColor="#ffbd57" /><stop offset="1" stopColor="#e99330" /></linearGradient>
        <radialGradient id={`${id}-shadow`}><stop stopColor="#a95180" stopOpacity=".25" /><stop offset="1" stopColor="#a95180" stopOpacity="0" /></radialGradient>
      </defs>
      <motion.ellipse cx="120" cy="255" rx="55" ry="9" fill={fill("shadow")} animate={reducedMotion ? undefined : { scaleX: [1, .84, 1, .84, 1] }} transition={cycle} style={{ transformOrigin: "120px 255px" }} />
      <g transform="translate(145 215)">
        <motion.g animate={reducedMotion ? undefined : { rotate: [18, 0, -16, 0, 18], y: [-4, 0, 0, -7, -4] }} transition={cycle} style={{ transformOrigin: "0 0" }}>
          <path d="M-5-3Q-8 9-5 20H5Q8 9 5-3Z" fill={fill("gold")} />
          <motion.path d="M-3 15Q-20 5-31 14Q-34 20-24 20L-13 18Q-8 26 0 21L8 18Q20 21 23 14Q18 7 4 4Z" fill={fill("gold")} stroke="#d99041" strokeWidth="1.5" strokeLinejoin="round" animate={reducedMotion ? undefined : { rotate: [-24, 0, 15, -16, -24] }} transition={cycle} style={{ transformOrigin: "0 0" }} />
        </motion.g>
      </g>
      <g transform="translate(95 216)">
        <motion.g animate={reducedMotion ? undefined : { rotate: [-16, 0, 18, 0, -16], y: [0, -7, -4, 0, 0] }} transition={cycle} style={{ transformOrigin: "0 0" }}>
          <path d="M-5-3Q-8 9-5 20H5Q8 9 5-3Z" fill={fill("gold")} />
          <motion.path d="M-3 15Q-23 5-34 15Q-36 21-26 21L-14 18Q-9 27-1 22L8 18Q21 21 24 14Q18 7 4 4Z" fill={fill("gold")} stroke="#d99041" strokeWidth="1.5" strokeLinejoin="round" animate={reducedMotion ? undefined : { rotate: [15, -16, -24, 0, 15] }} transition={cycle} style={{ transformOrigin: "0 0" }} />
        </motion.g>
      </g>
      <motion.g animate={reducedMotion ? undefined : { y: [0, -2.5, 0, -2.5, 0], rotate: [-1.5, 1.5, -1.5, 1.5, -1.5] }} transition={cycle} style={{ transformOrigin: "120px 215px" }}>
        <path d="M168 163Q184 145 198 151Q195 161 189 167Q207 158 210 167Q204 183 180 187Z" fill={fill("wing")} />
        <path d="M85 134C59 136 48 156 51 183C54 215 83 231 121 231C160 230 184 211 185 184C187 159 166 143 143 138Z" fill={fill("body")} />
        <path d="M69 175Q62 203 97 216" fill="none" stroke="#fff0f6" strokeWidth="8" strokeLinecap="round" opacity=".55" />
        <motion.path d="M144 164C158 158 176 167 176 182C176 197 164 210 155 206Q145 204 137 192C130 181 134 170 144 164Z" fill={fill("wing")} animate={reducedMotion ? undefined : { rotate: [0, -5, 0, 4, 0] }} transition={cycle} style={{ transformOrigin: "148px 164px" }} />
        <motion.g animate={reducedMotion ? undefined : { rotate: [-1, 1.5, -1, 1.5, -1] }} transition={cycle} style={{ transformOrigin: "108px 138px" }}>
          <path d="M39 86C37 51 58 25 92 23C132 18 161 40 169 74C177 107 160 133 131 146C99 158 59 145 45 120C41 109 38 98 39 86Z" fill={fill("pink")} />
          <path d="M87 26Q78 15 88 13Q95 12 99 23Q98 6 109 10Q116 13 113 25" fill={fill("pink")} />
          <path d="M57 57Q65 38 85 34" fill="none" stroke="#fff7fb" strokeWidth="6" strokeLinecap="round" opacity=".75" />
          <ellipse cx="59" cy="111" rx="16" ry="12" fill={fill("blush")} /><ellipse cx="133" cy="109" rx="18" ry="13" fill={fill("blush")} />
          <motion.g animate={reducedMotion ? undefined : { scaleY: [1, 1, .08, 1, 1] }} transition={{ duration: 5.2, times: [0, .93, .95, .97, 1], repeat: Infinity }} style={{ transformOrigin: "93px 91px" }}>
            <ellipse cx="73" cy="91" rx="10" ry="13.5" fill={fill("eye")} /><ellipse cx="109" cy="89" rx="12.5" ry="15.5" fill={fill("eye")} />
            <ellipse cx="70" cy="86" rx="3" ry="4" fill="#fffafd" /><ellipse cx="105" cy="83" rx="4" ry="5" fill="#fffafd" />
          </motion.g>
          <path d="M80 108C87 103 100 102 111 107C116 110 117 117 112 121C103 127 82 126 76 121C71 117 74 112 80 108Z" fill={fill("gold")} stroke="#e1a04a" strokeWidth="1.5" />
          <path d="M79 119Q91 123 108 117" fill="none" stroke="#b87933" strokeWidth="2" strokeLinecap="round" />
        </motion.g>
      </motion.g>
    </svg>
  );
}
