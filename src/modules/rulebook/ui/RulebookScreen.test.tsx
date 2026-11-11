import { MemoryRouter, Route, Routes, useLocation } from "react-router";

import { RULES } from "@/domain/constants/rules";
import { SingsSheetScreen } from "@/infrastructure/ui/screens/SingsSheet";

import { fireEvent, render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import { RulebookScreen } from "./RulebookScreen";

vi.mock("@/infrastructure/ui/hooks/useGamePreferences", () => ({ useReducedMotion: () => true }));

function Location() {
  const location = useLocation();
  return (
    <span aria-label="Current route">
      {location.pathname}
      {location.search}
    </span>
  );
}
function renderGuide(entry = "/rules") {
  return render(
    <MemoryRouter initialEntries={[entry]}>
      <Location />
      <Routes>
        <Route path="/rules" element={<RulebookScreen />} />
        <Route path="/sings" element={<SingsSheetScreen />} />
        <Route path="/" element={<h1>Card Hall</h1>} />
      </Routes>
    </MemoryRouter>,
  );
}

test("opens the approved quick start with no subtitle or onboarding dialog", () => {
  renderGuide();
  expect(screen.getByRole("heading", { name: "How to play", level: 1 })).toBeVisible();
  expect(screen.queryByText(/the table guide/i)).not.toBeInTheDocument();
  expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
  expect(screen.getByRole("figure")).toHaveTextContent("The 7 and 11 stay.");
  const captured = screen.getByRole("list", { name: "Your capture" });
  expect(
    within(captured)
      .getAllByRole("img")
      .map((card) => card.getAttribute("aria-label")),
  ).toEqual(["4 of cups", "4 of coins"]);
});

test("chapter links and Previous/Next navigate, focus the heading and retain source rules", async () => {
  const user = userEvent.setup();
  renderGuide();
  await user.click(screen.getByRole("link", { name: "Next: Setup" }));
  expect(screen.getByLabelText("Current route")).toHaveTextContent("?chapter=setup");
  expect(screen.getByRole("heading", { name: "Take your seat", level: 2 })).toHaveFocus();
  const items = RULES.sections.find((section) => section.id === "setup")!.items;
  for (const item of items) expect(screen.getByText(item.body.replace(/\s+/g, " "))).toBeVisible();
  await user.click(screen.getByRole("link", { name: "Previous" }));
  expect(screen.getByRole("heading", { name: "Your first capture" })).toBeVisible();
});

test("search indexes combination values and navigates to the matching heading without stealing typing focus", async () => {
  const user = userEvent.setup();
  renderGuide();
  const input = screen.getByRole("searchbox", { name: "Find a rule" });
  await user.type(input, "bIG hoUse");
  expect(input).toHaveFocus();
  expect(screen.getByRole("status")).toHaveTextContent("results for");
  const result = screen.getByRole("link", { name: /Sings Big House/ });
  expect([...result.querySelectorAll("mark")].map((mark) => mark.textContent)).toEqual([
    "Big",
    "House",
  ]);
  await user.click(result);
  expect(screen.getByLabelText("Current route")).toHaveTextContent("chapter=sings&rule=sing-0");
  expect(screen.getByRole("heading", { name: "Big House 12 points" })).toHaveFocus();
  expect(screen.getByRole("searchbox")).toHaveValue("");
  await user.type(screen.getByRole("searchbox"), "unfindablexyz");
  expect(screen.getByRole("status")).toHaveTextContent("No rules found");
});

test("deep links preserve scoring, glossary and variations, with safe fallback for unknown chapters", () => {
  const view = renderGuide("/rules?chapter=scoring&rule=fall-points");
  expect(screen.getByRole("heading", { name: "Fall points by rank" })).toHaveFocus();
  expect(screen.getByRole("table", { name: "Captured-card quotas" })).toHaveTextContent(
    "12 per player; 13 for the dealer",
  );
  view.unmount();
  const glossary = renderGuide("/rules?chapter=variations");
  for (const term of RULES.glossary) expect(screen.getByText(term.def)).toBeVisible();
  expect(
    screen.getByText(RULES.sections.find((s) => s.id === "variations")!.items[0].body),
  ).toBeVisible();
  glossary.unmount();
  renderGuide("/rules?chapter=unknown&rule=does-not-exist");
  expect(screen.getByRole("heading", { name: "Your first capture" })).toBeVisible();
});

test("mobile chapter disclosure closes after choosing a chapter", async () => {
  const user = userEvent.setup();
  renderGuide();
  const summary = screen.getByText("Chapters: Quick start");
  await user.click(summary);
  const disclosure = summary.closest("details")!;
  expect(disclosure.open).toBe(true);
  await user.click(within(disclosure).getByRole("link", { name: /04.*Captures/ }));
  expect(disclosure.open).toBe(false);
  expect(screen.getByRole("heading", { name: "Read the table", level: 2 })).toBeVisible();
});

test("Sings round trip restores the chapter and reading position, with Hall fallback for direct guide visits", async () => {
  const user = userEvent.setup();
  renderGuide("/rules?chapter=sings");
  const main = screen.getByRole("main");
  fireEvent.scroll(main, { target: { scrollTop: 250 } });
  await user.click(
    within(screen.getByRole("article")).getByRole("link", { name: "Sings reference" }),
  );
  await user.click(screen.getByRole("link", { name: "Back to How to play" }));
  expect(screen.getByRole("heading", { name: "Know your combinations" })).toBeVisible();
  expect(screen.getByRole("main").scrollTop).toBe(250);
  await user.click(screen.getAllByRole("link", { name: "Back to Hall" })[0]);
  expect(screen.getByRole("heading", { name: "Card Hall" })).toBeVisible();
});

test("capture illustrations sit within the rules they explain", () => {
  renderGuide("/rules?chapter=captures");
  for (const [name, caption] of [
    ["Same-rank capture", /7 of clubs and 11 of swords stay/],
    ["Cascade", /there is no 6/i],
    ["Fall", /earn 3 points/],
    ["Clean Table", /clearing the table earns 4 points/],
  ] as const) {
    expect(
      within(screen.getByRole("region", { name })).getByRole("figure", {
        name: caption,
      }),
    ).toBeVisible();
  }
});

test("the Sings chapter renders example hands as readable, non-interactive cards", () => {
  renderGuide("/rules?chapter=sings");
  const hand = within(screen.getByRole("list", { name: "Big House example hand" }));
  expect(hand.getByRole("img", { name: "12 of coins" })).toBeVisible();
  expect(hand.getByRole("img", { name: "1 of swords" })).toBeVisible();
  expect(hand.queryByRole("button")).not.toBeInTheDocument();
});

test("scoring examples explain the quota and winning threshold alongside their rules", () => {
  renderGuide("/rules?chapter=scoring");
  expect(
    within(screen.getByRole("region", { name: "Count your captured cards" })).getByRole("figure", {
      name: /23 captured cards.*earns 3 points/,
    }),
  ).toBeVisible();
  expect(
    within(screen.getByRole("region", { name: "Win the match" })).getByRole("figure", {
      name: /21 points.*bring you to 24/,
    }),
  ).toBeVisible();
});
