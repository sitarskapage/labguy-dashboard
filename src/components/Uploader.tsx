import { LoadingButton } from "@mui/lab";
import {
  AlertProps,
  Grid,
  Alert,
  AlertTitle,
  Typography,
  Paper,
} from "@mui/material";
import { ReactNode } from "react";

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
  label,
}: UploaderProps) => {
  return (
    <Paper>
      <Grid container spacing={2} p={2}>
        {/* First row */}
        <Grid item xs={12}>
          <Typography variant="h6">Upload {label}</Typography>
        </Grid>
        {/* Second row */}
        <Grid item xs={12}>
          {children}
        </Grid>

        {/* Third row - Display alert if alert is provided */}
        {!!alert && alert.children && (
          <Grid item xs={12}>
            <Alert severity={alert.severity}>
              <AlertTitle>{alert.children}</AlertTitle>
            </Alert>
          </Grid>
        )}

        {/* Fourth row - Display loading button if files are present */}
        <Grid item xs={12}>
          <LoadingButton
            loading={uploading}
            onClick={onSubmit}
            disabled={uploading}>
            Upload
          </LoadingButton>
        </Grid>
      </Grid>
    </Paper>
  );
};
export default Uploader;
