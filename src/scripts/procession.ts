// The procession of the Arcana. The cards sit on a great circle whose top is
// the apex of an arch; scrolling turns the circle, so each arcanum in turn
// rises to the apex, upright and full size, while the others lean along the
// curve. It starts with the Fool, as the journey through the deck does.
// Desktop with motion only; everywhere else the deck is a plain list.
import { gsap, ScrollTrigger } from "./motion";

const STEP = 11.5; // degrees between two cards on the circle

export function initProcession() {
  const stage = document.querySelector<HTMLElement>("[data-deck]");
  if (!stage) return;
  const mm = gsap.matchMedia();

  mm.add("(min-width: 900px) and (prefers-reduced-motion: no-preference)", () => {
    const cards = gsap.utils.toArray<HTMLElement>(".deck > li", stage);
    const numEl = stage.querySelector<HTMLElement>("[data-deck-num]")!;
    const nameEl = stage.querySelector<HTMLElement>("[data-deck-name]")!;
    const labels = cards.map((li) => li.querySelector("svg")?.getAttribute("aria-label")?.split(", ") ?? ["", ""]);
    const last = cards.length - 1;
    stage.classList.add("is-procession");

    let R = 0;
    const measure = () => {
      const cardW = Math.min(Math.max(window.innerWidth * 0.15, 170), 250);
      R = Math.max(window.innerHeight * 1.25, window.innerWidth * 0.62);
      stage.style.setProperty("--card-w", `${cardW}px`);
      stage.style.setProperty("--R", `${R}px`);
      stage.style.setProperty("--apex", `${window.innerHeight * 0.5}px`);
    };

    let current = -1;
    const setters = cards.map((c) => ({
      x: gsap.quickSetter(c, "x", "px"),
      y: gsap.quickSetter(c, "y", "px"),
      r: gsap.quickSetter(c, "rotation", "deg"),
      sx: gsap.quickSetter(c, "scaleX"), // the "scale" shorthand is not settable
      sy: gsap.quickSetter(c, "scaleY"),
      o: gsap.quickSetter(c, "opacity"),
    }));

    const render = (f: number) => {
      cards.forEach((c, i) => {
        const d = i - f;
        const ad = Math.abs(d);
        const a = (d * STEP * Math.PI) / 180;
        const set = setters[i];
        // the card at the apex stands up and steps forward
        const lift = Math.exp(-ad * ad * 0.9);
        set.x(R * Math.sin(a));
        set.y(R * (1 - Math.cos(a)) - lift * 28);
        set.r(d * STEP);
        const sc = 0.8 + lift * 0.3 - Math.min(ad, 6) * 0.02;
        set.sx(sc);
        set.sy(sc);
        set.o(ad > 6 ? 0 : Math.min(1, 6.2 - ad));
        c.style.zIndex = String(100 - Math.round(ad * 4));
      });
      const k = Math.round(f);
      if (k !== current) {
        current = k;
        const [num, name] = labels[k];
        numEl.textContent = num.replace("Arcano ", "");
        nameEl.textContent = name;
        gsap.fromTo([numEl, nameEl], { yPercent: 18, opacity: 0.2 }, { yPercent: 0, opacity: 1, duration: 0.5, ease: "expo.out", stagger: 0.04, overwrite: true });
      }
    };

    measure();
    render(0);
    const st = ScrollTrigger.create({
      trigger: stage,
      start: "top top",
      end: () => `+=${last * window.innerHeight * 0.2}`,
      pin: true,
      anticipatePin: 1,
      refreshPriority: 1, // after the hero pin, before the triggers further down
      invalidateOnRefresh: true,
      snap: { snapTo: 1 / last, duration: { min: 0.2, max: 0.5 }, delay: 0.08, ease: "power2.inOut" },
      onUpdate: (self) => render(self.progress * last),
      onRefresh: (self) => { measure(); render(self.progress * last); },
    });

    return () => {
      st.kill();
      stage.classList.remove("is-procession");
      gsap.set(cards, { clearProps: "all" });
    };
  });

  // the ribbon of the arts slides with the scroll, everywhere motion is allowed
  mm.add("(prefers-reduced-motion: no-preference)", () => {
    const track = document.querySelector<HTMLElement>(".ribbon-track");
    if (!track) return;
    gsap.fromTo(track, { xPercent: 0 }, {
      xPercent: -50,
      ease: "none",
      scrollTrigger: { trigger: ".ribbon", start: "top bottom", end: "bottom top", scrub: true },
    });
  });
}
