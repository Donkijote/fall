import { Dialog, DialogDescription, DialogTitle } from "@/components/ui/dialog";

import { render, screen } from "@testing-library/react";

import { GameDialogContent } from "./GameDialogContent";

test("keeps core dialog semantics without introducing a local theme", () => {
  render(
    <Dialog open>
      <GameDialogContent>
        <DialogTitle>Settings</DialogTitle>
        <DialogDescription>Preferences</DialogDescription>
      </GameDialogContent>
    </Dialog>,
  );
  const dialog = screen.getByRole("dialog", { name: "Settings" });
  expect(dialog).toHaveAccessibleDescription("Preferences");
  expect(dialog).not.toHaveClass("game-theme");
});
