// Quiet, shared entrances. Text arrives line by line from behind a mask
// (like a card turned face up), blocks rise, collage pieces drift at their
// own depth. Nothing here runs with reduced motion: content is simply there.
import { gsap, SplitText, reduced } from "./motion";

export async function initReveals() {
  if (reduced) return;
  await document.fonts.ready; // split on final metrics, or lines break wrong

  // section titles: the capitals rise letter by letter, the number slides in,
  // the rule with its star is drawn from the left
  document.querySelectorAll<HTMLElement>(".sec-head").forEach((head) => {
    const title = head.querySelector<HTMLElement>(".sec-title");
    const num = head.querySelector<HTMLElement>(".sec-num");
    if (!title) return;
    SplitText.create(title, {
      type: "words,chars",
      mask: "words",
      autoSplit: true,
      onSplit: (self) => {
        const tl = gsap.timeline({ scrollTrigger: { trigger: head, start: "top 86%", once: true } });
        tl.from(self.chars, { yPercent: 115, rotation: 6, duration: 1.1, stagger: 0.028, ease: "expo.out" }, 0);
        if (num) tl.from(num, { xPercent: -40, opacity: 0, duration: 1, ease: "expo.out" }, 0.1);
        tl.from(head, { "--rule": 0, duration: 1.4, ease: "power3.inOut" }, 0.15);
        return tl;
      },
    });
  });

  document.querySelectorAll<HTMLElement>("[data-split]").forEach((el) => {
    SplitText.create(el, {
      type: "lines",
      mask: "lines",
      aria: "none", // words stay whole in the DOM; an aria-label is not allowed on <p>
      autoSplit: true,
      onSplit: (self) =>
        gsap.from(self.lines, {
          yPercent: 108,
          duration: 1.2,
          stagger: 0.09,
          ease: "expo.out",
          scrollTrigger: { trigger: el, start: "top 84%", once: true },
        }),
    });
  });

  // plants grow in from the ground, stem after stem (the hero's come with the rite)
  gsap.utils.toArray<HTMLElement>("[data-flora]").forEach((fl) => {
    if (fl.closest(".hero")) return;
    gsap.from(fl.querySelectorAll(".flora-stem"), {
      scaleY: 0.05,
      scaleX: 0.6,
      opacity: 0,
      transformOrigin: "50% 100%",
      duration: 1.6,
      stagger: 0.14,
      ease: "expo.out",
      scrollTrigger: { trigger: fl, start: "top 92%", once: true },
    });
  });

  gsap.utils.toArray<HTMLElement>("[data-rise]").forEach((el) => {
    gsap.from(el, {
      y: 36,
      opacity: 0,
      duration: 1.1,
      delay: Number(el.dataset.rise) || 0,
      ease: "expo.out",
      scrollTrigger: { trigger: el, start: "top 90%", once: true },
    });
  });

  gsap.utils.toArray<HTMLElement>("[data-speed]").forEach((el) => {
    const s = Number(el.dataset.speed) || 0;
    gsap.fromTo(el, { y: () => s * 90 }, {
      y: () => s * -90,
      ease: "none",
      scrollTrigger: { trigger: el, start: "top bottom", end: "bottom top", scrub: true, invalidateOnRefresh: true },
    });
  });
}
