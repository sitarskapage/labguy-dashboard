import { FieldProps } from '@rjsf/utils';
import CustomAutocomplete from '../CustomAutocomplete';
import MediaBlock from '../media/MediaBlock';
import { fetchData } from '../../utils/loader';
import { hide } from '../../utils/uiSchemaUtils';
import { ProjectJSON } from '@jakubkanna/labguy-front-schema';
import TextBlock from '../TextBlock';
import { v4 as uuid } from 'uuid';

const fieldsToHide = ['id', 'createdAt', 'updatedAt'];

export const projectUiSchema = {
  ...hide(ProjectJSON, fieldsToHide),
  urls: {
    items: { id: { 'ui:widget': 'hidden' } }
  },
  text: {
    'ui:classNames': 'block-text',
    'ui:field': (props: FieldProps) => {
      return (
        <TextBlock
          value={props.formData}
          onBlur={(_id, v) => props.onChange(v)}
          id={uuid()}
          key={uuid()}
        />
      );
    }
  },
  general: {
    ...hide(ProjectJSON, fieldsToHide),
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
