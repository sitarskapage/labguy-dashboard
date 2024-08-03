export function hideAllButVisible(
  schema: {
    type: string;
    properties: Record<
      string,
      {
        type: string | string[];
        default?: unknown;
        enum?: string[];
      }
    >;
  },
  visibleFields: string[]
): Record<string, unknown> {
  const result: Record<string, unknown> = {};

  // Extract the properties from the schema
  const { properties } = schema;

  // Iterate over the properties
  for (const [key, value] of Object.entries(properties)) {
    // If the key is in the visible fields list, keep it
    if (visibleFields.includes(key)) {
      result[key] = value;
    } else {
      // Otherwise, hide the field
      result[key] = { "ui:widget": "hidden" };
    }
  }

  return result;
}

// Function to create a schema where all fields are hidden except those specified
export function hide(
  schema: Record<string, unknown>,
  fieldsToHide: string[]
): Record<string, unknown> {
  // Create a new object to store the result
  const result: Record<string, unknown> = { ...schema };

  // Iterate over the fields to hide and set them as hidden in the result
  fieldsToHide.forEach((field) => {
    result[field] = { "ui:widget": "hidden" };
  });

  return result;
}
