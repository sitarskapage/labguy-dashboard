import { Box, Button, IconButton } from '@mui/material';
import { MRT_ColumnDef, MRT_TableOptions } from 'material-react-table';
import { MouseEventHandler } from 'react';
import SearchIcon from '@mui/icons-material/Search';
import { Refresh } from '@mui/icons-material';

const tableConfig = <T extends object>(
  columns: MRT_ColumnDef<T, unknown>[],
  data: T[],
  handleAddClick: MouseEventHandler<HTMLButtonElement> | undefined,
  revalidator: {
    revalidate(): Promise<void>;
  }
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
  muiTablePaperProps: {
    sx: {
      p: 2
    }
  },
  muiTableBodyRowProps: { hover: false },
  muiTableProps: {
    sx: {
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
      borderLeft: '1px solid rgba(81, 81, 81, .5)',
      borderRight: '1px solid rgba(81, 81, 81, .5)',
      borderBottom: '1px solid rgba(81, 81, 81, .5)'
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
      <IconButton onClick={() => revalidator.revalidate()}>
        <Refresh />
      </IconButton>
    </>
  )
});
export default tableConfig;
