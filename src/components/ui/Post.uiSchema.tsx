import { FieldProps } from '@rjsf/utils';
import CustomAutocomplete from '../CustomAutocomplete';
import MediaBlock from '../media/MediaBlock';
import TextBlock from '../TextBlock';
import { fetchData } from '../../utils/loaders';
import { hide } from '../../utils/uiSchemaUtils';
import { v4 as uuid } from 'uuid';
import { GeneralSectionJSON, PostJSON } from '@jakubkanna/labguy-front-schema';

const fieldsToHide = [
  'id',
  'createdAt',
  'updatedAt',
  'generalId',
  'authorEmail'
];

export const postUiSchema = {
  ...hide(PostJSON, fieldsToHide),
  content: {
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
    ...hide(PostJSON, fieldsToHide),
    tags: {
      'ui:field': (props: FieldProps) => {
        return (
          <CustomAutocomplete
            value={props.formData}
            onChange={props.onChange}
            fetchOptions={() => fetchData('tags')}
            description={GeneralSectionJSON.properties.tags.description}
            freeSolo
          />
        );
      }
    }
  }
};
