import * as React from 'react';
import Button from '@mui/material/Button';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/DeleteOutlined';
import SaveIcon from '@mui/icons-material/Save';
import LinkIcon from '@mui/icons-material/Link';
import CancelIcon from '@mui/icons-material/Close';
import {
  DataGrid,
  GridColDef,
  GridActionsCellItem,
  GridRowId,
  GridRowModes,
  GridRowModesModel,
  GridRowEditStopReasons,
  GridEventListener,
  GridSlots,
  GridRowsProp,
  GridToolbarContainer,
  GridValidRowModel,
  GridRenderCellParams,
  GridRowModel
} from '@mui/x-data-grid';
import { Box, Link, useTheme } from '@mui/material';
import { useNavigate, useRouteLoaderData } from 'react-router-dom';
import { v4 as uuid } from 'uuid';
import useRequest from '../utils/useRequest';
import { GeneralContext } from '../contexts/GeneralContext';
import _set from 'lodash/set';
import _get from 'lodash/get';
import _cloneDeep from 'lodash/cloneDeep';
import { PropertyPath } from 'lodash';

interface EditToolbarProps {
  setRows: (newRows: (oldRows: GridRowsProp) => GridRowsProp) => void;
  setRowModesModel: (
    newModel: (oldModel: GridRowModesModel) => GridRowModesModel
  ) => void;
}

interface MuiTableProps {
  columns?: GridColDef[];
}

function EditToolbar(props: EditToolbarProps) {
  const { setRows, setRowModesModel } = props;

  const handleClick = () => {
    const id = uuid();
    setRows((oldRows) => [{ id, isNew: true }, ...oldRows]);
    setRowModesModel((oldModel) => ({
      ...oldModel,
      [id]: { mode: GridRowModes.Edit, fieldToFocus: 'name' }
    }));
  };

  return (
    <GridToolbarContainer>
      <Button color="primary" startIcon={<AddIcon />} onClick={handleClick}>
        Add new
      </Button>
    </GridToolbarContainer>
  );
}

function getRoute() {
  const segments = window.location.pathname.split('/');
  const lastSegment = segments[segments.length - 1];
  return lastSegment;
}

