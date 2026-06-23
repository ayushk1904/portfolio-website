import { useState, useEffect, useMemo } from "react";
import {
  Github,
  Linkedin,
  Mail,
  Phone,
  Download,
  Menu,
  X,
  Moon,
  Sun,
  ArrowUp,
  ChevronRight,
  Code2,
  Brain,
  Layers,
  Database,
  Terminal,
  Cpu,
  Globe,
  BookOpen,
  Target,
  Send,
  MapPin,
  CheckCircle,
} from "lucide-react";

const ASSET_BASE = `${import.meta.env.BASE_URL}assets/`;

function assetPath(fileName: string) {
  return `${ASSET_BASE}${encodeURIComponent(fileName)}`;
}

const PROFILE = {
  name: "Ayush Kamble",
  email: "kambleayush69@gmail.com",
  phone: "7249268207",
  location: "India",
  githubUrl: "https://ayushk1904.github.io/portfolio-website/",
  githubLabel: "ayushk1904.github.io/portfolio-website",
  linkedinUrl: "https://www.linkedin.com/in/ayush-kamble-172946268",
  linkedinLabel: "linkedin.com/in/ayush-kamble-172946268",
  resumePath: assetPath("resume.pdf"),
};

// ---------- Typing animation hook ----------
function useTypingAnimation(words: string[], speed = 80, pause = 1800) {
  const [displayed, setDisplayed] = useState("");
  const [wordIdx, setWordIdx] = useState(0);
  const [charIdx, setCharIdx] = useState(0);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    const current = words[wordIdx];
    let timeout: ReturnType<typeof setTimeout>;

    if (!deleting && charIdx < current.length) {
      timeout = setTimeout(() => setCharIdx((c) => c + 1), speed);
    } else if (!deleting && charIdx === current.length) {
      timeout = setTimeout(() => setDeleting(true), pause);
    } else if (deleting && charIdx > 0) {
      timeout = setTimeout(() => setCharIdx((c) => c - 1), speed / 2);
    } else if (deleting && charIdx === 0) {
      setDeleting(false);
      setWordIdx((w) => (w + 1) % words.length);
    }

    setDisplayed(current.slice(0, charIdx));
    return () => clearTimeout(timeout);
  }, [charIdx, deleting, wordIdx, words, speed, pause]);

  return displayed;
}

// ---------- Scroll reveal hook ----------
function useScrollReveal() {
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.add("revealed");
          }
        });
      },
      { threshold: 0.12 }
    );
    document.querySelectorAll(".reveal").forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);
}

// ---------- Active section hook ----------
function useActiveSection(ids: string[]) {
  const [active, setActive] = useState("home");

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) setActive(e.target.id);
        });
      },
      { rootMargin: "-40% 0px -50% 0px" }
    );
    ids.forEach((id) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });
    return () => observer.disconnect();
  }, [ids]);

  return active;
}

// ---------- Floating particle ----------
type ParticleStyle = {
  left: string;
  top: string;
  animationDelay: string;
  animationDuration: string;
  width: string;
  height: string;
  opacity: number;
};

function Particle({
  dark,
  style,
}: {
  dark: boolean;
  style: ParticleStyle;
}) {
  return (
    <div
      className="absolute rounded-full animate-float"
      style={{
        ...style,
        background: dark ? "#38BDF8" : "#2563EB",
      }}
    />
  );
}

// ---------- Nav ----------
const NAV_LINKS = ["home", "about", "skills", "projects", "resume", "contact"];

