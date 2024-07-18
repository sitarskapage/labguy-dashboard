import React, { useContext, useState } from "react";
import { Editor } from "@tinymce/tinymce-react";
import { Box, CircularProgress, useTheme } from "@mui/material";
import { GeneralContext } from "../contexts/GeneralContext";

interface TextBlockProps {
  id: string;
  value?: string;
  onBlur?: (id: string, value: string) => void;
}

const TextBlock: React.FC<TextBlockProps> = ({ id, value = "", onBlur }) => {
  const [editorContent, setEditorContent] = useState<string>(value);
  const [loading, setLoading] = useState(true);
  const { settings } = useContext(GeneralContext);

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
          initialValue={value}
          init={{
            skin: settings?.general?.dashboard?.dark_mode
              ? "oxide-dark"
              : "oxide",
            content_style: settings?.general?.dashboard?.dark_mode
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

export default TextBlock;
