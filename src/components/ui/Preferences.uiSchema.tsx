import { FieldProps, UiSchema } from '@rjsf/utils';
import { hide } from '../../utils/uiSchemaUtils';
import MediaBlockSmall from '../media/MediaBlockSmall';
import TextBlock from '../TextBlock';
import { v4 as uuid } from 'uuid';
import { ProfileJSON, ProfileSchema } from '@jakubkanna/labguy-front-schema';

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
  ...hide(ProfileJSON, [
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
        value={
          Array.isArray(props.formData) ? props.formData : [props.formData]
        }
        onChange={props.onChange}
      />
    )
  },
  homepage_background_video: {
    'ui:field': (props: FieldProps) => (
      <MediaBlockSmall
        variant="VIDEO"
        label="Background Video"
        value={
          Array.isArray(props.formData) ? props.formData : [props.formData]
        }
        onChange={props.onChange}
      />
    )
  },
  ...hide(ProfileJSON, [
    'artists_name',
    'enable_dashboard_darkmode',
    'enable_portfolio_pdf',
    'createdAt',
    'updatedAt'
  ])
};
