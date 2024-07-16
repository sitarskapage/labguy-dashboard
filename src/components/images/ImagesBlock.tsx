import React, { useState, useEffect, useMemo } from "react";
import {
  Box,
  Button,
  Divider,
  Grid,
  Modal,
  Paper,
  TextField,
  Typography,
  useTheme,
} from "@mui/material";
import ImagesSelectableList from "./ImagesSelectableList";
import ImagesUploader from "./ImagesUploader";
import { ImageInstance } from "../../pages/Images";

interface ImageSelectionPaperProps {
  value: ImageInstance[] | undefined;
  onChange: (value: ImageInstance[]) => void;
}

interface ModalProps {
  open: boolean;
  handleClose: () => void;
  selected: ImageInstance[];
  setSelectedImgList: React.Dispatch<
    React.SetStateAction<ImageInstance[] | []>
  >;
}

const MediaSelectModal: React.FC<ModalProps> = ({
  open,
  handleClose,
  selected,
  setSelectedImgList,
}) => {
  const theme = useTheme();
  const [images, setImages] = useState<ImageInstance[]>([]);

  const fetchAllImgs = async () => {
    try {
      const response = await fetch(`http://localhost:3000/api/images`);
      if (!response.ok) {
        throw new Error("Failed to fetch images");
      }
      const data: ImageInstance[] = await response.json();
      if (data.length) {
        setImages(data);
      }
    } catch (error) {
      console.error("Failed to fetch event images", error);
    }
  };

  useMemo(() => {
    fetchAllImgs();
  }, []);

  return (
    <Modal open={open} onClose={handleClose} className="library-modal">
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          height: "100%",
        }}>
        <Box
          style={{
            backgroundColor: `${theme.palette.background.paper}`,
            boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.1)",
            padding: "16px",
            height: "100%",
            width: "100%",
            minWidth: "400px",
            display: "flex",
            flexDirection: "column",
          }}>
          {/* Modal Header */}
          <Grid
            container
            sx={{
              marginBottom: "16px",
              justifyContent: "space-between",
              alignItems: "center",
            }}>
            <Grid item>
              <Typography variant="h5">Media Selection Menu</Typography>
            </Grid>
            <Grid item>
              <Button color="primary" onClick={handleClose}>
                Close
              </Button>
            </Grid>
          </Grid>

          {/* Modal Body */}
          <Box sx={{ height: "100%", overflowY: "auto", padding: 2 }}>
            <Grid item>
              {images.length > 0 ? (
                <ImagesSelectableList
                  imageList={images}
                  selected={selected}
                  setImageList={setSelectedImgList}
                />
              ) : (
                <Typography variant="body1">No images</Typography>
              )}
            </Grid>
          </Box>

          {/* Modal Footer (Optional) */}
          <Grid container sx={{}}>
            <Grid item></Grid>
          </Grid>
        </Box>
      </Box>
    </Modal>
  );
};

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
              <Button
                variant="contained"
                color="secondary"
                onClick={handleOpenModal}
                sx={{ width: "content" }}>
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
