import { LoadingButton } from '@mui/lab';
import {
  AlertProps,
  Alert,
  AlertTitle,
  Typography,
  Paper,
  Grid2
} from '@mui/material';
import { ReactNode } from 'react';

interface UploaderProps {
  children: ReactNode;
  alert: AlertProps | null;
  onSubmit: () => void;
  uploading: boolean;
  label?: string;
}
const Uploader = ({
  children,
  alert,
  onSubmit,
  uploading,
  label
}: UploaderProps) => {
  return (
    <Paper>
      <Grid2 container spacing={2} p={2}>
        {/* First row */}
        <Grid2 size={12}>
          <Typography variant="h6">Upload {label}</Typography>
        </Grid2>
        {/* Second row */}
        <Grid2 size={12}>{children}</Grid2>

        {/* Third row - Display alert if alert is provided */}
        {!!alert && alert.children && (
          <Grid2 size={12}>
            <Alert severity={alert.severity}>
              <AlertTitle>{alert.children}</AlertTitle>
            </Alert>
          </Grid2>
        )}

        {/* Fourth row - Display loading button if files are present */}
        <Grid2 size={12}>
          <LoadingButton
            loading={uploading}
            onClick={onSubmit}
            disabled={uploading}
          >
            Upload
          </LoadingButton>
        </Grid2>
      </Grid2>
    </Paper>
  );
};
export default Uploader;
