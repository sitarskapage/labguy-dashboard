import { RJSFSchema } from '@rjsf/utils';
import Form from '../../Form';
import { ThreedRef } from '@jakubkanna/labguy-front-schema';
import { threedUiSchema } from '../../ui/3dEditForm.uiSchema';
import { Box } from '@mui/material';
import { useState } from 'react';

export default function ThreedEditForm({
  reference
}: {
  reference: ThreedRef;
}) {
  const { public_id } = reference;
  const [data, setData] = useState(reference);

  if (!public_id) return;

  const schema: RJSFSchema = {
    type: 'object',
    title: 'Edit: ' + (public_id || '3D Object'),
    properties: {
      etag: { type: 'string' },
      poster: { type: 'object' },
      backgroundColor: { type: 'string' }
    }
  };

  return (
    <Box p={2}>
      <Form
        data={data}
        schema={schema}
        uiSchema={threedUiSchema}
        endpoint={{ path: 'models', id: public_id }}
        setState={setData}
      ></Form>
    </Box>
  );
}
