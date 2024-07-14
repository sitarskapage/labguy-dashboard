import Form from "@rjsf/mui";
import validator from "@rjsf/validator-ajv8";
import { RJSFSchema, UiSchema } from "@rjsf/utils";
import formatJSONSchema from "../../utils/formatJSONSchema";
import worksSchema from "./worksSchema.json";

export default function WorksEditor() {
  const schema: RJSFSchema = formatJSONSchema(worksSchema);
  const uiSchema: UiSchema = {};

  return <Form schema={schema} uiSchema={uiSchema} validator={validator} />;
}
