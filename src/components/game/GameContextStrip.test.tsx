import { BookOpen } from "lucide-react";

import { render, screen } from "@testing-library/react";

import { GameContextStrip } from "./GameContextStrip";

test("renders supplied context without coupling to feature state", () => {
  render(<GameContextStrip icon={BookOpen} label="Context" detail="Supplied detail" />);
  expect(screen.getByRole("group", { name: "Context" })).toHaveTextContent("Supplied detail");
});
