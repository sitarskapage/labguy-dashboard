import { FieldProps } from '@rjsf/utils';
import CustomAutocomplete from '../CustomAutocomplete';
import MediaBlock from '../media/MediaBlock';
import { fetchData } from '../../utils/loaders';
import { hide } from '../../utils/uiSchemaUtils';
import { ProjectJSON } from '@jakubkanna/labguy-front-schema';
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
  },

  start_date: {
    'ui:field': (props: FieldProps) => {
      return <CustomDateTime value={props.formData} name={props.name} />;
    }
  },
  end_date: {
    'ui:field': (props: FieldProps) => {
      return <CustomDateTime value={props.formData} name={props.name} />;
    }
  },
  ProjectsOnWorks: {
    'ui:field': (props: FieldProps) => {
      return (
        <>
          <Typography variant="h5">Works</Typography>
          <Divider sx={{ marginBottom: 3 }} />
          <ProjectWorkTable
            initData={props.formData}
            onChange={props.onChange}
          />
        </>
      );
    }
  }
};
