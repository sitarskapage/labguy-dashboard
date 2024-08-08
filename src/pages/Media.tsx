import MediaLibrary from '../components/media/MediaLibrary';
import { useState } from 'react';
import MediaUploader from '../components/media/MediaUploader';
import { useLoaderData } from 'react-router-dom';
import { ImageRefSchema } from '../schema/types/ImageRef.schema';
import { VideoRefSchema } from '../schema/types/VideoRef.schema';

export type MediaRef = ImageRefSchema | VideoRefSchema;

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
