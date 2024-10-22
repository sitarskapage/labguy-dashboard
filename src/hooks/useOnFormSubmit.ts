import { IChangeEvent } from '@rjsf/core';
import { useContext } from 'react';
import { GeneralContext } from '../contexts/GeneralContext';
import useRequest from './useRequest';

// Define the hook with necessary parameters
export const useOnFormSubmit = <T>(
  id: number,
  path: string,
  setState?: (data: T) => void
) => {
  const generalContext = useContext(GeneralContext);
  const { updateData } = useRequest<T>();

  // Return an async function to handle the form submission
  return async (data: IChangeEvent<T>) => {
    const { formData } = data;

    // Extract context values
    const token = generalContext.token;
    const setSnackbar = generalContext.setSnackbar;

    try {
      if (token) {
        await updateData(formData, path, id, token);
      }

      if (formData && setState) {
        setState(formData);
      }

      setSnackbar({ children: 'Success', severity: 'success' });
    } catch (error) {
      setSnackbar({ children: 'Update failed', severity: 'error' });
      throw error;
    }
  };
};
