import React from 'react';
import { MediaRef } from '../../pages/Media';

import ThreedEditForm from './3d/3dEditForm';
import ImageEditForm from './images/ImageEditForm';
import VideoEditForm from './videos/VideoEditForm';
import {
  ImageRefSchema,
  ThreedRef,
  VideoRefSchema
} from '@jakubkanna/labguy-front-schema';

interface MediaCardFormProps {
  media: MediaRef;
}

const MediaCardForm: React.FC<MediaCardFormProps> = ({ media }) => {
  if (!media?.etag) return null;

  const getEditorComponent = () => {
    switch (media.mediaType) {
      case 'IMAGE':
        return <ImageEditForm reference={media as ImageRefSchema} />;
      case 'VIDEO':
        return <VideoEditForm reference={media as VideoRefSchema} />;
      case 'THREE_D':
        return <ThreedEditForm reference={media as ThreedRef} />;
      default:
        return null;
    }
  };

  return getEditorComponent();
};

export default MediaCardForm;
