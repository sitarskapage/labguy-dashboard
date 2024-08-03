export const fetchData = async (path: string) => {
  try {
    const response = await fetch(
      `${import.meta.env.VITE_SERVER_API_URL}${path}`
    );
    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
    const data = await response.json();
    return data;
  } catch (err) {
    if (err instanceof Error) throw new Error(err.message);
  }
};
