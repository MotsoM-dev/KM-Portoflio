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
  ExternalLink,
  FileText,
  Github,
  GitBranch,
  Globe2,
  GraduationCap,
  Images,
  Linkedin,
  Mail,
  MapPin,
  Menu,
  Moon,
  Palette,
  Phone,
  PlayCircle,
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
import WalkingDuck from "./WalkingDuck";

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

const coreSkills = [
  { name: "Frontend development", level: 92, detail: "React · Next.js · TypeScript" },
  { name: "Mobile development", level: 86, detail: "React Native · Cross-platform UI" },
  { name: "UI/UX implementation", level: 88, detail: "Figma · Responsive systems" },
  { name: "Backend & data", level: 76, detail: "Supabase · SQL · REST APIs" },
];

const experience = [
  {
    role: "Frontend & Mobile App Developer",
    org: "Appimate",
    period: "2025 - Present",
    year: "2025",
    logo: "/experience/appimate-official.png",
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
    role: "Systems Development Learner",
    org: "MICTSETA Learnership",
    period: "2025 - Present",
    year: "2025",
    logo: "/experience/mictseta-online.png",
    theme: "Structured learning",
    accent: "gradient-pink-bg",
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
    year: "2024",
    logo: "/experience/ufh-online.png",
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
    org: "TechShield Connect",
    period: "2023 - 2026",
    year: "2023",
    logo: "/experience/techshield.jpg",
    points: [
      "Contributed to mobile product development and user-focused interface delivery.",
      "Created and coordinated social media content that strengthened digital visibility.",
      "Connected product storytelling with practical marketing and community engagement.",
    ],
    details: [
      "At TechShield Connect I worked across mobile development and social media marketing, bringing technical delivery and audience communication together. I supported app experiences while helping the brand present its work clearly and consistently online.",
      "The role strengthened my ability to switch between product thinking, implementation, campaign support, content coordination, and direct collaboration with a growing team.",
    ],
  },
  {
    role: "Administration Support",
    org: "iLitha Gaming",
    period: "2026",
    year: "2026",
    logo: "/experience/ilitha-gaming-vibrant.png",
    points: [
      "Managed participant registration and accurate event administration.",
      "Supported day-to-day gaming company operations and attendee coordination.",
      "Kept records, communication, and event workflows organised and accessible.",
    ],
    details: [
      "At iLitha Gaming I provide administration support for registrations and operational workflows. My work helps participants move smoothly through gaming activities while giving the team reliable, well-organised information.",
      "This chapter adds event coordination, record management, customer support, and detail-focused administration to my broader digital product experience.",
    ],
  },
];
const projects = [
  {
    name: "Imbewu — The Seed",
    tag: "2026 - 2nd Place Fintech Hackathon",
    order: 2,
    desc: "Created for the UCT Fintech Winter School Hackathon, Imbewu is a fintech ecosystem connecting investors with SMEs seeking funding. It brings together an investment marketplace, Open Banking, AI-powered business tools, and transparent performance reporting—giving investors ongoing visibility while helping entrepreneurs grow sustainably. The platform responds directly to the funding gap facing SMEs across the Eastern Cape and South Africa, and earned our team second place at the hackathon.",
    stack: ["React", "Mobile development", "Open Banking", "AI tools", "FinTech"],
    category: "mobile" as const,
    videoSrc: "/projects/imbewu-the-seed.mp4",
    href: "https://github.com/MotsoM-dev/Imbewu-invest",
    collaboration: "UCT Fintech team project",
    isHackathon: true,
    featured: false,
  },
  {
    name: "SpeedLoans",
    tag: "2026 - Web application - FinTech",
    order: 5,
    desc: "A fast, fully digital lending experience that helps people apply for a loan in about seven minutes—without office visits, collateral, unnecessary paperwork, or drawn-out registration. Approved funds are paid directly into the applicant's bank account or card, turning an often stressful process into a clear, accessible online journey. I collaborated with the project team to help shape and deliver this streamlined web experience.",
    stack: ["Web development", "Responsive UI", "FinTech", "Digital applications"],
    category: "webapp" as const,
    videoSrc: "/projects/speedloans.mp4",
    href: "https://speedloans.co.za",
    collaboration: "Collaborative project",
    isHackathon: false,
  },
  {
    name: "Clearview Crescent Lodge",
    tag: "2026 - Hospitality website - East London",
    order: 4,
    desc: "A warm, polished guest-house website created to turn a stay in Beacon Bay into an inviting digital experience. The site highlights Clearview's five luxury bedrooms, self-catering guest cottage, swimming pool and entertainment area while making it easy for visitors to explore the accommodation and plan a comfortable East London stay.",
    stack: ["Hospitality website", "Responsive design", "Guest experience", "Visual storytelling"],
    category: "website" as const,
    videoSrc: "/projects/clearview-guest-house.mp4",
    href: "https://visiteasterncape.co.za/listings/clearview-crescent-lodge/",
    isHackathon: false,
  },
  {
    name: "The Cortex Hub — Human Rights Hackathon",
    tag: "2024 - Civic Tech Hackathon",
    order: 6,
    desc: "EduFix, created for The Cortex Hub's Human Rights Hackathon in 2024, is a civic technology web app that gives rural schools a clear, accessible way to report infrastructure problems and bring urgent learning-environment issues to the people who can resolve them.",
    stack: ["HTML", "CSS", "JavaScript", "Civic technology"],
    category: "webapp" as const,
    videoSrc: "/projects/edufix.mp4",
    href: "https://edufix.lovable.app/",
    liveLabel: "Open live website",
    isHackathon: true,
  },
  {
    name: "Telkom10x - Network Support Portal",
    tag: "2025 - 2nd Place Telkom Hackathon",
    order: 3,
    desc: "Won 2nd place for a self-service network support portal concept with an AI assistant and community forum, focused on practical front-end flows for faster troubleshooting.",
    stack: ["Mobile development", "AI assistant", "Community support", "Frontend UX"],
    category: "mobile" as const,
    videoSrc: "/projects/telkom10x-network-support.mp4",
    href: "https://github.com/MotsoM-dev?tab=repositories&q=network",
    collaboration: "Telkom hackathon team project",
    isHackathon: true,
    featured: true,
  },
  {
    name: "iLifa Mobile App",
    tag: "2026 - Geekulcha Annual Hackathon",
    order: 1,
    desc: "iLifa is a heritage-first discovery app that turns the story of a place into a pathway toward experiencing and supporting the local economy around it. Visitors can explore historical photographs and selected 3D reconstructions, hear community stories in original languages, and understand the difference between lived memory, supporting evidence, and unresolved accounts. An AI History Guide supports thoughtful discovery, while Explore Nearby connects visitors with local restaurants, markets, guides, cultural experiences, and activities. Curated heritage trails and premium 3D/VR experiences extend the journey from Story → Place → Explore Nearby → Experience.",
    stack: ["React Native", "Heritage discovery", "AI History Guide", "Community stories", "3D/VR experiences"],
    category: "mobile" as const,
    videoSrc: "/projects/geekulcha-annual-hackathon-2026.mp4",
    href: "https://drive.google.com/file/d/1fvwnt1SD809E4GXK0LQwPm-0lYPmDtP5/view",
    liveLabel: "Watch pitch video",
    collaboration: "Geekulcha hackathon team project",
    isHackathon: true,
    featured: true,
  },
];
const certs = ["UCT Fintech Winter School Hackathon Certificate", "Microsoft AI Fluency", "IBM Python for Data Science", "FNB App Academy - Full-Stack exposure"];

