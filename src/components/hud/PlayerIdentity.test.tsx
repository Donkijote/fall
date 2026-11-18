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

test("progression exposes the new meter immediately and does not replay unchanged XP", async () => {
  const { default: gsap } = await import("gsap");
  const { rerender, unmount } = render(
    <PlayerIdentity name="Player" level={4} experience={{ value: 60, maximum: 100 }} />,
  );
  const meter = screen.getByRole("meter");
  const fill = meter.firstElementChild as HTMLElement;
  expect(fill.style.width).toBe("60%");
  rerender(<PlayerIdentity name="Player" level={4} experience={{ value: 85, maximum: 100 }} />);
  expect(meter).toHaveAttribute("aria-valuenow", "85");
  const tween = gsap.getTweensOf(fill).find((entry) => entry.vars.width === "85%");
  expect(tween).toBeDefined();
  rerender(<PlayerIdentity name="Renamed" level={4} experience={{ value: 85, maximum: 100 }} />);
  expect(gsap.getTweensOf(fill)).toContain(tween);
  rerender(<PlayerIdentity name="Player" level={5} experience={{ value: 10, maximum: 100 }} />);
  expect(fill.style.width).toBe("0%");
  expect(meter).toHaveAttribute("aria-valuenow", "10");
  unmount();
  expect(gsap.getTweensOf(fill)).toHaveLength(0);
});
