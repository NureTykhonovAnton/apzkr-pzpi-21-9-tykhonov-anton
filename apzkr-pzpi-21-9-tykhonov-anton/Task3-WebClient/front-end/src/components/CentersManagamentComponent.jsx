import React, { useState, useEffect } from 'react';
import { Button, Container, Box, Table, TableBody, TableCell, TableHead, TableRow, Typography, Dialog, DialogActions, DialogContent, DialogTitle, TextField, CircularProgress, Alert } from '@mui/material';
import { fetchCenters, createCenter, updateCenter, deleteCenter } from '../api/centerRequests'; // Убедитесь, что путь верный


const CenterManagementComponent = () => {
  const [centers, setCenters] = useState([]);
  const [newCenter, setNewCenter] = useState({ name: '', longitude: '', latitude: '' });
  const [selectedCenter, setSelectedCenter] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadCenters = async () => {
      setLoading(true);
      try {
        const centersData = await fetchCenters();
        setCenters(centersData);
      } catch (error) {
        setError('Error fetching centers.');
      } finally {
        setLoading(false);
      }
    };

    loadCenters();
  }, []);

  const handleCreateCenter = async () => {
    if (!newCenter.name || !newCenter.longitude || !newCenter.latitude) return; // Ensure all fields are filled
    setLoading(true);
    try {
      const createdCenter = await createCenter(newCenter);
      setCenters([...centers, createdCenter]);
      setNewCenter({ name: '', longitude: '', latitude: '' });
      setModalOpen(false);
    } catch (error) {
      setError('Error creating center.');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateCenter = async () => {
    if (!selectedCenter || !selectedCenter.name || !selectedCenter.longitude || !selectedCenter.latitude) return; // Ensure all fields are filled
    setLoading(true);
    try {
      const updated = await updateCenter(selectedCenter.id, selectedCenter);
      setCenters(centers.map(center => (center.id === selectedCenter.id ? updated : center)));
      setEditModalOpen(false);
    } catch (error) {
      setError('Error updating center.');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteCenter = async (id) => {
    setLoading(true);
    try {
      await deleteCenter(id);
      setCenters(centers.filter(center => center.id !== id));
    } catch (error) {
      setError('Error deleting center.');
    } finally {
      setLoading(false);
    }
  };

  const handleEditClick = (center) => {
    setSelectedCenter(center);
    setEditModalOpen(true);
  };

  const handleChange = (e, setter) => {
    const { name, value } = e.target;
    setter(prev => ({ ...prev, [name]: value }));
  };

  return (
    <>
      <Container maxWidth="md">
        <Box sx={{ mt: 4 }}>
          <Typography variant="h4" align="center" gutterBottom>
            Centers
          </Typography>
          {loading ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
              <CircularProgress />
            </Box>
          ) : (
            <>
              {error && (
                <Alert severity="error" sx={{ mb: 2 }}>
                  {error}
                </Alert>
              )}
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>ID</TableCell>
                    <TableCell>Name</TableCell>
                    <TableCell>Longitude</TableCell>
                    <TableCell>Latitude</TableCell>
                    <TableCell>Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {centers.map(center => (
                    <TableRow key={center.id}>
                      <TableCell>{center.id}</TableCell>
                      <TableCell>{center.name}</TableCell>
                      <TableCell>{center.longitude}</TableCell>
                      <TableCell>{center.latitude}</TableCell>
                      <TableCell>
                        <Button variant="contained" color="secondary" onClick={() => handleDeleteCenter(center.id)} >
                          Delete
                        </Button>
                        <Button variant="contained" color="primary" onClick={() => handleEditClick(center)} sx={{ ml: 1 }}>
                          Edit
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                  <TableRow>
                    <TableCell colSpan={5} sx={{ p: 0 }}>
                      <Button
                        variant="contained"
                        color="primary"
                        onClick={() => setModalOpen(true)}
                        fullWidth
                      >
                        Add Center
                      </Button>
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </>
          )}

          {/* Add Center Modal */}
          <Dialog open={modalOpen} onClose={() => setModalOpen(false)}>
            <DialogTitle>Add New Center</DialogTitle>
            <DialogContent>
              <TextField
                label="Name"
                name="name"
                value={newCenter.name}
                onChange={(e) => handleChange(e, setNewCenter)}
                fullWidth
                sx={{ mb: 2 }}
              />
              <TextField
                label="Longitude"
                name="longitude"
                type="number"
                value={newCenter.longitude}
                onChange={(e) => handleChange(e, setNewCenter)}
                fullWidth
                sx={{ mb: 2 }}
              />
              <TextField
                label="Latitude"
                name="latitude"
                type="number"
                value={newCenter.latitude}
                onChange={(e) => handleChange(e, setNewCenter)}
                fullWidth
                sx={{ mb: 2 }}
              />
            </DialogContent>
            <DialogActions>
              <Button onClick={() => setModalOpen(false)} color="secondary">
                Cancel
              </Button>
              <Button onClick={handleCreateCenter} color="primary">
                Add
              </Button>
            </DialogActions>
          </Dialog>

          {/* Edit Center Modal */}
          <Dialog open={editModalOpen} onClose={() => setEditModalOpen(false)}>
            <DialogTitle>Edit Center</DialogTitle>
            <DialogContent>
              <TextField
                label="Name"
                name="name"
                value={selectedCenter?.name || ''}
                onChange={(e) => handleChange(e, setSelectedCenter)}
                fullWidth
                sx={{ mb: 2 }}
              />
              <TextField
                label="Longitude"
                name="longitude"
                type="number"
                value={selectedCenter?.longitude || ''}
                onChange={(e) => handleChange(e, setSelectedCenter)}
                fullWidth
                sx={{ mb: 2 }}
              />
              <TextField
                label="Latitude"
                name="latitude"
                type="number"
                value={selectedCenter?.latitude || ''}
                onChange={(e) => handleChange(e, setSelectedCenter)}
                fullWidth
                sx={{ mb: 2 }}
              />
            </DialogContent>
            <DialogActions>
              <Button onClick={() => setEditModalOpen(false)} color="secondary">
                Cancel
              </Button>
              <Button onClick={handleUpdateCenter} color="primary">
                Save
              </Button>
            </DialogActions>
          </Dialog>
        </Box>
      </Container>
    </>
  );
};

export default CenterManagementComponent;
