/** Two staggered diamond bursts; the caller owns the GSAP context and timeline. */
export function appendAwardGlints(
  timeline: gsap.core.Timeline,
  glints: NodeListOf<HTMLElement>,
  at: number,
  strength = 1,
) {
  glints.forEach((glint, index) => {
    const direction = index % 2 === 0 ? -1 : 1;
    const start = at + index * 0.05;
    timeline.fromTo(
      glint,
      { opacity: 0, scale: 0.2, x: -direction * 4, y: direction * 4, rotation: 0 },
      {
        opacity: 1,
        scale: 1.8 * strength,
        x: direction * 8 * strength,
        y: -direction * 7,
        rotation: 45,
        duration: 0.2,
        ease: "back.out(2.4)",
      },
      start,
    );
    timeline.to(glint, { opacity: 0.55, scale: 0.85, duration: 0.09 }, start + 0.2);
    timeline.to(
      glint,
      {
        opacity: 1,
        scale: 1.45 * strength,
        x: direction * 14 * strength,
        y: -direction * 3,
        rotation: 135,
        duration: 0.12,
        ease: "power2.out",
      },
      start + 0.29,
    );
    timeline.to(
      glint,
      {
        opacity: 0,
        scale: 0.4,
        x: direction * 18 * strength,
        y: -direction * 10,
        duration: 0.12,
        ease: "sine.in",
      },
      start + 0.41,
    );
  });
}
