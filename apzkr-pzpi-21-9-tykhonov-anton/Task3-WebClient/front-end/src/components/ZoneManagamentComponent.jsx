import React, { useState, useEffect } from 'react';
import { fetchZones, createZone, updateZone, deleteZone } from '../api/zoneRequests';
import { fetchEmergencyTypes } from '../api/emergencyTypeRequests';
import {
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper,
  Button, TextField, Dialog, DialogContentText, DialogTitle, ButtonGroup,
  MenuItem, Select, InputLabel, FormControl, DialogContent, DialogActions
} from '@mui/material';
import { useAuth } from '../contexts/authContext';
import { useTranslation } from 'react-i18next';

const ZoneManagementComponent = () => {
  const [zones, setZones] = useState([]);
  const [emergencyTypes, setEmergencyTypes] = useState([]);
  const [newZone, setNewZone] = useState({ startedAt: '', endedAt: '', emergencyTypeId: '', name: '', latitude: '', longitude: '', radius: '' });
  const [editZone, setEditZone] = useState(null);
  const [openEditDialog, setOpenEditDialog] = useState(false);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [zoneToDelete, setZoneToDelete] = useState(null);
  const { user } = useAuth();
  const { t } = useTranslation();

  useEffect(() => {
    const loadZones = async () => {
      try {
        const data = await fetchZones();
        setZones(data);
      } catch (error) {
        console.error('Error fetching zones:', error);
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

    loadZones();
    loadEmergencyTypes();
  }, []);

  const handleCreateZone = async () => {
    if (!newZone.startedAt || !newZone.emergencyTypeId || !newZone.name) return;
    try {
      const createdZone = await createZone(newZone);
      setZones([...zones, createdZone]);
      setNewZone({ startedAt: '', endedAt: '', emergencyTypeId: '', name: '', latitude: '', longitude: '', radius: '' });
    } catch (error) {
      console.error('Error creating zone:', error);
    }
  };

  const handleUpdateZone = async () => {
    if (!editZone || !editZone.startedAt || !editZone.emergencyTypeId || !editZone.name) return;
    try {
      const updated = await updateZone(editZone.id, editZone);
      setZones(zones.map(zone => (zone.id === editZone.id ? updated : zone)));
      setEditZone(null);
      setOpenEditDialog(false);
    } catch (error) {
      console.error('Error updating zone:', error);
    }
  };

  const handleDeleteZone = async () => {
    if (!zoneToDelete) return;
    try {
      await deleteZone(zoneToDelete.id);
      setZones(zones.filter(zone => zone.id !== zoneToDelete.id));
      setOpenDeleteDialog(false);
    } catch (error) {
      console.error('Error deleting zone:', error);
    }
  };

  const handleEditClick = (zone) => {
    setEditZone(zone);
    setOpenEditDialog(true);
  };

  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditZone({ ...editZone, [name]: value });
  };

  const handleDeleteClick = (zone) => {
    setZoneToDelete(zone);
    setOpenDeleteDialog(true);
  };

  const handleCloseEditDialog = () => {
    setOpenEditDialog(false);
    setEditZone(null);
  };

  const handleCloseDeleteDialog = () => {
    setOpenDeleteDialog(false);
    setZoneToDelete(null);
  };

  return (
    <TableContainer component={Paper} fullWidth>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell align='center'>ID</TableCell>
            <TableCell align='center'>{t('started_at')}</TableCell>
            <TableCell align='center'>{t('ended_at')}</TableCell>
            <TableCell align='center'>{t('type')}</TableCell>
            <TableCell align='center'>{t('name')}</TableCell>
            <TableCell align='center'>{t('latitude')}</TableCell>
            <TableCell align='center'>{t('longitude')}</TableCell>
            <TableCell align='center'>{t('radius')}</TableCell>
            {user.role.toLowerCase() === 'admin' && (<TableCell align='center'>{t('actions')}</TableCell>)}
          </TableRow>
        </TableHead>
        <TableBody>
          {zones.map(zone => (
            <TableRow key={zone.id}>
              <TableCell align='center'>{zone.id}</TableCell>
              <TableCell align='center'>{new Date(zone.startedAt).toLocaleString()}</TableCell>
              <TableCell align='center'>{zone.endedAt ? new Date(zone.endedAt).toLocaleString() : 'N/A'}</TableCell>
              <TableCell align='center'>{emergencyTypes.find(type => type.id === zone.emergencyTypeId)?.name}</TableCell>
              <TableCell align='center'>{zone.name}</TableCell>
              <TableCell align='center'>{zone.latitude}</TableCell>
              <TableCell align='center'>{zone.longitude}</TableCell>
              <TableCell align='center'>{zone.radius}</TableCell>
              {user.role.toLowerCase() === 'admin' && (
                <TableCell align='center'>
                  <ButtonGroup orientation="vertical" variant="contained" aria-label="Basic button group">
                    <Button
                      aria-label="edit"
                      variant="contained"
                      color="secondary"
                      fullWidth
                      onClick={() => handleEditClick(zone)}
                    >
                      {t('edit')}
                    </Button>
                    <Button
                      aria-label="delete"
                      variant="contained"
                      fullWidth
                      color="primary"
                      onClick={() => handleDeleteClick(zone)}
                    >
                      {t('delete')}

                    </Button>
                  </ButtonGroup>
                </TableCell>
              )}
            </TableRow>
          ))}
          <TableRow>
            <TableCell colSpan={2} align='center'>
              <TextField
                label="Started At"
                type="datetime-local"
                name="startedAt"
                value={newZone.startedAt}
                onChange={(e) => setNewZone({ ...newZone, startedAt: e.target.value })}
                fullWidth
              />
            </TableCell>
            <TableCell align='center'>
              <TextField
                label="Ended At"
                type="datetime-local"
                name="endedAt"
                value={newZone.endedAt}
                onChange={(e) => setNewZone({ ...newZone, endedAt: e.target.value })}
                fullWidth
              />
            </TableCell>
            <TableCell align='center'>
              <FormControl fullWidth>
                <InputLabel>Type</InputLabel>
                <Select
                  name="emergencyTypeId"
                  value={newZone.emergencyTypeId}
                  onChange={(e) => setNewZone({ ...newZone, emergencyTypeId: e.target.value })}
                >
                  {emergencyTypes.map(type => (
                    <MenuItem key={type.id} value={type.id}>
                      {type.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </TableCell>
            <TableCell align='center'>
              <TextField
                label="Name"
                name="name"
                value={newZone.name}
                onChange={(e) => setNewZone({ ...newZone, name: e.target.value })}
                fullWidth
              />
            </TableCell>
            <TableCell align='center'>
              <TextField
                label="Latitude"
                name="latitude"
                value={newZone.latitude}
                onChange={(e) => setNewZone({ ...newZone, latitude: e.target.value })}
                fullWidth
              />
            </TableCell>
            <TableCell align='center'>
              <TextField
                label="Longitude"
                name="longitude"
                value={newZone.longitude}
                onChange={(e) => setNewZone({ ...newZone, longitude: e.target.value })}
                fullWidth
              />
            </TableCell>
            <TableCell align='center'>
              <TextField
                label="Radius"
                name="radius"
                value={newZone.radius}
                onChange={(e) => setNewZone({ ...newZone, radius: e.target.value })}
                fullWidth
              />
            </TableCell>
            <TableCell align='center'>
              <Button
                variant="contained"
                color="primary"
                onClick={handleCreateZone}
              >
                {t('create')}
              </Button>
            </TableCell>
          </TableRow>
        </TableBody>
      </Table>

      {/* Edit Zone Dialog */}
      <Dialog open={openEditDialog} onClose={handleCloseEditDialog}>
        <DialogTitle>{t('edit')}</DialogTitle>
        <DialogContent>
          <DialogContentText sx={{ my: 1 }}>
            {t('edit')} {t('details')}
          </DialogContentText>
          <TextField sx={{ my: 1 }}
            label="Started At"
            type="datetime-local"
            name="startedAt"
            value={editZone?.startedAt || ''}
            onChange={handleEditChange}
            fullWidth
          />
          <TextField sx={{ my: 1 }}
            label="Ended At"
            type="datetime-local"
            name="endedAt"
            value={editZone?.endedAt || ''}
            onChange={handleEditChange}
            fullWidth
          />
          <FormControl fullWidth sx={{ my: 1 }}>
            <InputLabel>{t('type')}</InputLabel>
            <Select
              name="emergencyTypeId"
              value={editZone?.emergencyTypeId || ''}
              onChange={handleEditChange}
            >
              {emergencyTypes.map(type => (
                <MenuItem key={type.id} value={type.id}>
                  {type.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <TextField sx={{ my: 1 }}
            label="Name"
            name="name"
            value={editZone?.name || ''}
            onChange={handleEditChange}
            fullWidth
          />
          <TextField sx={{ my: 1 }}
            label="Latitude"
            name="latitude"
            value={editZone?.latitude || ''}
            onChange={handleEditChange}
            fullWidth
          />
          <TextField sx={{ my: 1 }}
            label="Longitude"
            name="longitude"
            value={editZone?.longitude || ''}
            onChange={handleEditChange}
            fullWidth
          />
          <TextField sx={{ my: 1 }}
            label="Radius"
            name="radius"
            value={editZone?.radius || ''}
            onChange={handleEditChange}
            fullWidth
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseEditDialog} color="secondary">
            {t('cancel')}
          </Button>
          <Button onClick={handleUpdateZone} color="primary">
            {t('save')}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Delete Zone Confirmation Dialog */}
      <Dialog open={openDeleteDialog} onClose={handleCloseDeleteDialog}>
        <DialogTitle>{t('delete')}  {t('zone')}</DialogTitle>
        <DialogContent>
          <DialogContentText>
            {t('delete')}  ?        
            </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDeleteDialog} color="secondary">
            {t('cancel')}
          </Button>
          <Button onClick={handleDeleteZone} color="primary">
          {t('delete')}
          </Button>
        </DialogActions>
      </Dialog>
    </TableContainer>
  );
};

export default ZoneManagementComponent;
