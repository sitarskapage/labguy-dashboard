import { MediaInstance } from "../pages/Media";

export function isVideo(media: MediaInstance) {
  return media.type === "VIDEO";
}
export function isImage(media: MediaInstance) {
  return media.type === "IMAGE";
}
export function hasIdProperty<T>(
  item: T | undefined
): item is T & { _id: string } {
  return (
    item !== undefined &&
    typeof item === "object" &&
    item !== null &&
    "_id" in item &&
    typeof (item as { _id: unknown })._id === "string"
  );
}
