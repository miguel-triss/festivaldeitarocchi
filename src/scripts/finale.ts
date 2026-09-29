// VIII to XI, into the night. The astrolabe turns with the scroll, the moon
// waxes along the roadmap, the ink sun is drawn stroke by stroke, the lanterns
// of the Notte light one by one, and the form sends in place.
import { gsap, reduced } from "./motion";
import { FORM_AJAX } from "../data/sections";

export function initFinale() {
  form(); // always: it is function, not decoration
  if (reduced) return;
  astrolabe();
  roadmap();
  inkSun();
  lanterns();
}

function astrolabe() {
  const fig = document.querySelector<HTMLElement>("[data-astrolabe]");
  if (!fig) return;
  const q = gsap.utils.selector(fig);
  gsap.fromTo(q(".astro-turn"), { rotation: -30 }, {
    rotation: 30, ease: "none",
    scrollTrigger: { trigger: fig, start: "top bottom", end: "bottom top", scrub: true },
  });
  gsap.timeline({ scrollTrigger: { trigger: fig, start: "top 75%", once: true } })
    .from(q(".astro-hub"), { scale: 0, transformOrigin: "50% 50%", duration: 0.9, ease: "back.out(1.7)" })
    .fromTo(q(".astro-rim, .astro-ring"), { drawSVG: "0%" }, { drawSVG: "100%", duration: 1.6, stagger: 0.15, ease: "power2.inOut" }, 0.1)
    .fromTo(q(".astro-ray"), { drawSVG: "0%" }, { drawSVG: "100%", duration: 0.6, stagger: 0.06 }, 0.6)
    .from(q(".astro-node"), { scale: 0, transformOrigin: "50% 50%", duration: 0.4, stagger: 0.06, ease: "back.out(2.5)" }, 0.9)
    .from(q(".astro-label"), { opacity: 0, duration: 0.5, stagger: 0.06 }, 1.1)
    .from(q(".astro-tick"), { opacity: 0, duration: 0.8, stagger: 0.005 }, 0.3);
}

function roadmap() {
  const box = document.querySelector<HTMLElement>("[data-roadmap]");
  if (!box) return;
  const q = gsap.utils.selector(box);
  const tl = gsap.timeline({ scrollTrigger: { trigger: box, start: "top 70%", end: "bottom 60%", scrub: 0.8 } });
  tl.fromTo(q(".roadmap-line path"), { drawSVG: "0%" }, { drawSVG: "100%", ease: "none", duration: 3 }, 0);
  q(".roadmap-step").forEach((step, i) => {
    tl.from(step.querySelector(".roadmap-moon"), { scale: 0.3, opacity: 0, rotation: -60, duration: 0.6, ease: "back.out(1.8)" }, i * 1.1)
      .from(step.querySelectorAll("h4, p"), { opacity: 0, y: 14, duration: 0.6, stagger: 0.1 }, i * 1.1 + 0.2);
  });
  const growth = document.querySelectorAll("[data-growth] li");
  if (growth.length) {
    gsap.from(growth, {
      y: 18, opacity: 0, rotation: () => gsap.utils.random(-6, 6), duration: 0.9, stagger: 0.07, ease: "expo.out",
      scrollTrigger: { trigger: "[data-growth]", start: "top 85%", once: true },
    });
  }
}

function inkSun() {
  const fig = document.querySelector<HTMLElement>("[data-ink-sun]");
  if (!fig) return;
  const q = gsap.utils.selector(fig);
  // drawn as a hand would: the disc, then ray after ray, then the face
  gsap.timeline({ defaults: { ease: "none" }, scrollTrigger: { trigger: fig, start: "top 80%", end: "center 40%", scrub: 0.6 } })
    .fromTo(q("circle.ink"), { drawSVG: "0%" }, { drawSVG: "100%", duration: 1 })
    .fromTo(q(".ink--ray"), { drawSVG: "0%" }, { drawSVG: "100%", duration: 0.25, stagger: 0.08 }, 0.8)
    .fromTo(q(".ink--face"), { drawSVG: "0%" }, { drawSVG: "100%", duration: 1 }, ">-0.2");
}

function lanterns() {
  const fig = document.querySelector<HTMLElement>("[data-notte]");
  if (!fig) return;
  const q = gsap.utils.selector(fig);
  const lamps = q(".lamp");
  // lamp by lamp from both piers up to the keystone, following the scroll
  const order = lamps
    .map((l, i) => ({ l, k: Math.min(i, lamps.length - 1 - i) }))
    .sort((a, b) => a.k - b.k);
  const tl = gsap.timeline({ defaults: { ease: "none" }, scrollTrigger: { trigger: fig, start: "top 75%", end: "center 45%", scrub: 0.6 } });
  tl.fromTo(q(".portal-arch"), { drawSVG: "50% 50%" }, { drawSVG: "0% 100%", duration: 2 }, 0);
  order.forEach(({ l, k }) => {
    tl.fromTo(l, { opacity: 0, scale: 0.2, transformOrigin: "50% 50%" }, { opacity: 1, scale: 1, duration: 0.3 }, 0.3 + k * 0.12);
  });
  tl.from(q(".portal-moon"), { y: 60, opacity: 0, duration: 1 }, 1.2)
    .from(q(".portal-eye, .portal-eye-dot"), { opacity: 0, duration: 0.5 }, 2)
    .from(q(".dimora-door"), { opacity: 0, scaleY: 0.3, transformOrigin: "50% 100%", duration: 0.5, stagger: 0.1 }, 1.8)
    .from(q(".floor-glow"), { opacity: 0, duration: 1.2 }, 1.6);
}

function form() {
  const f = document.querySelector<HTMLFormElement>("[data-request]");
  if (!f) return;
  const status = f.querySelector<HTMLElement>("[data-status]")!;
  const label = f.querySelector<HTMLElement>("[data-send-label]")!;
  const button = f.querySelector<HTMLButtonElement>("button[type=submit]")!;

  f.addEventListener("submit", async (e) => {
    e.preventDefault();
    status.classList.remove("is-error");
    // gentle validation, in Italian, focusing the first problem
    const invalid = [...f.querySelectorAll<HTMLInputElement>("[required]")].filter((el) => !el.checkValidity());
    f.querySelectorAll("[aria-invalid]").forEach((el) => el.removeAttribute("aria-invalid"));
    if (invalid.length) {
      invalid.forEach((el) => el.setAttribute("aria-invalid", "true"));
      status.textContent = invalid[0].type === "checkbox"
        ? "Serve il consenso al trattamento dei dati."
        : invalid[0].type === "email" ? "Controlla l'indirizzo email." : "Mancano alcuni campi.";
      status.classList.add("is-error");
      invalid[0].focus();
      return;
    }
    button.disabled = true;
    label.textContent = "Invio in corso…";
    try {
      const res = await fetch(FORM_AJAX, { method: "POST", headers: { Accept: "application/json" }, body: new FormData(f) });
      if (!res.ok) throw new Error(String(res.status));
      f.reset();
      label.textContent = "Richiesta inviata";
      status.textContent = "Grazie. Ti risponderemo presto.";
      if (!reduced) gsap.fromTo(status, { y: 10, opacity: 0 }, { y: 0, opacity: 1, duration: 0.8, ease: "expo.out" });
    } catch {
      label.textContent = "Invia la richiesta";
      button.disabled = false;
      status.textContent = "Invio non riuscito. Riprova o scrivici via email.";
      status.classList.add("is-error");
    }
  });
}

