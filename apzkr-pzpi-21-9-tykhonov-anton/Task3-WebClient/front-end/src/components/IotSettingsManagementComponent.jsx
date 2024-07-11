import React, { useState, useEffect } from 'react';
import {
  fetchIotSettings,
  createIotSetting,
  updateIotSetting,
  deleteIotSetting,
} from '../api/iotSettingsRequests';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
  TextField,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  CircularProgress,
  Alert,
} from '@mui/material';

const IotSettingsManagementComponent = () => {
  const [settings, setSettings] = useState([]);
  const [newSetting, setNewSetting] = useState({ name: '', value: '' });
  const [editSetting, setEditSetting] = useState({ id: null, name: '', value: '' });
  const [openAddDialog, setOpenAddDialog] = useState(false);
  const [openEditDialog, setOpenEditDialog] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadSettings = async () => {
      setLoading(true);
      try {
        const settingsData = await fetchIotSettings();
        setSettings(settingsData);
      } catch (error) {
        setError('Error fetching IoT settings.');
      } finally {
        setLoading(false);
      }
    };

    loadSettings();
  }, []);

  const handleCreateSetting = async () => {
    const { name, value } = newSetting;
    if (!name || !value) return; // Ensure all fields are filled
    setLoading(true);
    try {
      const createdSetting = await createIotSetting(newSetting);
      setSettings([...settings, createdSetting]);
      setNewSetting({ name: '', value: '' }); // Clear input fields
      setOpenAddDialog(false);
    } catch (error) {
      setError('Error creating IoT setting.');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateSetting = async () => {
    const { id, name, value } = editSetting;
    if (!id || !name || !value) return; // Ensure all fields are filled
    setLoading(true);
    try {
      const updated = await updateIotSetting(id, { name, value });
      setSettings(settings.map(setting => (setting.id === id ? updated : setting)));
      setEditSetting({ id: null, name: '', value: '' });
      setOpenEditDialog(false);
    } catch (error) {
      setError('Error updating IoT setting.');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteSetting = async (id) => {
    setLoading(true);
    try {
      await deleteIotSetting(id);
      setSettings(settings.filter(setting => setting.id !== id));
    } catch (error) {
      setError('Error deleting IoT setting.');
    } finally {
      setLoading(false);
    }
  };

  const handleOpenAddDialog = () => {
    setOpenAddDialog(true);
  };

  const handleOpenEditDialog = (setting) => {
    setEditSetting(setting);
    setOpenEditDialog(true);
  };

  const handleChange = (e, setter) => {
    const { name, value } = e.target;
    setter(prev => ({ ...prev, [name]: value }));
  };

  return (
    <TableContainer component={Paper}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>ID</TableCell>
            <TableCell>Name</TableCell>
            <TableCell>Value</TableCell>
            <TableCell>Actions</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {loading ? (
            <TableRow>
              <TableCell colSpan={4} align="center">
                <CircularProgress />
              </TableCell>
            </TableRow>
          ) : (
            <>
              {error && (
                <TableRow>
                  <TableCell colSpan={4} align="center">
                    <Alert severity="error">{error}</Alert>
                  </TableCell>
                </TableRow>
              )}
              {settings.map(setting => (
                <TableRow key={setting.id}>
                  <TableCell>{setting.id}</TableCell>
                  <TableCell>{setting.name}</TableCell>
                  <TableCell>{setting.value}</TableCell>
                  <TableCell>
                    <Button
                      aria-label="edit"
                      variant="contained"
                      color="secondary"
                      onClick={() => handleOpenEditDialog(setting)}
                    >
                      Edit
                    </Button>
                    <Button
                      aria-label="delete"
                      variant="contained"
                      color="primary"
                      onClick={() => handleDeleteSetting(setting.id)}
                      sx={{ ml: 1 }}
                    >
                      Delete
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
              <TableRow>
                <TableCell colSpan={4} align="center">
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={handleOpenAddDialog}
                  >
                    Add Setting
                  </Button>
                </TableCell>
              </TableRow>
            </>
          )}
        </TableBody>
      </Table>

      {/* Add Setting Dialog */}
      <Dialog open={openAddDialog} onClose={() => setOpenAddDialog(false)}>
        <DialogTitle>Add Setting</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Enter the details of the new setting.
          </DialogContentText>
          <TextField
            name="name"
            label="Name"
            value={newSetting.name}
            onChange={(e) => handleChange(e, setNewSetting)}
            fullWidth
            sx={{ mb: 1 }}
          />
          <TextField
            name="value"
            label="Value"
            value={newSetting.value}
            onChange={(e) => handleChange(e, setNewSetting)}
            fullWidth
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenAddDialog(false)} color="secondary">
            Cancel
          </Button>
          <Button onClick={handleCreateSetting} color="primary">
            Add Setting
          </Button>
        </DialogActions>
      </Dialog>

      {/* Edit Setting Dialog */}
      <Dialog open={openEditDialog} onClose={() => setOpenEditDialog(false)}>
        <DialogTitle>Edit Setting</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Update the details of the setting.
          </DialogContentText>
          <TextField
            name="name"
            label="Name"
            value={editSetting?.name || ''}
            onChange={(e) => handleChange(e, setEditSetting)}
            fullWidth
            sx={{ mb: 1 }}
          />
          <TextField
            name="value"
            label="Value"
            value={editSetting?.value || ''}
            onChange={(e) => handleChange(e, setEditSetting)}
            fullWidth
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenEditDialog(false)} color="secondary">
            Cancel
          </Button>
          <Button onClick={handleUpdateSetting} color="primary">
            Update Setting
          </Button>
        </DialogActions>
      </Dialog>
    </TableContainer>
  );
};

export default IotSettingsManagementComponent;
