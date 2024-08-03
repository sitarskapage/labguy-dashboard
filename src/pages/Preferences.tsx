import React, { useContext, useState } from "react";
import { GeneralContext } from "../contexts/GeneralContext";
import { Box, CircularProgress, Tab, Tabs } from "@mui/material";
import Form from "../components/Form";
import { Preferences as PreferencesSchema, Profile } from "../schema/schema";
import schema from "../schema/schema.json";
import { useLoaderData } from "react-router-dom";
import { hide } from "../utils/uiSchemaUtils";
import { FieldProps, RJSFSchema } from "@rjsf/utils";
import MediaBlockSmall from "../components/media/MediaBlockSmall";

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

export default function Preferences() {
  //init
  const [value, setValue] = useState(0);
  const { preferences, setPreferences } = useContext(GeneralContext);
  const loaderData = useLoaderData() as Profile;
  const [profile, setProfile] = useState<Profile | undefined>(loaderData);

  if (!preferences) return <CircularProgress />;
  if (!schema) return <CircularProgress />;

  //schemas
  const preferencesSchema: PreferencesSchema = schema.definitions.Preferences;
  const profileSchema = schema.definitions.Profile;
  //uischemas
  const profileUiSchema = {
    contact: {
      items: {
        id: {
          "ui:widget": "hidden",
        },
        socialmedia: {
          items: {
            id: {
              "ui:widget": "hidden",
            },
          },
        },
      },
    },
  };
  const generalUiSchema = {
    background: {
      "ui:widget": () => null,
    },
    ...hide(profileSchema, [
      "homepage_heading",
      "homepage_subheading",
      "videoRefEtag",
      "imageRefEtag",
    ]),
  };
  const homepageUiSchema = {
    background: {
      // "ui:widget": (props: WidgetProps) => {
      //   return props.children;
      // },
      oneOf: [
        {},
        {
          "ui:field": (props: FieldProps) => (
            <MediaBlockSmall
              variant="IMAGE"
              label="Image"
              value={props.formData}
              onChange={(v) => {
                v && v[0] && props.onChange(v[0].etag);
              }}
            />
          ),
        },
        {
          "ui:field": (props: FieldProps) => (
            <MediaBlockSmall
              variant="VIDEO"
              label="Video"
              value={props.formData}
              onChange={(v) => {
                v && v[0] && props.onChange(v[0].etag);
              }}
            />
          ),
        },
      ],
    },
    ...hide(profileSchema, [
      "creator_name",
      "enable_dashboard_darkmode",
      "enable_portfolio_pdf",
    ]),
  };
  //endpoints
  const preferencesEndpoint = {
    path: "preferences",
    id: preferences.id as number,
  };
  const profileEndpoint = { path: "profile", id: preferences.id as number };

  //handlers
  const handleTabChange = (_event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };

  return (
    <Box sx={{ width: "100%" }}>
      <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
        <Tabs value={value} onChange={handleTabChange} aria-label="tabs">
          <Tab label="General" {...a11yProps(0)} />
          <Tab label="Homepage" {...a11yProps(1)} />
          <Tab label="Profile" {...a11yProps(2)} />
        </Tabs>
      </Box>

      <CustomTabPanel value={value} index={0}>
        <Form
          data={preferences}
          schema={preferencesSchema}
          uiSchema={generalUiSchema}
          endpoint={preferencesEndpoint}
          setState={setPreferences}
        />
      </CustomTabPanel>
      <CustomTabPanel value={value} index={1}>
        <Form
          data={preferences}
          schema={preferencesSchema}
          uiSchema={homepageUiSchema}
          endpoint={preferencesEndpoint}
          setState={setPreferences}
        />
      </CustomTabPanel>
      <CustomTabPanel value={value} index={2}>
        <Form
          data={profile}
          uiSchema={profileUiSchema}
          schema={profileSchema as RJSFSchema}
          endpoint={profileEndpoint}
          setState={setProfile}
        />
      </CustomTabPanel>
    </Box>
  );
}
