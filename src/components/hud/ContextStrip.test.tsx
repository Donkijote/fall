import { BookOpen } from "lucide-react";

import { render, screen } from "@testing-library/react";

import { ContextStrip } from "./ContextStrip";

test("renders supplied context without coupling to feature state", () => {
  render(<ContextStrip icon={BookOpen} label="Context" detail="Supplied detail" />);
  expect(screen.getByRole("group", { name: "Context" })).toHaveTextContent("Supplied detail");
});
