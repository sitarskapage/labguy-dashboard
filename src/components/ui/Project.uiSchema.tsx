import { FieldProps } from '@rjsf/utils';
import CustomAutocomplete from '../CustomAutocomplete';
import MediaBlock from '../media/MediaBlock';
import { fetchData } from '../../utils/loaders';
import { hide } from '../../utils/uiSchemaUtils';
import {
  GeneralSectionJSON,
  ProjectJSON
} from '@jakubkanna/labguy-front-schema';
import TextBlock from '../TextBlock';
import { v4 as uuid } from 'uuid';
import CustomDateTime from '../CustomDateTime';
import { Divider, Typography } from '@mui/material';
import ProjectWorkTable from '../ProjectWorkTable';

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
  subtitle: {
    'ui:classNames': 'block-text',
    'ui:field': (props: FieldProps) => {
      return (
        <TextBlock
          value={props.formData}
          onBlur={(_id, v) => props.onChange(v)}
          id={uuid()}
          key={uuid()}
          name="Subtitle"
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
            description={GeneralSectionJSON.properties.tags.description}
            freeSolo
          />
        );
      }
    }
  },

  media: {
    'ui:field': (props: FieldProps) => {
      return (
        <MediaBlock
          value={props.formData}
          onChange={props.onChange}
          label="Media"
          description="Media are automatically loaded from related works. To remove related media from the selection, you must first unselect it in the Work panel. Adding more media and reordering are allowed."
          noEdit
        />
      );
    }
  },

  start_date: {
    'ui:field': (props: FieldProps) => {
      return (
        <CustomDateTime
          value={props.formData}
          onChange={props.onChange}
          name={props.name}
        />
      );
    }
  },
  end_date: {
    'ui:field': (props: FieldProps) => {
      return (
        <CustomDateTime
          value={props.formData}
          onChange={props.onChange}
          name={props.name}
        />
      );
    }
  },
  ProjectsOnWorks: {
    'ui:field': (props: FieldProps) => {
      return (
        <>
          <Typography variant="h5">Works</Typography>
          <Divider sx={{ marginBottom: 3 }} />
          <ProjectWorkTable value={props.formData} onChange={props.onChange} />
        </>
      );
    }
  }
};
