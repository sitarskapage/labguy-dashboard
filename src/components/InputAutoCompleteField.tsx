import { Autocomplete, CircularProgress, TextField } from "@mui/material";
import { useEffect, useState } from "react";

interface AutocompleteProps {
  initVal: string[];
}

const AutocompleteMultipleFreesolo: React.FC<AutocompleteProps> = ({
  initVal,
}) => {
  //autocomplete input functions
  const [open, setOpen] = useState(false);
  const [options, setOptions] = useState<string[]>([]);
  const loading = open && options.length === 0;

  async function fetchOptions() {
    try {
      const response = await fetch(`http://localhost:3000/api/tags/`);
      if (!response.ok) throw new Error("Response not ok");
      const data = await response.json();
      return data as string[];
    } catch (error) {
      console.error("Fetch error:", error.message);
    }
  }

  useEffect(() => {
    let active = true;

    if (!loading) {
      return undefined;
    }

    (async () => {
      const data = await fetchOptions();
      if (active && data && data.length > 0) {
        console.log("Fetched data:", data);
        setOptions([...data]);
      }
    })();

    return () => {
      active = false;
    };
  }, [loading]);

  useEffect(() => {
    if (!open) {
      setOptions([]);
    }
  }, [open]);

  return (
    <Autocomplete
      multiple
      freeSolo
      defaultValue={initVal}
      options={options}
      loading={loading}
      open={open}
      onOpen={() => {
        setOpen(true);
      }}
      onClose={() => {
        setOpen(false);
      }}
      sx={{ marginTop: 3 }}
      renderInput={(params) => (
        <TextField
          {...params}
          label={"Tags"}
          InputProps={{
            ...params.InputProps,
            endAdornment: (
              <>
                {loading ? (
                  <CircularProgress color="inherit" size={20} />
                ) : null}
                {params.InputProps.endAdornment}
              </>
            ),
          }}
        />
      )}
    />
  );
};
export default AutocompleteMultipleFreesolo;
