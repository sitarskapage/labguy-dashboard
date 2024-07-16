const fetchData = async (id: string) => {
  try {
    const response = await fetch(`http://localhost:3000/api/${id}`);
    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);

    const data = await response.json();
    return data;
  } catch (err) {
    if (err instanceof Error) throw new Error(err.message);
  }
};
export default fetchData;
