// Motion foundation: GSAP + ScrollTrigger + Lenis, one clock.
// Content is fully visible without this file. Animations only add a
// `.motion` class on <html>, and every "from" state lives behind it.
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";
import { DrawSVGPlugin } from "gsap/DrawSVGPlugin";
import Lenis from "lenis";

gsap.registerPlugin(ScrollTrigger, SplitText, DrawSVGPlugin);

export const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
export const finePointer = window.matchMedia("(hover: hover) and (pointer: fine)").matches;

export const ease = {
  out: "expo.out",          // ~ cubic-bezier(.22,1,.36,1)
  inOut: "power3.inOut",    // ~ cubic-bezier(.65,0,.35,1)
};
export const dur = { fast: 0.3, base: 0.7, slow: 1.2, rite: 2 };

let lenis: Lenis | null = null;

export function startMotion() {
  if (reduced) {
    document.documentElement.classList.add("static");
    return null;
  }
  document.documentElement.classList.add("motion");

  // Smooth scroll only with a mouse/trackpad. Touch keeps native scroll.
  if (finePointer) {
    lenis = new Lenis({ lerp: 0.09, wheelMultiplier: 0.9 });
    lenis.on("scroll", ScrollTrigger.update);
    gsap.ticker.add((t) => lenis!.raf(t * 1000));
    gsap.ticker.lagSmoothing(0);
  }
  gsap.defaults({ ease: ease.out, duration: dur.base });
  return lenis;
}

export function getLenis() {
  return lenis;
}

export { gsap, ScrollTrigger, SplitText, DrawSVGPlugin };
