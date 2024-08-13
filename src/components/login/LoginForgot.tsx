import React, { useEffect } from 'react';
import { FormControl, Grid, TextField, Typography } from '@mui/material';
import { LoadingButton } from '@mui/lab';
import { styled } from '@mui/material/styles';
import { useOutletContext } from 'react-router-dom';

const StyledTypography = styled(Typography)(({ theme }) => ({
  color: theme.palette.success.main,
  textAlign: 'center'
}));

const ForgotForm = () => {
  const [email, setEmail] = React.useState('');
  const [error, setError] = React.useState<string | null>(null);
  const [successMessage, setSuccessMessage] = React.useState<string | null>(
    null
  );
  const [loading, setLoading] = React.useState(false);
  const [submitted, setSubmitted] = React.useState(false);

  const setTitle =
    useOutletContext<React.Dispatch<React.SetStateAction<string>>>();

  useEffect(() => setTitle('Forgot Password'), [setTitle]);

  const isValidEmail = (email: string) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    // Basic email validation
    if (!email) {
      setError('Email is required');
      setSuccessMessage(null);
      setLoading(false);
      return;
    } else if (!isValidEmail(email)) {
      setError('Invalid email format');
      setSuccessMessage(null);
      setLoading(false);
      return;
    }

    setError(null);
    setSuccessMessage(null);

    try {
      const response = await fetch(
        `${import.meta.env.VITE_SERVER_API_URL}/signup/forgot`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email })
        }
      );

      const data = await response.json();

      if (!response.ok) throw new Error(data.error.message || 'Error');

      // Handle success
      setSuccessMessage('A reset link has been sent to your email ✨');
      setEmail('');
      setSubmitted(true);
    } catch (err) {
      // Handle errors here
      setError('An error occurred. Please try again.');
      setSuccessMessage(null);
    }

    setLoading(false);
  };

  return (
    <FormControl fullWidth>
      <Grid container spacing={2}>
        <Grid item xs={12}>
          {submitted ? (
            <StyledTypography variant="h6">{successMessage}</StyledTypography>
          ) : (
            <form onSubmit={handleSubmit}>
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <TextField
                    error={!!error}
                    label="Email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email"
                    fullWidth
                  />
                  {error && (
                    <Typography color="error" variant="body2">
                      {error}
                    </Typography>
                  )}
                </Grid>
                <Grid item xs={12}>
                  <LoadingButton
                    variant="contained"
                    type="submit"
                    loading={loading}
                  >
                    Send Reset Link
                  </LoadingButton>
                </Grid>
              </Grid>
            </form>
          )}
        </Grid>
      </Grid>
    </FormControl>
  );
};

export default ForgotForm;
