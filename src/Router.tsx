import { createBrowserRouter } from "react-router-dom";
import Home from "./pages/Home";

import Root from "./pages/Root";
import Profile from "./pages/Profile";
import Ticket from "./pages/Ticket";
import Cinema from "./pages/Cinema";
import Login from "./pages/Login";
import Detail from "./pages/Detail";
import Buy from "./pages/Buy";
import SignUp from "./pages/SignUp";

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
        path: "cinema/:id",
        element: <Cinema />,
      },
      {
        path: "movie/:id",
        element: <Detail />,
      },
      {
        path: "buy/:id",
        element: <Buy />,
      },
    ],
  },
  {
    path: "/login",
    element: <Login />,
  },
  {
    path: "/signup",
    element: <SignUp />,
  },
]);
