import React from "react";
import { Grid, Box, Typography, Button, useTheme } from "@mui/material";
import useImageUrl from "../../utils/useImageURL";
import { v4 as uuid } from "uuid";
import { ImageInstance } from "../../pages/Images";

interface ImagesSelectableListProps {
  imageList: ImageInstance[];
  selected: ImageInstance[];
  setImageList: React.Dispatch<React.SetStateAction<ImageInstance[]>>;
}

const SelectedHeader: React.FC<{ color: string }> = ({ color }) => (
  <Box
    sx={{
      backgroundColor: color,
      color: "white",
      textAlign: "center",
      padding: "4px",
      width: "100%",
    }}>
    <Typography variant="caption">Selected</Typography>
  </Box>
);

const ImagesSelectableList: React.FC<ImagesSelectableListProps> = ({
  imageList,
  selected,
  setImageList,
}) => {
  const { getImageUrl } = useImageUrl();
  const theme = useTheme();

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
              position: "relative",
              width: "100%",
              paddingTop: "100%",
              border: selected.some((img) => img._id === image._id)
                ? `2px solid ${theme.palette.primary.main}`
                : "1px solid #ccc",
              filter: selected.some((img) => img._id === image._id)
                ? "grayscale(0%)"
                : "grayscale(100%)",
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
            }}>
            <img
              src={getImageUrl(image)}
              alt={image.filename}
              style={{
                position: "absolute",
                top: 0,
                left: 0,
                width: "100%",
                height: "100%",
                objectFit: "cover",
              }}
            />
            {selected.some((img) => img._id === image._id) && (
              <Box
                sx={{
                  position: "absolute",
                  top: 0,
                  left: 0,
                  width: "100%",
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "flex-start",
                }}>
                <SelectedHeader color={theme.palette.primary.main} />
              </Box>
            )}
            <Box
              className="overlay"
              sx={{
                position: "absolute",
                top: 0,
                left: 0,
                width: "100%",
                height: "100%",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                backgroundColor: "rgba(0, 0, 0, 0.5)",
                color: "white",
                opacity: 0,
                transition: "opacity 0.1s ease-in-out",
                padding: "0 5px",
              }}>
              <Typography
                variant="caption"
                sx={{
                  whiteSpace: "nowrap",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  width: "100%",
                  textAlign: "center",
                }}>
                {image.filename}
              </Typography>
            </Box>
          </Button>
        </Grid>
      ))}
    </Grid>
  );
};

export default ImagesSelectableList;
