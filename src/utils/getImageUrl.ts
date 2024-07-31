import { ImageRef } from "../schema/schema";

const getImageUrl = (img: ImageRef, additionalParams?: string) => {
  const baseUrl = img.cld_url;
  return additionalParams ? `${baseUrl}${additionalParams}` : baseUrl;
};

export default getImageUrl;
