import { LoadingButton } from "@mui/lab";
import { AlertProps, Grid, Alert, AlertTitle, Typography } from "@mui/material";
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
    <Grid container spacing={2}>
      {/* First row */}
      <Grid item xs={12}>
        <Typography variant="h6">Upload {label}</Typography>
      </Grid>
      {/* Second row */}
      <Grid item xs={12}>
        {children}
      </Grid>

      {/* Second row - Display alert if alert is provided */}
      {!!alert && alert.children && (
        <Grid item xs={12}>
          <Alert severity={alert.severity}>
            <AlertTitle>{alert.children}</AlertTitle>
          </Alert>
        </Grid>
      )}

      {/* Third row - Display loading button if files are present */}
      <Grid item xs={12}>
        <LoadingButton
          loading={uploading}
          onClick={onSubmit}
          disabled={uploading}>
          Upload
        </LoadingButton>
      </Grid>
    </Grid>
  );
};
export default Uploader;
