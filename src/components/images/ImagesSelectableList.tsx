import React from "react";
import { Grid, Box, Typography, Button } from "@mui/material";
import useImageUrl from "../../utils/useImageURL";
import { v4 as uuid } from "uuid";
import { ImageInstance } from "../../pages/Images";

interface ImagesSelectableListProps {
  imageList: ImageInstance[] | [];
  setImageList: React.Dispatch<React.SetStateAction<ImageInstance[] | []>>;
}

const ImagesSelectableList: React.FC<ImagesSelectableListProps> = ({
  imageList,
  setImageList,
}) => {
  const { getImageUrl } = useImageUrl();

  const handleImageClick = (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>,
    clickedImage: ImageInstance
  ) => {
    e.preventDefault();

    setImageList((prevList) => {
      if (prevList) {
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
      } else {
        return [clickedImage];
      }
    });
  };

  return (
    <Grid container spacing={2}>
      {imageList.map(
        (image: ImageInstance) =>
          image && (
            <Grid item xs={2} key={uuid()}>
              <Button
                key={image._id}
                id="image-button"
                type="button"
                onClick={(e) => handleImageClick(e, image)}
                sx={{
                  position: "relative",
                  width: "100%",
                  paddingTop: "100%", // Set padding top as percentage of width (creates square)
                  border: "1px solid #ccc",
                  cursor: "pointer",
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  borderRadius: "4px",
                  overflow: "hidden",
                  backgroundColor: imageList.some(
                    (selected) => selected._id === image._id
                  )
                    ? ""
                    : "transparent",
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
                    transition: "opacity 0.3s ease-in-out",
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
          )
      )}
    </Grid>
  );
};

export default ImagesSelectableList;
