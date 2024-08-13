import React, { useEffect, useState } from 'react';
import { FormControl, Grid, TextField, Typography } from '@mui/material';
import { LoadingButton } from '@mui/lab';
import { useNavigate, useLocation, useOutletContext } from 'react-router-dom';

const ResetForm = () => {
  const [password, setPassword] = useState('');
  const [passwordRepeat, setPasswordRepeat] = useState('');
  const [passwordError, setPasswordError] = useState<string | null>(null);
  const [passwordRepeatError, setPasswordRepeatError] = useState<string | null>(
    null
  );
  const [success, setSuccess] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();

  const setTitle =
    useOutletContext<React.Dispatch<React.SetStateAction<string>>>();

  useEffect(() => setTitle('Reset Password'), [setTitle]);

  // Extract the token from the query parameters
  const queryParams = new URLSearchParams(location.search);
  const token = queryParams.get('token');

  const passwordValidations = [
    {
      test: (password: string) => password.length >= 12,
      message: 'Password must be at least 12 characters long'
    },
    {
      test: (password: string) => /[a-z]/.test(password),
      message: 'Password must contain at least one lowercase letter'
    },
    {
      test: (password: string) => /[A-Z]/.test(password),
      message: 'Password must contain at least one uppercase letter'
    },
    {
      test: (password: string) => /[0-9]/.test(password),
      message: 'Password must contain at least one number'
    },
    {
      test: (password: string) => /[!@#$%^&*(),.?":{}|<>]/.test(password),
      message: 'Password must contain at least one special character'
    }
  ];

  const validatePassword = (password: string): string | null => {
    for (const validation of passwordValidations) {
      if (!validation.test(password)) {
        return validation.message;
      }
    }
    return null;
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newPassword = e.target.value;
    setPassword(newPassword);

    const error = validatePassword(newPassword);
    setPasswordError(error);
  };

  const handlePasswordRepeatChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const newPasswordRepeat = e.target.value;
    setPasswordRepeat(newPasswordRepeat);

    if (newPasswordRepeat !== password) {
      setPasswordRepeatError('Passwords do not match');
    } else {
      setPasswordRepeatError(null);
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    // Final validation before submitting
    const passwordError = validatePassword(password);
    if (passwordError) {
      setPasswordError(passwordError);
      setLoading(false);
      return;
    }

    if (password !== passwordRepeat) {
      setPasswordRepeatError('Passwords do not match');
      setLoading(false);
      return;
    }

    if (!token) {
      setPasswordError('Invalid or missing token');
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
      setPasswordError((error as Error).message);
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
              error={!!passwordError}
              label="New Password"
              type="password"
              value={password}
              onChange={handlePasswordChange}
              placeholder="Enter new password"
              helperText={passwordError}
              fullWidth
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              error={!!passwordRepeatError}
              label="Confirm New Password"
              type="password"
              value={passwordRepeat}
              onChange={handlePasswordRepeatChange}
              placeholder="Repeat new password"
              helperText={passwordRepeatError}
              fullWidth
            />
          </Grid>
          <Grid item xs={12}>
            {success && (
              <Typography variant="body1" color="success.main">
                {success}
              </Typography>
            )}
            <LoadingButton
              variant="contained"
              type="submit"
              loading={loading}
              disabled={!!passwordError || !!passwordRepeatError}
            >
              Reset Password
            </LoadingButton>
          </Grid>
        </Grid>
      </FormControl>
    </form>
  );
};

export default ResetForm;
