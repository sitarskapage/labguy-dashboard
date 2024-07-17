import { Modal, Box, Grid, Typography, Button, useTheme } from "@mui/material";
import { useState, useEffect } from "react";
import { MediaInstance } from "../../pages/Media";
import MediaSelectableList from "./MediaSelectableList";

interface ModalProps {
  open: boolean;
  handleClose: () => void;
  selected: MediaInstance[];
  setSelected: React.Dispatch<React.SetStateAction<MediaInstance[] | []>>;
}

const MediaSelectModal: React.FC<ModalProps> = ({
  open,
  handleClose,
  selected,
  setSelected,
}) => {
  const theme = useTheme();
  const [images, setImages] = useState<MediaInstance[]>([]);

  const fetchAllImgs = async () => {
    try {
      const response = await fetch(`http://localhost:3000/api/images`);
      if (!response.ok) {
        throw new Error("Failed to fetch images");
      }
      const data: MediaInstance[] = await response.json();
      if (data.length) {
        setImages(data);
      }
    } catch (error) {
      console.error("Failed to fetch event images", error);
    }
  };

  useEffect(() => {
    if (open) {
      fetchAllImgs();
    }
  }, [open]);

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
                <MediaSelectableList
                  mediaList={images}
                  selected={selected}
                  setMediaList={setSelected}
                  variant="advanced"
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
