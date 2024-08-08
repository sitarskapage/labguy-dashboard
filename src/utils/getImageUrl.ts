import { ImageRefSchema } from '../schema/types/ImageRef.schema';

const getImageUrl = (img: ImageRefSchema, additionalParams?: string) => {
  const baseUrl = img.cld_url;
  return additionalParams ? `${baseUrl}${additionalParams}` : baseUrl;
};

export default getImageUrl;
