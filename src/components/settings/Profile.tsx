import { FieldProps } from "@rjsf/utils";
import settingsSchema from "./settingsSchema.json";
import { Root2 as Settings } from "./settings";
import PageForm from "../PageForm";
import TextBlock from "../TextBlock";
import { v4 as uuid } from "uuid";

export default function ProfileSettings({
  settings,
}: {
  settings: Settings | null;
}) {
  const schema = settingsSchema;
  const uiSchema = {
    general: { "ui:field": () => {} },
    profile: {
      bio: {
        statement: {
          html: {
            "ui:field": (props: FieldProps) => (
              <TextBlock
                id={uuid()}
                value={props.formData}
                onBlur={(_id, value) => props.onChange(value)}
              />
            ),
          },
        },
        additional: {
          items: {
            html: {
              "ui:field": (props: FieldProps) => (
                <TextBlock
                  id={uuid()}
                  value={props.formData}
                  onBlur={(_id, value) => props.onChange(value)}
                />
              ),
            },
          },
        },
      },
    },
  };

  return (
    <PageForm
      data={settings}
      uiSchema={uiSchema}
      schema={schema}
      pageId="settings"
    />
  );
}
