import gsap from "gsap";

import { appendPerfectTableAward } from "./tableBonusChoreography";

afterEach(() => {
  gsap.globalTimeline.clear();
});

it("sweeps the artwork, emits round motes and pulses the coin within the existing reading window", () => {
  const perfect = document.createElement("div");
  perfect.style.opacity = "0";
  perfect.innerHTML =
    '<span data-perfect-artwork-shine style="opacity:0"></span><span data-perfect-particle style="opacity:0"></span><div data-award-coin></div>';
  let timeline!: gsap.core.Timeline;
  const context = gsap.context(() => {
    timeline = gsap.timeline({ paused: true });
    appendPerfectTableAward(timeline, perfect, 4);
  });
  expect(timeline.duration()).toBe(1.55);
  timeline.time(0.52);
  const shine = perfect.querySelector("[data-perfect-artwork-shine]")!;
  const particle = perfect.querySelector("[data-perfect-particle]")!;
  const coin = perfect.querySelector("[data-award-coin]")!;
  expect(Number(gsap.getProperty(coin, "scale"))).toBeGreaterThan(1);
  timeline.time(0.85);
  expect(Number(gsap.getProperty(shine, "opacity"))).toBeGreaterThan(0.5);
  expect(Number(gsap.getProperty(particle, "opacity"))).toBeGreaterThan(0);
  expect(Number(gsap.getProperty(shine, "xPercent"))).toBeGreaterThan(-200);
  expect(Number(gsap.getProperty(shine, "xPercent"))).toBeLessThan(200);
  timeline.time(1.05);
  expect(Number(gsap.getProperty(perfect, "opacity"))).toBe(1);
  timeline.progress(1);
  expect(Number(gsap.getProperty(perfect, "opacity"))).toBe(0);
  expect(Number(gsap.getProperty(shine, "opacity"))).toBe(0);
  expect(Number(gsap.getProperty(particle, "opacity"))).toBe(0);
  context.revert();
  expect(timeline.parent).toBeNull();
  expect(perfect.style.transform).toBe("");
  expect((coin as HTMLElement).style.transform).toBe("");
});
