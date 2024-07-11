import React, { useState, useEffect } from 'react';
import { fetchEmergencyTypes, createEmergencyType, updateEmergencyType, deleteEmergencyType } from '../api/emergencyTypeRequests';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Button, TextField, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from '@mui/material';

const EmergencyTypeManagementComponent = () => {
  const [emergencyTypes, setEmergencyTypes] = useState([]);
  const [newEmergencyType, setNewEmergencyType] = useState({ name: '', description: '' });
  const [editEmergencyType, setEditEmergencyType] = useState(null);
  const [openEditDialog, setOpenEditDialog] = useState(false);

  useEffect(() => {
    const loadEmergencyTypes = async () => {
      try {
        const data = await fetchEmergencyTypes();
        setEmergencyTypes(data);
      } catch (error) {
        console.error('Error fetching emergency types:', error);
      }
    };

    loadEmergencyTypes();
  }, []);

  const handleCreateEmergencyType = async () => {
    if (!newEmergencyType.name || !newEmergencyType.description) return;
    try {
      const createdEmergencyType = await createEmergencyType(newEmergencyType);
      setEmergencyTypes([...emergencyTypes, createdEmergencyType]);
      setNewEmergencyType({ name: '', description: '' });
    } catch (error) {
      console.error('Error creating emergency type:', error);
    }
  };

  const handleUpdateEmergencyType = async () => {
    if (!editEmergencyType || !editEmergencyType.name || !editEmergencyType.description) return;
    try {
      const updated = await updateEmergencyType(editEmergencyType.id, editEmergencyType);
      setEmergencyTypes(emergencyTypes.map(type => (type.id === editEmergencyType.id ? updated : type)));
      setEditEmergencyType(null);
      setOpenEditDialog(false);
    } catch (error) {
      console.error('Error updating emergency type:', error);
    }
  };

  const handleDeleteEmergencyType = async (id) => {
    try {
      await deleteEmergencyType(id);
      setEmergencyTypes(emergencyTypes.filter(type => type.id !== id));
    } catch (error) {
      console.error('Error deleting emergency type:', error);
    }
  };

  const handleEditClick = (type) => {
    setEditEmergencyType(type);
    setOpenEditDialog(true);
  };

  const handleEditChange = (e) => {
    setEditEmergencyType({ ...editEmergencyType, [e.target.name]: e.target.value });
  };

  return (
    <TableContainer component={Paper}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>ID</TableCell>
            <TableCell>Name</TableCell>
            <TableCell>Description</TableCell>
            <TableCell>Actions</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {emergencyTypes.map(type => (
            <TableRow key={type.id}>
              <TableCell>{type.id}</TableCell>
              <TableCell>{type.name}</TableCell>
              <TableCell>{type.description}</TableCell>
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
                  onClick={() => handleDeleteEmergencyType(type.id)}
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
                label="Name" 
                name="name"
                value={newEmergencyType.name} 
                onChange={(e) => setNewEmergencyType({ ...newEmergencyType, name: e.target.value })} 
                fullWidth 
              />
            </TableCell>
            <TableCell>
              <TextField 
                label="Description" 
                name="description"
                value={newEmergencyType.description} 
                onChange={(e) => setNewEmergencyType({ ...newEmergencyType, description: e.target.value })} 
                fullWidth 
              />
            </TableCell>
            <TableCell>
              <Button 
                variant="contained" 
                color="primary" 
                onClick={handleCreateEmergencyType}
              >
                Create Type
              </Button>
            </TableCell>
          </TableRow>
        </TableBody>
      </Table>

      {/* Edit Emergency Type Dialog */}
      <Dialog open={openEditDialog} onClose={() => setOpenEditDialog(false)}>
        <DialogTitle>Edit Emergency Type</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Update the details of the emergency type.
          </DialogContentText>
          <TextField 
            label="Name" 
            name="name"
            value={editEmergencyType?.name || ''} 
            onChange={handleEditChange} 
            fullWidth 
          />
          <TextField 
            label="Description" 
            name="description"
            value={editEmergencyType?.description || ''} 
            onChange={handleEditChange} 
            fullWidth 
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenEditDialog(false)} color="secondary">
            Cancel
          </Button>
          <Button onClick={handleUpdateEmergencyType} color="primary">
            Update Type
          </Button>
        </DialogActions>
      </Dialog>
    </TableContainer>
  );
};

export default EmergencyTypeManagementComponent;
