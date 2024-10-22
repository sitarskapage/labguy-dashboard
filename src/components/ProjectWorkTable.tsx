import { useEffect, useMemo, useState } from 'react';
import {
  type MRT_ColumnDef,
  useMaterialReactTable,
  MRT_Row,
  MaterialReactTable
} from 'material-react-table';

import {
  FIRST_POSITION,
  positionAfter,
  positionBefore,
  positionBetween
} from '../utils/ordering';
import { ProjectsOnWorks } from '../../types';

function getNewPosition(
  prevRowPosition: string | null,
  nextRowPosition: string | null
): string {
  if (!prevRowPosition && nextRowPosition) {
    return positionBefore(nextRowPosition);
  }
  if (!nextRowPosition && prevRowPosition) {
    return positionAfter(prevRowPosition);
  }
  if (prevRowPosition && nextRowPosition) {
    return positionBetween(prevRowPosition, nextRowPosition);
  }
  return FIRST_POSITION;
}

// Example component definition
export const ProjectWorkTable = ({
  value,
  onChange
}: {
  value: ProjectsOnWorks[];
  onChange: (updatedData: ProjectsOnWorks[]) => void;
}) => {
  const [data, setData] = useState<ProjectsOnWorks[]>([]);

  useEffect(() => {
    // Sort value by fIndex on initial load
    const sortedData = [...value].sort((a, b) =>
      a.fIndex.localeCompare(b.fIndex)
    );
    setData(sortedData);
  }, [value]);

  // Sort the data array by fIndex after every change
  const sortData = (updatedData: ProjectsOnWorks[]) => {
    return updatedData.sort((a, b) => a.fIndex.localeCompare(b.fIndex));
  };

  // Define table columns using useMemo for performance optimization
  const columns = useMemo<MRT_ColumnDef<ProjectsOnWorks>[]>(
    () => [
      {
        accessorKey: 'work.general.title',
        header: 'Title',
        grow: true
      },
      {
        accessorKey: 'fIndex',
        header: 'Index',
        grow: false,
        Cell: ({ row }) => {
          return <>{row.index + 1}</>;
        }
      }
    ],
    []
  );

  const table = useMaterialReactTable({
    columns,
    data, // Correct type for data: ProjectsOnWork[]
    layoutMode: 'grid',
    enableTopToolbar: false,
    enableColumnFilters: false,
    enablePagination: false,
    enableSorting: false,
    enableEditing: false,
    enableColumnActions: false,
    enableRowOrdering: true,

    mrtTheme: (theme) => ({
      baseBackgroundColor: theme.palette.background.default
    }),
    muiTableProps: {
      sx: {
        border: '1px solid rgba(81, 81, 81, .5)',
        caption: {
          captionSide: 'top'
        }
      }
    },
    muiTableHeadCellProps: {
      sx: {
        border: '1px solid rgba(81, 81, 81, .5)',
        fontStyle: 'italic',
        fontWeight: 'normal'
      }
    },
    muiTableBodyCellProps: {
      sx: {
        border: '1px solid rgba(81, 81, 81, .5)'
      }
    },

    muiRowDragHandleProps: ({ table }) => ({
      onDragEnd: () => {
        const { draggingRow, hoveredRow } = table.getState();

        if (hoveredRow && draggingRow) {
          const draggingRowIndex = draggingRow.index;
          const hoveredRowIndex = (hoveredRow as MRT_Row<ProjectsOnWorks>)
            .index;

          // Reorder the data array
          const updatedData = [...data];
          const [movedRow] = updatedData.splice(draggingRowIndex, 1); // Remove the dragged row
          updatedData.splice(hoveredRowIndex, 0, movedRow); // Insert it at the new position

          const prevRowPosition =
            updatedData[hoveredRowIndex - 1]?.fIndex.toString() || null;
          const nextRowPosition =
            updatedData[hoveredRowIndex + 1]?.fIndex.toString() || null;

          const newPosition = getNewPosition(prevRowPosition, nextRowPosition);
          movedRow.fIndex = newPosition;
          movedRow.modified = true;

          // Sort the updated data by fIndex after the row move
          const sortedData = sortData(updatedData);
          setData(sortedData); // Update the state with sorted data

          // Call the onChange prop with sorted data
          if (onChange) {
            onChange(sortedData);
          }
        }
      }
    })
  });

  return <MaterialReactTable table={table} />;
};

export default ProjectWorkTable;
