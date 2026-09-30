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

  // hovering (or focusing) a column lights its group in the sky
  q(".reason").forEach((r) => {
    const i = (r as HTMLElement).dataset.reason!;
    const on = () => {
      box.dataset.active = i;
      q(".chart-group").forEach((g) => g.classList.toggle("is-active", (g as HTMLElement).dataset.group === i));
    };
    const off = () => { delete box.dataset.active; };
    r.addEventListener("pointerenter", on);
    r.addEventListener("pointerleave", off);
    r.addEventListener("focusin", on);
    r.addEventListener("focusout", off);
  });

  // drawn with the scroll: the three stars and their line, then each group
  const tl = gsap.timeline({
    defaults: { ease: "none" },
    scrollTrigger: { trigger: box.querySelector(".chart"), start: "top 80%", end: "bottom 45%", scrub: 0.8 },
  });
  tl.from(q(".chart-dust"), { opacity: 0, duration: 0.6, stagger: { each: 0.01, from: "random" } }, 0)
    .from(q(".chart-ring"), { opacity: 0, scale: 0.8, transformOrigin: "50% 50%", duration: 0.8 }, 0);
  q(".chart-group").forEach((g, i) => {
    const gq = gsap.utils.selector(g);
    const at = 0.3 + i * 1.1;
    tl.from(gq(".chart-star"), { scale: 0, rotation: -90, transformOrigin: "50% 50%", duration: 0.45, ease: "back.out(2)" }, at)
      .fromTo(gq(".chart-line--sat"), { drawSVG: "0%" }, { drawSVG: "100%", duration: 0.4, stagger: 0.06 }, at + 0.25)
      .from(gq(".chart-sat circle"), { scale: 0, transformOrigin: "50% 50%", duration: 0.25, stagger: 0.06, ease: "back.out(3)" }, at + 0.45)
      .from(gq(".chart-sat text"), { opacity: 0, duration: 0.3, stagger: 0.06 }, at + 0.55)
      .fromTo(gq(".chart-line--rim"), { drawSVG: "0%" }, { drawSVG: "100%", duration: 0.3, stagger: 0.05 }, at + 0.7);
    const main = q(".chart-line--main")[i];
    if (main) tl.fromTo(main, { drawSVG: "0%" }, { drawSVG: "100%", duration: 0.5 }, at + 0.8);
  });
  tl.fromTo(q(".chart-line--faint"), { drawSVG: "0%" }, { drawSVG: "100%", duration: 0.6 }, 3.2);
  gsap.from(q(".reason"), {
    y: 24, opacity: 0, duration: 1, stagger: 0.12, ease: "expo.out",
    scrollTrigger: { trigger: box.querySelector(".reasons"), start: "top 88%", once: true },
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
