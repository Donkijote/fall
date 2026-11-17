import { useRef, useState } from "react";

import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import { BrassCheckbox } from "./BrassCheckbox";

test("preserves controlled keyboard selection and the native form value", async () => {
  const user = userEvent.setup();
  function Filter() {
    const [checked, setChecked] = useState(false);
    return (
      <form aria-label="Filters">
        <BrassCheckbox
          name="mandatory"
          aria-label="Mandatory only"
          checked={checked}
          onCheckedChange={setChecked}
        />
      </form>
    );
  }
  render(<Filter />);
  const checkbox = screen.getByRole("checkbox", { name: "Mandatory only" });
  await user.tab();
  expect(checkbox).toHaveFocus();
  await user.keyboard(" ");
  expect(checkbox).toBeChecked();
  expect(
    new FormData(screen.getByRole("form", { name: "Filters" }) as HTMLFormElement).get("mandatory"),
  ).toBe("on");
  await user.keyboard(" ");
  expect(checkbox).not.toBeChecked();
  expect(
    new FormData(screen.getByRole("form", { name: "Filters" }) as HTMLFormElement).has("mandatory"),
  ).toBe(false);
});

test("forwards the focus ref and keeps disabled selections unchanged", async () => {
  const user = userEvent.setup();
  function Example() {
    const checkbox = useRef<HTMLElement>(null);
    return (
      <>
        <button onClick={() => checkbox.current?.focus()}>Focus filter</button>
        <BrassCheckbox ref={checkbox} aria-label="Available filter" />
        <BrassCheckbox aria-label="Disabled filter" disabled defaultChecked />
      </>
    );
  }
  render(<Example />);
  await user.click(screen.getByRole("button", { name: "Focus filter" }));
  expect(screen.getByRole("checkbox", { name: "Available filter" })).toHaveFocus();
  const disabled = screen.getByRole("checkbox", { name: "Disabled filter" });
  await user.click(disabled);
  expect(disabled).toHaveAttribute("aria-disabled", "true");
  expect(disabled).toBeChecked();
});
