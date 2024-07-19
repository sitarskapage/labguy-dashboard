import React, { useState, useEffect } from "react";
import { MediaInstance } from "../../pages/Media";
import { Button, Grid, TextField } from "@mui/material";
import MediaSelectModal from "./MediaSelectModal";
import { MediaBlockProps } from "./MediaBlock";
import MediaUploader from "./MediaUploader";

interface MediaBlockSmallProps extends MediaBlockProps {
  label: string;
}

const MediaBlockSmall: React.FC<MediaBlockSmallProps> = ({
  value,
  onChange,
  label,
}) => {
  const [selected, setSelected] = useState<MediaInstance[] | []>(
    value ? value : []
  );
  const [selectedNames, setSelectedNames] = useState<string>("");

  //on change
  useEffect(() => {
    selected && onChange(selected);
    setSelectedNames(
      selected.map((image) => image.original_filename).join(", ")
    );
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
    <Grid container spacing={2} alignItems="center">
      {/* TextField */}
      <Grid item xs={6}>
        <TextField
          label={label}
          value={selectedNames}
          InputProps={{
            readOnly: true,
          }}
          variant="outlined"
          fullWidth
          size="small"
        />
      </Grid>
      <Grid item xs={6} container alignItems="center" justifyContent="center">
        <Button onClick={handleOpenModal}>Select from Media Library</Button>
        <MediaUploader setMedia={setSelected} imagesOnly />
        <MediaSelectModal
          open={openModal}
          handleClose={handleCloseModal}
          selected={selected}
          setSelected={setSelected}
          single
        />
      </Grid>
    </Grid>
  );
};

export default MediaBlockSmall;
