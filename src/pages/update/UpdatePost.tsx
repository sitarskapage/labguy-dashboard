import Update from './Update';
import Post from '../../schema/src/Post.schema.json';
import { postUiSchema } from '../../components/ui/Post.uiSchema';
import { PostSchema } from '../../schema/build';

const UpdatePost = () => {
  const postSchema: PostSchema = Post;

  return (
    <Update
      schema={postSchema}
      uiSchema={postUiSchema}
      endpoint={'posts'}
    ></Update>
  );
};

export default UpdatePost;
