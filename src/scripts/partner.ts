// VII. Dusk. The first stars come out and join into a constellation; the four
// arches rise from the floor and open their doors; the banners of the Partner
// Experience swing with the speed of the scroll, like cloth in the wind.
import { gsap, ScrollTrigger, reduced } from "./motion";

export function initPartner() {
  if (reduced) return;
  constellation();
  levels();
  bunting();
}

function constellation() {
  const box = document.querySelector<HTMLElement>("[data-constellation]");
  if (!box) return;
  const q = gsap.utils.selector(box);
  const stars = q(".reason-star");
  const lines = q(".constellation-lines line");
  const texts = q(".reason h3, .reason p");
  const tl = gsap.timeline({
    defaults: { ease: "none" },
    scrollTrigger: { trigger: box, start: "top 78%", end: "center 45%", scrub: 0.8 },
  });
  // star, line, star, line, star: the figure is drawn in reading order
  stars.forEach((s, i) => {
    tl.from(s, { scale: 0, rotation: -90, opacity: 0, duration: 0.5, ease: "back.out(2)" }, i * 1.1)
      .from(texts.slice(i * 2, i * 2 + 2), { opacity: 0, y: 12, duration: 0.5, stagger: 0.12 }, i * 1.1 + 0.2);
    if (lines[i]) tl.fromTo(lines[i], { drawSVG: "0%" }, { drawSVG: "100%", duration: 0.6 }, i * 1.1 + 0.45);
  });
}

function levels() {
  const list = document.querySelector<HTMLElement>("[data-levels]");
  if (!list) return;
  const arches = gsap.utils.toArray<HTMLElement>(".level-arch", list);

  // rise from the floor, one after the other, following the scroll
  gsap.from(arches, {
    yPercent: 38,
    ease: "none",
    stagger: 0.18,
    scrollTrigger: { trigger: list, start: "top bottom", end: "top 35%", scrub: 0.6 },
  });

  // then the doors swing open; they close again if you go back up
  arches.forEach((arch, i) => {
    const l = arch.querySelector(".leaf--l");
    const r = arch.querySelector(".leaf--r");
    const inside = arch.querySelectorAll(".level-inside > *");
    const tl = gsap.timeline({ paused: true })
      .to(l, { rotationY: -108, duration: 1.3, ease: "power3.inOut" }, 0)
      .to(r, { rotationY: 108, duration: 1.3, ease: "power3.inOut" }, 0)
      .from(inside, { opacity: 0, y: 14, duration: 0.8, stagger: 0.06, ease: "expo.out" }, 0.45);
    ScrollTrigger.create({
      trigger: arch,
      start: "top 62%",
      onEnter: () => gsap.delayedCall(window.innerWidth > 1100 ? i * 0.16 : 0, () => tl.play()),
      onLeaveBack: () => tl.reverse(),
    });
  });
}

function bunting() {
  const box = document.querySelector<HTMLElement>("[data-bunting]");
  if (!box) return;
  const flags = gsap.utils.toArray<HTMLElement>(".flag", box);
  const string = box.querySelector(".bunting-string path");

  // hung along the string, left to right
  const hang = gsap.timeline({ scrollTrigger: { trigger: box, start: "top 80%", once: true } });
  if (string) hang.fromTo(string, { drawSVG: "0%" }, { drawSVG: "100%", duration: 1.2, ease: "power2.inOut" }, 0);
  hang.from(flags, { yPercent: -60, rotation: -18, opacity: 0, duration: 1.4, stagger: 0.08, ease: "elastic.out(1, 0.5)" }, 0.2);

  // the faster you scroll, the more the cloth swings; it settles when you stop
  const swings = flags.map((f) => gsap.quickTo(f, "rotation", { duration: 0.9, ease: "power3.out" }));
  let settle: gsap.core.Tween | null = null;
  ScrollTrigger.create({
    trigger: box,
    start: "top bottom",
    end: "bottom top",
    onUpdate: (self) => {
      const v = gsap.utils.clamp(-10, 10, self.getVelocity() / -220);
      swings.forEach((s, i) => s(v * (0.6 + ((i * 37) % 10) / 20)));
      settle?.kill();
      settle = gsap.delayedCall(0.15, () => swings.forEach((s) => s(0)));
    },
  });
}
