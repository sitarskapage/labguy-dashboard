import dayjs from "dayjs";
import PageTable from "../components/PageTable";
import { GridColDef } from "@mui/x-data-grid";
import { ImageInstance } from "../components/media/images/imageSchema";

export interface Event {
  _id: string;
  title: string;
  public: boolean;

  subtitle?: string;
  description?: string;
  start_date?: Date;
  end_date?: Date;
  venue?: string;
  images?: ImageInstance[];
  tags?: string[];
  post?: { title: string; _id: string };
  external_url?: URL;
  modified?: Date;
}

export default function Events() {
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
  return <PageTable<Event> columns={eventColumns} />;
}
