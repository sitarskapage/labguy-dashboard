import React, { useContext, useState } from "react";
import {
  Grid,
  Box,
  Typography,
  Button,
  useTheme,
  Link,
  Container,
  Tooltip,
  TextField,
  Alert,
  Snackbar,
  AlertProps,
} from "@mui/material";
import useImageUrl from "../../utils/useImageURL";
import { v4 as uuid } from "uuid";
import { ImageInstance } from "../../pages/Images";
import { useUpdateData } from "../../utils/useRequest";
import { AuthContext } from "../../contexts/AuthContext";

interface ImagesSelectableListProps {
  imageList: ImageInstance[];
  selected: ImageInstance[];
  setImageList: React.Dispatch<React.SetStateAction<ImageInstance[]>>;
  variant?: "simple" | "advanced";
}

const SelectedHeader: React.FC<{ color: string }> = ({ color }) => {
  const selectedHeaderStyles = {
    backgroundColor: color,
    color: "white",
    textAlign: "center",
    padding: "4px",
    width: "100%",
  };

  return (
    <Box sx={selectedHeaderStyles}>
      <Typography variant="caption">Selected</Typography>
    </Box>
  );
};

interface SpecificationFooterProps {
  image: ImageInstance;
  setImageList: React.Dispatch<React.SetStateAction<ImageInstance[]>>;
}

const SpecificationFooter: React.FC<SpecificationFooterProps> = ({
  image,
  setImageList,
}) => {
  const { getImageUrl } = useImageUrl();
  const { updateData } = useUpdateData<ImageInstance>(); // A
  const [snackbar, setSnackbar] = React.useState<Pick<
    AlertProps,
    "children" | "severity"
  > | null>(null);
  const { token } = useContext(AuthContext);

  const formatBytes = (bytes: number, decimals = 2): string => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const dm = decimals < 0 ? 0 : decimals;
    const sizes = ["Bytes", "KB", "MB", "GB", "TB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + " " + sizes[i];
  };

  const [editingAltText, setEditingAltText] = useState(false);
  const [altText, setAltText] = useState(image.alt || "");

  const handleAltTextChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setAltText(event.target.value);
  };

  const handleEditAltText = () => {
    setEditingAltText(true);
  };

  const handleSaveAltText = async () => {
    if (!token) return;
    // Update image instance with new alt text
    const updatedImage = { ...image, alt: altText };
    try {
      await updateData(updatedImage, "images", token);
      setImageList((prevList) => {
        const index = prevList.findIndex((item) => item._id === image._id);
        if (index !== -1) {
          const updatedList = [...prevList];
          updatedList[index] = updatedImage;

          return updatedList;
        }
        return prevList;
      });
      setSnackbar({
        children: "Image update successfull.",
        severity: "success",
      });
    } catch (error) {
      if (error instanceof Error) {
        console.error(error.message);
        setSnackbar({ children: error.message, severity: "error" });
      }
    }
    // Exit editing mode
    setEditingAltText(false);
  };
  const handleCloseSnackbar = () => setSnackbar(null);

  return (
    <Container>
      <Tooltip title={image.original_filename}>
        <Typography
          variant="caption"
          paragraph
          noWrap
          paddingTop={"0.5rem"}
          align="center">
          {image.original_filename}
        </Typography>
      </Tooltip>
      <Typography variant="caption" paragraph align="center">
        {image.dimensions?.width + "px x " + image.dimensions?.height + "px"}
        <br />
        {image.bytes && formatBytes(image.bytes, 0)}
        <br />
        <Link href={getImageUrl(image)} target="_blank" rel="noopener">
          View
        </Link>
      </Typography>
      <Box marginTop="auto" display="flex" justifyContent="center">
        {editingAltText ? (
          <TextField
            variant="outlined"
            size="small"
            label="Alt.text"
            fullWidth
            value={altText}
            onChange={handleAltTextChange}
            onBlur={handleSaveAltText}
            autoFocus
            helperText={
              "Enter a brief description of the image for accessibility purposes, such as 'Blue sunset over mountains'."
            }
          />
        ) : (
          <Button size="small" color="secondary" onClick={handleEditAltText}>
            {image.alt ? "Edit" : "Add"} Alt Text
          </Button>
        )}
      </Box>{" "}
      {!!snackbar && (
        <Snackbar
          open
          anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
          onClose={handleCloseSnackbar}
          autoHideDuration={6000}>
          <Alert {...snackbar} onClose={handleCloseSnackbar} />
        </Snackbar>
      )}
    </Container>
  );
};

const ImagesSelectableList: React.FC<ImagesSelectableListProps> = ({
  imageList,
  selected,
  setImageList,
  variant = "simple",
}) => {
  const { getImageUrl } = useImageUrl();
  const theme = useTheme();

  const buttonStyles = {
    position: "relative",
    width: "100%",
    paddingTop: "100%",
    cursor: "pointer",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: "4px",
    overflow: "hidden",
    backgroundColor: "transparent",
    "&:hover .overlay": {
      opacity: 1,
    },
  };

  const selectedBorderColor = `2px solid ${theme.palette.primary.main}`;
  const defaultBorderColor = "1px solid #ccc";
  const selectedGrayscale = "grayscale(0%)";
  const defaultGrayscale = "grayscale(100%)";

  const imgStyles: React.CSSProperties = {
    position: "absolute",
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
    objectFit: "cover",
  };

  const selectedOverlayStyles = {
    position: "absolute",
    top: 0,
    left: 0,
    width: "100%",
    display: "flex",
    justifyContent: "center",
    alignItems: "flex-start",
  };

  //handlers

  const handleImageClick = (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>,
    clickedImage: ImageInstance
  ) => {
    e.preventDefault();

    setImageList((prevList) => {
      const imageExists = prevList.some(
        (image) => image && image._id === clickedImage._id
      );
      if (imageExists) {
        return prevList.filter(
          (image) => image && image._id !== clickedImage._id
        );
      } else {
        return [clickedImage, ...prevList];
      }
    });
  };

  return (
    <Grid container spacing={2}>
      {imageList.map((image: ImageInstance) => (
        <Grid item xs={2} key={uuid()}>
          <Button
            key={image._id}
            id="image-button"
            type="button"
            onClick={(e) => handleImageClick(e, image)}
            sx={{
              ...buttonStyles,
              border: selected.some((img) => img._id === image._id)
                ? selectedBorderColor
                : defaultBorderColor,
              filter: selected.some((img) => img._id === image._id)
                ? selectedGrayscale
                : defaultGrayscale,
              "&:hover": {
                filter: selectedGrayscale,
              },
            }}>
            <img
              src={getImageUrl(image)}
              alt={image.filename}
              style={imgStyles}
            />
            {selected.some((img) => img._id === image._id) && (
              <>
                <Box sx={selectedOverlayStyles}>
                  {variant !== "simple" && (
                    <SelectedHeader color={theme.palette.primary.main} />
                  )}
                </Box>
              </>
            )}
          </Button>
          {variant !== "simple" && (
            <SpecificationFooter image={image} setImageList={setImageList} />
          )}
        </Grid>
      ))}
    </Grid>
  );
};

export default ImagesSelectableList;
