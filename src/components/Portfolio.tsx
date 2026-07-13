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
  GraduationCap,
  Linkedin,
  Mail,
  MapPin,
  Moon,
  Palette,
  Phone,
  Rocket,
  Smartphone,
  Sparkles,
  Sun,
  Trophy,
} from "lucide-react";
import { useTheme } from "@/hooks/use-theme";
import Blog from "./Blog";
import Cursor from "./Cursor";
import FlipCard from "./FlipCard";
import MovingBackground from "./MovingBackground";

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
  { icon: Code2, title: "Frontend", items: ["HTML5", "CSS3", "JavaScript", "React", "Next.js", "A11y"] },
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
    points: [
      "Build responsive frontends with HTML5, CSS3, JavaScript, React, and Next.js.",
      "Ship cross-platform mobile apps using React Native and NativeWind.",
      "Translate designs into production-ready code with design and backend teams.",
      "Contribute to reviews, debugging, and agile delivery.",
    ],
  },
  {
    role: "Systems Development Learner",
    org: "MICTSETA Learnership",
    period: "2025 - Present",
    points: [
      "Work-integrated training across programming, software design, and project delivery.",
      "Apply information systems theory to hands-on development under industry mentorship.",
      "Sharpen debugging and SDLC skills through real projects.",
    ],
  },
  {
    role: "Tutor - Information Systems",
    org: "University of Fort Hare",
    period: "2024 - Present",
    points: [
      "Tutor first-years in data management, systems analysis, IT infrastructure, and UI/UX.",
      "Turn complex concepts into clear, accessible explanations.",
      "Guide project documentation and prototyping to lift class performance.",
    ],
  },
];

const projects = [
  {
    name: "UCT Fintech Winter School Hackathon",
    tag: "2nd Place - Fintech Hackathon",
    desc: "Won 2nd place with a marketplace concept that helps MSMEs and funders discover each other, connect, and build funding relationships through a trusted network.",
    stack: ["Fintech", "MSME Marketplace", "Funding Access", "Networking"],
    featured: true,
  },
  {
    name: "FutureTrack",
    tag: "Web - Education",
    desc: "Web platform of past papers, study resources, career exploration, and a university eligibility checker for South African Grade 10-12 learners.",
    stack: ["React", "UX Writing", "IA"],
  },

  {
    name: "Cortex Hub - Human Rights Hackathon",
    tag: "Web - Civic Tech",
    desc: "Front-end and issue submission form that lets rural schools report infrastructure issues for faster resolution.",
    stack: ["React", "Forms", "UI"],
  },
  {
    name: "Telkom10x - Network Support Portal",
    tag: "2nd Place - Telkom Hackathon",
    desc: "Won 2nd place for a self-service network support portal concept with an AI assistant and community forum, focused on practical front-end flows for faster troubleshooting.",
    stack: ["2nd Place", "Concept", "AI UX", "Frontend"],
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

  return (
    <header className="glass fixed left-0 right-0 top-0 z-40 border-b border-border backdrop-blur-xl">
      <nav className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-3 md:px-8">
        <Link href="/" className="flex items-center gap-2 font-display text-lg font-bold group">
          <span className="gradient-hero-bg grid h-10 w-10 place-items-center rounded-xl text-primary-foreground shadow-glow transition-transform group-hover:scale-105">
            K
          </span>
          <span className="hidden bg-linear-to-r from-hotpink to-violet bg-clip-text text-transparent sm:inline">
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
        </div>
      </nav>
      <div className="flex gap-2 overflow-x-auto border-t border-border/60 px-4 py-2 md:hidden">
        {navItems.map((item) => {
          const active = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`shrink-0 rounded-full px-3 py-1.5 text-xs font-medium ${
                active ? "gradient-hero-bg text-primary-foreground" : "border border-border bg-card text-muted-foreground"
              }`}
            >
              {item.label}
            </Link>
          );
        })}
      </div>
    </header>
  );
}

