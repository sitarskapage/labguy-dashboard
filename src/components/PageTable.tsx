import * as React from "react";
import Button from "@mui/material/Button";
import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/DeleteOutlined";
import SaveIcon from "@mui/icons-material/Save";
import CancelIcon from "@mui/icons-material/Close";
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
} from "@mui/x-data-grid";
import { useTheme } from "@mui/material";
import { useNavigate, useRouteLoaderData } from "react-router-dom";
import { v4 as uuid } from "uuid";
import { AuthContext } from "../contexts/AuthContext";
import useRequest from "../utils/useRequest";

interface EditToolbarProps {
  setRows: (newRows: (oldRows: GridRowsProp) => GridRowsProp) => void;
  setRowModesModel: (
    newModel: (oldModel: GridRowModesModel) => GridRowModesModel
  ) => void;
}

interface MuiTableProps {
  columns: GridColDef[];
}

function EditToolbar(props: EditToolbarProps) {
  const { setRows, setRowModesModel } = props;

  const handleClick = () => {
    const _id = uuid();
    setRows((oldRows) => [{ _id, isNew: true }, ...oldRows]);
    setRowModesModel((oldModel) => ({
      ...oldModel,
      [_id]: { mode: GridRowModes.Edit, fieldToFocus: "name" },
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
  const segments = window.location.pathname.split("/");
  const lastSegment = segments[segments.length - 1];
  return lastSegment;
}

export default function PageTable<T extends GridValidRowModel>({
  columns,
}: MuiTableProps) {
  //init

  const { createData, updateData, deleteData } = useRequest<T>();
  const pageId = getRoute();
  const navigate = useNavigate();
  const data = useRouteLoaderData(getRoute()) as T[];
  const { token } = React.useContext(AuthContext);
  const theme = useTheme();

  //states

  const [rows, setRows] = React.useState<GridRowsProp>(data);
  const [rowModesModel, setRowModesModel] = React.useState<GridRowModesModel>(
    {}
  );

  //handlers

  const handleRowEditStop: GridEventListener<"rowEditStop"> = (
    params,
    event
  ) => {
    if (params.reason === GridRowEditStopReasons.rowFocusOut) {
      event.defaultMuiPrevented = true;
    }
  };

  const handleEditClick = (_id: GridRowId) => () => navigate(`update/${_id}`);

  const handleSaveClick = (_id: GridRowId) => () => {
    setRowModesModel({ ...rowModesModel, [_id]: { mode: GridRowModes.View } });
  };

  const handleDeleteClick = (_id: GridRowId) => async () => {
    const result = window.confirm(
      `Are you sure you want to delete item ${_id} permanently?`
    );
    if (!result) return;

    deleteData(_id as string, pageId, token).then(() =>
      setRows((rows) => rows.filter((row) => row._id !== _id))
    );
  };

  const handleCancelClick = (_id: GridRowId) => () => {
    setRowModesModel({
      ...rowModesModel,
      [_id]: { mode: GridRowModes.View, ignoreModifications: true },
    });
  };

  const handleProcessRowUpdate = async (newRow: T): Promise<T> => {
    const oldId = newRow._id;
    let result: T | null;

    if (newRow.isNew) {
      //save
      delete newRow._id;
      result = await createData(newRow, pageId, token);
    } else {
      //update
      result = await updateData(newRow, pageId, token);
    }

    if (!result) {
      throw new Error("Update failed");
    }

    setRows(rows.map((row) => (row._id === oldId ? result : row)));
    return result;
  };

  const handleProcessRowUpdateError = React.useCallback((err: Error) => {
    throw new Error(err.message);
  }, []);

  const handleRowModesModelChange = (newRowModesModel: GridRowModesModel) => {
    setRowModesModel(newRowModesModel);
  };

  const combinedColumns: GridColDef[] = [
    ...columns,
    {
      field: "actions",
      type: "actions",
      headerName: "Actions",
      getActions: ({ id }) => {
        const isInEditMode = rowModesModel[id]?.mode === GridRowModes.Edit;

        if (isInEditMode) {
          return [
            <GridActionsCellItem
              icon={<SaveIcon />}
              label="Save"
              sx={{
                color: "primary.main",
              }}
              onClick={handleSaveClick(id)}
            />,
            <GridActionsCellItem
              icon={<CancelIcon />}
              label="Cancel"
              className="textPrimary"
              onClick={handleCancelClick(id)}
              color="inherit"
            />,
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
            onClick={handleDeleteClick(id)}
            color="inherit"
          />,
        ];
      },
    },
  ];

  return (
    <>
      <DataGrid
        getRowId={(row) => row._id}
        rows={rows}
        columns={combinedColumns}
        editMode="row"
        rowModesModel={rowModesModel}
        onRowModesModelChange={handleRowModesModelChange}
        onRowEditStop={handleRowEditStop}
        processRowUpdate={handleProcessRowUpdate}
        onProcessRowUpdateError={handleProcessRowUpdateError}
        slots={{ toolbar: EditToolbar as GridSlots["toolbar"] }}
        slotProps={{ toolbar: { setRows, setRowModesModel } }}
        sx={{ backgroundColor: theme.palette.background.paper }}
        autoHeight
      />
    </>
  );
}
