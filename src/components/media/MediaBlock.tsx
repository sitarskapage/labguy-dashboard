import React, { useState, useEffect } from 'react';
import { Box, Button, Divider, Paper, Typography } from '@mui/material';
import { MediaRef } from '../../pages/Media';
import MediaSelectModal from './MediaSelectModal';
import MediaUploader, { MediaType } from './MediaUploader';
import DndMediaList from './DndMediaList';

export interface MediaBlockProps {
  value?: MediaRef[] | null;
  onChange: (value: MediaRef[] | undefined) => void;
  variant?: MediaType;
  label?: string;
  noEdit?: boolean;
}

const MediaBlock: React.FC<MediaBlockProps> = ({
  value,
  onChange,
  variant,
  label,
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
      {label && (
        <>
          <Typography variant="h5">{label}</Typography>
          <Divider sx={{ marginBottom: '2rem' }} />
        </>
      )}
      <Paper id="media-block" sx={{ padding: 3 }} variant="outlined">
        <Box p={3}>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <Box>
              <DndMediaList
                mediaList={selected}
                selected={selected}
                setSelected={setSelected}
              />
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
