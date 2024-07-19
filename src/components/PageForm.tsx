import { Dispatch, SetStateAction, useContext } from "react";
import { Form } from "@rjsf/mui";
import { IChangeEvent } from "@rjsf/core";
import validator from "@rjsf/validator-ajv8";
import { UiSchema, RJSFSchema } from "@rjsf/utils";
import useRequest from "../utils/useRequest";
import { GeneralContext } from "../contexts/GeneralContext";

interface PageFormProps<T> {
  data: T | null;
  uiSchema: UiSchema;
  schema: RJSFSchema;
  pageId: string;
  setState?: Dispatch<SetStateAction<T | null>>;
}

function PageForm<T>({
  data,
  uiSchema,
  schema,
  pageId,
  setState,
}: PageFormProps<T>) {
  const { token, setSnackbar } = useContext(GeneralContext);
  const { updateData } = useRequest<T>();
  const onSubmit = (data: IChangeEvent<T>) => {
    const { formData } = data;
    token && updateData(formData, pageId, token);
    formData && setState && setState(formData);
    console.log(formData);
    setSnackbar({ children: "Update successful", severity: "success" });
  };

  return (
    <Form
      schema={schema}
      uiSchema={uiSchema}
      validator={validator}
      onSubmit={onSubmit}
      formData={data}
    />
  );
}

export default PageForm;
