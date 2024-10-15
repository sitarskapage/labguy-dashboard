import { useContext } from 'react';
import { withTheme } from '@rjsf/core';
import { Theme as MuiTheme } from '@rjsf/mui';
import { IChangeEvent } from '@rjsf/core';
import { customizeValidator } from '@rjsf/validator-ajv8';
import { RJSFSchema, UiSchema } from '@rjsf/utils';
import useRequest from '../hooks/useRequest';
import { GeneralContext } from '../contexts/GeneralContext';

interface FormProps<T> {
  data?: T;
  uiSchema?: UiSchema<T>;
  schema: RJSFSchema;
  endpoint?: { path: string; id: string | number };
  setState?: (newMedia: T) => void;
  enableContextData?: boolean;
}

export default function Form<T>({
  data,
  uiSchema,
  schema,
  endpoint,
  setState,
  enableContextData
}: FormProps<T>) {
  const { token, setSnackbar } = useContext(GeneralContext);
  const { updateData } = useRequest<T>();
  const Form = withTheme<T>(MuiTheme);
  const validator = customizeValidator<T>();

  const onSubmit = async (data: IChangeEvent<T>) => {
    const { formData } = data;
    // Check if endpoint is defined
    if (!endpoint) {
      setSnackbar({ children: 'Endpoint is not defined', severity: 'error' });
      return;
    }

    const { path, id } = endpoint;

    try {
      if (token) {
        await updateData(formData, path, id, token);
      }

      if (formData && setState) {
        setState(formData);
      }

      setSnackbar({ children: 'Update successful', severity: 'success' });
    } catch (error) {
      setSnackbar({ children: 'Update failed', severity: 'error' });
      throw error;
    }
  };

  return (
    <Form
      schema={schema}
      uiSchema={uiSchema}
      validator={validator}
      onSubmit={onSubmit}
      formData={data}
      formContext={enableContextData && { data: data }}
    />
  );
}
