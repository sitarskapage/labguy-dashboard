import MediaLibrary from "../components/media/MediaLibrary";
import { useState } from "react";
import MediaUploader from "../components/media/MediaUploader";
import { VideoInstance } from "../components/media/videoSchema";
import { ImageInstance } from "../components/media/imageSchema";

export type MediaInstance = ImageInstance | VideoInstance;

export default function Media() {
  const [media, setMedia] = useState<MediaInstance[] | []>([]);

  return (
    <>
      <MediaUploader setMedia={setMedia} />
      <MediaLibrary media={media} setMedia={setMedia} />
    </>
  );
}
