import { matchFallEffect } from "./matchFallEffect";

test("maps the captured rank to the Fall impact", () => {
  expect(matchFallEffect(10)).toBe("ice");
  expect(matchFallEffect(11)).toBe("heat");
  expect(matchFallEffect(12)).toBe("flame");
  expect(matchFallEffect(7)).toBe("plain");
});
