import Form from "@rjsf/mui";
import validator from "@rjsf/validator-ajv8";
import { RJSFSchema, UiSchema, WidgetProps } from "@rjsf/utils";
import settingsSchema from "./settingsSchema.json";
import TextBlock from "../TextBlock";
import { v4 as uuid } from "uuid";

export default function ProfileSettings() {
  const profileSchema = settingsSchema.properties.profile;
  const schema: RJSFSchema = profileSchema;
  console.log(schema);
  const uiSchema: UiSchema = {
    bio: {
      statement: {
        html: {
          "ui:widget": (props: WidgetProps) => (
            <TextBlock id={uuid()} value={props.value} onBlur={props.onBlur} />
          ),
        },
      },
      additional: {
        items: {
          html: {
            "ui:widget": (props: WidgetProps) => (
              <TextBlock
                id={uuid()}
                value={props.value}
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
