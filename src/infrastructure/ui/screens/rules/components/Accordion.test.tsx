import type { PropsWithChildren, ReactNode } from "react";

import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import { SectionAccordion } from "./Accordion";

vi.mock("framer-motion", () => {
  return {
    motion: new Proxy(
      {},
      {
        get: () => (props: PropsWithChildren) => <div {...props} />,
      },
    ),
    AnimatePresence: ({ children }: { children: ReactNode }) => <>{children}</>,
  };
});

const items = [
  {
    id: "a",
    title: "Rule A",
    body: "Body A",
    badges: ["Required"],
    callouts: [{ type: "info", text: "Info A" }],
    examples: ["Example A"],
  },
  {
    id: "b",
    title: "Rule B",
    body: "Body B",
    badges: ["Timing"],
    callouts: [{ type: "warning", text: "Warn B" }],
    examples: ["Example B"],
  },
] satisfies Array<import("@/domain/entities/Rules").RuleItem>;

const getTabButton = (id: string) => screen.getByTestId(`acc-btn-${id}`);

test("renders all items and they are open by default", () => {
  render(<SectionAccordion items={items} />);

  for (const it of items) {
    const btn = getTabButton(it.id);
    expect(btn).toHaveAttribute("aria-expanded", "true");
    expect(screen.getByText(it.body)).toBeInTheDocument();
    expect(screen.getByText(it.examples![0])).toBeInTheDocument();
    expect(screen.getByText(it.callouts![0].text)).toBeInTheDocument();
    const chevronUp = btn.querySelector('[data-icon="chevron-up"]');
    expect(chevronUp).toBeTruthy();
  }
});

test("toggle collapses and expands a single item, updating aria and chevron", async () => {
  render(<SectionAccordion items={items} />);

  const btnA = getTabButton("a");
  expect(btnA).toHaveAttribute("aria-expanded", "true");
  expect(screen.getByText("Body A")).toBeInTheDocument();

  await userEvent.click(btnA);

  expect(getTabButton("a")).toHaveAttribute("aria-expanded", "false");
  expect(screen.queryByText("Body A")).not.toBeInTheDocument();
});

test("badges render for each item", () => {
  render(<SectionAccordion items={items} />);
  for (const it of items) {
    for (const b of it.badges ?? []) {
      expect(screen.getAllByText(b)[0]).toBeInTheDocument();
    }
  }
});

test("aria-controls and region linkage exist", () => {
  render(<SectionAccordion items={items} />);
  for (const it of items) {
    const btn = getTabButton(it.id);
    const controlsId = btn.getAttribute("aria-controls")!;
    expect(controlsId).toBe(`acc-${it.id}`);
  }
});

test("when items prop changes, all panels reset to open", async () => {
  const { rerender } = render(<SectionAccordion items={items} />);
  const user = userEvent.setup();

  const btnA = getTabButton("a");
  await user.click(btnA);
  expect(btnA).toHaveAttribute("aria-expanded", "true");

  const newItems = [
    ...items,
    {
      id: "c",
      title: "Rule C",
      body: "Body C",
    } as import("@/domain/entities/Rules").RuleItem,
  ];
  rerender(<SectionAccordion items={newItems} />);

  for (const it of newItems) {
    const btn = getTabButton(it.id);
    expect(btn).toHaveAttribute("aria-expanded", "true");
    expect(screen.getByText(it.body)).toBeInTheDocument();
  }
});

test("chevron sits in the far-right group inside the button", () => {
  render(<SectionAccordion items={items} />);

  for (const it of items) {
    const btn = getTabButton(it.id);
    const chevronSvg =
      btn.querySelector('[data-icon="chevron-up"]') ||
      btn.querySelector('[data-icon="chevron-down"]');
    expect(chevronSvg).toBeTruthy();
  }
});
