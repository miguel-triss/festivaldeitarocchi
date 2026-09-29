// Hero: the opening rite, then the walk through the arch.
//
// Opening (about 2.7 s, 1.1 s on later visits in the same session):
//   the arch is drawn from the keystone down, its lights come on, the stars
//   appear, dawn fills the window and the sun rises at the top of the stairs,
//   then the name and the invitation. Any click, key, wheel or touch skips it.
// Scroll: the hero is pinned; the copy lifts away and you move up the stairs
//   towards the sun until the arch fills the screen and daylight takes over.
import { gsap, ScrollTrigger, reduced, getLenis } from "./motion";

const KEY = "ftv-intro-seen";
const token = (name: string) => getComputedStyle(document.documentElement).getPropertyValue(name).trim();

export function initHero() {
  const hero = document.querySelector<HTMLElement>(".hero");
  const root = document.documentElement;
  if (!hero || reduced) {
    root.classList.remove("motion-pending");
    return;
  }
  const q = gsap.utils.selector(hero);
  const sun = q(".hero-sun");
  const win = q(".hero-window");
  const crescents = q(".hero-crescent");
  const skipBtn = q(".hero-skip")[0] as HTMLButtonElement | undefined;

  let seen = false;
  try { seen = sessionStorage.getItem(KEY) === "1"; } catch {}

  const lenis = getLenis();
  const intro = gsap.timeline({ defaults: { ease: "expo.out" }, onComplete: finish });
  intro
    .fromTo(q(".arch-line"), { drawSVG: "50% 50%" }, { drawSVG: "0% 100%", duration: 1.4, ease: "power2.inOut", stagger: 0.12 }, 0)
    .from(q(".arch-light"), { scale: 0, opacity: 0, transformOrigin: "50% 50%", duration: 0.5, stagger: { each: 0.035, from: "center" } }, 0.55)
    .from(q(".arch-eye, .arch-pupil"), { opacity: 0, scale: 0.4, transformOrigin: "50% 50%", duration: 0.9 }, 0.5)
    .from(q(".hero-star"), { opacity: 0, scale: 0.2, duration: 0.9, stagger: { each: 0.04, from: "random" } }, 0.25)
    .from(win, { opacity: 0, duration: 1.1, ease: "power1.inOut" }, 0.95)
    .from(sun, { yPercent: 55, duration: 2.1, ease: "power3.out" }, 0.95)
    .from(q(".wm-line"), { yPercent: 35, opacity: 0, duration: 1.3, stagger: 0.16 }, 1.35)
    .from(crescents, { opacity: 0, x: (i) => (i ? -24 : 24), duration: 1.4 }, 1.5)
    .from(q("[data-intro='late']"), { y: 14, opacity: 0, duration: 0.9, stagger: 0.07 }, 1.85);

  // the timeline now owns the "from" states: stop hiding things with CSS
  root.classList.remove("motion-pending");

  // back on a page already scrolled, or in a later visit: no rite, or a short one
  if (window.scrollY > 40) intro.progress(1);
  else if (seen) intro.timeScale(2.4);
  else {
    lenis?.stop();
    if (skipBtn) {
      skipBtn.hidden = false;
      gsap.from(skipBtn, { opacity: 0, delay: 0.6, duration: 0.6 });
    }
  }

  const skip = () => intro.progress() < 1 && intro.progress(1);
  const events = ["pointerdown", "keydown", "wheel", "touchstart"] as const;
  events.forEach((e) => window.addEventListener(e, skip, { passive: true }));

  function finish() {
    events.forEach((e) => window.removeEventListener(e, skip));
    skipBtn?.remove();
    try { sessionStorage.setItem(KEY, "1"); } catch {}
    lenis?.start();
    walkThrough();
  }

  function walkThrough() {
    const portal = q(".hero-portal")[0] as HTMLElement;
    const day = q(".hero-daylight")[0] as HTMLElement;
    const w = win[0] as HTMLElement;
    const S = 2; // portal scale at the hand-over to the full-screen daylight
    // the window's arch at scale S, as an inset() clip on the hero. Works from
    // any current state: the transform origin is the one point that never moves.
    const archClip = () => {
      const h = hero.getBoundingClientRect();
      const p = portal.getBoundingClientRect();
      const r = w.getBoundingClientRect();
      const k = S / (Number(gsap.getProperty(portal, "scale")) || 1);
      const ox = p.left + p.width * 0.5, oy = p.top + p.height * 0.64;
      const L = ox + (r.left - ox) * k - h.left, T = oy + (r.top - oy) * k - h.top;
      const W = r.width * k, H = r.height * k;
      return `inset(${T}px ${h.width - L - W}px ${h.height - T - H}px ${L}px round ${W / 2}px ${W / 2}px 0px 0px)`;
    };
    const fullClip = () => {
      const R = Math.max(window.innerWidth, window.innerHeight);
      return `inset(${-R * 0.2}px ${-R * 0.2}px ${-R * 0.2}px ${-R * 0.2}px round ${R}px ${R}px 0px 0px)`;
    };
    const tl = gsap.timeline({
      defaults: { ease: "none" },
      scrollTrigger: {
        trigger: hero,
        start: "top top",
        end: () => `+=${window.innerHeight * 1.1}`,
        scrub: 0.6,
        pin: true,
        anticipatePin: 1,
        invalidateOnRefresh: true,
        refreshPriority: 2, // measured before every trigger below it
      },
    });
    // modest scale only: very large scaled layers stall the compositor
    tl.to(q(".hero-copy"), { y: -60, opacity: 0, duration: 0.3 }, 0)
      .to(crescents, { opacity: 0, x: (i) => (i ? 50 : -50), duration: 0.3 }, 0)
      .to(q(".hero-sky"), { yPercent: 10, opacity: 0.4, duration: 1 }, 0)
      .to(portal, { scale: S, ease: "power2.in", duration: 0.55 }, 0.05)
      .to(sun, { yPercent: 6, scale: 1.2, duration: 0.55 }, 0.05)
      // light through gold, never through grey: the window glows, then turns to day
      .fromTo(q(".hero-window-day"), { opacity: 0, backgroundColor: token("--c-gold") },
        { opacity: 1, backgroundColor: token("--c-cream"), ease: "power1.in", duration: 0.22 }, 0.38)
      .set(day, { visibility: "visible" }, 0.6)
      .fromTo(day, { clipPath: archClip }, { clipPath: fullClip, ease: "power2.in", duration: 0.4, immediateRender: false }, 0.6)
      // daylight has taken over: drop the scaled layers, keep a cream page
      .set(hero, { backgroundColor: "var(--c-cream)" }, 1)
      .set(q(".hero-stage, .hero-sky"), { autoAlpha: 0 }, 1);
    ScrollTrigger.refresh();
  }
}
