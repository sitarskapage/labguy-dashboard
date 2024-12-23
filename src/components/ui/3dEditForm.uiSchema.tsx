import { FieldProps } from '@rjsf/utils';
import { hide } from '../../utils/uiSchemaUtils';
import { ThreedRefJSON } from '@jakubkanna/labguy-front-schema';
import { MuiColorInput } from 'mui-color-input';
import MediaBlockSmall from '../media/MediaBlockSmall';

const fieldsToHide = ['etag'];

export const threedUiSchema = {
  ...hide(ThreedRefJSON, fieldsToHide),
  backgroundColor: {
    'ui:field': (props: FieldProps) => (
      <MuiColorInput
        value={(props.formData as string | null) || ''}
        onChange={(value: string) => props.onChange(value)}
        format="rgb"
        label="Background Color"
      />
    )
  },
  poster: {
    'ui:field': (props: FieldProps) => (
      <MediaBlockSmall
        label="Poster"
        value={[props.formData]}
        onChange={(v) => v && props.onChange(v[0])}
        variant="IMAGE"
        description={props.schema.description}
      />
    )
  }
};
