import { fireEvent, render, screen } from "@testing-library/react";

import { PlayerIdentity } from "./PlayerIdentity";

test("falls back from user avatar to theme portrait to icon without hiding identity", () => {
  const { container, rerender } = render(
    <PlayerIdentity name="Player" avatarUrl="/missing.webp" fallbackAvatarUrl="/fallback.webp" />,
  );
  fireEvent.error(container.querySelector("img")!);
  expect(container.querySelector("img")).toHaveAttribute("src", "/fallback.webp");
  fireEvent.error(container.querySelector("img")!);
  expect(container.querySelector("img")).toBeNull();
  expect(screen.getByRole("group", { name: "Player identity" })).toHaveTextContent("Player");
  rerender(
    <PlayerIdentity
      name="Player"
      avatarUrl="/changed.webp"
      fallbackAvatarUrl="/fallback.webp"
      level={12}
      experience={{ value: 25, maximum: 100 }}
    />,
  );
  expect(container.querySelector("img")).toHaveAttribute("src", "/changed.webp");
  expect(screen.getByText("Level 12")).toBeVisible();
  expect(screen.getByRole("meter", { name: "Experience" })).toHaveAttribute("aria-valuenow", "25");
});

test.each([undefined, -1, 0, Number.NaN, Number.POSITIVE_INFINITY, 1.5])(
  "does not invent a level for invalid display input %s",
  (level) => {
    render(<PlayerIdentity name="Player" level={level} />);
    expect(screen.getByText("Level —")).toBeVisible();
    expect(screen.getByRole("img", { name: "Experience unavailable" })).toBeVisible();
  },
);

test("hovering the identity copy also shines the profile frame without marking a turn", async () => {
  const { default: gsap } = await import("gsap");
  const { container } = render(<PlayerIdentity name="Player" />);
  fireEvent.pointerEnter(screen.getByRole("group", { name: "Player identity" }), {
    pointerType: "mouse",
  });
  const portrait = container.querySelector<HTMLElement>(".game-player-avatar")!;
  const attention = gsap
    .getTweensOf(portrait)
    .find((tween) => "--portrait-attention" in tween.vars)!;
  attention.progress(1);
  expect(portrait.style.getPropertyValue("--portrait-attention")).toBe("1");
  expect(portrait).not.toHaveAttribute("data-highlighted");
});
