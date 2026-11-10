import { createRef } from "react";

import { fireEvent, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import { GameActivityCard } from "./GameActivityCard";

test("exposes controlled card selection, native ref and an image-independent label", () => {
  const ref = createRef<HTMLButtonElement>();
  const { container, rerender } = render(
    <GameActivityCard
      ref={ref}
      title="Activity"
      description="Description"
      imageUrl="/missing.webp"
      imageWidth={400}
      imageHeight={400}
      selected
    />,
  );
  const button = screen.getByRole("button");
  expect(ref.current).toBe(button);
  expect(button).toHaveAttribute("aria-pressed", "true");
  fireEvent.error(container.querySelector("img")!);
  expect(button).toHaveTextContent("Activity");
  expect(container.querySelector("img")).toBeNull();
  rerender(
    <GameActivityCard
      ref={ref}
      title="Activity"
      description="Description"
      imageUrl="/new.webp"
      imageWidth={400}
      imageHeight={400}
    />,
  );
  expect(container.querySelector("img")).toHaveAttribute("src", "/new.webp");
  expect(button).toHaveAttribute("aria-pressed", "false");
});

test("keeps decorative motion separate from accessible card content and native selection", async () => {
  const user = userEvent.setup();
  const onSelect = vi.fn();
  const { container, rerender } = render(
    <GameActivityCard
      title="Campaign"
      imageUrl="/campaign.webp"
      imageWidth={400}
      imageHeight={400}
      caption="Coming soon"
      unavailable
      onClick={onSelect}
    />,
  );
  const card = screen.getByRole("button", { name: /Campaign/ });
  expect(card).toHaveAccessibleDescription("Coming soon");
  expect(container.querySelector(".game-activity-effects")).toHaveAttribute("aria-hidden", "true");
  expect(container.querySelectorAll(".game-activity-spark")).toHaveLength(8);
  await user.hover(card);
  expect(onSelect).not.toHaveBeenCalled();
  expect(card).toHaveAttribute("aria-pressed", "false");
  await user.click(card);
  expect(onSelect).toHaveBeenCalledOnce();
  rerender(
    <GameActivityCard
      title="Campaign"
      imageUrl="/campaign.webp"
      imageWidth={400}
      imageHeight={400}
      caption="Coming soon"
      unavailable
      selected
    />,
  );
  expect(card).toHaveAttribute("aria-pressed", "true");
  expect(card).toHaveAttribute("data-unavailable", "true");
});
