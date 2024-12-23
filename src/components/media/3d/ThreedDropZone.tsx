import { Alert, Box, Typography } from '@mui/material';
import { useDropzone } from 'react-dropzone';
import { maxSize } from '../../../utils/dropZoneVariables';
import { useState } from 'react';

export interface FileWithPreview extends File {
  preview: string;
}

interface DropZoneProps {
  files: File[];
  setFiles: React.Dispatch<React.SetStateAction<File[]>>;
}

const ThreedDropZone: React.FC<DropZoneProps> = ({ files, setFiles }) => {
  const [errors, setErrors] = useState<string[] | null>(null);
  const { getRootProps, getInputProps } = useDropzone({
    accept: {
      'model/gltf-binary': ['.glb'],
      'model/gltf+json': ['.gltf'],
      'application/octet-stream': ['.bin'],
      'image/jpeg': ['.jpg', '.jpeg'],
      'image/png': ['.png'],
      'image/webp': ['.webp']
    },
    maxSize: maxSize,
    onDrop: (acceptedFiles, fileRejections) => {
      setErrors(
        fileRejections.flatMap((f) =>
          f.errors.map((e) => `${f.file.name}: ${e.message}`)
        )
      );

      setFiles(
        acceptedFiles.map((file) =>
          Object.assign(file, {
            preview: URL.createObjectURL(file)
          })
        )
      );
    }
  });

  const thumbs = files.map((file, i) => <p key={i}>{file.name}</p>);

  return (
    <Box width={'100%'}>
      <Box
        {...getRootProps({
          className: 'dropzone',
          sx: {
            border: `1px dashed ${'rgba(151,151,151,0.4)'}`,
            minHeight: '100px',
            borderRadius: 1,
            padding: 2,
            display: 'flex',
            justifContent: 'centner',
            alignItems: 'center',
            cursor: 'pointer',
            '&:hover': {
              backgroundColor: 'rgba(151,151,151,0.1)'
            }
          }
        })}
      >
        <input {...getInputProps()} />
        <Typography variant="body2" sx={{ opacity: 0.5 }}>
          Drag a{' '}
          <Box fontWeight={900} component={'span'}>
            glTF or GLB
          </Box>{' '}
          model here
        </Typography>
      </Box>
      <Box>
        <Typography variant="caption" sx={{ opacity: 0.5 }}>
          Maximum file size: 10MB. Only .gltf, .glb formats are supported.
          Dropping groups or folders is allowed.
          {/* <br />
          Include an image file named <i>poster</i> to use it as the model's
          poster. You can also change it later by editing the media. */}
          <br />
          Tip: You can achieve great file size by compressing models using
          available compression techniques, such as exporting and compressing a
          GLB model with Draco3D library. Make sure assets linked to the model
          are also well optimized.
        </Typography>
      </Box>
      <Box>{thumbs}</Box>
      <Box>
        {errors?.map((e) => (
          <Alert severity="error" sx={{ m: 1 }}>
            {e}
          </Alert>
        ))}
      </Box>
    </Box>
  );
};
export default ThreedDropZone;
