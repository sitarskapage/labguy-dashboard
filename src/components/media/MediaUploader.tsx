import { Dispatch, SetStateAction, useContext, useState } from "react";
import { Button, Modal, Container, Grid } from "@mui/material";
import { GeneralContext } from "../../contexts/GeneralContext";
import { MediaInstance } from "../../pages/Media";
import ImageUploader from "./images/ImagesUploader";
import VideoUploader from "./videos/VideoUploader";

interface MediaUploaderProps {
  setMedia: Dispatch<SetStateAction<MediaInstance[]>>;
  imagesOnly?: boolean;
}

const MediaUploader = ({ setMedia, imagesOnly }: MediaUploaderProps) => {
  const [isModalOpen, setModalOpen] = useState<"image" | "video" | null>(null);
  const { token, setLoading } = useContext(GeneralContext);

  if (!token) return;

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
      {!imagesOnly && (
        <Button onClick={() => handleOpenModal("video")}>
          Upload New Video
        </Button>
      )}

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
