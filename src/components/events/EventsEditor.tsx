import Form from "@rjsf/mui";
import validator from "@rjsf/validator-ajv8";
import { RJSFSchema, UiSchema, WidgetProps } from "@rjsf/utils";
import formatJSONSchema from "../../utils/formatJSONSchema";
import eventsSchema from "./eventsSchema.json";
import ImagesSelectionField from "../images/ImagesSelectionField";
import AutocompleteMultipleFreesolo from "../InputAutoCompleteField";

export default function EventsEditor() {
  const schema: RJSFSchema = formatJSONSchema(eventsSchema);
  const uiSchema: UiSchema = {
    tags: {
      "ui:field": (props: WidgetProps) => (
        <AutocompleteMultipleFreesolo initVal={props.value} />
      ),
    },
    images: {
      "ui:widget": (props: WidgetProps) => (
        <ImagesSelectionField onChange={props.onChange} value={props.value} />
      ),
    },
  };

  return <Form schema={schema} uiSchema={uiSchema} validator={validator} />;
}
