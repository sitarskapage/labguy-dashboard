import { FieldProps } from "@rjsf/utils";
import settingsSchema from "./settingsSchema.json";
import MediaBlockSmall from "../media/MediaBlockSmall";
import { Root2 as Settings } from "./settings";
import { MediaInstance } from "../../pages/Media";
import PageForm from "../PageForm";
import { Dispatch, SetStateAction } from "react";

export default function GeneralSettings({
  settings,
  setSettings,
}: {
  settings: Settings | null;
  setSettings: Dispatch<SetStateAction<Settings | null>>;
}) {
  const schema = settingsSchema;
  const uiSchema = {
    general: {
      website: {
        details: {
          favicon: {
            "ui:field": (props: FieldProps<MediaInstance>) => {
              return (
                <MediaBlockSmall
                  value={props.formData ? [props.formData] : undefined}
                  label={"Favicon"}
                  onChange={(value) =>
                    props.onChange(value ? value[0] : undefined)
                  }
                />
              );
            },
          },
        },
        homepage: {
          background: {
            "ui:field": (props: FieldProps<MediaInstance>) => {
              return (
                <MediaBlockSmall
                  value={props.formData ? [props.formData] : undefined}
                  label={"Background"}
                  onChange={(value) =>
                    props.onChange(value ? value[0] : undefined)
                  }
                />
              );
            },
          },
        },
      },
    },
    profile: { "ui:field": () => {} },
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