function Nav({
  dark,
  toggleDark,
  active,
}: {
  dark: boolean;
  toggleDark: () => void;
  active: string;
}) {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
    setOpen(false);
  };

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? "bg-background/90 backdrop-blur-md border-b border-border shadow-sm"
          : "bg-transparent"
      }`}
    >
      <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
        {/* Logo */}
        <button
          onClick={() => scrollTo("home")}
          className="font-display font-bold text-xl tracking-tight text-foreground hover:text-primary transition-colors"
          style={{ fontFamily: "Outfit, sans-serif" }}
        >
          <span className="text-primary">A</span>yush
          <span className="text-accent">.</span>
        </button>

        {/* Desktop links */}
        <ul className="hidden md:flex items-center gap-1">
          {NAV_LINKS.map((id) => (
            <li key={id}>
              <button
                onClick={() => scrollTo(id)}
                className={`px-4 py-2 rounded-lg text-sm font-medium capitalize transition-all duration-200 ${
                  active === id
                    ? "bg-primary text-primary-foreground"
                    : "text-muted-foreground hover:text-foreground hover:bg-secondary"
                }`}
                style={{ fontFamily: "Inter, sans-serif" }}
              >
                {id}
              </button>
            </li>
          ))}
        </ul>

        <div className="flex items-center gap-2">
          <button
            onClick={toggleDark}
            className="p-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-secondary transition-all"
            aria-label="Toggle theme"
          >
            {dark ? <Sun size={18} /> : <Moon size={18} />}
          </button>
          <button
            onClick={() => setOpen(!open)}
            className="md:hidden p-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-secondary transition-all"
          >
            {open ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {open && (
        <div className="md:hidden bg-card border-b border-border">
          <ul className="max-w-6xl mx-auto px-6 py-3 flex flex-col gap-1">
            {NAV_LINKS.map((id) => (
              <li key={id}>
                <button
                  onClick={() => scrollTo(id)}
                  className={`w-full text-left px-4 py-2.5 rounded-lg text-sm font-medium capitalize transition-all ${
                    active === id
                      ? "bg-primary text-primary-foreground"
                      : "text-muted-foreground hover:text-foreground hover:bg-secondary"
                  }`}
                  style={{ fontFamily: "Inter, sans-serif" }}
                >
                  {id}
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}
    </nav>
  );
}

// ---------- Hero ----------
const TITLES = [
  "Full-Stack Developer",
  "AI Enthusiast",
  "Problem Solver",
  "Web Developer",
];

function Hero({ dark }: { dark: boolean }) {
  const typed = useTypingAnimation(TITLES);
  const particles = useMemo<ParticleStyle[]>(
    () =>
      Array.from({ length: 20 }, () => ({
        left: `${Math.random() * 100}%`,
        top: `${Math.random() * 100}%`,
        animationDelay: `${Math.random() * 6}s`,
        animationDuration: `${6 + Math.random() * 8}s`,
        width: `${2 + Math.random() * 3}px`,
        height: `${2 + Math.random() * 3}px`,
        opacity: 0.3 + Math.random() * 0.4,
      })),
    []
  );

  const scrollTo = (id: string) =>
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });

  return (
    <section
      id="home"
      className="relative min-h-screen flex items-center justify-center overflow-hidden"
    >
      {/* Grid background */}
      <div
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: `linear-gradient(var(--foreground) 1px, transparent 1px), linear-gradient(90deg, var(--foreground) 1px, transparent 1px)`,
          backgroundSize: "60px 60px",
        }}
      />

      {/* Ambient depth */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "linear-gradient(135deg, rgba(37,99,235,0.12), transparent 38%), linear-gradient(315deg, rgba(20,184,166,0.1), transparent 42%)",
        }}
      />

      {/* Particles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {particles.map((style, i) => (
          <Particle key={i} dark={dark} style={style} />
        ))}
      </div>

      <div className="relative z-10 max-w-6xl mx-auto px-6 pt-20">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          {/* Text */}
          <div className="order-2 md:order-1">
            <div
              className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-mono border border-border bg-secondary text-muted-foreground mb-6"
              style={{ fontFamily: "JetBrains Mono, monospace" }}
            >
              <span className="w-1.5 h-1.5 rounded-full bg-accent animate-pulse" />
              Available for opportunities
            </div>

            <h1
              className="text-5xl md:text-6xl lg:text-7xl font-black leading-[1.05] tracking-tight text-foreground mb-4"
              style={{ fontFamily: "Outfit, sans-serif" }}
            >
              Hi, I'm
              <br />
              <span
                style={{
                  background: "linear-gradient(135deg, #2563EB, #38BDF8)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  backgroundClip: "text",
                }}
              >
                {PROFILE.name}
              </span>
            </h1>

            <div
              className="flex items-center gap-2 text-xl md:text-2xl font-semibold text-muted-foreground mb-6 h-8"
              style={{ fontFamily: "Outfit, sans-serif" }}
            >
              <span className="text-accent">&gt;</span>
              <span>{typed}</span>
              <span className="w-0.5 h-6 bg-accent animate-blink" />
            </div>

            <p
              className="text-base md:text-lg text-muted-foreground leading-relaxed mb-8 max-w-xl"
              style={{ fontFamily: "Inter, sans-serif" }}
            >
              Passionate Full-Stack Developer and AI Enthusiast focused on
              building impactful digital solutions that solve real-world problems
              - spanning food technology, education, and career development.
            </p>

            <div className="flex flex-wrap gap-3">
              <button
                onClick={() => scrollTo("projects")}
                className="px-6 py-3 rounded-xl font-semibold text-sm text-white transition-all duration-200 hover:scale-105 hover:shadow-lg active:scale-100"
                style={{
                  background: "linear-gradient(135deg, #2563EB, #1D4ED8)",
                  fontFamily: "Inter, sans-serif",
                  boxShadow: "0 4px 20px rgba(37,99,235,0.35)",
                }}
              >
                View Projects <ChevronRight className="inline w-4 h-4" />
              </button>
              <a
                href={PROFILE.resumePath}
                download
                className="px-6 py-3 rounded-xl font-semibold text-sm border border-border text-foreground bg-secondary hover:bg-accent hover:text-accent-foreground transition-all duration-200 hover:scale-105 flex items-center gap-2"
                style={{ fontFamily: "Inter, sans-serif" }}
              >
                <Download size={15} /> Resume
              </a>
              <button
                onClick={() => scrollTo("contact")}
                className="px-6 py-3 rounded-xl font-semibold text-sm border border-border text-muted-foreground hover:text-foreground hover:border-primary transition-all duration-200"
                style={{ fontFamily: "Inter, sans-serif" }}
              >
                Contact Me
              </button>
            </div>

            {/* Social */}
            <div className="flex items-center gap-4 mt-8">
              {[
                {
                  href: PROFILE.githubUrl,
                  icon: <Github size={18} />,
                  label: "GitHub",
                },
                {
                  href: PROFILE.linkedinUrl,
                  icon: <Linkedin size={18} />,
                  label: "LinkedIn",
                },
                {
                  href: `mailto:${PROFILE.email}`,
                  icon: <Mail size={18} />,
                  label: "Email",
                },
              ].map((s) => (
                <a
                  key={s.label}
                  href={s.href}
                  aria-label={s.label}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2.5 rounded-lg border border-border text-muted-foreground hover:text-primary hover:border-primary transition-all duration-200 hover:scale-110"
                >
                  {s.icon}
                </a>
              ))}
            </div>
          </div>

          {/* Profile image */}
          <div className="order-1 md:order-2 flex justify-center">
            <div className="relative">
              {/* Outer ring */}
              <div
                className="absolute inset-0 rounded-full animate-spin-slow"
                style={{
                  background:
                    "conic-gradient(from 0deg, #2563EB, #38BDF8, transparent, transparent, #2563EB)",
                  padding: "3px",
                  borderRadius: "9999px",
                }}
              />
              <div
                className="relative w-56 h-56 md:w-72 md:h-72 rounded-full overflow-hidden border-4 border-card"
                style={{ background: "#1E293B" }}
              >
                <img
                  src={assetPath("profile.jpg")}
                  alt={PROFILE.name}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    const t = e.currentTarget;
                    t.style.display = "none";
                    const parent = t.parentElement;
                    if (parent) {
                      parent.innerHTML = `<div style="width:100%;height:100%;display:flex;align-items:center;justify-content:center;font-family:Outfit,sans-serif;font-size:5rem;font-weight:900;background:linear-gradient(135deg,#0F172A,#1E293B);color:#3B82F6;">AK</div>`;
                    }
                  }}
                />
              </div>

              {/* Floating badges */}
              <div
                className="absolute -top-4 -right-4 px-3 py-1.5 rounded-xl text-xs font-semibold text-white shadow-lg"
                style={{
                  background: "linear-gradient(135deg,#2563EB,#38BDF8)",
                  fontFamily: "JetBrains Mono, monospace",
                }}
              >
                {"<AI/>"}
              </div>
              <div
                className="absolute -bottom-4 -left-4 px-3 py-1.5 rounded-xl text-xs font-semibold border border-border bg-card text-foreground shadow-lg"
                style={{ fontFamily: "JetBrains Mono, monospace" }}
              >
                Full-Stack
              </div>
            </div>
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="flex justify-center mt-16 md:mt-20">
          <button
            onClick={() => scrollTo("about")}
            className="flex flex-col items-center gap-2 text-muted-foreground hover:text-primary transition-colors group"
          >
            <span
              className="text-xs"
              style={{ fontFamily: "JetBrains Mono, monospace" }}
            >
              scroll down
            </span>
            <div className="w-6 h-10 rounded-full border-2 border-border flex items-start justify-center p-1.5 group-hover:border-primary transition-colors">
              <div className="w-1 h-2 rounded-full bg-muted-foreground animate-bounce group-hover:bg-primary transition-colors" />
            </div>
          </button>
        </div>
      </div>
    </section>
  );
}

// ---------- Section heading ----------
function SectionHeading({
  label,
  title,
  subtitle,
}: {
  label: string;
  title: string;
  subtitle?: string;
}) {
  return (
    <div className="text-center mb-14 reveal">
      <div
        className="inline-block px-3 py-1 rounded-full text-xs font-mono border border-border bg-secondary text-primary mb-4"
        style={{ fontFamily: "JetBrains Mono, monospace" }}
      >
        {label}
      </div>
      <h2
        className="text-3xl md:text-4xl font-black text-foreground mb-3"
        style={{ fontFamily: "Outfit, sans-serif" }}
      >
        {title}
      </h2>
      {subtitle && (
        <p
          className="text-muted-foreground max-w-xl mx-auto text-base"
          style={{ fontFamily: "Inter, sans-serif" }}
        >
          {subtitle}
        </p>
      )}
    </div>
  );
}

// ---------- About ----------
function About() {
  const stats = [
    { label: "Projects Built", value: "3+" },
    { label: "Technologies", value: "12+" },
    { label: "AI Integrations", value: "5+" },
    { label: "Domains", value: "3" },
  ];

  const interests = [
    { icon: <Brain size={16} />, label: "Artificial Intelligence" },
    { icon: <Code2 size={16} />, label: "Full-Stack Dev" },
    { icon: <Cpu size={16} />, label: "Tech Innovation" },
    { icon: <Globe size={16} />, label: "Startups" },
    { icon: <Layers size={16} />, label: "Product Design" },
  ];

  return (
    <section id="about" className="py-24 px-6">
      <div className="max-w-6xl mx-auto">
        <SectionHeading
          label="// about.me"
          title="Who I Am"
          subtitle="A developer driven by curiosity and a passion for building things that matter."
        />

        <div className="grid md:grid-cols-2 gap-12 items-start">
          {/* Bio */}
          <div className="reveal">
            <div className="prose max-w-none">
              <p
                className="text-base text-muted-foreground leading-relaxed mb-4"
                style={{ fontFamily: "Inter, sans-serif" }}
              >
                I'm{" "}
                <span className="text-foreground font-semibold">
                  {PROFILE.name}
                </span>
                , a passionate Full-Stack Developer and AI Enthusiast who
                believes technology can - and should - solve meaningful
                problems. My work spans multiple domains from food-tech to
                education and career guidance.
              </p>
              <p
                className="text-base text-muted-foreground leading-relaxed mb-6"
                style={{ fontFamily: "Inter, sans-serif" }}
              >
                I'm driven by a desire to bridge the gap between cutting-edge
                AI capabilities and practical, everyday challenges. From
                building multilingual cooking assistants to AI-powered academic
                ecosystems, I focus on user-centric products with real impact.
              </p>
            </div>

            {/* Education card */}
            <div className="rounded-xl border border-border bg-card p-5 mb-6">
              <div className="flex items-center gap-2 mb-3">
                <BookOpen size={16} className="text-primary" />
                <span
                  className="text-sm font-semibold text-foreground"
                  style={{ fontFamily: "Outfit, sans-serif" }}
                >
                  Education
                </span>
              </div>
              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 rounded-full bg-primary mt-1.5 shrink-0" />
                  <div>
                    <p
                      className="text-sm font-medium text-foreground"
                      style={{ fontFamily: "Inter, sans-serif" }}
                    >
                      B.Tech in Computer Science
                    </p>
                    <p
                      className="text-xs text-muted-foreground"
                      style={{ fontFamily: "Inter, sans-serif" }}
                    >
                      Specialization in AI & Machine Learning
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Career goals */}
            <div className="rounded-xl border border-border bg-card p-5">
              <div className="flex items-center gap-2 mb-3">
                <Target size={16} className="text-accent" />
                <span
                  className="text-sm font-semibold text-foreground"
                  style={{ fontFamily: "Outfit, sans-serif" }}
                >
                  Career Goals
                </span>
              </div>
              <ul className="space-y-2">
                {[
                  "Build AI-powered products at scale",
                  "Advance full-stack architecture expertise",
                  "Launch impactful tech startups",
                  "Solve real-world problems with AI",
                ].map((g) => (
                  <li key={g} className="flex items-center gap-2">
                    <CheckCircle size={13} className="text-accent shrink-0" />
                    <span
                      className="text-sm text-muted-foreground"
                      style={{ fontFamily: "Inter, sans-serif" }}
                    >
                      {g}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Stats + interests */}
          <div className="reveal" style={{ animationDelay: "0.15s" }}>
            {/* Stats grid */}
            <div className="grid grid-cols-2 gap-4 mb-8">
              {stats.map((s) => (
                <div
                  key={s.label}
                  className="rounded-xl border border-border bg-card p-5 text-center group hover:border-primary transition-colors"
                >
                  <div
                    className="text-3xl font-black text-primary mb-1 group-hover:scale-110 transition-transform inline-block"
                    style={{ fontFamily: "Outfit, sans-serif" }}
                  >
                    {s.value}
                  </div>
                  <div
                    className="text-xs text-muted-foreground"
                    style={{ fontFamily: "Inter, sans-serif" }}
                  >
                    {s.label}
                  </div>
                </div>
              ))}
            </div>

            {/* Interests */}
            <div className="rounded-xl border border-border bg-card p-5">
              <p
                className="text-sm font-semibold text-foreground mb-4"
                style={{ fontFamily: "Outfit, sans-serif" }}
              >
                Interests
              </p>
              <div className="flex flex-wrap gap-2">
                {interests.map((i) => (
                  <div
                    key={i.label}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs border border-border bg-secondary text-muted-foreground hover:border-primary hover:text-primary transition-all cursor-default"
                    style={{ fontFamily: "Inter, sans-serif" }}
                  >
                    {i.icon}
                    {i.label}
                  </div>
                ))}
              </div>
            </div>

            {/* Quote */}
            <div
              className="mt-6 rounded-xl p-5 relative overflow-hidden"
              style={{
                background:
                  "linear-gradient(135deg, rgba(37,99,235,0.08), rgba(56,189,248,0.06))",
                borderLeft: "3px solid #2563EB",
              }}
            >
              <p
                className="text-sm italic text-muted-foreground leading-relaxed"
                style={{ fontFamily: "Inter, sans-serif" }}
              >
                "Technology is most powerful when it bridges the gap between
                human intention and meaningful outcome."
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

// ---------- Skills ----------
const SKILLS = [
  {
    category: "Frontend",
    icon: <Globe size={18} />,
    color: "#2563EB",
    skills: ["HTML5", "CSS3", "JavaScript", "Responsive Design", "Bootstrap"],
  },
  {
    category: "Backend",
    icon: <Terminal size={18} />,
    color: "#14B8A6",
    skills: ["Node.js", "Express.js"],
  },
  {
    category: "Database",
    icon: <Database size={18} />,
    color: "#8B5CF6",
    skills: ["MongoDB"],
  },
  {
    category: "Programming",
    icon: <Code2 size={18} />,
    color: "#F59E0B",
    skills: ["Python", "JavaScript"],
  },
  {
    category: "Tools",
    icon: <Layers size={18} />,
    color: "#EC4899",
    skills: ["Git", "GitHub", "VS Code"],
  },
  {
    category: "AI & Emerging",
    icon: <Brain size={18} />,
    color: "#38BDF8",
    skills: [
      "Artificial Intelligence",
      "Prompt Engineering",
      "Speech Recognition",
      "AI Integrations",
    ],
  },
];

function Skills() {
  return (
    <section id="skills" className="py-24 px-6 bg-secondary/30">
      <div className="max-w-6xl mx-auto">
        <SectionHeading
          label="// skills.map"
          title="Technical Skills"
          subtitle="Technologies and tools I work with to build modern, scalable applications."
        />

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {SKILLS.map((group, gi) => (
            <div
              key={group.category}
              className="reveal rounded-xl border border-border bg-card p-6 group hover:border-primary/40 hover:-translate-y-1 transition-all duration-300"
              style={{ animationDelay: `${gi * 0.07}s` }}
            >
              <div className="flex items-center gap-2.5 mb-4">
                <div
                  className="p-2 rounded-lg"
                  style={{
                    background: `${group.color}18`,
                    color: group.color,
                  }}
                >
                  {group.icon}
                </div>
                <span
                  className="font-semibold text-sm text-foreground"
                  style={{ fontFamily: "Outfit, sans-serif" }}
                >
                  {group.category}
                </span>
              </div>
              <div className="space-y-3">
                {group.skills.map((skill, si) => {
                  const level = 72 + ((gi * 11 + si * 7) % 24);

                  return (
                    <div key={skill}>
                      <div className="flex items-center justify-between gap-3 mb-1.5">
                        <span
                          className="text-xs text-muted-foreground"
                          style={{ fontFamily: "JetBrains Mono, monospace" }}
                        >
                          {skill}
                        </span>
                        <span
                          className="text-[10px] text-muted-foreground"
                          style={{ fontFamily: "JetBrains Mono, monospace" }}
                        >
                          {level}%
                        </span>
                      </div>
                      <div className="h-1.5 rounded-full bg-secondary overflow-hidden">
                        <div
                          className="h-full rounded-full transition-all duration-700 group-hover:brightness-110"
                          style={{
                            width: `${level}%`,
                            background: `linear-gradient(90deg, ${group.color}, #38BDF8)`,
                          }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ---------- Projects ----------
