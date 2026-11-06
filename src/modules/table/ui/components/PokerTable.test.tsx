import { render } from "@testing-library/react";

import { PokerTable } from "./PokerTable";

describe("PokerTable", () => {
  it("should render correctly", () => {
    const { getByTestId } = render(<PokerTable />);

    expect(getByTestId("PokerTable")).toBeInTheDocument();
  });
});
