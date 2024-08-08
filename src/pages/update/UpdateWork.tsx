import Update from './Update';
import Work from '../../schema/Work.schema.json';
import { WorkSchema } from '../../schema/types/Work.schema';
import { workUiSchema } from '../../schema/ui/Work.uiSchema';

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
