import { render, screen } from "@testing-library/react";

import { Table } from "./Table";

vi.mock("./TableCards", () => ({
  TableCards: () => <div data-testid="table-cards-mock" />,
}));

describe("Table", () => {
  it("renders the background, the positioned container, and TableCards", () => {
    const { container } = render(
      <Table>
        <div />
      </Table>,
    );
    const root = container.firstElementChild as HTMLDivElement;

    expect(root).toBeInTheDocument();

    const tableCards = screen.getByTestId("table-cards-mock");
    const positionedContainer = tableCards.parentElement as HTMLDivElement;

    expect(positionedContainer).toBeInTheDocument();
  });

  it("renders children after the positioned container", () => {
    const child = <div data-testid="table-child">child</div>;
    const { container } = render(<Table>{child}</Table>);

    const tableCards = screen.getByTestId("table-cards-mock");
    const positionedContainer = tableCards.parentElement as HTMLDivElement;
    const childNode = screen.getByTestId("table-child");

    expect(positionedContainer.nextSibling).toBe(childNode);
    expect(container).toContainElement(childNode);
  });
});
