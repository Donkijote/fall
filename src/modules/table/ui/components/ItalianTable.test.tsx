import { render } from "@testing-library/react";

import { ItalianTable } from "./ItalianTable";

describe("ItalianTable", () => {
  it("should render correctly", () => {
    const { getByTestId } = render(<ItalianTable />);

    expect(getByTestId("ItalianTable")).toBeInTheDocument();
  });
});