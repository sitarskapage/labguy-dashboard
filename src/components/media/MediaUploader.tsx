import { Dispatch, SetStateAction, useContext, useState } from "react";
import {
  Button,
  Modal,
  Container,
  Grid,
  TextField,
  AlertProps,
} from "@mui/material";
import ImagesDropZone, { FileWithPreview } from "./images/ImagesDropZone";
import Uploader from "../Uploader";
import { GeneralContext } from "../../contexts/GeneralContext";
import getYouTubeID from "get-youtube-id";
import useRequest from "../../utils/useRequest";
import { MediaInstance } from "../../pages/Media";
import { ImageInstance } from "./imageSchema";

interface MediaUploaderProps {
  setMedia: Dispatch<SetStateAction<MediaInstance[]>>;
}

const MediaUploader = ({ setMedia }: MediaUploaderProps) => {
  const [isModalOpen, setModalOpen] = useState<"image" | "video" | null>(null);
  const [files, setFiles] = useState<FileWithPreview[]>([]);
  const [value, setValue] = useState<string>("");
  const [uploading, setUploading] = useState<boolean>(false);
  const { token, settings } = useContext(GeneralContext);
  const [alert, setAlert] = useState<Pick<
    AlertProps,
    "children" | "severity"
  > | null>(null);
  const { createData } = useRequest<MediaInstance>();

  const handleOpenModal = (modalType: "image" | "video") => {
    setModalOpen(modalType);
  };

  const handleCloseModal = () => {
    setModalOpen(null);
    // Clear any temporary state if needed
    setFiles([]);
    setValue("");
    setAlert(null);
  };

  const handleImagesSubmit = async () => {
    try {
      setUploading(true);
      setAlert({ children: "Preparing images...", severity: "info" });

      const formData = new FormData();
      files.forEach((file) => {
        formData.append("files", file);
      });

      setAlert({ children: "Uploading images...", severity: "info" });

      const response = await fetch("http://localhost:3000/api/images/upload", {
        method: "POST",
        body: formData,
        headers: {
          Authorization: `${token}`,
        },
      });

      if (!response.ok) {
        throw new Error("Failed to upload to server");
      }

      const result = (await response.json()) as ImageInstance[];

      setAlert({
        children: "Images uploaded successfully.",
        severity: "success",
      });

      overrideMediaList(result);
    } catch (error) {
      console.error("Error during image upload:", error);
      setAlert({
        children: `Error during upload: ${(error as Error).message}`,
        severity: "error",
      });
    } finally {
      setUploading(false);
      setFiles([]);
    }
    return;
  };

  const handleVideosSubmit = async () => {
    const api_key = settings?.general?.apis?.youtube?.api_key || "";
    const video_id = getYouTubeID(value) || "";
    const youtubeData = await getYoutubeData(api_key, video_id, setAlert);
    console.log(youtubeData);
    // Extract relevant data
    const videoInfo = youtubeData.items[0];
    const etag = youtubeData.items[0].etag;
    const title = videoInfo.snippet.title;
    const tags = videoInfo.snippet.tags || [];
    const thumbnails = videoInfo.snippet.thumbnails;
    const description = videoInfo.snippet.description;
    const publishedAt = videoInfo.snippet.publishedAt;
    const duration = videoInfo.contentDetails.duration;
    const definition = videoInfo.contentDetails.definition;

    // Create a new video instance with extracted data
    const newVideo = {
      title: title,
      type: "video",
      url: value,
      etag: etag,
      tags: tags,
      thumbnails: thumbnails,
      description: description,
      publishedAt: publishedAt,
      duration: duration,
      definition: definition,
    };

    setAlert({
      children: "Uploading video...",
      severity: "info",
    });
    const response = await createData(newVideo, "videos", token);

    if (response) {
      setAlert({
        children: "Video uploaded successfully.",
        severity: "success",
      });
      overrideMediaList([response]);
    } else {
      setAlert({
        children: "Failed to upload video.",
        severity: "error",
      });
    }
    return;
  };

  const overrideMediaList = (result: MediaInstance[]) => {
    setMedia((prevList) => {
      // Override duplicates
      const newMedia = result.filter((newMedia) => {
        return !prevList.some((media) => {
          if ("etag" in media) {
            return media.etag === newMedia.etag;
          }
          return false;
        });
      });
      // Return list without duplicates
      return [...newMedia, ...prevList];
    });
  };

  async function getYoutubeData(
    api_key: string,
    video_id: string,
    setAlert: Dispatch<
      SetStateAction<Pick<AlertProps, "children" | "severity"> | null>
    >
  ) {
    setAlert({ children: "Getting YouTube video data...", severity: "info" });
    try {
      const response = await fetch(
        `https://www.googleapis.com/youtube/v3/videos?&key=${api_key}&part=snippet,contentDetails&id=${video_id}`
      );

      if (!response.ok) {
        throw new Error("Failed to fetch video data");
      }

      const data = await response.json();

      if (!data.items) {
        throw new Error("No data available for this video ID");
      }

      return data;
    } catch (error) {
      console.error("Error fetching YouTube data:", error);
      setAlert({
        children: (error as Error).message || "Failed to fetch video data",
        severity: "error",
      });
      return null;
    } finally {
      setAlert({
        children: "Successfully retrieved YouTube data",
        severity: "info",
      });
    }
  }

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
          <Uploader
            alert={alert}
            onSubmit={handleImagesSubmit}
            uploading={uploading}
            label={"Images"}>
            <ImagesDropZone files={files} setFiles={setFiles} />
          </Uploader>
        </Container>
      </Modal>

      <Modal open={isModalOpen === "video"} onClose={handleCloseModal}>
        <Container sx={modalStyle}>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <Uploader
                alert={alert}
                onSubmit={handleVideosSubmit}
                uploading={uploading}
                label={"Videos"}>
                <TextField
                  label="YouTube URL"
                  fullWidth
                  value={value}
                  onChange={(e) => setValue(e.target.value)}
                />
              </Uploader>{" "}
            </Grid>
          </Grid>
        </Container>
      </Modal>
    </>
  );
};

export default MediaUploader;