const PROJECTS = [
  {
    id: "swaad",
    title: "Swaad Margdarshak",
    subtitle: "AI Culinary Assistant",
    description:
      "A multilingual, AI-driven culinary assistant that minimizes food waste by intelligently analyzing available ingredients and generating creative recipe recommendations.",
    tagline: "Transforming available ingredients into meaningful meals.",
    tech: [
      "React",
      "Node.js",
      "Express.js",
      "MongoDB",
      "AI APIs",
      "Speech Recognition",
      "Text-to-Speech",
    ],
    features: [
      "AI-powered recipe generation",
      "Ingredient-based recommendations",
      "Multilingual support",
      "Food waste reduction",
    ],
    image: assetPath("swaad margdarshak.png"),
    github: "https://github.com/ayushk1904/swaad-margdarshak",
    gradient: "linear-gradient(135deg, #2563EB 0%, #14B8A6 100%)",
    accent: "#14B8A6",
    flagship: true,
  },
  {
    id: "lakshya",
    title: "Lakshya",
    subtitle: "Learn. Grow. Evolve.",
    description:
      "An AI-powered academic ecosystem engineered to enhance student productivity through study planning, progress tracking, goal management, and AI-powered proctoring.",
    tagline: "Empowering students to learn smarter and achieve their goals.",
    tech: ["React", "Node.js", "MongoDB", "Artificial Intelligence", "Computer Vision"],
    features: [
      "Study Planning",
      "Goal Tracking",
      "Progress Monitoring",
      "AI Proctoring",
    ],
    image: assetPath("lakshya.png"),
    github: "https://github.com/ayushk1904/lakshya-ayush",
    gradient: "linear-gradient(135deg, #7C3AED 0%, #38BDF8 100%)",
    accent: "#7C3AED",
    flagship: false,
  },
  {
    id: "manzil",
    title: "Manzil.com",
    subtitle: "Career Guidance Platform",
    description:
      "A dedicated platform bridging academic aspirations and career success - a personalized roadmap helping students make informed educational decisions and track milestones.",
    tagline: "Guiding students from ambition to achievement.",
    tech: ["React", "JavaScript", "Node.js", "MongoDB"],
    features: [
      "Career Guidance",
      "Academic Roadmaps",
      "Goal Tracking",
      "Career Planning",
    ],
    image: assetPath("manzil.com.png"),
    github: "https://github.com/ayushk1904/Manzil.com",
    gradient: "linear-gradient(135deg, #F59E0B 0%, #EF4444 100%)",
    accent: "#F59E0B",
    flagship: false,
  },
];

