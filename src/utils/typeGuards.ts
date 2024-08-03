import { MediaRef } from "../pages/Media";

export function isVideo(media: MediaRef) {
  return media.mediaType === "VIDEO";
}
export function isImage(media: MediaRef) {
  return media.mediaType === "IMAGE";
}
export function hasIdProperty<T>(
  item: T | undefined
): item is T & { id: string } {
  return (
    item !== undefined &&
    typeof item === "object" &&
    item !== null &&
    "id" in item &&
    typeof (item as { id: unknown }).id === "string"
  );
}
