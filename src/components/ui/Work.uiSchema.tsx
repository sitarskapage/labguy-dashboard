import { hide } from '../../utils/uiSchemaUtils';
import { FieldProps } from '@rjsf/utils';
import CustomAutocomplete from '../CustomAutocomplete';
import MediaBlock from '../media/MediaBlock';
import { fetchData } from '../../utils/loaders';
import {
  GeneralSectionSchema,
  ProjectSchema,
  WorkJSON
} from '@jakubkanna/labguy-front-schema';

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

        props.onChange(updatedFormData);
      };

      return (
        <CustomAutocomplete
          value={props.formData.map((opt: ProjectSchema) => {
            return {
              id: opt.id,
              title: (opt.general as GeneralSectionSchema).title
            };
          })}
          onChange={handleOnChange}
          fetchOptions={async () => {
            const result = await fetchData('projects');
            return result.map((opt: ProjectSchema) => {
              return {
                id: opt.id,
                title: (opt.general as GeneralSectionSchema).title
              };
            });
          }}
          freeSolo
          label="Projects"
        />
      );
    }
  },

  media: {
    'ui:field': (props: FieldProps) => {
      return (
        <MediaBlock
          value={props.formData}
          onChange={props.onChange}
          label="Media"
          noEdit
        />
      );
    }
  }
};
