import { createBrowserRouter } from "react-router";
import { RouterProvider } from "react-router/dom";

import { CardList } from "@/infrastructure/ui/components/card/CardList";
import { GameScreen } from "@/infrastructure/ui/screens/Game";
import { HomeScreen } from "@/infrastructure/ui/screens/Home";
import { RulesScreen } from "@/infrastructure/ui/screens/Rules";
import { SingsSheetScreen } from "@/infrastructure/ui/screens/SingsSheet";

import {
  ANIMATION_PLAYGROUND_PATH,
  CARDS_PATH,
  GAME_PATH,
  HOME_PATH,
  LOGIN_PATH,
  MATCH_PATH,
  RULES_PATH,
  SINGS_SHEETS,
} from "./Routes";

const router = createBrowserRouter([
  {
    path: LOGIN_PATH,
    lazy: async () => {
      const { LoginScreen } = await import("@/modules/login/ui/LoginScreen");
      return { Component: LoginScreen };
    },
  },
  ...(import.meta.env.DEV
    ? [
        {
          path: ANIMATION_PLAYGROUND_PATH,
          lazy: async () => {
            const { AnimationPlayground } =
              await import("@/modules/animationPlayground/ui/AnimationPlayground");
            return { Component: AnimationPlayground };
          },
        },
      ]
    : []),
  {
    path: HOME_PATH,
    element: <HomeScreen />,
  },
  {
    path: MATCH_PATH,
    lazy: async () => {
      const { MatchScreen } = await import("@/modules/match");
      return { Component: MatchScreen };
    },
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
  {
    path: RULES_PATH,
    element: <RulesScreen />,
  },
]);

export const AppRouter = () => <RouterProvider router={router} />;
