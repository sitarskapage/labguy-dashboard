import { FieldProps } from '@rjsf/utils';
import CustomAutocomplete from '../../components/CustomAutocomplete';
import MediaBlock from '../../components/media/MediaBlock';
import { hide } from '../../utils/uiSchemaUtils';
import Work from '../../schema/Work.schema.json';
import { ProjectSchema } from '../types/Project.schema';
import { fetchData } from '../../utils/loader';

const fieldsToHide = ['id', 'createdAt', 'updatedAt'];

export const workUiSchema = {
  ...hide(Work, fieldsToHide),
  general: {
    ...hide(Work, fieldsToHide),
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
      return (
        <CustomAutocomplete
          value={props.formData}
          onChange={props.onChange}
          fetchOptions={() => {
            return fetchData('projects').then((result) =>
              result.map((opt: ProjectSchema) => opt.general)
            );
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
