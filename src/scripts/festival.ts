// III and IV. Signs swing on their pole, the Passport gets stamped in the
// visitor's own order, the Fabbrica opens inside a widening arch and the plan
// draws itself around the Hub. Active-sign tracking also runs with reduced
// motion (it is information, not decoration); everything else does not.
import { gsap, ScrollTrigger, reduced } from "./motion";

export function initFestival() {
  signpost();
  if (reduced) return;
  booklet();
  fabbricaPhoto();
  plan();
}

function signpost() {
  const post = document.querySelector<HTMLElement>("[data-signpost]");
  if (!post) return;
  const signs = gsap.utils.toArray<HTMLElement>(".sign", post);

  document.querySelectorAll<HTMLElement>("[data-part]").forEach((part) => {
    const sign = post.querySelector<HTMLElement>(`[data-sign="${part.dataset.part}"]`);
    ScrollTrigger.create({
      trigger: part,
      start: "top 60%",
      end: "bottom 40%",
      onToggle: (self) => {
        if (!self.isActive) return;
        signs.forEach((s) => s.classList.toggle("is-active", s === sign));
        signs.forEach((s) => s.setAttribute("aria-current", String(s === sign)));
      },
    });
  });

  if (reduced) return;
  // hung one by one: each sign drops onto the pole and settles with a sway
  // (trigger on the static container: sticky elements measure unreliably)
  gsap.from(signs, {
    rotation: (i) => (i % 2 ? 24 : -24),
    y: -30,
    autoAlpha: 0,
    transformOrigin: (i) => (i % 2 ? "100% 0%" : "0% 0%"),
    duration: 1.6,
    stagger: 0.14,
    ease: "elastic.out(1, 0.45)",
    clearProps: "opacity,visibility",
    scrollTrigger: { trigger: post.parentElement!, start: "top 75%", once: true },
  });
}

function booklet() {
  const book = document.querySelector<HTMLElement>("[data-booklet]");
  if (!book) return;
  const slots = gsap.utils
    .toArray<HTMLElement>(".slot", book)
    .filter((s) => Number(s.dataset.order) >= 0)
    .sort((a, b) => Number(a.dataset.order) - Number(b.dataset.order));
  const inks = slots.map((s) => s.querySelector(".stamp"));
  gsap.set(inks, { opacity: 0 });
  const tl = gsap.timeline({ scrollTrigger: { trigger: book, start: "top 70%", once: true } });
  inks.forEach((ink, i) => {
    tl.fromTo(ink, { scale: 1.7, opacity: 0 }, { scale: 1, opacity: 0.9, duration: 0.35, ease: "back.out(2.4)" }, i * 0.45)
      .fromTo(book, { y: 0 }, { y: 3, duration: 0.08, yoyo: true, repeat: 1, ease: "power1.inOut" }, i * 0.45 + 0.05);
  });
}

function fabbricaPhoto() {
  const wrap = document.querySelector<HTMLElement>("[data-fabbrica-photo]");
  if (!wrap) return;
  const frame = wrap.querySelector<HTMLElement>(".fabbrica-frame")!;
  const img = wrap.querySelector<HTMLElement>("img");
  // the arch starts as a narrow doorway and widens to the whole hall
  gsap.fromTo(
    frame,
    { clipPath: "inset(0% 30% 0% 30% round 40vw 40vw 0.5rem 0.5rem)" },
    {
      clipPath: "inset(0% 0% 0% 0% round 45vw 45vw 0.5rem 0.5rem)",
      ease: "none",
      scrollTrigger: { trigger: wrap, start: "top 85%", end: "center 55%", scrub: true },
    },
  );
  if (img) {
    gsap.fromTo(img, { yPercent: -6 }, {
      yPercent: 6,
      ease: "none",
      scrollTrigger: { trigger: wrap, start: "top bottom", end: "bottom top", scrub: true },
    });
  }
}

function plan() {
  const fig = document.querySelector<HTMLElement>("[data-plan]");
  if (!fig) return;
  const q = gsap.utils.selector(fig);
  const tl = gsap.timeline({ scrollTrigger: { trigger: fig, start: "top 75%", once: true } });
  tl.from(q(".plan-hub"), { scale: 0, transformOrigin: "50% 50%", duration: 0.9, ease: "back.out(1.6)" })
    .from(q(".plan-hub-label"), { opacity: 0, duration: 0.5 }, 0.4)
    .fromTo(q(".plan-orbit"), { drawSVG: "0%" }, { drawSVG: "100%", duration: 1.4, ease: "power2.inOut", stagger: 0.2 }, 0.2)
    .from(q(".plan-arch"), { scale: 0, opacity: 0, transformOrigin: "50% 100%", duration: 0.4, stagger: 0.035, ease: "back.out(2)" }, 0.6)
    .from(q(".plan-dimore"), { opacity: 0, duration: 0.6 }, 1.1)
    .from(q(".plan-space"), { opacity: 0, y: 8, duration: 0.6, stagger: 0.1 }, 1.2);
}
