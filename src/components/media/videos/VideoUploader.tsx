import { Dispatch, SetStateAction, useState } from 'react';
import { Grid, TextField, Button, Typography } from '@mui/material';
import { AlertProps } from '@mui/material/Alert';
import Uploader from '../../Uploader';
import { MediaRef } from '../../../pages/Media';
import { PreferencesSchema } from '@jakubkanna/labguy-front-schema';

interface VideoUploaderProps {
  overrideMedia: (response: MediaRef[]) => void;
  token: string;
  preferences: PreferencesSchema;
  setLoading: Dispatch<SetStateAction<boolean>>;
}

const VideoUploader = ({
  overrideMedia,
  token,
  preferences
}: VideoUploaderProps) => {
  const [selectedPlatform, setSelectedPlatform] = useState<string | null>(null);
  const [value, setValue] = useState<string>('');
  const [uploading, setUploading] = useState<boolean>(false);
  const [alert, setAlert] = useState<Pick<
    AlertProps,
    'children' | 'severity'
  > | null>(null);

  const handlePlatformSelect = (platform: string) => {
    setSelectedPlatform(platform);
    setValue(''); // Clear the input value when switching platforms
  };

  const handleSubmit = async () => {
    try {
      setUploading(true);

      if (!selectedPlatform) {
        setAlert({
          children: 'Please select a platform.',
          severity: 'warning'
        });
        return;
      }

      const platformKey = `${selectedPlatform.toLowerCase()}_url`;
      const urlObject = {
        [platformKey]: value
      };

      setAlert({
        children: 'Uploading video...',
        severity: 'info'
      });

      // Await the result
      const response = await fetch(
        `${import.meta.env.VITE_SERVER_API_URL}/videos/create`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `${token}`
          },
          body: urlObject && JSON.stringify(urlObject)
        }
      );
      const result = await response.json();

      if (!response.ok) {
        // Handle case where response is empty or not successful
        setAlert({
          children: 'Failed to upload video.',
          severity: 'error'
        });
      } else {
        // Handle successful upload
        setAlert({
          children: 'Video uploaded successfully.',
          severity: 'success'
        });
        overrideMedia([result]); // Update media list
      }
    } catch (error: any) {
      // Catch any error that occurs during the API request
      setAlert({
        children: `Failed to upload video: ${error.message}`,
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
        label={'Video'}
      >
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <Typography variant="body2" gutterBottom>
              Select Platform
            </Typography>
            <Grid container spacing={1}>
              <Grid item>
                <Button
                  variant={
                    selectedPlatform === 'YouTube' ? 'contained' : 'outlined'
                  }
                  onClick={() => handlePlatformSelect('YouTube')}
                  disabled={!preferences.enable_yt as boolean}
                >
                  YouTube
                </Button>
              </Grid>
              <Grid item>
                <Button
                  variant={
                    selectedPlatform === 'Vimeo' ? 'contained' : 'outlined'
                  }
                  onClick={() => handlePlatformSelect('Vimeo')}
                  disabled={!preferences.enable_vimeo as boolean}
                >
                  Vimeo
                </Button>
              </Grid>
              <Grid item>
                <Button
                  variant={
                    selectedPlatform === 'SoundCloud' ? 'contained' : 'outlined'
                  }
                  disabled={!preferences.enable_sc as boolean}
                  onClick={() => handlePlatformSelect('SoundCloud')}
                >
                  SoundCloud
                </Button>
              </Grid>
            </Grid>
          </Grid>
          <Grid item xs={12}>
            {selectedPlatform && (
              <TextField
                label={`${selectedPlatform} URL`}
                fullWidth
                value={value}
                onChange={(e) => setValue(e.target.value)}
                placeholder={`Enter ${selectedPlatform} URL`}
              />
            )}
          </Grid>
        </Grid>
      </Uploader>
    </>
  );
};

export default VideoUploader;
