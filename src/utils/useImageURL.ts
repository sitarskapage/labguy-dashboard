import { useCallback } from "react";
import { ImageRef } from "../components/media/images/imageSchema";

const useImageUrl = () => {
  const getImageUrl = useCallback(
    (img: ImageRef, additionalParams?: string) => {
      const baseUrl = img.cld_secure_url ? img.cld_secure_url : img.secure_url;

      return additionalParams ? `${baseUrl}${additionalParams}` : baseUrl;
    },
    []
  );

  return { getImageUrl };
};

export default useImageUrl;
