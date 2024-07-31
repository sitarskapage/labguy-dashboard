import { Box, Grid } from "@mui/material";

export default function Dashboard() {
  const boxStyles = { width: "100%", height: 300 };
  return (
    <Grid container spacing={2}>
      <Grid item xs={6}>
        <p>⭐</p>
      </Grid>
      <Grid item xs={6}>
        <Box sx={boxStyles}>{/* Content for second grid item */}</Box>
      </Grid>
      <Grid item xs={6}>
        <Box sx={boxStyles}>{/* Content for third grid item */}</Box>
      </Grid>
      <Grid item xs={6}>
        <Box sx={boxStyles}>{/* Content for fourth grid item */}</Box>
      </Grid>
    </Grid>
  );
}
