import { createBrowserRouter } from "react-router";
import { RouterProvider } from "react-router/dom";

import { CardList } from "@/infrastructure/ui/components/card/CardList";
import { GameScreen } from "@/infrastructure/ui/screens/Game";
import { HomeScreen } from "@/infrastructure/ui/screens/Home";

import { CARDS_PATH, GAME_PATH, HOME_PATH } from "./Routes";

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
  ],
  { basename },
);

export const AppRouter = () => <RouterProvider router={router} />;
