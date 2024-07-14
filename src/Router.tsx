import { RouterProvider, createBrowserRouter } from "react-router-dom";
import Login from "./pages/Login";
import App from "./App";
import PageContainer from "./components/PageContainer";
import Dashboard from "./pages/Dashboard";
import Images from "./pages/Images";
import Events from "./pages/Events";
import Works from "./pages/Works";
import Posts from "./pages/Posts";
import Settings from "./pages/Settings";
import EventsEditor from "./components/events/EventsEditor";
import WorksEditor from "./components/works/WorksEditor";
import PostsEditor from "./components/posts/PostsEditor";

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
        path: "events",
        loader: () => readData("events"),
        children: [
          {
            path: "",
            element: <Events />,
          },
          { path: "update/:id", element: <EventsEditor /> },
        ],
      },
      {
        element: <PageContainer title="Works" />,
        name: "Works",
        id: "works",
        path: "works",
        loader: () => readData("works"),
        children: [
          {
            path: "",
            element: <Works />,
          },
          { path: "update/:id", element: <WorksEditor /> },
        ],
      },
      {
        element: <PageContainer title="Posts" />,
        name: "Posts",
        id: "posts",
        path: "posts",
        loader: () => readData("posts"),
        children: [
          {
            path: "",
            element: <Posts />,
          },
          { path: "update/:id", element: <PostsEditor /> },
        ],
      },
      {
        element: <PageContainer title="Settings" />,
        name: "Settings",
        id: "settings",
        path: "settings",
        // loader: () => readData("settings"),

        children: [
          {
            path: "",
            element: <Settings />,
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
