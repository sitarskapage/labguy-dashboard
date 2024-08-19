import Update from './Update';
import { workUiSchema } from '../../components/ui/Work.uiSchema';
import { WorkJSON, WorkSchema } from '@jakubkanna/labguy-front-schema';

const UpdateWork = () => {
  //init
  const workSchema: WorkSchema = WorkJSON;

  return (
    <Update
      schema={workSchema}
      uiSchema={workUiSchema}
      endpoint={'works'}
    ></Update>
  );
};

export default UpdateWork;
