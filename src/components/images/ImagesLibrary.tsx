import React, {
  Dispatch,
  SetStateAction,
  useContext,
  useEffect,
  useState,
} from "react";
import { ImageInstance } from "../../pages/Images";
import { AuthContext } from "../../contexts/AuthContext";
import {
  Alert,
  AlertProps,
  Box,
  Button,
  Grid,
  Snackbar,
  Typography,
} from "@mui/material";
import ImagesSelectableList from "./ImagesSelectableList";
interface ImageLibraryProps {
  images: ImageInstance[];
  setImages: Dispatch<SetStateAction<ImageInstance[]>>;
}

interface ToolbarProps {
  visible: boolean;
  handleDelete: () => void;
  handleCancel: (images: ImageInstance[]) => void;
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

const ImagesLibrary: React.FC<ImageLibraryProps> = ({ images, setImages }) => {
  const { token } = useContext(AuthContext);
  const [selected, setSelected] = useState<ImageInstance[]>([]);
  const [snackbar, setSnackbar] = React.useState<Pick<
    AlertProps,
    "children" | "severity"
  > | null>(null);

  useEffect(() => {
    fetch("http://localhost:3000/api/images", {
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
      .then((data) => setImages(data))
      .catch((error) => console.error("Failed to fetch images", error));
  }, [setImages, token]);

  const deleteSelectedImages = async () => {
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
        body: JSON.stringify(selected),
      });

      if (!response.ok) throw new Error("Failed to delete images from server.");

      setImages((prevImageList) =>
        prevImageList.filter(
          (img) =>
            !selected.some((selImg) => selImg.public_id === img.public_id)
        )
      );

      setSelected([]);
      setSnackbar({
        children: "Images successfully deleted",
        severity: "success",
      });
      return;
    } catch (error) {
      if (error instanceof Error) return console.error(error.message);
    }
  };

  const handleCloseSnackbar = () => setSnackbar(null);

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
          {images.length > 0 ? (
            <ImagesSelectableList
              imageList={images}
              selected={selected}
              setImageList={setSelected}
              variant="advanced"
            />
          ) : (
            <Typography variant="body1">No images found.</Typography>
          )}
        </Grid>
      </Box>
      {!!snackbar && (
        <Snackbar
          open
          anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
          onClose={handleCloseSnackbar}
          autoHideDuration={6000}>
          <Alert {...snackbar} onClose={handleCloseSnackbar} />
        </Snackbar>
      )}
    </Box>
  );
};

export default ImagesLibrary;
