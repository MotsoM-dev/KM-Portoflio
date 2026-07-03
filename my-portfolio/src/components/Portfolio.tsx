import { motion, useScroll, useSpring, useInView } from "motion/react";
import { useRef, type ReactNode } from "react";
import {
  Mail,
  Phone,
  MapPin,
  Moon,
  Sun,
  ArrowRight,
  Sparkles,
  Code2,
  Smartphone,
  Palette,
  Database,
  GitBranch,
  GraduationCap,
  Briefcase,
  Award,
  Rocket,
  ExternalLink,
} from "lucide-react";
import { Github, Linkedin } from "./brand-icons";
import { useTheme } from "@/hooks/use-theme";

const skills = [
  { icon: Code2, title: "Frontend", items: ["HTML5", "CSS3", "JavaScript (ES6+)", "React", "Responsive", "A11y (WCAG)"] },
  { icon: Smartphone, title: "Mobile", items: ["React Native", "NativeWind", "Xamarin", "Cross-platform", "Mobile UI/UX"] },
  { icon: Palette, title: "Design", items: ["Figma", "Wireframes", "Prototypes", "UX Writing", "Usability Testing"] },
  { icon: Database, title: "Data & Backend", items: ["MSSQL", "SQL", "REST/JSON", "C#/.NET basics"] },
  { icon: GitBranch, title: "Tooling", items: ["Git", "GitHub", "Agile", "Tailwind CSS", "Bootstrap"] },
  { icon: Sparkles, title: "Soft skills", items: ["Tutoring", "Documentation", "Collaboration", "Problem solving"] },
];

const experience = [
  { role: "Frontend & Mobile App Developer", org: "Appimate", period: "2025 — Present",
    points: [
      "Build responsive frontends with HTML5, CSS3, JavaScript & React.",
      "Ship cross-platform mobile apps using React Native + NativeWind.",
      "Translate designs into production-ready code with the design & backend team.",
      "Contribute to code reviews and agile delivery.",
    ] },
  { role: "Systems Development Learner", org: "MICTSETA Learnership", period: "2025 — Present",
    points: [
      "Work-integrated training across programming, software design & project delivery.",
      "Apply IS theory to hands-on development under industry mentorship.",
      "Sharpen debugging and SDLC skills through real projects.",
    ] },
  { role: "Tutor — Information Systems", org: "University of Fort Hare", period: "2024 — Present",
    points: [
      "Tutor first-years in data management, systems analysis, IT infra & UI/UX.",
      "Turn complex concepts into clear, accessible explanations.",
      "Guide project documentation & prototyping to lift class performance.",
    ] },
];

const projects = [
  { name: "FutureTrack", tag: "Web · Education",
    desc: "Web platform of past papers, study resources, career exploration and a university eligibility checker for SA Grade 10–12 learners.",
    stack: ["React", "UX Writing", "IA"] },
  { name: "Healthcare System", tag: "Mobile · Xamarin + MSSQL",
    desc: "Mobile workflow to capture patient records, give clinicians access, and auto-email digital prescriptions and health tips.",
    stack: ["Xamarin", "MSSQL", "Forms"] },
  { name: "Cortex Hub — Human Rights Hackathon", tag: "Web · Civic Tech",
    desc: "Front-end and issue submission form that lets rural schools report infrastructure issues for faster resolution.",
    stack: ["React", "Forms", "UI"] },
  { name: "Telkom10x — Network Support Portal", tag: "Hackathon · Eastern Cape",
    desc: "Self-service troubleshooting concept with an AI assistant and community forum, focused on front-end flows.",
    stack: ["Concept", "AI UX", "Frontend"] },
];

const certs = [
  "Microsoft AI Fluency",
  "IBM Python for Data Science",
  "FNB App Academy — Full-Stack (exposure)",
];

function Reveal({ children, delay = 0 }: { children: ReactNode; delay?: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });
  return (
    <motion.div ref={ref}
      initial={{ opacity: 0, y: 30 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, delay, ease: [0.22, 1, 0.36, 1] }}>
      {children}
    </motion.div>
  );
}

