import type { PropsWithChildren, ReactNode } from "react";
import type { Mock } from "vitest";

import { StorageKeys } from "@/application/services/StorageService";

import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import { HintModal } from "./HintModal";

vi.mock("framer-motion", () => {
  return {
    motion: new Proxy(
      {},
      {
        get: () => (props: PropsWithChildren) => <div {...props} />,
      },
    ),
    AnimatePresence: ({ children }: { children: ReactNode }) => <>{children}</>,
  };
});

vi.mock("@/application/services/StorageService", async () => {
  const actual = await vi.importActual("@/application/services/StorageService");
  return {
    ...actual,
    StorageService: {
      get: vi.fn(),
      set: vi.fn(),
    },
  };
});

const { StorageService } = await import(
  "@/application/services/StorageService"
);

beforeEach(() => {
  vi.clearAllMocks();
});

test("opens the modal when StorageService.get returns falsy", () => {
  (StorageService.get as Mock).mockReturnValue(false);

  render(<HintModal />);

  expect(screen.getByText(/Welcome to Fall Rules/i)).toBeInTheDocument();
  expect(screen.getByLabelText(/Close modal backdrop/i)).toBeInTheDocument();
  expect(screen.getByTestId("got-it-button")).toBeInTheDocument();
});

test("does not render when FALL_RULES_SEEN is true", () => {
  (StorageService.get as Mock).mockReturnValue(true);

  render(<HintModal />);

  expect(screen.queryByText(/Welcome to Fall Rules/i)).not.toBeInTheDocument();
});

test("clicking the backdrop dismisses and sets FALL_RULES_SEEN=true", async () => {
  (StorageService.get as Mock).mockReturnValue(false);

  render(<HintModal />);

  await userEvent.click(screen.getByLabelText(/Close modal backdrop/i));

  expect(StorageService.set).toHaveBeenCalledWith(
    StorageKeys.FALL_RULES_SEEN,
    true,
  );
  expect(screen.queryByText(/Welcome to Fall Rules/i)).not.toBeInTheDocument();
});

test("clicking 'Got it' dismisses and sets FALL_RULES_SEEN=true", async () => {
  (StorageService.get as Mock).mockReturnValue(false);

  render(<HintModal />);

  await userEvent.click(screen.getByTestId("got-it-button"));

  expect(StorageService.set).toHaveBeenCalledWith(
    StorageKeys.FALL_RULES_SEEN,
    true,
  );
  expect(screen.queryByText(/Welcome to Fall Rules/i)).not.toBeInTheDocument();
});

test("contains quick hints content", () => {
  (StorageService.get as Mock).mockReturnValue(false);

  render(<HintModal />);

  expect(screen.getByText(/Quick start/i)).toBeInTheDocument();
  expect(screen.getByText(/Sings sheet/i)).toBeInTheDocument();
});
