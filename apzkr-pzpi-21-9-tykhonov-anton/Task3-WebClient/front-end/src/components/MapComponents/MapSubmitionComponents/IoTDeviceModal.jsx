import React, { useState } from 'react';
import { Modal, Box, Typography, TextField, Button } from '@mui/material';
import { useTranslation } from 'react-i18next';

const IoTDeviceModal = ({ open, onClose, iotDeviceLatitude, iotDeviceLongitude, addDevice }) => {
    const [MACADDR, setMACADDR] = useState('');
    const [defaultZoneRaduis, setDefaultZoneRaduis] = useState('');
    const [gasLimit, setGasLimit] = useState('');
    const { t } = useTranslation();
    const handleSubmit = () => {
        // Convert string values to appropriate types before submission
        const deviceData = {
            MACADDR,
            defaultZoneRaduis: parseFloat(defaultZoneRaduis) || 500, // Default to 0 if NaN
            gasLimit: parseFloat(gasLimit) || 500, // Default to 0 if NaN
            latitude: iotDeviceLatitude,
            longitude: iotDeviceLongitude
        };

        // Ensure required fields are filled
        if (!MACADDR || isNaN(deviceData.defaultZoneRaduis) || isNaN(deviceData.gasLimit)) {
            alert("Please fill in all fields correctly.");
            return;
        }

        // Pass the device data to the addDevice function
        addDevice(deviceData);
        onClose();
    };


    return (
        <Modal open={open} onClose={onClose}>
            <Box
                sx={{
                    position: 'absolute',
                    top: '50%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)',
                    bgcolor: 'background.paper',
                    p: 4,
                    borderRadius: 1,
                    boxShadow: 24,
                }}
            >
                <Typography variant="h6" mb={2}>
                   {t('add_iot')}
                </Typography>

                <TextField
                    fullWidth
                    label={t('mac_addr')}
                    value={MACADDR}
                    onChange={(e) => setMACADDR(e.target.value)}
                    margin="dense"
                />

                <TextField
                    fullWidth
                    label={t('defaultZoneRadius')}
                    value={defaultZoneRaduis}
                    onChange={(e) => setDefaultZoneRaduis(e.target.value)}
                    margin="dense"
                    type="number"
                />

                <TextField
                    fullWidth
                    label={t('gas_limit')}
                    value={gasLimit}
                    onChange={(e) => setGasLimit(e.target.value)}
                    margin="dense"
                    type="number"
                />

                <Box mt={4} display="flex" justifyContent="space-between">
                    <Button variant="contained" color="primary" onClick={handleSubmit}>
                        {t('create')}
                    </Button>
                    <Button variant="outlined" onClick={onClose}>
                        {t('cancel')}
                    </Button>
                </Box>
            </Box>
        </Modal>
    );
};

export default IoTDeviceModal;
