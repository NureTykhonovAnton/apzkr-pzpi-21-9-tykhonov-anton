import React, { useState, useEffect } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
  Select,
  MenuItem,
  CircularProgress,
  Alert,
} from '@mui/material';
import {
  fetchIotDevices,
  createIotDevice,
  updateIotDevice,
  deleteIotDevice,
} from '../api/iotDeviceRequests';
import { fetchIotSettings } from '../api/iotSettingsRequests';

const IoTDeviceManagementComponent = () => {
  const [devices, setDevices] = useState([]);
  const [settings, setSettings] = useState([]);
  const [newDevice, setNewDevice] = useState({ MACADDR: '', longitude: '', latitude: '', settingsId: '' });
  const [editDevice, setEditDevice] = useState({ id: null, MACADDR: '', longitude: '', latitude: '', settingsId: '' });
  const [openAddDialog, setOpenAddDialog] = useState(false);
  const [openEditDialog, setOpenEditDialog] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadDevices = async () => {
      setLoading(true);
      try {
        const devicesData = await fetchIotDevices();
        setDevices(devicesData);
      } catch (error) {
        setError('Error fetching IoT devices.');
      } finally {
        setLoading(false);
      }
    };

    const loadSettings = async () => {
      try {
        const settingsData = await fetchIotSettings();
        setSettings(settingsData);
      } catch (error) {
        setError('Error fetching IoT settings.');
      }
    };

    loadDevices();
    loadSettings();
  }, []);

  const handleCreateDevice = async () => {
    const { MACADDR, longitude, latitude, settingsId } = newDevice;
    if (!MACADDR || !longitude || !latitude || !settingsId) return;
    setLoading(true);
    try {
      const createdDevice = await createIotDevice(newDevice);
      setDevices([...devices, createdDevice]);
      setNewDevice({ MACADDR: '', longitude: '', latitude: '', settingsId: '' });
      setOpenAddDialog(false);
    } catch (error) {
      setError('Error creating IoT device.');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateDevice = async () => {
    const { id, MACADDR, longitude, latitude, settingsId } = editDevice;
    if (!id || !MACADDR || !longitude || !latitude || !settingsId) return; // Ensure all fields are filled
    setLoading(true);
    try {
      const updated = await updateIotDevice(id, { MACADDR, longitude, latitude, settingsId });
      setDevices(devices.map(device => (device.id === id ? updated : device)));
      setEditDevice({ id: null, MACADDR: '', longitude: '', latitude: '', settingsId: '' });
      setOpenEditDialog(false);
    } catch (error) {
      setError('Error updating IoT device.');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteDevice = async (id) => {
    setLoading(true);
    try {
      await deleteIotDevice(id);
      setDevices(devices.filter(device => device.id !== id));
    } catch (error) {
      setError('Error deleting IoT device.');
    } finally {
      setLoading(false);
    }
  };

  const handleOpenAddDialog = () => {
    setOpenAddDialog(true);
  };

  const handleOpenEditDialog = (device) => {
    setEditDevice(device);
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
            <TableCell>MAC Address</TableCell>
            <TableCell>Longitude</TableCell>
            <TableCell>Latitude</TableCell>
            <TableCell>Settings</TableCell>
            <TableCell>Actions</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {loading ? (
            <TableRow>
              <TableCell colSpan={5} align="center">
                <CircularProgress />
              </TableCell>
            </TableRow>
          ) : (
            <>
              {error && (
                <TableRow>
                  <TableCell colSpan={5} align="center">
                    <Alert severity="error">{error}</Alert>
                  </TableCell>
                </TableRow>
              )}
              {devices.map(device => (
                <TableRow key={device.id}>
                  <TableCell>{device.MACADDR}</TableCell>
                  <TableCell>{device.longitude}</TableCell>
                  <TableCell>{device.latitude}</TableCell>
                  <TableCell>{device.settings?.name || 'N/A'}</TableCell>
                  <TableCell>
                    <Button
                      variant="contained"
                      color="secondary"
                      onClick={() => handleOpenEditDialog(device)}
                    >
                      Edit
                    </Button>
                    <Button
                      variant="contained"
                      color="primary"
                      onClick={() => handleDeleteDevice(device.id)}
                      sx={{ ml: 1 }}
                    >
                      Delete
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
              <TableRow>
                <TableCell colSpan={5} align="center">
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={handleOpenAddDialog}
                  >
                    Add Device
                  </Button>
                </TableCell>
              </TableRow>
            </>
          )}
        </TableBody>
      </Table>

      {/* Add Device Dialog */}
      <Dialog open={openAddDialog} onClose={() => setOpenAddDialog(false)}>
        <DialogTitle>Add Device</DialogTitle>
        <DialogContent>
          <TextField
            name="MACADDR"
            label="MAC Address"
            value={newDevice.MACADDR}
            onChange={(e) => handleChange(e, setNewDevice)}
            fullWidth
            sx={{ mb: 1 }}
          />
          <TextField
            name="longitude"
            label="Longitude"
            value={newDevice.longitude}
            onChange={(e) => handleChange(e, setNewDevice)}
            fullWidth
            sx={{ mb: 1 }}
          />
          <TextField
            name="latitude"
            label="Latitude"
            value={newDevice.latitude}
            onChange={(e) => handleChange(e, setNewDevice)}
            fullWidth
            sx={{ mb: 1 }}
          />
          <Select
            name="settingsId"
            value={newDevice.settingsId}
            onChange={(e) => handleChange(e, setNewDevice)}
            fullWidth
          >
            {settings.map(setting => (
              <MenuItem key={setting.id} value={setting.id}>
                {setting.name}
              </MenuItem>
            ))}
          </Select>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenAddDialog(false)} color="secondary">
            Cancel
          </Button>
          <Button onClick={handleCreateDevice} color="primary">
            Add Device
          </Button>
        </DialogActions>
      </Dialog>

      {/* Edit Device Dialog */}
      <Dialog open={openEditDialog} onClose={() => setOpenEditDialog(false)}>
        <DialogTitle>Edit Device</DialogTitle>
        <DialogContent>
          <TextField
            name="MACADDR"
            label="MAC Address"
            value={editDevice?.MACADDR || ''}
            onChange={(e) => handleChange(e, setEditDevice)}
            fullWidth
            sx={{ mb: 1 }}
          />
          <TextField
            name="longitude"
            label="Longitude"
            value={editDevice?.longitude || ''}
            onChange={(e) => handleChange(e, setEditDevice)}
            fullWidth
            sx={{ mb: 1 }}
          />
          <TextField
            name="latitude"
            label="Latitude"
            value={editDevice?.latitude || ''}
            onChange={(e) => handleChange(e, setEditDevice)}
            fullWidth
            sx={{ mb: 1 }}
          />
          <Select
            name="settingsId"
            value={editDevice?.settingsId || ''}
            onChange={(e) => handleChange(e, setEditDevice)}
            fullWidth
          >
            {settings.map(setting => (
              <MenuItem key={setting.id} value={setting.id}>
                {setting.name}
              </MenuItem>
            ))}
          </Select>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenEditDialog(false)} color="secondary">
            Cancel
          </Button>
          <Button onClick={handleUpdateDevice} color="primary">
            Save Changes
          </Button>
        </DialogActions>
      </Dialog>
    </TableContainer>
  );
};

export default IoTDeviceManagementComponent;
