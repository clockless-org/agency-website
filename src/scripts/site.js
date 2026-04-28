// Aperture & Ink — site.js (Studio Manifesto)
// Motion grammar: marquee + reveal-block (color wipe). NO translateY scroll-reveal.

import "../styles/site.css";

// ─── Language handling ─────────────────────────────────────────────────────
const STORAGE_KEY = "agency-lang";

function getLang() {
  const stored = localStorage.getItem(STORAGE_KEY);
  if (stored === "zh" || stored === "en") return stored;
  if (navigator.language && navigator.language.toLowerCase().startsWith("zh")) {
    return "zh";
  }
  return "en";
}

function applyLang(lang) {
  document.documentElement.lang = lang;
  document.documentElement.setAttribute("data-lang", lang);
  localStorage.setItem(STORAGE_KEY, lang);

  document.querySelectorAll("[data-en]").forEach((el) => {
    const target = lang === "zh" ? el.getAttribute("data-zh") : el.getAttribute("data-en");
    if (target !== null) el.innerHTML = target;
  });

  const titleEl = document.querySelector("title");
  if (titleEl) {
    const alt = titleEl.getAttribute("data-" + lang);
    if (alt) titleEl.textContent = alt;
  }

  document.querySelectorAll("[data-placeholder-en]").forEach((el) => {
    const target = lang === "zh"
      ? el.getAttribute("data-placeholder-zh")
      : el.getAttribute("data-placeholder-en");
    if (target !== null && "placeholder" in el) el.placeholder = target;
  });

  document.querySelectorAll("[data-lang-toggle]").forEach((btn) => {
    btn.textContent = lang === "zh" ? "EN" : "中文";
    btn.setAttribute("aria-label", lang === "zh" ? "Switch to English" : "切换到中文");
  });
}

function bindLangToggle() {
  document.querySelectorAll("[data-lang-toggle]").forEach((btn) => {
    btn.addEventListener("click", () => {
      applyLang(document.documentElement.lang === "zh" ? "en" : "zh");
    });
  });
}

applyLang(getLang());
bindLangToggle();

// ─── Nav current-page highlight ────────────────────────────────────────────
const currentPath = window.location.pathname.endsWith("/")
  ? window.location.pathname
  : `${window.location.pathname}/`;

for (const nav of document.querySelectorAll("[data-nav-link]")) {
  const href = nav.getAttribute("href");
  if (!href) continue;
  const normalized = href.endsWith("/") ? href : `${href}/`;
  if (normalized === currentPath) {
    nav.setAttribute("aria-current", "page");
  }
}

// ─── Reveal-block (color wipe) — replaces translateY ───────────────────────
if ("IntersectionObserver" in window) {
  const revealObserver = new IntersectionObserver((entries, obs) => {
    for (const entry of entries) {
      if (entry.isIntersecting) {
        entry.target.classList.add("is-revealed");
        obs.unobserve(entry.target);
      }
    }
  }, { threshold: 0.18, rootMargin: "0px 0px -10% 0px" });

  document.querySelectorAll(".reveal-block").forEach((el) => revealObserver.observe(el));
}

// ─── Marquee — duplicate children once for seamless infinite scroll ────────
document.querySelectorAll(".marquee__track").forEach((track) => {
  if (track.dataset.cloned === "1") return;
  const original = Array.from(track.children).map((node) => node.cloneNode(true));
  for (const node of original) {
    if (node instanceof Element) node.setAttribute("aria-hidden", "true");
    track.appendChild(node);
  }
  track.dataset.cloned = "1";
});

// ─── Contact form (demo-only) ──────────────────────────────────────────────
const form = document.querySelector("[data-consultation-form]");
if (form instanceof HTMLFormElement) {
  const feedback = form.querySelector("[data-form-feedback]");
  const submitButton = form.querySelector("[data-submit-button]");

  form.addEventListener("submit", async (event) => {
    event.preventDefault();
    if (!(submitButton instanceof HTMLButtonElement)) return;

    const honey = form.elements.namedItem("_honey");
    if (honey instanceof HTMLInputElement && honey.value.trim()) return;

    if (feedback instanceof HTMLElement) {
      feedback.className = "form-feedback";
      const lang = document.documentElement.lang;
      feedback.textContent = lang === "zh" ? "正在发送…" : "Sending your request...";
    }

    submitButton.disabled = true;
    await new Promise((r) => setTimeout(r, 700));

    form.reset();
    if (feedback instanceof HTMLElement) {
      feedback.classList.add("is-success");
      const lang = document.documentElement.lang;
      feedback.textContent = lang === "zh"
        ? "谢谢 — Aperture & Ink 将在一个工作日内联系你。（演示表单，不会真的发送。）"
        : "Thanks — Aperture & Ink will follow up within one business day. (Demo form, nothing was sent.)";
    }
    submitButton.disabled = false;
  });
}
