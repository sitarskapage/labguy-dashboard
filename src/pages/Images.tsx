import ImagesUploader from "../components/images/ImagesUploader";
import ImagesLibrary from "../components/images/ImagesLibrary";
import { useState } from "react";

export interface ImageInstance {
  public_id: string;
  original_filename: string;
  path: string;
  url: string;
  _id: string;
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

export default function Images() {
  const [imageList, setImageList] = useState<ImageInstance[]>([]);

  return (
    <>
      <ImagesUploader setImageList={setImageList} />
      <ImagesLibrary imageList={imageList} setImageList={setImageList} />
    </>
  );
}
