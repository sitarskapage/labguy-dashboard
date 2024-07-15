import Form from "@rjsf/mui";
import validator from "@rjsf/validator-ajv8";
import { FieldProps, RJSFSchema, UiSchema, WidgetProps } from "@rjsf/utils";
import formatJSONSchema from "../../utils/formatJSONSchema";
import worksSchema from "./worksSchema.json";
import CustomAutocomplete from "../AutocompleteMultipleFreesolo";
import ImagesBlock from "../images/ImagesBlock";
import fetchData from "../../utils/fetchData";
import { Events } from "./worksSchema";

export default function WorksEditor() {
  const schema: RJSFSchema = formatJSONSchema(worksSchema);
  const uiSchema: UiSchema = {
    general: {
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
      events: {
        // autocomplete must be modified
        "ui:field": (props: FieldProps<Events>) => (
          <CustomAutocomplete
            value={props.formData}
            onChange={props.onChange}
            label="Events"
            multiple={false}
            fetchOptions={() => fetchData("events")}
          />
        ),
      },

      medium: {
        "ui:field": (props: FieldProps) => (
          <CustomAutocomplete
            value={props.formData}
            onChange={props.onChange}
            label="Medium"
            freeSolo
            fetchOptions={() => fetchData("works/medium-list")}
          />
        ),
      },

      images: {
        "ui:widget": (props: WidgetProps) => (
          <ImagesBlock onChange={props.onChange} value={props.value} />
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
