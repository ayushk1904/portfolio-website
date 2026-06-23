(function () {
  "use strict";

  const qs = (selector, scope = document) => scope.querySelector(selector);
  const qsa = (selector, scope = document) => Array.from(scope.querySelectorAll(selector));

  const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  function safeStorageGet(key) {
    try {
      return window.localStorage.getItem(key);
    } catch {
      return null;
    }
  }

  function safeStorageSet(key, value) {
    try {
      window.localStorage.setItem(key, value);
    } catch {
      // Ignore storage failures in private or restricted browser modes.
    }
  }

  function assetPath(fileName) {
    return `assets/${encodeURIComponent(fileName)}`;
  }

  function applyAssetPaths() {
    qsa("[data-asset-src]").forEach((element) => {
      const fileName = element.dataset.assetSrc;
      if (fileName) {
        element.src = assetPath(fileName);
      }
    });

    qsa("[data-asset-href]").forEach((element) => {
      const fileName = element.dataset.assetHref;
      if (fileName) {
        element.href = assetPath(fileName);
      }
    });
  }

  function initTheme() {
    const root = document.documentElement;
    const toggle = qs("#themeToggle");
    const icon = qs(".theme-toggle__icon", toggle || document);
    const savedTheme = safeStorageGet("portfolio-theme");
    const initialTheme = savedTheme || root.getAttribute("data-theme") || "dark";

    function applyTheme(theme) {
      root.setAttribute("data-theme", theme);
      if (icon) {
        icon.textContent = theme === "dark" ? "L" : "D";
      }
      if (toggle) {
        toggle.setAttribute(
          "aria-label",
          theme === "dark" ? "Switch to light theme" : "Switch to dark theme"
        );
      }
    }

    applyTheme(initialTheme);

    if (toggle) {
      toggle.addEventListener("click", () => {
        const nextTheme = root.getAttribute("data-theme") === "dark" ? "light" : "dark";
        applyTheme(nextTheme);
        safeStorageSet("portfolio-theme", nextTheme);
      });
    }
  }

  function initLoader() {
    const loader = qs("#loader");
    if (!loader) return;

    const hideLoader = () => {
      loader.classList.add("is-hidden");
      loader.setAttribute("aria-hidden", "true");
    };

    if (prefersReducedMotion) {
      hideLoader();
      return;
    }

    window.addEventListener("load", () => window.setTimeout(hideLoader, 350), { once: true });
    window.setTimeout(hideLoader, 1600);
  }

  function initNavigation() {
    const header = qs(".site-header");
    const menuToggle = qs("#menuToggle");
    const navPanel = qs("#navPanel");
    const navLinks = qsa(".nav__link[href^='#']");
    const sections = qsa("[data-section][id]");
    const backToTop = qs("#backToTop");

    function closeMenu() {
      if (!navPanel || !menuToggle) return;
      navPanel.classList.remove("is-open");
      document.body.classList.remove("menu-open");
      menuToggle.setAttribute("aria-expanded", "false");
      menuToggle.setAttribute("aria-label", "Open menu");
    }

    function updateChrome() {
      const y = window.scrollY || document.documentElement.scrollTop;

      if (header) {
        header.classList.toggle("is-scrolled", y > 12);
      }

      if (backToTop) {
        backToTop.classList.toggle("is-visible", y > 420);
      }

      if (!sections.length) return;

      const current = sections.reduce((active, section) => {
        const top = section.offsetTop - 140;
        return y >= top ? section : active;
      }, sections[0]);

      navLinks.forEach((link) => {
        link.classList.toggle("is-active", link.getAttribute("href") === `#${current.id}`);
      });
    }

    if (menuToggle && navPanel) {
      menuToggle.addEventListener("click", () => {
        const isOpen = navPanel.classList.toggle("is-open");
        document.body.classList.toggle("menu-open", isOpen);
        menuToggle.setAttribute("aria-expanded", String(isOpen));
        menuToggle.setAttribute("aria-label", isOpen ? "Close menu" : "Open menu");
      });
    }

    navLinks.forEach((link) => link.addEventListener("click", closeMenu));

    document.addEventListener("keydown", (event) => {
      if (event.key === "Escape") closeMenu();
    });

    window.addEventListener("resize", () => {
      if (window.innerWidth > 920) closeMenu();
      updateChrome();
    });

    window.addEventListener("scroll", updateChrome, { passive: true });

    if (backToTop) {
      backToTop.addEventListener("click", () => {
        window.scrollTo({ top: 0, behavior: prefersReducedMotion ? "auto" : "smooth" });
      });
    }

    updateChrome();
  }

  function initRevealAnimations() {
    const revealItems = qsa(".reveal");
    const skillRows = qsa(".skill-row");

    skillRows.forEach((row) => {
      const level = Number(row.dataset.level || 0);
      const safeLevel = Math.max(0, Math.min(100, level));
      row.style.setProperty("--level", `${safeLevel}%`);
      const label = qs("span", row);
      if (label) {
        label.dataset.value = `${safeLevel}%`;
      }
    });

    if (!("IntersectionObserver" in window) || prefersReducedMotion) {
      revealItems.forEach((item) => item.classList.add("is-visible"));
      skillRows.forEach((row) => row.classList.add("is-visible"));
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        });
      },
      { threshold: 0.16, rootMargin: "0px 0px -70px 0px" }
    );

    revealItems.forEach((item) => observer.observe(item));
    skillRows.forEach((row) => observer.observe(row));
  }

  function initTypingEffect() {
    const target = qs("#typedRole");
    if (!target || prefersReducedMotion) return;

    const roles = [
      "Full-Stack Developer",
      "AI Enthusiast",
      "Problem Solver"
    ];

    let roleIndex = 0;
    let charIndex = 0;
    let deleting = false;

    function tick() {
      const role = roles[roleIndex];
      target.textContent = role.slice(0, charIndex);

      if (!deleting) {
        if (charIndex < role.length) {
          charIndex += 1;
          window.setTimeout(tick, charIndex === role.length ? 1100 : 68);
          return;
        }

        deleting = true;
        window.setTimeout(tick, 700);
        return;
      }

      if (charIndex > 0) {
        charIndex -= 1;
        window.setTimeout(tick, 42);
        return;
      }

      deleting = false;
      roleIndex = (roleIndex + 1) % roles.length;
      window.setTimeout(tick, 260);
    }

    target.textContent = "";
    window.setTimeout(tick, 850);
  }

  function initProjectsShowcase() {
    const section = qs("#projects");
    if (!section) return;

    const buttons = qsa("[data-project]", section);
    const image = qs("[data-project-image]", section);
    const kicker = qs("[data-project-kicker]", section);
    const title = qs("[data-project-title]", section);
    const summary = qs("[data-project-summary]", section);
    const points = qs("[data-project-points]", section);
    const tech = qs("[data-project-tech]", section);
    const quote = qs("[data-project-quote]", section);
    const github = qs("[data-project-github]", section);

    const projects = {
      swaad: {
        kicker: "Flagship Project",
        title: "Swaad Margdarshak",
        summary:
          "A multilingual, AI-driven culinary assistant designed to minimize food waste and simplify meal preparation through ingredient-based recipe recommendations.",
        points: [
          "AI-powered recipe generation",
          "Ingredient-based recommendations",
          "Multilingual support",
          "Speech and text-to-speech assistance",
        ],
        tech: ["React", "Node.js", "Express.js", "MongoDB", "AI APIs"],
        quote:
          "Transforming available ingredients into meaningful meals through intelligent culinary assistance.",
        image: "swaad margdarshak.png",
        alt: "Swaad Margdarshak project preview",
        github: "https://github.com/ayushk1904/swaad-margdarshak",
      },
      lakshya: {
        kicker: "Learning Project",
        title: "Lakshya",
        summary:
          "An AI-powered academic ecosystem for study planning, goal tracking, progress monitoring, and AI proctoring.",
        points: [
          "Study planning and goal tracking",
          "Progress monitoring",
          "AI proctoring",
          "Focus-first learning workflow",
        ],
        tech: ["React", "Node.js", "MongoDB", "Computer Vision"],
        quote: "Empowering students to learn smarter, stay focused, and achieve their goals.",
        image: "lakshya.png",
        alt: "Lakshya project preview",
        github: "https://github.com/ayushk1904/lakshya-ayush",
      },
      manzil: {
        kicker: "Career Project",
        title: "Manzil.com",
        summary:
          "A personalized career roadmap platform that helps students connect academic aspirations with structured career planning.",
        points: [
          "Career guidance",
          "Academic roadmaps",
          "Goal tracking",
          "Structured planning",
        ],
        tech: ["React", "JavaScript", "Node.js", "MongoDB"],
        quote: "Guiding students from ambition to achievement through structured career planning.",
        image: "manzil.com.png",
        alt: "Manzil.com project preview",
        github: "https://github.com/ayushk1904/Manzil.com",
      },
    };

    function render(projectId) {
      const project = projects[projectId];
      if (!project) return;

      buttons.forEach((button) => {
        const isActive = button.dataset.project === projectId;
        button.classList.toggle("is-active", isActive);
        button.setAttribute("aria-pressed", String(isActive));
      });

      if (image) {
        image.src = assetPath(project.image);
        image.alt = project.alt;
      }

      if (kicker) kicker.textContent = project.kicker;
      if (title) title.textContent = project.title;
      if (summary) summary.textContent = project.summary;
      if (quote) quote.textContent = project.quote;
      if (github) github.setAttribute("href", project.github);

      if (points) {
        points.innerHTML = project.points.map((point) => `<li>${point}</li>`).join("");
      }

      if (tech) {
        tech.innerHTML = project.tech.map((item) => `<li>${item}</li>`).join("");
      }
    }

    buttons.forEach((button) => {
      button.addEventListener("click", () => render(button.dataset.project));
      button.addEventListener("mouseenter", () => {
        if (window.matchMedia("(hover: hover)").matches) {
          render(button.dataset.project);
        }
      });
      button.addEventListener("focus", () => render(button.dataset.project));
    });

    render(buttons.find((button) => button.classList.contains("is-active"))?.dataset.project || "swaad");
  }

  function initContactForm() {
    const form = qs("#contactForm");
    const status = qs("#formStatus");
    if (!form) return;

    function setFieldError(field, message) {
      const label = field.closest("label");
      const error = label ? qs("small", label) : null;
      if (label) {
        label.classList.toggle("is-error", Boolean(message));
      }
      if (error) {
        error.textContent = message;
      }
    }

    function validate() {
      const fields = {
        name: form.elements.name,
        email: form.elements.email,
        subject: form.elements.subject,
        message: form.elements.message
      };

      let isValid = true;
      const emailValue = fields.email.value.trim();

      if (!fields.name.value.trim()) {
        setFieldError(fields.name, "Please enter your name.");
        isValid = false;
      } else {
        setFieldError(fields.name, "");
      }

      if (!emailValue) {
        setFieldError(fields.email, "Please enter your email.");
        isValid = false;
      } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailValue)) {
        setFieldError(fields.email, "Please enter a valid email.");
        isValid = false;
      } else {
        setFieldError(fields.email, "");
      }

      if (!fields.subject.value.trim()) {
        setFieldError(fields.subject, "Please add a subject.");
        isValid = false;
      } else {
        setFieldError(fields.subject, "");
      }

      if (!fields.message.value.trim()) {
        setFieldError(fields.message, "Please write a message.");
        isValid = false;
      } else {
        setFieldError(fields.message, "");
      }

      return isValid;
    }

    form.addEventListener("input", (event) => {
      if (event.target.matches("input, textarea")) {
        setFieldError(event.target, "");
        if (status) status.textContent = "";
      }
    });

    form.addEventListener("submit", (event) => {
      event.preventDefault();

      if (!validate()) {
        if (status) {
          status.textContent = "Please fix the highlighted fields.";
        }
        return;
      }

      if (status) {
        status.textContent = "Sending your message...";
      }

      const formData = new FormData(form);
      formData.set("_subject", `Portfolio message from ${String(formData.get("name") || "a visitor")}`);
      formData.set("_replyto", String(formData.get("email") || ""));

      fetch(form.action, {
        method: "POST",
        body: formData,
        headers: {
          Accept: "application/json"
        }
      })
        .then((response) => {
          if (!response.ok) {
            throw new Error("Message delivery failed.");
          }

          form.reset();
          if (status) {
            status.textContent = "Thanks. Your message was sent to my Gmail.";
          }
        })
        .catch(() => {
          if (status) {
            status.textContent =
              "I could not send the form right now. Please email me at kambleayush69@gmail.com.";
          }
        });
    });
  }

  function initFooterYear() {
    const year = qs("#year");
    if (year) {
      year.textContent = String(new Date().getFullYear());
    }
  }

  function init() {
    initTheme();
    initLoader();
    initNavigation();
    applyAssetPaths();
    initRevealAnimations();
    initTypingEffect();
    initProjectsShowcase();
    initContactForm();
    initFooterYear();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init, { once: true });
  } else {
    init();
  }
})();
