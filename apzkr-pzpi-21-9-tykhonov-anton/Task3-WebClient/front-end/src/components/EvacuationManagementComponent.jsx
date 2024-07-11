import React, { useState, useEffect } from 'react';
import { fetchEvacuations, createEvacuation, updateEvacuation, deleteEvacuation } from '../api/evacuationRequests';
import { fetchZones } from '../api/zoneRequests';
import { fetchCenters } from '../api/centerRequests';
import { fetchEmergencies } from '../api/emergencyRequests';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Button, TextField, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, MenuItem, Select, InputLabel, FormControl } from '@mui/material';

const EvacuationManagementComponent = () => {
  const [evacuations, setEvacuations] = useState([]);
  const [zones, setZones] = useState([]);
  const [centers, setCenters] = useState([]);
  const [emergencies, setEmergencies] = useState([]);
  const [newEvacuation, setNewEvacuation] = useState({ zoneStart: '', centerEnd: '', emergencyId: '' });
  const [editEvacuation, setEditEvacuation] = useState(null);
  const [openEditDialog, setOpenEditDialog] = useState(false);

  useEffect(() => {
    const loadEvacuations = async () => {
      try {
        const data = await fetchEvacuations();
        setEvacuations(data);
      } catch (error) {
        console.error('Error fetching evacuations:', error);
      }
    };

    const loadZones = async () => {
      try {
        const data = await fetchZones();
        setZones(data);
      } catch (error) {
        console.error('Error fetching zones:', error);
      }
    };

    const loadCenters = async () => {
      try {
        const data = await fetchCenters();
        setCenters(data);
      } catch (error) {
        console.error('Error fetching centers:', error);
      }
    };

    const loadEmergencies = async () => {
      try {
        const data = await fetchEmergencies();
        setEmergencies(data);
      } catch (error) {
        console.error('Error fetching emergencies:', error);
      }
    };

    loadEvacuations();
    loadZones();
    loadCenters();
    loadEmergencies();
  }, []);

  const handleCreateEvacuation = async () => {
    if (!newEvacuation.zoneStart || !newEvacuation.centerEnd || !newEvacuation.emergencyId) return;
    try {
      const createdEvacuation = await createEvacuation(newEvacuation);
      setEvacuations([...evacuations, createdEvacuation]);
      setNewEvacuation({ zoneStart: '', centerEnd: '', emergencyId: '' });
    } catch (error) {
      console.error('Error creating evacuation:', error);
    }
  };

  const handleUpdateEvacuation = async () => {
    if (!editEvacuation || !editEvacuation.zoneStart || !editEvacuation.centerEnd || !editEvacuation.emergencyId) return;
    try {
      const updated = await updateEvacuation(editEvacuation.id, editEvacuation);
      setEvacuations(evacuations.map(evacuation => (evacuation.id === editEvacuation.id ? updated : evacuation)));
      setEditEvacuation(null);
      setOpenEditDialog(false);
    } catch (error) {
      console.error('Error updating evacuation:', error);
    }
  };

  const handleDeleteEvacuation = async (id) => {
    try {
      await deleteEvacuation(id);
      setEvacuations(evacuations.filter(evacuation => evacuation.id !== id));
    } catch (error) {
      console.error('Error deleting evacuation:', error);
    }
  };

  const handleEditClick = (evacuation) => {
    setEditEvacuation(evacuation);
    setOpenEditDialog(true);
  };

  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditEvacuation({ ...editEvacuation, [name]: value });
  };

  return (
    <TableContainer component={Paper}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>ID</TableCell>
            <TableCell>Zone Start</TableCell>
            <TableCell>Center End</TableCell>
            <TableCell>Emergency</TableCell>
            <TableCell>Actions</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {evacuations.map(evacuation => (
            <TableRow key={evacuation.id}>
              <TableCell>{evacuation.id}</TableCell>
              <TableCell>{zones.find(zone => zone.id === evacuation.zoneStart)?.name}</TableCell>
              <TableCell>{centers.find(center => center.id === evacuation.centerEnd)?.name}</TableCell>
              <TableCell>{emergencies.find(emergency => emergency.id === evacuation.emergencyId)?.name}</TableCell>
              <TableCell>
                <Button 
                  aria-label="edit" 
                  variant="contained" 
                  color="secondary" 
                  onClick={() => handleEditClick(evacuation)}
                >
                  Edit
                </Button>
                <Button 
                  aria-label="delete" 
                  variant="contained" 
                  color="primary" 
                  onClick={() => handleDeleteEvacuation(evacuation.id)}
                  sx={{ ml: 1 }}
                >
                  Delete
                </Button>
              </TableCell>
            </TableRow>
          ))}
          <TableRow>
            <TableCell colSpan={2}>
              <FormControl fullWidth>
                <InputLabel>Zone Start</InputLabel>
                <Select
                  name="zoneStart"
                  value={newEvacuation.zoneStart}
                  onChange={(e) => setNewEvacuation({ ...newEvacuation, zoneStart: e.target.value })}
                >
                  {zones.map(zone => (
                    <MenuItem key={zone.id} value={zone.id}>
                      {zone.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </TableCell>
            <TableCell>
              <FormControl fullWidth>
                <InputLabel>Center End</InputLabel>
                <Select
                  name="centerEnd"
                  value={newEvacuation.centerEnd}
                  onChange={(e) => setNewEvacuation({ ...newEvacuation, centerEnd: e.target.value })}
                >
                  {centers.map(center => (
                    <MenuItem key={center.id} value={center.id}>
                      {center.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </TableCell>
            <TableCell>
              <FormControl fullWidth>
                <InputLabel>Emergency</InputLabel>
                <Select
                  name="emergencyId"
                  value={newEvacuation.emergencyId}
                  onChange={(e) => setNewEvacuation({ ...newEvacuation, emergencyId: e.target.value })}
                >
                  {emergencies.map(emergency => (
                    <MenuItem key={emergency.id} value={emergency.id}>
                      {emergency.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </TableCell>
            <TableCell>
              <Button 
                variant="contained" 
                color="primary" 
                onClick={handleCreateEvacuation}
              >
                Create Evacuation
              </Button>
            </TableCell>
          </TableRow>
        </TableBody>
      </Table>
  
      {/* Edit Evacuation Dialog */}
      <Dialog open={openEditDialog} onClose={() => setOpenEditDialog(false)}>
        <DialogTitle>Edit Evacuation</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Update the details of the evacuation.
          </DialogContentText>
          <FormControl fullWidth>
            <InputLabel>Zone Start</InputLabel>
            <Select
              name="zoneStart"
              value={editEvacuation?.zoneStart || ''}
              onChange={handleEditChange}
            >
              {zones.map(zone => (
                <MenuItem key={zone.id} value={zone.id}>
                  {zone.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <FormControl fullWidth>
            <InputLabel>Center End</InputLabel>
            <Select
              name="centerEnd"
              value={editEvacuation?.centerEnd || ''}
              onChange={handleEditChange}
            >
              {centers.map(center => (
                <MenuItem key={center.id} value={center.id}>
                  {center.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <FormControl fullWidth>
            <InputLabel>Emergency</InputLabel>
            <Select
              name="emergencyId"
              value={editEvacuation?.emergencyId || ''}
              onChange={handleEditChange}
            >
              {emergencies.map(emergency => (
                <MenuItem key={emergency.id} value={emergency.id}>
                  {emergency.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenEditDialog(false)} color="secondary">
            Cancel
          </Button>
          <Button onClick={handleUpdateEvacuation} color="primary">
            Update Evacuation
          </Button>
        </DialogActions>
      </Dialog>
    </TableContainer>
  );
}
export default EvacuationManagementComponent;
