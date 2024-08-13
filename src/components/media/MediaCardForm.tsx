import React from 'react';
import { MediaRef } from '../../pages/Media';
import Form from '../Form';
import ImageRef from '../../schema/src/ImageRef.schema.json';
import VideoRef from '../../schema/src/VideoRef.schema.json';
import { VideoRefSchema, ImageRefSchema } from '../../schema/build';
import { hideAllButVisible } from '../../utils/uiSchemaUtils';

interface MediaCardFormProps {
  media: MediaRef;
  setMediaList: React.Dispatch<React.SetStateAction<MediaRef[]>>;
  setEditingMedia: React.Dispatch<React.SetStateAction<MediaRef | null>>;
}

const MediaCardForm: React.FC<MediaCardFormProps> = ({
  media,
  setMediaList,
  setEditingMedia
}) => {
  if (!media.etag) throw new Error('No etag found in media object');

  const setState = (newMedia: MediaRef) => {
    setMediaList((prevList) =>
      prevList.map((item) => (item.etag === newMedia.etag ? newMedia : item))
    );
    setEditingMedia(null);
  };

  // Extract schema definitions
  const videoSchema: VideoRefSchema = VideoRef;
  const imageSchema: ImageRefSchema = ImageRef;

  // Generate UI schemas
  const videoUiSchema = hideAllButVisible(videoSchema, [
    'player_loop',
    'player_muted'
  ]);
  const imageUiSchema = hideAllButVisible(imageSchema, ['description']);

  // Determine schema and UI schema based on media type
  const schema: MediaRef =
    media.mediaType === 'IMAGE' ? imageSchema : videoSchema;
  const uiSchema = media.mediaType === 'IMAGE' ? imageUiSchema : videoUiSchema;

  // Define endpoint
  const endpoint = {
    path: media.mediaType === 'IMAGE' ? 'images' : 'videos',
    id: media.etag
  };

  const data = media;

  return (
    <Form<MediaRef>
      data={data}
      uiSchema={uiSchema}
      schema={schema}
      endpoint={endpoint}
      setState={setState}
    />
  );
};

export default MediaCardForm;
