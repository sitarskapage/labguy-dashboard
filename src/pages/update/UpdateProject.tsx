import Update from './Update';
import Project from '../../schema/Project.schema.json';
import { ProjectSchema } from '../../schema/types/Project.schema';
import { projectUiSchema } from '../../schema/ui/Project.uiSchema';

const UpdateProjectWork = () => {
  const projectSchema: ProjectSchema = Project;

  return (
    <Update
      schema={projectSchema}
      uiSchema={projectUiSchema}
      endpoint={'projects'}
    ></Update>
  );
};

export default UpdateProjectWork;