function HomePage() {
  const typedWord = useTypewriter(words);
  const featuredProject = projects[0];

  return (
    <PageShell>
      <div className="grid min-h-[calc(100vh-8rem)] items-center gap-10 lg:grid-cols-[1.1fr_0.9fr]">
        <Reveal>
          <div className="flex flex-col items-start gap-6">
            <span className="glass inline-flex items-center gap-2 rounded-full border border-border px-4 py-1.5 text-xs font-medium">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-hotpink opacity-75" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-hotpink" />
              </span>
              2x 2nd Place Hackathon Winner
            </span>
            <h1 className="font-display text-5xl font-bold leading-[1.05] md:text-7xl lg:text-8xl">
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
            <p className="max-w-2xl text-lg leading-8 text-muted-foreground md:text-xl">
              Frontend & Mobile App Developer at <span className="font-semibold text-foreground">Appimate</span>, BCom
              Honours Information Systems student, and hackathon-tested builder focused on useful products with clean
              interfaces.
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
            <div className="mt-2 flex items-center gap-5 text-muted-foreground">
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
          <div className="grid gap-5">
            <motion.article
              whileHover={{ y: -6 }}
              className="glass card-shadow relative overflow-hidden rounded-2xl border border-border p-6 md:p-8"
            >
              <div className="gradient-cool-bg absolute -right-20 -top-20 h-52 w-52 rounded-full opacity-35 blur-3xl" />
              <div className="relative flex items-start gap-4">
                <div className="gradient-pink-bg grid h-12 w-12 shrink-0 place-items-center rounded-xl text-white">
                  <Trophy className="h-6 w-6" />
                </div>
                <div>
                  <div className="text-xs font-semibold uppercase tracking-[0.2em] text-hotpink">Recent win</div>
                  <h2 className="mt-2 font-display text-2xl font-bold">{featuredProject.name}</h2>
                  <p className="mt-3 leading-7 text-muted-foreground">{featuredProject.desc}</p>
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
                  <div className="glass card-shadow rounded-2xl border border-border p-5 text-center">
                    <div className="gradient-text font-display text-3xl font-bold">{stat.k}</div>
                    <div className="mt-1 text-sm text-muted-foreground">{stat.v}</div>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </Reveal>
      </div>
    </PageShell>
  );
}

