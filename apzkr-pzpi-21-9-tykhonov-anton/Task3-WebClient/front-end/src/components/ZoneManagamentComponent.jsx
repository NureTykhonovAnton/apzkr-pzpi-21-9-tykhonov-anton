import React, { useState, useEffect } from 'react';
import { fetchZones, createZone, updateZone, deleteZone } from '../api/zoneRequests'; // Обновите путь к API
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Button, TextField, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, CircularProgress, Alert } from '@mui/material';
import { createTheme, ThemeProvider } from '@mui/material/styles';

const theme = createTheme();

const ZoneManagementComponent = () => {
  const [zones, setZones] = useState([]);
  const [newZone, setNewZone] = useState({ name: '', longitude: '', latitude: '', radius: '' });
  const [editZone, setEditZone] = useState(null);
  const [openAddDialog, setOpenAddDialog] = useState(false);
  const [openEditDialog, setOpenEditDialog] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadZones = async () => {
      setLoading(true);
      try {
        const zonesData = await fetchZones();
        setZones(zonesData);
      } catch (error) {
        setError('Error fetching zones.');
      } finally {
        setLoading(false);
      }
    };

    loadZones();
  }, []);

  const handleCreateZone = async () => {
    const { name, longitude, latitude, radius } = newZone;
    if (!name || !longitude || !latitude || !radius) return; // Ensure all fields are filled
    setLoading(true);
    try {
      const createdZone = await createZone(newZone);
      setZones([...zones, createdZone]);
      setNewZone({ name: '', longitude: '', latitude: '', radius: '' }); // Clear input fields
      setOpenAddDialog(false);
    } catch (error) {
      setError('Error creating zone.');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateZone = async () => {
    if (!editZone || !editZone.name || !editZone.longitude || !editZone.latitude || !editZone.radius) return; // Ensure all fields are filled
    setLoading(true);
    try {
      const updated = await updateZone(editZone.id, editZone);
      setZones(zones.map(zone => (zone.id === editZone.id ? updated : zone)));
      setEditZone(null);
      setOpenEditDialog(false);
    } catch (error) {
      setError('Error updating zone.');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteZone = async (id) => {
    setLoading(true);
    try {
      await deleteZone(id);
      setZones(zones.filter(zone => zone.id !== id));
    } catch (error) {
      setError('Error deleting zone.');
    } finally {
      setLoading(false);
    }
  };

  const handleOpenAddDialog = () => {
    setOpenAddDialog(true);
  };

  const handleOpenEditDialog = (zone) => {
    setEditZone(zone);
    setOpenEditDialog(true);
  };

  const handleChange = (e, setter) => {
    const { name, value } = e.target;
    setter(prev => ({ ...prev, [name]: value }));
  };

  return (
    <ThemeProvider theme={theme}>
      <TableContainer component={Paper} sx={{ mt: 4 }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>ID</TableCell>
              <TableCell>Name</TableCell>
              <TableCell>Longitude</TableCell>
              <TableCell>Latitude</TableCell>
              <TableCell>Radius</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={6} align="center">
                  <CircularProgress />
                </TableCell>
              </TableRow>
            ) : (
              <>
                {error && (
                  <TableRow>
                    <TableCell colSpan={6} align="center">
                      <Alert severity="error">{error}</Alert>
                    </TableCell>
                  </TableRow>
                )}
                {zones.map(zone => (
                  <TableRow key={zone.id}>
                    <TableCell>{zone.id}</TableCell>
                    <TableCell>{zone.name}</TableCell>
                    <TableCell>{zone.longitude}</TableCell>
                    <TableCell>{zone.latitude}</TableCell>
                    <TableCell>{zone.radius}</TableCell>
                    <TableCell>
                      <Button
                        aria-label="edit"
                        variant="contained"
                        color="secondary"
                        onClick={() => handleOpenEditDialog(zone)}
                      >
                        Edit
                      </Button>
                      <Button
                        aria-label="delete"
                        variant="contained"
                        color="primary"
                        onClick={() => handleDeleteZone(zone.id)}
                        sx={{ ml: 1 }}
                      >
                        Delete
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
                <TableRow>
                  <TableCell colSpan={6} align="center">
                    <Button
                      variant="contained"
                      color="primary"
                      onClick={handleOpenAddDialog}
                    >
                      Add Zone
                    </Button>
                  </TableCell>
                </TableRow>
              </>
            )}
          </TableBody>
        </Table>

        {/* Add Zone Dialog */}
        <Dialog open={openAddDialog} onClose={() => setOpenAddDialog(false)}>
          <DialogTitle>Add Zone</DialogTitle>
          <DialogContent>
            <DialogContentText>
              Enter the details of the new zone.
            </DialogContentText>
            <TextField
              name="name"
              label="Name"
              value={newZone.name}
              onChange={(e) => handleChange(e, setNewZone)}
              fullWidth
              sx={{ mb: 1 }}
            />
            <TextField
              name="longitude"
              label="Longitude"
              type="number"
              value={newZone.longitude}
              onChange={(e) => handleChange(e, setNewZone)}
              fullWidth
              sx={{ mb: 1 }}
            />
            <TextField
              name="latitude"
              label="Latitude"
              type="number"
              value={newZone.latitude}
              onChange={(e) => handleChange(e, setNewZone)}
              fullWidth
              sx={{ mb: 1 }}
            />
            <TextField
              name="radius"
              label="Radius"
              type="number"
              value={newZone.radius}
              onChange={(e) => handleChange(e, setNewZone)}
              fullWidth
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setOpenAddDialog(false)} color="secondary">
              Cancel
            </Button>
            <Button onClick={handleCreateZone} color="primary">
              Add Zone
            </Button>
          </DialogActions>
        </Dialog>

        {/* Edit Zone Dialog */}
        <Dialog open={openEditDialog} onClose={() => setOpenEditDialog(false)}>
          <DialogTitle>Edit Zone</DialogTitle>
          <DialogContent>
            <DialogContentText>
              Update the details of the zone.
            </DialogContentText>
            <TextField
              name="name"
              label="Name"
              value={editZone?.name || ''}
              onChange={(e) => handleChange(e, setEditZone)}
              fullWidth
              sx={{ mb: 1 }}
            />
            <TextField
              name="longitude"
              label="Longitude"
              type="number"
              value={editZone?.longitude || ''}
              onChange={(e) => handleChange(e, setEditZone)}
              fullWidth
              sx={{ mb: 1 }}
            />
            <TextField
              name="latitude"
              label="Latitude"
              type="number"
              value={editZone?.latitude || ''}
              onChange={(e) => handleChange(e, setEditZone)}
              fullWidth
              sx={{ mb: 1 }}
            />
            <TextField
              name="radius"
              label="Radius"
              type="number"
              value={editZone?.radius || ''}
              onChange={(e) => handleChange(e, setEditZone)}
              fullWidth
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setOpenEditDialog(false)} color="secondary">
              Cancel
            </Button>
            <Button onClick={handleUpdateZone} color="primary">
              Update Zone
            </Button>
          </DialogActions>
        </Dialog>
      </TableContainer>
    </ThemeProvider>
  );
};

export default ZoneManagementComponent;
