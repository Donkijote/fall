import { createBrowserRouter } from "react-router";
import { RouterProvider } from "react-router/dom";

import { GameScreen } from "@/infrastructure/ui/screens/Game";
import { HomeScreen } from "@/infrastructure/ui/screens/Home";

import { GAME_PATH, HOME_PATH } from "./Routes";

const router = createBrowserRouter([
  {
    path: HOME_PATH,
    element: <HomeScreen />,
  },
  {
    path: GAME_PATH,
    element: <GameScreen />,
  },
]);

export const AppRouter = () => <RouterProvider router={router} />;
