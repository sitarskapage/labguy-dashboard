import Update from './Update';
import { definitions } from '../../schema/schema.json';
import { hide } from '../../utils/uiSchemaUtils';
import { FieldProps } from '@rjsf/utils';
import MediaBlock from '../../components/media/MediaBlock';
import CustomAutocomplete from '../../components/CustomAutocomplete';
import { fetchData } from '../../utils/loader';

const UpdateProjectWork = () => {
  //init
  const projectSchema = definitions.Project;
  const fieldsToHide = ['id', 'createdAt', 'updatedAt'];
  const projectUiSchema = {
    ...hide(projectSchema, fieldsToHide),
    general: {
      ...hide(projectSchema, fieldsToHide),
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
      schema={projectSchema}
      uiSchema={projectUiSchema}
      endpoint={'projects'}
    ></Update>
  );
};

export default UpdateProjectWork;
