// DndMediaItem.tsx
import React from 'react';
import { Button, Card, CardMedia, Grid, useTheme } from '@mui/material';
import { MediaRef } from '../../pages/Media';
import { Draggable, DraggableStyle } from '@hello-pangea/dnd';
import { getThumbnail } from '../../utils/helpers';

interface DndMediaItemProps {
  media: MediaRef;
  index: number;
  isSelected: (media: MediaRef) => boolean;
  handleSelectClick: (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>,
    clickedMedia: MediaRef
  ) => void;
}

const DndMediaItem: React.FC<DndMediaItemProps> = ({
  media,
  index,
  isSelected,
  handleSelectClick
}) => {
  const theme = useTheme();

  const getItemStyle = (
    isDragging: boolean,
    draggableStyle: DraggableStyle | undefined
  ) => ({
    userSelect: 'none',
    height: '300px', // Fixed height to make it square
    width: '300px', // Fixed width to make it square
    display: 'flex',
    flexDirection: 'column',
    backgroundColor: isDragging
      ? theme.palette.primary.light
      : theme.palette.primary.main,
    color: isSelected(media) ? theme.palette.secondary.main : 'inherit',
    filter: isSelected(media) ? 'grayscale(0%)' : 'grayscale(100%)',
    margin: 1,
    ...draggableStyle
  });

  return (
    <Draggable draggableId={media?.etag as string} index={index}>
      {(provided, snapshot) => (
        <Card
          sx={getItemStyle(snapshot.isDragging, provided.draggableProps.style)}
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
        >
          <CardMedia
            component="img"
            src={getThumbnail(media) || ''}
            sx={{ height: '100%', width: '100%', objectFit: 'cover' }}
          />
          <Grid container justifyContent="center">
            <Button
              color="secondary"
              onClick={(e) => handleSelectClick(e, media)}
              sx={{ margin: 0.5 }}
            >
              {isSelected(media) ? 'Unselect' : 'Select'}
            </Button>
          </Grid>
        </Card>
      )}
    </Draggable>
  );
};

export default DndMediaItem;