function ProjectCard({
  project,
  delay,
}: {
  project: (typeof PROJECTS)[0];
  delay: number;
}) {
  const [imgError, setImgError] = useState(false);

  return (
    <div
      className={`reveal rounded-2xl border border-border bg-card overflow-hidden group hover:-translate-y-2 hover:shadow-2xl transition-all duration-300 ${
        project.flagship ? "md:col-span-2 lg:col-span-2" : ""
      }`}
      style={{ animationDelay: `${delay}s` }}
    >
      {/* Image / placeholder */}
      <div
        className={`relative overflow-hidden ${project.flagship ? "h-56" : "h-48"}`}
        style={{ background: "#1E293B" }}
      >
        {!imgError ? (
          <img
            src={project.image}
            alt={project.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            onError={() => setImgError(true)}
          />
        ) : (
          <div
            className="w-full h-full flex items-center justify-center text-white"
            style={{ background: project.gradient }}
          >
            <div className="text-center">
              <div
                className="text-4xl font-black mb-1 opacity-90"
                style={{ fontFamily: "Outfit, sans-serif" }}
              >
                {project.title[0]}
              </div>
              <div
                className="text-xs opacity-70"
                style={{ fontFamily: "JetBrains Mono, monospace" }}
              >
                {project.subtitle}
              </div>
            </div>
          </div>
        )}
        {/* Overlay gradient */}
        <div className="absolute inset-0 bg-gradient-to-t from-card via-transparent to-transparent opacity-60" />

        {/* Flag badge */}
        {project.flagship && (
          <div
            className="absolute top-3 left-3 px-2.5 py-1 rounded-full text-xs font-semibold text-white"
            style={{
              background: "linear-gradient(135deg,#2563EB,#38BDF8)",
              fontFamily: "Inter, sans-serif",
            }}
          >
            Flagship
          </div>
        )}
      </div>

      <div className="p-6">
        <div className="mb-3">
          <h3
            className="text-lg font-bold text-foreground mb-0.5"
            style={{ fontFamily: "Outfit, sans-serif" }}
          >
            {project.title}
          </h3>
          <span
            className="text-xs font-mono text-muted-foreground"
            style={{ fontFamily: "JetBrains Mono, monospace", color: project.accent }}
          >
            {project.subtitle}
          </span>
        </div>

        <p
          className="text-sm text-muted-foreground leading-relaxed mb-4"
          style={{ fontFamily: "Inter, sans-serif" }}
        >
          {project.description}
        </p>

        {/* Features */}
        <div className="grid grid-cols-2 gap-1.5 mb-4">
          {project.features.map((f) => (
            <div key={f} className="flex items-center gap-1.5">
              <div
                className="w-1.5 h-1.5 rounded-full shrink-0"
                style={{ background: project.accent }}
              />
              <span
                className="text-xs text-muted-foreground"
                style={{ fontFamily: "Inter, sans-serif" }}
              >
                {f}
              </span>
            </div>
          ))}
        </div>

        {/* Tech stack */}
        <div className="flex flex-wrap gap-1.5 mb-5">
          {project.tech.map((t) => (
            <span
              key={t}
              className="px-2 py-0.5 rounded text-xs border border-border text-muted-foreground bg-secondary"
              style={{ fontFamily: "JetBrains Mono, monospace" }}
            >
              {t}
            </span>
          ))}
        </div>

        {/* Italic tagline */}
        <p
          className="text-xs italic text-muted-foreground mb-5 border-l-2 pl-3"
          style={{
            fontFamily: "Inter, sans-serif",
            borderColor: project.accent,
          }}
        >
          "{project.tagline}"
        </p>

        {/* Buttons */}
        <div className="flex gap-2">
          <a
            href={project.github}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-medium border border-border text-muted-foreground hover:text-foreground hover:border-foreground transition-all"
            style={{ fontFamily: "Inter, sans-serif" }}
          >
            <Github size={13} /> GitHub
          </a>
        </div>
      </div>
    </div>
  );
}

function Projects() {
  return (
    <section id="projects" className="py-24 px-6">
      <div className="max-w-6xl mx-auto">
        <SectionHeading
          label="// projects.featured"
          title="Featured Projects"
          subtitle="Real-world applications built with modern technologies and AI integrations."
        />

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {PROJECTS.map((p, i) => (
            <ProjectCard key={p.id} project={p} delay={i * 0.1} />
          ))}
        </div>
      </div>
    </section>
  );
}

// ---------- Resume ----------
function Resume() {
  return (
    <section id="resume" className="py-24 px-6 bg-secondary/30">
      <div className="max-w-4xl mx-auto">
        <SectionHeading
          label="// resume.pdf"
          title="My Resume"
          subtitle="A comprehensive overview of my skills, education, and project experience."
        />

        <div className="reveal">
          {/* Resume preview card */}
          <div className="rounded-2xl border border-border bg-card overflow-hidden">
            {/* Fake document header */}
            <div
              className="h-12 flex items-center px-4 gap-2 border-b border-border"
              style={{ background: "linear-gradient(90deg,#0F172A,#1E293B)" }}
            >
              <div className="w-3 h-3 rounded-full bg-red-500/70" />
              <div className="w-3 h-3 rounded-full bg-yellow-500/70" />
              <div className="w-3 h-3 rounded-full bg-green-500/70" />
              <span
                className="ml-3 text-xs text-muted-foreground"
                style={{ fontFamily: "JetBrains Mono, monospace" }}
              >
                ayush-kamble-resume.pdf
              </span>
            </div>

            <div className="p-8 md:p-12">
              <div className="grid md:grid-cols-3 gap-8 mb-8">
                <div className="md:col-span-1">
                  {/* Avatar placeholder */}
                  <div
                    className="w-20 h-20 rounded-xl flex items-center justify-center text-3xl font-black text-white mb-4"
                    style={{
                      background: "linear-gradient(135deg,#2563EB,#38BDF8)",
                      fontFamily: "Outfit, sans-serif",
                    }}
                  >
                    AK
                  </div>
                  <h3
                    className="text-xl font-black text-foreground mb-1"
                    style={{ fontFamily: "Outfit, sans-serif" }}
                  >
                    {PROFILE.name}
                  </h3>
                  <p
                    className="text-sm text-primary mb-4"
                    style={{ fontFamily: "Inter, sans-serif" }}
                  >
                    Full-Stack Developer & AI Enthusiast
                  </p>

                  <div className="space-y-2 text-xs text-muted-foreground">
                    <div className="flex items-center gap-2" style={{ fontFamily: "Inter, sans-serif" }}>
                      <Mail size={12} /> {PROFILE.email}
                    </div>
                    <div className="flex items-center gap-2" style={{ fontFamily: "Inter, sans-serif" }}>
                      <MapPin size={12} /> {PROFILE.location}
                    </div>
                    <div className="flex items-center gap-2" style={{ fontFamily: "Inter, sans-serif" }}>
                      <Github size={12} /> {PROFILE.githubLabel}
                    </div>
                  </div>
                </div>

                <div className="md:col-span-2 space-y-6">
                  <div>
                    <h4
                      className="text-xs font-semibold text-primary uppercase tracking-widest mb-2"
                      style={{ fontFamily: "JetBrains Mono, monospace" }}
                    >
                      Core Skills
                    </h4>
                    <div className="flex flex-wrap gap-1.5">
                      {["React", "Node.js", "MongoDB", "Python", "AI APIs", "Express.js", "Git"].map((s) => (
                        <span
                          key={s}
                          className="px-2 py-0.5 text-xs rounded border border-border bg-secondary text-muted-foreground"
                          style={{ fontFamily: "JetBrains Mono, monospace" }}
                        >
                          {s}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h4
                      className="text-xs font-semibold text-primary uppercase tracking-widest mb-2"
                      style={{ fontFamily: "JetBrains Mono, monospace" }}
                    >
                      Projects
                    </h4>
                    <div className="space-y-1.5">
                      {PROJECTS.map((p) => (
                        <div key={p.id} className="flex items-center gap-2">
                          <div className="w-1.5 h-1.5 rounded-full bg-accent shrink-0" />
                          <span
                            className="text-sm text-muted-foreground"
                            style={{ fontFamily: "Inter, sans-serif" }}
                          >
                            {p.title} - {p.subtitle}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Download CTA */}
              <div className="flex justify-center pt-6 border-t border-border">
                <a
                  href={PROFILE.resumePath}
                  download
                  className="inline-flex items-center gap-2.5 px-8 py-3.5 rounded-xl font-semibold text-sm text-white transition-all hover:scale-105 hover:shadow-xl active:scale-100"
                  style={{
                    background: "linear-gradient(135deg,#2563EB,#1D4ED8)",
                    fontFamily: "Inter, sans-serif",
                    boxShadow: "0 4px 20px rgba(37,99,235,0.35)",
                  }}
                >
                  <Download size={16} />
                  Download Full Resume (PDF)
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

// ---------- Contact ----------
type FormState = {
  name: string;
  email: string;
  subject: string;
  message: string;
};

type FormErrors = Partial<FormState>;

function Contact() {
  const [form, setForm] = useState<FormState>({
    name: "",
    email: "",
    subject: "",
    message: "",
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [sent, setSent] = useState(false);

  const validate = (): boolean => {
    const e: FormErrors = {};
    if (!form.name.trim()) e.name = "Name is required";
    if (!form.email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/))
      e.email = "Valid email is required";
    if (!form.subject.trim()) e.subject = "Subject is required";
    if (form.message.trim().length < 10)
      e.message = "Message must be at least 10 characters";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = (evt: React.FormEvent) => {
    evt.preventDefault();
    if (!validate()) return;
    setSent(true);
    setForm({ name: "", email: "", subject: "", message: "" });
    setTimeout(() => setSent(false), 5000);
  };

  const field = (
    key: keyof FormState,
    label: string,
    placeholder: string,
    type: string = "text",
    rows?: number
  ) => (
    <div>
      <label
        className="block text-xs font-semibold text-foreground mb-1.5"
        style={{ fontFamily: "Inter, sans-serif" }}
      >
        {label}
      </label>
      {rows ? (
        <textarea
          rows={rows}
          placeholder={placeholder}
          value={form[key]}
          onChange={(e) => setForm((f) => ({ ...f, [key]: e.target.value }))}
          className={`w-full rounded-xl px-4 py-3 text-sm border bg-input-background text-foreground placeholder:text-muted-foreground resize-none outline-none transition-all focus:ring-2 focus:ring-primary/30 ${
            errors[key] ? "border-red-500" : "border-border focus:border-primary"
          }`}
          style={{ fontFamily: "Inter, sans-serif" }}
        />
      ) : (
        <input
          type={type}
          placeholder={placeholder}
          value={form[key]}
          onChange={(e) => setForm((f) => ({ ...f, [key]: e.target.value }))}
          className={`w-full rounded-xl px-4 py-3 text-sm border bg-input-background text-foreground placeholder:text-muted-foreground outline-none transition-all focus:ring-2 focus:ring-primary/30 ${
            errors[key] ? "border-red-500" : "border-border focus:border-primary"
          }`}
          style={{ fontFamily: "Inter, sans-serif" }}
        />
      )}
      {errors[key] && (
        <p className="text-xs text-red-500 mt-1" style={{ fontFamily: "Inter, sans-serif" }}>
          {errors[key]}
        </p>
      )}
    </div>
  );

  return (
    <section id="contact" className="py-24 px-6">
      <div className="max-w-6xl mx-auto">
        <SectionHeading
          label="// contact.init"
          title="Get In Touch"
          subtitle="Have a project in mind or want to collaborate? I'd love to hear from you."
        />

        <div className="grid md:grid-cols-2 gap-10">
          {/* Info */}
          <div className="reveal space-y-6">
            <div>
              <h3
                className="text-xl font-bold text-foreground mb-3"
                style={{ fontFamily: "Outfit, sans-serif" }}
              >
                Let's work together
              </h3>
              <p
                className="text-sm text-muted-foreground leading-relaxed"
                style={{ fontFamily: "Inter, sans-serif" }}
              >
                I'm currently open to internship opportunities, freelance
                projects, and collaborative ventures. Whether you have a
                question or just want to say hello - my inbox is always open.
              </p>
            </div>

            <div className="space-y-4">
              {[
                {
                  icon: <Phone size={16} />,
                  label: "Phone",
                  value: PROFILE.phone,
                  href: `tel:+91${PROFILE.phone}`,
                  color: "#16A34A",
                },
                {
                  icon: <Mail size={16} />,
                  label: "Email",
                  value: PROFILE.email,
                  href: `mailto:${PROFILE.email}`,
                  color: "#2563EB",
                },
                {
                  icon: <Github size={16} />,
                  label: "GitHub",
                  value: PROFILE.githubLabel,
                  href: PROFILE.githubUrl,
                  color: "#333",
                },
                {
                  icon: <Linkedin size={16} />,
                  label: "LinkedIn",
                  value: PROFILE.linkedinLabel,
                  href: PROFILE.linkedinUrl,
                  color: "#0077B5",
                },
              ].map((c) => (
                <a
                  key={c.label}
                  href={c.href}
                  target={c.href.startsWith("tel:") ? undefined : "_blank"}
                  rel={c.href.startsWith("tel:") ? undefined : "noopener noreferrer"}
                  className="flex items-center gap-4 p-4 rounded-xl border border-border bg-card hover:border-primary/40 hover:-translate-y-0.5 transition-all group"
                >
                  <div
                    className="p-2.5 rounded-lg text-white shrink-0"
                    style={{ background: c.color }}
                  >
                    {c.icon}
                  </div>
                  <div>
                    <p
                      className="text-xs text-muted-foreground"
                      style={{ fontFamily: "Inter, sans-serif" }}
                    >
                      {c.label}
                    </p>
                    <p
                      className="text-sm font-medium text-foreground group-hover:text-primary transition-colors"
                      style={{ fontFamily: "Inter, sans-serif" }}
                    >
                      {c.value}
                    </p>
                  </div>
                </a>
              ))}
            </div>
          </div>

          {/* Form */}
          <div className="reveal" style={{ animationDelay: "0.1s" }}>
            <div className="rounded-2xl border border-border bg-card p-6 md:p-8">
              {sent ? (
                <div className="flex flex-col items-center justify-center py-12 text-center">
                  <CheckCircle size={48} className="text-accent mb-4" />
                  <h3
                    className="text-xl font-bold text-foreground mb-2"
                    style={{ fontFamily: "Outfit, sans-serif" }}
                  >
                    Message Sent!
                  </h3>
                  <p
                    className="text-sm text-muted-foreground"
                    style={{ fontFamily: "Inter, sans-serif" }}
                  >
                    Thank you for reaching out. I'll get back to you shortly.
                  </p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4" noValidate>
                  <div className="grid sm:grid-cols-2 gap-4">
                    {field("name", "Full Name", "John Doe")}
                    {field("email", "Email Address", "john@example.com", "email")}
                  </div>
                  {field("subject", "Subject", "Project collaboration...")}
                  {field("message", "Message", "Tell me about your project or idea...", "text", 5)}
                  <button
                    type="submit"
                    className="w-full flex items-center justify-center gap-2 py-3.5 rounded-xl font-semibold text-sm text-white transition-all hover:scale-[1.02] hover:shadow-lg active:scale-100"
                    style={{
                      background: "linear-gradient(135deg,#2563EB,#1D4ED8)",
                      fontFamily: "Inter, sans-serif",
                      boxShadow: "0 4px 20px rgba(37,99,235,0.3)",
                    }}
                  >
                    <Send size={15} /> Send Message
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

// ---------- Footer ----------
function Footer() {
  const scrollTo = (id: string) =>
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });

  return (
    <footer className="border-t border-border bg-card py-10 px-6">
      <div className="max-w-6xl mx-auto">
        <div className="grid md:grid-cols-3 gap-8 mb-8">
          <div>
            <div
              className="text-xl font-black text-foreground mb-2"
              style={{ fontFamily: "Outfit, sans-serif" }}
            >
              <span className="text-primary">A</span>yush
              <span className="text-accent">.</span>
            </div>
            <p
              className="text-xs text-muted-foreground leading-relaxed"
              style={{ fontFamily: "Inter, sans-serif" }}
            >
              Full-Stack Developer & AI Enthusiast building impactful digital
              solutions.
            </p>
          </div>

          <div>
            <p
              className="text-xs font-semibold text-foreground uppercase tracking-widest mb-3"
              style={{ fontFamily: "JetBrains Mono, monospace" }}
            >
              Quick Links
            </p>
            <ul className="space-y-2">
              {NAV_LINKS.map((id) => (
                <li key={id}>
                  <button
                    onClick={() => scrollTo(id)}
                    className="text-xs text-muted-foreground hover:text-primary capitalize transition-colors"
                    style={{ fontFamily: "Inter, sans-serif" }}
                  >
                    {id}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <p
              className="text-xs font-semibold text-foreground uppercase tracking-widest mb-3"
              style={{ fontFamily: "JetBrains Mono, monospace" }}
            >
              Connect
            </p>
            <div className="flex gap-2">
              {[
                { href: PROFILE.githubUrl, icon: <Github size={15} />, label: "GitHub" },
                { href: PROFILE.linkedinUrl, icon: <Linkedin size={15} />, label: "LinkedIn" },
                { href: `mailto:${PROFILE.email}`, icon: <Mail size={15} />, label: "Email" },
              ].map((s) => (
                <a
                  key={s.label}
                  href={s.href}
                  aria-label={s.label}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 rounded-lg border border-border text-muted-foreground hover:text-primary hover:border-primary transition-all"
                >
                  {s.icon}
                </a>
              ))}
            </div>
          </div>
        </div>

        <div className="flex flex-col md:flex-row items-center justify-between gap-3 pt-6 border-t border-border">
          <p
            className="text-xs text-muted-foreground"
            style={{ fontFamily: "Inter, sans-serif" }}
          >
            &copy; {new Date().getFullYear()} {PROFILE.name}. All rights reserved.
          </p>
          <p
            className="text-xs text-muted-foreground"
            style={{ fontFamily: "JetBrains Mono, monospace" }}
          >
            Built with React + TypeScript
          </p>
        </div>
      </div>
    </footer>
  );
}

// ---------- Back to top ----------
function BackToTop() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 500);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <button
      onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
      aria-label="Back to top"
      className={`fixed bottom-6 right-6 z-50 p-3 rounded-xl text-white shadow-xl transition-all duration-300 hover:scale-110 ${
        visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4 pointer-events-none"
      }`}
      style={{
        background: "linear-gradient(135deg,#2563EB,#38BDF8)",
        boxShadow: "0 4px 20px rgba(37,99,235,0.4)",
      }}
    >
      <ArrowUp size={18} />
    </button>
  );
}

// ---------- Loading screen ----------
function Loader({ done }: { done: boolean }) {
  return (
    <div
      className={`fixed inset-0 z-[100] flex flex-col items-center justify-center bg-background transition-all duration-700 ${
        done ? "opacity-0 pointer-events-none" : "opacity-100"
      }`}
    >
      <div
        className="text-5xl font-black mb-6"
        style={{
          fontFamily: "Outfit, sans-serif",
          background: "linear-gradient(135deg,#2563EB,#38BDF8)",
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent",
          backgroundClip: "text",
        }}
      >
        AK
      </div>
      <div className="w-48 h-1 rounded-full bg-secondary overflow-hidden">
        <div
          className="h-full rounded-full animate-load-bar"
          style={{ background: "linear-gradient(90deg,#2563EB,#38BDF8)" }}
        />
      </div>
      <p
        className="mt-4 text-xs text-muted-foreground"
        style={{ fontFamily: "JetBrains Mono, monospace" }}
      >
        initializing...
      </p>
    </div>
  );
}

// ---------- App ----------
export default function App() {
  const [dark, setDark] = useState(() => {
    const saved = localStorage.getItem("theme");
    if (saved) return saved === "dark";
    return window.matchMedia("(prefers-color-scheme: dark)").matches;
  });
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    document.documentElement.classList.toggle("dark", dark);
    localStorage.setItem("theme", dark ? "dark" : "light");
  }, [dark]);

  useEffect(() => {
    const t = setTimeout(() => setLoaded(true), 1600);
    return () => clearTimeout(t);
  }, []);

  useScrollReveal();
  const active = useActiveSection(NAV_LINKS);

  return (
    <>
      <style>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px) scale(1); }
          50% { transform: translateY(-20px) scale(1.1); }
        }
        @keyframes spin-slow {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        @keyframes blink {
          0%, 100% { opacity: 1; }
          50% { opacity: 0; }
        }
        @keyframes load-bar {
          0% { width: 0%; }
          60% { width: 75%; }
          100% { width: 100%; }
        }
        .animate-float { animation: float var(--dur, 8s) ease-in-out infinite; }
        .animate-spin-slow { animation: spin-slow 10s linear infinite; }
        .animate-blink { animation: blink 1s step-end infinite; }
        .animate-load-bar { animation: load-bar 1.4s ease-out forwards; }

        .reveal {
          opacity: 0;
          transform: translateY(28px);
          transition: opacity 0.65s ease, transform 0.65s ease;
        }
        .reveal.revealed {
          opacity: 1;
          transform: translateY(0);
        }

        html { scroll-behavior: smooth; }

        ::-webkit-scrollbar { width: 5px; }
        ::-webkit-scrollbar-track { background: transparent; }
        ::-webkit-scrollbar-thumb { background: var(--border); border-radius: 99px; }
        ::-webkit-scrollbar-thumb:hover { background: var(--primary); }
      `}</style>

      <Loader done={loaded} />

      <div className={`min-h-screen bg-background text-foreground`}>
        <Nav dark={dark} toggleDark={() => setDark((d) => !d)} active={active} />
        <Hero dark={dark} />
        <About />
        <Skills />
        <Projects />
        <Resume />
        <Contact />
        <Footer />
        <BackToTop />
      </div>
    </>
  );
}