const aboutDetails = [
  { icon: MapPin, label: "Based in", value: "Gauteng", detail: "South Africa" },
  { icon: GraduationCap, label: "Highest qualification", value: "NQF Level 8", detail: "Honours in Information Systems @ UFH" },
  { icon: Briefcase, label: "Currently", value: "Appimate", detail: "Frontend & Mobile Developer" },
  { icon: Trophy, label: "Hackathon wins", value: "2x 2nd Place", detail: "UCT Fintech Winter School + Telkom Hackathon" },
];

function PageIntro({ eyebrow, title, copy, compact = false }: { eyebrow: string; title: string; copy: string; compact?: boolean }) {
  return (
    <Reveal>
      <div className={`mx-auto max-w-4xl text-center ${compact ? "mb-6 md:mb-8" : "mb-10 md:mb-14"}`}>
        <span className="text-sm font-semibold uppercase tracking-[0.2em] text-hotpink">{eyebrow}</span>
        <h1 className={`mt-3 font-display font-bold leading-tight ${compact ? "text-3xl md:text-5xl" : "text-4xl md:text-6xl"}`}>{title}</h1>
        <p className={`mx-auto max-w-2xl text-muted-foreground ${compact ? "mt-2 text-sm leading-6 md:text-base" : "mt-4 text-base leading-8 md:text-lg"}`}>{copy}</p>
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
  const socialLinks = [
    { label: "GitHub", href: "https://github.com/MotsoM-dev", icon: Github },
    { label: "LinkedIn", href: "https://linkedin.com/in/kgomotso-mathombo-a848a5386", icon: Linkedin },
    { label: "Email", href: gmailComposeUrl, icon: Mail },
  ];

  return (
    <main className="relative mx-auto min-h-screen w-full max-w-7xl px-4 pb-10 pt-24 md:px-8 md:pt-28 lg:h-svh lg:min-h-0 lg:overflow-hidden lg:pb-4 lg:pt-20">
      <div className="pointer-events-none absolute inset-x-0 top-0 z-0 h-[72vh] overflow-hidden">
        <Particles
          particleCount={180}
          particleSpread={12}
          speed={0.08}
          particleBaseSize={140}
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
      <div className="grid min-h-[calc(100vh-8rem)] items-center gap-8 lg:h-full lg:min-h-0 lg:grid-cols-[1.08fr_0.92fr] lg:gap-7">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
          <div className="flex flex-col items-start gap-4 xl:gap-5">
            <span className="glass inline-flex items-center gap-2 rounded-full border border-border px-4 py-1.5 text-xs font-medium">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-hotpink opacity-75" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-hotpink" />
              </span>
              2x 2nd Place Hackathon Winner
            </span>
            <h1 className="font-display text-5xl font-bold leading-[1.05] md:text-7xl lg:text-6xl xl:text-7xl 2xl:text-8xl">
              Hi, I'm <span className="gradient-text">Kgomotso</span>.
              <br />I build{" "}
              <span className="relative inline-grid align-baseline">
                <span aria-hidden="true" className="invisible col-start-1 row-start-1">accessible</span>
                <span className="col-start-1 row-start-1 whitespace-nowrap"><span className="gradient-text">{typedWord}</span><motion.span animate={{ opacity: [1, 0] }} transition={{ repeat: Infinity, duration: 0.8, ease: "linear" }} className="ml-0.5 inline-block h-[0.9em] w-0.75 bg-hotpink align-middle" /></span>
              </span>{" "}
              web & mobile apps.
            </h1>
            <p className="max-w-2xl text-base leading-7 text-muted-foreground md:text-lg md:leading-8 xl:text-xl">
              <span className="font-semibold text-foreground">Frontend & Mobile App Developer</span> with an NQF Level 8 Honours qualification in Information Systems, and a hackathon-tested builder focused on useful products with clean interfaces.
            </p>
            <div className="flex flex-wrap gap-3">
              <Link
                href="/projects"
                className="gradient-hero-bg glow-shadow group inline-flex items-center gap-2 rounded-full px-6 py-3 font-medium text-primary-foreground transition-transform hover:scale-105"
              >
                See my work <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Link>
              <Link
                href="/contact"
                className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-6 py-3 font-medium transition-colors hover:bg-muted"
              >
                Get in touch
              </Link>
            </div>
          </div>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.12 }}>
          <div className="grid gap-4 xl:gap-5">
            <motion.article
              whileHover={{ y: -6 }}
              className="glass card-shadow relative overflow-hidden rounded-2xl border border-border p-5 xl:p-7"
            >
              <div className="gradient-cool-bg absolute -right-20 -top-20 h-52 w-52 rounded-full opacity-35 blur-3xl" />
              <div className="relative flex items-start gap-4">
                <div className="gradient-pink-bg grid h-12 w-12 shrink-0 place-items-center rounded-xl text-white">
                  <Trophy className="h-6 w-6" />
                </div>
                <div>
                  <div className="text-xs font-semibold uppercase tracking-[0.2em] text-hotpink">Recent win</div>
                  <h2 className="mt-2 font-display text-xl font-bold xl:text-2xl">{featuredProject.name}</h2>
                  <p className="mt-2 line-clamp-4 text-sm leading-6 text-muted-foreground xl:mt-3 xl:text-base xl:leading-7">{featuredProject.desc}</p>
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
                  <div className="glass card-shadow rounded-2xl border border-border p-3 text-center xl:p-5">
                    <div className="gradient-text font-display text-3xl font-bold">{stat.k}</div>
                    <div className="mt-1 text-sm text-muted-foreground">{stat.v}</div>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </motion.div>
      </div>
      <aside aria-label="Social links" className="absolute bottom-5 right-4 z-20 flex gap-2 lg:bottom-auto lg:right-5 lg:top-1/2 lg:-translate-y-1/2 lg:flex-col">
        {socialLinks.map(({ label, href, icon: Icon }) => (
          <a key={label} href={href} target="_blank" rel="noreferrer" aria-label={label} className="group/social relative grid h-11 w-11 place-items-center rounded-full text-muted-foreground transition-all hover:-translate-y-1 hover:text-white focus-visible:text-white focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-hotpink">
            <span aria-hidden="true" className="gradient-hero-bg absolute inset-0 rounded-full opacity-0 shadow-glow transition-opacity group-hover/social:opacity-100 group-focus-visible/social:opacity-100" />
            <Icon className="relative h-6 w-6" />
          </a>
        ))}
      </aside>
    </main>
  );
}

