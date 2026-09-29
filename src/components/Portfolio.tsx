"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState, type ReactNode } from "react";
import { motion, useInView, useMotionValue, useScroll, useSpring, useTransform } from "motion/react";
import {
  ArrowRight,
  Award,
  Briefcase,
  ChevronDown,
  ChevronUp,
  Code2,
  Database,
  Download,
  FileText,
  Github,
  GitBranch,
  GraduationCap,
  Linkedin,
  Mail,
  MapPin,
  Menu,
  Moon,
  Palette,
  Phone,
  Smartphone,
  Sparkles,
  Sun,
  Trophy,
  X,
} from "lucide-react";
import { useTheme } from "../hooks/use-theme";
import Blog from "./Blog";
import Cursor from "./Cursor";
import FlipCard from "./FlipCard";
import MovingBackground from "./MovingBackground";
import Particles from "./Particles";

const words = ["delightful", "accessible", "performant", "beautiful"];
const emailAddress = "kgomotsomathombo@gmail.com";
const phoneNumber = "071 642 3985";
const phoneClipboardValue = "+27716423985";
const gmailComposeUrl = `https://mail.google.com/mail/?view=cm&fs=1&to=${emailAddress}`;

type PageKey = "home" | "about" | "skills" | "experience" | "projects" | "blog" | "contact";

const navItems: Array<{ href: string; label: string; page: PageKey }> = [
  { href: "/about", label: "About", page: "about" },
  { href: "/skills", label: "Skills", page: "skills" },
  { href: "/experience", label: "Experience", page: "experience" },
  { href: "/projects", label: "Projects", page: "projects" },
  { href: "/blog", label: "Blog", page: "blog" },
];

function useTypewriter(words: string[], typingSpeed = 100, deletingSpeed = 50, pauseTime = 2000) {
  const [index, setIndex] = useState(0);
  const [charIndex, setCharIndex] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    const currentWord = words[index];
    let timeout: number;
    if (!isDeleting && charIndex < currentWord.length) {
      timeout = window.setTimeout(() => setCharIndex((c) => c + 1), typingSpeed);
    } else if (!isDeleting && charIndex === currentWord.length) {
      timeout = window.setTimeout(() => setIsDeleting(true), pauseTime);
    } else if (isDeleting && charIndex > 0) {
      timeout = window.setTimeout(() => setCharIndex((c) => c - 1), deletingSpeed);
    } else if (isDeleting && charIndex === 0) {
      setIsDeleting(false);
      setIndex((prev) => (prev + 1) % words.length);
    }
    return () => clearTimeout(timeout);
  }, [charIndex, deletingSpeed, index, isDeleting, pauseTime, typingSpeed, words]);

  return words[index].substring(0, charIndex);
}

function Reveal({ children, delay = 0 }: { children: ReactNode; delay?: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 26 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, delay, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.div>
  );
}

function ParallaxBlob({ className }: { className: string }) {
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const [viewport, setViewport] = useState({ width: 1, height: 1 });

  useEffect(() => {
    const updateViewport = () => {
      setViewport({
        width: Math.max(window.innerWidth, 1),
        height: Math.max(window.innerHeight, 1),
      });
    };
    const move = (event: MouseEvent) => {
      mouseX.set(event.clientX);
      mouseY.set(event.clientY);
    };

    updateViewport();
    window.addEventListener("resize", updateViewport);
    window.addEventListener("mousemove", move);
    return () => {
      window.removeEventListener("resize", updateViewport);
      window.removeEventListener("mousemove", move);
    };
  }, [mouseX, mouseY]);

  const x = useTransform(mouseX, [0, viewport.width], [-30, 30]);
  const y = useTransform(mouseY, [0, viewport.height], [-20, 20]);
  return <motion.div className={`animate-blob absolute rounded-full blur-3xl ${className}`} style={{ x, y }} />;
}

const particles = [
  { left: "7%", width: "5px", height: "5px", animationDelay: "0.2s", animationDuration: "8s" },
  { left: "16%", width: "9px", height: "9px", animationDelay: "1.6s", animationDuration: "12s" },
  { left: "24%", width: "6px", height: "6px", animationDelay: "3.1s", animationDuration: "10s" },
  { left: "33%", width: "10px", height: "10px", animationDelay: "0.8s", animationDuration: "14s" },
  { left: "42%", width: "7px", height: "7px", animationDelay: "4.3s", animationDuration: "9s" },
  { left: "51%", width: "11px", height: "11px", animationDelay: "2.4s", animationDuration: "15s" },
  { left: "59%", width: "6px", height: "6px", animationDelay: "5.2s", animationDuration: "11s" },
  { left: "68%", width: "8px", height: "8px", animationDelay: "1.1s", animationDuration: "13s" },
  { left: "76%", width: "5px", height: "5px", animationDelay: "6.4s", animationDuration: "10s" },
  { left: "84%", width: "9px", height: "9px", animationDelay: "3.7s", animationDuration: "16s" },
  { left: "91%", width: "7px", height: "7px", animationDelay: "2.9s", animationDuration: "12s" },
  { left: "97%", width: "10px", height: "10px", animationDelay: "7.1s", animationDuration: "14s" },
];

function FloatingParticles() {
  return (
    <div className="pointer-events-none fixed inset-0 -z-5 overflow-hidden">
      {particles.map((particle, i) => (
        <div
          key={i}
          className="animate-particle absolute rounded-full bg-white/10 dark:bg-white/5"
          style={{ ...particle, bottom: "-10px" }}
        />
      ))}
    </div>
  );
}

const skills = [
  { icon: Code2, title: "Frontend", items: ["HTML5", "CSS3", "JavaScript", "React", "Next.js"] },
  { icon: Smartphone, title: "Mobile", items: ["React Native", "NativeWind", "Xamarin", "Cross-platform", "Mobile UI/UX"] },
  { icon: Palette, title: "Design", items: ["Figma", "Wireframes", "Prototypes", "UX Writing", "Usability Testing"] },
  { icon: Database, title: "Data & Backend", items: ["Python", "FastAPI", "Supabase", "Neon", "MSSQL", "SQL", "REST/JSON", "C#/.NET basics"] },
  { icon: GitBranch, title: "Tooling", items: ["Git", "GitHub", "Agile", "Tailwind CSS", "Bootstrap"] },
  { icon: Sparkles, title: "Soft skills", items: ["Tutoring", "Documentation", "Collaboration", "Problem solving"] },
];

