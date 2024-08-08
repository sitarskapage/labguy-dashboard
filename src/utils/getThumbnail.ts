import { MediaRef } from '../pages/Media';
import { ImageRefSchema } from '../schema/types/ImageRef.schema';
import { VideoRefSchema } from '../schema/types/VideoRef.schema';
import getImageUrl from './getImageUrl';

const getThumbnail = (media: MediaRef) => {
  if (media.mediaType === 'IMAGE')
    return getImageUrl(media as ImageRefSchema) || '';
  if (media.mediaType === 'VIDEO')
    return (media as VideoRefSchema).thumbnail || '';
  throw new Error(`Unsupported media type: ${media.mediaType}`);
};

export default getThumbnail;
