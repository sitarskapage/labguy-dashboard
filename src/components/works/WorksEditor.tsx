import Form from "@rjsf/mui";
import validator from "@rjsf/validator-ajv8";
import { FieldProps, RJSFSchema, UiSchema } from "@rjsf/utils";
import formatJSONSchema from "../../utils/formatJSONSchema";
import worksSchema from "./worksSchema.json";
import CustomAutocomplete from "../AutocompleteMultipleFreesolo";
import ImagesBlock from "../images/ImagesBlock";
import fetchData from "../../utils/fetchData";
import { Events, Medium } from "./worksSchema";
import { ImageInstance } from "../../pages/Images";
import EditorContainer from "../EditorContainer";
import { Work } from "../../pages/Works";
import useFormData from "../../utils/useFormData";
import useSubmit from "../../utils/useSubmit";

export default function WorksEditor() {
  const schema: RJSFSchema = formatJSONSchema(worksSchema);
  const uiSchema: UiSchema = {
    general: {
      "ui:style": { padding: "0px" },

      tags: {
        "ui:field": (props: FieldProps) => (
          <CustomAutocomplete
            value={props.formData}
            onChange={props.onChange}
            label="Tags"
            freeSolo
            fetchOptions={() => fetchData("tags")}
          />
        ),
      },
    },
    details: {
      "ui:style": { padding: "0px" },

      events: {
        "ui:field": (props: FieldProps<Events>) => (
          <CustomAutocomplete
            value={props.formData}
            onChange={(value) => {
              const formatted = value.map((item) => {
                return typeof item == "string" ? item : item.id;
              });

              props.onChange(formatted);
            }}
            label="Events"
            multiple={false}
            fetchOptions={() => fetchData("events")}
          />
        ),
      },

      medium: {
        "ui:field": (props: FieldProps<Medium>) => (
          <CustomAutocomplete
            value={props.formData}
            onChange={(value) => {
              const formatted = value.map((item) => {
                return typeof item == "string" ? item : item.id;
              });

              props.onChange(formatted);
            }}
            label="Medium"
            freeSolo
            fetchOptions={() => fetchData("works/medium-list")}
          />
        ),
      },

      images: {
        "ui:field": (props: FieldProps) => (
          <ImagesBlock
            onChange={(value) => {
              const formatted = value.map((item) => {
                return item._id;
              });

              props.onChange(formatted);
            }}
            value={props.formData as ImageInstance[]}
          />
        ),
      },
    },
  };

  const work = useFormData<Work>({ slug: "works" });

  return (
    work && (
      <EditorContainer title={work.general.title}>
        <Form
          schema={schema}
          uiSchema={uiSchema}
          validator={validator}
          onSubmit={useSubmit}
          formData={work}
        />
      </EditorContainer>
    )
  );
}
