import React from "react";
import { MediaRef } from "../../pages/Media";
import Form from "../Form";
import prismaSchema from "../../schema/schema.json";
import generateUiSchema from "../../utils/generateUiSchema";

interface MediaCardFormProps {
  media: MediaRef;
  setMediaList: React.Dispatch<React.SetStateAction<MediaRef[]>>;
  setEditingMedia: React.Dispatch<React.SetStateAction<MediaRef | null>>;
}

const MediaCardForm: React.FC<MediaCardFormProps> = ({
  media,
  setMediaList,
  setEditingMedia,
}) => {
  if (!media.etag) throw new Error("no etag found in media object");

  const setState = (newMedia: MediaRef) => {
    setMediaList((prevList) =>
      prevList.map((item) => (item.etag === newMedia.etag ? newMedia : item))
    );
    setEditingMedia(null);
  };

  const videoSchema = prismaSchema.definitions.VideoRef;
  const imageSchema = prismaSchema.definitions.ImageRef;

  const visibleVideoFields = ["player_loop", "player_muted"];
  const videoUiSchema = generateUiSchema<MediaRef>(
    videoSchema,
    visibleVideoFields
  );

  const visibleImageFields = ["description"];
  const imageUiSchema = generateUiSchema<MediaRef>(
    imageSchema,
    visibleImageFields
  );

  const schema = media.type === "IMAGE" ? imageSchema : videoSchema;
  const uiSchema = media.type === "IMAGE" ? imageUiSchema : videoUiSchema;

  const endpoint = {
    path: media.type === "IMAGE" ? "images" : "videos",
    id: media.etag,
  };

  const data = media;

  return (
    <Form<MediaRef>
      data={data}
      uiSchema={uiSchema}
      schema={schema}
      endpoint={endpoint}
      setState={setState}
    />
  );
};

export default MediaCardForm;
