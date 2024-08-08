import Update from './Update';
import { definitions } from '../../schema/schema.json';
import { hide } from '../../utils/uiSchemaUtils';
import { FieldProps } from '@rjsf/utils';
import CustomAutocomplete from '../../components/CustomAutocomplete';
import { fetchData } from '../../utils/loader';
import TextBlock from '../../components/TextBlock';
import { v4 as uuid } from 'uuid';
import MediaBlock from '../../components/media/MediaBlock';

const UpdatePost = () => {
  //init
  const postSchema = definitions.Post;
  const fieldsToHide = [
    'id',
    'createdAt',
    'updatedAt',
    'generalId',
    'authorEmail'
  ];
  const postUiSchema = {
    ...hide(postSchema, fieldsToHide),
    html: {
      items: {
        anyOf: [
          {
            text: {
              'ui:classNames': 'block-text',
              'ui:field': (props: FieldProps) => {
                return (
                  <TextBlock
                    value={props.formData}
                    onBlur={(_id, v) => props.onChange(v)}
                    id={uuid()}
                    key={uuid()}
                  />
                );
              }
            }
          },
          {
            images: {
              'ui:classNames': 'block-image',
              'ui:field': (props: FieldProps) => {
                return (
                  <MediaBlock
                    value={props.formData}
                    onChange={props.onChange}
                    variant={'IMAGE'}
                    noEdit
                  />
                );
              }
            }
          },
          {
            videos: {
              'ui:classNames': 'block-image',
              'ui:field': (props: FieldProps) => {
                return (
                  <MediaBlock
                    value={props.formData}
                    onChange={props.onChange}
                    variant={'VIDEO'}
                    noEdit
                  />
                );
              }
            }
          }
        ]
      }
    },
    general: {
      ...hide(postSchema, fieldsToHide),
      tags: {
        'ui:field': (props: FieldProps) => {
          return (
            <CustomAutocomplete
              value={props.formData}
              onChange={props.onChange}
              fetchOptions={() => fetchData('tags')}
              freeSolo
            />
          );
        }
      }
    }
  };

  return (
    <Update
      schema={postSchema}
      uiSchema={postUiSchema}
      endpoint={'posts'}
    ></Update>
  );
};

export default UpdatePost;
