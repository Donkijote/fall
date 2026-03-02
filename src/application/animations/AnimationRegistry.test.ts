import {
  coerceAnimationParameters,
  getAnimationDefinitionById,
  getNextAnimationEasing,
  normalizeAnimationPlaybackSettings,
} from "@application/animations/AnimationRegistry";

describe("AnimationRegistry", () => {
  it("clamps persisted playback values to safe ranges", () => {
    const settings = normalizeAnimationPlaybackSettings({
      durationMs: 99,
      delayMs: 9999,
      easing: "invalid" as never,
      loop: false,
    });

    expect(settings.durationMs).toBe(200);
    expect(settings.delayMs).toBe(2000);
    expect(settings.easing).toBe("easeInOutSine");
    expect(settings.loop).toBe(false);
  });

  it("coerces params using defaults and parameter ranges", () => {
    const definition = getAnimationDefinitionById("slide-fade");
    if (!definition) {
      throw new Error("Expected slide-fade definition");
    }

    const params = coerceAnimationParameters(definition, {
      distanceX: 500,
      distanceY: -20,
      startAlpha: Number.NaN,
    });

    expect(params.distanceX).toBe(280);
    expect(params.distanceY).toBe(0);
    expect(params.startAlpha).toBe(0.2);
  });

  it("cycles easing options", () => {
    expect(getNextAnimationEasing("linear")).toBe("easeInOutSine");
    expect(getNextAnimationEasing("easeInOutSine")).toBe("easeOutCubic");
    expect(getNextAnimationEasing("easeOutCubic")).toBe("linear");
  });
});
