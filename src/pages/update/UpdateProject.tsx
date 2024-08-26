import Update from './Update';
import { projectUiSchema } from '../../components/ui/Project.uiSchema';
import { ProjectJSON, UrlJSON } from '@jakubkanna/labguy-front-schema';
import { RJSFSchema } from '@rjsf/utils';

const UpdateProjectWork = () => {
  const projectSchema: RJSFSchema = {
    ...ProjectJSON,
    properties: {
      ...ProjectJSON.properties,
      urls: {
        type: 'array',
        items: UrlJSON
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
