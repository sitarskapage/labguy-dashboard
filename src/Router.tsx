import { RouterProvider, createBrowserRouter } from "react-router-dom";
import App from "./App";
import PageContainer from "./components/PageContainer";
import Dashboard from "./pages/Dashboard";
import Media from "./pages/Media";
import Projects from "./pages/Projects";
import Works from "./pages/Works";
import Posts from "./pages/Posts";
import Settings from "./pages/Settings";
import ProjectForm from "./components/project/ProjectForm";
import WorksForm from "./components/works/WorksForm";
import PostsEditor from "./components/posts/PostsEditor";
import fetchData from "./utils/fetchers";

const routes = [
  {
    element: <App />,
    path: `/${import.meta.env.VITE_ADMIN_PATH}`,
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
        element: <PageContainer title="Projects" />,
        name: "Projects",
        id: "projects",
        path: "projects",
        loader: () => fetchData("projects"),
        children: [
          {
            path: "",
            element: <Projects />,
          },
          { path: "update/:id", element: <ProjectForm /> },
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
          { path: "update/:id", element: <WorksForm /> },
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
