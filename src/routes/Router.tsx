import { createBrowserRouter } from "react-router";
import { RouterProvider } from "react-router/dom";

import { HomeScreen } from "@/infrastructure/ui/screens/Home";

const router = createBrowserRouter([
  {
    path: "/",
    element: <HomeScreen />,
  },
]);

export const AppRouter = () => <RouterProvider router={router} />;
