import React, { useState, useEffect } from "react";
import { Box, Divider, Paper, TextField, Typography } from "@mui/material";
import ImagesSelectableList from "./ImagesSelectableList";
import ImagesUploader from "./ImagesUploader";
import { ImageInstance } from "../../pages/Images";

interface ImageSelectionPaperProps {
  value?: ImageInstance[];
  onChange: (value: ImageInstance[]) => void;
  onBlur?: (cb: () => void) => void;
}

const ImagesSelectionPaper: React.FC<ImageSelectionPaperProps> = ({
  value: initVal,
  onChange,
}) => {
  const [selectedImgList, setSelectedImgList] = useState<ImageInstance[]>(
    initVal || []
  );
  const [images, setImages] = useState<ImageInstance[]>([]);

  const fetchAllImgs = async () => {
    try {
      const response = await fetch(`http://localhost:3000/api/images`);
      if (!response.ok) {
        throw new Error("Failed to fetch images");
      }
      const data: ImageInstance[] = await response.json();
      if (data.length) {
        setImages(data);
      }
    } catch (error) {
      console.error("Failed to fetch event images", error);
    }
  };

  useEffect(() => {
    fetchAllImgs();
  }, []);

  //on change
  useEffect(() => {
    onChange(selectedImgList);
  }, [onChange, selectedImgList]);

  return (
    <Paper elevation={2} sx={{ padding: 3 }}>
      <Typography variant="h5">Images</Typography>
      <Divider />
      <Box p={3}>
        <Box sx={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
          <TextField
            id="images-input"
            label="Selected Images"
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
            InputProps={{
              startAdornment: (
                <ImagesSelectableList
                  imageList={selectedImgList}
                  setImageList={setSelectedImgList}
                />
              ),
            }}
          />

          <ImagesUploader setImageList={setSelectedImgList} />

          {images.length > 0 ? (
            <ImagesSelectableList
              imageList={images}
              setImageList={setSelectedImgList}
            />
          ) : (
            "No images"
          )}
        </Box>
      </Box>
    </Paper>
  );
};

export default ImagesSelectionPaper;
