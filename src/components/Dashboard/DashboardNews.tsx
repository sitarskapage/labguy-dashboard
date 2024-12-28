import { Paper, Typography } from '@mui/material';
import { useContext, useEffect, useState } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { GeneralContext } from '../../contexts/GeneralContext';

export default function DashboardNews() {
  interface Release {
    body: string;
    published_at: string; //2024-12-27T16:08:19Z
  }
  const { setLoading } = useContext(GeneralContext);
  const [data, setdata] = useState<Release | null>(null);

  useEffect(() => {
    setLoading(true);
    fetch('https://api.github.com/repos/jakubkanna/labguy/releases/latest')
      .then((response) => response.json())
      .then((release) => setdata(release))
      .catch((error) => console.error(error))
      .finally(() => setLoading(false));
  }, []);

  return (
    data && (
      <Paper sx={{ px: 2, py: 2 }} variant="outlined">
        <Typography variant="caption" display={'flex'} justifyContent={'end'}>
          {new Date(data.published_at).toLocaleDateString()}
        </Typography>
        <ReactMarkdown remarkPlugins={[remarkGfm]}>{data.body}</ReactMarkdown>
      </Paper>
    )
  );
}
