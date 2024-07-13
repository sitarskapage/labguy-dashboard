export interface JSONSchema {
  title?: string;
  type?: string;
  properties?: { [key: string]: JSONSchema };
  items?: JSONSchema | JSONSchema[];
  required?: string[];
}

function formatTitle(title: string): string {
  // Extract the main part of the title, remove 'The', 'A', and 'Schema', then format it
  let formattedTitle = title
    .replace(/The\s|A\s|Schema/g, "")
    .replace(/_/g, " ")
    .trim();

  // Capitalize the first letter of the first level titles
  formattedTitle =
    formattedTitle.charAt(0).toUpperCase() + formattedTitle.slice(1);

  return formattedTitle;
}

function removeIdProperties(schema: JSONSchema): JSONSchema {
  if (typeof schema !== "object" || schema === null) {
    return schema;
  }

  if (schema.properties) {
    delete schema.properties["_id"];
    for (const key in schema.properties) {
      schema.properties[key] = removeIdProperties(schema.properties[key]);
    }
  }

  if (schema.items) {
    if (Array.isArray(schema.items)) {
      schema.items = schema.items.map((item) => removeIdProperties(item));
    } else {
      schema.items = removeIdProperties(schema.items);
    }
  }

  if (schema.required) {
    schema.required = schema.required.filter((field) => field !== "_id");
  }

  return schema;
}

export default function formatJSONSchema(schema: JSONSchema): JSONSchema {
  if (typeof schema !== "object" || schema === null) {
    return schema;
  }

  // Format the title if it exists
  if (schema.title) {
    schema.title = formatTitle(schema.title);
  }

  // Remove _id properties
  schema = removeIdProperties(schema);

  // Recursively format properties and items
  if (schema.properties) {
    for (const key in schema.properties) {
      schema.properties[key] = formatJSONSchema(schema.properties[key]);
    }
  }

  if (schema.items) {
    if (Array.isArray(schema.items)) {
      schema.items = schema.items.map((item) => formatJSONSchema(item));
    } else {
      schema.items = formatJSONSchema(schema.items);
    }
  }

  return schema;
}
