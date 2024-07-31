import { useCallback } from "react";
import { ImageRef } from "../schema/schema";

const useImageUrl = () => {
  const getImageUrl = useCallback(
    (img: ImageRef, additionalParams?: string) => {
      const baseUrl = img.cld_url;

      return additionalParams ? `${baseUrl}${additionalParams}` : baseUrl;
    },
    []
  );

  return { getImageUrl };
};

export default useImageUrl;
