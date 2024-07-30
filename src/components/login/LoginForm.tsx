import React from "react";
import { FormControl, Grid, TextField } from "@mui/material";
import { LoadingButton } from "@mui/lab";

interface LoginFormProps {
  setToken: React.Dispatch<React.SetStateAction<string | null>>;
  setExpiresIn: React.Dispatch<React.SetStateAction<number | null>>;
}

const LoginForm: React.FC<LoginFormProps> = ({ setToken, setExpiresIn }) => {
  const [password, setPassword] = React.useState("");
  const [email, setEmail] = React.useState("");
  const [error, setError] = React.useState<string | null>(null);
  const [loading, setLoading] = React.useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    setLoading(true);
    e.preventDefault();

    const requestBody = {
      email: email,
      password: password,
    };

    try {
      const response = await fetch(
        `${import.meta.env.VITE_SERVER_API_URL}user/login`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(requestBody),
        }
      );

      const data = await response.json();

      if (response.ok) {
        const token = String(data.token);
        const expiresIn = Number(data.expiresIn);

        setToken(token);
        setExpiresIn(expiresIn);
        return;
      } else {
        setToken(null);
        setLoading(false);
        throw new Error(data.error.message || "Error");
      }
    } catch (error) {
      setError((error as Error).message);
      throw error;
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <FormControl>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <TextField
              error={!!error}
              label="Email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Email"
              helperText={error && error}
              fullWidth
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              error={!!error}
              label="Password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Password"
              helperText={error && error}
              fullWidth
            />
          </Grid>
          <Grid item xs={12}>
            <LoadingButton variant="contained" type="submit" loading={loading}>
              Login
            </LoadingButton>
          </Grid>
        </Grid>
      </FormControl>
    </form>
  );
};

export default LoginForm;
