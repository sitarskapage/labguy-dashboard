import { Dispatch, SetStateAction, useState } from 'react';
import { TextField, Button, Typography, Grid2 } from '@mui/material';
import { AlertProps } from '@mui/material/Alert';
import Uploader from '../../Uploader';
import { MediaRef } from '../../../pages/Media';
import ThreedDropZone, { FileWithPreview } from './ThreedDropZone';

interface ThreedUploaderProps {
  overrideMedia: (response: MediaRef[]) => void;
  token: string;
  setLoading: Dispatch<SetStateAction<boolean>>;
}

const ThreedUploader = ({ overrideMedia, token }: ThreedUploaderProps) => {
  const [files, setFiles] = useState<File[]>([]);
  const [value, setValue] = useState<string>('');
  const [uploading, setUploading] = useState<boolean>(false);
  const [alert, setAlert] = useState<Pick<
    AlertProps,
    'children' | 'severity'
  > | null>(null);

  const handleSubmit = async () => {
    try {
      setUploading(true);
    } catch (error: any) {
      // Catch any error that occurs during the API request
      setAlert({
        children: `Failed to upload: ${error.message}`,
        severity: 'error'
      });
    } finally {
      // Reset the uploading state after the process finishes
      setUploading(false);
    }
  };

  return (
    <>
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
    </>
  );
};

export default ThreedUploader;
