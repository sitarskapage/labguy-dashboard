import { Box, Paper, TextField, Typography } from '@mui/material';
import {
  DatePicker,
  LocalizationProvider,
  TimePicker
} from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { useEffect, useState } from 'react';
import dayjs, { Dayjs } from 'dayjs';

interface CustomDateTimeProps {
  value: DateObject;
  onChange: (v: DateObject) => void;
  name?: string;
}

type DateObject = {
  day?: number;
  month?: number;
  year?: number;
  time?: string;
};

export default function CustomDateTime({
  value,
  onChange,
  name = 'date'
}: CustomDateTimeProps) {
  // Convert initial `value` into a Dayjs object (or null)
  const initialDate =
    value &&
    value.year !== undefined &&
    value.month !== undefined &&
    value.day !== undefined
      ? dayjs()
          .set('year', value.year)
          .set('month', value.month)
          .set('date', value.day)
      : null;

  const initialTime = value && value.time ? dayjs(value.time, 'HH:mm A') : null;

  // State for each part of the date
  const [selectedYear, setSelectedYear] = useState<number | null>(
    initialDate?.year() ?? null
  );
  const [selectedMonth, setSelectedMonth] = useState<number | null>(
    initialDate?.month() ?? null // month is already 0-11
  );
  const [selectedDay, setSelectedDay] = useState<number | null>(
    initialDate?.date() ?? null
  );
  const [selectedTime, setSelectedTime] = useState<Dayjs | null>(
    initialTime ?? null // Set the initial time if provided
  );

  // Effect to create the date object when any field changes
  useEffect(() => {
    const dateObject: DateObject = {
      day: selectedDay !== null ? selectedDay : undefined,
      month: selectedMonth !== null ? selectedMonth : undefined,
      year: selectedYear !== null ? selectedYear : undefined,
      time: selectedTime ? selectedTime.format('hh:mm A') : undefined // Use 'hh:mm A' for 12-hour format with AM/PM
    };
    onChange(dateObject);
  }, [selectedYear, selectedMonth, selectedDay, selectedTime, onChange]);

  // Calculate the number of days in the selected month
  const getDaysInMonth = (month: number | null, year: number | null) => {
    if (month === null || year === null) return 31;
    return dayjs().set('year', year).set('month', month).daysInMonth();
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <Typography variant="caption" color="textSecondary">
        {name}
      </Typography>
      <Box
        display={'flex'}
        gap={2}
        width={'100%'}
        component={Paper}
        variant="outlined"
        p={2}
      >
        {/* Year and Month Picker */}
        <DatePicker
          label={'Month & Year'}
          views={['year', 'month']}
          value={
            selectedYear !== null && selectedMonth !== null
              ? dayjs().set('year', selectedYear).set('month', selectedMonth)
              : null
          }
          onChange={(newDate) => {
            if (newDate) {
              setSelectedYear(newDate.year());
              setSelectedMonth(newDate.month());
            } else {
              setSelectedYear(null);
              setSelectedMonth(null);
            }
          }}
          sx={{ width: '100%' }}
          slotProps={{
            field: {
              clearable: true,
              onClear: () => {
                setSelectedYear(null);
                setSelectedMonth(null);
              }
            }
          }}
        />
        {/* Day Picker */}
        <TextField
          label="Day"
          type="number"
          value={selectedDay ?? ''} // Display the current selected day or empty
          onChange={(event) => {
            const newDay = parseInt(event.target.value, 10);
            const maxDays = getDaysInMonth(selectedMonth, selectedYear);
            if (newDay >= 1 && newDay <= maxDays) {
              setSelectedDay(newDay);
            } else if (event.target.value === '') {
              setSelectedDay(null);
            }
          }}
          slotProps={{
            htmlInput: {
              min: 1,
              max: getDaysInMonth(selectedMonth, selectedYear)
            }
          }}
          sx={{ width: '100%' }}
        />
        {/* Time Picker */}
        <TimePicker
          label="Time"
          value={selectedTime}
          onChange={(newTime) => {
            if (newTime) {
              setSelectedTime(newTime);
            } else {
              setSelectedTime(null);
            }
          }}
          sx={{ width: '100%' }}
          slotProps={{
            field: {
              clearable: true,
              onClear: () => setSelectedTime(null)
            }
          }}
        />
      </Box>
    </LocalizationProvider>
  );
}
