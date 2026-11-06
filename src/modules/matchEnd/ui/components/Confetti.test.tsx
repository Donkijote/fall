import { act, cleanup, render, screen } from "@testing-library/react";

import { ConfettiController } from "./Confetti";

afterEach(() => {
  cleanup();
  vi.useRealTimers();
});

describe("ConfettiController", () => {
  it("renders nothing when inactive and sets no interval", () => {
    vi.useFakeTimers();
    const spy = vi.spyOn(global, "setInterval");

    const { container } = render(<ConfettiController active={false} />);
    expect(container.firstChild).toBeNull();
    expect(spy).not.toHaveBeenCalled();
  });

  it("starts an interval when active and alternates side each tick", async () => {
    vi.useFakeTimers();
    const spy = vi.spyOn(global, "setInterval");

    render(<ConfettiController active={true} />);

    // interval is set to 1700 ms
    expect(spy).toHaveBeenCalledTimes(2);
    expect(Math.round(spy.mock.calls[0][1] ?? 0)).toBe(17);

    // Initial render: left / seed 0
    let burst = screen.getAllByTestId("burst-left-0")[0];
    expect(burst).toHaveAttribute("data-side", "left");
    expect(burst).toHaveAttribute("data-seed", "0");

    // After 1700ms: right / seed 1
    await act(async () => {
      vi.advanceTimersByTime(1700);
    });
    burst = screen.getAllByTestId("burst-right-1")[0];
    expect(burst).toHaveAttribute("data-side", "right");
    expect(burst).toHaveAttribute("data-seed", "1");
  });

  it("cleans up the interval when deactivated", () => {
    vi.useFakeTimers();
    const spyClear = vi.spyOn(global, "clearInterval");

    const { rerender } = render(<ConfettiController active={true} />);
    rerender(<ConfettiController active={false} />);

    expect(spyClear).toHaveBeenCalledTimes(1);

    // advancing timers should not change anything (no state updates after cleanup)
    vi.advanceTimersByTime(3400);
    // still no element because inactive
    expect(screen.queryByTestId("burst")).toBeNull();
  });

  it("cleans up the interval on unmount", () => {
    vi.useFakeTimers();
    const spyClear = vi.spyOn(global, "clearInterval");

    const { unmount } = render(<ConfettiController active={true} />);
    unmount();

    expect(spyClear).toHaveBeenCalledTimes(1);
  });
});
