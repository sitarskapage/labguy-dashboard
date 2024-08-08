import React, { useState } from 'react';
import { FormControl, Grid, TextField, Typography } from '@mui/material';
import { LoadingButton } from '@mui/lab';
import { useNavigate, useLocation } from 'react-router-dom';

const ResetForm = () => {
  const [password, setPassword] = useState('');
  const [passwordRepeat, setPasswordRepeat] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();

  // Extract the token from the query parameters
  const queryParams = new URLSearchParams(location.search);
  const token = queryParams.get('token'); // Directly get the token

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    if (password !== passwordRepeat) {
      setError('Passwords do not match');
      setLoading(false);
      return;
    }

    if (!token) {
      setError('Invalid or missing token');
      setLoading(false);
      return;
    }

    try {
      const response = await fetch(
        `${import.meta.env.VITE_SERVER_API_URL}/signup/reset-password?token=${token}`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ password })
        }
      );

      const data = await response.json();

      if (!response.ok) throw new Error(data.error.message || 'Error');

      setSuccess('Password has been reset successfully. You can now log in.');
      setTimeout(() => navigate('/admin/login'), 3000); // Redirect after 3 seconds
    } catch (error) {
      setError((error as Error).message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <FormControl fullWidth>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <TextField
              error={!!error}
              label="New Password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter new password"
              helperText={error}
              fullWidth
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              error={!!error}
              label="Confirm New Password"
              type="password"
              value={passwordRepeat}
              onChange={(e) => setPasswordRepeat(e.target.value)}
              placeholder="Repeat new password"
              helperText={error}
              fullWidth
            />
          </Grid>
          <Grid item xs={12}>
            {success && (
              <Typography variant="body1" color="success.main">
                {success}
              </Typography>
            )}
            <LoadingButton variant="contained" type="submit" loading={loading}>
              Reset Password
            </LoadingButton>
          </Grid>
        </Grid>
      </FormControl>
    </form>
  );
};

export default ResetForm;