export default function Portfolio() {
  const { theme, toggle } = useTheme();
  const { scrollYProgress } = useScroll();
  const progress = useSpring(scrollYProgress, { stiffness: 120, damping: 30 });

  return (
    <div className="relative min-h-screen overflow-x-hidden bg-background text-foreground">
      <motion.div style={{ scaleX: progress }}
        className="gradient-hero-bg fixed left-0 top-0 z-50 h-1 w-full origin-left" />

      <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
        <div className="animate-blob absolute -left-32 top-10 h-96 w-96 rounded-full bg-hotpink/30 blur-3xl" />
        <div className="animate-blob absolute right-0 top-1/3 h-96 w-96 rounded-full bg-teal/25 blur-3xl" style={{ animationDelay: "3s" }} />
        <div className="animate-blob absolute bottom-0 left-1/3 h-96 w-96 rounded-full bg-violet/25 blur-3xl" style={{ animationDelay: "6s" }} />
      </div>

      <header className="glass sticky top-0 z-40 border-b border-border">
        <nav className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
          <a href="#top" className="flex items-center gap-2 font-display font-bold">
            <span className="gradient-hero-bg grid h-8 w-8 place-items-center rounded-lg text-primary-foreground">K</span>
            <span className="hidden sm:inline">Kgomotso.dev</span>
          </a>
          <div className="hidden items-center gap-8 text-sm font-medium md:flex">
            {["about", "skills", "work", "projects", "contact"].map((s) => (
              <a key={s} href={`#${s}`} className="capitalize text-muted-foreground transition-colors hover:text-foreground">{s}</a>
            ))}
          </div>
          <button onClick={toggle} aria-label="Toggle theme"
            className="grid h-10 w-10 place-items-center rounded-full border border-border bg-card transition-transform hover:scale-110">
            {theme === "dark" ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
          </button>
        </nav>
      </header>

      <section id="top" className="relative mx-auto max-w-6xl px-6 pb-24 pt-20 md:pt-32">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}
          className="flex flex-col items-start gap-6">
          <span className="glass inline-flex items-center gap-2 rounded-full border border-border px-4 py-1.5 text-xs font-medium">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-hotpink opacity-75" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-hotpink" />
            </span>
            Available for opportunities · South Africa
          </span>

          <h1 className="font-display text-5xl font-bold leading-[1.05] md:text-7xl lg:text-8xl">
            Hi, I'm <span className="gradient-text">Kgomotso</span>.<br />
            I build{" "}
            <span className="relative inline-block">
              <span className="gradient-text">delightful</span>
              <motion.span initial={{ scaleX: 0 }} animate={{ scaleX: 1 }} transition={{ delay: 0.8, duration: 0.6 }}
                className="gradient-hero-bg absolute -bottom-1 left-0 h-1 w-full origin-left rounded-full" />
            </span>{" "}
            web & mobile apps.
          </h1>

          <p className="max-w-2xl text-lg text-muted-foreground md:text-xl">
            Frontend & Mobile App Developer at <span className="font-semibold text-foreground">Appimate</span>,
            BCom Honours (Information Systems) at the University of Fort Hare. I turn ideas into accessible,
            performant React and React Native experiences.
          </p>

          <div className="flex flex-wrap gap-3">
            <a href="#projects"
              className="gradient-hero-bg glow-shadow group inline-flex items-center gap-2 rounded-full px-6 py-3 font-medium text-primary-foreground transition-transform hover:scale-105">
              See my work
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </a>
            <a href="#contact"
              className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-6 py-3 font-medium transition-colors hover:bg-muted">
              Get in touch
            </a>
          </div>

          <div className="mt-4 flex items-center gap-5 text-muted-foreground">
            <a href="https://github.com/MotsoM-dev" target="_blank" rel="noreferrer" className="transition-colors hover:text-hotpink"><Github className="h-5 w-5" /></a>
            <a href="https://linkedin.com/in/kgomotso-mathombo-a848a5386" target="_blank" rel="noreferrer" className="transition-colors hover:text-hotpink"><Linkedin className="h-5 w-5" /></a>
            <a href="mailto:kgomotsomathombo@gmail.com" className="transition-colors hover:text-hotpink"><Mail className="h-5 w-5" /></a>
          </div>
        </motion.div>

        <div className="mt-20 grid grid-cols-2 gap-4 md:grid-cols-4">
          {[{ k: "2+", v: "Years tutoring" }, { k: "4", v: "Shipped projects" },
            { k: "3", v: "Hackathons" }, { k: "∞", v: "Curiosity" }].map((s, i) => (
            <Reveal key={s.v} delay={i * 0.1}>
              <div className="glass card-shadow rounded-2xl border border-border p-5">
                <div className="gradient-text font-display text-3xl font-bold">{s.k}</div>
                <div className="mt-1 text-sm text-muted-foreground">{s.v}</div>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      <Section id="about" eyebrow="About" title="Curious builder. Careful communicator.">
        <div className="grid gap-8 md:grid-cols-5">
          <Reveal>
            <p className="md:col-span-3 text-lg leading-relaxed text-muted-foreground">
              I'm a detail-oriented Frontend & Mobile App Developer completing my BCom Honours in
              Information Systems. At Appimate I build responsive web interfaces and cross-platform
              mobile apps with React and React Native. Two years of tutoring taught me to make
              complex ideas feel simple — that same instinct shapes the interfaces I build.
            </p>
          </Reveal>
          <Reveal delay={0.15}>
            <div className="card-shadow rounded-2xl border border-border bg-card p-6 md:col-span-2">
              <ul className="space-y-3 text-sm">
                <Detail icon={MapPin} label="Based in" value="South Africa" />
                <Detail icon={GraduationCap} label="Studying" value="BCom Honours — Information Systems" />
                <Detail icon={Briefcase} label="Currently" value="Frontend & Mobile @ Appimate" />
                <Detail icon={Sparkles} label="Languages" value="English · isiXhosa" />
              </ul>
            </div>
          </Reveal>
        </div>
      </Section>

      <Section id="skills" eyebrow="Core skills" title="A stack I keep sharpening.">
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {skills.map((s, i) => (
            <Reveal key={s.title} delay={i * 0.05}>
              <motion.div whileHover={{ y: -6 }}
                className="card-shadow group relative overflow-hidden rounded-2xl border border-border bg-card p-6 transition-shadow hover:shadow-lg">
                <div className="gradient-hero-bg absolute -right-10 -top-10 h-32 w-32 rounded-full opacity-0 blur-2xl transition-opacity group-hover:opacity-40" />
                <div className="gradient-pink-bg mb-4 grid h-11 w-11 place-items-center rounded-xl text-white">
                  <s.icon className="h-5 w-5" />
                </div>
                <h3 className="font-display text-lg font-semibold">{s.title}</h3>
                <div className="mt-3 flex flex-wrap gap-1.5">
                  {s.items.map((i) => (
                    <span key={i} className="rounded-full border border-border bg-background/60 px-2.5 py-1 text-xs text-muted-foreground">{i}</span>
                  ))}
                </div>
              </motion.div>
            </Reveal>
          ))}
        </div>
      </Section>

      <Section id="work" eyebrow="Experience" title="Where I've been building.">
        <div className="relative">
          <div className="gradient-hero-bg absolute left-3 top-2 h-full w-0.5 md:left-1/2 md:-translate-x-1/2" />
          <div className="space-y-10">
            {experience.map((e, i) => (
              <Reveal key={e.role} delay={i * 0.08}>
                <div className={`relative flex items-start gap-6 md:justify-between ${i % 2 ? "md:flex-row-reverse" : ""}`}>
                  <div className="gradient-hero-bg absolute left-3 top-3 h-3 w-3 -translate-x-1/2 rounded-full ring-4 ring-background md:left-1/2" />
                  <div className="ml-10 flex-1 md:ml-0 md:max-w-[45%]">
                    <div className="card-shadow rounded-2xl border border-border bg-card p-6">
                      <div className="text-xs font-medium uppercase tracking-wider text-hotpink">{e.period}</div>
                      <h3 className="mt-1 font-display text-xl font-semibold">{e.role}</h3>
                      <div className="text-sm text-muted-foreground">{e.org}</div>
                      <ul className="mt-4 space-y-2 text-sm text-muted-foreground">
                        {e.points.map((p) => (
                          <li key={p} className="flex gap-2">
                            <span className="mt-2 h-1 w-1 shrink-0 rounded-full bg-hotpink" />
                            <span>{p}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </Section>

      <Section id="projects" eyebrow="Selected projects" title="Things I've shipped and prototyped.">
        <div className="grid gap-6 md:grid-cols-2">
          {projects.map((p, i) => (
            <Reveal key={p.name} delay={i * 0.08}>
              <motion.article whileHover={{ y: -6 }}
                className="card-shadow group relative flex h-full flex-col overflow-hidden rounded-3xl border border-border bg-card p-8">
                <div className="gradient-cool-bg absolute -right-16 -top-16 h-40 w-40 rounded-full opacity-30 blur-2xl transition-opacity group-hover:opacity-60" />
                <div className="mb-3 flex items-center gap-2">
                  <Rocket className="h-4 w-4 text-hotpink" />
                  <span className="text-xs font-medium uppercase tracking-wider text-muted-foreground">{p.tag}</span>
                </div>
                <h3 className="font-display text-2xl font-semibold">{p.name}</h3>
                <p className="mt-3 text-muted-foreground">{p.desc}</p>
                <div className="mt-5 flex flex-wrap gap-2">
                  {p.stack.map((s) => (
                    <span key={s} className="gradient-pink-bg rounded-full px-3 py-1 text-xs font-medium text-white">{s}</span>
                  ))}
                </div>
                <div className="mt-6 inline-flex items-center gap-1.5 text-sm font-medium text-hotpink opacity-0 transition-opacity group-hover:opacity-100">
                  Case study coming soon <ExternalLink className="h-3.5 w-3.5" />
                </div>
              </motion.article>
            </Reveal>
          ))}
        </div>
      </Section>

      <Section id="certs" eyebrow="Learning" title="Certifications & training.">
        <div className="grid gap-4 sm:grid-cols-3">
          {certs.map((c, i) => (
            <Reveal key={c} delay={i * 0.08}>
              <div className="card-shadow flex items-center gap-3 rounded-2xl border border-border bg-card p-5">
                <div className="gradient-cool-bg grid h-10 w-10 place-items-center rounded-xl text-white">
                  <Award className="h-5 w-5" />
                </div>
                <div className="text-sm font-medium">{c}</div>
              </div>
            </Reveal>
          ))}
        </div>
      </Section>

      <Section id="contact" eyebrow="Contact" title="Let's build something.">
        <Reveal>
          <div className="gradient-hero-bg glow-shadow relative overflow-hidden rounded-3xl p-10 text-primary-foreground md:p-16">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(255,255,255,0.25),transparent_50%)]" />
            <div className="relative grid gap-8 md:grid-cols-2 md:items-center">
              <div>
                <h3 className="font-display text-3xl font-bold md:text-4xl">Have a project or a role in mind?</h3>
                <p className="mt-3 max-w-md text-primary-foreground/85">
                  I'm open to junior frontend & mobile roles, freelance work, and collaborations.
                  I usually reply within a day.
                </p>
              </div>
              <div className="flex flex-col gap-3">
                <ContactRow icon={Mail} label="kgomotsomathombo@gmail.com" href="mailto:kgomotsomathombo@gmail.com" />
                <ContactRow icon={Phone} label="071 642 3985" href="tel:+27716423985" />
                <ContactRow icon={Github} label="github.com/MotsoM-dev" href="https://github.com/MotsoM-dev" />
                <ContactRow icon={Linkedin} label="linkedin.com/in/kgomotso-mathombo" href="https://linkedin.com/in/kgomotso-mathombo-a848a5386" />
              </div>
            </div>
          </div>
        </Reveal>
      </Section>

      <footer className="border-t border-border py-10">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-3 px-6 text-sm text-muted-foreground md:flex-row">
          <div>© {new Date().getFullYear()} Kgomotso Mathombo. Built with React & lots of pink.</div>
          <div className="flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-hotpink" /> Crafted in South Africa
          </div>
        </div>
      </footer>
    </div>
  );
}

function Section({ id, eyebrow, title, children }: { id: string; eyebrow: string; title: string; children: ReactNode }) {
  return (
    <section id={id} className="mx-auto max-w-6xl px-6 py-20 md:py-28">
      <Reveal>
        <div className="mb-10 flex flex-col gap-2">
          <span className="text-sm font-semibold uppercase tracking-[0.2em] text-hotpink">{eyebrow}</span>
          <h2 className="font-display text-3xl font-bold md:text-5xl">{title}</h2>
        </div>
      </Reveal>
      {children}
    </section>
  );
}

function Detail({ icon: Icon, label, value }: { icon: typeof MapPin; label: string; value: string }) {
  return (
    <li className="flex items-start gap-3">
      <div className="mt-0.5 grid h-8 w-8 shrink-0 place-items-center rounded-lg bg-muted">
        <Icon className="h-4 w-4 text-hotpink" />
      </div>
      <div>
        <div className="text-xs uppercase tracking-wider text-muted-foreground">{label}</div>
        <div className="font-medium">{value}</div>
      </div>
    </li>
  );
}

function ContactRow({ icon: Icon, label, href }: { icon: typeof Mail; label: string; href: string }) {
  return (
    <a href={href} target={href.startsWith("http") ? "_blank" : undefined} rel="noreferrer"
      className="glass group flex items-center gap-3 rounded-xl border border-white/20 px-4 py-3 text-sm font-medium transition-transform hover:scale-[1.02]">
      <Icon className="h-4 w-4" />
      <span className="flex-1 truncate">{label}</span>
      <ArrowRight className="h-4 w-4 opacity-0 transition-opacity group-hover:opacity-100" />
    </a>
  );
}
