// DndMediaList.tsx
import React from 'react';
import { Box, useTheme } from '@mui/material';
import { MediaRef } from '../../pages/Media';
import { DragDropContext, Droppable, DropResult } from '@hello-pangea/dnd';
import DndMediaItem from './DndMediaItem';

interface DndMediaListProps {
  mediaList: MediaRef[];
  selected: MediaRef[];
  setSelected: React.Dispatch<React.SetStateAction<MediaRef[]>>;
}

const reorder = (list: MediaRef[], startIndex: number, endIndex: number) => {
  const result = Array.from(list);
  const [removed] = result.splice(startIndex, 1);
  result.splice(endIndex, 0, removed);
  return result;
};

const DndMediaList: React.FC<DndMediaListProps> = ({
  mediaList,
  selected,
  setSelected
}) => {
  const isSelected = (media: MediaRef) =>
    selected.some((item) => item && media && item.etag === media.etag);

  const handleSelectClick = (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>,
    clickedMedia: MediaRef
  ) => {
    e.stopPropagation();
    setSelected((prevList) => {
      const mediaExists = prevList.some(
        (media) => media && media.etag === clickedMedia?.etag
      );
      return mediaExists
        ? prevList.filter((media) => media && media.etag !== clickedMedia?.etag)
        : [clickedMedia, ...prevList];
    });
  };

  const onDragEnd = (result: DropResult) => {
    if (!result.destination) return;

    const reorderedMedia = reorder(
      mediaList,
      result.source.index,
      result.destination.index
    );

    setSelected(reorderedMedia);
  };

  const theme = useTheme();

  const getListStyle = (isDraggingOver: boolean, itemsLength: number) => ({
    background: isDraggingOver ? theme.palette.secondary.dark : 'none',
    display: 'flex',
    width: `${itemsLength * 300}px`,
    height: 'auto',
    padding: 1,
    margin: 2,
    borderRadius: 1
  });

  return (
    <Box sx={{ overflow: 'auto', height: 'auto' }}>
      <DragDropContext onDragEnd={onDragEnd}>
        <Droppable droppableId="mediaList" direction="horizontal">
          {(provided, snapshot) => (
            <Box
              {...provided.droppableProps}
              ref={provided.innerRef}
              sx={getListStyle(snapshot.isDraggingOver, mediaList.length)}
            >
              {mediaList.map((media, index) => (
                <DndMediaItem
                  key={media?.etag}
                  media={media}
                  index={index}
                  isSelected={isSelected}
                  handleSelectClick={handleSelectClick}
                />
              ))}
              {provided.placeholder}
            </Box>
          )}
        </Droppable>
      </DragDropContext>
    </Box>
  );
};

export default DndMediaList;
