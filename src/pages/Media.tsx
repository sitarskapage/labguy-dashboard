import MediaLibrary from '../components/media/MediaLibrary';
import { useState } from 'react';
import MediaUploader from '../components/media/MediaUploader';
import { ImageRef, VideoRef } from '../schema/schema';
import { useLoaderData } from 'react-router-dom';

export type MediaRef = ImageRef | VideoRef;

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
