import { Outlet } from 'react-router-dom';
import { Box, Container, LinearProgress, Typography } from '@mui/material';
import { useEffect, useState } from 'react';
import { ErrorBoundary } from 'react-error-boundary';
import Fallback from './Fallback';

const PageContainer = ({ title }: { title: string }) => {
  useEffect(() => {
    document.title = title;
  }, [title]);

  const [loading, setLoading] = useState(false);

  return (
    <ErrorBoundary FallbackComponent={Fallback}>
      <Container sx={{ pt: 3 }}>
        {!!loading && <LinearProgress />}
        <Box style={{ marginBottom: '20px' }}>
          <Typography variant="h4">{title}</Typography>
        </Box>
        <Box sx={{ minHeight: '300px', mx: 1 }}>
          <Outlet context={[loading, setLoading]} />
        </Box>
      </Container>{' '}
    </ErrorBoundary>
  );
};

export default PageContainer;
