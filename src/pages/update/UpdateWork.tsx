import Update from './Update';
import { WorkSchema } from '../../schema/build';
import { workUiSchema } from '../../components/ui/Work.uiSchema';
import Work from '../../schema/src/Work.schema.json';

const UpdateWork = () => {
  //init
  const workSchema: WorkSchema = Work;

  return (
    <Update
      schema={workSchema}
      uiSchema={workUiSchema}
      endpoint={'works'}
    ></Update>
  );
};

export default UpdateWork;
