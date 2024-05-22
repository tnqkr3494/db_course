import { createBrowserRouter } from "react-router-dom";
import Home from "./pages/Home";

import Root from "./pages/Root";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <Root />,
    children: [
      {
        path: "",
        element: <Home />,
      },
    ],
  },
]);
