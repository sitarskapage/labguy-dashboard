import { useContext } from "react";
import { GeneralContext } from "../contexts/GeneralContext";

const useRequest = <T>() => {
  const { setLoading, setSnackbar } = useContext(GeneralContext);

  const request = async (url: string, token: string | null, body?: T) => {
    setLoading(true);

    try {
      if (!token) throw new Error("No auth token");

      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `${token}`,
        },
        body: body && JSON.stringify(body),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(response.statusText || "Request failed");
      }

      setSnackbar({ children: "Success", severity: "success" });

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
  ) => {
    const url = `${import.meta.env.VITE_SERVER_API_URL}${pageId}/create`;
    return request(url, token, newItem);
  };

  // UPDATE
  const updateData = async (
    item: T | undefined,
    path: string,
    id: string | number,
    token: string | null
  ) => {
    const url = `${import.meta.env.VITE_SERVER_API_URL}${path}/update/${id}`;
    return request(url, token, item);
  };

  // DELETE
  const deleteData = async (
    pageId: string,
    id: string | number,
    token: string | null
  ) => {
    const url = `${import.meta.env.VITE_SERVER_API_URL}${pageId}/delete/${id}`;
    await request(url, token);
    return true;
  };

  return { createData, updateData, deleteData };
};

export default useRequest;
