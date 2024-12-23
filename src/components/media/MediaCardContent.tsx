import React from 'react';
import { Tooltip, Typography } from '@mui/material';
import { formatBytes, formatDuration } from '../../utils/formatters';
import { MediaRef } from '../../pages/Media';
import MediaLink from './MediaLink';
import {
  ImageRefSchema,
  ThreedRef,
  VideoRefSchema
} from '@jakubkanna/labguy-front-schema';

interface MediaCardContentProps {
  media: MediaRef;
}

const MediaCardContent: React.FC<MediaCardContentProps> = ({ media }) => {
  const titleProps = {
    variant: 'caption' as const,
    paragraph: true,
    noWrap: true,
    paddingTop: '0.5rem',
    align: 'center' as const
  };

  const renderVideoContent = (video: VideoRefSchema) => (
    <>
      <Tooltip title={video.title || 'Untitled'}>
        <Typography {...titleProps}>{video.title || 'Untitled'}</Typography>
      </Tooltip>
      <Typography variant="caption" paragraph align="center">
        {video.duration ? formatDuration(video.duration) : 'Duration unknown'}
        <br />
        {video.definition ? video.definition.toUpperCase() : 'No definition'}
      </Typography>
      <MediaLink media={media} />
    </>
  );

  const renderImageContent = (image: ImageRefSchema) => (
    <>
      <Tooltip title={image.filename || 'No filename'}>
        <Typography {...titleProps}>
          {image.filename || 'No filename'}
        </Typography>
      </Tooltip>
      <Typography variant="caption" paragraph align="center">
        {image.bytes ? formatBytes(image.bytes) : 'Size unknown'}
        <br />
        {image.width && image.height
          ? `${image.width}px x ${image.height}px`
          : 'Dimensions unknown'}
      </Typography>
      <MediaLink media={media} />
    </>
  );

  const renderThreedContent = (threed: ThreedRef) => (
    <>
      <Tooltip title={threed.public_id || 'No filename'}>
        <Typography {...titleProps}>
          {threed.public_id || 'No filename'}
        </Typography>
      </Tooltip>
      <Typography variant="caption" paragraph align="center">
        {threed.bytes ? formatBytes(threed.bytes) : 'Size unknown'}
        <br />
        {threed.extension} object
      </Typography>

      <MediaLink media={media} />
    </>
  );
  // Conditional rendering based on the media type
  switch (media && media.mediaType) {
    case 'VIDEO':
      return renderVideoContent(media as VideoRefSchema);
    case 'IMAGE':
      return renderImageContent(media as ImageRefSchema);
    case 'THREE_D':
      return renderThreedContent(media as ThreedRef);
    default:
      return null;
  }
};

export default MediaCardContent;
