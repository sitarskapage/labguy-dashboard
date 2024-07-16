import { IChangeEvent } from "@rjsf/core";
import { useContext } from "react";
import { useParams } from "react-router-dom";
import { useUpdateData, WithId } from "./useRequest";
import { AuthContext } from "../contexts/AuthContext";

const useSubmit = <T extends WithId>(data: IChangeEvent<T>) => {
  console.log("Data submitted: ", data.formData);
  const { id } = useParams();
  const { token } = useContext(AuthContext);
  const { updateData } = useUpdateData<T>();
  const { formData } = data;

  formData && id && token && updateData(formData, id, token);
};

export default useSubmit;
