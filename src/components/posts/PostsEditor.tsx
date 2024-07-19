import Form from "@rjsf/mui";
import validator from "@rjsf/validator-ajv8";
import postsSchema from "./postsSchema.json";
import CustomAutocomplete from "../CustomAutocomplete";
import TextBlock from "../TextBlock";
import { v4 as uuid } from "uuid";
import MediaBlock from "../media/MediaBlock";

import {
  Block,
  MetadataDescription,
  MetadataTitle,
  Public,
  Slug,
  Tags,
  Title,
} from "./postsSchema";
import { FieldProps } from "@rjsf/utils";
import { IChangeEvent } from "@rjsf/core";
import fetchData from "../../utils/fetchData";
import { ImageInstance } from "../media/images/imageSchema";

export interface FormData {
  title: Title;
  slug?: Slug;
  tags?: Tags;
  metadata?: {
    title?: MetadataTitle;
    description?: MetadataDescription;
    [k: string]: unknown;
  };
  public?: Public;
  content?: Block[];
  [k: string]: unknown;
}

export default function PostsEditor() {
  const schema = postsSchema;
  const uiSchema = {
    general: {
      "ui:style": { padding: "0px" },

      tags: {
        "ui:field": (props: FieldProps) => (
          <CustomAutocomplete
            value={props.formData}
            onChange={props.onChange}
            label="Tags"
            fetchOptions={() => fetchData("events")}
          />
        ),
      },
    },
    details: {
      "ui:style": { padding: "0px" },

      content: {
        items: {
          oneOf: [
            {
              "ui:classNames": "block-text",
              "ui:style": { padding: "6px" },
              "ui:field": (props: FieldProps<Block>) => {
                if (props.formData && "html" in props.formData) {
                  return (
                    <TextBlock
                      id={uuid()}
                      value={props.formData.html}
                      onBlur={(_id, value) => {
                        props.onChange({
                          html: value,
                        });
                      }}
                    />
                  );
                } else {
                  return null;
                }
              },
            },
            {
              "ui:classNames": "block-image",
              "ui:style": { padding: "6px" },

              "ui:field": (props: FieldProps<Block>) => {
                if (props.formData && "images" in props.formData) {
                  return (
                    <MediaBlock
                      value={props.formData.images as ImageInstance[]}
                      onChange={(value) => {
                        props.onChange({
                          images: value,
                        });
                      }}
                    />
                  );
                } else {
                  return null;
                }
              },
            },
          ],
        },
      },
    },
  };

  const onSubmit = (data: IChangeEvent<FormData>) =>
    console.log("Data submitted: ", data.formData);

  return (
    <Form
      schema={schema}
      uiSchema={uiSchema}
      validator={validator}
      onSubmit={onSubmit}
    />
  );
}
