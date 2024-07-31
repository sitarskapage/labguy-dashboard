import React from "react";
import YouTubeIcon from "@mui/icons-material/YouTube";
import SoundCloudIcon from "@mui/icons-material/LibraryMusic";
import VimeoIcon from "@mui/icons-material/VideoLibrary";
import { Link, LinkProps, Typography } from "@mui/material";
import { Cloud } from "@mui/icons-material";
import { ImageRef, VideoRef } from "../../schema/schema";
import { MediaRef } from "../../pages/Media";

interface MediaLinkProps {
  media: MediaRef;
}

const MediaLink: React.FC<MediaLinkProps> = ({ media }) => {
  const linkProps: LinkProps = {
    target: "_blank",
    rel: "noopener",
    style: {
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
    } as React.CSSProperties,
  };

  const getMediaLink = () => {
    if (media.yt_url) {
      return (
        <Link href={(media as VideoRef).yt_url!} {...linkProps}>
          <YouTubeIcon style={{ marginRight: 4 }} />
          <Typography variant="caption">View on YouTube</Typography>
        </Link>
      );
    }
    if (media.sc_url) {
      return (
        <Link href={(media as VideoRef).sc_url!} {...linkProps}>
          <SoundCloudIcon style={{ marginRight: 4 }} />
          <Typography variant="caption">Listen on SoundCloud</Typography>
        </Link>
      );
    }
    if (media.vimeo_url) {
      return (
        <Link href={(media as VideoRef).vimeo_url!} {...linkProps}>
          <VimeoIcon style={{ marginRight: 4 }} />
          <Typography variant="caption">Watch on Vimeo</Typography>
        </Link>
      );
    }
    if (media.cld_url) {
      return (
        <Link href={(media as ImageRef).cld_url!} {...linkProps}>
          <Cloud style={{ marginRight: 4 }} />
          <Typography variant="caption">View on Cloudinary</Typography>
        </Link>
      );
    }
    return null;
  };

  return (
    <Typography variant="caption" paragraph align="center">
      {getMediaLink()}
    </Typography>
  );
};

export default MediaLink;
