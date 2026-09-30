"use client";

import { useId } from "react";
import { motion, useReducedMotion } from "motion/react";

const stride = 1.12;
const stepTimes = [0, 0.22, 0.48, 0.72, 1];
const breastFeathers = [
  [113, 154, -17], [137, 147, -9], [158, 158, 7],
  [91, 174, -25], [119, 178, -12], [146, 181, 3], [170, 181, 13],
  [88, 201, -23], [114, 204, -13], [140, 207, 0], [165, 209, 12],
  [100, 228, -16], [125, 230, -6], [150, 232, 7], [174, 232, 16],
];

/** A resolution-independent replica of Dukie, with a coordinated two-foot walk. */
export default function WalkingDuck() {
  const id = useId().replace(/:/g, "");
  const reducedMotion = useReducedMotion();
  const fill = (name: string) => `url(#${id}-${name})`;
  const cycle = { duration: stride, times: stepTimes, repeat: Infinity, ease: "easeInOut" as const };

  return (
    <svg
      viewBox="0 0 320 350"
      role="img"
      aria-label="Dukie, a soft pink duck with orange webbed feet, walking along Motso's timeline"
      className="block h-auto w-full overflow-visible"
    >
      <defs>
        <radialGradient id={`${id}-body`} cx="28%" cy="27%" r="78%">
          <stop stopColor="#fff1e9" />
          <stop offset=".36" stopColor="#fbc2ce" />
          <stop offset=".72" stopColor="#ef91b0" />
          <stop offset="1" stopColor="#c85988" />
        </radialGradient>
        <radialGradient id={`${id}-head`} cx="29%" cy="24%" r="82%">
          <stop stopColor="#fff0ed" />
          <stop offset=".42" stopColor="#ffc9d3" />
          <stop offset=".79" stopColor="#ec94b0" />
          <stop offset="1" stopColor="#cd648e" />
        </radialGradient>
        <linearGradient id={`${id}-wing`} x1="0" y1="0" x2="1" y2="1">
          <stop stopColor="#ffdce3" />
          <stop offset=".5" stopColor="#f9b3ca" />
          <stop offset="1" stopColor="#d6749d" />
        </linearGradient>
        <linearGradient id={`${id}-feather`} x1="0" y1="0" x2="1" y2="1">
          <stop stopColor="#fff1e9" stopOpacity=".85" />
          <stop offset="1" stopColor="#ed8fad" stopOpacity=".3" />
        </linearGradient>
        <linearGradient id={`${id}-foot`} x1="0" y1="0" x2=".7" y2="1">
          <stop stopColor="#ffcf66" />
          <stop offset=".42" stopColor="#ffa62e" />
          <stop offset="1" stopColor="#e57516" />
        </linearGradient>
        <linearGradient id={`${id}-leg`} x1="0" y1="0" x2="1" y2="0">
          <stop stopColor="#ca6414" />
          <stop offset=".48" stopColor="#ffb445" />
          <stop offset="1" stopColor="#dc7b1b" />
        </linearGradient>
        <radialGradient id={`${id}-bill`} cx="32%" cy="22%" r="85%">
          <stop stopColor="#ffdc77" />
          <stop offset=".4" stopColor="#ffb42d" />
          <stop offset="1" stopColor="#d67415" />
        </radialGradient>
        <radialGradient id={`${id}-eye`} cx="32%" cy="24%" r="80%">
          <stop stopColor="#574135" />
          <stop offset=".5" stopColor="#271b23" />
          <stop offset="1" stopColor="#100e18" />
        </radialGradient>
        <radialGradient id={`${id}-shadow`}>
          <stop stopColor="#a43c70" stopOpacity=".3" />
          <stop offset="1" stopColor="#a43c70" stopOpacity="0" />
        </radialGradient>
      </defs>

      <motion.ellipse
        cx="166" cy="329" rx="83" ry="12" fill={fill("shadow")}
        animate={reducedMotion ? undefined : { scaleX: [1, .88, 1, .88, 1], opacity: [.85, .6, .85, .6, .85] }}
        transition={cycle} style={{ transformOrigin: "166px 329px" }}
      />

      {/* Far foot swings forward as the near foot rolls onto its toes. */}
      <g transform="translate(195 254)">
        <motion.g
          animate={reducedMotion ? undefined : { rotate: [20, 3, -18, 4, 20], y: [-7, 0, 0, -10, -7] }}
          transition={cycle} style={{ transformOrigin: "0px 0px" }}
        >
          <path d="M-7-4C-10 12-8 25-12 41L3 44C9 27 10 13 7-3Z" fill={fill("leg")} />
          <path d="M-7 27L5 29M-8 33L4 35" stroke="#b96217" strokeOpacity=".4" strokeWidth="1.8" />
          <g transform="translate(-3 42)">
            <motion.g
              animate={reducedMotion ? undefined : { rotate: [-22, 0, 14, -18, -22] }}
              transition={cycle} style={{ transformOrigin: "0px 0px" }}
            >
              <path d="M-5-5C-14 2-33 8-49 23Q-35 20-23 24L-8 33Q0 25 13 28L30 26C18 17 8 5 5-3Z" fill={fill("foot")} stroke="#c76517" strokeWidth="1.6" strokeLinejoin="round" />
              <path d="M-1 1L-8 30M-4 3L-23 22M2 3L24 24" stroke="#de7d20" strokeWidth="2.4" strokeLinecap="round" />
              <path d="M-11 9L-38 20M7 10L20 20" stroke="#ffdc8b" strokeWidth="2" strokeLinecap="round" opacity=".7" />
            </motion.g>
          </g>
        </motion.g>
      </g>

      <g transform="translate(133 255)">
        <motion.g
          animate={reducedMotion ? undefined : { rotate: [-18, 4, 20, 3, -18], y: [0, -10, -7, 0, 0] }}
          transition={cycle} style={{ transformOrigin: "0px 0px" }}
        >
          <path d="M-7-4C-9 12-7 26-11 42L4 45C9 29 10 13 7-4Z" fill={fill("leg")} />
          <path d="M-7 26L6 28M-8 33L5 35" stroke="#c0701e" strokeWidth="1.8" strokeOpacity=".5" />
          <g transform="translate(-3 44)">
            <motion.g
              animate={reducedMotion ? undefined : { rotate: [14, -18, -22, 0, 14] }}
              transition={cycle} style={{ transformOrigin: "0px 0px" }}
            >
              <path d="M-5-5C-16 2-37 10-56 24Q-40 22-27 27L-10 37Q1 27 14 31L34 28C21 18 9 5 5-3Z" fill={fill("foot")} stroke="#d5781e" strokeWidth="1.6" strokeLinejoin="round" />
              <path d="M-1 1L-10 34M-4 4L-26 25M3 4L28 26" stroke="#df8524" strokeWidth="2.7" strokeLinecap="round" />
              <path d="M-13 10L-42 22M8 11L22 22" stroke="#ffe6a3" strokeWidth="2" strokeLinecap="round" opacity=".8" />
            </motion.g>
          </g>
        </motion.g>
      </g>

      <motion.g
        animate={reducedMotion ? undefined : { y: [0, -3.5, 0, -3.5, 0], rotate: [.5, -1, .5, 1, .5] }}
        transition={cycle} style={{ transformOrigin: "166px 226px" }}
      >
        {/* Raised feathered tail, soft belly, and layered wing. */}
        <path d="M232 172Q266 141 280 132Q282 147 272 158Q292 145 296 150Q289 168 276 175Q287 170 287 180Q270 198 243 203Z" fill={fill("wing")} stroke="#e594b2" strokeWidth="1.5" />
        <path d="M244 180Q268 164 279 146M252 188Q275 173 283 159" stroke="#ffe3e8" strokeWidth="2" fill="none" opacity=".8" />
        <path d="M126 125C98 135 77 157 75 187C70 231 101 268 150 275C201 282 251 257 262 217C275 172 243 141 202 135C176 130 150 133 126 125Z" fill={fill("body")} />
        <path d="M98 185C82 217 104 254 145 264" fill="none" stroke="#ffece2" strokeWidth="7" strokeLinecap="round" opacity=".2" />
        {breastFeathers.map(([x, y, angle]) => (
          <g key={`${x}-${y}`} transform={`translate(${x} ${y}) rotate(${angle})`}>
            <path d="M0-8Q-9 0-5 12Q0 7 2 16Q9 5 3-8Z" fill={fill("feather")} />
            <path d="M0-5Q-2 2 0 10" fill="none" stroke="#fff0e6" strokeWidth="1.5" strokeLinecap="round" opacity=".5" />
          </g>
        ))}
        <motion.g
          animate={reducedMotion ? undefined : { rotate: [0, -4, 0, 3, 0] }}
          transition={cycle} style={{ transformOrigin: "206px 157px" }}
        >
          <path d="M210 151C239 156 254 186 247 220Q243 231 232 232Q235 241 225 242Q230 251 218 250C197 239 183 218 185 190C185 171 195 154 210 151Z" fill="#ba557e" opacity=".14" transform="translate(2 4)" />
          <path d="M210 151C239 156 254 186 247 220Q243 231 232 232Q235 241 225 242Q230 251 218 250C197 239 183 218 185 190C185 171 195 154 210 151Z" fill={fill("wing")} />
          <path d="M204 169Q195 198 222 232M214 169Q207 198 234 226M224 174Q220 197 243 217" fill="none" stroke="#fff0ee" strokeWidth="3" strokeLinecap="round" opacity=".6" />
          <path d="M205 178Q201 198 215 213M215 180Q213 197 228 212" fill="none" stroke="#d986a6" strokeWidth="1.4" strokeLinecap="round" opacity=".7" />
        </motion.g>

        <motion.g
          animate={reducedMotion ? undefined : { rotate: [0, 1.4, 0, -1, 0] }}
          transition={cycle} style={{ transformOrigin: "154px 142px" }}
        >
          <path d="M121 94C105 115 107 145 124 164C143 178 171 174 184 153L169 90Z" fill={fill("body")} />
          <path d="M116 120Q119 149 138 159M129 120Q130 142 144 152" fill="none" stroke="#ffede7" strokeWidth="2.5" strokeLinecap="round" opacity=".6" />
          <path d="M101 69C100 40 119 20 149 21C183 20 202 44 200 74C202 101 183 126 158 132C132 138 110 123 104 102C96 89 99 80 101 69Z" fill={fill("head")} />
          <path d="M117 37Q129 23 153 27" fill="none" stroke="#fff3ee" strokeWidth="4" strokeLinecap="round" opacity=".5" />
          <path d="M142 23Q146 9 153 15Q156 5 161 19" fill={fill("head")} />
          <ellipse cx="122" cy="100" rx="17" ry="11" fill="#fca4b8" opacity=".48" />
          <path d="M115 61Q128 52 138 61" fill="none" stroke="#d67c99" strokeWidth="3" strokeLinecap="round" opacity=".55" />
          <motion.g
            animate={reducedMotion ? undefined : { scaleY: [1, 1, .08, 1, 1] }}
            transition={{ duration: 4.6, times: [0, .87, .9, .93, 1], repeat: Infinity }}
            style={{ transformOrigin: "125px 72px" }}
          >
            <ellipse cx="125" cy="72" rx="8.5" ry="10.5" fill={fill("eye")} />
            <ellipse cx="121.7" cy="67.4" rx="2.7" ry="3.3" fill="#fff9ed" />
            <circle cx="128" cy="77" r="1.4" fill="#ffc6da" opacity=".65" />
          </motion.g>
          <path d="M105 80C101 87 94 96 81 103L58 117Q53 123 62 129C75 136 96 127 111 118Q126 108 118 100C111 95 111 88 105 80Z" fill={fill("bill")} stroke="#d58325" strokeWidth="1.5" />
          <path d="M61 126Q83 131 108 116" fill="none" stroke="#a25a17" strokeWidth="2" strokeLinecap="round" opacity=".7" />
          <path d="M67 116Q86 110 96 99" fill="none" stroke="#ffe19c" strokeWidth="3" strokeLinecap="round" opacity=".75" />
          <ellipse cx="102" cy="102" rx="2.5" ry="1.8" transform="rotate(-25 102 102)" fill="#9a571b" />
        </motion.g>
      </motion.g>
    </svg>
  );
}
