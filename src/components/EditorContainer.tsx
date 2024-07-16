import { Box, Typography } from "@mui/material";
import { ReactNode } from "react";

const EditorContainer = ({
  children,
  title,
}: {
  children: ReactNode;
  title: string;
}) => {
  return (
    <Box sx={{ padding: "1rem" }}>
      <Typography variant="h5">
        Editing: <em>{title}</em>
      </Typography>
      <Box>{children} </Box>
    </Box>
  );
};

export default EditorContainer;
