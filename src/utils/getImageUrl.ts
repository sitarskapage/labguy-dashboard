import { ImageRefSchema } from '@jakubkanna/labguy-front-schema';

const getImageUrl = (img: ImageRefSchema, additionalParams?: string) => {
  const baseUrl = img.cld_url;
  return additionalParams ? `${baseUrl}${additionalParams}` : baseUrl;
};

export default getImageUrl;
