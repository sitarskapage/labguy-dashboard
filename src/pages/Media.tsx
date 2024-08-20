import MediaLibrary from '../components/media/MediaLibrary';
import { useState } from 'react';
import MediaUploader from '../components/media/MediaUploader';
import { useLoaderData } from 'react-router-dom';
import {
  ImageRefSchema,
  VideoRefSchema
} from '@jakubkanna/labguy-front-schema';

export type MediaRef = ImageRefSchema | VideoRefSchema | null;

export default function Media() {
  const data = useLoaderData() as MediaRef[];
  const [media, setMedia] = useState<MediaRef[] | []>(data);

  return (
    <>
      <MediaUploader setMedia={setMedia} />
      <MediaLibrary media={media} setMedia={setMedia} />
    </>
  );
}
