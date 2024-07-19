import * as React from "react";
import Button from "@mui/material/Button";
import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/DeleteOutlined";
import SaveIcon from "@mui/icons-material/Save";
import LinkIcon from "@mui/icons-material/Link";
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
  GridRenderCellParams,
} from "@mui/x-data-grid";
import { Box, Link, useTheme } from "@mui/material";
import { useNavigate, useRouteLoaderData } from "react-router-dom";
import { v4 as uuid } from "uuid";
import useRequest from "../utils/useRequest";
import { GeneralContext } from "../contexts/GeneralContext";

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
  const { token, settings } = React.useContext(GeneralContext);
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

  const handleDeleteClick = (rowToDelete: T) => async () => {
    const result = window.confirm(
      `Are you sure you want to delete item ${rowToDelete.title} permanently?`
    );
    if (!result) return;

    deleteData(rowToDelete, pageId, token).then(() =>
      setRows((rows) => rows.filter((row) => row._id !== rowToDelete._id))
    );
  };

  const handleCancelClick = (_id: GridRowId) => () => {
    setRowModesModel({
      ...rowModesModel,
      [_id]: { mode: GridRowModes.View, ignoreModifications: true },
    });
    const editedRow = rows.find((row) => row._id === _id);
    if (editedRow!.isNew) {
      setRows(rows.filter((row) => row._id !== _id));
    }
  };

  const handleProcessRowUpdate = async (newRow: T): Promise<T> => {
    //causing typescript error
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

  const getPreviewUrl = (params: GridRenderCellParams) => {
    const base = settings?.general?.website?.details?.domain;
    const url = `https://${base}/${pageId}/${params.row.slug}`;
    return url;
  };

  const combinedColumns: GridColDef[] = [
    { field: "title", headerName: "Title", flex: 1, editable: true },
    ...(columns || []),
    {
      field: "preview",
      headerName: "Preview",
      editable: false,
      type: "boolean",
      renderCell: (params) => {
        return (
          <Box
            display="flex"
            justifyContent="center"
            alignItems="center"
            height="100%">
            <Link
              href={getPreviewUrl(params)}
              target="_blank"
              rel="noopener noreferrer"
              sx={{ display: "flex", alignItems: "center" }}>
              <LinkIcon />
            </Link>
          </Box>
        );
      },
    },
    {
      field: "public",
      headerName: "Public",
      editable: true,
      type: "boolean",
    },
    {
      field: "actions",
      type: "actions",
      headerName: "Actions",
      getActions: ({ id, row }) => {
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
            onClick={handleDeleteClick(row)}
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
