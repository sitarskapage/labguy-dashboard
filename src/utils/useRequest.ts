import { useContext } from "react";
import { GeneralContext } from "../contexts/GeneralContext";

export interface WithId {
  [k: string]: unknown;
  _id?: string | undefined;
}

const useRequest = <T>() => {
  const { setLoading, setSnackbar } = useContext(GeneralContext);

  const hasId = <T>(item: T | undefined): item is T & { _id: string } => {
    return (
      item !== undefined &&
      typeof item === "object" &&
      item !== null &&
      "_id" in item &&
      typeof (item as { _id: unknown })._id === "string"
    );
  };

  const request = async (
    url: string,
    token: string | null,
    body?: T
  ): Promise<T | null> => {
    setLoading(true);
    if (!token) throw new Error("No auth token");

    try {
      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `${token}`,
        },
        body: body ? JSON.stringify(body) : undefined,
      });
      console.log("repsonse:", response);
      const result = await response.json();

      if (!response.ok) {
        throw new Error(response.statusText || "Request failed");
      }

      return result;
    } catch (error) {
      setSnackbar({ children: (error as Error).message, severity: "error" });
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // CREATE
  const createData = async (
    newItem: T,
    pageId: string,
    token: string | null
  ): Promise<T | null> => {
    const url = `http://localhost:3000/api/${pageId}/create`;
    return request(url, token, newItem);
  };

  // UPDATE
  const updateData = async (
    item: T | undefined,
    pageId: string,
    token: string | null
  ): Promise<T | null> => {
    if (!hasId(item)) {
      throw new Error(`_id not found in: ${JSON.stringify(item)}`);
    }

    const url = `http://localhost:3000/api/${pageId}/update/${item._id}`;
    return request(url, token, item);
  };

  // DELETE
  const deleteData = async (
    id: string,
    pageId: string,
    token: string | null
  ): Promise<boolean> => {
    const url = `http://localhost:3000/api/${pageId}/delete/${id}`;
    await request(url, token);
    return true;
  };

  return { createData, updateData, deleteData };
};

export default useRequest;
