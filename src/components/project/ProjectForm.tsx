import Form from "@rjsf/mui";
import validator from "@rjsf/validator-ajv8";
import { FieldProps, RJSFSchema, UiSchema } from "@rjsf/utils";
import eventsSchema from "./ProjectSchema.json";
import MediaBlock from "../media/MediaBlock";
import CustomAutocomplete from "../CustomAutocomplete";
import fetchData from "../../utils/loader";

export default function ProjectForm() {
  const schema: RJSFSchema = eventsSchema;
  const uiSchema: UiSchema = {
    general: {
      "ui:style": { padding: "0px" },

      tags: {
        "ui:field": (props: FieldProps) => (
          <CustomAutocomplete
            value={props.formData}
            onChange={props.onChange}
            fetchOptions={() => fetchData("tags")}
            label="Tags"
          />
        ),
      },
    },
    details: {
      "ui:style": { padding: "0px" },

      external_urls: {
        items: {
          "ui:title": "",
          "ui:style": { padding: "6px", marginTop: "0px" },

          url: {
            "ui:style": { padding: "6px", marginTop: "0px" },
          },
        },
      },
      images: {
        "ui:field": (props: FieldProps) => (
          <MediaBlock value={props.formData} onChange={props.onChange} />
        ),
      },
    },
  };

  const onSubmit = (data) => console.log("Data submitted: ", data.formData);

  return (
    <Form
      schema={schema}
      uiSchema={uiSchema}
      validator={validator}
      onSubmit={onSubmit}
    />
  );
}
