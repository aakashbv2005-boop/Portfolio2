(function () {
  "use strict";

  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const hasHover = window.matchMedia("(hover: hover)").matches;

  /* ---------- Footer year ---------- */
  document.querySelectorAll("#year").forEach((el) => (el.textContent = new Date().getFullYear()));

  /* ---------- Boot sequence (once per session) ---------- */
  (function boot() {
    const already = sessionStorage.getItem("abn-booted");
    if (already || reduceMotion) return;
    sessionStorage.setItem("abn-booted", "1");

    const screen = document.createElement("div");
    screen.className = "boot-screen";
    screen.innerHTML =
      '<div class="boot-inner">' +
      '<div class="boot-logo">ABN<span>.</span> SYSTEM</div>' +
      '<div class="boot-status" id="bootStatus">INITIALIZING…</div>' +
      '<div class="boot-bar"><div class="boot-bar-fill" id="bootFill"></div></div>' +
      '<div class="boot-pct" id="bootPct">00%</div>' +
      "</div>";
    document.body.prepend(screen);

    const lines = [
      "LOADING ASSETS…",
      "CALIBRATING SENSORS…",
      "COMPILING SCHEMATICS…",
      "SYSTEM READY.",
    ];
    const statusEl = screen.querySelector("#bootStatus");
    const fillEl = screen.querySelector("#bootFill");
    const pctEl = screen.querySelector("#bootPct");
    let step = 0;
    const stepDur = 220;
    const timer = setInterval(() => {
      step++;
      const pct = Math.min(100, Math.round((step / lines.length) * 100));
      fillEl.style.width = pct + "%";
      pctEl.textContent = String(pct).padStart(2, "0") + "%";
      if (lines[step - 1]) statusEl.textContent = lines[step - 1];
      if (step >= lines.length) {
        clearInterval(timer);
        setTimeout(() => {
          screen.classList.add("hidden");
          setTimeout(() => screen.remove(), 550);
        }, 260);
      }
    }, stepDur);
  })();

  /* ---------- Mobile nav toggle ---------- */
  const navToggle = document.getElementById("navToggle");
  const navLinks = document.getElementById("navLinks");
  if (navToggle && navLinks) {
    navToggle.addEventListener("click", () => {
      const open = navLinks.classList.toggle("open");
      navToggle.setAttribute("aria-expanded", open ? "true" : "false");
    });
    navLinks.querySelectorAll("a").forEach((a) =>
      a.addEventListener("click", () => {
        navLinks.classList.remove("open");
        navToggle.setAttribute("aria-expanded", "false");
      })
    );
  }

  /* ---------- Active nav link by current file ---------- */
  const path = window.location.pathname.split("/").pop() || "index.html";
  document.querySelectorAll('.nav-links a[data-page]').forEach((a) => {
    if (a.getAttribute("data-page") === path) a.classList.add("active");
  });

  /* ---------- Status ticker ---------- */
  (function ticker() {
    const nav = document.querySelector(".nav");
    if (!nav) return;
    const items = [
      "OPEN TO INTERNSHIPS",
      "ROBOTICS",
      "INDUSTRIAL AUTOMATION",
      "PLC PROGRAMMING",
      "CAD / SOLIDWORKS",
      "MECHATRONICS",
      "SMART MANUFACTURING",
      "EMBEDDED SYSTEMS",
      "COIMBATORE, INDIA",
    ];
    const build = () =>
      items
        .map((t) => `<span class="ticker-item"><span class="sep">◆</span>${t}</span>`)
        .join("");
    const wrap = document.createElement("div");
    wrap.className = "ticker";
    wrap.setAttribute("aria-hidden", "true");
    const track = document.createElement("div");
    track.className = "ticker-track";
    track.innerHTML = build() + build();
    wrap.appendChild(track);
    nav.insertAdjacentElement("afterend", wrap);
    if (reduceMotion) wrap.classList.add("paused");
  })();

  /* ---------- CAD crosshair cursor ---------- */
  if (!reduceMotion && hasHover) {
    const cur = document.createElement("div");
    cur.className = "cad-cursor";
    cur.innerHTML =
      '<div class="cad-h"></div><div class="cad-v"></div><div class="cad-dot"></div><div class="cad-coord">X0000 Y0000</div>';
    document.body.appendChild(cur);
    const h = cur.querySelector(".cad-h");
    const v = cur.querySelector(".cad-v");
    const dot = cur.querySelector(".cad-dot");
    const coord = cur.querySelector(".cad-coord");
    let shown = false;
    window.addEventListener(
      "mousemove",
      (e) => {
        if (!shown) {
          cur.classList.add("on");
          shown = true;
        }
        h.style.top = e.clientY + "px";
        v.style.left = e.clientX + "px";
        dot.style.left = e.clientX + "px";
        dot.style.top = e.clientY + "px";
        coord.style.left = e.clientX + "px";
        coord.style.top = e.clientY + "px";
        coord.textContent =
          "X" + String(e.clientX).padStart(4, "0") + " Y" + String(e.clientY).padStart(4, "0");
      },
      { passive: true }
    );
    window.addEventListener("mouseleave", () => cur.classList.remove("on"));
  }

  /* ---------- Cursor glow follow ---------- */
  const glow = document.querySelector(".cursor-glow");
  if (glow && !reduceMotion && hasHover) {
    window.addEventListener(
      "mousemove",
      (e) => {
        glow.style.left = e.clientX + "px";
        glow.style.top = e.clientY + "px";
      },
      { passive: true }
    );
  }

  /* ---------- Hero schematic (home page only) ---------- */
  (function heroSchematic() {
    const hero = document.querySelector(".hero");
    if (!hero) return;
    const wrap = document.createElement("div");
    wrap.className = "hero-schematic";
    wrap.setAttribute("aria-hidden", "true");
    wrap.style.right = "clamp(-40px, 2vw, 40px)";
    wrap.style.top = "8%";
    wrap.style.width = "min(46vw, 460px)";
    wrap.innerHTML =
      '<svg viewBox="0 0 400 400" width="100%" height="100%">' +
      '<g class="spin"><circle cx="200" cy="200" r="120" stroke-dasharray="4 10"/></g>' +
      '<circle class="draw" cx="200" cy="200" r="86"/>' +
      '<path class="draw" d="M200 60 L200 20 M340 200 L380 200 M200 340 L200 380 M60 200 L20 200"/>' +
      '<path class="draw" d="M120 120 L280 280 M280 120 L120 280" stroke-dasharray="2 8" opacity="0.3"/>' +
      '<circle class="draw" cx="200" cy="200" r="10"/>' +
      "</svg>";
    hero.appendChild(wrap);
  })();

  /* ---------- Reveal on scroll ---------- */
  const revealEls = document.querySelectorAll(".reveal");
  if (reduceMotion) {
    revealEls.forEach((el) => el.classList.add("in"));
  } else {
    const revealObserver = new IntersectionObserver(
      (entries, obs) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("in");
            obs.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12 }
    );
    revealEls.forEach((el) => revealObserver.observe(el));
  }

  /* ---------- Animated counters (home page) ---------- */
  const statNums = document.querySelectorAll(".num[data-count]");
  function animateCount(el) {
    const target = parseFloat(el.getAttribute("data-count"));
    const decimals = parseInt(el.getAttribute("data-decimal") || "0", 10);
    const duration = 1000;
    const start = performance.now();
    function tick(now) {
      const p = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - p, 3);
      el.textContent = (target * eased).toFixed(decimals);
      if (p < 1) requestAnimationFrame(tick);
      else el.textContent = target.toFixed(decimals);
    }
    if (reduceMotion) el.textContent = target.toFixed(decimals);
    else requestAnimationFrame(tick);
  }
  const statObserver = new IntersectionObserver(
    (entries, obs) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          animateCount(entry.target);
          obs.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.6 }
  );
  statNums.forEach((el) => statObserver.observe(el));

  /* ---------- Skill filter (skills page) ---------- */
  const filterBtns = document.querySelectorAll(".filter-btn");
  const skillCards = document.querySelectorAll(".skill-card");
  if (filterBtns.length && skillCards.length) {
    filterBtns.forEach((btn) => {
      btn.addEventListener("click", () => {
        filterBtns.forEach((b) => b.classList.remove("active"));
        btn.classList.add("active");
        const cat = btn.getAttribute("data-filter");
        skillCards.forEach((card) => {
          const show = cat === "all" || card.getAttribute("data-cat") === cat;
          card.style.display = show ? "" : "none";
        });
      });
    });
  }

  /* ---------- Contact form (front-end only) ---------- */
  const form = document.getElementById("contactForm");
  const formNote = document.getElementById("formNote");
  if (form) {
    form.addEventListener("submit", (e) => {
      e.preventDefault();
      formNote.textContent =
        "TRANSMISSION LOGGED LOCALLY — connect a form service in js/script.js to actually send it.";
      form.reset();
    });
  }

  /* ---------- Split page titles into letters (for magnetic hover) ---------- */
  document.querySelectorAll(".page-title").forEach((el) => {
    const text = el.textContent.trim();
    if (!text) return;
    el.setAttribute("aria-label", text);
    el.textContent = "";
    const words = text.split(" ");
    words.forEach((word, wi) => {
      const wordSpan = document.createElement("span");
      wordSpan.className = "word";
      [...word].forEach((ch) => {
        const letterSpan = document.createElement("span");
        letterSpan.className = "letter";
        letterSpan.textContent = ch;
        wordSpan.appendChild(letterSpan);
      });
      el.appendChild(wordSpan);
      if (wi < words.length - 1) el.appendChild(document.createTextNode(" "));
    });
  });

  /* ---------- Magnetic letters — react to cursor proximity ---------- */
  const magChars = document.querySelectorAll(".wordmark .ch, .page-title .letter");
  if (magChars.length && !reduceMotion && hasHover) {
    const RADIUS = 220;
    let mouseX = -9999,
      mouseY = -9999;
    let ticking = false;

    function updateChars() {
      magChars.forEach((ch) => {
        const r = ch.getBoundingClientRect();
        const cx = r.left + r.width / 2;
        const cy = r.top + r.height / 2;
        const dx = mouseX - cx,
          dy = mouseY - cy;
        const dist = Math.sqrt(dx * dx + dy * dy);
        const t = Math.max(0, 1 - dist / RADIUS);
        if (t > 0.02) {
          const scale = 1 + t * 0.32;
          const lift = t * 16;
          const glow = t * 24;
          ch.style.transform = `translateY(${-lift}px) scale(${scale})`;
          ch.style.textShadow = `0 0 ${glow}px rgba(255,68,51,${(0.15 + t * 0.55).toFixed(2)})`;
          ch.style.color = t > 0.45 ? "var(--redline)" : "";
          ch.classList.toggle("magnet-active", t > 0.45);
        } else {
          ch.style.transform = "";
          ch.style.textShadow = "";
          ch.style.color = "";
          ch.classList.remove("magnet-active");
        }
      });
      ticking = false;
    }

    window.addEventListener(
      "mousemove",
      (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
        if (!ticking) {
          ticking = true;
          requestAnimationFrame(updateChars);
        }
      },
      { passive: true }
    );
  }

  /* ---------- Page transition — plotter-sweep wipe with destination label ---------- */
  const PAGE_TITLES = {
    "index.html": "00 · Home",
    "skills.html": "01 · Skills",
    "experience.html": "02 · Experience",
    "projects.html": "03 · Projects",
    "protosem.html": "04 · Protosem",
    "education.html": "05 · Education",
    "contact.html": "06 · Contact",
    "project-1.html": "Diabetic Retinopathy Classifier",
    "project-2.html": "IoT Assistant for Elderly Care",
  };
  for (let i = 0; i <= 20; i++) PAGE_TITLES[`week-${i}.html`] = `Protosem · Week ${i}`;

  function fileOf(href) {
    return (href.split("/").pop().split("?")[0].split("#")[0]) || "index.html";
  }
  function titleFor(href) {
    const file = fileOf(href);
    return PAGE_TITLES[file] || file.replace(".html", "").replace(/-/g, " ");
  }

  const ptPanel = document.getElementById("ptPanel");
  const ptLabel = document.getElementById("ptLabel");

  function playEntrance() {
    if (!ptPanel) return;
    if (reduceMotion) {
      ptPanel.style.transform = "scaleX(0)";
      return;
    }
    if (ptLabel) {
      ptLabel.textContent = titleFor(fileOf(window.location.pathname));
      ptLabel.style.opacity = "1";
      setTimeout(() => {
        ptLabel.style.opacity = "0";
      }, 300);
    }
    requestAnimationFrame(() => {
      ptPanel.style.transformOrigin = "right";
      ptPanel.classList.add("animate");
      requestAnimationFrame(() => {
        ptPanel.style.transform = "scaleX(0)";
      });
    });
  }
  playEntrance();

  if (ptPanel && !reduceMotion) {
    document.querySelectorAll("a[href]").forEach((a) => {
      const href = a.getAttribute("href");
      if (
        !href ||
        href.startsWith("#") ||
        href.startsWith("http") ||
        href.startsWith("mailto:") ||
        href.startsWith("tel:") ||
        a.target === "_blank" ||
        a.hasAttribute("download")
      )
        return;
      a.addEventListener("click", (e) => {
        if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
        e.preventDefault();
        if (ptLabel) {
          ptLabel.textContent = titleFor(href);
          ptLabel.style.opacity = "1";
        }
        ptPanel.style.transformOrigin = "left";
        ptPanel.classList.add("animate");
        ptPanel.style.transform = "scaleX(1)";
        setTimeout(() => {
          window.location.href = href;
        }, 460);
      });
    });
  }
})();
