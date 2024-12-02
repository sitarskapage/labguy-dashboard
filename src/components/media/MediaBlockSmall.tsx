import React, { useState, useEffect } from 'react';
import { MediaRef } from '../../pages/Media';
import { Button, Grid, IconButton, Paper, TextField } from '@mui/material';
import MediaSelectModal from './MediaSelectModal';
import { MediaBlockProps } from './MediaBlock';
import MediaUploader from './MediaUploader';
import { isImage, isVideo } from '../../utils/helpers';
import DeleteIcon from '@mui/icons-material/Delete';

interface MediaBlockSmallProps extends MediaBlockProps {
  label: string;
}

const MediaBlockSmall: React.FC<MediaBlockSmallProps> = ({
  value,
  onChange,
  label,
  variant
}) => {
  const [selected, setSelected] = useState<MediaRef[] | []>(value || []);
  const [selectedNames, setSelectedNames] = useState<string>('');

  //on change
  useEffect(() => {
    if (!selected[0]) {
      setSelectedNames('');
    } else {
      setSelectedNames(
        selected
          .map((media) => {
            if (media) {
              // Use mediaType to determine if it's an image or another media type
              if (isImage(media)) {
                return media.filename || 'Unnamed Image';
              } else if (isVideo(media)) {
                return media.title || 'Untitled Video';
              } else {
                return media.title || 'Untitled Media';
              }
            }
            return '';
          })
          .join(', ')
      );
    }
    onChange(selected);
  }, [selected, onChange]);

  // modal
  const [openModal, setOpenModal] = useState(false);

  const handleOpenModal = () => {
    setOpenModal(true);
  };

  const handleCloseModal = () => {
    setOpenModal(false);
  };

  function onDelete(): void {
    setSelected([]);
  }

  return (
    <Paper sx={{ width: '100%', p: 2, mt: 2 }}>
      <Grid container spacing={2} alignItems="center">
        <Grid item xs={3}>
          <TextField
            label={label}
            value={selectedNames}
            variant="outlined"
            fullWidth
            size="small"
            InputProps={{
              readOnly: true
            }}
          />
        </Grid>
        <Grid item xs={1}>
          <IconButton
            color="error"
            size="small"
            onClick={onDelete}
            aria-label="delete"
          >
            <DeleteIcon fontSize="small" />
          </IconButton>
        </Grid>

        <Grid item xs={8} container alignItems="center" justifyContent="center">
          <Button onClick={handleOpenModal}>Select from Media Library</Button>
          <MediaUploader setMedia={setSelected} variant={variant} />
          <MediaSelectModal
            open={openModal}
            handleClose={handleCloseModal}
            selected={selected}
            setSelected={setSelected}
            variant={variant}
            single
          />
        </Grid>
      </Grid>
    </Paper>
  );
};

export default MediaBlockSmall;
