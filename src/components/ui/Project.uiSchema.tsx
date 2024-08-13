import { FieldProps } from '@rjsf/utils';
import Project from '../../schema/src/Project.schema.json';
import CustomAutocomplete from '../CustomAutocomplete';
import MediaBlock from '../media/MediaBlock';
import { fetchData } from '../../utils/loader';
import { hide } from '../../utils/uiSchemaUtils';

const fieldsToHide = ['id', 'createdAt', 'updatedAt'];

export const projectUiSchema = {
  ...hide(Project, fieldsToHide),
  general: {
    ...hide(Project, fieldsToHide),
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
