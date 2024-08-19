import { useState } from 'react';
import Form from '../../components/Form';
import { Divider, Typography } from '@mui/material';
import { RJSFSchema, UiSchema } from '@rjsf/utils';
import { useLoaderData, useParams } from 'react-router-dom';
import {
  GeneralSectionJSON,
  GeneralSectionSchema
} from '@jakubkanna/labguy-front-schema';

interface UpdateProps {
  endpoint: 'projects' | 'works' | 'posts';
  schema: RJSFSchema;
  uiSchema: UiSchema;
}

interface Data {
  general: GeneralSectionSchema;
  [key: string]: unknown;
}

const Update: React.FC<UpdateProps> = ({ endpoint, schema, uiSchema }) => {
  const { id } = useParams();
  const data = useLoaderData() as Data;
  const [formData, setFormData] = useState(data);

  if (!id) return;

  const generalSchema: GeneralSectionSchema = GeneralSectionJSON;

  const mergedSchema: RJSFSchema = {
    ...schema,
    properties: {
      ...schema.properties,
      general: generalSchema
    }
  };

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
