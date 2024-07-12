import { RouterProvider, createBrowserRouter } from "react-router-dom";
import Login from "./pages/Login";
import App from "./App";

import PageContainer from "./components/PageContainer";
import Dashboard from "./pages/Dashboard";

const routes = [
  {
    path: "*",
    element: <Login />,
  },
  {
    element: <App />,
    path: "/admin",
    children: [
      {
        element: <PageContainer title="Dashboard" />,
        children: [{ path: "", element: <Dashboard />, name: "Dashboard" }],
      },
    ],
  },
];

const router = createBrowserRouter(routes);

export default function Router() {
  return <RouterProvider router={router} />;
}
