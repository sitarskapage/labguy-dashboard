import { FieldProps, UiSchema } from '@rjsf/utils';
import { hide } from '../../utils/uiSchemaUtils';
import MediaBlockSmall from '../media/MediaBlockSmall';
import Profile from '../../schema/src/Profile.schema.json';
import TextBlock from '../TextBlock';
import { v4 as uuid } from 'uuid';
import { ProfileSchema } from '../../schema/build';

export const profileUiSchema: UiSchema<ProfileSchema> = {
  html_statement: {
    'ui:field': (props: FieldProps) => (
      <TextBlock
        id={'html_statement'}
        value={props.formData}
        onBlur={(_id, v) => props.onChange(v)}
      />
    )
  },
  html_additional: {
    items: {
      html: {
        'ui:field': (props: FieldProps) => (
          <TextBlock
            id={uuid()}
            value={props.formData}
            onBlur={(_id, v) => props.onChange(v)}
            key={uuid()}
          />
        )
      }
    }
  },
  contact: {
    items: {
      id: {
        'ui:widget': 'hidden'
      },
      socialmedia: {
        items: {
          id: {
            'ui:widget': 'hidden'
          }
        }
      }
    }
  }
};
export const generalUiSchema = {
  background: {
    'ui:widget': () => null
  },
  ...hide(Profile, [
    'homepage_heading',
    'homepage_subheading',
    'homepage_background_video',
    'homepage_background_image',
    'createdAt',
    'updatedAt'
  ])
};
export const homepageUiSchema = {
  homepage_background_image: {
    'ui:field': (props: FieldProps) => (
      <MediaBlockSmall
        variant="IMAGE"
        label="Background Image"
        value={[props.formData]}
        onChange={props.onChange}
      />
    )
  },
  homepage_background_video: {
    'ui:field': (props: FieldProps) => (
      <MediaBlockSmall
        variant="VIDEO"
        label="Background Video"
        value={[props.formData]}
        onChange={props.onChange}
      />
    )
  },
  ...hide(Profile, [
    'creator_name',
    'enable_dashboard_darkmode',
    'enable_portfolio_pdf',
    'createdAt',
    'updatedAt'
  ])
};
