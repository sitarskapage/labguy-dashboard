import { RJSFSchema } from '@rjsf/utils';
import Form from '../../Form';
import { VideoRefSchema } from '@jakubkanna/labguy-front-schema';
import { Box } from '@mui/material';
import { useState } from 'react';

interface VideoEditFormProps {
  reference: VideoRefSchema;
}

export default function VideoEditForm({ reference }: VideoEditFormProps) {
  const { title, public_id } = reference;
  const [data, setData] = useState(reference);

  if (!public_id) return null;

  const schema: RJSFSchema = {
    type: 'object',
    title: 'Edit: ' + (title || 'Video')
  };

  return (
    <Box p={2}>
      <Form
        data={data}
        schema={schema}
        endpoint={{ path: 'videos', id: public_id }}
        setState={setData}
      />
    </Box>
  );
}
