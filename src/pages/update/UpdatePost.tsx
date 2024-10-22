import Update from './Update';
import { postUiSchema } from '../../components/ui/Post.uiSchema';
import { PostJSON } from '@jakubkanna/labguy-front-schema';
import { JSONSchema7 } from 'json-schema';

const UpdatePost = () => {
  const postSchema = PostJSON as unknown as JSONSchema7;

  return (
    <Update
      schema={postSchema}
      uiSchema={postUiSchema}
      endpoint={'posts'}
    ></Update>
  );
};

export default UpdatePost;
