import { FieldProps } from "@rjsf/utils";
import worksSchema from "./worksSchema.json";
import CustomAutocomplete from "../AutocompleteMultipleFreesolo";
import MediaBlock from "../media/MediaBlock";
import fetchData from "../../utils/fetchData";
import { Work } from "../../pages/Works";
import useFormData from "../../utils/useFormData";
import PageForm from "../PageForm";

export default function WorksEditor() {
  const { data: work } = useFormData<Work>({ slug: "works" });

  const schema = worksSchema;
  const uiSchema = {
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
        "ui:field": (props: FieldProps<string[]>) => (
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
            description={props.schema.description}
          />
        ),
      },

      medium: {
        "ui:field": (props: FieldProps<string[]>) => (
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
            description={props.schema.description}
          />
        ),
      },

      images: {
        "ui:field": (props: FieldProps) => (
          <MediaBlock onChange={props.onChange} value={props.formData} />
        ),
      },
    },
  };
  return (
    <PageForm
      data={work}
      uiSchema={uiSchema}
      schema={schema}
      pageId={`works`}
    />
  );
}
