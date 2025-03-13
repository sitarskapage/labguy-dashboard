import { FieldProps, UiSchema } from '@rjsf/utils';
import { hide } from '../../utils/uiSchemaUtils';
import MediaBlockSmall from '../media/MediaBlockSmall';
import TextBlock from '../TextBlock';
import { v4 as uuid } from 'uuid';
import { ProfileJSON, ProfileSchema } from '@jakubkanna/labguy-front-schema';

export const profileUiSchema: UiSchema<ProfileSchema> = {
  picture: {
    'ui:field': (props: FieldProps) => {
      return (
        <MediaBlockSmall
          label="Profile Picture"
          value={
            Array.isArray(props.formData) ? props.formData : [props.formData]
          }
          onChange={(v) => props.onChange(v && v[0])}
        />
      );
    }
  },
  statement: {
    'ui:field': (props: FieldProps) => (
      <TextBlock
        id={'statement'}
        value={props.formData}
        onBlur={(_id, v) => props.onChange(v)}
      />
    )
  },
  additional: {
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
    'homepage_urls',
    'homepage_media',
    'createdAt',
    'updatedAt'
  ])
};

export const homepageUiSchema = {
  homepage_urls: {
    items: { id: { 'ui:widget': 'hidden' } }
  },
  homepage_media: {
    'ui:field': (props: FieldProps) => {
      return (
        <MediaBlockSmall
          label="Background"
          value={
            Array.isArray(props.formData) ? props.formData : [props.formData]
          }
          onChange={(v) => {
            props.onChange(v && v.length ? v[0] : null);
          }}
        />
      );
    }
  },

  ...hide(ProfileJSON, [
    'artists_name',
    'enable_dashboard_darkmode',
    'enable_portfolio_pdf',
    'createdAt',
    'updatedAt'
  ])
};
