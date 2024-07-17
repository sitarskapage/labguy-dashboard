import MediaLibrary from "../components/media/MediaLibrary";
import { useState } from "react";
import MediaUploader from "../components/media/MediaUploader";

export interface ImageInstance {
  type: "image";
  _id: string;
  public_id: string;
  original_filename: string;
  path: string;
  url: string;
  filename?: string;
  format?: string;
  dimensions?: { width: number; height: number };
  tags?: string[];
  alt?: string;
  bytes?: number;
  secure_url?: string;
  cld_url?: string;
  cld_secure_url?: string;
  [k: string]: unknown;
}
export interface VideoInstance {
  original_filename: string;
  type: "video";
  _id: string;
  youtube_url: string;
}

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
