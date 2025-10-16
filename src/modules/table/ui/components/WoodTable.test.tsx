import { render } from "@testing-library/react";

import { WoodTable } from "./WoodTable";

describe("WoodTable", () => {
  it("should render correctly", () => {
    const { getByTestId } = render(<WoodTable />);

    expect(getByTestId("WoodTable")).toBeInTheDocument();
  });
});
