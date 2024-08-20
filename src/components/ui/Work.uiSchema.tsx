import { hide } from '../../utils/uiSchemaUtils';
import { FieldProps } from '@rjsf/utils';
import CustomAutocomplete from '../CustomAutocomplete';
import MediaBlock from '../media/MediaBlock';
import { fetchData } from '../../utils/loader';
import { ProjectSchema, WorkJSON } from '@jakubkanna/labguy-front-schema';

const fieldsToHide = ['id', 'createdAt', 'updatedAt'];

export const workUiSchema = {
  ...hide(WorkJSON, fieldsToHide),
  general: {
    ...hide(WorkJSON, fieldsToHide),
    tags: {
      'ui:field': (props: FieldProps) => {
        return (
          <CustomAutocomplete
            value={props.formData}
            onChange={props.onChange}
            fetchOptions={() => fetchData('tags')}
            freeSolo
          />
        );
      }
    }
  },
  projects: {
    'ui:field': (props: FieldProps) => {
      const handleOnChange = (
        selectedOptions: (string | { id: string; title: string })[]
      ) => {
        // Map the selected options back into the expected form structure
        const updatedFormData = selectedOptions.map((opt) => {
          if (typeof opt === 'string') {
            // Handle cases where the option is a string (freeSolo mode)
            return { general: { id: opt, title: opt } };
          } else {
            // Handle cases where the option is an object
            return { id: opt.id, general: opt };
          }
        });

        props.onChange(updatedFormData); // Update form data with the correct structure
      };

      return (
        <CustomAutocomplete
          value={props.formData.map((opt: ProjectSchema) => opt.general)}
          onChange={handleOnChange}
          fetchOptions={async () => {
            const result = await fetchData('projects');
            return result.map((opt: ProjectSchema) => opt.general);
          }}
          freeSolo
          label="Projects"
        />
      );
    }
  },

  images: {
    'ui:field': (props: FieldProps) => {
      return (
        <MediaBlock
          value={props.formData}
          onChange={props.onChange}
          variant="IMAGE"
          label="Images"
          noEdit
        />
      );
    }
  },
  videos: {
    'ui:field': (props: FieldProps) => {
      return (
        <MediaBlock
          value={props.formData}
          onChange={props.onChange}
          variant="VIDEO"
          label="Videos"
          noEdit
        />
      );
    }
  }
};
