import {
  Autocomplete,
  CircularProgress,
  TextField,
  Typography,
} from "@mui/material";
import { useEffect, useState } from "react";

interface Option {
  title: string;
  id: string;
}

interface CustomAutocompleteProps {
  value: (string | { title: string; _id: string })[] | undefined;
  onChange: (value: (string | Option)[]) => void;
  fetchOptions: () => Promise<
    (string | { title: string; _id: string; [key: string]: unknown })[]
  >;
  label?: string;
  freeSolo?: boolean;
  multiple?: boolean;
  description?: string;
}

const CustomAutocomplete = ({
  label,
  fetchOptions,
  onChange,
  freeSolo,
  description,
}: CustomAutocompleteProps) => {
  const [open, setOpen] = useState(false);
  const [options, setOptions] = useState<readonly (string | Option)[]>([]);
  const loading = open && options.length === 0;

  function formatData(data: (string | { title: string; _id: string })[]) {
    const array = data.map((item) => {
      if (typeof item !== "string") {
        return { title: item.title, id: item._id };
      } else {
        return item;
      }
    });

    return array as readonly (string | Option)[];
  }
  useEffect(() => {
    let active = true;

    const fetchData = async () => {
      const data = await fetchOptions();
      if (active) {
        const formatted = formatData(data);
        setOptions(formatted);
      }
    };

    if (loading) {
      fetchData();
    }

    return () => {
      active = false;
    };
  }, [loading, fetchOptions]);

  useEffect(() => {
    if (!open) {
      setOptions([]);
    }
  }, [open]);

  return (
    <>
      <Autocomplete
        getOptionLabel={(option) =>
          typeof option == "string" ? option : option.title
        }
        options={options}
        renderInput={(params) => (
          <TextField
            {...params}
            label={label}
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
        onOpen={() => {
          setOpen(true);
        }}
        onClose={() => {
          setOpen(false);
        }}
        onChange={(_e, value) => {
          onChange(value);
        }}
        multiple
        freeSolo={freeSolo}
        loading={loading}
        open={open}
      />
      {description && (
        <Typography variant="caption" color="textSecondary">
          <Typography variant="subtitle2">{description}</Typography>
        </Typography>
      )}
    </>
  );
};

export default CustomAutocomplete;
