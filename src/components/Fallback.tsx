import { Alert, Button } from "@mui/material";
import React from "react";

export default function Fallback({
  error,
  resetErrorBoundary,
}: {
  error: Error;
  resetErrorBoundary: () => void;
}) {
  const handleClose = (
    _event: React.SyntheticEvent | Event,
    reason?: string
  ) => {
    resetErrorBoundary();

    if (reason === "clickaway") {
      return;
    }
  };
  const action = (
    <>
      <Button color="secondary" size="small" onClick={handleClose}>
        RESET
      </Button>
    </>
  );

  return (
    <Alert
      severity="error"
      action={action}
      variant="filled"
      sx={{ width: "100%" }}>
      {error.message}
    </Alert>
  );
}
