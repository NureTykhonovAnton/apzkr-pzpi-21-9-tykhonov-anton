import React, { useState, useEffect } from 'react';
import { fetchTransportTypes, createTransportType, updateTransportType, deleteTransportType } from '../api/transportTypeRequests'; // Обновите путь к API
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Button, TextField, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from '@mui/material';

const TransportTypeManagementComponent = () => {
  const [transportTypes, setTransportTypes] = useState([]);
  const [newTransportTypeName, setNewTransportTypeName] = useState('');
  const [editTransportType, setEditTransportType] = useState(null);
  const [openEditDialog, setOpenEditDialog] = useState(false);

  useEffect(() => {
    const loadTransportTypes = async () => {
      try {
        const transportTypesData = await fetchTransportTypes();
        setTransportTypes(transportTypesData);
      } catch (error) {
        console.error('Error fetching transport types:', error);
      }
    };

    loadTransportTypes();
  }, []);

  const handleCreateTransportType = async () => {
    if (!newTransportTypeName) return; // Убедитесь, что имя введено
    try {
      const createdTransportType = await createTransportType({ name: newTransportTypeName });
      setTransportTypes([...transportTypes, createdTransportType]);
      setNewTransportTypeName(''); // Очистить поле ввода
    } catch (error) {
      console.error('Error creating transport type:', error);
    }
  };

  const handleUpdateTransportType = async () => {
    if (!editTransportType || !editTransportType.name) return; // Убедитесь, что редактируемое имя введено
    try {
      const updated = await updateTransportType(editTransportType.id, { name: editTransportType.name });
      setTransportTypes(transportTypes.map(type => (type.id === editTransportType.id ? updated : type)));
      setEditTransportType(null);
      setOpenEditDialog(false);
    } catch (error) {
      console.error('Error updating transport type:', error);
    }
  };

  const handleDeleteTransportType = async (id) => {
    try {
      await deleteTransportType(id);
      setTransportTypes(transportTypes.filter(type => type.id !== id));
    } catch (error) {
      console.error('Error deleting transport type:', error);
    }
  };

  const handleEditClick = (type) => {
    setEditTransportType(type);
    setOpenEditDialog(true);
  };

  const handleEditChange = (e) => {
    setEditTransportType({ ...editTransportType, name: e.target.value });
  };

  return (
    <TableContainer component={Paper}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>ID</TableCell>
            <TableCell>Transport Type Name</TableCell>
            <TableCell>Actions</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {transportTypes.map(type => (
            <TableRow key={type.id}>
              <TableCell>{type.id}</TableCell>
              <TableCell>{type.name}</TableCell>
              <TableCell>
                <Button 
                  aria-label="edit" 
                  variant="contained" 
                  color="secondary" 
                  onClick={() => handleEditClick(type)}
                >
                  Edit
                </Button>
                <Button 
                  aria-label="delete" 
                  variant="contained" 
                  color="primary" 
                  onClick={() => handleDeleteTransportType(type.id)}
                  sx={{ ml: 1 }}
                >
                  Delete
                </Button>
              </TableCell>
            </TableRow>
          ))}
          <TableRow>
            <TableCell colSpan={2}>
              <TextField 
                label="New Transport Type Name" 
                value={newTransportTypeName} 
                onChange={(e) => setNewTransportTypeName(e.target.value)} 
                fullWidth 
              />
            </TableCell>
            <TableCell>
              <Button 
                variant="contained" 
                color="primary" 
                onClick={handleCreateTransportType}
              >
                Create Transport Type
              </Button>
            </TableCell>
          </TableRow>
        </TableBody>
      </Table>

      {/* Edit Transport Type Dialog */}
      <Dialog open={openEditDialog} onClose={() => setOpenEditDialog(false)}>
        <DialogTitle>Edit Transport Type</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Update the name of the transport type.
          </DialogContentText>
          <TextField 
            label="Transport Type Name" 
            value={editTransportType?.name || ''} 
            onChange={handleEditChange} 
            fullWidth 
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenEditDialog(false)} color="secondary">
            Cancel
          </Button>
          <Button onClick={handleUpdateTransportType} color="primary">
            Update Transport Type
          </Button>
        </DialogActions>
      </Dialog>
    </TableContainer>
  );
};

export default TransportTypeManagementComponent;
