import { ReactNode } from "react";
import { Alert, AlertProps, AlertTitle, Grid } from "@mui/material";
import LoadingButton from "@mui/lab/LoadingButton";

interface UploaderBodyProps {
  children: ReactNode;
  alert: AlertProps | null;
  onClick: () => void;
  uploading: boolean;
}

const UploaderBody = ({
  children,
  alert,
  onClick,
  uploading,
}: UploaderBodyProps) => {
  return (
    <Grid container spacing={2}>
      {/* First row */}
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
          onClick={onClick}
          disabled={uploading}>
          Upload
        </LoadingButton>
      </Grid>
    </Grid>
  );
};

export default UploaderBody;
