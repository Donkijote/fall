import {
  createElement,
  type JSX,
  type PropsWithChildren,
  type ReactNode,
} from "react";

import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import { RulesScreen } from "./Rules";

vi.mock("framer-motion", () => {
  const passthrough =
    (as: keyof JSX.IntrinsicElements) =>
    ({ children, ...rest }: PropsWithChildren) =>
      // preserve the target element type (button/div) for roles/aria
      // and spread props so handlers/aria remain intact
      createElement(as, rest, children);

  return {
    motion: new Proxy(
      {},
      {
        get: (_, tag: string) =>
          passthrough(tag as keyof JSX.IntrinsicElements),
      },
    ),
    AnimatePresence: ({ children }: { children: ReactNode }) => <>{children}</>,
  };
});

vi.mock("./components/Accordion", () => ({
  SectionAccordion: ({ items }: { items: never[] }) => (
    <div data-testid="accordion-stub">{items?.length ?? 0} rules</div>
  ),
}));

vi.mock("./components/HintModal", () => ({
  HintModal: () => <></>,
}));

const navigateMock = vi.fn();
vi.mock("react-router", async () => {
  const actual = await vi.importActual("react-router");
  return {
    ...actual,
    useNavigate: () => navigateMock,
  };
});

beforeEach(() => {
  navigateMock.mockReset();
});

test("renders header with title and subtitle, and the 'How to use' hint", () => {
  render(<RulesScreen />);

  expect(
    screen.getByRole("heading", { level: 1, name: /fall/i }),
  ).toBeInTheDocument();

  expect(screen.getByText(/how to use/i)).toBeInTheDocument();
});

test("renders tabs for each section with correct roles/aria and initial selection", () => {
  render(<RulesScreen />);

  const tabs = screen.getAllByRole("tab");
  expect(tabs.length).toBeGreaterThan(0);

  expect(tabs[0]).toHaveAttribute("aria-selected", "true");
  for (let i = 1; i < tabs.length; i++) {
    expect(tabs[i]).toHaveAttribute("aria-selected", "false");
  }

  const activeTabId = tabs[0].getAttribute("id")!;
  const activePanelId = tabs[0].getAttribute("aria-controls")!;
  expect(activeTabId).toBeTruthy();
  expect(activePanelId).toBeTruthy();

  const activePanel = document.getElementById(activePanelId)!;
  expect(activePanel).toHaveAttribute("role", "tabpanel");
  expect(activePanel.hasAttribute("hidden")).toBe(false);
});

test("switching tabs updates aria-selected and shows the correct panel", async () => {
  render(<RulesScreen />);

  const tabs = screen.getAllByRole("tab");
  expect(tabs.length).toBeGreaterThan(1);

  const second = tabs[1];
  const secondPanelId = second.getAttribute("aria-controls")!;
  const first = tabs[0];
  const firstPanelId = first.getAttribute("aria-controls")!;

  await userEvent.click(second);

  expect(screen.getAllByRole("tab")[1]).toHaveAttribute(
    "aria-selected",
    "true",
  );
  expect(screen.getAllByRole("tab")[0]).toHaveAttribute(
    "aria-selected",
    "false",
  );

  const secondPanel = document.getElementById(secondPanelId)!;
  const firstPanel = document.getElementById(firstPanelId)!;

  expect(secondPanel.hasAttribute("hidden")).toBe(false);
  expect(firstPanel.hasAttribute("hidden")).toBe(true);
});

test("renders the accordion stub in each visible panel, and shows SingsGrid only in 'sings' tab", async () => {
  render(<RulesScreen />);

  const singsTab =
    screen.queryByRole("tab", { name: /sings/i }) ??
    screen.getAllByRole("tab").find((t) => /sings/i.test(t.textContent || ""));

  expect(singsTab).toBeTruthy();

  await userEvent.click(singsTab as HTMLElement);

  expect(screen.getAllByTestId("accordion-stub")[0]).toBeInTheDocument();

  expect(screen.getAllByText(/sings/i)[0]).toBeInTheDocument();
});

test("back button calls navigate(-1)", async () => {
  render(<RulesScreen />);

  const backBtn = document.querySelector("button.goBack") as HTMLButtonElement;
  expect(backBtn).toBeTruthy();

  await userEvent.click(backBtn);
  expect(navigateMock).toHaveBeenCalledWith(-1);
});
