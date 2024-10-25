import Update from './Update';
import { ProjectJSON, UrlJSON } from '@jakubkanna/labguy-front-schema';
import { RJSFSchema } from '@rjsf/utils';
import { JSONSchema7 } from 'json-schema';
import { projectUiSchema } from '../../components/ui/Project.uiSchema';

const typedUrl = UrlJSON as JSONSchema7;
const typedProject = ProjectJSON as JSONSchema7;

const UpdateProjectWork = () => {
  const projectSchema: RJSFSchema = {
    ...typedProject,
    properties: {
      ...typedProject.properties,
      urls: {
        type: ['array', 'null'],
        items: typedUrl
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
