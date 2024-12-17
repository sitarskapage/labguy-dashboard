import Update from './Update';
import { workUiSchema } from '../../components/ui/Work.uiSchema';
import { UrlJSON, WorkJSON } from '@jakubkanna/labguy-front-schema';
import { JSONSchema7 } from 'json-schema';

const typedUrl = UrlJSON as JSONSchema7;

const UpdateWork = () => {
  //init
  const workSchema = {
    properties: {
      ...WorkJSON.properties,
      urls: {
        type: ['array', 'null'],
        items: typedUrl
      }
    }
  } as JSONSchema7;

  return (
    <Update
      schema={workSchema}
      uiSchema={workUiSchema}
      endpoint={'works'}
    ></Update>
  );
};

export default UpdateWork;