export default function PageTable<T extends GridValidRowModel>({
  columns
}: MuiTableProps) {
  //init

  const { createData, updateData, deleteData } = useRequest<T>();
  const path = getRoute();
  const navigate = useNavigate();
  const data = useRouteLoaderData(getRoute()) as T[];
  const { token } = React.useContext(GeneralContext);
  const theme = useTheme();

  //states

  const [rows, setRows] = React.useState<GridRowsProp>(data);
  const [rowModesModel, setRowModesModel] = React.useState<GridRowModesModel>(
    {}
  );

  //handlers

  const handleRowEditStop: GridEventListener<'rowEditStop'> = (
    params,
    event
  ) => {
    if (params.reason === GridRowEditStopReasons.rowFocusOut) {
      event.defaultMuiPrevented = true;
    }
  };

  const handleEditClick = (id: GridRowId) => () => navigate(`update/${id}`);

  const handleSaveClick = (id: GridRowId) => () => {
    setRowModesModel({ ...rowModesModel, [id]: { mode: GridRowModes.View } });
  };

  const handleDeleteClick = (rowToDelete: T) => async () => {
    const result = window.confirm(
      `Are you sure you want to delete "${rowToDelete.general.title}" permanently?`
    );
    if (!result) return;

    deleteData(path, rowToDelete.id, token).then(() =>
      setRows((rows) => rows.filter((row) => row.id !== rowToDelete.id))
    );
  };

  const handleCancelClick = (id: GridRowId) => () => {
    setRowModesModel({
      ...rowModesModel,
      [id]: { mode: GridRowModes.View, ignoreModifications: true }
    });
    const editedRow = rows.find((row) => row.id === id);
    if (editedRow!.isNew) {
      setRows(rows.filter((row) => row.id !== id));
    }
  };

  const handleProcessRowUpdate = async (newRow: GridRowModel): Promise<T> => {
    const oldId = newRow.id;
    let result: T | null;

    if (newRow.isNew) {
      //save
      delete newRow.id;
      result = await createData(newRow as T, path, token);
    } else {
      //update
      result = await updateData(newRow as T, path, newRow.id, token);
    }

    if (!result) {
      throw new Error('Update failed');
    }

    setRows(rows.map((row) => (row.id === oldId ? result : row)));
    return result;
  };

  const handleProcessRowUpdateError = React.useCallback((err: Error) => {
    throw new Error(err.message);
  }, []);

  const handleRowModesModelChange = (newRowModesModel: GridRowModesModel) => {
    setRowModesModel(newRowModesModel);
  };

  const getPreviewUrl = (params: GridRenderCellParams) => {
    const base = import.meta.env.VITE_FRONT_URL;
    console.log(base, path);
    const url = `${base}${path}/${params.row.general?.slug || '#'}`; //error: Cannot read properties of undefined (reading 'slug')
    return url;
  };

  function nested<T extends GridValidRowModel>(path: PropertyPath) {
    return {
      valueGetter: (_value: unknown, row: T) => _get(row, path),
      valueSetter: (value: unknown, row: T) => {
        const newRow = _cloneDeep(row);
        _set(newRow, path, value);
        return newRow;
      }
    };
  }

  const combinedColumns: GridColDef[] = [
    {
      field: 'generalTitle',
      headerName: 'Title',
      flex: 1,
      editable: true,
      ...nested<T>('general.title')
    },
    ...(columns || []),
    {
      field: 'preview',
      headerName: 'Preview',
      editable: false,
      type: 'boolean',
      renderCell: (params) => {
        return (
          <Box
            display="flex"
            justifyContent="center"
            alignItems="center"
            height="100%"
          >
            <Link
              href={getPreviewUrl(params)}
              target="_blank"
              rel="noopener noreferrer"
              sx={{ display: 'flex', alignItems: 'center' }}
            >
              <LinkIcon />
            </Link>
          </Box>
        );
      }
    },
    {
      field: 'generalPublished',
      headerName: 'Published',
      editable: true,
      type: 'boolean',
      ...nested<T>('general.published')
    },
    {
      field: 'actions',
      type: 'actions',
      headerName: 'Actions',
      getActions: ({ id, row }) => {
        const isInEditMode = rowModesModel[id]?.mode === GridRowModes.Edit;

        if (isInEditMode) {
          return [
            <GridActionsCellItem
              icon={<SaveIcon />}
              label="Save"
              sx={{
                color: 'primary.main'
              }}
              onClick={handleSaveClick(id)}
            />,
            <GridActionsCellItem
              icon={<CancelIcon />}
              label="Cancel"
              className="textPrimary"
              onClick={handleCancelClick(id)}
              color="inherit"
            />
          ];
        }

        return [
          <GridActionsCellItem
            icon={<EditIcon />}
            label="Edit"
            className="textPrimary"
            onClick={handleEditClick(id)}
            color="inherit"
          />,
          <GridActionsCellItem
            icon={<DeleteIcon />}
            label="Delete"
            onClick={handleDeleteClick(row)}
            color="inherit"
          />
        ];
      }
    }
  ];

  return (
    <>
      <DataGrid
        getRowId={(row) => row.id}
        rows={rows}
        columns={combinedColumns}
        editMode="row"
        rowModesModel={rowModesModel}
        onRowModesModelChange={handleRowModesModelChange}
        onRowEditStop={handleRowEditStop}
        processRowUpdate={handleProcessRowUpdate}
        onProcessRowUpdateError={handleProcessRowUpdateError}
        slots={{ toolbar: EditToolbar as GridSlots['toolbar'] }}
        slotProps={{ toolbar: { setRows, setRowModesModel } }}
        sx={{ backgroundColor: theme.palette.background.paper }}
        autoHeight
      />
    </>
  );
}
