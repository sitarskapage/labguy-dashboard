import Form from "@rjsf/mui";
import validator from "@rjsf/validator-ajv8";
import { RJSFSchema, UiSchema, WidgetProps } from "@rjsf/utils";
import formatJSONSchema from "../../utils/formatJSONSchema";
import settingsSchema from "./settingsSchema.json";
import TextEditor from "../TextEditor";
import { v4 as uuid } from "uuid";

export default function ProfileSettings() {
  const profileSchema = settingsSchema.items.properties.profile;
  const schema: RJSFSchema = formatJSONSchema(profileSchema);
  console.log(schema);
  const uiSchema: UiSchema = {
    bio: {
      statement: {
        html: {
          "ui:field": (props: WidgetProps) => (
            <TextEditor
              id={uuid()}
              initVal={props.formData} // Assuming you want formData instead of value
              onBlur={props.onBlur}
            />
          ),
        },
      },
      additional: {
        items: {
          html: {
            "ui:field": (props: WidgetProps) => (
              <TextEditor
                id={uuid()}
                initVal={props.formData} // Assuming you want formData instead of value
                onBlur={props.onBlur}
              />
            ),
          },
        },
      },
    },
  };

  return <Form schema={schema} uiSchema={uiSchema} validator={validator} />;
}