const aboutParagraphs = [
  "I'm a Frontend and Mobile App Developer based in Gauteng, South Africa, with an NQF Level 8 Honours qualification in Information Systems from the University of Fort Hare. My passion lies at the intersection of technology, creativity, and problem-solving, where clean code meets thoughtful design to create products that make a genuine impact.",
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

      <section className="glass card-shadow relative overflow-hidden rounded-3xl border border-border p-6 md:p-9">
        <div className="gradient-hero-bg pointer-events-none absolute -right-24 -top-28 h-72 w-72 rounded-full opacity-15 blur-3xl" />
        <div className="relative grid gap-x-10 gap-y-7 md:grid-cols-2">
          {coreSkills.map((skill, index) => (
            <motion.div key={skill.name} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.45, delay: 0.1 + index * 0.1 }}>
              <div className="mb-2 flex items-end justify-between gap-4"><div><h2 className="font-display text-lg font-semibold">{skill.name}</h2><p className="mt-1 text-xs text-muted-foreground">{skill.detail}</p></div><span className="font-display text-xl font-bold text-hotpink">{skill.level}%</span></div>
              <div className="relative h-3 overflow-hidden rounded-full bg-muted shadow-inner">
                <motion.div className="gradient-hero-bg relative h-full origin-left overflow-hidden rounded-full" initial={{ scaleX: 0 }} animate={{ scaleX: skill.level / 100 }} transition={{ duration: 1.15, delay: 0.2 + index * 0.12, ease: [0.22, 1, 0.36, 1] }}>
                  <motion.span className="absolute inset-y-0 w-24 bg-linear-to-r from-transparent via-white/55 to-transparent" animate={{ x: ["-120%", "520%"] }} transition={{ duration: 2.2, delay: 0.8 + index * 0.12, repeat: Infinity, repeatDelay: 1.4, ease: "easeInOut" }} />
                </motion.div>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      <div className="mb-5 mt-12"><span className="text-xs font-semibold uppercase tracking-[0.18em] text-hotpink">Toolkit</span><h2 className="mt-2 font-display text-2xl font-semibold">The tools behind the progress.</h2></div>
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

function ExperiencePage() {
  const timelineRef = useRef<HTMLElement>(null);
  const duckVideoRef = useRef<HTMLVideoElement>(null);
  const [isExploring, setIsExploring] = useState(false);
  const { scrollYProgress: timelineProgress } = useScroll({ target: timelineRef, offset: ["start center", "end center"] });
  const smoothTimelineProgress = useSpring(timelineProgress, { stiffness: 120, damping: 28, mass: 0.35 });
  const duckTop = useTransform(smoothTimelineProgress, [0, 1], ["3%", "94%"]);
  const handleExplore = () => {
    if (!isExploring) setIsExploring(true);
  };
  const handleDuckFinished = () => {
    timelineRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  };
  return <PageShell>
    <PageIntro compact eyebrow="Experience" title="Five chapters. One growing story." copy="A timeline shaped by product delivery, learning, mentoring, marketing, gaming, and the people I have supported along the way." />
    <section className="gradient-hero-bg glow-shadow relative mb-10 overflow-hidden rounded-3xl p-4 text-white md:p-6">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(255,255,255,.3),transparent_38%)]" />
      <div className="relative grid items-center gap-5 lg:grid-cols-[1fr_22rem]">
        <div><span className="text-xs font-bold uppercase tracking-[.2em] text-white/75">Career snapshot</span><h2 className="mt-2 max-w-2xl font-display text-2xl font-bold md:text-4xl">Building, supporting and learning with heart.</h2><div className="mt-4 grid max-w-xl gap-2 sm:grid-cols-3">{[{k:"5",v:"Experience chapters"},{k:"3+",v:"Years of experience"},{k:"2023",v:"Journey started"}].map(stat=><div key={stat.v} className="rounded-xl bg-white/12 px-3 py-2 backdrop-blur"><div className="font-display text-2xl font-bold">{stat.k}</div><div className="mt-0.5 text-xs text-white/75">{stat.v}</div></div>)}</div></div>
        <div className="relative mx-auto w-full max-w-sm">
          <div className="relative overflow-hidden rounded-3xl border border-white/30 bg-black/20 p-2 shadow-2xl backdrop-blur-sm">
            <video
              ref={duckVideoRef}
              key={isExploring ? "flying-duck" : "talking-duck"}
              src={isExploring ? "/experience/duck-flying.mp4" : "/experience/talking-duckie.mp4"}
              autoPlay
              muted
              playsInline
              loop={!isExploring}
              onEnded={isExploring ? handleDuckFinished : undefined}
              className="aspect-video w-full rounded-2xl object-cover"
              aria-label={isExploring ? "Dukie flying toward the experience timeline" : "Talking Dukie inviting you to explore the timeline"}
            />
            {!isExploring && <div className="absolute left-4 top-4 max-w-40 rounded-xl rounded-bl-sm bg-white px-2.5 py-2 text-xs font-bold leading-4 text-hotpink shadow-xl">Would you like to see Motso's Timeline?</div>}
          </div>
          {!isExploring && <button type="button" onClick={handleExplore} className="gradient-pink-bg group mt-4 inline-flex w-full items-center justify-center gap-2 rounded-full px-5 py-3 text-sm font-bold text-white shadow-xl transition hover:-translate-y-1 hover:brightness-110">Explore <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" /></button>}
          {isExploring && <div className="mt-3 text-center text-xs font-semibold text-white/75">Dukie is flying to your timeline…</div>}
        </div>
      </div>
    </section>
    <section ref={timelineRef} className="relative mx-auto max-w-6xl">
      <div className="absolute bottom-0 left-7 top-0 w-1 rounded-full bg-linear-to-b from-hotpink via-violet to-teal md:left-1/2 md:-translate-x-1/2" />
      <motion.div style={{ top: duckTop }} className="pointer-events-none absolute left-7 z-10 w-12 -translate-x-1/2 -translate-y-1/2 md:left-1/2 md:w-14"><WalkingDuck /></motion.div>
      <div className="space-y-9 md:space-y-12">{[...experience].sort((a,b)=>Number(b.year)-Number(a.year)).map((item,index)=><Reveal key={`${item.org}-${item.role}`} delay={index*.05}><div className={`relative pl-20 md:pl-0 ${index%2===0?"md:pr-[calc(50%+3.5rem)]":"md:pl-[calc(50%+3.5rem)]"}`}>
        <div className="absolute left-0 top-6 z-20 grid h-14 w-14 place-items-center rounded-2xl bg-card p-1.5 shadow-xl md:left-1/2 md:-translate-x-1/2"><span className="gradient-hero-bg grid h-full w-full place-items-center rounded-xl px-1 text-xs font-black text-white">{item.year}</span></div>
        <motion.article whileHover={{ y:-6, rotate:index%2===0?-.4:.4 }} className="glass card-shadow relative overflow-hidden rounded-3xl border border-border p-6 md:p-7"><div className="gradient-hero-bg absolute -right-16 -top-16 h-40 w-40 opacity-15 blur-3xl"/><div className="relative flex gap-4"><div className="grid h-20 w-20 shrink-0 place-items-center overflow-hidden rounded-2xl bg-white p-0.5 shadow-md ring-1 ring-white/70"><img src={item.logo} alt={`${item.org} logo`} className="h-full w-full object-contain"/></div><div><div className="text-xs font-bold uppercase tracking-[.16em] text-hotpink">{item.period}</div><h2 className="mt-1 font-display text-xl font-bold md:text-2xl">{item.role}</h2><div className="mt-1 text-sm font-semibold text-muted-foreground">{item.org}</div></div></div><ul className="relative mt-5 space-y-2.5 text-sm leading-6 text-muted-foreground">{item.points.map(point=><li key={point} className="flex gap-3"><span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-hotpink"/><span>{point}</span></li>)}</ul></motion.article>
      </div></Reveal>)}</div>
    </section>
  </PageShell>;
}
function ProjectsPage() {
  const [activeCategory, setActiveCategory] = useState<"mobile" | "website" | "webapp">("mobile");
  const visibleProjects = projects.filter((project) => project.category === activeCategory).sort((a, b) => a.order - b.order);
  const filters = [
    { value: "mobile" as const, label: "Mobile apps", count: projects.filter((project) => project.category === "mobile").length },
    { value: "website" as const, label: "Websites", count: projects.filter((project) => project.category === "website").length },
    { value: "webapp" as const, label: "Web apps", count: projects.filter((project) => project.category === "webapp").length },
  ];

  return (
    <PageShell>
      <PageIntro
        eyebrow="Project library"
        title="Built for the web. Designed for mobile."
        copy="Explore product stories, interface previews, technologies, and the thinking behind each build."
      />

      <div className="sticky top-20 z-20 mb-8 flex justify-center md:top-24">
        <div className="glass grid w-full max-w-lg grid-cols-3 gap-1 rounded-full border border-border p-1.5 shadow-lg">
          {filters.map((filter) => (
            <button key={filter.value} type="button" aria-pressed={activeCategory === filter.value} onClick={() => setActiveCategory(filter.value)} className={`relative inline-flex min-w-0 items-center justify-center gap-1 rounded-full px-2 py-2 text-xs font-semibold transition sm:gap-2 sm:px-4 sm:text-sm ${activeCategory === filter.value ? "text-white" : "text-muted-foreground hover:text-foreground"}`}>
              {activeCategory === filter.value && <motion.span layoutId="project-category-slider" className="gradient-hero-bg absolute inset-0 rounded-full shadow-glow" transition={{ type: "spring", stiffness: 380, damping: 32 }} />}
              <span className="relative z-10">{filter.label}</span><span className={`relative z-10 grid h-5 min-w-5 place-items-center rounded-full px-1 text-[10px] ${activeCategory === filter.value ? "bg-white/20" : "bg-muted"}`}>{filter.count}</span>
            </button>
          ))}
        </div>
      </div>

      <motion.section layout className="grid gap-7">
        {visibleProjects.map((project, index) => {
          const isMobile = project.category === "mobile";
          const hasVideo = "videoSrc" in project;
          return (
            <motion.article layout key={project.name} initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.45, delay: index * 0.06 }} className="glass card-shadow group overflow-hidden rounded-3xl border border-border">
              <div className={`grid ${index % 2 === 1 ? "lg:grid-cols-[0.9fr_1.1fr]" : "lg:grid-cols-[1.1fr_0.9fr]"}`}>
                <div className={`relative min-h-80 overflow-hidden bg-muted p-5 md:min-h-104 md:p-8 ${index % 2 === 1 ? "lg:order-2" : ""}`}>
                  <div className={`absolute inset-0 opacity-90 ${index % 3 === 0 ? "gradient-hero-bg" : index % 3 === 1 ? "gradient-cool-bg" : "gradient-pink-bg"}`} />
                  <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(255,255,255,0.25),transparent_30%),radial-gradient(circle_at_80%_80%,rgba(255,255,255,0.18),transparent_32%)]" />

                  {hasVideo && isMobile ? (
                    <div className="relative flex h-full min-h-128 items-center justify-center py-6">
                      <motion.div aria-hidden="true" className="gradient-hero-bg absolute h-72 w-72 rounded-full opacity-45 blur-3xl" animate={{ scale: [0.9, 1.14, 0.9], rotate: [0, 90, 180] }} transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }} />
                      <motion.div aria-hidden="true" className="absolute h-80 w-80 rounded-full border border-white/25" animate={{ scale: [0.86, 1.08, 0.86], opacity: [0.2, 0.65, 0.2] }} transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }} />
                      <motion.div className="relative z-10 w-60 rounded-[3.5rem] bg-linear-to-b from-slate-700 via-slate-950 to-black p-2 shadow-[0_35px_80px_-22px_rgba(0,0,0,0.85)] md:w-68" animate={{ y: [0, -8, 0], rotate: [-1.5, 1, -1.5] }} whileHover={{ y: -12, rotate: 0, scale: 1.045 }} transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}>
                        <span className="absolute -left-1 top-24 h-12 w-1 rounded-l-full bg-slate-700" /><span className="absolute -left-1 top-40 h-16 w-1 rounded-l-full bg-slate-700" /><span className="absolute -right-1 top-32 h-20 w-1 rounded-r-full bg-slate-700" />
                        <div className="relative aspect-9/18.5 overflow-hidden rounded-[3rem] bg-black ring-1 ring-white/15">
                          <video src={project.videoSrc} controls autoPlay loop muted playsInline preload="metadata" className="h-full w-full bg-black object-cover">Your browser does not support the mobile project video.</video>
                          <div className="pointer-events-none absolute inset-y-0 left-0 w-1/3 bg-linear-to-r from-white/12 to-transparent opacity-60" />
                          <div className="pointer-events-none absolute left-1/2 top-2 h-6 w-24 -translate-x-1/2 rounded-full bg-slate-950 shadow-md"><span className="absolute right-3 top-1/2 h-1.5 w-1.5 -translate-y-1/2 rounded-full bg-slate-700" /></div>
                        </div>
                      </motion.div>
                      <motion.div aria-hidden="true" className="glass absolute left-0 top-16 z-20 rounded-full px-3 py-2 text-xs font-semibold text-white shadow-lg md:left-4" animate={{ y: [0, -10, 0] }} transition={{ duration: 4.2, repeat: Infinity }}>AI-powered tools</motion.div>
                      <motion.div aria-hidden="true" className="glass absolute bottom-20 right-0 z-20 rounded-full px-3 py-2 text-xs font-semibold text-white shadow-lg md:right-3" animate={{ y: [0, 10, 0] }} transition={{ duration: 4.8, repeat: Infinity }}>{project.name.startsWith("Imbewu") ? "Open Banking" : "Smart support"}</motion.div>
                      <div className="pointer-events-none absolute bottom-2 right-1 z-20 flex items-center gap-2 rounded-full bg-black/45 px-3 py-2 text-xs font-semibold text-white backdrop-blur-xl"><PlayCircle className="h-4 w-4 animate-pulse" /> Mobile walkthrough</div>
                    </div>
                  ) : hasVideo ? (
                    <div className="relative flex h-full items-center justify-center">
                      <div className="relative w-full max-w-2xl overflow-hidden rounded-2xl bg-slate-950 shadow-2xl transition duration-500 group-hover:-translate-y-1 group-hover:scale-[1.01]">
                        <div className="flex h-9 items-center gap-1.5 border-b border-white/10 px-3"><span className="h-2.5 w-2.5 rounded-full bg-red-400" /><span className="h-2.5 w-2.5 rounded-full bg-amber-400" /><span className="h-2.5 w-2.5 rounded-full bg-emerald-400" /><div className="ml-3 h-4 flex-1 rounded-full bg-white/10" /></div>
                        <video src={project.videoSrc} controls autoPlay loop muted playsInline preload="metadata" className="aspect-video w-full bg-black object-contain">Your browser does not support this project video.</video>
                      </div>
                    </div>
                  ) : isMobile ? (
                    <div className="relative mx-auto flex h-full max-w-sm items-center justify-center">
                      <div className="relative w-52 rotate-[-4deg] rounded-[2.8rem] border-[7px] border-slate-950 bg-white p-2 shadow-2xl transition duration-500 group-hover:-rotate-1 group-hover:scale-105 md:w-60">
                        <div className="aspect-9/17 overflow-hidden rounded-[2rem] bg-slate-950 p-4 text-white"><div className="mx-auto h-1.5 w-14 rounded-full bg-white/20" /><div className="mt-8 text-xs font-semibold uppercase tracking-[0.18em] text-teal">Learning companion</div><div className="mt-3 font-display text-2xl font-bold">Plan. Learn. Progress.</div><div className="mt-6 grid gap-2">{["Past papers", "Career paths", "Eligibility"].map((label) => <div key={label} className="rounded-xl bg-white/10 px-3 py-2 text-xs">{label}</div>)}</div></div>
                      </div>
                    </div>
                  ) : (
                    <div className="relative flex h-full items-center justify-center">
                      <div className="w-full max-w-xl overflow-hidden rounded-2xl bg-white shadow-2xl transition duration-500 group-hover:-translate-y-2 group-hover:scale-[1.02] dark:bg-slate-900"><div className="flex h-9 items-center gap-1.5 border-b border-black/10 px-3 dark:border-white/10"><span className="h-2.5 w-2.5 rounded-full bg-red-400" /><span className="h-2.5 w-2.5 rounded-full bg-amber-400" /><span className="h-2.5 w-2.5 rounded-full bg-emerald-400" /></div><div className="aspect-video p-5"><div className="gradient-hero-bg h-2/5 rounded-xl p-4 text-white"><div className="font-display text-xl font-bold">Project preview</div></div><div className="mt-4 grid grid-cols-3 gap-3">{[0, 1, 2].map((item) => <div key={item} className="aspect-4/3 rounded-lg bg-black/5 dark:bg-white/10" />)}</div></div></div>
                      <div className="absolute bottom-1 right-1 flex items-center gap-2 rounded-full bg-white/20 px-3 py-2 text-xs font-semibold text-white backdrop-blur-xl"><Images className="h-4 w-4" /> Screenshot gallery</div>
                    </div>
                  )}
                </div>

                <div className={`flex flex-col justify-center p-6 md:p-10 lg:p-12 ${index % 2 === 1 ? "lg:order-1" : ""}`}>
                  <div className="flex flex-wrap items-center gap-3">
                    <span className="inline-flex items-center gap-2 rounded-full bg-hotpink/10 px-3 py-1.5 text-xs font-semibold uppercase tracking-[0.16em] text-hotpink">{isMobile ? <Smartphone className="h-4 w-4" /> : <Globe2 className="h-4 w-4" />}{isMobile ? "Mobile app" : project.category === "website" ? "Website" : "Web app"}</span>
                    {project.isHackathon && <span className="inline-flex items-center gap-1.5 rounded-full bg-violet/10 px-3 py-1.5 text-xs font-semibold text-violet"><Trophy className="h-3.5 w-3.5" /> Hackathon</span>}
                    {project.featured && <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-400/15 px-3 py-1.5 text-xs font-semibold text-amber-500"><Trophy className="h-3.5 w-3.5" /> Award winner</span>}
                    {"collaboration" in project && <span className="inline-flex items-center gap-1.5 rounded-full bg-teal/10 px-3 py-1.5 text-xs font-semibold text-teal"><GitBranch className="h-3.5 w-3.5" /> {project.collaboration}</span>}
                  </div>
                  <div className="mt-5 text-sm font-semibold text-muted-foreground">{project.tag}</div>
                  <h2 className="mt-2 font-display text-3xl font-bold leading-tight md:text-4xl">{project.name}</h2>
                  <p className="mt-5 text-base leading-8 text-muted-foreground">{project.desc}</p>
                  <div className="mt-6 flex flex-wrap gap-2">{project.stack.map((tech) => <span key={tech} className="rounded-full border border-border bg-background/70 px-3 py-1.5 text-xs font-semibold text-muted-foreground">{tech}</span>)}</div>
                  <a href={project.href} target="_blank" rel="noreferrer" className="group/link mt-8 inline-flex w-fit items-center gap-2 rounded-full bg-foreground px-5 py-3 text-sm font-semibold text-background transition hover:bg-hotpink hover:text-white">{"liveLabel" in project ? project.liveLabel : "View project"} <ExternalLink className="h-4 w-4 transition-transform group-hover/link:-translate-y-0.5 group-hover/link:translate-x-0.5" /></a>
                </div>
              </div>
            </motion.article>
          );
        })}
      </motion.section>
    </PageShell>
  );
}
const coverLetterParagraphs = [
  "Thank you for taking the time to visit my portfolio. I'm a Frontend and Mobile App Developer with a completed NQF Level 8 Honours in Information Systems from the University of Fort Hare, alongside industry experience at Appimate and through a MICTSETA Systems Development Learnership. I enjoy turning ideas into responsive web applications and cross-platform mobile experiences that are intuitive, scalable, and built with users in mind.",

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
