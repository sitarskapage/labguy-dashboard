import PageTable from "../components/PageTable";
import { GridColDef } from "@mui/x-data-grid";
import { Event } from "./Projects";
import { ImageInstance } from "../components/media/images/imageSchema";

export type Work = {
  _id: string;
  title: string;
  medium?: string[];
  year?: number;
  projects?: Event[];
  images?: ImageInstance[];
  tags?: string[];
  public?: boolean;
  modified?: Date;
};

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
      <PageTable<Work> columns={workColumns} />
    </>
  );
}
