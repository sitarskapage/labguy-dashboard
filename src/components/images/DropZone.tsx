import { Box, Typography } from "@mui/material";
import { useDropzone } from "react-dropzone";

interface FileWithPreview extends File {
  preview: string;
}

interface DropZoneProps {
  props: {
    files: FileWithPreview[];
    setFiles: React.Dispatch<React.SetStateAction<FileWithPreview[]>>;
  };
}

const thumb = {
  display: "inline-flex",
  borderRadius: 2,
  border: "1px solid #eaeaea",
  marginBottom: 8,
  marginRight: 8,
  width: 100,
  height: 100,
  padding: 4,
};

const thumbInner = {
  display: "flex",
  minWidth: 0,
  overflow: "hidden",
};

const img = {
  display: "block",
  width: "100%",
  height: "100%",
  objectFit: "cover" as const,
};

const DropZone: React.FC<DropZoneProps> = ({ props }) => {
  const { files, setFiles } = props;

  const { getRootProps, getInputProps } = useDropzone({
    accept: {
      "image/*": [],
    },
    onDrop: (acceptedFiles) => {
      setFiles(
        acceptedFiles.map((file) =>
          Object.assign(file, {
            preview: URL.createObjectURL(file),
          })
        )
      );
    },
  });

  const thumbs = files.map((file) => (
    <div style={thumb} key={file.name}>
      <div style={thumbInner}>
        <img
          src={file.preview}
          style={img}
          // Revoke data uri after image is loaded
          onLoad={() => {
            URL.revokeObjectURL(file.preview);
          }}
        />
      </div>
    </div>
  ));

  return (
    <Box sx={{ marginTop: 2 }}>
      <Box
        {...getRootProps({
          className: "dropzone",
          sx: {
            border: "1px dashed grey",
            color: "grey",
            minHeight: "100px",
            borderRadius: 1,
            padding: 2,
            display: "flex",
            justifContent: "centner",
            alignItems: "center",
            cursor: "pointer",
            "&:hover": {
              backgroundColor: "#f0f0f0",
            },
          },
        })}>
        <input {...getInputProps()} />
        <Typography variant="body1">
          Drag 'n' drop some files here, or click to select files
        </Typography>
      </Box>
      <Box
        sx={{
          display: "flex",
          flexDirection: "row",
          flexWrap: "wrap",
          marginTop: 2,
        }}>
        {thumbs}
      </Box>
    </Box>
  );
};
export default DropZone;
