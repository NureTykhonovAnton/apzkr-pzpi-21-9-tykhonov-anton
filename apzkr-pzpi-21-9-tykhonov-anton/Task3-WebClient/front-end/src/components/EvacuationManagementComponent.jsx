import React, { useState, useEffect } from 'react';
import {
  fetchEvacuations,
  createEvacuation,
  updateEvacuation,
  deleteEvacuation
} from '../api/evacuationRequests';
import { fetchZones } from '../api/zoneRequests';
import { fetchCenters } from '../api/centerRequests';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  ButtonGroup
} from '@mui/material';
import { useTranslation } from 'react-i18next';

const EvacuationManagementComponent = () => {
  const [evacuations, setEvacuations] = useState([]);
  const [centers, setCenters] = useState([]);
  const [zones, setZones] = useState([]);
  const [newEvacuation, setNewEvacuation] = useState({ zoneStart: '', centerEnd: '', emergencyId: '' });
  const [editEvacuation, setEditEvacuation] = useState(null);
  const [openEditDialog, setOpenEditDialog] = useState(false);
  const { t } = useTranslation();

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

    loadEvacuations();
    loadZones();
    loadCenters();
  }, []);

  const handleCreateEvacuation = async () => {
    if (!newEvacuation.zoneStart || !newEvacuation.centerEnd || !newEvacuation.emergencyId) return;
    try {
      const createdEvacuation = await createEvacuation(newEvacuation);
      setEvacuations([...evacuations, createdEvacuation]);
      setNewEvacuation({ zoneStart: '', centerEnd: '', emergencyId: '' }); // Reset all fields
    } catch (error) {
      console.error('Error creating evacuation:', error);
    }
  };

  const handleUpdateEvacuation = async () => {
    if (!editEvacuation || !editEvacuation.zoneStart || !editEvacuation.centerEnd) return;
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
    setEditEvacuation(prev => ({ ...prev, [name]: value }));
  };

  return (
    <TableContainer component={Paper}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>ID</TableCell>
            <TableCell>{t('zone')}</TableCell>
            <TableCell>{t('center')}</TableCell>
            <TableCell>{t('actions')}</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {evacuations.map(evacuation => (
            <TableRow key={evacuation.id}>
              <TableCell>{evacuation.id}</TableCell>
              <TableCell>{evacuation.startZone?.name || 'N/A'}</TableCell>
              <TableCell>{evacuation.endCenter?.name || 'N/A'}</TableCell>
              <TableCell>
                <ButtonGroup orientation='vertical'>
                  <Button
                    aria-label="edit"
                    variant="contained"
                    color="secondary"
                    onClick={() => handleEditClick(evacuation)}
                  >
                    {t('edit')}
                  </Button>
                  <Button
                    aria-label="delete"
                    variant="contained"
                    color="primary"
                    onClick={() => handleDeleteEvacuation(evacuation.id)}
                    sx={{ ml: 1 }}
                  >
                    {t('delete')}
                  </Button>
                </ButtonGroup>
              </TableCell>
            </TableRow>
          ))}
          <TableRow>
            <TableCell colSpan={2}>
              <FormControl fullWidth>
                <InputLabel>{t('zone')}</InputLabel>
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
                <InputLabel>{t('center')}</InputLabel>
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
              <Button
                variant="contained"
                color="primary"
                onClick={handleCreateEvacuation}
              >
                {t('create')}
              </Button>
            </TableCell>
          </TableRow>
        </TableBody>
      </Table>

      {/* Edit Evacuation Dialog */}
      <Dialog open={openEditDialog} onClose={() => setOpenEditDialog(false)}>
        <DialogTitle>{t('edit')} {t('evacuation')}</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Update the details of the evacuation.
          </DialogContentText>
          <FormControl fullWidth sx={{ mb: 2 }}>
            <InputLabel>{t('zone')}</InputLabel>
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
            <InputLabel>{t('center')}</InputLabel>
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
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenEditDialog(false)} color="secondary">
            {t('cancel')}
          </Button>
          <Button onClick={handleUpdateEvacuation} color="primary">
            {t('update')}
          </Button>
        </DialogActions>
      </Dialog>
    </TableContainer>
  );
}

export default EvacuationManagementComponent;
