import React, { useState, useEffect } from "react";
import {
  Box,
  Button,
  Divider,
  Paper,
  TextField,
  Typography,
} from "@mui/material";
import MediaSelectableList from "./MediaSelectableList";
import { MediaInstance } from "../../pages/Media";
import MediaSelectModal from "./MediaSelectModal";
import MediaUploader from "./MediaUploader";

export interface MediaBlockProps {
  value: MediaInstance[] | undefined;
  onChange: (value: MediaInstance[] | undefined) => void;
}

const MediaBlock: React.FC<MediaBlockProps> = ({ value, onChange }) => {
  const [selected, setSelected] = useState<MediaInstance[] | []>(
    value ? value : []
  );

  //on change
  useEffect(() => {
    selected && onChange(selected);
  }, [onChange, selected]);

  // modal
  const [openModal, setOpenModal] = useState(false);

  const handleOpenModal = () => {
    setOpenModal(true);
  };

  const handleCloseModal = () => {
    setOpenModal(false);
  };

  return (
    <>
      <Typography variant="h5">Media</Typography>
      <Divider sx={{ marginBottom: "2rem" }} />
      <Paper id="media-block" elevation={2} sx={{ padding: 3 }}>
        <Box p={3}>
          <Box sx={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
            <Box>
              <TextField
                id="media-input"
                label="Selected Media"
                variant="outlined"
                fullWidth
                sx={{
                  ".MuiOutlinedInput-root": {
                    padding: "1rem",
                    input: {
                      display: "none", // Hides the text input field
                    },
                    cursor: "pointer",
                  },
                }}
                helperText={"Click image to select/unselect"}
                InputProps={{
                  startAdornment: (
                    <MediaSelectableList
                      mediaList={selected}
                      selected={selected}
                      setMediaList={setSelected}
                    />
                  ),
                }}
              />{" "}
            </Box>
            <Box>
              <MediaUploader setMedia={setSelected} />
              <>
                <Button onClick={handleOpenModal} sx={{ width: "content" }}>
                  Select from Media Library
                </Button>

                <MediaSelectModal
                  open={openModal}
                  handleClose={handleCloseModal}
                  selected={selected}
                  setSelected={setSelected}
                />
              </>
            </Box>
          </Box>
        </Box>
      </Paper>
    </>
  );
};

export default MediaBlock;