const experience = [
  {
    role: "Frontend & Mobile App Developer",
    org: "Appimate",
    period: "2025 - Present",
    theme: "Product delivery",
    accent: "gradient-hero-bg",
    logo: "/company-logos/appimate.png",
    points: [
      "Design and develop responsive web applications and cross-platform mobile apps.",
      "Turn UI/UX concepts into scalable, production-ready frontend experiences.",
      "Collaborate with designers and backend developers in agile delivery workflows.",
      "Improve application quality through reviews, debugging, and usability-focused iteration.",
    ],
    details: [
      "As a Frontend and Mobile App Developer, I contribute to the design and development of responsive web and cross-platform mobile applications that prioritize performance, usability, and clean user experiences. Working closely with designers and backend developers, I transform UI/UX concepts into scalable, production-ready applications using modern frontend technologies.",
      "My role extends beyond writing code. I actively participate in agile development processes, collaborate during code reviews, troubleshoot technical challenges, and continuously seek opportunities to improve application quality and user satisfaction. This experience has strengthened my ability to work in fast-paced development environments while maintaining high standards of code quality and teamwork.",
    ],
  },
  {
    role: "Administration Support",
    org: "iLitha Gaming",
    period: "2026",
    theme: "Operations",
    accent: "gradient-cool-bg",
    logo: "/company-logos/ilitha.png",
    points: [
      "Managed registration workflows for players, participants, and gaming activities.",
      "Handled day-to-day administration for a growing gaming company.",
      "Kept records organized so events, onboarding, and internal operations could run smoothly.",
      "Supported communication and coordination between the business and its community.",
    ],
    details: [
      "At iLitha Gaming, I supported the administrative side of the company by managing registrations, organizing records, and helping keep operational processes clear and reliable. The work strengthened my attention to detail, communication, and ability to support a fast-moving entertainment and gaming environment.",
      "This role gave me practical experience in business administration, user onboarding, and the behind-the-scenes systems that help a company serve its community consistently.",
    ],
  },
  {
    role: "Systems Development Learner",
    org: "MICTSETA Learnership",
    period: "2025 - Present",
    theme: "Structured learning",
    accent: "gradient-pink-bg",
    logo: "/company-logos/mict-seta.jpg",
    points: [
      "Combine academic knowledge with practical software engineering experience.",
      "Develop deeper understanding of SDLC, programming principles, and systems analysis.",
      "Strengthen database design, application development, and debugging skills.",
      "Build professional habits around collaboration, adaptability, and continuous learning.",
    ],
    details: [
      "Through the MICTSETA Systems Development Learnership, I combine academic knowledge with practical software engineering experience in a structured industry environment. The programme has deepened my understanding of the software development lifecycle, programming principles, systems analysis, database design, and application development.",
      "Working on real-world projects has strengthened my analytical thinking, debugging skills, and ability to design reliable software solutions. The learnership has also reinforced the importance of collaboration, adaptability, continuous learning, and professional development within modern technology teams.",
    ],
  },
  {
    role: "Information Systems Tutor",
    org: "University of Fort Hare",
    period: "2024 - Present",
    theme: "Teaching",
    accent: "gradient-cool-bg",
    logo: "/company-logos/ufh.png",
    points: [
      "Support undergraduate students across Information Systems modules.",
      "Simplify technical concepts into practical, easy-to-understand explanations.",
      "Mentor students through assignments, documentation, systems analysis, and database concepts.",
      "Build communication, leadership, mentoring, and collaborative learning skills.",
    ],
    details: [
      "As an Information Systems Tutor, I support undergraduate students in developing both technical knowledge and problem-solving confidence across a range of Information Systems modules. I simplify complex concepts into practical, easy-to-understand explanations while mentoring students through assignments, project documentation, systems analysis, database concepts, and software design principles.",
      "This experience has significantly strengthened my communication, leadership, and mentoring abilities. It has taught me how to explain technical concepts clearly to different audiences, provide constructive guidance, and foster collaborative learning, skills that translate directly into effective teamwork within software development environments.",
    ],
  },
  {
    role: "Mobile Developer & Social Media Marketing",
    org: "Techshield Connect",
    period: "2023 - 2026",
    theme: "Mobile + growth",
    accent: "gradient-hero-bg",
    logo: "/company-logos/techshield.png",
    points: [
      "Worked on mobile development tasks and product-facing digital experiences.",
      "Supported social media marketing to improve visibility and customer engagement.",
      "Balanced technical delivery with communication, content, and brand presence.",
      "Built early professional experience across both software and business growth workflows.",
    ],
    details: [
      "At Techshield Connect, I worked across mobile development and social media marketing, combining technical implementation with digital communication. The role helped me understand how product work, customer attention, and online presence connect in a real business environment.",
      "This experience shaped my ability to think beyond code: how a mobile product is presented, how users discover it, and how clear communication supports growth.",
    ],
  },
];
type ProjectCategory = "Mobile Apps" | "Websites" | "Web Apps";

const projects: Array<{
  name: string;
  tag: string;
  desc: string;
  stack: string[];
  category: ProjectCategory;
  featured?: boolean;
}> = [
  {
    name: "UCT Fintech Winter School Hackathon",
    tag: "2026 - 2nd Place Fintech Hackathon",
    desc: "Won 2nd place with a marketplace concept that helps MSMEs and funders discover each other, connect, and build funding relationships through a trusted network.",
    stack: ["React", "Mobile development", "HTML", "CSS", "JavaScript"],
    category: "Mobile Apps",
    featured: true,
  },
  {
    name: "FutureTrack",
    tag: "2025 - Web Education",
    desc: "Web platform of past papers, study resources, career exploration, and a university eligibility checker for South African Grade 10-12 learners.",
    stack: ["HTML", "JavaScript", "CSS", "C#"],
    category: "Web Apps",
  },
  {
    name: "Cortex Hub - Human Rights Hackathon",
    tag: "2025 - Civic Tech Hackathon",
    desc: "Front-end and issue submission form that lets rural schools report infrastructure issues for faster resolution.",
    stack: ["HTML", "CSS", "JavaScript"],
    category: "Websites",
  },
  {
    name: "Telkom10x - Network Support Portal",
    tag: "2025 - 2nd Place Telkom Hackathon",
    desc: "Won 2nd place for a self-service network support portal concept with an AI assistant and community forum, focused on practical front-end flows for faster troubleshooting.",
    stack: ["HTML", "CSS", "JavaScript"],
    category: "Web Apps",
  },
];

const projectCategories: Array<{
  name: ProjectCategory;
  intro: string;
  icon: typeof Code2;
  accent: string;
}> = [
  {
    name: "Mobile Apps",
    intro: "App ideas and mobile-first flows shaped for real users on the move.",
    icon: Smartphone,
    accent: "gradient-hero-bg",
  },
  {
    name: "Websites",
    intro: "Clear, purposeful web experiences with strong front-end structure.",
    icon: Palette,
    accent: "gradient-pink-bg",
  },
  {
    name: "Web Apps",
    intro: "Interactive platforms, portals, and tools built around useful workflows.",
    icon: Code2,
    accent: "gradient-cool-bg",
  },
];
const certs = ["UCT Fintech Winter School Hackathon Certificate", "Microsoft AI Fluency", "IBM Python for Data Science", "FNB App Academy - Full-Stack exposure"];

const aboutDetails = [
  { icon: MapPin, label: "Based in", value: "South Africa", detail: "Eastern Cape & Gauteng" },
  { icon: GraduationCap, label: "Studying", value: "BCom Honours", detail: "Information Systems @ UFH" },
  { icon: Briefcase, label: "Currently", value: "Appimate", detail: "Frontend & Mobile Developer" },
  { icon: Trophy, label: "Hackathon wins", value: "2x 2nd Place", detail: "UCT Fintech Winter School + Telkom Hackathon" },
];

