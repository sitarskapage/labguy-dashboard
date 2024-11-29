import React, { useState } from 'react';
import { Editor } from '@tinymce/tinymce-react';
import { Box, CircularProgress, Typography, useTheme } from '@mui/material';
import useDarkMode from '../hooks/useDarkMode';

interface TextBlockProps {
  id: string;
  value?: string;
  onBlur?: (id: string, value: string) => void;
  name?: string;
}

const TextBlock: React.FC<TextBlockProps> = ({
  id,
  value = '',
  onBlur,
  name = 'Text'
}) => {
  const [editorContent, setEditorContent] = useState<string>(value);
  const [loading, setLoading] = useState(true);

  const handleEditorChange = (content: string) => {
    setEditorContent(content);
  };

  const handleEditorBlur = () => {
    if (typeof onBlur === 'function') {
      onBlur(id, editorContent);
    }
  };

  const theme = useTheme();

  return (
    <>
      {loading && (
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            height: '500px',
            width: '100%',
            position: 'absolute',
            left: '50%',
            top: '50%',
            transform: 'translate(-50%, -50%)',
            overflow: 'hidden'
          }}
        >
          <CircularProgress />
        </Box>
      )}
      <Typography variant="caption" color="textSecondary">
        {name}
      </Typography>
      <Editor
        tinymceScriptSrc={`${import.meta.env.BASE_URL}/tinymce/tinymce.min.js`}
        licenseKey="gpl"
        id={id}
        initialValue={value}
        init={{
          skin: useDarkMode() ? 'oxide-dark' : 'oxide',
          content_style: useDarkMode()
            ? `body {background-color: ${theme.palette.background.paper}; color: ${theme.palette.common.white}; }} `
            : '',
          menubar: false,
          branding: false,
          plugins: [
            'advlist',
            'autolink',
            'lists',
            'link',
            'charmap',
            'anchor',
            'searchreplace',
            'code',
            'fullscreen',
            'insertdatetime',
            'table',
            'help',
            'wordcount',
            'table'
          ],
          toolbar:
            'undo redo | blocks | ' +
            'bold italic forecolor | alignleft aligncenter ' +
            'alignright alignjustify | bullist numlist outdent indent | ' +
            'removeformat | table | help | code',
          height: '500'
        }}
        onInit={() => setLoading(false)}
        onEditorChange={handleEditorChange}
        onBlur={handleEditorBlur}
      />
    </>
  );
};

export default TextBlock;
