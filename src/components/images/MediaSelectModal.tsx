import { Modal, Box, Grid, Typography, Button, useTheme } from "@mui/material";
import { useState, useMemo } from "react";
import { ImageInstance } from "../../pages/Images";
import ImagesSelectableList from "./ImagesSelectableList";

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
export default MediaSelectModal;
