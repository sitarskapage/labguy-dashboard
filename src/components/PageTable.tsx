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
  GridRowModel,
} from "@mui/x-data-grid";
import { Alert, AlertProps, Snackbar, useTheme } from "@mui/material";
import { useNavigate, useRouteLoaderData } from "react-router-dom";
import { v4 as uuid } from "uuid";
import { AuthContext } from "../contexts/AuthContext";
import {
  useCreateData,
  useDeleteData,
  useUpdateData,
} from "../utils/useServerRequest";

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
  //fetchers

  //init
  const { createData, error: createError } = useCreateData();
  const { updateData, error: updateError } = useUpdateData();
  const { deleteData, error: deleteError } = useDeleteData();

  const pageId = getRoute();
  const navigate = useNavigate();

  const data = useRouteLoaderData(getRoute()) as T[];

  const { token } = React.useContext(AuthContext);

  const theme = useTheme();

  //states
  const [snackbar, setSnackbar] = React.useState<Pick<
    AlertProps,
    "children" | "severity"
  > | null>(null);
  const [rows, setRows] = React.useState<GridRowsProp>(data);
  const [rowModesModel, setRowModesModel] = React.useState<GridRowModesModel>(
    {}
  );

  React.useEffect(() => {
    if (deleteError || updateError || createError)
      setSnackbar({
        children: deleteError || updateError || createError,
        severity: "error",
      });
  }, [deleteError, updateError, createError]);

  //handlers

  const handleRowEditStop: GridEventListener<"rowEditStop"> = (
    params,
    event
  ) => {
    if (params.reason === GridRowEditStopReasons.rowFocusOut) {
      event.defaultMuiPrevented = true;
    }
  };

  const handleEditClick = (_id: GridRowId) => () => {
    navigate(`update/${_id}`);

    // setRowModesModel((prevModel) => ({
    //   ...prevModel,
    //   [_id]: { mode: GridRowModes.Edit },
    // }));
  };

  const handleSaveClick = (_id: GridRowId) => () => {
    setRowModesModel({ ...rowModesModel, [_id]: { mode: GridRowModes.View } });
  };

  const handleDeleteClick = (_id: GridRowId) => async () => {
    const result = window.confirm(
      `Are you sure you want to delete item ${_id} permanently?`
    );
    if (token)
      if (result) {
        try {
          const success = await deleteData(_id as string, pageId, token);
          if (success) {
            setRows((rows) => rows.filter((row) => row._id !== _id));
            setSnackbar({
              children: "Item successfully deleted",
              severity: "success",
            });
          }
        } catch (error) {
          console.error("Failed to delete item:", error);
          setSnackbar({
            children: error.message,
            severity: "error",
          });
        }
      }
  };

  const handleCancelClick = (_id: GridRowId) => () => {
    setRowModesModel({
      ...rowModesModel,
      [_id]: { mode: GridRowModes.View, ignoreModifications: true },
    });
  };

  const handleCloseSnackbar = () => setSnackbar(null);

  const handleProcessRowUpdate = async (newRow: GridRowModel) => {
    const oldId = newRow._id;
    if (token)
      if (newRow.isNew) {
        delete newRow._id;
        const result = await createData(newRow, pageId, token);
        result &&
          setRows(rows.map((row) => (row._id === oldId ? result : row)));
        setSnackbar({
          children: "Table successfully updated",
          severity: "success",
        });
        return result;
      } else {
        const result = await updateData(
          { ...newRow, _id: newRow._id },
          pageId,
          token
        );
        result &&
          setRows(rows.map((row) => (row._id === oldId ? result : row)));
        setSnackbar({
          children: "Table successfully updated",
          severity: "success",
        });
        return result;
      }
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
      {!!snackbar && (
        <Snackbar
          open
          anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
          onClose={handleCloseSnackbar}
          autoHideDuration={6000}>
          <Alert {...snackbar} onClose={handleCloseSnackbar} />
        </Snackbar>
      )}
    </>
  );
}
