import { Dispatch, SetStateAction, useState } from "react";
import { AlertProps } from "@mui/material";
import Uploader from "../../Uploader";
import ImagesDropZone, { FileWithPreview } from "./ImagesDropZone";
import { MediaInstance } from "../../../pages/Media";

interface ImageUploaderProps {
  overrideMedia: (response: MediaInstance[]) => void;
  token: string;
  setLoading: Dispatch<SetStateAction<boolean>>;
}

const ImageUploader = ({ overrideMedia, token }: ImageUploaderProps) => {
  const [files, setFiles] = useState<FileWithPreview[]>([]);
  const [uploading, setUploading] = useState<boolean>(false);
  const [alert, setAlert] = useState<Pick<
    AlertProps,
    "children" | "severity"
  > | null>(null);

  const handleImagesSubmit = async () => {
    try {
      setUploading(true);
      setAlert({ children: "Preparing images...", severity: "info" });

      const formData = new FormData();
      files.forEach((file) => {
        formData.append("files", file);
      });

      setAlert({ children: "Uploading images...", severity: "info" });

      const response = await fetch("http://localhost:3000/api/images/upload", {
        method: "POST",
        body: formData,
        headers: {
          Authorization: `${token}`,
        },
      });

      if (!response.ok) {
        throw new Error("Failed to upload to server");
      }

      const result = await response.json();

      setAlert({
        children: "Images uploaded successfully.",
        severity: "success",
      });

      overrideMedia(result);
    } catch (error) {
      console.error("Error during image upload:", error);
      setAlert({
        children: `Error during upload: ${(error as Error).message}`,
        severity: "error",
      });
    } finally {
      setUploading(false);
      setFiles([]);
    }
  };

  const onSubmit = () => {
    handleImagesSubmit();
    setFiles([]);
  };

  return (
    <>
      <Uploader
        alert={alert}
        onSubmit={onSubmit}
        uploading={uploading}
        label={"Images"}>
        <ImagesDropZone files={files} setFiles={setFiles} />
      </Uploader>
    </>
  );
};

export default ImageUploader;
