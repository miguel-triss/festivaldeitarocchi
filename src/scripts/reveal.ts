// Quiet, shared entrances. Text arrives line by line from behind a mask
// (like a card turned face up), blocks rise, collage pieces drift at their
// own depth. Nothing here runs with reduced motion: content is simply there.
import { gsap, SplitText, reduced } from "./motion";

export async function initReveals() {
  if (reduced) return;
  await document.fonts.ready; // split on final metrics, or lines break wrong

  document.querySelectorAll<HTMLElement>("[data-split]").forEach((el) => {
    SplitText.create(el, {
      type: "lines",
      mask: "lines",
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
