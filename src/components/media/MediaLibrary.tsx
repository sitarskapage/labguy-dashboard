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
import { isImage, isVideo } from "../../utils/getters";

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
    fetch(`${import.meta.env.VITE_SERVER_API_URL}media`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `${token}`,
      },
    })
      .then((response) => {
        if (!response.ok) throw new Error("Failed to fetch media");
        return response.json();
      })
      .then((data) => setMedia(data))
      .catch((error) => console.error("Failed to fetch media", error));
  }, [setMedia, token]);

  const deleteItems = async (
    endpoint: string,
    items: MediaInstance[],
    token: string,
    itemType: string
  ) => {
    if (items.length > 0) {
      try {
        const response = await fetch(endpoint, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `${token}`,
          },
          body: JSON.stringify(items),
        });
        if (!response.ok) throw new Error(`Failed to delete ${itemType}.`);

        return await response.json();
      } catch (error) {
        if (error instanceof Error) {
          console.error(error.message);
          throw error;
        }
      }
    }
  };

  const deleteSelectedMedia = async () => {
    if (!token) return "No auth token";

    const selectedImages: MediaInstance[] = selected.filter((item) =>
      isImage(item)
    );
    const selectedVideos: MediaInstance[] = selected.filter((item) =>
      isVideo(item)
    );

    setSnackbar({
      children: "Please wait, deleting selected media...",
      severity: "info",
    });

    try {
      // Delete images
      await deleteItems(
        `${import.meta.env.VITE_SERVER_API_URL}images/destroy`,
        selectedImages,
        token,
        "images"
      );

      // Delete videos
      await deleteItems(
        `${import.meta.env.VITE_SERVER_API_URL}videos/delete`,
        selectedVideos,
        token,
        "videos"
      );

      // Update media list
      setMedia((prevMedia) =>
        prevMedia.filter(
          (mediaItem) => !selected.some((item) => mediaItem.etag === item.etag)
        )
      );

      setSelected([]);
      setSnackbar({
        children: "Selected media successfully deleted",
        severity: "success",
      });
    } catch (error) {
      if (error instanceof Error) {
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
          handleDelete={deleteSelectedMedia}
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
