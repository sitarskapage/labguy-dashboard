import { useCallback } from "react";
import { ImageInstance } from "../components/media/images/imageSchema";

const useImageUrl = () => {
  const getImageUrl = useCallback(
    (img: ImageInstance, additionalParams?: string) => {
      const baseUrl = img.cld_secure_url ? img.cld_secure_url : img.secure_url;

      return additionalParams ? `${baseUrl}${additionalParams}` : baseUrl;
    },
    []
  );

  return { getImageUrl };
};

export default useImageUrl;
