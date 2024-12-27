import {
  RouteObject,
  RouterProvider,
  createBrowserRouter
} from 'react-router-dom';
import App from './App';
import PageContainer from './components/PageContainer';
import Dashboard from './pages/Dashboard';
import Media from './pages/Media';
import Projects from './pages/Projects';
import Works from './pages/Works';
import Posts from './pages/Posts';
import Preferences from './pages/Preferences';
import UpdateProjectWork from './pages/update/UpdateProject';
import UpdateWork from './pages/update/UpdateWork';
import UpdatePost from './pages/update/UpdatePost';
import Login from './pages/Login';
import LoginForm from './components/login/LoginForm';
import ForgotForm from './components/login/LoginForgot';
import ResetForm from './components/login/LoginReset';
import Protected from './components/Protected';
import { ErrorBoundary } from 'react-error-boundary';
import Fallback from './components/Fallback';
import UpdateTags from './pages/update/UpdateTags';
import { routeLoaders } from './utils/routeLoaders';

const routes: RouteObject[] = [
  {
    path: '',
    errorElement: <ErrorBoundary FallbackComponent={Fallback} />,
    children: [
      { path: '*' },
      {
        path: import.meta.env.VITE_ADMIN_PATH,
        children: [
          {
            element: <Login />,
            children: [
              { path: 'login', element: <LoginForm /> },
              { path: 'forgot', element: <ForgotForm /> },
              { path: 'reset', element: <ResetForm /> }
            ]
          },
          {
            element: <Protected />,
            children: [
              {
                path: '',
                element: <App />,
                children: [
                  {
                    element: <PageContainer title="Dashboard" />,
                    children: [{ path: '', element: <Dashboard /> }]
                  },
                  {
                    element: <PageContainer title="Media" />,
                    children: [
                      {
                        path: 'media',
                        element: <Media />,
                        loader: routeLoaders.mediaLoader
                      }
                    ]
                  },
                  {
                    element: <PageContainer title="Projects" />,
                    id: 'projects',
                    path: 'projects',
                    loader: routeLoaders.projectsLoader,
                    children: [
                      {
                        path: '',
                        element: <Projects />
                      },
                      {
                        path: 'update/:id',
                        element: <UpdateProjectWork />,
                        loader: routeLoaders.projectLoader
                      }
                    ]
                  },
                  {
                    element: <PageContainer title="Works" />,
                    id: 'works',
                    path: 'works',
                    loader: routeLoaders.worksLoader,
                    children: [
                      {
                        path: '',
                        element: <Works />
                      },
                      {
                        path: 'update/:id',
                        element: <UpdateWork />,
                        loader: routeLoaders.workLoader
                      }
                    ]
                  },
                  {
                    element: <PageContainer title="Posts" />,
                    id: 'posts',
                    path: 'posts',
                    loader: routeLoaders.postsLoader,
                    children: [
                      {
                        path: '',
                        element: <Posts />
                      },
                      {
                        path: 'update/:id',
                        element: <UpdatePost />,
                        loader: routeLoaders.postLoader
                      }
                    ]
                  },
                  {
                    element: <PageContainer title="Preferences" />,
                    id: 'preferences',
                    path: 'preferences',
                    children: [
                      {
                        path: '',
                        element: <Preferences />,
                        loader: routeLoaders.preferencesLoader
                      }
                    ]
                  },
                  {
                    element: <PageContainer title="Tags" />,
                    id: 'tags',
                    path: 'tags',
                    loader: routeLoaders.tagsLoader,
                    children: [
                      {
                        path: '',
                        element: <UpdateTags />
                      }
                    ]
                  }
                ]
              }
            ]
          }
        ]
      }
    ]
  }
];

const router = createBrowserRouter(routes, {
  basename: import.meta.env.BASE_URL
});

export default function Router() {
  return <RouterProvider router={router} />;
}
