import { useParams, useRouteLoaderData } from "react-router-dom";
import { WithId } from "./useRequest";

const useFormData = <T extends WithId>({ slug }: { slug: string }) => {
  const collection = useRouteLoaderData(slug) as T[];
  const { id } = useParams();
  return { data: collection.find((work) => id === work._id) || null, id: id };
};
export default useFormData;
