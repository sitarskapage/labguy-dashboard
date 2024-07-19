import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Box from "@mui/material/Box";
import { useContext, useState } from "react";
import { GeneralContext } from "../contexts/GeneralContext";
import { FieldProps, RJSFSchema, UiSchema } from "@rjsf/utils";
import MediaBlockSmall from "../components/media/MediaBlockSmall";
import TextBlock from "../components/TextBlock";
import { MediaInstance } from "./Media";
import { v4 as uuid } from "uuid";
import PageFormList from "../components/PageFormList";
import settingsSchema from "../components/settings/settingsSchema.json";
import { SettingsSchema } from "../components/settings/settingsSchema";

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function CustomTabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}>
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  );
}

function a11yProps(index: number) {
  return {
    id: `simple-tab-${index}`,
    "aria-controls": `simple-tabpanel-${index}`,
  };
}

export default function Settings() {
  const [value, setValue] = useState(0);
  const { settings, setSettings } = useContext(GeneralContext);

  const handleChange = (_event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };
  const schema: RJSFSchema = settingsSchema;
  const uiSchema: UiSchema<SettingsSchema> = {
    general: {
      "ui:title": "",

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
    profile: {
      "ui:title": "",

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

  const generalSchema = {
    properties: { general: { ...schema.properties.general } },
  };
  const profileSchema = {
    properties: { profile: { ...schema.properties.profile } },
  };

  return (
    settings && (
      <Box sx={{ width: "100%" }}>
        <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
          <Tabs value={value} onChange={handleChange} aria-label="tabs">
            <Tab label="General" {...a11yProps(0)} />
            <Tab label="Profile" {...a11yProps(1)} />
          </Tabs>
        </Box>

        <CustomTabPanel value={value} index={0}>
          <PageFormList
            data={settings}
            setState={setSettings}
            uiSchema={uiSchema}
            schema={generalSchema}
            pageId="settings"
          />
        </CustomTabPanel>
        <CustomTabPanel value={value} index={1}>
          <PageFormList
            data={settings}
            setState={setSettings}
            uiSchema={uiSchema}
            schema={profileSchema}
            pageId="settings"
          />
        </CustomTabPanel>
      </Box>
    )
  );
}
