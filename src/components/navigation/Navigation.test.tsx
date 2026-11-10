import { BookOpen } from "lucide-react";

import { render, screen } from "@testing-library/react";

import { Navigation } from "./Navigation";

test("keeps unavailable destinations labelled without activating them", () => {
  render(
    <Navigation
      label="Destinations"
      groups={[
        {
          label: "Progress",
          items: [
            {
              id: "journal",
              label: "Journal",
              icon: BookOpen,
              disabled: true,
              unavailableLabel: "coming soon",
            },
          ],
        },
      ]}
    />,
  );
  expect(screen.getByRole("navigation", { name: "Destinations" })).toBeVisible();
  expect(screen.getByRole("button", { name: "Journal (coming soon)" })).toBeDisabled();
});
