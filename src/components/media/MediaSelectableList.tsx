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
  Card,
  CardActionArea,
  CardMedia,
  CardContent,
} from "@mui/material";
import useImageUrl from "../../utils/useImageURL";
import { v4 as uuid } from "uuid";
import useRequest from "../../utils/useRequest";
import { GeneralContext } from "../../contexts/GeneralContext";
import { MediaInstance } from "../../pages/Media";
import { ImageInstance } from "./images/imageSchema";
import { VideoInstance } from "./videos/videoSchema";
import { formatBytes, formatDuration } from "../../utils/formatters";

interface MediaSelectableListProps {
  mediaList: MediaInstance[];
  selected: MediaInstance[];
  setMediaList: React.Dispatch<React.SetStateAction<MediaInstance[]>>;
  variant?: "simple" | "advanced";
  single?: boolean;
}

interface SpecificationImgFooterProps {
  image: ImageInstance;
  setImageList: React.Dispatch<React.SetStateAction<MediaInstance[]>>;
}

interface VideoFooterProps {
  video: VideoInstance;
}
const containerStyle = {
  display: "flex",
  flexDirection: "column",
  justifyContent: "space-between",
  height: "100%",
};

const VideoFooter: React.FC<VideoFooterProps> = ({ video }) => {
  return (
    <Container sx={containerStyle}>
      <Tooltip title={video.title}>
        <Typography
          variant="caption"
          paragraph
          noWrap
          paddingTop={"0.5rem"}
          align="center">
          {video.title}
        </Typography>
      </Tooltip>
      <Typography variant="caption" paragraph align="center">
        {formatDuration(video.duration)}
        <br />
        {video.definition.toUpperCase()}
        <br />
      </Typography>
      <Typography variant="caption" padding={1} textAlign={"center"}>
        <Link href={video.url} target="_blank" rel="noopener">
          View
        </Link>
      </Typography>
    </Container>
  );
};

const SpecificationImgFooter: React.FC<SpecificationImgFooterProps> = ({
  image,
  setImageList,
}) => {
  const { getImageUrl } = useImageUrl();
  const { updateData } = useRequest<ImageInstance>();
  const { token, setSnackbar } = useContext(GeneralContext);
  const [editingAltText, setEditingAltText] = useState(false);
  const [altText, setAltText] = useState(image.alt || "");

  const handleAltTextChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setAltText(event.target.value);
  };

  const handleEditAltText = (
    event: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => {
    event.stopPropagation();
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
        children: "Image updated",
        severity: "success",
      });
    } catch (error) {
      if (error instanceof Error) {
        setSnackbar({ children: error.message, severity: "error" });
        throw error;
      }
    }
    // Exit editing mode
    setEditingAltText(false);
  };

  return (
    <Container sx={{ padding: 1 }}>
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
      </Box>
    </Container>
  );
};

const MediaSelectableList: React.FC<MediaSelectableListProps> = ({
  mediaList,
  selected,
  setMediaList,
  variant = "simple",
  single,
}) => {
  const { getImageUrl } = useImageUrl();
  const theme = useTheme();

  function getThumbnail(media: MediaInstance) {
    switch (media.type) {
      case "image":
        return getImageUrl(media as ImageInstance);
      case "video":
        return media.thumbnails.medium.url;
      default:
        throw new Error("Unsupported media type");
    }
  }

  function isSelected(media: MediaInstance) {
    return selected.some((item) => item._id === media._id);
  }

  //handlers

  const handleImageClick = (
    e: React.MouseEvent<HTMLDivElement, MouseEvent>,
    clickedImage: MediaInstance
  ) => {
    e.stopPropagation();

    setMediaList((prevList) => {
      const imageExists = prevList.some(
        (image) => image && image._id === clickedImage._id
      );
      if (single) {
        return imageExists ? [] : [clickedImage];
      } else {
        if (imageExists) {
          return prevList.filter(
            (image) => image && image._id !== clickedImage._id
          );
        } else {
          return [clickedImage, ...prevList];
        }
      }
    });
  };

  const imageCardStyles = (media: MediaInstance) => {
    const styles = { height: "100%" };
    return isSelected(media)
      ? {
          ...styles,
          backgroundColor: theme.palette.primary.light,
          color: theme.palette.secondary.main,
          filter: "grayscale(0%)",
          "& a": {
            color: theme.palette.secondary.main,
          },
        }
      : {
          ...styles,
          backgroundColor: "transparent",
          filter: "grayscale(100%)",
        };
  };

  return (
    <Grid container spacing={2}>
      {mediaList.map((media) => (
        <Grid item xs={3} sx={{ display: "flex", flexDirection: "column" }}>
          <Card
            sx={imageCardStyles(media)}
            key={uuid()}
            onDoubleClick={(e) => handleImageClick(e, media)}>
            <CardActionArea sx={{ height: "100%" }}>
              <CardMedia
                component="img"
                image={getThumbnail(media)}
                sx={{ height: "200px" }}
              />
              <CardContent sx={{ padding: variant === "simple" ? 0 : "1rem" }}>
                {variant !== "simple" && media.type == "image" && (
                  <Box flexGrow={1}>
                    <SpecificationImgFooter
                      image={media as ImageInstance}
                      setImageList={setMediaList}
                    />
                  </Box>
                )}
                {variant !== "simple" && media.type == "video" && (
                  <Box flexGrow={1}>
                    <VideoFooter video={media as VideoInstance} />{" "}
                  </Box>
                )}
              </CardContent>
            </CardActionArea>
          </Card>
        </Grid>
      ))}
    </Grid>
  );
};

export default MediaSelectableList;
