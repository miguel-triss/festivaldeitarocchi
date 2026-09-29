// VI. Small, tactile moments, no pinning: the formats are written down one by
// one, the "In arrivo" stamp is slammed onto the notice, the prize seal turns
// with the scroll, and the collection frames are drawn onto the wall.
import { gsap, reduced } from "./motion";

export function initContenuti() {
  if (reduced) return;

  const formats = document.querySelectorAll("[data-formats] li");
  if (formats.length) {
    gsap.from(formats, {
      x: -14,
      opacity: 0,
      duration: 0.8,
      stagger: 0.06,
      ease: "expo.out",
      scrollTrigger: { trigger: "[data-formats]", start: "top 80%", once: true },
    });
  }

  const stamp = document.querySelector("[data-call-stamp]");
  if (stamp) {
    gsap.from(stamp, {
      scale: 2.4,
      opacity: 0,
      rotation: -40,
      duration: 0.5,
      ease: "back.out(2.2)",
      scrollTrigger: { trigger: stamp, start: "top 75%", once: true },
    });
  }

  const seal = document.querySelector("[data-seal] .seal-ring");
  if (seal) {
    gsap.fromTo(seal, { rotation: -40 }, {
      rotation: 40,
      ease: "none",
      transformOrigin: "50% 50%",
      scrollTrigger: { trigger: "[data-seal]", start: "top bottom", end: "bottom top", scrub: true },
    });
  }

  const wall = document.querySelector<HTMLElement>("[data-wall]");
  if (wall) {
    const q = gsap.utils.selector(wall);
    gsap.timeline({ scrollTrigger: { trigger: wall, start: "top 80%", once: true } })
      .fromTo(q(".frame-line"), { drawSVG: "50% 50%" }, { drawSVG: "0% 100%", duration: 1.2, stagger: 0.12, ease: "power2.inOut" })
      .from(q(".frame-fill"), { opacity: 0, duration: 0.6 }, 0.6)
      .from(q(".frame-star"), { scale: 0, transformOrigin: "50% 50%", duration: 0.7, ease: "back.out(2)" }, 0.9)
      .from(q(".frame-label"), { opacity: 0, y: 6, duration: 0.5, stagger: 0.08 }, 0.8);
  }
}
