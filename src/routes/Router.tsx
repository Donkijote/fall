import { createBrowserRouter } from "react-router";
import { RouterProvider } from "react-router/dom";

import { CardList } from "@/infrastructure/ui/components/card/CardList";
import { GameScreen } from "@/infrastructure/ui/screens/Game";
import { HomeScreen } from "@/infrastructure/ui/screens/Home";
import { SingsSheetScreen } from "@/infrastructure/ui/screens/SingsSheet";

import { CARDS_PATH, GAME_PATH, HOME_PATH, SINGS_SHEETS } from "./Routes";

const basename = (import.meta.env.BASE_URL ?? "/").replace(/\/+$/, "");

const router = createBrowserRouter(
  [
    {
      path: HOME_PATH,
      element: <HomeScreen />,
    },
    {
      path: GAME_PATH,
      element: <GameScreen />,
    },
    {
      path: CARDS_PATH,
      element: <CardList />,
    },
    {
      path: SINGS_SHEETS,
      element: <SingsSheetScreen />,
    },
  ],
  { basename },
);

export const AppRouter = () => <RouterProvider router={router} />;
