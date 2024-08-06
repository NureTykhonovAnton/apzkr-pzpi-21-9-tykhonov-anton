import React, { useState, useEffect } from 'react';
import { fetchEmergencies, createEmergency, updateEmergency, deleteEmergency } from '../api/emergencyRequests';
import { fetchEmergencyTypes } from '../api/emergencyTypeRequests';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Button, TextField, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, MenuItem, Select, InputLabel, FormControl, Checkbox, FormControlLabel } from '@mui/material';
import { useAuth } from '../contexts/authContext';

const EmergencyManagementComponent = () => {
  const [emergencies, setEmergencies] = useState([]);
  const [emergencyTypes, setEmergencyTypes] = useState([]);
  const [newEmergency, setNewEmergency] = useState({ startedAt: '', endedAt: '', hasEnded: false, emergencyTypeId: '' });
  const [editEmergency, setEditEmergency] = useState(null);
  const [openEditDialog, setOpenEditDialog] = useState(false);
  const { role } = useAuth();

  useEffect(() => {
    const loadEmergencies = async () => {
      try {
        const data = await fetchEmergencies();
        setEmergencies(data);
      } catch (error) {
        console.error('Error fetching emergencies:', error);
      }
    };

    const loadEmergencyTypes = async () => {
      try {
        const typesData = await fetchEmergencyTypes();
        setEmergencyTypes(typesData);
      } catch (error) {
        console.error('Error fetching emergency types:', error);
      }
    };

    loadEmergencies();
    loadEmergencyTypes();
  }, []);

  const handleCreateEmergency = async () => {
    if (!newEmergency.startedAt || !newEmergency.emergencyTypeId) return;
    try {
      const createdEmergency = await createEmergency(newEmergency);
      setEmergencies([...emergencies, createdEmergency]);
      setNewEmergency({ startedAt: '', endedAt: '', hasEnded: false, emergencyTypeId: '' });
    } catch (error) {
      console.error('Error creating emergency:', error);
    }
  };

  const handleUpdateEmergency = async () => {
    if (!editEmergency || !editEmergency.startedAt || !editEmergency.emergencyTypeId) return;
    try {
      const updated = await updateEmergency(editEmergency.id, editEmergency);
      setEmergencies(emergencies.map(emergency => (emergency.id === editEmergency.id ? updated : emergency)));
      setEditEmergency(null);
      setOpenEditDialog(false);
    } catch (error) {
      console.error('Error updating emergency:', error);
    }
  };

  const handleDeleteEmergency = async (id) => {
    try {
      await deleteEmergency(id);
      setEmergencies(emergencies.filter(emergency => emergency.id !== id));
    } catch (error) {
      console.error('Error deleting emergency:', error);
    }
  };

  const handleEditClick = (emergency) => {
    setEditEmergency(emergency);
    setOpenEditDialog(true);
  };

  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditEmergency({ ...editEmergency, [name]: value });
  };

  const handleCheckboxChange = (e) => {
    const { name, checked } = e.target;
    setEditEmergency({ ...editEmergency, [name]: checked });
  };

  return (
    <TableContainer component={Paper}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>ID</TableCell>
            <TableCell>Started At</TableCell>
            <TableCell>Ended At</TableCell>
            <TableCell>Has Ended</TableCell>
            <TableCell>Type</TableCell>
            {role?.name.toLowerCase() === 'admin' && (<TableCell>Actions</TableCell>)}
          </TableRow>
        </TableHead>
        <TableBody>
          {emergencies.map(emergency => (
            <TableRow key={emergency.id}>
              <TableCell>{emergency.id}</TableCell>
              <TableCell>{emergency.startedAt}</TableCell>
              <TableCell>{emergency.endedAt}</TableCell>
              <TableCell>{emergency.hasEnded ? 'Yes' : 'No'}</TableCell>
              <TableCell>{emergencyTypes.find(type => type.id === emergency.emergencyTypeId)?.name}</TableCell>
              {role?.name.toLowerCase() === 'admin' && (
                <TableCell>
                  <Button
                    aria-label="edit"
                    variant="contained"
                    color="secondary"
                    onClick={() => handleEditClick(emergency)}
                  >
                    Edit
                  </Button>
                  <Button
                    aria-label="delete"
                    variant="contained"
                    color="primary"
                    onClick={() => handleDeleteEmergency(emergency.id)}
                    sx={{ ml: 1 }}
                  >
                    Delete
                  </Button>
                </TableCell>
              )}

            </TableRow>
          ))}
          <TableRow>
            <TableCell colSpan={2}>
              <TextField
                label="Started At"
                type="datetime-local"
                name="startedAt"
                value={newEmergency.startedAt}
                onChange={(e) => setNewEmergency({ ...newEmergency, startedAt: e.target.value })}
                fullWidth
              />
            </TableCell>
            <TableCell>
              <TextField
                label="Ended At"
                type="datetime-local"
                name="endedAt"
                value={newEmergency.endedAt}
                onChange={(e) => setNewEmergency({ ...newEmergency, endedAt: e.target.value })}
                fullWidth
              />
            </TableCell>
            <TableCell>
              <FormControlLabel
                control={<Checkbox checked={newEmergency.hasEnded} onChange={(e) => setNewEmergency({ ...newEmergency, hasEnded: e.target.checked })} name="hasEnded" />}
                label="Has Ended"
              />
            </TableCell>
            <TableCell>
              <FormControl fullWidth>
                <InputLabel>Type</InputLabel>
                <Select
                  value={newEmergency.emergencyTypeId}
                  onChange={(e) => setNewEmergency({ ...newEmergency, emergencyTypeId: e.target.value })}
                >
                  {emergencyTypes.map(type => (
                    <MenuItem key={type.id} value={type.id}>
                      {type.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </TableCell>
            <TableCell>
              <Button
                variant="contained"
                color="primary"
                onClick={handleCreateEmergency}
              >
                Create Emergency
              </Button>
            </TableCell>
          </TableRow>
        </TableBody>
      </Table>

      {/* Edit Emergency Dialog */}
      <Dialog open={openEditDialog} onClose={() => setOpenEditDialog(false)}>
        <DialogTitle>Edit Emergency</DialogTitle>
        <DialogContent>
          <DialogContentText sx={{ my: 1 }} >
            Update the details of the emergency.
          </DialogContentText>
          <TextField sx={{ my: 1 }}
            label="Started At"
            type="datetime-local"
            name="startedAt"
            value={editEmergency?.startedAt || ''}
            onChange={handleEditChange}
            fullWidth
          />
          <TextField sx={{ my: 1 }}
            label="Ended At"
            type="datetime-local"
            name="endedAt"
            value={editEmergency?.endedAt || ''}
            onChange={handleEditChange}
            fullWidth
          />
          <FormControlLabel sx={{ my: 1 }}
            control={<Checkbox checked={editEmergency?.hasEnded || false} onChange={handleCheckboxChange} name="hasEnded" />}
            label="Has Ended"
          />
          <FormControl fullWidth sx={{ my: 1 }}>
            <InputLabel>Type</InputLabel>
            <Select
              name="emergencyTypeId"
              value={editEmergency?.emergencyTypeId || ''}
              onChange={handleEditChange}
            >
              {emergencyTypes.map(type => (
                <MenuItem key={type.id} value={type.id}>
                  {type.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenEditDialog(false)} color="secondary">
            Cancel
          </Button>
          <Button onClick={handleUpdateEmergency} color="primary">
            Update Emergency
          </Button>
        </DialogActions>
      </Dialog>
    </TableContainer>
  );
};

export default EmergencyManagementComponent;
