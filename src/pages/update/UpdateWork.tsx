import Update from './Update';
import { definitions } from '../../schema/schema.json';
import { hide } from '../../utils/uiSchemaUtils';
import { FieldProps } from '@rjsf/utils';
import CustomAutocomplete from '../../components/CustomAutocomplete';
import MediaBlock from '../../components/media/MediaBlock';
import { fetchData } from '../../utils/loader';
import { Project } from '../../schema/schema';

const UpdateWork = () => {
  //init
  const workSchema = definitions.Work;
  const fieldsToHide = ['id', 'createdAt', 'updatedAt'];
  const workUiSchema = {
    ...hide(workSchema, fieldsToHide),
    general: {
      ...hide(workSchema, fieldsToHide),
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
                result.map((opt: Project) => opt.general)
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
            title="Images"
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
            title="Videos"
            noEdit
          />
        );
      }
    }
  };

  return (
    <Update
      schema={workSchema}
      uiSchema={workUiSchema}
      endpoint={'works'}
    ></Update>
  );
};

export default UpdateWork;
