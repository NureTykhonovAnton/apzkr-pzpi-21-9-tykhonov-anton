import React, { useState } from 'react';
import { Modal, Box, Typography, TextField, Button } from '@mui/material';
import { useTranslation } from 'react-i18next';

const CenterModal = ({ open, onClose, centerLatitude, centerLongitude, addCenter }) => {
    const [name, setName] = useState('');
    const { t } = useTranslation()
    const handleSubmit = () => {
        const centerData = {
            name,
            longitude: centerLongitude,
            latitude: centerLatitude,
        };

        addCenter(centerData);
        onClose(); // Close modal after submission
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
                    {t('create_center')}
                </Typography>

                <TextField
                    fullWidth
                    label={t('name')}
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    margin="dense"
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

export default CenterModal;
