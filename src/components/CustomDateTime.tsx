import { Box, Container, Grid2, Paper, Typography } from '@mui/material';
import {
  DatePicker,
  LocalizationProvider,
  TimePicker
} from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';

export default function CustomDateTime({ value, name }) {
  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <Paper variant="outlined" sx={{ p: 2 }}>
        <Grid2 container alignItems="center" spacing={2}>
          <Grid2 size={3}>
            <Typography variant="caption" color="textSecondary">
              {name}
            </Typography>
          </Grid2>
          <Grid2 size={9}>
            <Box display={'flex'} gap={2}>
              <DatePicker
                label={'"month" and "year"'}
                views={['year', 'month']}
                sx={{ minWidth: 150 }}
              />
              <DatePicker
                label={'"day"'}
                views={['day']}
                sx={{ minWidth: 150 }}
              />
              <TimePicker label="Basic time picker" sx={{ minWidth: 150 }} />
            </Box>
          </Grid2>
        </Grid2>
      </Paper>
    </LocalizationProvider>
  );
}
