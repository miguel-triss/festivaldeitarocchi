// The walk through a Dimora. Six doorways (five rooms and the exit) share
// the same bottom-centre point; doorway i is drawn at scale 2^(p - i), where p
// is the scroll position in rooms. Each doorway already contains the next one
// at half size, so the walk is one seamless self-similar zoom. Every layer is
// scaled on its own and hidden as soon as the next one covers the panel, so
// no layer is ever scaled much beyond 3x (big scaled layers stall Chrome).
import { gsap, ScrollTrigger } from "./motion";

export function initEnfilade() {
  const stage = document.querySelector<HTMLElement>("[data-enfilade]");
  if (!stage) return;
  const mm = gsap.matchMedia();

  mm.add("(min-width: 901px) and (prefers-reduced-motion: no-preference)", () => {
    stage.classList.add("is-enfilade");
    const panel = stage.querySelector<HTMLElement>(".enfilade")!;
    const layers = gsap.utils.toArray<HTMLElement>(".layer", panel);
    const rooms = gsap.utils.toArray<HTMLElement>(".room", stage);
    const steps = gsap.utils.toArray<HTMLElement>(".step", stage);
    const stamp = stage.querySelector<HTMLElement>("[data-room-stamp] .stamp");
    const last = rooms.length - 1;
    // quickSetter cannot drive the "scale" shorthand: set both axes
    const scales = layers.map((l) => {
      const sx = gsap.quickSetter(l, "scaleX"), sy = gsap.quickSetter(l, "scaleY");
      return (v: number) => { sx(v); sy(v); };
    });

    // smallest scale at which a doorway hides the whole panel
    let sCover = 3;
    const measure = () => {
      const pw = panel.clientWidth, ph = panel.clientHeight;
      const H = layers[0].offsetHeight, W = layers[0].offsetWidth;
      const covers = (s: number) => {
        const R = (W * s) / 2, top = H * s - R; // top: where the round part starts
        if (W * s < pw) return false;
        if (ph <= top) return true;
        const dy = ph - top;
        return dy < R && Math.sqrt(R * R - dy * dy) >= pw / 2;
      };
      sCover = 1;
      while (!covers(sCover) && sCover < 12) sCover += 0.02;
    };

    let current = -1;
    let stamped = false;
    const render = (p: number) => {
      layers.forEach((l, i) => {
        const s = Math.pow(2, p - i);
        const nextS = Math.pow(2, p - i - 1);
        const hidden = s < 0.06 || nextS >= sCover;
        l.style.visibility = hidden ? "hidden" : "visible";
        if (!hidden) scales[i](s);
      });
      const k = Math.min(last, Math.max(0, Math.round(p)));
      if (k !== current) {
        const prev = rooms[current];
        current = k;
        if (prev) gsap.to(prev, { autoAlpha: 0, y: -16, duration: 0.35, ease: "power2.in", overwrite: true });
        gsap.fromTo(rooms[k], { autoAlpha: 0, y: 22 }, { autoAlpha: 1, y: 0, duration: 0.7, delay: prev ? 0.2 : 0, ease: "expo.out", overwrite: true });
        steps.forEach((s, i) => s.classList.toggle("is-on", i <= k));
        if (k === last && !stamped && stamp) {
          stamped = true; // the exit stamp, pressed once
          gsap.fromTo(stamp, { scale: 2.2, opacity: 0, rotation: -30 }, { scale: 1, opacity: 0.92, rotation: -10, duration: 0.5, delay: 0.45, ease: "back.out(2.4)" });
        }
      }
    };

    gsap.set(rooms, { autoAlpha: 0 });
    if (stamp) gsap.set(stamp, { opacity: 0 });
    measure();
    render(0);

    const st = ScrollTrigger.create({
      trigger: stage,
      start: "top top",
      end: () => `+=${last * window.innerHeight * 0.9}`,
      pin: true,
      anticipatePin: 1,
      refreshPriority: 1,
      invalidateOnRefresh: true,
      snap: { snapTo: 1 / last, duration: { min: 0.25, max: 0.6 }, delay: 0.08, ease: "power2.inOut" },
      onUpdate: (self) => render(self.progress * last),
      onRefresh: (self) => { measure(); render(self.progress * last); },
    });

    return () => {
      st.kill();
      stage.classList.remove("is-enfilade");
      gsap.set([...layers, ...rooms], { clearProps: "all" });
      if (stamp) gsap.set(stamp, { clearProps: "all" });
      layers.forEach((l) => (l.style.visibility = ""));
    };
  });
}
