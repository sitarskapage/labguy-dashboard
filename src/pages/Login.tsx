import React from "react";
import LoginForm from "../components/login/LoginForm";
import { Box, Grid, Link, Modal, Typography } from "@mui/material";
import { GeneralContext } from "../contexts/GeneralContext";
import { useNavigate } from "react-router-dom";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 500,
  padding: 5,
  borderRadius: 6,
  bgcolor: "background.paper",
};

export default function Login() {
  const [open, setOpen] = React.useState(true);
  const { token, setToken } = React.useContext(GeneralContext);
  const navigate = useNavigate();

  React.useEffect(() => {
    token && navigate("/admin");
  }, [navigate, token]);

  return (
    <>
      <Modal
        open={open}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description">
        <Box sx={style}>
          <Grid container spacing={2}>
            <Grid item>
              <Typography variant="h4">Login</Typography>
            </Grid>
            <Grid item>
              <LoginForm setToken={setToken} setOpen={setOpen} />
            </Grid>
            <Grid item>
              <Link href="#">Forgot password?</Link>
            </Grid>
          </Grid>
        </Box>
      </Modal>
    </>
  );
}
