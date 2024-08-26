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
  ButtonGroup,
} from '@mui/material';
import {
  fetchIotDevices,
  deleteIotDevice,
  updateIotDevice,
} from '../api/iotDeviceRequests';
import { useTranslation } from 'react-i18next';

const IoTDeviceManagementComponent = () => {
  const [devices, setDevices] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [currentDevice, setCurrentDevice] = useState(null);
  const { t } = useTranslation();
  useEffect(() => {
    const loadDevices = async () => {
      const devicesData = await fetchIotDevices();
      setDevices(devicesData);
    };
    loadDevices();
  }, []);

  const handleDeleteDevice = async (id) => {
    await deleteIotDevice(id);
    const devicesData = await fetchIotDevices();
    setDevices(devicesData);
  };

  const handleOpenEditModal = (device) => {
    setCurrentDevice(device);
    setEditModalOpen(true);
  };

  const handleEditDevice = async () => {
    await updateIotDevice(currentDevice.id, {
      MACADDR: currentDevice.MACADDR,
      gasLimit: currentDevice.gasLimit,
      defaultZoneRaduis: currentDevice.defaultZoneRaduis,
    });
    const devicesData = await fetchIotDevices();
    setDevices(devicesData);
    setEditModalOpen(false);
    setCurrentDevice(null);
  };

  const handleEditChange = (e) => {
    setCurrentDevice({ ...currentDevice, [e.target.name]: e.target.value });
  };

  return (
    <TableContainer component={Paper}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>{t('mac_addr')}</TableCell>
            <TableCell>{t('gas_limit')}</TableCell>
            <TableCell>{t('zone_radius')}</TableCell>
            <TableCell>{t('actions')}</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {devices.map((device) => (
            <TableRow key={device.id}>
              <TableCell>{device.MACADDR}</TableCell>
              <TableCell>{device.gasLimit}</TableCell>
              <TableCell>{device.defaultZoneRaduis}</TableCell>
              <TableCell>
                <Button
                  fullWidth
                  variant="contained"
                  color="secondary"
                  onClick={() => handleDeleteDevice(device.id)}
                >
                  {t('delete')}
                </Button>
                <Button
                  fullWidth
                  variant="contained"
                  color="primary"
                  onClick={() => handleOpenEditModal(device)}
                  style={{ marginLeft: 8 }}
                >
                  {t('edit')}
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      {/* Edit Device Modal */}
      <Dialog
        open={editModalOpen}
        onClose={() => { setEditModalOpen(false); setCurrentDevice(null); }}
      >
        <DialogTitle>Edit IoT Device</DialogTitle>
        <DialogContent>
          <TextField
            label="MAC Address"
            name="MACADDR"
            value={currentDevice?.MACADDR || ''}
            onChange={handleEditChange}
            fullWidth
            margin="dense"
          />
          <TextField
            label="Gas Limit"
            name="gasLimit"
            value={currentDevice?.gasLimit || ''}
            onChange={handleEditChange}
            fullWidth
            margin="dense"
          />
          <TextField
            label="Default Zone Radius"
            name="defaultZoneRaduis"
            value={currentDevice?.defaultZoneRaduis || ''}
            onChange={handleEditChange}
            fullWidth
            margin="dense"
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => { setEditModalOpen(false); setCurrentDevice(null); }}>
            Cancel
          </Button>
          <Button
            onClick={handleEditDevice}
            color="primary"
          >
            Save
          </Button>
        </DialogActions>
      </Dialog>
    </TableContainer>
  );
};

export default IoTDeviceManagementComponent;
