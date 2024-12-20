import MediaLibrary from '../components/media/MediaLibrary';
import { useState } from 'react';
import MediaUploader from '../components/media/MediaUploader';
import { useLoaderData } from 'react-router-dom';
import {
  ImageRefSchema,
  ThreedRef,
  VideoRefSchema
} from '@jakubkanna/labguy-front-schema';
import { Box } from '@mui/material';

export type MediaRef = ImageRefSchema | VideoRefSchema | ThreedRef | null;

export default function Media() {
  const data = useLoaderData() as MediaRef[];
  const [media, setMedia] = useState<MediaRef[] | []>(data);

  return (
    <>
      <Box p={1}>
        <MediaUploader setMedia={setMedia} />
      </Box>
      <MediaLibrary media={media} setMedia={setMedia} />
    </>
  );
}
