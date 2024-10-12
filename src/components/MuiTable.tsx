import { useContext, useMemo, useState } from 'react';
import {
  type MRT_ColumnDef,
  useMaterialReactTable,
  MRT_EditActionButtons,
  MRT_Row,
  MaterialReactTable,
  createRow,
  MRT_TableOptions
} from 'material-react-table';
import { useNavigate, useRouteLoaderData } from 'react-router-dom';
import {
  GeneralSectionSchema,
  PostSchema,
  ProjectSchema,
  WorkSchema
} from '@jakubkanna/labguy-front-schema';
import CheckIcon from '@mui/icons-material/Check';
import ClearIcon from '@mui/icons-material/Clear';
import {
  DialogTitle,
  DialogContent,
  DialogActions,
  Box,
  IconButton,
  Tooltip,
  Button
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import useRequest from '../utils/useRequest';
import { GeneralContext } from '../contexts/GeneralContext';
import {
  FIRST_POSITION,
  positionAfter,
  positionBefore,
  positionBetween
} from '../utils/ordering';

// Function to get the last segment of the current URL path as the route
function getRoute() {
  const segments = window.location.pathname.split('/');
  return segments[segments.length - 1]; // Return the last segment
}

// Extend each schema by adding the 'general' property
type WorkSchemaWithGeneral = WorkSchema & {
  general: GeneralSectionSchema;
};

type ProjectSchemaWithGeneral = ProjectSchema & {
  general: GeneralSectionSchema;
};

type PostSchemaWithGeneral = PostSchema & {
  general: GeneralSectionSchema;
};

// DataType to include the new versions of each schema
type DataType =
  | WorkSchemaWithGeneral
  | ProjectSchemaWithGeneral
  | PostSchemaWithGeneral;

// Example component definition
export const MuiTable = <T extends DataType>({ reordering = false }) => {
  // Fetch data based on the current route
  const path = getRoute();
  const navigate = useNavigate();
  const initData = useRouteLoaderData(path) as T[];
  const { createData, updateData, deleteData } = useRequest<T>();

  // state
  const { token } = useContext(GeneralContext);
  const [data, setData] = useState(() => initData);

  // Define table columns using useMemo for performance optimization
  const columns = useMemo<MRT_ColumnDef<T>[]>(
    () => [
      {
        accessorKey: 'general.title',
        header: 'Title',
        grow: true
      },
      {
        accessorKey: 'general.published',
        header: 'Published',
        enableEditing: false, // Disable editing for the 'published' field

        Cell: ({ cell }) => {
          const value = cell.getValue();
          return value ? <CheckIcon /> : <ClearIcon />;
        },
        size: 0
      },
      {
        accessorKey: 'general.fIndex', // Include fIndex
        header: 'fIndex', // Header can be anything
        enableEditing: false // Prevent editing if desired
      }
    ],
    []
  );

  //CREATE action
  const handleCreateEntry: MRT_TableOptions<T>['onCreatingRowSave'] = async ({
    values,
    table
  }) => {
    console.log(values);
    const newEntry = {
      // Access the flattened values
      general: {
        title: values['general.title'],
        published: values['general.published'],
        fIndex: values['general.fIndex']
      }
    };
    //calls
    const createdEntry = await createData(newEntry as T, path, token);
    setData((prevData) => [createdEntry, ...prevData]);
    table.setCreatingRow(null); // exit creating mode
  };

  //UPDATE action
  const handleEditClick = (id: string | number) => () =>
    navigate(`update/${id}`);

  //DELETE action
  const openDeleteConfirmModal = async (row: MRT_Row<T>) => {
    console.log('Delete Entry', row.original);

    const confirmDelete = window.confirm(
      `Are you sure you want to delete "${row.original.general.title}"?`
    );
    const generalId = row.original.generalId;

    if (confirmDelete) {
      // Call deleteData to delete the entry
      await deleteData(path, generalId, token);

      // Update the data state to remove the deleted entry
      setData((prevData) =>
        prevData.filter((entry) => entry.generalId !== generalId)
      );
    }
  };

  // Initialize the table instance with the configuration
  const table = useMaterialReactTable<T>({
    columns,
    data, // Data must be memoized or stable

    getRowId: (originalRow) => originalRow.generalId,
    enableColumnResizing: true,
    layoutMode: 'grid',
    enableKeyboardShortcuts: false,
    enableColumnActions: true,
    positionActionsColumn: 'last',
    enableRowActions: true,
    enableColumnFilters: false,
    enablePagination: true,
    enableSorting: false,
    createDisplayMode: 'row',
    enableEditing: true,
    enableRowOrdering: reordering,

    mrtTheme: (theme) => ({
      baseBackgroundColor: theme.palette.background.default // Change default background color
    }),
    muiTableBodyRowProps: { hover: false },
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
    onCreatingRowSave: handleCreateEntry,
    renderRowActions: ({ row }) => (
      <Box sx={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
        <Tooltip title="Edit">
          <IconButton size="small" onClick={handleEditClick(row.original.id)}>
            <EditIcon fontSize="small" />
          </IconButton>
        </Tooltip>
        <Tooltip title="Delete">
          <IconButton
            size="small"
            color="error"
            onClick={() => openDeleteConfirmModal(row)}
          >
            <DeleteIcon fontSize="small" />
          </IconButton>
        </Tooltip>
      </Box>
    ),

    renderCreateRowDialogContent: ({ table, row, internalEditComponents }) => (
      <>
        <DialogTitle variant="h3">Add new</DialogTitle>
        <DialogContent
          sx={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}
        >
          {internalEditComponents} {/* or render custom edit components here */}
        </DialogContent>
        <DialogActions>
          <MRT_EditActionButtons variant="text" table={table} row={row} />
        </DialogActions>
      </>
    ),
    renderTopToolbarCustomActions: () => {
      const firstRow = table.getTopRows()[0];
      const firstRowFIndex = firstRow
        ? firstRow.original.general.fIndex
        : FIRST_POSITION;

      return (
        <Box sx={{ display: 'flex', gap: '1rem', p: '4px' }}>
          <Button
            onClick={() => {
              const newFIndex = positionAfter(firstRowFIndex);
              console.log(newFIndex);
              table.setCreatingRow(
                createRow(table, {
                  general: {
                    title: '',
                    published: false,
                    fIndex: newFIndex
                  }
                } as T)
              );
            }}
          >
            Add new
          </Button>
        </Box>
      );
    },
    muiRowDragHandleProps: ({ table }) => ({
      onDragEnd: () => {
        const { draggingRow, hoveredRow } = table.getState();

        if (hoveredRow && draggingRow) {
          // Get the indices of the dragging and hovered rows
          const draggingRowIndex = draggingRow.index;
          const hoveredRowIndex = (hoveredRow as MRT_Row<T>).index;

          // Reorder the data array
          const updatedData = [...data];
          const [movedRow] = updatedData.splice(draggingRowIndex, 1); // Remove the dragged row
          updatedData.splice(hoveredRowIndex, 0, movedRow); // Insert it at the new position

          // Get the fIndex values of surrounding rows
          const prevRowPosition =
            updatedData[hoveredRowIndex - 1]?.general?.fIndex || '';
          const nextRowPosition =
            updatedData[hoveredRowIndex + 1]?.general?.fIndex || '';

          // Ensure fIndex is valid for the dragged row and surrounding rows
          let newPosition = '';
          if (hoveredRowIndex === 0) {
            // If dragged to the first position, set fIndex relative to the first row
            newPosition = positionBefore(nextRowPosition || FIRST_POSITION);
          } else if (hoveredRowIndex === updatedData.length - 1) {
            // If dragged to the last position, set fIndex relative to the last row
            newPosition = positionAfter(prevRowPosition || FIRST_POSITION);
          } else {
            // If dragged between two rows, generate fIndex between the surrounding rows
            if (prevRowPosition && nextRowPosition) {
              newPosition = positionBetween(prevRowPosition, nextRowPosition);
            } else if (prevRowPosition) {
              newPosition = positionAfter(prevRowPosition);
            } else if (nextRowPosition) {
              newPosition = positionBefore(nextRowPosition);
            } else {
              // If both are undefined, fallback to a default first position
              newPosition = FIRST_POSITION;
            }
          }

          // Update only the dragged row's fIndex
          movedRow.general.fIndex = newPosition;

          // Update database entry
          updateData(movedRow, path, movedRow.id, token);

          // Update the state with the new order and fIndex
          setData(updatedData);
        }
      }
    }),

    renderToolbarInternalActions: () => <></>
  });

  // Render the table
  return <MaterialReactTable table={table} />;
};

export default MuiTable;
