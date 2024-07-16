import React, { useState, useEffect } from "react";
import {
  Box,
  Button,
  Divider,
  Paper,
  TextField,
  Typography,
} from "@mui/material";
import ImagesSelectableList from "./ImagesSelectableList";
import ImagesUploader from "./ImagesUploader";
import { ImageInstance } from "../../pages/Images";
import MediaSelectModal from "./MediaSelectModal";

interface ImageSelectionPaperProps {
  value: ImageInstance[] | undefined;
  onChange: (value: ImageInstance[]) => void;
}

const ImagesBlock: React.FC<ImageSelectionPaperProps> = ({
  value,
  onChange,
}) => {
  const [selectedImgList, setSelectedImgList] = useState<ImageInstance[] | []>(
    value ? value : []
  );

  //on change
  useEffect(() => {
    selectedImgList && onChange(selectedImgList);
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
    <>
      <Typography variant="h5">Images</Typography>
      <Divider sx={{ marginBottom: "2rem" }} />
      <Paper id="images-block" elevation={2} sx={{ padding: 3 }}>
        <Box p={3}>
          <Box sx={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
            <TextField
              id="images-input"
              label="Selected Images"
              variant="outlined"
              fullWidth
              sx={{
                ".MuiOutlinedInput-root": {
                  padding: "1rem",
                  input: {
                    display: "none", // Hides the text input field
                  },
                  cursor: "pointer",
                },
              }}
              InputProps={{
                startAdornment: (
                  <ImagesSelectableList
                    imageList={selectedImgList}
                    selected={selectedImgList}
                    setImageList={setSelectedImgList}
                  />
                ),
              }}
            />
            <ImagesUploader setImageList={setSelectedImgList} />
            <>
              <Button onClick={handleOpenModal} sx={{ width: "content" }}>
                Select from Media Library
              </Button>

              <MediaSelectModal
                open={openModal}
                handleClose={handleCloseModal}
                selected={selectedImgList}
                setSelectedImgList={setSelectedImgList}
              />
            </>
          </Box>
        </Box>
      </Paper>
      <Typography variant="caption" color="textSecondary">
        <Typography variant="subtitle2">
          Click on the image to select/unselect, drop file on the dropzone to
          upload.
        </Typography>
      </Typography>
    </>
  );
};

export default ImagesBlock;
