import { FieldProps } from '@rjsf/utils';
import CustomAutocomplete from '../../components/CustomAutocomplete';
import MediaBlock from '../../components/media/MediaBlock';
import { fetchData } from '../../utils/loader';
import { hide } from '../../utils/uiSchemaUtils';
import Project from '../../schema/Project.schema.json';

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
