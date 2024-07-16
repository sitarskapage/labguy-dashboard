import { useParams, useRouteLoaderData } from "react-router-dom";

const useFormData = <T extends { _id: string }>({ slug }: { slug: string }) => {
  const collection = useRouteLoaderData(slug) as T[];
  const { id } = useParams();
  return collection.find((work) => id === work._id);
};
export default useFormData;
