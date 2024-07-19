import PageTable from "../components/PageTable";

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
  return <PageTable<Post> />;
}
