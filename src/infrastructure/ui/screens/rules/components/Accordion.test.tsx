import type { RuleItem } from "@/domain/entities/Rules";

import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import { SectionAccordion } from "./Accordion";

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
] satisfies RuleItem[];

test("renders all rules expanded with badges, examples, and callouts", () => {
  render(<SectionAccordion items={items} />);
  for (const item of items) {
    expect(screen.getByRole("button", { name: new RegExp(item.title) })).toHaveAttribute(
      "aria-expanded",
      "true",
    );
    expect(screen.getByText(item.body)).toBeVisible();
    expect(screen.getByText(item.examples[0])).toBeVisible();
    expect(screen.getByText(item.callouts[0].text)).toBeVisible();
    expect(screen.getByText(item.badges[0])).toBeVisible();
  }
});

test("a rule can collapse and expand without closing other rules", async () => {
  const user = userEvent.setup();
  render(<SectionAccordion items={items} />);
  const trigger = screen.getByRole("button", { name: /Rule A/ });
  await user.click(trigger);
  expect(trigger).toHaveAttribute("aria-expanded", "false");
  await waitFor(() => expect(screen.queryByText("Body A")).not.toBeInTheDocument());
  expect(screen.getByText("Body B")).toBeVisible();
  await user.click(trigger);
  expect(trigger).toHaveAttribute("aria-expanded", "true");
  expect(screen.getByText("Body A")).toBeVisible();
});

test("triggers link to their labelled panels", () => {
  render(<SectionAccordion items={items} />);
  for (const item of items) {
    const trigger = screen.getByRole("button", { name: new RegExp(item.title) });
    const panel = document.getElementById(trigger.getAttribute("aria-controls")!);
    expect(panel).toHaveAttribute("aria-labelledby", trigger.id);
    expect(panel).toHaveTextContent(item.body);
  }
});

test("new items reset all rules to expanded", async () => {
  const user = userEvent.setup();
  const { rerender } = render(<SectionAccordion items={items} />);
  await user.click(screen.getByRole("button", { name: /Rule A/ }));
  expect(screen.getByRole("button", { name: /Rule A/ })).toHaveAttribute("aria-expanded", "false");
  const nextItems = [...items, { id: "c", title: "Rule C", body: "Body C" }];
  rerender(<SectionAccordion items={nextItems} />);
  for (const item of nextItems) {
    expect(screen.getByRole("button", { name: new RegExp(item.title) })).toHaveAttribute(
      "aria-expanded",
      "true",
    );
    expect(screen.getByText(item.body)).toBeVisible();
  }
});

test("keyboard activation toggles the focused rule", async () => {
  const user = userEvent.setup();
  render(<SectionAccordion items={items} />);
  screen.getByRole("button", { name: /Rule A/ }).focus();
  await user.keyboard("{Enter}");
  expect(screen.getByRole("button", { name: /Rule A/ })).toHaveAttribute("aria-expanded", "false");
  expect(screen.getByRole("button", { name: /Rule B/ })).toHaveAttribute("aria-expanded", "true");
});
