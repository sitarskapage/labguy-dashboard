import {
  ImageRefSchema,
  VideoRefSchema
} from '@jakubkanna/labguy-front-schema';
import { MediaRef } from '../pages/Media';

import getImageUrl from './getImageUrl';

const getThumbnail = (media: MediaRef) => {
  if (media?.mediaType === 'IMAGE') return getImageUrl(media as ImageRefSchema);
  if (media?.mediaType === 'VIDEO') return (media as VideoRefSchema).thumbnail;
  throw new Error(`Unsupported media type: ${media?.mediaType}`);
};

export default getThumbnail;
