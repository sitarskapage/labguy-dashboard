import { Alert, Button, IconButton, Snackbar } from "@mui/material";
import { GridCloseIcon } from "@mui/x-data-grid";
import React, { useState } from "react";

export default function Fallback({
  error,
  resetErrorBoundary,
}: {
  error: Error;
  resetErrorBoundary: () => void;
}) {
  const [open, setOpen] = useState(true);

  const handleClose = (
    _event: React.SyntheticEvent | Event,
    reason?: string
  ) => {
    if (reason === "clickaway") {
      return;
    }

    setOpen(false);
  };
  const action = (
    <>
      <Button color="secondary" size="small" onClick={handleClose}>
        RESET
      </Button>
      <IconButton
        size="small"
        aria-label="close"
        color="inherit"
        onClick={handleClose}>
        <GridCloseIcon fontSize="small" />
      </IconButton>
    </>
  );

  const handleAlertClose = () => {
    setOpen(false);
    resetErrorBoundary();
  };

  return (
    <Alert
      onClose={handleAlertClose}
      severity="error"
      action={action}
      variant="filled"
      sx={{ width: "100%" }}>
      This is a success Alert inside a Snackbar!
    </Alert>
  );
}
