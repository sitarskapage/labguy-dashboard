import Update from './Update';
import Project from '../../schema/src/Project.schema.json';
import { ProjectSchema } from '../../schema/build';
import { projectUiSchema } from '../../components/ui/Project.uiSchema';

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
