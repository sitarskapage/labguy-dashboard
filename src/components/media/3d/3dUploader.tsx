import { Dispatch, SetStateAction, useState } from 'react';
import { Alert, AlertProps, Grid2, Paper } from '@mui/material';
import Uploader from '../../Uploader';
import { MediaRef } from '../../../pages/Media';
import ThreedDropZone from './ThreedDropZone';
import ThreedEditForm from './3dEditForm';
import { ThreedRef } from '@jakubkanna/labguy-front-schema';

interface ThreedUploaderProps {
  overrideMedia: (response: MediaRef[]) => void;
  token: string;
  setLoading: Dispatch<SetStateAction<boolean>>;
}

const ThreedUploader = ({ overrideMedia, token }: ThreedUploaderProps) => {
  const [files, setFiles] = useState<File[]>([]);
  const [uploading, setUploading] = useState<boolean>(false);
  const [alert, setAlert] = useState<Pick<
    AlertProps,
    'children' | 'severity'
  > | null>(null);
  const [uploaded, setUploaded] = useState<ThreedRef | null>(null);

  const handleSubmit = async () => {
    try {
      setUploading(true);
      setAlert({ children: 'Preparing 3D files...', severity: 'info' });

      const formData = new FormData();
      files.forEach((file) => {
        formData.append('files', file);
      });

      setAlert({ children: 'Uploading 3D files...', severity: 'info' });

      const response = await fetch(
        `${import.meta.env.VITE_SERVER_API_URL}/models/upload`,
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
        children: '3D files uploaded successfully.',
        severity: 'success'
      });

      setUploaded(result as ThreedRef);
      //set media
    } catch (error: any) {
      console.error('Error during 3D file upload:', error);
      setAlert({
        children: `Failed to upload: ${error.message}`,
        severity: 'error'
      });
      setUploaded(null);
    } finally {
      setUploading(false);
      setFiles([]);
    }
  };

  return (
    <>
      {uploaded ? (
        <Paper>
          <Grid2 container p={2}>
            <Grid2 size={12}>
              <Alert severity="success">3D object has been uploaded</Alert>
            </Grid2>{' '}
            <Grid2 size={12}>
              <ThreedEditForm reference={uploaded} />
            </Grid2>
          </Grid2>
        </Paper>
      ) : (
        <Uploader
          alert={alert}
          onSubmit={handleSubmit}
          uploading={uploading}
          label={'3D Object'}
        >
          <Grid2 container>
            <ThreedDropZone files={files} setFiles={setFiles} />
          </Grid2>
        </Uploader>
      )}
    </>
  );
};

export default ThreedUploader;
