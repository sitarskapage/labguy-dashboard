import React, { useState, useEffect } from 'react';
import {
  Box,
  Button,
  Divider,
  Paper,
  TextField,
  Typography
} from '@mui/material';
import MediaSelectableList from './MediaSelectableList';
import { MediaRef } from '../../pages/Media';
import MediaSelectModal from './MediaSelectModal';
import MediaUploader, { MediaType } from './MediaUploader';

export interface MediaBlockProps {
  value: MediaRef[] | undefined;
  onChange: (value: MediaRef[] | undefined) => void;
  variant: MediaType;
  title?: string;
  noEdit?: boolean;
}

const MediaBlock: React.FC<MediaBlockProps> = ({
  value,
  onChange,
  variant,
  title,
  noEdit
}) => {
  const [selected, setSelected] = useState<MediaRef[] | []>(value ? value : []);

  //on change
  useEffect(() => {
    selected && onChange(selected);
  }, [onChange, selected]);

  // modal
  const [openModal, setOpenModal] = useState(false);

  const handleOpenModal = () => {
    setOpenModal(true);
  };

  const handleCloseModal = () => {
    setOpenModal(false);
  };

  return (
    <>
      <Typography variant="h5">{title || 'Media'}</Typography>
      <Divider sx={{ marginBottom: '2rem' }} />
      <Paper id="media-block" elevation={2} sx={{ padding: 3 }}>
        <Box p={3}>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <Box>
              <TextField
                id="media-input"
                label="Selected Media"
                variant="outlined"
                fullWidth
                sx={{
                  '.MuiOutlinedInput-root': {
                    padding: '1rem',
                    input: {
                      display: 'none' // Hides the text input field
                    },
                    cursor: 'pointer'
                  }
                }}
                helperText={'Click image to select/unselect'}
                InputProps={{
                  startAdornment: (
                    <MediaSelectableList
                      mediaList={selected}
                      selected={selected}
                      setSelected={setSelected}
                      noEdit={noEdit}
                    />
                  )
                }}
              />{' '}
            </Box>
            <Box>
              <MediaUploader setMedia={setSelected} variant={variant} />
              <>
                <Button onClick={handleOpenModal} sx={{ width: 'content' }}>
                  Select from Media Library
                </Button>

                <MediaSelectModal
                  open={openModal}
                  handleClose={handleCloseModal}
                  selected={selected}
                  setSelected={setSelected}
                  variant={variant}
                  noEdit={noEdit}
                />
              </>
            </Box>
          </Box>
        </Box>
      </Paper>
    </>
  );
};

export default MediaBlock;
