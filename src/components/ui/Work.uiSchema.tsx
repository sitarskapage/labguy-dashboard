import { hide } from '../../utils/uiSchemaUtils';
import { FieldProps } from '@rjsf/utils';
import Work from '../../schema/src/Work.schema.json';
import CustomAutocomplete from '../CustomAutocomplete';
import MediaBlock from '../media/MediaBlock';
import { fetchData } from '../../utils/loader';
import { ProjectSchema } from '../../schema/build';

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
