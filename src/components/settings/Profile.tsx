import { FieldProps } from "@rjsf/utils";
import settingsSchema from "./settingsSchema.json";
import { Root2 as Settings } from "./settings";
import PageForm from "../PageForm";
import TextBlock from "../TextBlock";
import { v4 as uuid } from "uuid";
import { Dispatch, SetStateAction } from "react";

export default function ProfileSettings({
  settings,
  setSettings,
}: {
  settings: Settings | null;
  setSettings: Dispatch<SetStateAction<Settings | null>>;
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
      setState={setSettings}
      uiSchema={uiSchema}
      schema={schema}
      pageId="settings"
    />
  );
}
