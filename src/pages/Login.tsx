import { Grid, Modal, Paper, Typography } from '@mui/material';
import { useState } from 'react';
import { Outlet } from 'react-router-dom';

const modalPaperStyles = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 500,
  padding: 5
};

export default function Login({ open = true }) {
  const [title, setTitle] = useState('Login');

  return (
    <Modal
      open={open}
      aria-labelledby="modal-login"
      aria-describedby="modal-login-form"
    >
      <Paper sx={modalPaperStyles}>
        <Grid container spacing={2}>
          <Grid item>
            <Typography variant="h4">{title}</Typography>
          </Grid>
          <Grid item>
            <Outlet context={setTitle} />
          </Grid>
        </Grid>
      </Paper>
    </Modal>
  );
}
