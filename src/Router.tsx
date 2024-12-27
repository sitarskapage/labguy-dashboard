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
import { useFetch } from './hooks/useFetch';

const useLoaders = () => {
  const { fetchWithLoading } = useFetch();

  return {
    mediaLoader: () => fetchWithLoading('media'),
    projectsLoader: () => fetchWithLoading('projects'),
    projectLoader: ({ params }: LoaderFunctionArgs) =>
      fetchWithLoading(`projects/${params.id}`),
    worksLoader: () => fetchWithLoading('works'),
    workLoader: ({ params }: LoaderFunctionArgs) =>
      fetchWithLoading(`works/${params.id}`),
    postsLoader: () => fetchWithLoading('posts'),
    postLoader: ({ params }: LoaderFunctionArgs) =>
      fetchWithLoading(`posts/${params.id}`),
    preferencesLoader: () => fetchWithLoading('profile/1'),
    tagsLoader: () => fetchWithLoading('tags')
  };
};

const Router = () => {
  const {
    mediaLoader,
    projectsLoader,
    projectLoader,
    worksLoader,
    workLoader,
    postsLoader,
    postLoader,
    preferencesLoader,
    tagsLoader
  } = useLoaders();

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
                          loader: mediaLoader
                        }
                      ]
                    },
                    {
                      element: <PageContainer title="Projects" />,
                      id: 'projects',
                      path: 'projects',
                      loader: projectsLoader,
                      children: [
                        {
                          path: '',
                          element: <Projects />
                        },
                        {
                          path: 'update/:id',
                          element: <UpdateProjectWork />,
                          loader: projectLoader
                        }
                      ]
                    },
                    {
                      element: <PageContainer title="Works" />,
                      id: 'works',
                      path: 'works',
                      loader: worksLoader,
                      children: [
                        {
                          path: '',
                          element: <Works />
                        },
                        {
                          path: 'update/:id',
                          element: <UpdateWork />,
                          loader: workLoader
                        }
                      ]
                    },
                    {
                      element: <PageContainer title="Posts" />,
                      id: 'posts',
                      path: 'posts',
                      loader: postsLoader,
                      children: [
                        {
                          path: '',
                          element: <Posts />
                        },
                        {
                          path: 'update/:id',
                          element: <UpdatePost />,
                          loader: postLoader
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
                          loader: preferencesLoader
                        }
                      ]
                    },
                    {
                      element: <PageContainer title="Tags" />,
                      id: 'tags',
                      path: 'tags',
                      loader: tagsLoader,
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

  return <RouterProvider router={router} />;
};

export default Router;
