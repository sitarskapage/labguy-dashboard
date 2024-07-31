import { RJSFSchema, UiSchema } from "@rjsf/utils";

const generateUiSchema = <T>(schema: RJSFSchema, visibleFields: string[]) => {
  const uiSchema: UiSchema<T> = {};

  Object.keys(schema.properties).forEach((key) => {
    if (visibleFields.includes(key)) {
      const property = schema.properties[key];
      if (property.type === "boolean") {
        uiSchema[key] = {
          "ui:widget": "checkbox",
          "ui:options": {
            label:
              key.charAt(0).toUpperCase() + key.slice(1).replace(/_/g, " "),
          },
        };
      } else if (property.type === "string" && key === "description") {
        uiSchema[key] = {
          "ui:widget": "textarea",
          "ui:options": {
            label:
              key.charAt(0).toUpperCase() + key.slice(1).replace(/_/g, " "),
          },
        };
      } else {
        uiSchema[key] = {
          "ui:widget": property.type === "string" ? "text" : "hidden",
          "ui:options": {
            label:
              key.charAt(0).toUpperCase() + key.slice(1).replace(/_/g, " "),
          },
        };
      }
    } else {
      uiSchema[key] = { "ui:widget": "hidden" };
    }
  });

  return uiSchema;
};

export default generateUiSchema;
