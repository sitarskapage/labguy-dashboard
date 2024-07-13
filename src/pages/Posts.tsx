import PageTable from "../components/PageTable";
import { GridColDef } from "@mui/x-data-grid";

export type Block = {
  id: string;
  html: string;
  type: string;
  index: number;
};

export type Post = {
  _id: string;
  author: string;
  timestamp: Date;
  title: string;
  content: Block[];
  public: boolean;
  slug: string;
  tags: string[];
  modified?: Date;
};

export default function Posts() {
  const postColumns: GridColDef[] = [
    { field: "title", headerName: "Title", flex: 1, editable: true },
    { field: "public", headerName: "Public", editable: true, type: "boolean" },
  ];

  return <PageTable<Post> columns={postColumns} />;
}
