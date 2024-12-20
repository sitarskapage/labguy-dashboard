import React from 'react';
import YouTubeIcon from '@mui/icons-material/YouTube';
import SoundCloudIcon from '@mui/icons-material/LibraryMusic';
import VimeoIcon from '@mui/icons-material/VideoLibrary';
import { Link, LinkProps, Typography } from '@mui/material';
import { Cloud } from '@mui/icons-material';
import { MediaRef } from '../../pages/Media';
import {
  ImageRefSchema,
  VideoRefSchema
} from '@jakubkanna/labguy-front-schema';

interface MediaLinkProps {
  media: MediaRef;
}

const MediaLink: React.FC<MediaLinkProps> = ({ media }) => {
  if (!media) return;

  const linkProps: LinkProps = {
    target: '_blank',
    rel: 'noopener',
    style: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center'
    } as React.CSSProperties
  };

  const getMediaLink = () => {
    if (media.yt_url) {
      return (
        <Link href={(media as VideoRefSchema).yt_url!} {...linkProps}>
          <YouTubeIcon style={{ marginRight: 4 }} />
          <Typography variant="caption">View on YouTube</Typography>
        </Link>
      );
    }
    if (media.sc_url) {
      return (
        <Link href={(media as VideoRefSchema).sc_url!} {...linkProps}>
          <SoundCloudIcon style={{ marginRight: 4 }} />
          <Typography variant="caption">Listen on SoundCloud</Typography>
        </Link>
      );
    }
    if (media.vimeo_url) {
      return (
        <Link href={(media as VideoRefSchema).vimeo_url!} {...linkProps}>
          <VimeoIcon style={{ marginRight: 4 }} />
          <Typography variant="caption">Watch on Vimeo</Typography>
        </Link>
      );
    }
    if (media.cld_url) {
      return (
        <Link href={(media as ImageRefSchema).cld_url!} {...linkProps}>
          <Cloud style={{ marginRight: 4 }} />
          <Typography variant="caption">View on Cloudinary</Typography>
        </Link>
      );
    }
    if (media.url) {
      return (
        <Link href={media.url as string} {...linkProps}>
          <Typography variant="caption">View</Typography>
        </Link>
      );
    }
    return null;
  };

  return (
    <Typography variant="caption" component={'p'} align="center">
      {getMediaLink()}
    </Typography>
  );
};

export default MediaLink;
