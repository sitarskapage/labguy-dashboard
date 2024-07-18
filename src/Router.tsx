import { RouterProvider, createBrowserRouter } from "react-router-dom";
import Login from "./pages/Login";
import App from "./App";
import PageContainer from "./components/PageContainer";
import Dashboard from "./pages/Dashboard";
import Media from "./pages/Media";
import Events from "./pages/Events";
import Works from "./pages/Works";
import Posts from "./pages/Posts";
import Settings from "./pages/Settings";
import EventsEditor from "./components/events/EventsEditor";
import WorksEditor from "./components/works/WorksEditor";
import PostsEditor from "./components/posts/PostsEditor";
import fetchData from "./utils/fetchData";
import { ErrorBoundary } from "react-error-boundary";

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
        element: <PageContainer title="Media" />,
        children: [{ path: "images", element: <Media />, name: "Images" }],
      },
      {
        element: <PageContainer title="Events" />,
        name: "Events",
        id: "events",
        path: "events",
        loader: () => fetchData("events"),
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
        loader: () => fetchData("works"),
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
        loader: () => fetchData("posts"),
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