function AboutPage() {
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
            <p className="mt-5">
              I'm a Frontend and Mobile App Developer from South Africa currently completing a BCom Honours in Information
              Systems. My passion lies at the intersection of technology, creativity, and problem-solving, where clean code
              meets thoughtful design to create products that make a genuine impact.
            </p>
            <p className="mt-4">
              Beyond writing code, I'm driven by curiosity. Whether I'm exploring cloud technologies, cybersecurity,
              artificial intelligence, or emerging software trends, I'm constantly investing in becoming a stronger engineer.
              I believe great developers never stop learning, and every project is an opportunity to improve both technically
              and creatively.
            </p>
            <p className="mt-4">
              My experience spans industry development, systems development training, university tutoring, and collaborative
              hackathons, giving me the ability to communicate technical ideas clearly, adapt quickly, and thrive in fast-paced
              environments. I enjoy working with diverse teams, solving complex problems, and building software that delivers
              measurable value.
            </p>
            <p className="mt-4">
              What truly defines me is my mindset. I approach challenges with discipline, ownership, and a commitment to
              excellence. I'm not simply looking to write code. I'm looking to contribute to products that improve people's
              lives, collaborate with ambitious teams across the world, and continue growing into a software engineer capable
              of leading impactful projects.
            </p>
            <p className="mt-4 font-medium text-foreground">
              I'm excited by opportunities that challenge me, inspire innovation, and allow me to build technology that matters.
            </p>
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

function ExperiencePage() {
  return (
    <PageShell>
      <PageIntro
        eyebrow="Experience"
        title="Where I've been building."
        copy="A blend of industry work, structured learning, teaching, and competitive product-building experience."
      />
      <div className="grid gap-6 lg:grid-cols-[0.75fr_1.25fr]">
        <Reveal>
          <div className="gradient-hero-bg glow-shadow rounded-2xl p-8 text-primary-foreground">
            <Trophy className="h-9 w-9" />
            <h2 className="mt-5 font-display text-3xl font-bold">2nd Place, UCT Fintech Winter School Hackathon</h2>
            <p className="mt-4 leading-7 text-primary-foreground/85">
              I designed a marketplace for MSMEs and funders to connect, network, and move funding conversations from
              scattered discovery into a more trusted digital environment.
            </p>
          </div>
        </Reveal>
        <div className="space-y-5">
          {experience.map((item, index) => (
            <Reveal key={item.role} delay={index * 0.08}>
              <article className="glass card-shadow rounded-2xl border border-border p-6">
                <div className="text-xs font-medium uppercase tracking-wider text-hotpink">{item.period}</div>
                <h2 className="mt-1 font-display text-xl font-semibold">{item.role}</h2>
                <div className="text-sm text-muted-foreground">{item.org}</div>
                <ul className="mt-4 space-y-2 text-sm text-muted-foreground">
                  {item.points.map((point) => (
                    <li key={point} className="flex gap-2">
                      <span className="mt-2 h-1 w-1 shrink-0 rounded-full bg-hotpink" />
                      <span>{point}</span>
                    </li>
                  ))}
                </ul>
              </article>
            </Reveal>
          ))}
        </div>
      </div>
    </PageShell>
  );
}

function ProjectsPage() {
  return (
    <PageShell>
      <PageIntro
        eyebrow="Selected projects"
        title="Things I've shipped, prototyped, and pitched."
        copy="A portfolio of practical interfaces, civic ideas, mobile workflows, and fintech problem-solving."
      />
      <div className="grid gap-6 md:grid-cols-2">
        {projects.map((project, index) => (
          <Reveal key={project.name} delay={index * 0.06}>
            <motion.article
              whileHover={{ y: -6 }}
              className={`glass card-shadow group relative flex h-full flex-col overflow-hidden rounded-2xl border p-8 ${
                project.featured ? "border-hotpink/60 md:col-span-2" : "border-border"
              }`}
            >
              <div className="gradient-cool-bg absolute -right-16 -top-16 h-40 w-40 rounded-full opacity-30 blur-2xl transition-opacity group-hover:opacity-60" />
              <div className="relative mb-3 flex items-center gap-2">
                {project.featured ? <Trophy className="h-4 w-4 text-hotpink" /> : <Rocket className="h-4 w-4 text-hotpink" />}
                <span className="text-xs font-medium uppercase tracking-wider text-muted-foreground">{project.tag}</span>
              </div>
              <h2 className="relative font-display text-2xl font-semibold md:text-3xl">{project.name}</h2>
              <p className="relative mt-3 flex-1 leading-7 text-muted-foreground">{project.desc}</p>
              <div className="relative mt-5 flex flex-wrap gap-2">
                {project.stack.map((item) => (
                  <span key={item} className="gradient-pink-bg rounded-full px-3 py-1 text-xs font-medium text-white">
                    {item}
                  </span>
                ))}
              </div>
              <div className="relative mt-6 inline-flex items-center gap-1.5 text-sm font-medium text-hotpink opacity-0 transition-opacity group-hover:opacity-100">
                Case study coming soon <ExternalLink className="h-3.5 w-3.5" />
              </div>
            </motion.article>
          </Reveal>
        ))}
      </div>
    </PageShell>
  );
}

const coverLetterParagraphs = [
  "I am excited to apply for the remote opportunity at your company. As a Frontend and Mobile App Developer currently completing my BCom Honours in Information Systems, I have built a strong foundation in developing responsive web applications, cross-platform mobile solutions, and user-focused digital experiences. Alongside my academic journey, I am gaining practical industry experience as a Frontend and Mobile App Developer at Appimate while completing a MICTSETA Systems Development Learnership, allowing me to combine technical knowledge with real-world software development practices.",
  "What sets me apart is not only my technical ability but also my commitment to continuous learning. I thrive in environments where I can solve problems, collaborate with diverse teams, and quickly adapt to new technologies. Working in agile environments has taught me how to communicate effectively, manage priorities, and consistently deliver quality work, whether independently or as part of a distributed team.",
  "Throughout my experience, I have developed responsive web interfaces using React, JavaScript, HTML, and CSS, while also building mobile applications with React Native. I enjoy transforming designs into intuitive user experiences and writing clean, maintainable code that contributes to scalable products. My background in tutoring Information Systems has further strengthened my communication skills, patience, and ability to explain technical concepts clearly, qualities that have proven invaluable when collaborating with designers, developers, and stakeholders.",
  "I am particularly drawn to remote work because it rewards accountability, discipline, and results. I am highly organized, self-motivated, and comfortable managing my workload independently while maintaining clear communication across teams and time zones. I genuinely enjoy learning new technologies and am always looking for opportunities to improve both my technical and professional skills.",
  "Beyond my professional experience, I have participated in several software development projects and hackathons where I collaborated with multidisciplinary teams to build functional solutions under tight deadlines. These experiences reinforced my ability to think critically, adapt quickly, and remain calm under pressure while delivering meaningful outcomes.",
  "I am eager to contribute my technical skills, curiosity, and strong work ethic to a company that values innovation, collaboration, and continuous growth. I am confident that my combination of academic achievement, industry experience, and passion for technology would make me a valuable addition to your remote team.",
  "Thank you for taking the time to consider my application. I would welcome the opportunity to discuss how my skills and enthusiasm can contribute to your organization. I look forward to hearing from you.",
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
      <Footer />
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