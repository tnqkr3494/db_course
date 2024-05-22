import { createBrowserRouter } from "react-router-dom";
import Home from "./pages/Home";

import Root from "./pages/Root";
import Profile from "./pages/Profile";
import Ticket from "./pages/Ticket";
import Cinema from "./pages/Cinema";
import Login from "./pages/Login";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <Root />,
    children: [
      {
        path: "",
        element: <Home />,
      },
      {
        path: "profile",
        element: <Profile />,
      },
      {
        path: "tickets",
        element: <Ticket />,
      },
      {
        path: "cinema",
        element: <Cinema />,
      },
    ],
  },
  {
    path: "/login",
    element: <Login />,
  },
]);
