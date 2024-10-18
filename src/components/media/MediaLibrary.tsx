import React, { Dispatch, SetStateAction, useContext, useState } from 'react';
import { Box, Button, Grid2, Typography } from '@mui/material';
import { GeneralContext } from '../../contexts/GeneralContext';
import { MediaRef } from '../../pages/Media';
import MediaSelectableList from './MediaSelectableList';
import { isImage, isVideo } from '../../utils/helpers';

interface ImageLibraryProps {
  media: MediaRef[];
  setMedia: Dispatch<SetStateAction<MediaRef[]>>;
}

interface ToolbarProps {
  visible: boolean;
  handleDelete: () => void;
  handleCancel: (media: MediaRef[]) => void;
}

const Toolbar: React.FC<ToolbarProps> = ({
  visible = false,
  handleDelete,
  handleCancel
}) => {
  return (
    visible && (
      <Grid2>
        <Button onClick={() => handleDelete()}>Delete Selected</Button>
        <Button onClick={() => handleCancel([])}>Cancel</Button>
      </Grid2>
    )
  );
};

const MediaLibrary: React.FC<ImageLibraryProps> = ({ media, setMedia }) => {
  const [selected, setSelected] = useState<MediaRef[]>([]);
  const { token, setSnackbar } = useContext(GeneralContext);

  const deleteItems = async (
    endpoint: string,
    items: MediaRef[],
    token: string,
    itemType: string
  ) => {
    if (items.length > 0) {
      try {
        const response = await fetch(endpoint, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `${token}`
          },
          body: JSON.stringify(items)
        });
        if (!response.ok) throw new Error(`Failed to delete ${itemType}.`);

        return await response.json();
      } catch (error) {
        if (error instanceof Error) {
          console.error(error.message);
          throw error;
        }
      }
    }
  };

  const deleteSelectedMedia = async () => {
    if (!token) return 'No auth token';

    const selectedImages: MediaRef[] = selected.filter((item) => isImage(item));
    const selectedVideos: MediaRef[] = selected.filter((item) => isVideo(item));

    setSnackbar({
      children: 'Please wait, deleting selected media...',
      severity: 'info'
    });

    try {
      // Delete images
      await deleteItems(
        `${import.meta.env.VITE_SERVER_API_URL}/images/destroy`,
        selectedImages,
        token,
        'images'
      );

      // Delete videos
      await deleteItems(
        `${import.meta.env.VITE_SERVER_API_URL}/videos/delete`,
        selectedVideos,
        token,
        'videos'
      );

      // Update media list
      setMedia((prevMedia) =>
        prevMedia.filter(
          (mediaItem) =>
            !selected.some(
              (item) => mediaItem && item && mediaItem.etag === item.etag
            )
        )
      );

      setSelected([]);
      setSnackbar({
        children: 'Selected media successfully deleted',
        severity: 'success'
      });
    } catch (error) {
      if (error instanceof Error) {
        setSnackbar({
          children: error.message,
          severity: 'error'
        });
      }
    }
  };

  return (
    <Box>
      <Box>
        <Toolbar
          visible={!!selected.length}
          handleDelete={deleteSelectedMedia}
          handleCancel={setSelected}
        />
      </Box>
      <Box sx={{ height: '100%', overflowY: 'auto' }}>
        {media.length > 0 ? (
          <MediaSelectableList
            mediaList={media}
            setSelected={setSelected}
            setMediaList={setMedia}
            selected={selected}
            variant="advanced"
          />
        ) : (
          <Typography variant="body1">No media found.</Typography>
        )}
      </Box>
    </Box>
  );
};

export default MediaLibrary;
