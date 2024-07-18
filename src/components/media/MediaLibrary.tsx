import React, {
  Dispatch,
  SetStateAction,
  useContext,
  useEffect,
  useState,
} from "react";
import { Box, Button, Grid, Typography } from "@mui/material";
import MediaSelectableList from "./MediaSelectableList";
import { GeneralContext } from "../../contexts/GeneralContext";
import { MediaInstance } from "../../pages/Media";
import { ImageInstance } from "./images/imageSchema";
interface ImageLibraryProps {
  media: MediaInstance[];
  setMedia: Dispatch<SetStateAction<MediaInstance[]>>;
}

interface ToolbarProps {
  visible: boolean;
  handleDelete: () => void;
  handleCancel: (media: MediaInstance[]) => void;
}

const Toolbar: React.FC<ToolbarProps> = ({
  visible = false,
  handleDelete,
  handleCancel,
}) => {
  return (
    visible && (
      <Grid>
        <Button onClick={() => handleDelete()}>Delete Selected</Button>
        <Button onClick={() => handleCancel([])}>Cancel</Button>
      </Grid>
    )
  );
};

const MediaLibrary: React.FC<ImageLibraryProps> = ({ media, setMedia }) => {
  const [selected, setSelected] = useState<MediaInstance[]>([]);
  const { token, setSnackbar } = useContext(GeneralContext);

  useEffect(() => {
    fetch("http://localhost:3000/api/media", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `${token}`,
      },
    })
      .then((response) => {
        if (!response.ok) throw new Error("Failed to fetch images");
        return response.json();
      })
      .then((data) => setMedia(data))
      .catch((error) => console.error("Failed to fetch images", error));
  }, [setMedia, token]);

  const deleteSelectedImages = async () => {
    const selectedImages: ImageInstance[] = selected.filter(
      (item): item is ImageInstance => item.type === "image"
    );

    setSnackbar({
      children: "Please wait, deleting images...",
      severity: "info",
    });

    try {
      const response = await fetch("http://localhost:3000/api/images/destroy", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `${token}`,
        },
        body: JSON.stringify(selectedImages),
      });

      if (!response.ok) throw new Error("Failed to delete images from server.");

      setMedia((prevImageList) =>
        prevImageList.filter(
          (img) =>
            !selectedImages.some(
              (selImg) =>
                img.type === "image" && selImg.public_id === img.public_id
            )
        )
      );

      setSelected([]);
      setSnackbar({
        children: "Images successfuly deleted",
        severity: "success",
      });
      return;
    } catch (error) {
      if (error instanceof Error) {
        console.error(error.message);
        setSnackbar({
          children: error.message,
          severity: "error",
        });
      }
    }
  };

  return (
    <Box>
      <Box>
        <Toolbar
          visible={!!selected.length}
          handleDelete={deleteSelectedImages}
          handleCancel={setSelected}
        />
      </Box>
      <Box sx={{ height: "100%", overflowY: "auto", padding: 2 }}>
        <Grid item>
          {media.length > 0 ? (
            <MediaSelectableList
              mediaList={media}
              setMediaList={setSelected}
              selected={selected}
              variant="advanced"
            />
          ) : (
            <Typography variant="body1">No media found.</Typography>
          )}
        </Grid>
      </Box>
    </Box>
  );
};

export default MediaLibrary;
