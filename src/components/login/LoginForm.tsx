import React, { useState, useContext, useEffect } from 'react';
import { FormControl, Grid, Link, TextField } from '@mui/material';
import { LoadingButton } from '@mui/lab';
import { GeneralContext } from '../../contexts/GeneralContext';
import { useNavigate, useOutletContext } from 'react-router-dom';

const LoginForm = () => {
  const [password, setPassword] = useState('');
  const [email, setEmail] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const { setToken, setExpiresIn } = useContext(GeneralContext);

  const navigate = useNavigate();

  const setTitle =
    useOutletContext<React.Dispatch<React.SetStateAction<string>>>();

  useEffect(() => setTitle('Sign in'), [setTitle]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch(
        `${import.meta.env.VITE_SERVER_API_URL}/signup/login`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email, password })
        }
      );

      const data = await response.json();

      if (!response.ok) throw new Error(data.error.message || 'Error');

      setToken(String(data.token));
      setExpiresIn(Number(data.expiresIn));
      navigate(import.meta.env.VITE_ADMIN_PATH);
    } catch (error) {
      setToken(null);
      setError((error as Error).message);
    } finally {
      setLoading(false);
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
              helperText={error}
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
              helperText={error}
              fullWidth
            />
          </Grid>
          <Grid item xs={12}>
            <LoadingButton variant="contained" type="submit" loading={loading}>
              Login
            </LoadingButton>
          </Grid>
          <Grid item>
            <Link href="/admin/forgot">Forgot password?</Link>
          </Grid>
        </Grid>
      </FormControl>
    </form>
  );
};

export default LoginForm;
