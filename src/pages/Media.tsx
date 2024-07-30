import MediaLibrary from "../components/media/MediaLibrary";
import { useState } from "react";
import MediaUploader from "../components/media/MediaUploader";
import { VideoRef } from "../components/media/videos/videoSchema";
import { ImageRef } from "../components/media/images/imageSchema";

export type MediaInstance = ImageRef | VideoRef;

export default function Media() {
  const [media, setMedia] = useState<MediaInstance[] | []>([]);

  return (
    <>
      <MediaUploader setMedia={setMedia} />
      <MediaLibrary media={media} setMedia={setMedia} />
    </>
  );
}
