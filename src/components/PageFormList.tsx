import React, { Dispatch, SetStateAction, useContext, useState } from "react";
import { withTheme } from "@rjsf/core";
import { Theme } from "@rjsf/mui";
import { IChangeEvent } from "@rjsf/core";
import { customizeValidator } from "@rjsf/validator-ajv8";
import { UiSchema } from "@rjsf/utils";
import useRequest from "../utils/useRequest";
import { GeneralContext } from "../contexts/GeneralContext";
import {
  Grid,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  TypographyOwnProps,
} from "@mui/material";
import { grey } from "@mui/material/colors";

interface Properties {
  [key: string]: {
    title: string;
    properties?: Properties;
  };
}

interface SchemaWithProperties {
  properties: Properties;
}

interface PageFormProps<T> {
  data: T;
  uiSchema: UiSchema<T>;
  schema: SchemaWithProperties;
  pageId: string;
  setState?: Dispatch<SetStateAction<T | null>>;
}

export default function PageFormList<T>({
  data,
  uiSchema,
  schema,
  pageId,
  setState,
}: PageFormProps<T>) {
  const { token, setSnackbar } = useContext(GeneralContext);
  const { updateData } = useRequest<T>();
  const Form = withTheme<T>(Theme);
  const validator = customizeValidator<T>();

  // State to track the selected section
  const [selectedSection, setSelectedSection] = useState<string | null>(null);

  const onSubmit = (data: IChangeEvent<T>) => {
    const { formData } = data;
    token && updateData(formData, pageId, token);
    formData && setState && setState(formData);

    setSnackbar({ children: "Update successful", severity: "success" });
  };

  const primaryTypographyPropsVar1: TypographyOwnProps = {
    variant: "subtitle",
  };

  const primaryTypographyPropsVar2: TypographyOwnProps = {
    variant: "subtitle2",
    pl: "1rem",
  };

  const primaryTypographyProps = (depth: number) =>
    depth == 1 ? primaryTypographyPropsVar1 : primaryTypographyPropsVar2;

  const genItems = (
    properties: Properties,
    depth = 1,
    isFirstIteration = true
  ): JSX.Element[] => {
    return Object.keys(properties).flatMap((key) => {
      // Skip the first iteration
      if (isFirstIteration) {
        return properties[key].properties
          ? genItems(properties[key].properties, depth, false)
          : [];
      }

      // Stop recursion at the second level
      if (depth > 2) return [];

      return (
        <React.Fragment key={key}>
          <ListItem disablePadding>
            <ListItemButton
              selected={selectedSection === key}
              onClick={() => setSelectedSection(key)}>
              <ListItemText
                primary={properties[key].title}
                primaryTypographyProps={primaryTypographyProps(depth)}
              />
            </ListItemButton>
          </ListItem>
          {properties[key].properties &&
            genItems(properties[key].properties, depth + 1, false)}
        </React.Fragment>
      );
    });
  };

  // Create a filtered schema based on the selected section
  const filterSchemaBySection = (
    schema: SchemaWithProperties,
    sectionKey: string | null
  ): SchemaWithProperties => {
    if (!sectionKey) return schema;

    const filterProperties = (
      properties: Properties,
      key: string
    ): Properties => {
      const filtered = {};
      Object.keys(properties).forEach((k) => {
        if (k === key) {
          filtered[k] = properties[k];
        } else if (properties[k].properties) {
          const subProperties = filterProperties(properties[k].properties, key);
          if (Object.keys(subProperties).length > 0) {
            filtered[k] = {
              ...properties[k],
              properties: subProperties,
            };
          }
        }
      });
      return filtered;
    };

    return {
      properties: filterProperties(schema.properties, sectionKey),
    };
  };

  return (
    <Grid container columnSpacing={3}>
      <Grid item xs={3}>
        <List>{genItems(schema.properties)}</List>
      </Grid>
      <Grid item xs={9}>
        <Form
          schema={filterSchemaBySection(schema, selectedSection)}
          uiSchema={uiSchema}
          validator={validator}
          onSubmit={onSubmit}
          formData={data}
          templates={{}}
        />
      </Grid>
    </Grid>
  );
}
