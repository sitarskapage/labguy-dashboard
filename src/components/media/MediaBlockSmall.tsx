import React, { useState, useEffect } from 'react';
import { MediaRef } from '../../pages/Media';
import { Button, Grid, Paper, TextField } from '@mui/material';
import MediaSelectModal from './MediaSelectModal';
import { MediaBlockProps } from './MediaBlock';
import MediaUploader, { MediaType } from './MediaUploader';

interface MediaBlockSmallProps extends MediaBlockProps {
  label: string;
  variant?: MediaType;
}

const MediaBlockSmall: React.FC<MediaBlockSmallProps> = ({
  value,
  onChange,
  label,
  variant
}) => {
  const [selected, setSelected] = useState<MediaRef[] | []>(value ? value : []);
  const [selectedNames, setSelectedNames] = useState<string>('');

  //on change
  useEffect(() => {
    if (!selected[0]) return;
    onChange(selected);
    setSelectedNames(
      selected
        .map((media) => {
          return variant == 'IMAGE' ? media.filename : media.title;
        })
        .join(', ')
    );
  }, [onChange, selected, variant]);

  // modal
  const [openModal, setOpenModal] = useState(false);

  const handleOpenModal = () => {
    setOpenModal(true);
  };

  const handleCloseModal = () => {
    setOpenModal(false);
  };
  return (
    <Paper sx={{ width: '100%', p: 2, mt: 2 }}>
      <Grid container spacing={2} alignItems="center">
        {/* TextField */}
        <Grid item xs={4}>
          <TextField
            label={label}
            value={selectedNames}
            InputProps={{
              readOnly: true
            }}
            variant="outlined"
            fullWidth
            size="small"
          />
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