function PageIntro({ eyebrow, title, copy }: { eyebrow: string; title: string; copy: string }) {
  return (
    <Reveal>
      <div className="mx-auto mb-10 max-w-4xl text-center md:mb-14">
        <span className="text-sm font-semibold uppercase tracking-[0.2em] text-hotpink">{eyebrow}</span>
        <h1 className="mt-3 font-display text-4xl font-bold leading-tight md:text-6xl">{title}</h1>
        <p className="mx-auto mt-4 max-w-2xl text-base leading-8 text-muted-foreground md:text-lg">{copy}</p>
      </div>
    </Reveal>
  );
}

function PageShell({ children }: { children: ReactNode }) {
  return <main className="mx-auto min-h-screen w-full max-w-7xl px-4 pb-20 pt-28 md:px-8 md:pt-32">{children}</main>;
}

function ContactRow({
  icon: Icon,
  label,
  href,
  onClick,
  actionLabel,
}: {
  icon: typeof Mail;
  label: string;
  href?: string;
  onClick?: () => void;
  actionLabel?: string;
}) {
  const className =
    "group flex items-center gap-3 rounded-lg border border-white/25 bg-black/15 px-4 py-3 text-sm font-medium text-white backdrop-blur-md transition-transform hover:scale-[1.02] hover:bg-black/20 dark:bg-white/10 dark:hover:bg-white/15";
  const content = (
    <>
      <Icon className="h-4 w-4" />
      <span className="flex-1 truncate">{label}</span>
      {onClick ? (
        <span className="rounded-full bg-white/15 px-2 py-0.5 text-xs font-semibold text-white">{actionLabel ?? "Copy"}</span>
      ) : (
        <ArrowRight className="h-4 w-4 opacity-0 transition-opacity group-hover:opacity-100" />
      )}
    </>
  );

  if (onClick) {
    return (
      <button type="button" onClick={onClick} className={`${className} w-full text-left`}>
        {content}
      </button>
    );
  }

  return (
    <a href={href} target={href?.startsWith("http") ? "_blank" : undefined} rel="noreferrer" className={className}>
      {content}
    </a>
  );
}
function Header({ theme, toggle }: { theme: "light" | "dark"; toggle: () => void }) {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  return (
    <header className="glass fixed left-0 right-0 top-0 z-40 border-b border-border backdrop-blur-xl">
      <nav className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-3 md:px-8">
        <Link href="/" className="flex items-center gap-2 font-display text-lg font-bold group">
          <span className="gradient-hero-bg grid h-10 w-10 place-items-center rounded-xl text-primary-foreground shadow-glow transition-transform group-hover:scale-105">
            K
          </span>
          <span className="bg-linear-to-r from-hotpink to-violet bg-clip-text text-transparent inline">
            MotsoM-Dev
          </span>
        </Link>

        <div className="hidden items-center rounded-full border border-border bg-background/50 p-1 text-sm font-medium md:flex">
          {navItems.map((item) => {
            const active = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`rounded-full px-4 py-2 transition-colors ${
                  active ? "gradient-hero-bg text-primary-foreground shadow-glow" : "text-muted-foreground hover:text-foreground"
                }`}
              >
                {item.label}
              </Link>
            );
          })}
        </div>

        <div className="flex items-center gap-2">
          <Link
            href="/contact"
            className="hidden rounded-full border border-border bg-card px-4 py-2 text-sm font-medium transition-colors hover:border-hotpink hover:bg-muted sm:inline-flex"
          >
            Hire me
          </Link>
          <button
            onClick={toggle}
            aria-label="Toggle theme"
            className="grid h-10 w-10 place-items-center rounded-full border border-border bg-card transition-transform hover:scale-105 hover:border-hotpink"
          >
            {theme === "dark" ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
          </button>
          <button
            type="button"
            aria-label="Open navigation menu"
            onClick={() => setMobileOpen((current) => !current)}
            className="grid h-10 w-10 place-items-center rounded-full border border-border bg-card transition-transform hover:scale-105 hover:border-hotpink md:hidden"
          >
            {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </nav>
      {mobileOpen && (
        <div className="absolute inset-x-0 top-full z-30 border-t border-border bg-card/95 px-4 py-4 shadow-2xl backdrop-blur-xl md:hidden">
          <div className="grid gap-3">
            {navItems.map((item) => {
              const active = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`rounded-2xl px-4 py-3 text-sm font-semibold transition ${
                    active ? "gradient-hero-bg text-primary-foreground shadow-glow" : "border border-border bg-background/70 text-muted-foreground hover:text-foreground"
                  }`}
                >
                  {item.label}
                </Link>
              );
            })}
            <Link
              href="/contact"
              className="rounded-2xl border border-border bg-background/80 px-4 py-3 text-sm font-semibold text-muted-foreground transition hover:text-foreground"
            >
              Hire me
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}

function HomePage() {
  const typedWord = useTypewriter(words);
  const featuredProject = projects[0];

  return (
    <main className="relative mx-auto grid h-screen max-h-screen w-full max-w-7xl overflow-hidden px-4 pb-4 pt-22 md:px-8 md:pt-24">
      <div className="pointer-events-none absolute inset-x-0 top-0 z-0 h-full overflow-hidden">
        <Particles
          particleCount={140}
          particleSpread={12}
          speed={0.08}
          particleBaseSize={120}
          moveParticlesOnHover={true}
          particleHoverFactor={1.45}
          alphaParticles={true}
          sizeRandomness={0.9}
          cameraDistance={18}
          disableRotation={true}
          pixelRatio={1}
          className="h-full w-full"
        />
      </div>
      <div className="relative z-10 grid min-h-0 items-center gap-5 lg:grid-cols-[1.08fr_0.92fr]">
        <Reveal>
          <div className="flex flex-col items-start gap-4 md:gap-5">
            <span className="glass inline-flex items-center gap-2 rounded-full border border-border px-3 py-1.5 text-[11px] font-medium md:px-4 md:text-xs">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-hotpink opacity-75" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-hotpink" />
              </span>
              2x 2nd Place Hackathon Winner
            </span>
            <h1 className="max-w-4xl font-display text-4xl font-bold leading-[1.02] sm:text-5xl md:text-6xl xl:text-7xl">
              Hi, I'm <span className="gradient-text">Kgomotso</span>.
              <br />I build{" "}
              <span className="relative inline-block">
                <span className="gradient-text">{typedWord}</span>
                <motion.span
                  animate={{ opacity: [1, 0] }}
                  transition={{ repeat: Infinity, duration: 0.8, ease: "linear" }}
                  className="ml-0.5 inline-block h-[0.9em] w-0.75 bg-hotpink align-middle"
                />
              </span>{" "}
              web & mobile apps.
            </h1>
            <p className="max-w-2xl text-sm leading-6 text-muted-foreground sm:text-base md:text-lg md:leading-7">
               <span className="font-semibold text-foreground">Frontend & Mobile App Developer</span>, BCom
              Honours Information Systems student, and hackathon-tested builder focused on useful products with clean
              interfaces.
            </p>
            <div className="flex flex-wrap gap-2.5">
              <Link
                href="/projects"
                className="gradient-hero-bg glow-shadow group inline-flex items-center gap-2 rounded-full px-5 py-2.5 text-sm font-medium text-primary-foreground transition-transform hover:scale-105 md:px-6 md:py-3 md:text-base"
              >
                See my work <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Link>
              <Link
                href="/contact"
                className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-5 py-2.5 text-sm font-medium transition-colors hover:bg-muted md:px-6 md:py-3 md:text-base"
              >
                Get in touch
              </Link>
            </div>
            <div className="flex items-center gap-5 text-muted-foreground">
              <a href="https://github.com/MotsoM-dev" target="_blank" rel="noreferrer" className="transition-colors hover:text-hotpink">
                <Github className="h-5 w-5" />
              </a>
              <a
                href="https://linkedin.com/in/kgomotso-mathombo-a848a5386"
                target="_blank"
                rel="noreferrer"
                className="transition-colors hover:text-hotpink"
              >
                <Linkedin className="h-5 w-5" />
              </a>
              <a href={gmailComposeUrl} target="_blank" rel="noreferrer" className="transition-colors hover:text-hotpink">
                <Mail className="h-5 w-5" />
              </a>
            </div>
          </div>
        </Reveal>

        <Reveal delay={0.12}>
          <div className="hidden gap-4 lg:grid">
            <motion.article
              whileHover={{ y: -6 }}
              className="glass card-shadow relative overflow-hidden rounded-2xl border border-border p-5 xl:p-6"
            >
              <div className="gradient-cool-bg absolute -right-20 -top-20 h-52 w-52 rounded-full opacity-35 blur-3xl" />
              <div className="relative flex items-start gap-4">
                <div className="gradient-pink-bg grid h-12 w-12 shrink-0 place-items-center rounded-xl text-white">
                  <Trophy className="h-6 w-6" />
                </div>
                <div>
                  <div className="text-xs font-semibold uppercase tracking-[0.2em] text-hotpink">Recent win</div>
                  <h2 className="mt-2 font-display text-xl font-bold xl:text-2xl">{featuredProject.name}</h2>
                  <p className="mt-3 text-sm leading-6 text-muted-foreground xl:text-base xl:leading-7">{featuredProject.desc}</p>
                </div>
              </div>
            </motion.article>
            <div className="grid grid-cols-2 gap-4">
              {[
                { k: "2x", v: "2nd place hackathon wins" },
                { k: "4", v: "Featured projects" },
                { k: "2+", v: "Years tutoring" },
                { k: "3", v: "Hackathons" },
              ].map((stat, index) => (
                <Reveal key={stat.v} delay={index * 0.05}>
                  <div className="glass card-shadow rounded-2xl border border-border p-4 text-center xl:p-5">
                    <div className="gradient-text font-display text-2xl font-bold xl:text-3xl">{stat.k}</div>
                    <div className="mt-1 text-sm text-muted-foreground">{stat.v}</div>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </Reveal>
      </div>
    </main>
  );
}

const aboutParagraphs = [
  "I'm a Frontend and Mobile App Developer from South Africa currently completing a BCom Honours in Information Systems. My passion lies at the intersection of technology, creativity, and problem-solving, where clean code meets thoughtful design to create products that make a genuine impact.",
  "Beyond writing code, I'm driven by curiosity. Whether I'm exploring cloud technologies, cybersecurity, artificial intelligence, or emerging software trends, I'm constantly investing in becoming a stronger engineer. I believe great developers never stop learning, and every project is an opportunity to improve both technically and creatively.",
  "My experience spans industry development, systems development training, university tutoring, and collaborative hackathons, giving me the ability to communicate technical ideas clearly, adapt quickly, and thrive in fast-paced environments. I enjoy working with diverse teams, solving complex problems, and building software that delivers measurable value.",
  "What truly defines me is my mindset. I approach challenges with discipline, ownership, and a commitment to excellence. I'm not simply looking to write code. I'm looking to contribute to products that improve people's lives, collaborate with ambitious teams across the world, and continue growing into a software engineer capable of leading impactful projects.",
  "I'm excited by opportunities that challenge me, inspire innovation, and allow me to build technology that matters.",
];

function AboutPage() {
  const [aboutOpen, setAboutOpen] = useState(false);
  const visibleParagraphs = aboutOpen ? aboutParagraphs : aboutParagraphs.slice(0, 2);

  return (
    <PageShell>
      <PageIntro
        eyebrow="About me"
        title="Building technology that matters."
        copy="I build digital experiences that are intuitive, accessible, and designed with real people in mind."
      />
      <div className="grid gap-8 lg:grid-cols-[0.95fr_1.05fr]">
        <Reveal>
          <div className="glass card-shadow h-full rounded-2xl border border-border p-8 leading-8 text-muted-foreground md:p-10">
            <h2 className="font-display text-2xl font-semibold text-foreground">I'm Kgomotso Mathombo.</h2>
            <div className="relative mt-5">
              <div className="space-y-4">
                {visibleParagraphs.map((paragraph, index) => (
                  <p key={paragraph} className={aboutOpen && index === aboutParagraphs.length - 1 ? "font-medium text-foreground" : undefined}>
                    {paragraph}
                  </p>
                ))}
              </div>
              {!aboutOpen && <div className="pointer-events-none absolute inset-x-0 bottom-0 h-16 bg-linear-to-t from-card to-transparent" />}
            </div>
            <button
              type="button"
              onClick={() => setAboutOpen((open) => !open)}
              className="mt-6 inline-flex items-center gap-2 rounded-full border border-border bg-background/70 px-4 py-2 text-sm font-semibold text-foreground transition-colors hover:border-hotpink hover:bg-muted"
              aria-expanded={aboutOpen}
            >
              {aboutOpen ? "Show less" : "Read more"}
              {aboutOpen ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
            </button>
          </div>
        </Reveal>
        <Reveal delay={0.1}>
          <div className="grid gap-5 sm:grid-cols-2">
            {aboutDetails.map((item) => (
              <FlipCard key={item.label} {...item} />
            ))}
          </div>
        </Reveal>
      </div>
    </PageShell>
  );
}
function SkillsPage() {
  return (
    <PageShell>
      <PageIntro
        eyebrow="Core skills"
        title="A stack I keep sharpening."
        copy="My work sits where frontend craft, mobile thinking, product design, and clear communication meet."
      />
      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {skills.map((skill, index) => (
          <Reveal key={skill.title} delay={index * 0.05}>
            <motion.div
              whileHover={{ y: -6 }}
              className="glass card-shadow group relative flex h-full flex-col overflow-hidden rounded-2xl border border-border p-6 transition-shadow hover:shadow-lg"
            >
              <div className="gradient-hero-bg absolute -right-10 -top-10 h-32 w-32 rounded-full opacity-0 blur-2xl transition-opacity group-hover:opacity-40" />
              <div className="gradient-pink-bg mb-4 grid h-11 w-11 shrink-0 place-items-center rounded-xl text-white">
                <skill.icon className="h-5 w-5" />
              </div>
              <h2 className="font-display text-lg font-semibold">{skill.title}</h2>
              <div className="mt-3 flex flex-wrap gap-1.5">
                {skill.items.map((item) => (
                  <span key={item} className="rounded-full border border-border bg-background/60 px-2.5 py-1 text-xs text-muted-foreground">
                    {item}
                  </span>
                ))}
              </div>
            </motion.div>
          </Reveal>
        ))}
      </div>
      <Reveal delay={0.16}>
        <section className="mt-12">
          <div className="mb-5 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <span className="text-xs font-semibold uppercase tracking-[0.18em] text-hotpink">Certificates</span>
              <h2 className="mt-2 font-display text-2xl font-semibold">Proof of learning and achievement.</h2>
            </div>
            <p className="max-w-xl text-sm leading-6 text-muted-foreground">
              Certifications and programs that support my development work, product thinking, and hackathon experience.
            </p>
          </div>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {certs.map((cert, index) => (
              <Reveal key={cert} delay={index * 0.05}>
                <article className="glass card-shadow group flex h-full items-start gap-3 rounded-2xl border border-border p-5 transition-transform hover:-translate-y-1">
                  <div className="gradient-cool-bg grid h-11 w-11 shrink-0 place-items-center rounded-xl text-white shadow-lg">
                    <Award className="h-5 w-5" />
                  </div>
                  <div>
                    <div className="text-xs font-medium uppercase tracking-[0.14em] text-muted-foreground">Certificate</div>
                    <h3 className="mt-1 text-sm font-semibold leading-6 text-foreground">{cert}</h3>
                  </div>
                </article>
              </Reveal>
            ))}
          </div>
        </section>
      </Reveal>
    </PageShell>
  );
}

function PinkTimelineDuck() {
  return (
    <motion.div
      aria-hidden="true"
      className="relative h-14 w-18"
      animate={{ x: [-3, 3, -3], y: [0, -4, 0], rotate: [-4, 4, -4] }}
      transition={{ duration: 0.48, repeat: Infinity, ease: "easeInOut" }}
    >
      <motion.div
        className="absolute bottom-3 left-4 h-8 w-10 rounded-full bg-pink-400 shadow-lg shadow-pink-400/30"
        animate={{ scaleX: [1, 1.06, 1], scaleY: [1, 0.94, 1] }}
        transition={{ duration: 0.48, repeat: Infinity, ease: "easeInOut" }}
      />
      <div className="absolute left-3 top-3 h-6 w-6 rounded-full bg-pink-300 shadow-md" />
      <div className="absolute left-1 top-5 h-3 w-5 rounded-l-full bg-orange-300" />
      <div className="absolute left-7 top-4.5 h-1.5 w-1.5 rounded-full bg-slate-950" />
      <motion.div
        className="absolute bottom-5 left-8 h-4 w-6 rounded-full bg-pink-500/85"
        animate={{ rotate: [-24, 18, -24], y: [0, -2, 0] }}
        transition={{ duration: 0.48, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.span
        className="absolute bottom-1 left-8 h-4 w-1.5 origin-top rounded-full bg-orange-300"
        animate={{ rotate: [-42, 32, -42], x: [-4, 5, -4] }}
        transition={{ duration: 0.32, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.span
        className="absolute bottom-1 left-12 h-4 w-1.5 origin-top rounded-full bg-orange-300"
        animate={{ rotate: [32, -42, 32], x: [5, -4, 5] }}
        transition={{ duration: 0.32, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.span
        className="absolute bottom-0 left-5 h-1.5 w-6 rounded-full bg-orange-300"
        animate={{ x: [-6, 6, -6], scaleX: [0.8, 1.18, 0.8] }}
        transition={{ duration: 0.32, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.span
        className="absolute bottom-0 left-11 h-1.5 w-6 rounded-full bg-orange-300"
        animate={{ x: [6, -6, 6], scaleX: [1.18, 0.8, 1.18] }}
        transition={{ duration: 0.32, repeat: Infinity, ease: "easeInOut" }}
      />
    </motion.div>
  );
}

function ExperiencePage() {
  const timelineRef = useRef<HTMLElement>(null);
  const [timelineHeight, setTimelineHeight] = useState(0);
  const { scrollYProgress: timelineProgress } = useScroll({
    target: timelineRef,
    offset: ["start center", "end center"],
  });
  const duckTravel = Math.max(timelineHeight - 72, 12);
  const duckYRaw = useTransform(timelineProgress, [0, 1], [12, duckTravel]);
  const duckY = useSpring(duckYRaw, { stiffness: 180, damping: 24 });
  const experienceStats = [
    { value: "5", label: "Experience chapters" },
    { value: "3+", label: "Years of experience" },
    { value: "2023", label: "Journey started" },
  ];

  useEffect(() => {
    const timeline = timelineRef.current;
    if (!timeline) return;

    const updateHeight = () => setTimelineHeight(timeline.offsetHeight);
    updateHeight();

    const observer = new ResizeObserver(updateHeight);
    observer.observe(timeline);
    window.addEventListener("resize", updateHeight);
    return () => {
      observer.disconnect();
      window.removeEventListener("resize", updateHeight);
    };
  }, []);

  return (
    <PageShell>
      <PageIntro
        eyebrow="Experience"
        title="A career path with range."
        copy="A timeline of product delivery, mobile development, teaching, business operations, marketing, and structured software learning."
      />

      <Reveal>
        <motion.section
          whileHover={{ y: -5 }}
          className="gradient-hero-bg glow-shadow relative z-20 mb-14 overflow-hidden rounded-2xl p-6 text-primary-foreground md:p-9"
        >
          <motion.div
            aria-hidden="true"
            className="absolute -right-20 -top-24 h-64 w-64 rounded-full bg-white/20 blur-3xl"
            animate={{ scale: [1, 1.12, 1], rotate: [0, 18, 0] }}
            transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
          />
          <motion.div
            aria-hidden="true"
            className="absolute -bottom-28 left-8 h-64 w-64 rounded-full bg-white/15 blur-3xl"
            animate={{ x: [0, 16, 0], y: [0, -12, 0] }}
            transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
          />
          <div className="relative grid gap-8 lg:grid-cols-[0.8fr_1.2fr] lg:items-end">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full border border-white/25 bg-white/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] backdrop-blur">
                <Sparkles className="h-3.5 w-3.5" /> Experience map
              </div>
              <h2 className="mt-5 font-display text-3xl font-bold leading-tight md:text-5xl">From building screens to running the details behind them.</h2>
              <p className="mt-4 max-w-2xl text-sm leading-7 text-primary-foreground/85 md:text-base">
                My path is not one-note: I have worked in mobile development, frontend delivery, social media marketing,
                administration, tutoring, and formal software training. That mix makes me practical, adaptable, and product-minded.
              </p>
            </div>
            <div className="grid gap-4">
              <motion.div
                initial={{ opacity: 0, y: 16, scale: 0.98 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ duration: 0.5 }}
                className="overflow-hidden rounded-2xl border border-white/20 bg-white/10 p-2 shadow-2xl backdrop-blur"
              >
                <img
                  src="/animations/dukie-talking.gif"
                  alt="Dukie the pink duck talking about the timeline"
                  className="h-auto w-full rounded-xl object-cover"
                />
              </motion.div>
              <div className="grid gap-3 sm:grid-cols-3">
                {experienceStats.map((stat, index) => (
                  <motion.div
                    key={stat.label}
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.45, delay: index * 0.08 + 0.12 }}
                    className="rounded-xl border border-white/20 bg-white/10 p-4 backdrop-blur"
                  >
                    <div className="font-display text-3xl font-bold">{stat.value}</div>
                    <div className="mt-1 text-xs font-semibold uppercase tracking-[0.14em] text-white/75">{stat.label}</div>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        </motion.section>
      </Reveal>

      <section ref={timelineRef} className="relative z-10 mx-auto max-w-6xl">
        <div className="absolute bottom-0 left-6 top-0 w-px bg-linear-to-b from-hotpink via-violet to-teal md:left-1/2" />
        <motion.div
          aria-label="Pink duck walking along the experience timeline"
          style={{ y: duckY }}
          className="pointer-events-none absolute left-6 top-0 z-30 -translate-x-1/2 md:left-1/2"
        >
          <PinkTimelineDuck />
        </motion.div>
        <div className="absolute left-6 top-0 hidden h-full w-16 -translate-x-1/2 md:left-1/2 md:block">
          <motion.div
            aria-hidden="true"
            className="gradient-hero-bg absolute left-1/2 top-8 h-16 w-1 -translate-x-1/2 rounded-full blur-[1px]"
            animate={{ y: [0, 220, 440, 660, 880, 0], opacity: [0.4, 1, 0.7, 1, 0.35, 0.4] }}
            transition={{ duration: 13, repeat: Infinity, ease: "easeInOut" }}
          />
        </div>
        <div className="space-y-8 md:space-y-12">
          {experience.map((item, index) => {
            const Icon = item.role.includes("Tutor")
              ? GraduationCap
              : item.role.includes("Learner")
                ? GitBranch
                : item.role.includes("Mobile")
                  ? Smartphone
                  : item.role.includes("Administration")
                    ? FileText
                    : Briefcase;
            return (
              <Reveal key={item.role} delay={index * 0.08}>
                <div className={`relative z-10 pl-16 md:pl-0 ${index % 2 === 0 ? "md:pr-[calc(50%+3.5rem)]" : "md:pl-[calc(50%+3.5rem)]"}`}>
                  <motion.div
                    animate={{ scale: [1, 1.06, 1] }}
                    transition={{ duration: 3.2, repeat: Infinity, ease: "easeInOut", delay: index * 0.25 }}
                    className="absolute left-6 top-6 z-20 grid min-h-11 min-w-18 -translate-x-1/2 place-items-center rounded-full border border-border bg-background px-3 py-1 text-center shadow-lg md:left-1/2"
                  >
                    <span className="text-[10px] font-bold uppercase leading-tight tracking-[0.08em] text-hotpink">
                      {item.period}
                    </span>
                  </motion.div>

                  <motion.article
                    whileHover={{ y: -6, scale: 1.01 }}
                    className="glass card-shadow group relative overflow-hidden rounded-2xl border border-border p-5 md:p-6"
                  >
                    <div className={`${item.accent} absolute inset-x-0 top-0 h-1`} />
                    <div className="gradient-hero-bg absolute -right-16 -top-16 h-40 w-40 rounded-full opacity-0 blur-2xl transition-opacity group-hover:opacity-30" />
                    <div className="relative z-10">
                      <div className="flex flex-wrap items-center justify-between gap-3">
                        <span className="rounded-full border border-border bg-background/70 px-3 py-1 text-xs font-semibold uppercase tracking-[0.16em] text-hotpink">
                          {item.period}
                        </span>
                        <span className="rounded-full border border-border bg-background/70 px-3 py-1 text-xs font-semibold text-muted-foreground">
                          Chapter {String(index + 1).padStart(2, "0")}
                        </span>
                      </div>

                      <div className="mt-5 flex items-start gap-4">
                        <div className={`${item.accent} hidden h-14 w-14 shrink-0 place-items-center rounded-2xl text-white shadow-lg sm:grid`}>
                          {"logo" in item ? (
                            <img src={item.logo} alt={`${item.org} logo`} className="h-full w-full rounded-2xl bg-white object-cover" />
                          ) : (
                            <Icon className="h-6 w-6" />
                          )}
                        </div>
                        <div>
                          <div className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">{item.theme}</div>
                          <h2 className="mt-1 font-display text-2xl font-semibold leading-tight">{item.role}</h2>
                          <div className="mt-1 text-sm font-medium text-muted-foreground">{item.org}</div>
                        </div>
                      </div>

                      <p className="mt-5 text-sm leading-7 text-muted-foreground">{item.details[0]}</p>

                      <div className="mt-5 grid gap-2">
                        {item.points.map((point, pointIndex) => (
                          <motion.div
                            key={point}
                            initial={{ opacity: 0, x: index % 2 === 0 ? -12 : 12 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true, amount: 0.4 }}
                            transition={{ duration: 0.38, delay: pointIndex * 0.05 }}
                            className="flex gap-3 rounded-xl border border-border bg-background/45 p-3 text-sm leading-6 text-muted-foreground"
                          >
                            <span className={`${item.accent} mt-1 grid h-5 w-5 shrink-0 place-items-center rounded-full text-[10px] font-bold text-white`}>
                              {pointIndex + 1}
                            </span>
                            <span>{point}</span>
                          </motion.div>
                        ))}
                      </div>

                      <div className="mt-5 rounded-xl border border-border bg-card/60 p-4">
                        <div className="mb-2 text-xs font-semibold uppercase tracking-[0.16em] text-hotpink">What it added</div>
                        <p className="text-sm leading-7 text-muted-foreground">{item.details[1]}</p>
                      </div>
                    </div>
                  </motion.article>
                </div>
              </Reveal>
            );
          })}
        </div>
      </section>
    </PageShell>
  );
}
function ProjectsPage() {
  const [activeCategory, setActiveCategory] = useState<ProjectCategory>("Mobile Apps");
  const activeCategoryConfig = projectCategories.find((category) => category.name === activeCategory) ?? projectCategories[0];
  const activeProjects = projects.filter((project) => project.category === activeCategory);
  const ActiveIcon = activeCategoryConfig.icon;

  return (
    <PageShell>
      <PageIntro
        eyebrow="Selected projects"
        title="Projects grouped by the way they work."
        copy="A cleaner look at my mobile apps, websites, and web apps, from hackathon concepts to practical user-facing platforms."
      />
      <div className="space-y-8">
        <Reveal>
          <section className="mx-auto max-w-4xl">
            <div className="relative rounded-full border border-border bg-card/70 p-1.5 shadow-[0_18px_70px_-42px_color-mix(in_oklab,var(--color-hotpink)_75%,transparent)] backdrop-blur">
              <div className="grid grid-cols-3 gap-1">
                {projectCategories.map((category) => {
                  const Icon = category.icon;
                  const active = activeCategory === category.name;
                  const total = projects.filter((project) => project.category === category.name).length;

                  return (
                    <button
                      key={category.name}
                      type="button"
                      onClick={() => setActiveCategory(category.name)}
                      className={`relative isolate flex min-h-14 items-center justify-center gap-2 overflow-hidden rounded-full px-2 text-xs font-semibold transition-colors sm:text-sm ${
                        active ? "text-white" : "text-muted-foreground hover:text-foreground"
                      }`}
                      aria-pressed={active}
                    >
                      {active && (
                        <motion.span
                          layoutId="project-category-slider"
                          className={`${category.accent} absolute inset-0 -z-10 rounded-full shadow-glow`}
                          transition={{ type: "spring", stiffness: 430, damping: 34 }}
                        />
                      )}
                      <Icon className="h-4 w-4 shrink-0" />
                      <span className="truncate">{category.name}</span>
                      <span
                        className={`hidden h-6 min-w-6 place-items-center rounded-full px-2 text-[11px] sm:grid ${
                          active ? "bg-white/18 text-white" : "border border-border bg-background/70 text-muted-foreground"
                        }`}
                      >
                        {total}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="mx-auto mt-4 h-1 max-w-2xl overflow-hidden rounded-full bg-border/70">
              <motion.div
                className={`${activeCategoryConfig.accent} h-full rounded-full`}
                animate={{
                  x: `${projectCategories.findIndex((category) => category.name === activeCategory) * 100}%`,
                }}
                transition={{ type: "spring", stiffness: 360, damping: 32 }}
                style={{ width: `${100 / projectCategories.length}%` }}
              />
            </div>
          </section>
        </Reveal>

        <Reveal>
          <motion.section
            key={activeCategory}
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
          >
            <div className="mb-5 flex flex-wrap items-end justify-between gap-3">
              <div className="flex items-center gap-3">
                <span className={`${activeCategoryConfig.accent} grid h-12 w-12 place-items-center rounded-2xl text-white shadow-glow`}>
                  <ActiveIcon className="h-5 w-5" />
                </span>
                <div>
                  <div className="text-xs font-semibold uppercase tracking-[0.18em] text-hotpink">Now viewing</div>
                  <h2 className="font-display text-3xl font-semibold">{activeCategory}</h2>
                </div>
              </div>
              <p className="max-w-xl text-sm leading-6 text-muted-foreground">{activeCategoryConfig.intro}</p>
            </div>

            <div className="grid gap-5 lg:grid-cols-2">
              {activeProjects.map((project, projectIndex) => {
                const ProjectIcon = project.featured ? Trophy : Code2;

                return (
                  <motion.article
                    key={project.name}
                    initial={{ opacity: 0, y: 24, scale: 0.98 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    transition={{ duration: 0.5, delay: projectIndex * 0.08, ease: [0.22, 1, 0.36, 1] }}
                    className="group relative min-h-80 overflow-hidden rounded-2xl border border-border bg-card/75 p-6 transition-all hover:-translate-y-1 hover:border-hotpink/45 hover:bg-card md:p-7"
                  >
                    <div className={`${activeCategoryConfig.accent} pointer-events-none absolute -right-20 -top-20 h-52 w-52 rounded-full opacity-15 blur-3xl transition-opacity group-hover:opacity-30`} />
                    <div className="relative z-10 flex h-full flex-col">
                      <div className="flex flex-wrap items-center justify-between gap-3">
                        <div className="flex items-center gap-2">
                          <span className="grid h-9 w-9 place-items-center rounded-xl border border-border bg-background/80 text-hotpink transition-colors group-hover:border-hotpink/45 group-hover:bg-hotpink/10">
                            <ProjectIcon className="h-4 w-4" />
                          </span>
                          <span className="text-xs font-semibold uppercase tracking-[0.16em] text-muted-foreground">{project.tag}</span>
                        </div>
                        <span className="rounded-full border border-hotpink/30 bg-hotpink/10 px-3 py-1 text-xs font-semibold text-hotpink">
                          {project.category}
                        </span>
                      </div>

                      <h3 className="mt-5 font-display text-2xl font-semibold leading-tight md:text-3xl">{project.name}</h3>
                      <p className="mt-3 flex-1 leading-7 text-muted-foreground">{project.desc}</p>

                      <div className="mt-6">
                        <div className="mb-2 text-xs font-semibold uppercase tracking-[0.16em] text-hotpink">Tech stack</div>
                        <div className="flex flex-wrap gap-2">
                          {project.stack.map((tech) => (
                            <span
                              key={tech}
                              className="rounded-full border border-border bg-background/75 px-3 py-1 text-xs font-medium text-muted-foreground transition-colors group-hover:border-hotpink/40 group-hover:bg-hotpink/10 group-hover:text-foreground"
                            >
                              {tech}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  </motion.article>
                );
              })}
            </div>
          </motion.section>
        </Reveal>
      </div>
    </PageShell>
  );
}
const coverLetterParagraphs = [
  "Thank you for taking the time to visit my portfolio. I'm a Frontend and Mobile App Developer currently completing my BCom Honours in Information Systems while gaining industry experience at Appimate and through a MICTSETA Systems Development Learnership. I enjoy turning ideas into responsive web applications and cross-platform mobile experiences that are intuitive, scalable, and built with users in mind.",

  "Working in Agile product teams has taught me how to collaborate across design, backend, and QA while managing priorities and delivering production-ready features through disciplined Git/GitHub workflows. I build with React, Next.js, TypeScript, React Native, HTML, CSS, and modern development tools, always focusing on writing clean, maintainable code that creates real value. Alongside development, two years of tutoring Information Systems strengthened my communication skills and my ability to explain technical concepts clearly, making collaboration with both technical and non-technical teams natural.",

  "I enjoy challenging environments where learning and execution go hand in hand. Whether building products during internships, developing personal projects, or competing in hackathons, I consistently embrace opportunities to solve problems under pressure. These experiences have strengthened my adaptability, attention to detail, and ability to deliver functional solutions within demanding deadlines while maintaining a calm, solution-focused mindset.",

  "I'm looking for an opportunity to contribute to a team that values ownership, curiosity, and continuous improvement. If you're searching for someone who learns quickly, communicates well, takes initiative, and genuinely enjoys building products that make a difference, I'd love to be part of your team.",
];

function ContactPage() {
  const [coverLetterOpen, setCoverLetterOpen] = useState(false);
  const [phoneCopied, setPhoneCopied] = useState(false);
  const visibleParagraphs = coverLetterOpen ? coverLetterParagraphs : coverLetterParagraphs.slice(0, 2);

  const copyPhoneNumber = async () => {
    try {
      await navigator.clipboard.writeText(phoneClipboardValue);
    } catch {
      const textarea = document.createElement("textarea");
      textarea.value = phoneClipboardValue;
      textarea.style.position = "fixed";
      textarea.style.opacity = "0";
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand("copy");
      document.body.removeChild(textarea);
    }

    setPhoneCopied(true);
    window.setTimeout(() => setPhoneCopied(false), 1600);
  };

  return (
    <PageShell>
      <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
        <Reveal>
          <article className="glass card-shadow h-full rounded-2xl border border-border p-8 md:p-10">
            <div className="mb-6 flex items-center gap-3">
              <div className="gradient-cool-bg grid h-11 w-11 shrink-0 place-items-center rounded-xl text-white">
                <FileText className="h-5 w-5" />
              </div>
              <div>
                <div className="text-xs font-semibold uppercase tracking-[0.18em] text-hotpink">Cover letter</div>
                <h2 className="font-display text-2xl font-semibold">Dear Hiring Manager,</h2>
              </div>
            </div>

            <div className="relative">
              <div className="space-y-4 leading-8 text-muted-foreground">
                {visibleParagraphs.map((paragraph) => (
                  <p key={paragraph}>{paragraph}</p>
                ))}
                {coverLetterOpen && (
                  <p className="font-medium text-foreground">
                    Kind regards,<br />Kgomotso Mathombo
                  </p>
                )}
              </div>
              {!coverLetterOpen && (
                <div className="pointer-events-none absolute inset-x-0 bottom-0 h-16 bg-linear-to-t from-card to-transparent" />
              )}
            </div>

            <button
              type="button"
              onClick={() => setCoverLetterOpen((open) => !open)}
              className="mt-6 inline-flex items-center gap-2 rounded-full border border-border bg-background/70 px-4 py-2 text-sm font-semibold text-foreground transition-colors hover:border-hotpink hover:bg-muted"
              aria-expanded={coverLetterOpen}
            >
              {coverLetterOpen ? "Show less" : "Read more"}
              {coverLetterOpen ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
            </button>

            <div className="mt-7 flex flex-wrap gap-2">
              {["React", "Next.js", "React Native", "UI/UX", "Hackathon finalist", "Information Systems"].map((item) => (
                <span key={item} className="rounded-full border border-border bg-background/70 px-3 py-1 text-xs font-medium text-muted-foreground">
                  {item}
                </span>
              ))}
            </div>
          </article>
        </Reveal>

        <Reveal delay={0.08}>
          <section className="gradient-hero-bg glow-shadow relative h-full overflow-hidden rounded-2xl p-8 text-white md:p-10">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(255,255,255,0.28),transparent_48%)]" />
            <div className="relative">
              <div className="inline-flex items-center gap-2 rounded-full border border-white/25 bg-white/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em]">
                <Sparkles className="h-3.5 w-3.5" /> Available for opportunities
              </div>
              <h2 className="mt-5 font-display text-3xl font-bold md:text-4xl">Frontend, mobile, and product-minded problem solving.</h2>
              <p className="mt-4 max-w-xl leading-7 text-white/85">
                If you need someone who can turn product ideas into clean React, Next.js, and React Native experiences,
                I would love to talk. I usually reply within a day.
              </p>

              <div className="mt-8 grid gap-3">
                <ContactRow icon={Mail} label={emailAddress} href={gmailComposeUrl} />
                <ContactRow icon={Phone} label={phoneNumber} onClick={copyPhoneNumber} actionLabel={phoneCopied ? "Copied" : "Copy"} />
                <ContactRow icon={Github} label="github.com/MotsoM-dev" href="https://github.com/MotsoM-dev" />
                <ContactRow icon={Linkedin} label="linkedin.com/in/kgomotso-mathombo" href="https://linkedin.com/in/kgomotso-mathombo-a848a5386" />
              </div>

              <a
                href="/Kgomotso_Mathombo_CV.docx"
                download
                className="mt-6 inline-flex w-full items-center justify-center gap-3 rounded-full border border-white/30 bg-white px-5 py-3 font-semibold text-slate-950 shadow-lg transition-transform hover:scale-[1.02]"
              >
                <Download className="h-5 w-5 text-hotpink" />
                Download CV
                <span className="rounded-full bg-slate-950/10 px-2 py-0.5 text-xs text-slate-700">DOCX</span>
              </a>
            </div>
          </section>
        </Reveal>
      </div>

    </PageShell>
  );
}

function Footer() {
  return (
    <footer className="border-t border-border py-8">
      <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-3 px-4 text-sm text-muted-foreground md:flex-row md:px-8">
        <div>(c) {new Date().getFullYear()} Kgomotso Mathombo. Built with Next.js & React.</div>
        <div className="flex items-center gap-3">
          <span className="flex items-center gap-2"><span className="h-2 w-2 rounded-full bg-hotpink" /> Crafted in South Africa</span>
          <a href="/blog?admin=1" aria-label="Open admin login" className="rounded-full border border-border px-2 py-1 text-[10px] uppercase tracking-[0.18em] opacity-45 transition-opacity hover:opacity-100">
            Login
          </a>
        </div>
      </div>
    </footer>
  );
}

export default function Portfolio({ page = "home" }: { page?: PageKey }) {
  const { theme, toggle } = useTheme();
  const { scrollYProgress } = useScroll();
  const progress = useSpring(scrollYProgress, { stiffness: 120, damping: 30 });
  const [showTopButton, setShowTopButton] = useState(false);

  useEffect(() => {
    const handleScroll = () => setShowTopButton(window.scrollY > 400);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToTop = () => window.scrollTo({ top: 0, behavior: "smooth" });
  const pages: Record<PageKey, ReactNode> = {
    home: <HomePage />,
    about: <AboutPage />,
    skills: <SkillsPage />,
    experience: <ExperiencePage />,
    projects: <ProjectsPage />,
    blog: <Blog />,
    contact: <ContactPage />,
  };

  return (
    <div className="relative min-h-screen overflow-x-hidden bg-background text-foreground">
      <Cursor />
      <FloatingParticles />
      <MovingBackground />
      <motion.div style={{ scaleX: progress }} className="gradient-hero-bg fixed left-0 top-0 z-50 h-1 w-full origin-left" />
      <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
        <ParallaxBlob className="-left-32 top-10 h-96 w-96 bg-hotpink/30" />
        <ParallaxBlob className="right-0 top-1/3 h-96 w-96 bg-teal/25" />
        <ParallaxBlob className="bottom-0 left-1/3 h-96 w-96 bg-violet/25" />
      </div>
      <Header theme={theme} toggle={toggle} />
      {pages[page]}
      {page !== "home" && <Footer />}
      <motion.button
        onClick={scrollToTop}
        initial={{ opacity: 0, scale: 0 }}
        animate={{ opacity: showTopButton ? 1 : 0, scale: showTopButton ? 1 : 0 }}
        transition={{ duration: 0.3 }}
        aria-label="Back to top"
        className="fixed bottom-6 right-6 z-50 grid h-12 w-12 place-items-center rounded-full bg-hotpink text-white shadow-lg transition-transform hover:scale-110"
      >
        <ChevronUp className="h-6 w-6" />
      </motion.button>
    </div>
  );
}
