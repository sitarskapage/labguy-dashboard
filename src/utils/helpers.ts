import {
  ImageRefSchema,
  ProjectSchema,
  WorkSchema
} from '@jakubkanna/labguy-front-schema';

const getImageUrl = (img: ImageRefSchema, additionalParams?: string) => {
  const baseUrl = img.cld_url;
  return additionalParams ? `${baseUrl}${additionalParams}` : baseUrl;
};

import { VideoRefSchema } from '@jakubkanna/labguy-front-schema';
import { MediaRef } from '../pages/Media';

const getThumbnail = (media: MediaRef) => {
  if (media?.mediaType === 'IMAGE') return getImageUrl(media as ImageRefSchema);
  if (media?.mediaType === 'VIDEO') return (media as VideoRefSchema).thumbnail;
  throw new Error(`Unsupported media type: ${media?.mediaType}`);
};

function isVideo(media: MediaRef) {
  return media?.mediaType === 'VIDEO';
}
function isImage(media: MediaRef) {
  return media?.mediaType === 'IMAGE';
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

function getProjectMedia({ projectData }: { projectData?: ProjectSchema }) {
  console.log('Received projectData:', projectData); // Log the incoming projectData

  if (!projectData) {
    console.warn('projectData is undefined, returning empty array.');
    return [];
  }

  const initMedia: MediaRef[] = projectData.media ?? [];
  const worksMedia: MediaRef[] = (projectData.works ?? []).flatMap(
    (work: WorkSchema) => work.media ?? []
  );

  const combinedMedia: MediaRef[] = [...initMedia, ...worksMedia];
  const uniqueMedia = Array.from(
    new Map(combinedMedia.map((media) => [media.etag, media])).values()
  );

  return uniqueMedia;
}

export {
  getImageUrl,
  getThumbnail,
  isVideo,
  isImage,
  hasIdProperty,
  getProjectMedia
};
