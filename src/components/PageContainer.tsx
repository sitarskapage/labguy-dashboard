import { Outlet } from "react-router-dom";
import { Box, Container, Typography } from "@mui/material";
import { useEffect } from "react";

const PageContainer = ({ title }: { title: string }) => {
  useEffect(() => {
    document.title = title;
  }, [title]);

  return (
    <Container sx={{ pt: 3 }}>
      <Box style={{ marginBottom: "20px" }}>
        <Typography variant="h4">{title}</Typography>
      </Box>
      <Box style={{ minHeight: "300px" }}>
        <Outlet />
      </Box>
    </Container>
  );
};

export default PageContainer;
