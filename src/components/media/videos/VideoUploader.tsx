import { Dispatch, SetStateAction, useState } from "react";
import { Grid, TextField } from "@mui/material";
import { AlertProps } from "@mui/material/Alert";
import Uploader from "../../Uploader";
import getYouTubeID from "get-youtube-id";
import useRequest from "../../../utils/useRequest";
import { MediaInstance } from "../../../pages/Media";
import { SettingsSchema } from "../../settings/settingsSchema";
import { VideoInstance } from "./videoSchema"; // Adjust path as per your project structure

interface VideoUploaderProps {
  overrideMedia: (response: MediaInstance[]) => void;
  token: string;
  settings: SettingsSchema;
  setLoading: Dispatch<SetStateAction<boolean>>;
}

const VideoUploader = ({
  overrideMedia,
  token,
  settings,
}: VideoUploaderProps) => {
  const [value, setValue] = useState<string>("");
  const [uploading, setUploading] = useState<boolean>(false);
  const [alert, setAlert] = useState<Pick<
    AlertProps,
    "children" | "severity"
  > | null>(null);
  const { createData } = useRequest<VideoInstance>();

  const handleVideosSubmit = async () => {
    const api_key = settings?.general?.apis?.youtube?.api_key || "";
    const video_id = getYouTubeID(value) || "";
    const youtubeData = await getYoutubeData(api_key, video_id);

    if (!youtubeData) {
      return setAlert({
        children: "Failed to fetch video data",
        severity: "error",
      });
    }
    console.log(youtubeData);
    // Extract relevant data
    const videoInfo = youtubeData.items[0];
    const etag = videoInfo.etag;
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
      yt_url: value,
      public_id: video_id,
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

    createData(newVideo, "videos", token)
      .then((response) => {
        if (!response) {
          return setAlert({
            children: "Failed to upload video.",
            severity: "error",
          });
        } else {
          //notify
          setAlert({
            children: "Video uploaded successfully.",
            severity: "success",
          });
          //refresh state
          overrideMedia([response]);
        }
      })
      .catch((error) => {
        console.error("Error uploading video:", error);
        setAlert({
          children: `Failed to upload video: ${error.message}`,
          severity: "error",
        });
      })
      .finally(() => {
        setUploading(false);
      });
  };

  async function getYoutubeData(api_key: string, video_id: string) {
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

  return (
    <>
      <Uploader
        alert={alert}
        onSubmit={handleVideosSubmit}
        uploading={uploading}
        label={"Videos"}>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <TextField
              label="YouTube URL"
              fullWidth
              value={value}
              onChange={(e) => setValue(e.target.value)}
            />
          </Grid>
        </Grid>
      </Uploader>
    </>
  );
};

export default VideoUploader;
