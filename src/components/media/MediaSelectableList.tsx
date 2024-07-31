import React from "react";
import {
  Grid,
  Button,
  useTheme,
  Card,
  CardMedia,
  CardContent,
} from "@mui/material";
import useImageUrl from "../../utils/useImageURL";
import { v4 as uuid } from "uuid";
import { MediaRef } from "../../pages/Media";
import MediaCardContent from "./MediaCardContent";
import { ImageRef, VideoRef } from "../../schema/schema";

interface MediaSelectableListProps {
  mediaList: MediaRef[];
  selected: MediaRef[];
  setMediaList: React.Dispatch<React.SetStateAction<MediaRef[]>>;
  variant?: "simple" | "advanced";
  single?: boolean;
}

const MediaSelectableList: React.FC<MediaSelectableListProps> = ({
  mediaList,
  selected,
  setMediaList,
  variant = "simple",
  single,
}) => {
  const { getImageUrl } = useImageUrl();
  const theme = useTheme();

  function getThumbnail(media: MediaRef) {
    switch (media.type) {
      case "IMAGE":
        return getImageUrl(media as ImageRef) || "";
      case "VIDEO":
        return (media as VideoRef).thumbnail || "";
      default:
        throw new Error(`Unsupported media type: ${media.type}`);
    }
  }

  function isSelected(media: MediaRef) {
    return selected.some((item) => item.etag === media.etag);
  }

  //handlers
  const handleSelectClick = (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>,
    clickedImage: MediaRef
  ) => {
    e.stopPropagation();

    setMediaList((prevList) => {
      const imageExists = prevList.some(
        (image) => image && image.etag === clickedImage.etag
      );
      if (single) {
        return imageExists ? [] : [clickedImage];
      } else {
        if (imageExists) {
          return prevList.filter(
            (image) => image && image.etag !== clickedImage.etag
          );
        } else {
          return [clickedImage, ...prevList];
        }
      }
    });
  };

  const imageCardStyles = (media: MediaRef) => {
    return {
      height: "100%",
      display: "flex",
      flexDirection: "column",
      backgroundColor: isSelected(media)
        ? theme.palette.primary.light
        : "transparent",
      color: isSelected(media) ? theme.palette.secondary.main : "inherit",
      filter: isSelected(media) ? "grayscale(0%)" : "grayscale(100%)",
      "& a": {
        color: isSelected(media) ? theme.palette.secondary.main : "inherit",
      },
    };
  };

  return (
    <Grid container spacing={2}>
      {mediaList.map((media) => (
        <Grid
          item
          xs={4}
          sx={{
            display: "flex",
            flexDirection: "column",
          }}
          key={uuid()}>
          <Card sx={imageCardStyles(media)}>
            <CardMedia
              component="img"
              src={getThumbnail(media)}
              sx={{ height: "200px", width: "100%" }}
            />

            {variant === "advanced" && (
              <CardContent
                sx={{
                  padding: "0.75rem",
                  flexGrow: 1,
                }}>
                <MediaCardContent media={media} />
              </CardContent>
            )}

            <Grid container spacing={1} justifyContent="center">
              <Grid item>
                <Button
                  color="secondary"
                  onClick={(e) => handleSelectClick(e, media)}>
                  {isSelected(media) ? "Unselect" : "Select"}
                </Button>
              </Grid>
              <Grid item>
                <Button color="secondary">Edit</Button>
              </Grid>
            </Grid>
          </Card>
        </Grid>
      ))}
    </Grid>
  );
};

export default MediaSelectableList;
