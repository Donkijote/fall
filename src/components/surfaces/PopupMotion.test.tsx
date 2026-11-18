import gsap from "gsap";

import { act, fireEvent, render, screen, waitFor } from "@testing-library/react";

import { DialogClose, DialogTitle, DialogTrigger } from "../ui/dialog";
import { PopoverTrigger } from "../ui/popover";
import { ModalContent } from "./ModalContent";
import { PopoverPanel } from "./PopoverPanel";
import { MotionDialog, MotionPopover } from "./PopupMotion";

const preference = vi.hoisted(() => ({ reduced: false }));
vi.mock("@/infrastructure/ui/hooks/useGamePreferences", () => ({
  useReducedMotion: () => preference.reduced,
}));
beforeEach(() => {
  preference.reduced = false;
});
function finish(element: HTMLElement) {
  act(() => {
    for (const tween of gsap.getTweensOf(element)) {
      (tween.parent as gsap.core.Timeline).progress(1);
    }
  });
}
function DialogPreview({ open }: { open?: boolean }) {
  return (
    <MotionDialog open={open}>
      <DialogTrigger>Open</DialogTrigger>
      <ModalContent>
        <DialogTitle>Test</DialogTitle>
        <DialogClose>Dismiss</DialogClose>
      </ModalContent>
    </MotionDialog>
  );
}
test("retains a closing dialog until GSAP completes and restores native focus", async () => {
  render(<DialogPreview />);
  const trigger = screen.getByText("Open");
  fireEvent.click(trigger);
  const dialog = screen.getByRole("dialog");
  finish(dialog);
  fireEvent.click(screen.getByText("Dismiss"));
  expect(dialog.isConnected).toBe(true);
  finish(dialog);
  await waitFor(() => expect(dialog.isConnected).toBe(false));
  await waitFor(() => expect(trigger).toHaveFocus());
  expect(gsap.getTweensOf(dialog)).toHaveLength(0);
});
test("controlled close and reopen cancel the old exit without stale unmounts", async () => {
  const { rerender, unmount } = render(<DialogPreview open />);
  const dialog = screen.getByRole("dialog");
  finish(dialog);
  rerender(<DialogPreview open={false} />);
  expect(dialog.isConnected).toBe(true);
  const exit = gsap.getTweensOf(dialog).find((tween) => tween.vars.opacity === 0)!;
  act(() => {
    (exit.parent as gsap.core.Timeline).progress(0.4);
  });
  rerender(<DialogPreview open />);
  expect(gsap.getTweensOf(dialog)).not.toContain(exit);
  finish(dialog);
  expect(screen.getByRole("dialog")).toBe(dialog);
  unmount();
  expect(gsap.getTweensOf(dialog)).toHaveLength(0);
});
test("popover dismissal uses the same bounded lifecycle", async () => {
  render(
    <MotionPopover>
      <PopoverTrigger>Help</PopoverTrigger>
      <PopoverPanel>Hint</PopoverPanel>
    </MotionPopover>,
  );
  fireEvent.click(screen.getByText("Help"));
  const popup = screen.getByText("Hint");
  finish(popup);
  fireEvent.keyDown(popup, { key: "Escape" });
  expect(popup.isConnected).toBe(true);
  finish(popup);
  await waitFor(() => expect(popup.isConnected).toBe(false));
});
test("reduced motion closes immediately", async () => {
  preference.reduced = true;
  render(<DialogPreview />);
  fireEvent.click(screen.getByText("Open"));
  fireEvent.click(screen.getByText("Dismiss"));
  await waitFor(() => expect(screen.queryByRole("dialog")).not.toBeInTheDocument());
});

test("a nested dialog finishes its own exit without dismissing its parent", async () => {
  render(
    <MotionDialog defaultOpen>
      <ModalContent>
        <DialogTitle>Parent</DialogTitle>
        <MotionDialog defaultOpen>
          <ModalContent>
            <DialogTitle>Child</DialogTitle>
            <DialogClose>Close child</DialogClose>
          </ModalContent>
        </MotionDialog>
      </ModalContent>
    </MotionDialog>,
  );
  const dialogs = [...document.querySelectorAll<HTMLElement>('[role="dialog"]')];
  const parent = dialogs.find((node) => node.textContent?.includes("Parent"))!;
  const child = dialogs.find((node) => node.textContent?.includes("Child"))!;
  finish(parent);
  finish(child);
  fireEvent.click(screen.getByText("Close child"));
  finish(child);
  await waitFor(() => expect(child.isConnected).toBe(false));
  expect(parent.isConnected).toBe(true);
  expect(parent).toHaveAttribute("data-open");
});
