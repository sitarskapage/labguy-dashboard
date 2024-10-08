import { useState } from 'react';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import Button from '@mui/material/Button';
import {
  DragDropContext,
  Draggable,
  Droppable,
  DropResult
} from '@hello-pangea/dnd';
import { AiOutlineDrag } from 'react-icons/ai';
import { Box, Card } from '@mui/material';
import { DataGrid, GridToolbarContainer } from '@mui/x-data-grid';
import AddIcon from '@mui/icons-material/Add';

export default function DragDropTable() {
  // Function to create data for each row
  function createData(
    id: number,
    name: string,
    calories: number,
    fat: number,
    carbs: number,
    protein: number
  ) {
    return { id, name, calories, fat, carbs, protein };
  }

  const [rows, setRows] = useState([
    createData(1, 'Frozen yoghurt', 159, 6.0, 24, 4.0),
    createData(2, 'Ice cream sandwich', 237, 9.0, 37, 4.3),
    createData(3, 'Eclair', 262, 16.0, 24, 6.0),
    createData(4, 'Cupcake', 305, 3.7, 67, 4.3),
    createData(5, 'Gingerbread', 356, 16.0, 49, 3.9)
  ]);

  // Handle drag and drop
  const handleDragEnd = (e: DropResult) => {
    if (!e.destination) return;
    const tempData = Array.from(rows);
    const [source_data] = tempData.splice(e.source.index, 1);
    tempData.splice(e.destination.index, 0, source_data);
    setRows(tempData);
  };

  // Function to handle adding a new row
  const handleAddNew = () => {
    const newId = rows.length + 1;
    const newRow = createData(newId, `New dessert ${newId}`, 100, 10, 20, 5);
    setRows([newRow, ...rows]);
  };

  return (
    <Box sx={{ width: '100%' }}>
      <DataGrid columns={[]} compo />
      {/* Toolbar with "Add New" button */}
      <Button color="primary" startIcon={<AddIcon />}>
        Add new
      </Button>
      {/* Table with drag-and-drop functionality */}{' '}
      <Card variant="outlined">
        <TableContainer>
          <DragDropContext onDragEnd={handleDragEnd}>
            <Table sx={{ minWidth: 650 }} aria-label="data grid like table">
              <TableHead>
                <TableRow>
                  <TableCell>Order</TableCell>
                  <TableCell>Dessert (100g serving)</TableCell>
                  <TableCell align="right">Calories</TableCell>
                  <TableCell align="right">Fat&nbsp;(g)</TableCell>
                  <TableCell align="right">Carbs&nbsp;(g)</TableCell>
                  <TableCell align="right">Protein&nbsp;(g)</TableCell>
                </TableRow>
              </TableHead>

              <Droppable droppableId="droppable-1">
                {(provider) => (
                  <TableBody
                    ref={provider.innerRef}
                    {...provider.droppableProps}
                  >
                    {rows.map((row, index) => (
                      <Draggable
                        key={row.id}
                        draggableId={row.id.toString()}
                        index={index}
                      >
                        {(provider, snapshot) => (
                          <TableRow
                            ref={provider.innerRef}
                            {...provider.draggableProps}
                            sx={{
                              backgroundColor: snapshot.isDragging
                                ? 'lightblue'
                                : 'inherit',
                              '&:last-child td, &:last-child th': { border: 0 }
                            }}
                          >
                            <TableCell {...provider.dragHandleProps}>
                              <AiOutlineDrag />
                            </TableCell>
                            <TableCell>{row.name}</TableCell>
                            <TableCell align="right">{row.calories}</TableCell>
                            <TableCell align="right">{row.fat}</TableCell>
                            <TableCell align="right">{row.carbs}</TableCell>
                            <TableCell align="right">{row.protein}</TableCell>
                          </TableRow>
                        )}
                      </Draggable>
                    ))}
                    {provider.placeholder}
                  </TableBody>
                )}
              </Droppable>
            </Table>
          </DragDropContext>
        </TableContainer>
      </Card>
    </Box>
  );
}
