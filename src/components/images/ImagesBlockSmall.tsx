import React, { useState, useEffect } from "react";
import ImagesUploader from "./ImagesUploader";
import { ImageInstance } from "../../pages/Images";
import { Button, Grid, TextField } from "@mui/material";
import MediaSelectModal from "./MediaSelectModal";

interface ImageSelectionPaperProps {
  value: ImageInstance[] | undefined;
  onChange: (value: ImageInstance[]) => void;
  label: string;
}

const ImagesBlockSmall: React.FC<ImageSelectionPaperProps> = ({
  value,
  onChange,
  label,
}) => {
  const [selectedImgList, setSelectedImgList] = useState<ImageInstance[] | []>(
    value ? value : []
  );
  const [selectedImageNames, setSelectedImageNames] = useState<string>("");

  //on change
  useEffect(() => {
    selectedImgList && onChange(selectedImgList);
    setSelectedImageNames(
      selectedImgList.map((image) => image.original_filename).join(", ")
    );
  }, [onChange, selectedImgList]);
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
          value={selectedImageNames}
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
          selected={selectedImgList}
          setSelectedImgList={setSelectedImgList}
          single
        />
      </Grid>

      {/* ImagesUploader */}
      <Grid item xs={9}>
        <ImagesUploader setImageList={setSelectedImgList} />
      </Grid>
    </Grid>
  );
};

export default ImagesBlockSmall;
