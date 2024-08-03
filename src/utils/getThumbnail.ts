import { MediaRef } from "../pages/Media";
import { ImageRef, VideoRef } from "../schema/schema";
import getImageUrl from "./getImageUrl";

const getThumbnail = (media: MediaRef) => {
  if (media.mediaType === "IMAGE") return getImageUrl(media as ImageRef) || "";
  if (media.mediaType === "VIDEO") return (media as VideoRef).thumbnail || "";
  throw new Error(`Unsupported media type: ${media.mediaType}`);
};

export default getThumbnail;
