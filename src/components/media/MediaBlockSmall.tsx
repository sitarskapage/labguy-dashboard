import React, { useState, useEffect } from 'react';
import { MediaRef } from '../../pages/Media';
import {
  Button,
  Grid2,
  IconButton,
  Paper,
  TextField,
  Typography
} from '@mui/material';
import MediaSelectModal from './MediaSelectModal';
import { MediaBlockProps } from './MediaBlock';
import MediaUploader from './MediaUploader';
import { isImage, isVideo } from '../../utils/helpers';
import DeleteIcon from '@mui/icons-material/Delete';

interface MediaBlockSmallProps extends MediaBlockProps {
  description?: string;
}

const MediaBlockSmall: React.FC<MediaBlockSmallProps> = ({
  value,
  onChange,
  label,
  variant,
  description
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
      <Grid2 container spacing={2}>
        <Grid2 size={12} container alignItems={'center'}>
          <Grid2 size={3}>
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
          </Grid2>
          <Grid2 size={1}>
            <IconButton
              color="error"
              size="small"
              onClick={onDelete}
              aria-label="delete"
            >
              <DeleteIcon fontSize="small" />
            </IconButton>
          </Grid2>
          <Grid2 size={8} container alignItems="center" justifyContent="center">
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
          </Grid2>
        </Grid2>
        {description && (
          <Grid2 size={12}>
            <Typography variant="caption" style={{ opacity: 0.5 }}>
              {description}
            </Typography>
          </Grid2>
        )}
      </Grid2>
    </Paper>
  );
};

export default MediaBlockSmall;
