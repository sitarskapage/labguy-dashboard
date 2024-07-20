import dayjs from "dayjs";
import PageTable from "../components/PageTable";
import { GridColDef } from "@mui/x-data-grid";

export default function Projects() {
  const eventColumns: GridColDef[] = [
    {
      field: "start_date",
      headerName: "Start Date",
      type: "date",
      flex: 1,
      editable: true,
      valueFormatter: (value) =>
        value ? dayjs(value).format("MMMM D, YYYY") : "N/A",
    },
    {
      field: "end_date",
      headerName: "End Date",
      type: "date",
      flex: 1,
      editable: true,
      valueFormatter: (value) =>
        value ? dayjs(value).format("MMMM D, YYYY") : "N/A",
    },
  ];
  return <PageTable columns={eventColumns} />;
}
