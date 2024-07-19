import React from "react";
import LoginForm from "../components/login/LoginForm";
import { Grid, Link, Modal, Paper, Typography } from "@mui/material";
import { GeneralContext } from "../contexts/GeneralContext";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 500,
  padding: 5,
};

export default function Login({ open = true }) {
  const { setToken, setExpiresIn } = React.useContext(GeneralContext);

  return (
    <>
      <Modal
        open={open}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description">
        <Paper sx={style}>
          <Grid container spacing={2}>
            <Grid item>
              <Typography variant="h4">Login</Typography>
            </Grid>
            <Grid item>
              <LoginForm setToken={setToken} setExpiresIn={setExpiresIn} />
            </Grid>
            <Grid item>
              <Link href="#">Forgot password?</Link>
            </Grid>
          </Grid>
        </Paper>
      </Modal>
    </>
  );
}
