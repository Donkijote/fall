import { Coins, Diamond, Zap } from "lucide-react";

import { render, screen } from "@testing-library/react";

import { HudResource } from "./HudResource";

test.each([
  { label: "Energy", icon: Zap },
  { label: "Coins", icon: Coins },
  { label: "Diamonds", icon: Diamond },
])(
  "$label uses its icon without a visible text label but keeps its accessible name",
  ({ label, icon }) => {
    render(<HudResource label={label} icon={icon} value={36} />);

    expect(screen.getByRole("group", { name: label })).toHaveTextContent("36");
    expect(screen.queryByText(label)).not.toBeInTheDocument();
  },
);

test("unknown energy has an honest placeholder rather than an invented or loading balance", () => {
  const { container } = render(<HudResource label="Energy" icon={Zap} bounded />);

  expect(screen.getByRole("group", { name: "Energy" })).toHaveTextContent("— / —");
  expect(screen.getByText("Not available yet")).toBeInTheDocument();
  expect(screen.queryByRole("meter")).not.toBeInTheDocument();
  expect(container.querySelector("[aria-live]")).not.toBeInTheDocument();
  expect(screen.queryByRole("button")).not.toBeInTheDocument();
});

test("populated energy exposes its amount and capacity without implementing resource behavior", () => {
  render(<HudResource label="Energy" icon={Zap} value={36} maximum={120} bounded />);

  const meter = screen.getByRole("meter", { name: "Energy reserve" });
  expect(meter).toHaveAttribute("aria-valuemin", "0");
  expect(meter).toHaveAttribute("aria-valuemax", "120");
  expect(meter).toHaveAttribute("aria-valuenow", "36");
  expect(meter.firstElementChild).toHaveStyle({ width: "30%" });
  expect(screen.getByText("36 of 120")).toBeInTheDocument();
});

test("zero is a valid balance, not an unavailable value", () => {
  render(<HudResource label="Energy" icon={Zap} value={0} maximum={120} bounded />);

  expect(screen.getByRole("meter")).toHaveAttribute("aria-valuenow", "0");
  expect(screen.getByText("0 of 120")).toBeInTheDocument();
});

test.each([
  { value: -1, maximum: 120 },
  { value: 121, maximum: 120 },
  { value: Number.NaN, maximum: 120 },
  { value: Number.POSITIVE_INFINITY, maximum: 120 },
  { value: 10, maximum: 0 },
  { value: 10, maximum: -1 },
  { value: 10, maximum: Number.POSITIVE_INFINITY },
  { value: 10, maximum: undefined },
])("invalid energy input %j is rendered as unavailable", (props) => {
  render(<HudResource label="Energy" icon={Zap} bounded {...props} />);

  expect(screen.getByText("Not available yet")).toBeInTheDocument();
  expect(screen.queryByRole("meter")).not.toBeInTheDocument();
});

test("coins format a supplied balance and never add purchase or grant controls", () => {
  const storageSpy = vi.spyOn(Storage.prototype, "setItem");
  render(<HudResource label="Coins" icon={Coins} value={84500} />);

  expect(screen.getByRole("group", { name: "Coins" })).toHaveTextContent("84,500");
  expect(screen.queryByRole("button")).not.toBeInTheDocument();
  expect(storageSpy).not.toHaveBeenCalled();
  storageSpy.mockRestore();
});

test.each([undefined, -1, Number.NaN, Number.POSITIVE_INFINITY])(
  "unavailable coin value %s is not displayed as a real balance",
  (value) => {
    render(<HudResource label="Coins" icon={Coins} value={value} />);
    expect(screen.getByText("Not available yet")).toBeInTheDocument();
  },
);
