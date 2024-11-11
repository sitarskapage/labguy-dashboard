import {
  LoaderFunctionArgs,
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
import { fetchData } from './utils/loaders';
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

const routes: RouteObject[] = [
  { path: '*' },

  {
    path: import.meta.env.VITE_ADMIN_PATH,
    errorElement: <ErrorBoundary FallbackComponent={Fallback} />,
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
                    loader: () => fetchData('media')
                  }
                ]
              },
              {
                element: <PageContainer title="Projects" />,
                id: 'projects',
                path: 'projects',
                loader: () => fetchData('projects'),
                children: [
                  {
                    path: '',
                    element: <Projects />
                  },
                  {
                    path: 'update/:id',
                    element: <UpdateProjectWork></UpdateProjectWork>,
                    loader: async ({
                      params
                    }: LoaderFunctionArgs): Promise<unknown> => {
                      return fetchData(`projects/${params.id}`);
                    }
                  }
                ]
              },
              {
                element: <PageContainer title="Works" />,
                id: 'works',
                path: 'works',
                loader: () => fetchData('works'),
                children: [
                  {
                    path: '',
                    element: <Works />
                  },
                  {
                    path: 'update/:id',
                    element: <UpdateWork></UpdateWork>,
                    loader: async ({
                      params
                    }: LoaderFunctionArgs): Promise<unknown> => {
                      return fetchData(`works/${params.id}`);
                    }
                  }
                ]
              },
              {
                element: <PageContainer title="Posts" />,
                id: 'posts',
                path: 'posts',
                loader: () => fetchData('posts'),
                children: [
                  {
                    path: '',
                    element: <Posts />
                  },
                  {
                    path: 'update/:id',
                    element: <UpdatePost />,
                    loader: async ({
                      params
                    }: LoaderFunctionArgs): Promise<unknown> => {
                      return fetchData(`posts/${params.id}`);
                    }
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
                    element: <Preferences></Preferences>,
                    loader: () => fetchData('profile/1')
                  }
                ]
              },
              {
                element: <PageContainer title="Tags" />,
                id: 'tags',
                path: 'tags',

                children: [
                  {
                    path: '',
                    element: <UpdateTags />,
                    loader: () => fetchData('tags')
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

const router = createBrowserRouter(routes);

export default function Router() {
  return <RouterProvider router={router} />;
}
