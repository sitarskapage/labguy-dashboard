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
  return (
    <Grid container spacing={2}>
      <Grid item xs={6}>
        <Box sx={{ width: "100%", height: 300 }}>
          <DataGrid
            rows={rows}
            columns={columns}
            pageSizeOptions={[rows.length]}
            disableRowSelectionOnClick
            hideFooterPagination
            hideFooter
            autoHeight={true}
            sx={{ backgroundColor: theme.palette.background.paper }}
            slots={{
              columnHeaders: () => null, // Warning: Function components cannot be given refs. Attempts to access this ref will fail. Did you mean to use React.forwardRef()?
            }}
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
