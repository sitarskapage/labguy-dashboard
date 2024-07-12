import { Box, Grid } from "@mui/material";
import { version } from "../../package.json";
import { DataGrid, GridColDef } from "@mui/x-data-grid";

const columns: GridColDef<(typeof rows)[number]>[] = [
  { field: "name", headerName: "", flex: 1 },
  { field: "value", headerName: "", flex: 1 },
];

const rows = [
  { id: 0, name: "Lab Guy - Beta", value: "" },

  { id: 1, name: "Version", value: version },
  { id: 2, name: "Last update", value: "??" },
];

export default function Dashboard() {
  return (
    <Grid container spacing={2}>
      <Grid item xs={6}>
        <Box sx={{ width: "100%", height: "300px" }}>
          <DataGrid
            rows={rows}
            columns={columns}
            pageSizeOptions={[rows.length]}
            disableRowSelectionOnClick
            hideFooterPagination
          />
        </Box>
      </Grid>
      <Grid item xs={6}>
        <Box sx={{ width: "100%" }}>{/* Content for second grid item */}</Box>
      </Grid>

      {/* Second row */}
      <Grid item xs={6}>
        <Box sx={{ width: "100%" }}>{/* Content for third grid item */}</Box>
      </Grid>
      <Grid item xs={6}>
        <Box sx={{ width: "100%" }}>{/* Content for fourth grid item */}</Box>
      </Grid>
    </Grid>
  );
}
