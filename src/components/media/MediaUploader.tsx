import { Dispatch, SetStateAction, useState } from "react";
import { Button, Modal, Typography, Container, Grid } from "@mui/material";
import { MediaInstance } from "../../pages/Media";
import ImagesUploader from "./images/ImagesUploader";
import VideoUploader from "./videos/VideoUploader";

interface MediaUploaderProps {
  setMedia: Dispatch<SetStateAction<MediaInstance[]>>;
}

const MediaUploader = ({ setMedia }: MediaUploaderProps) => {
  const [isImageModalOpen, setImageModalOpen] = useState(false);
  const [isVideoModalOpen, setVideoModalOpen] = useState(false);

  const handleOpenImageModal = () => setImageModalOpen(true);
  const handleCloseImageModal = () => setImageModalOpen(false);

  const handleOpenVideoModal = () => setVideoModalOpen(true);
  const handleCloseVideoModal = () => setVideoModalOpen(false);

  const modalStyle = {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",

    bgcolor: "background.paper",
    border: "2px solid #000",
    boxShadow: 24,
    p: 4,
  };
  return (
    <>
      <Button onClick={handleOpenImageModal}>Upload New Images</Button>
      <Button onClick={handleOpenVideoModal}>Upload New Videos</Button>

      <Modal open={isImageModalOpen} onClose={handleCloseImageModal}>
        <Container sx={modalStyle}>
          <Typography variant="h6" component="h2">
            Upload Images
          </Typography>
          <ImagesUploader setMedia={setMedia} />
        </Container>
      </Modal>

      <Modal open={isVideoModalOpen} onClose={handleCloseVideoModal}>
        <Container sx={modalStyle}>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <Typography variant="h6" component="h2">
                Upload Videos
              </Typography>
            </Grid>{" "}
            <Grid item xs={12}>
              <VideoUploader setMedia={setMedia} />
            </Grid>
          </Grid>
        </Container>
      </Modal>
    </>
  );
};

export default MediaUploader;
