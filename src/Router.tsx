import { RouterProvider, createBrowserRouter } from "react-router-dom";
import Login from "./pages/Login";
import App from "./App";
import PageContainer from "./components/PageContainer";
import Dashboard from "./pages/Dashboard";
import Images from "./pages/Images";
import Events from "./pages/Events";
import Works from "./pages/Works";
import Posts from "./pages/Posts";

const readData = async (pageId: string) => {
  try {
    const response = await fetch(`http://localhost:3000/api/${pageId}/`);
    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);

    const data = await response.json();
    return data;
  } catch (err) {
    throw new Error(err.message);
  }
};

const routes = [
  {
    path: "",
    element: <Login />,
  },
  {
    element: <App />,
    path: "admin",
    children: [
      {
        element: <PageContainer title="Dashboard" />,
        children: [{ path: "", element: <Dashboard />, name: "Dashboard" }],
      },
      {
        element: <PageContainer title="Images" />,
        children: [{ path: "images", element: <Images />, name: "Images" }],
      },
      {
        element: <PageContainer title="Events" />,
        name: "Events",
        id: "events",
        loader: () => readData("events"),

        children: [
          {
            path: "events",
            element: <Events />,
          },
        ],
      },
      {
        element: <PageContainer title="Works" />,
        name: "Works",
        id: "works",
        loader: () => readData("works"),

        children: [
          {
            path: "works",
            element: <Works />,
          },
        ],
      },
      {
        element: <PageContainer title="Posts" />,
        name: "Posts",
        id: "posts",
        loader: () => readData("posts"),

        children: [
          {
            path: "posts",
            element: <Posts />,
          },
        ],
      },
    ],
  },
];

const router = createBrowserRouter(routes);

export default function Router() {
  return <RouterProvider router={router} />;
}
