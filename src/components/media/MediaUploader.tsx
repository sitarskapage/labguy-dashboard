import { Dispatch, SetStateAction, useContext, useState } from "react";
import { Button, Modal, Container, Grid } from "@mui/material";
import { GeneralContext } from "../../contexts/GeneralContext";
import { MediaInstance } from "../../pages/Media";
import ImageUploader from "./images/ImagesUploader";
import VideoUploader from "./videos/VideoUploader";

interface MediaUploaderProps {
  setMedia: Dispatch<SetStateAction<MediaInstance[]>>;
}

const MediaUploader = ({ setMedia }: MediaUploaderProps) => {
  const [isModalOpen, setModalOpen] = useState<"image" | "video" | null>(null);
  const { token, settings, setLoading } = useContext(GeneralContext);

  if (!token || !settings) return;

  const handleOpenModal = (modalType: "image" | "video") => {
    setModalOpen(modalType);
  };

  const handleCloseModal = () => {
    setModalOpen(null);
  };

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

  function overrideMedia(response: MediaInstance[]) {
    return setMedia((prevList) => {
      // Ensure response is an array
      const newMedia = Array.isArray(response) ? response : [response];

      // Override duplicates
      const uniqueMedia = newMedia.filter((newMediaItem) => {
        return !prevList.some((media) => {
          return media.etag === newMediaItem.etag;
        });
      });

      // Return list without duplicates
      return [...uniqueMedia, ...prevList];
    });
  }

  return (
    <>
      <Button onClick={() => handleOpenModal("image")}>
        Upload New Images
      </Button>
      <Button onClick={() => handleOpenModal("video")}>
        Upload New Videos
      </Button>

      <Modal open={isModalOpen === "image"} onClose={handleCloseModal}>
        <Container sx={modalStyle}>
          <ImageUploader
            token={token}
            overrideMedia={overrideMedia}
            setLoading={setLoading}
          />
        </Container>
      </Modal>

      <Modal open={isModalOpen === "video"} onClose={handleCloseModal}>
        <Container sx={modalStyle}>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <VideoUploader
                token={token}
                overrideMedia={overrideMedia}
                settings={settings}
                setLoading={setLoading}
              />
            </Grid>
          </Grid>
        </Container>
      </Modal>
    </>
  );
};

export default MediaUploader;
