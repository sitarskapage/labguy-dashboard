import Update from './Update';
import { postUiSchema } from '../../components/ui/Post.uiSchema';
import { PostJSON, PostSchema } from '@jakubkanna/labguy-front-schema';

const UpdatePost = () => {
  const postSchema: PostSchema = PostJSON;

  return (
    <Update
      schema={postSchema}
      uiSchema={postUiSchema}
      endpoint={'posts'}
    ></Update>
  );
};

export default UpdatePost;
