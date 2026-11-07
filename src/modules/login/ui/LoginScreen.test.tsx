import type { ReactNode } from "react";
import { MemoryRouter, Route, Routes } from "react-router";

import { HOME_PATH, LOGIN_PATH } from "@/routes/Routes";

import { fireEvent, render as renderComponent, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import loginStyles from "./login.css?raw";
import { LoginScreen } from "./LoginScreen";

function render(element: ReactNode) {
  return renderComponent(
    <MemoryRouter initialEntries={[LOGIN_PATH]}>
      <Routes>
        <Route path={LOGIN_PATH} element={element} />
        <Route path={HOME_PATH} element={<h1>Main screen</h1>} />
      </Routes>
    </MemoryRouter>,
  );
}

describe("LoginScreen", () => {
  it("keeps responsive and accessibility variants in Tailwind rather than custom media queries", () => {
    const { container } = render(<LoginScreen />);
    expect(loginStyles).not.toMatch(/@media|@container/);
    expect(screen.getByRole("main")).toHaveClass(
      "motion-reduce:**:transition-none",
      "overflow-y-auto",
    );
    expect(container.querySelector(".login-intro")).not.toHaveClass("hidden");
    expect(container.querySelector(".login-card")).not.toHaveClass(
      "max-lg:landscape:overflow-y-auto",
    );
    expect(container.querySelector(".login-alternatives")).toHaveClass("max-xl:landscape:flex-col");
    expect(screen.getByRole("form", { name: "Login preview" })).toHaveClass("grid-cols-1");
    expect(screen.getByText("A new story.")).toHaveClass(
      "forced-colors:bg-none",
      "forced-colors:text-primary",
    );
  });

  it("renders the layout with accessible, empty email and password fields", () => {
    render(<LoginScreen />);

    expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent("Every hand.");
    expect(screen.getByRole("heading", { level: 2, name: "The Fall" })).toBeVisible();
    expect(screen.getByLabelText("Email address")).toHaveAttribute("type", "email");
    expect(screen.getByLabelText("Email address")).toHaveValue("");
    expect(screen.getByLabelText("Password")).toHaveAttribute("type", "password");
    expect(screen.getByLabelText("Password")).toHaveValue("");
    expect(
      screen.queryByText("Design preview only. Sign-in is not available yet."),
    ).not.toBeInTheDocument();
    expect(screen.getByRole("form", { name: "Login preview" })).not.toHaveAttribute(
      "aria-describedby",
    );
  });

  it("separates credentials from social and account options for the landscape columns", () => {
    const { container } = render(<LoginScreen />);
    const form = screen.getByRole("form", { name: "Login preview" });
    const alternatives = container.querySelector(".login-alternatives");

    expect(form).toContainElement(screen.getByLabelText("Email address"));
    expect(form).toContainElement(screen.getByLabelText("Password"));
    expect(form).toContainElement(screen.getByRole("button", { name: "Take your seat" }));
    for (const name of [
      "Continue with Google",
      "Continue with Apple",
      "Continue with Microsoft",
      "Continue with Facebook",
      "Create account",
    ]) {
      const button = screen.getByRole("button", { name });
      expect(alternatives).toContainElement(button);
      expect(form).not.toContainElement(button);
    }
  });

  it("allows typing and keyboard focus without enabling authentication actions", async () => {
    const user = userEvent.setup();
    const fetchSpy = vi.spyOn(globalThis, "fetch");
    const storageSpy = vi.spyOn(Storage.prototype, "setItem");
    const initialLocation = window.location.href;
    render(<LoginScreen />);

    await user.tab();
    expect(screen.getByLabelText("Email address")).toHaveFocus();
    await user.type(screen.getByLabelText("Email address"), "player@example.com");
    await user.type(screen.getByLabelText("Password"), "preview-password");
    await user.keyboard("{Enter}");

    for (const name of [
      "Forgot password?",
      "Continue with Google",
      "Continue with Apple",
      "Continue with Microsoft",
      "Continue with Facebook",
      "Create account",
    ]) {
      const button = screen.getByRole("button", { name });
      expect(button).toHaveAttribute("type", "button");
      await user.click(button);
    }

    expect(screen.getByLabelText("Email address")).toHaveValue("player@example.com");
    expect(screen.getByLabelText("Password")).toHaveValue("preview-password");
    expect(screen.getByRole("button", { name: "Continue with Google" })).toBeVisible();
    expect(screen.getByRole("button", { name: "Continue with Apple" })).toBeVisible();
    expect(window.location.href).toBe(initialLocation);
    expect(fetchSpy).not.toHaveBeenCalled();
    expect(storageSpy).not.toHaveBeenCalled();
    fetchSpy.mockRestore();
    storageSpy.mockRestore();
  });

  it("prevents form submission even when submitted directly with invalid input", () => {
    render(<LoginScreen />);
    const form = screen.getByRole("form", { name: "Login preview" });
    fireEvent.change(screen.getByLabelText("Email address"), { target: { value: "not-an-email" } });

    expect(form).toHaveAttribute("novalidate");
    expect(fireEvent.submit(form)).toBe(false);
    expect(screen.queryByRole("alert")).not.toBeInTheDocument();
  });

  it("uses decorative brand icons with accessible provider button names", () => {
    render(<LoginScreen />);

    for (const provider of ["Google", "Apple", "Microsoft", "Facebook"]) {
      const button = screen.getByRole("button", { name: `Continue with ${provider}` });
      const icon = button.querySelector("svg");

      expect(icon).toHaveAttribute("aria-hidden", "true");
      expect(icon).toHaveAttribute("focusable", "false");
      expect(icon?.querySelector("path")).toHaveAttribute("d");
      expect(button).toHaveAttribute("type", "button");
      expect(button).toHaveClass("rounded-full");
      expect(button).toHaveAttribute("title", `Continue with ${provider}`);
    }
  });

  it("keeps the title emblem visible alongside the heading in compact landscape", () => {
    const { container } = render(<LoginScreen />);
    const header = container.querySelector("[data-slot='card-header']");
    const emblem = header?.querySelector("span");

    expect(header).toHaveClass("max-xl:landscape:flex");
    expect(emblem).not.toHaveClass("max-xl:landscape:hidden");
    expect(emblem?.querySelector("svg")).toHaveAttribute("aria-hidden", "true");
    expect(screen.getByRole("group", { name: "Social sign-in preview" })).toHaveClass(
      "max-xl:landscape:grid-cols-[repeat(2,auto)]",
    );
  });

  it("uses adventure copy and four rounded placeholder symbols without card artwork", () => {
    const { container } = render(<LoginScreen />);

    expect(screen.getByText(/beyond the mist, a new challenge awaits/i)).toBeVisible();
    expect(screen.queryByText(/venezuelan/i)).not.toBeInTheDocument();
    const symbols = container.querySelectorAll(".login-suit-symbol");
    expect(symbols).toHaveLength(4);
    for (const symbol of symbols) {
      expect(symbol).toHaveClass("rounded-full");
      expect(symbol.querySelector("svg")).toBeInTheDocument();
      expect(symbol.parentElement).toHaveAttribute("aria-hidden", "true");
    }
    expect(container.querySelector(".login-intro img")).not.toBeInTheDocument();
  });

  it("applies the title gradient and inset card treatment without the old footer tagline", () => {
    const { container } = render(<LoginScreen />);

    expect(screen.getByText("A new story.")).toHaveClass("login-title-gradient");
    expect(container.querySelector("[data-slot='card']")).toHaveClass("login-card");
    expect(container.querySelector("[data-slot='card']")).not.toHaveClass("border-t-2");
    expect(screen.queryByText(/a familiar game/i)).not.toBeInTheDocument();
    expect(screen.queryByText(/a different kind of fire/i)).not.toBeInTheDocument();
  });

  it("keeps the static atmosphere outside the accessibility tree without requiring WebGL", () => {
    const { container } = render(<LoginScreen />);
    const atmosphere = container.querySelector(".login-atmosphere");

    expect(atmosphere).toHaveAttribute("aria-hidden", "true");
    expect(atmosphere?.querySelector("img")).toHaveAttribute("alt", "");
    expect(atmosphere?.querySelector("canvas")).not.toBeInTheDocument();
    expect(atmosphere?.querySelectorAll("button, a, input, [tabindex]")).toHaveLength(0);
    expect(screen.queryByRole("img")).not.toBeInTheDocument();
  });

  it.each(["", "not-an-email"])(
    "opens the main screen without authenticating with email %j",
    async (email) => {
      const user = userEvent.setup();
      const fetchSpy = vi.spyOn(globalThis, "fetch");
      const storageSpy = vi.spyOn(Storage.prototype, "setItem");
      render(<LoginScreen />);
      if (email) {
        await user.type(screen.getByLabelText("Email address"), email);
      }

      await user.click(screen.getByRole("button", { name: "Take your seat" }));

      expect(screen.getByRole("heading", { name: "Main screen" })).toBeVisible();
      expect(screen.queryByRole("form", { name: "Login preview" })).not.toBeInTheDocument();
      expect(fetchSpy).not.toHaveBeenCalled();
      expect(storageSpy).not.toHaveBeenCalled();
      fetchSpy.mockRestore();
      storageSpy.mockRestore();
    },
  );

  it("supports keyboard activation of the main navigation button", async () => {
    const user = userEvent.setup();
    render(<LoginScreen />);
    screen.getByRole("button", { name: "Take your seat" }).focus();

    await user.keyboard("{Enter}");

    expect(screen.getByRole("heading", { name: "Main screen" })).toBeVisible();
  });

  it("keeps a local static background available before the enhanced scene loads", () => {
    const { container } = render(<LoginScreen />);
    const landscape = container.querySelector(".login-landscape");
    expect(landscape).toHaveAttribute("src", expect.stringContaining("mountain-castle.png"));
    expect(landscape).toHaveAttribute("fetchpriority", "high");
    expect(landscape).toHaveAttribute("alt", "");
  });
});
