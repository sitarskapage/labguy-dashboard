import { ImageRefSchema, ThreedRef } from '@jakubkanna/labguy-front-schema';

const getImageUrl = (img: ImageRefSchema, additionalParams?: string) => {
  const baseUrl = img.cld_url;
  return additionalParams ? `${baseUrl}${additionalParams}` : baseUrl;
};

import { VideoRefSchema } from '@jakubkanna/labguy-front-schema';
import { MediaRef } from '../pages/Media';

const getThumbnail = (media: MediaRef): string | null | undefined => {
  if (media?.mediaType === 'IMAGE') return getImageUrl(media as ImageRefSchema);
  if (media?.mediaType === 'VIDEO') return (media as VideoRefSchema).thumbnail;
  if (media?.mediaType === 'THREE_D')
    return (media as ThreedRef).poster?.cld_url as string;
  return undefined;
};

function isVideo(media: MediaRef) {
  return media?.mediaType === 'VIDEO';
}
function isImage(media: MediaRef) {
  return media?.mediaType === 'IMAGE';
}
function is3d(media: MediaRef) {
  return media?.mediaType === 'THREE_D';
}
function hasIdProperty<T>(item: T | undefined): item is T & { id: string } {
  return (
    item !== undefined &&
    typeof item === 'object' &&
    item !== null &&
    'id' in item &&
    typeof (item as { id: unknown }).id === 'string'
  );
}

export { getImageUrl, getThumbnail, isVideo, isImage, hasIdProperty, is3d };
