import { TagSchema } from '@jakubkanna/labguy-front-schema';
import { Box, Tooltip, IconButton } from '@mui/material';
import {
  MRT_ColumnDef,
  MRT_TableOptions,
  MRT_Row,
  useMaterialReactTable,
  MaterialReactTable
} from 'material-react-table';
import { useState, useMemo, useContext } from 'react';
import { useRouteLoaderData } from 'react-router-dom';
import useRequest from '../../hooks/useRequest';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { GeneralContext } from '../../contexts/GeneralContext';
import tableConfig from '../../utils/tableConfig';

const UpdateTags = () => {
  const path = 'tags';
  const initData = useRouteLoaderData(path) as TagSchema[];
  const { createData, deleteData } = useRequest<TagSchema>();
  const { token } = useContext(GeneralContext);
  const [data, setData] = useState<TagSchema[]>(initData || []);
  const [validationErrors, setValidationErrors] = useState<
    Record<string, string | undefined>
  >({});

  const columns = useMemo<MRT_ColumnDef<TagSchema>[]>(
    () => [
      {
        accessorKey: 'id',
        header: 'Id',
        enableEditing: false, // Disable editing for ID
        size: 80
      },
      {
        accessorKey: 'title',
        header: 'Title',
        muiEditTextFieldProps: {
          required: true,
          error: !!validationErrors?.title,
          helperText: validationErrors?.title,
          onFocus: () =>
            setValidationErrors({
              ...validationErrors,
              title: undefined
            })
        }
      }
    ],
    [validationErrors]
  );

  // CREATE action
  const handleCreateTag: MRT_TableOptions<TagSchema>['onCreatingRowSave'] =
    async ({ values, table }) => {
      const newValidationErrors = validateTag(values);
      if (Object.values(newValidationErrors).some((error) => error)) {
        setValidationErrors(newValidationErrors);
        return;
      }
      setValidationErrors({});
      const newTag = await createData(values, path, token);
      if (newTag) {
        setData((prev) => [...prev, newTag]);
      }
      table.setCreatingRow(null); // Exit creating mode
    };

  // UPDATE action
  const handleSaveTag: MRT_TableOptions<TagSchema>['onEditingRowSave'] =
    async ({ values, table }) => {
      const newValidationErrors = validateTag(values);
      if (Object.values(newValidationErrors).some((error) => error)) {
        setValidationErrors(newValidationErrors);
        return;
      }
      setValidationErrors({});
      const updatedTag = await createData(values, path, token);
      if (updatedTag) {
        setData((prev) =>
          prev.map((tag) => (tag.id === updatedTag.id ? updatedTag : tag))
        );
      }
      table.setEditingRow(null); // Exit editing mode
    };

  // DELETE action
  const openDeleteConfirmModal = (row: MRT_Row<TagSchema>) => {
    if (window.confirm('Are you sure you want to delete this tag?')) {
      deleteData(path, row.original.id as number, token).then(() => {
        setData((prev) => prev.filter((tag) => tag.id !== row.original.id));
      });
    }
  };
  const handleAddClick = () => {
    table.setCreatingRow(true);
  };
  const table = useMaterialReactTable({
    ...tableConfig<TagSchema>(columns, data, handleAddClick),
    getRowId: (row) => row.id as unknown as string,
    onCreatingRowCancel: () => setValidationErrors({}),
    onCreatingRowSave: handleCreateTag,
    onEditingRowCancel: () => setValidationErrors({}),
    onEditingRowSave: handleSaveTag,
    renderRowActions: ({ row, table }) => (
      <Box sx={{ display: 'flex', gap: '1rem' }}>
        <Tooltip title="Edit">
          <IconButton onClick={() => table.setEditingRow(row)}>
            <EditIcon />
          </IconButton>
        </Tooltip>
        <Tooltip title="Delete">
          <IconButton color="error" onClick={() => openDeleteConfirmModal(row)}>
            <DeleteIcon />
          </IconButton>
        </Tooltip>
      </Box>
    ),
    state: {
      showProgressBars: !initData
    }
  });

  return <MaterialReactTable table={table} />;
};

// Validation function
const validateRequired = (value: string) => !!value.length;
function validateTag(tag: TagSchema) {
  return {
    title: !validateRequired(tag.title || '') ? 'Title is required' : ''
  };
}

export default UpdateTags;
