import PageTable from "../components/PageTable";
import { GridColDef } from "@mui/x-data-grid";

export default function Works() {
  const workColumns: GridColDef[] = [
    {
      field: "year",
      headerName: "Year",
      editable: true,
      type: "number",
      valueFormatter: (value) => value && value,
    },
  ];

  return (
    <>
      <PageTable columns={workColumns} />
    </>
  );
}
