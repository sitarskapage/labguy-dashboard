import { Dispatch, SetStateAction, useState } from 'react';
import { AlertProps } from '@mui/material';
import Uploader from '../../Uploader';
import ImagesDropZone, { FileWithPreview } from './ImagesDropZone';
import { MediaRef } from '../../../pages/Media';

interface ImageUploaderProps {
  overrideMedia: (response: MediaRef[]) => void;
  token: string;
  setLoading: Dispatch<SetStateAction<boolean>>;
}

const ImageUploader = ({ overrideMedia, token }: ImageUploaderProps) => {
  const [files, setFiles] = useState<FileWithPreview[]>([]);
  const [uploading, setUploading] = useState<boolean>(false);
  const [alert, setAlert] = useState<Pick<
    AlertProps,
    'children' | 'severity'
  > | null>(null);

  const handleImagesSubmit = async () => {
    try {
      setUploading(true);
      setAlert({ children: 'Preparing images...', severity: 'info' });

      const formData = new FormData();
      files.forEach((file) => {
        formData.append('files', file);
      });

      setAlert({ children: 'Uploading images...', severity: 'info' });

      const response = await fetch(
        `${import.meta.env.VITE_SERVER_API_URL}/images/upload`,
        {
          method: 'POST',
          body: formData,
          headers: {
            Authorization: `${token}`
          }
        }
      );

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error.message || 'Failed to upload to server');
      }

      setAlert({
        children: 'Images uploaded successfully.',
        severity: 'success'
      });

      overrideMedia(result);
    } catch (error) {
      console.error('Error during image upload:', error);
      setAlert({
        children: `Error during upload: ${(error as Error).message}`,
        severity: 'error'
      });
    } finally {
      setUploading(false);
      setFiles([]);
    }
  };

  const onSubmit = () => {
    handleImagesSubmit();
  };

  return (
    <>
      <Uploader
        alert={alert}
        onSubmit={onSubmit}
        uploading={uploading}
        label={'Images'}
      >
        <ImagesDropZone files={files} setFiles={setFiles} />
      </Uploader>
    </>
  );
};

export default ImageUploader;
