import { RJSFSchema } from '@rjsf/utils';
import Form from '../../Form';
import { ImageRefSchema } from '@jakubkanna/labguy-front-schema';
import { Box } from '@mui/material';
import { useState } from 'react';

interface ImageEditFormProps {
  reference: ImageRefSchema;
}

export default function ImageEditForm({ reference }: ImageEditFormProps) {
  const { public_id } = reference;
  const [data, setData] = useState(reference);

  if (!public_id) return null;

  const schema: RJSFSchema = {
    type: 'object',
    title: 'Edit: ' + (public_id || 'Image'),
    properties: {
      alt: { type: 'string' },
      description: { type: 'string' }
    }
  };

  return (
    <Box p={2}>
      <Form
        data={data}
        schema={schema}
        endpoint={{ path: 'images', id: public_id }}
        setState={setData}
      />
    </Box>
  );
}
