import Form from "@rjsf/mui";
import validator from "@rjsf/validator-ajv8";
import { FieldProps, RJSFSchema, UiSchema } from "@rjsf/utils";
import settingsSchema from "./settingsSchema.json";
import ImagesBlockSmall from "../images/ImagesBlockSmall";
import { useParams } from "react-router-dom";
import { useContext } from "react";
import { useUpdateData, WithId } from "../../utils/useRequest";
import { IChangeEvent } from "@rjsf/core";
import { AuthContext } from "../../contexts/AuthContext";

export default function GeneralSettings() {
  const { id } = useParams();
  const { token } = useContext(AuthContext);
  const { updateData } = useUpdateData<T>();

  const generalSchema = settingsSchema.properties.general;
  const schema: RJSFSchema = generalSchema;
  const uiSchema: UiSchema = {
    website: {
      details: {
        favicon: {
          "ui:field": (props: FieldProps) => {
            return (
              <ImagesBlockSmall
                value={props.formData}
                label={"Favicon"}
                onChange={(value) => {
                  props.onChange(value[0] ? value[0]._id : "");
                }}
              />
            );
          },
        },
      },
      homepage: {
        background: {
          "ui:field": (props: FieldProps) => {
            return (
              <ImagesBlockSmall
                value={props.formData}
                label={"Background"}
                onChange={(value) => {
                  props.onChange(value[0] ? value[0]._id : "");
                }}
              />
            );
          },
        },
      },
    },
  };

  const onSubmit = <T extends WithId>(data: IChangeEvent<T>) => {
    console.log("Data submitted: ", data.formData);

    const { formData } = data;
    formData && id && token && updateData(formData, id, token);
  };

  return (
    <Form
      schema={schema}
      uiSchema={uiSchema}
      validator={validator}
      onSubmit={onSubmit}
    />
  );
}
