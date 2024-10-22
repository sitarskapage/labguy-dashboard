import { Box, Paper, Typography } from '@mui/material';
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

  const initialTime =
    value && value.time ? dayjs(value.time, 'HH:mm:ss') : null;

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

  // Update the state when the value prop changes
  useEffect(() => {
    if (value) {
      setSelectedYear(value.year ?? null);
      setSelectedMonth(value.month ?? null);
      setSelectedDay(value.day ?? null);
      setSelectedTime(value.time ? dayjs(value.time, 'HH:mm:ss') : null);
    }
  }, [value]);

  // Effect to create the date object when any field changes
  useEffect(() => {
    const dateObject: DateObject = {
      day: selectedDay !== null ? selectedDay : undefined,
      month: selectedMonth !== null ? selectedMonth : undefined,
      year: selectedYear !== null ? selectedYear : undefined,
      time: selectedTime ? selectedTime.format('HH:mm:ss') : undefined
    };
    onChange(dateObject);
  }, [selectedYear, selectedMonth, selectedDay, selectedTime, onChange]);

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
        <DatePicker
          label={'Day'}
          views={['day']}
          value={selectedDay !== null ? dayjs().set('date', selectedDay) : null}
          onChange={(newDate) => {
            if (newDate) {
              setSelectedDay(newDate.date());
            } else {
              setSelectedDay(null);
            }
          }}
          format="dddd" // This will display the day as a full weekday name (e.g., "Monday")
          sx={{ width: '100%' }}
          slotProps={{
            field: {
              clearable: true,
              onClear: () => setSelectedDay(null)
            }
          }}
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
