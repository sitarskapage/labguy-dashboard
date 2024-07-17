import React, { useState, useEffect } from "react";
import ImagesUploader from "./images/ImagesUploader";
import { MediaInstance } from "../../pages/Media";
import { Button, Grid, TextField } from "@mui/material";
import MediaSelectModal from "./MediaSelectModal";
import { MediaBlockProps } from "./MediaBlock";

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
      <Grid item xs={3}>
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
        <Button
          onClick={handleOpenModal}
          sx={{ marginTop: "1rem", width: "content" }}>
          Select from Media Library
        </Button>
        <MediaSelectModal
          open={openModal}
          handleClose={handleCloseModal}
          selected={selected}
          setSelected={setSelected}
        />
      </Grid>

      {/* ImagesUploader */}
      <Grid item xs={9}>
        <ImagesUploader setMedia={setSelected} />
      </Grid>
    </Grid>
  );
};

export default MediaBlockSmall;
