import { Box, Grid, useTheme } from "@mui/material";
import { version } from "../../package.json";
import { DataGrid, GridColDef } from "@mui/x-data-grid";

const columns: GridColDef<(typeof rows)[number]>[] = [
  { field: "name", flex: 1 },
  { field: "value", flex: 1 },
];

const rows = [
  { id: 0, name: "Lab Guy - Beta", value: "" },
  { id: 1, name: "Version", value: version },
];

export default function Dashboard() {
  const theme = useTheme();
  const boxStyles = { width: "100%", height: 300 };
  return (
    <Grid container spacing={2}>
      <Grid item xs={6}>
        <Box sx={boxStyles}>
          <DataGrid
            rows={rows}
            columns={columns}
            pageSizeOptions={[rows.length]}
            disableRowSelectionOnClick
            hideFooterPagination
            hideFooter
            autoHeight={true}
            sx={{ backgroundColor: theme.palette.background.paper }}
            columnHeaderHeight={0}
          />
        </Box>
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
