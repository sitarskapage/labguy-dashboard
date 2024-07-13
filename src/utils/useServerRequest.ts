import { useState } from "react";

const useRequest = <T>() => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const request = async (
    url: string,
    method: "POST",
    token: string,
    body?: T
  ): Promise<T | null> => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `${token}`,
        },
        body: body ? JSON.stringify(body) : undefined,
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || "Request failed");
      }

      return result;
    } catch (error) {
      setError(error.message);
      return null;
    } finally {
      setLoading(false);
    }
  };

  return { request, loading, error };
};

export const useCreateData = <T>() => {
  const { request, loading, error } = useRequest<T>();

  const createData = async (
    newItem: T,
    pageId: string,
    token: string
  ): Promise<T | null> => {
    const url = `http://localhost:3000/api/${pageId}/create`;
    return request(url, "POST", token, newItem);
  };

  return { createData, loading, error };
};

export const useUpdateData = <T extends { _id: string }>() => {
  const { request, loading, error } = useRequest<T>();

  const updateData = async (
    item: T,
    pageId: string,
    token: string
  ): Promise<T | null> => {
    const url = `http://localhost:3000/api/${pageId}/update/${item._id}`;
    return request(url, "POST", token, item);
  };

  return { updateData, loading, error };
};

export const useDeleteData = () => {
  const { request, loading, error } = useRequest<boolean>();

  const deleteData = async (
    id: string,
    pageId: string,
    token: string
  ): Promise<boolean> => {
    const url = `http://localhost:3000/api/${pageId}/delete/${id}`;
    await request(url, "POST", token);
    return true;
  };

  return { deleteData, loading, error };
};
