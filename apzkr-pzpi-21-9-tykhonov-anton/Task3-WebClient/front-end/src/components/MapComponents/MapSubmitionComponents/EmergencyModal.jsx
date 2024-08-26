import React, { useEffect, useState } from 'react';
import { Modal, Box, Typography, TextField, Button, FormControl, InputLabel, Select, MenuItem } from '@mui/material';
import { fetchEmergencyTypes } from '../../../api/emergencyTypeRequests';
import { useTranslation } from 'react-i18next';

const EmergencyModal = ({ open, onClose, zoneLatitude, zoneLongitude, onSubmit, defaultRadius }) => {
    const [type, setType] = useState('');
    const [name, setName] = useState('');
    const [radius, setRadius] = useState(defaultRadius || ''); // Define radius state
    const [emergencyTypes, setEmergencyTypes] = useState([]);
    const {t} = useTranslation()
   
    useEffect(() => {
        const fetchTypes = async () => {
            try {
                const response = await fetchEmergencyTypes();
                setEmergencyTypes(response);
            } catch (error) {
                console.error('Error fetching emergency types:', error);
            }
        };
        fetchTypes();
    }, []);

    const handleSubmit = () => {
        const zoneData = {
            startedAt: new Date(),
            endedAt: null,
            emergencyTypeId: type,
            name: name,
            longitude: zoneLongitude,
            latitude: zoneLatitude,
            radius: radius || defaultRadius,
        };

        onSubmit(zoneData);
        onClose();
    };

    return (
        <Modal open={open} onClose={onClose}>
            <Box sx={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', bgcolor: 'background.paper', p: 4, borderRadius: 1, boxShadow: 24 }}>
                <Typography variant="h6" mb={2}>{t('create_emergency')}</Typography>

                <FormControl fullWidth mb={2}>
                    <TextField
                        label={t('name')}
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                    />
                </FormControl>

                <FormControl fullWidth mb={2}>
                    <InputLabel>{t('emergency_type')}</InputLabel>
                    <Select
                        value={type}
                        onChange={(e) => setType(e.target.value)}
                        label={t('emergency_type')}
                    >
                        {emergencyTypes.map((emergencyType) => (
                            <MenuItem key={emergencyType.id} value={emergencyType.id}>
                                {emergencyType.name}
                            </MenuItem>
                        ))}
                    </Select>
                </FormControl>

                <FormControl fullWidth mb={2}>
                    <TextField
                        label={t('radius')}
                        type="number"
                        value={radius}
                        onChange={(e) => setRadius(e.target.value)}
                    />
                </FormControl>

                <Box mt={4} display="flex" justifyContent="space-between">
                    <Button variant="contained" color="primary" onClick={handleSubmit}>{t('create')}</Button>
                    <Button variant="outlined" onClick={onClose}>{t('cancel')}</Button>
                </Box>
            </Box>
        </Modal>
    );
};

export default EmergencyModal;
