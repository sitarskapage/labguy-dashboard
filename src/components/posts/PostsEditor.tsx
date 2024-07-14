import Form from "@rjsf/mui";
import validator from "@rjsf/validator-ajv8";
import { FieldProps, RJSFSchema, UiSchema, WidgetProps } from "@rjsf/utils";
import postsSchema from "./postsSchema.json";
import AutocompleteMultipleFreesolo from "../InputAutoCompleteField";
import TextEditor from "../TextEditor";
import { v4 as uuid } from "uuid";
import ImagesSelectionField from "../images/ImagesSelectionField";

export default function PostsEditor() {
  const schema: RJSFSchema = postsSchema;
  const uiSchema: UiSchema = {
    content: {
      items: {
        anyOf: [
          {
            html: {
              "ui:classNames": "text-block",
              "ui:widget": (props: WidgetProps) => (
                <TextEditor
                  id={uuid()}
                  initVal={props.value}
                  onBlur={props.onBlur}
                />
              ),
            },
          },
          {
            html: {
              "ui:classNames": "images-block",
              "ui:widget": (props: WidgetProps) => (
                <ImagesSelectionField
                  value={props.value}
                  onChange={props.onChange}
                />
              ),
            },
          },
        ],
      },
    },
    tags: {
      "ui:field": (props: FieldProps) => (
        <AutocompleteMultipleFreesolo initVal={props.value} />
      ),
    },
  };

  return <Form schema={schema} uiSchema={uiSchema} validator={validator} />;
}
