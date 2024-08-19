import Update from './Update';
import { projectUiSchema } from '../../components/ui/Project.uiSchema';
import { ProjectJSON, ProjectSchema } from '@jakubkanna/labguy-front-schema';

const UpdateProjectWork = () => {
  const projectSchema: ProjectSchema = ProjectJSON;

  return (
    <Update
      schema={projectSchema}
      uiSchema={projectUiSchema}
      endpoint={'projects'}
    ></Update>
  );
};

export default UpdateProjectWork;
