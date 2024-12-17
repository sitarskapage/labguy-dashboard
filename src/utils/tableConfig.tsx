import { Box, Button, IconButton } from '@mui/material';
import { MRT_ColumnDef, MRT_TableOptions } from 'material-react-table';
import { MouseEventHandler } from 'react';
import SearchIcon from '@mui/icons-material/Search';

const tableConfig = <T extends object>(
  columns: MRT_ColumnDef<T, unknown>[],
  data: T[],
  handleAddClick: MouseEventHandler<HTMLButtonElement> | undefined
): MRT_TableOptions<T> => ({
  columns,
  data,
  enableColumnResizing: true,
  layoutMode: 'grid',
  enableColumnActions: true,
  positionActionsColumn: 'last',
  enableRowActions: true,
  enableColumnFilters: false,
  enablePagination: true,
  enableSorting: false,
  createDisplayMode: 'row',
  enableEditing: true,
  editDisplayMode: 'row',

  mrtTheme: (theme: { palette: { background: { default: any } } }) => ({
    baseBackgroundColor: theme.palette.background.default
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
  renderTopToolbarCustomActions: () => {
    return (
      <Box sx={{ display: 'flex', gap: '1rem', p: '4px' }}>
        <Button onClick={handleAddClick}>Add new</Button>
      </Box>
    );
  },
  renderToolbarInternalActions: ({ table }) => (
    <>
      {/* Custom Search Button */}
      <IconButton
        onClick={() =>
          table.setShowGlobalFilter(!table.getState().showGlobalFilter)
        }
      >
        <SearchIcon />
      </IconButton>
    </>
  )
});
export default tableConfig;
