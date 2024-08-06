import { useState } from 'react';
import Form from '../../components/Form';
import { Divider, Typography } from '@mui/material';
import { RJSFSchema, UiSchema } from '@rjsf/utils';
import { definitions } from '../../schema/schema.json';
import { useLoaderData, useParams } from 'react-router-dom';
import { GeneralSection } from '../../schema/schema';

interface UpdateProps {
  endpoint: 'projects' | 'works';
  schema: RJSFSchema;
  uiSchema: UiSchema;
}

interface Data {
  general: GeneralSection;
  [key: string]: unknown;
}

const Update: React.FC<UpdateProps> = ({ endpoint, schema, uiSchema }) => {
  const data = useLoaderData() as Data;
  const [formData, setFormData] = useState(data);

  const { id } = useParams();
  if (!id) return;

  const generalSchema = definitions.GeneralSection;

  // Merge the schemas
  const mergedSchema: RJSFSchema = {
    ...schema,
    properties: {
      ...schema.properties,
      general: generalSchema
    }
  };

  console.log('MEGRED SCHEMA', mergedSchema);
  console.log('DATA', data);

  return (
    <>
      <Typography variant="h5">{formData.general.title}</Typography>
      <Divider />
      <Form
        schema={mergedSchema}
        data={formData}
        uiSchema={uiSchema}
        endpoint={{ path: endpoint, id: id }}
        setState={setFormData}
      />
    </>
  );
};

export default Update;
