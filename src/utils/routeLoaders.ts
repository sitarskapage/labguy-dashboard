import { LoaderFunctionArgs } from 'react-router-dom';

const loader = async (path: string) => {
  try {
    const response = await fetch(
      `${import.meta.env.VITE_SERVER_API_URL}/${path}`
    );
    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
    return await response.json();
  } catch (err) {
    if (err instanceof Error) throw new Error(err.message);
  }
};

export const routeLoaders = {
  mediaLoader: () => loader('media'),
  projectsLoader: () => loader('projects'),
  projectLoader: ({ params }: LoaderFunctionArgs) =>
    loader(`projects/${params.id}`),
  worksLoader: () => loader('works'),
  workLoader: ({ params }: LoaderFunctionArgs) => loader(`works/${params.id}`),
  postsLoader: () => loader('posts'),
  postLoader: ({ params }: LoaderFunctionArgs) => loader(`posts/${params.id}`),
  preferencesLoader: () => loader('profile/1'),
  tagsLoader: () => loader('tags')
};
