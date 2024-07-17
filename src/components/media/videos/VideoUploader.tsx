import { TextField } from "@mui/material";
import { Dispatch, SetStateAction } from "react";
import { MediaInstance, VideoInstance } from "../../../pages/Media";
import { v4 as uuid } from "uuid";

interface VideoUploaderProps {
  setMedia: Dispatch<SetStateAction<MediaInstance[]>>;
}

const VideoUploader = ({ setMedia }: VideoUploaderProps) => {
  const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    const url = e.target.value;
    //

    // Convert the URL to an VideoInstance object
    const newVideo: VideoInstance = {
      _id: uuid(),
      type: "video",
      youtube_url: url,
      original_filename: "test",
    };
    setMedia((prevVideos) => [...prevVideos, newVideo]);
  };

  return <TextField label="YouTube URL" fullWidth onBlur={handleBlur} />;
};

export default VideoUploader;
