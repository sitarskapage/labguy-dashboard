import Update from './Update';
import Post from '../../schema/Post.schema.json';
import { PostSchema } from '../../schema/types/Post.schema';
import { postUiSchema } from '../../schema/ui/Post.uiSchema';

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
