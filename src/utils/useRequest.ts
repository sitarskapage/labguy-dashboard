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
      if (error instanceof Error) {
        setError(error.message);
        throw new Error(error.message);
      } else {
        return null;
      }
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

export type WithId = { _id: string };

// Type guard to check if an object has an _id property
const hasId = <T>(item: T | WithId): item is T & WithId => {
  return (item as WithId)._id !== undefined;
};

export const useUpdateData = <T extends WithId>() => {
  const { request, loading, error } = useRequest<T>();

  const updateData = async (
    item: T,
    pageId: string,
    token: string
  ): Promise<T | null> => {
    if (hasId(item)) {
      const url = `http://localhost:3000/api/${pageId}/update/${item._id}`;
      return request(url, "POST", token, item);
    } else {
      console.error("Item is missing or does not have an _id property");
      return null;
    }
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
