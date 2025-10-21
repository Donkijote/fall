import App from "@/App";

import { render, screen } from "@testing-library/react";

describe("App", () => {
  it("should render correctly", () => {
    render(<App />);

    expect(screen.getByTestId("App")).toBeInTheDocument();
  });
});
