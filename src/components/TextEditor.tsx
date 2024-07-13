import React, { useState } from "react";
import { Editor } from "@tinymce/tinymce-react";
import { Box, CircularProgress, useMediaQuery, useTheme } from "@mui/material";

interface TextEditorProps {
  id: string;
  initVal?: string;
  onBlur?: (id: string, value: string) => void;
}

const TextEditor: React.FC<TextEditorProps> = ({
  id,
  initVal = "",
  onBlur,
}) => {
  const [editorContent, setEditorContent] = useState<string>(initVal);
  const [loading, setLoading] = useState(true);
  const prefersDarkMode = useMediaQuery("(prefers-color-scheme: dark)");

  const handleEditorChange = (content: string) => {
    setEditorContent(content);
  };

  const handleEditorBlur = () => {
    if (typeof onBlur === "function") {
      onBlur(id, editorContent);
    }
  };
  const theme = useTheme();

  return (
    <>
      {loading && (
        <Box
          sx={{
            height: 500,
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}>
          <CircularProgress />
        </Box>
      )}
      <div style={{ display: loading ? "none" : "block" }}>
        <Editor
          tinymceScriptSrc="/tinymce/tinymce.min.js"
          licenseKey="gpl"
          id={id}
          initialValue={initVal}
          init={{
            skin: prefersDarkMode ? "oxide-dark" : "oxide",
            content_style: prefersDarkMode
              ? `body {background-color: ${theme.palette.background.paper}; color: ${theme.palette.common.white}; }} `
              : "",
            height: 500,
            menubar: false,
            branding: false,
            plugins: [
              "advlist",
              "autolink",
              "lists",
              "link",
              "charmap",
              "anchor",
              "searchreplace",
              "code",
              "fullscreen",
              "insertdatetime",
              "table",
              "help",
              "wordcount",
            ],
            toolbar:
              "undo redo | blocks | " +
              "bold italic forecolor | alignleft aligncenter " +
              "alignright alignjustify | bullist numlist outdent indent | " +
              "removeformat | help | code",
          }}
          onInit={() => setLoading(false)}
          onEditorChange={handleEditorChange}
          onBlur={handleEditorBlur}
        />
      </div>
    </>
  );
};

export default TextEditor;
