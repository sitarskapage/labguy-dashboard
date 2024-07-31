import MediaLibrary from "../components/media/MediaLibrary";
import { useState } from "react";
import MediaUploader from "../components/media/MediaUploader";
import { ImageRef, VideoRef } from "../schema/schema";

export type MediaRef = ImageRef | VideoRef;

export default function Media() {
  const [media, setMedia] = useState<MediaRef[] | []>([]);

  return (
    <>
      <MediaUploader setMedia={setMedia} />
      <MediaLibrary media={media} setMedia={setMedia} />
    </>
  );
}
