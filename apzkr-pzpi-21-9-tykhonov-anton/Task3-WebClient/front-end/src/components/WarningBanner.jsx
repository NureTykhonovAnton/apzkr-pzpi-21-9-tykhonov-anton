import React, { useEffect, useState } from 'react';
import { Snackbar, Alert, Button, Stack } from '@mui/material';
import { useTranslation } from 'react-i18next';

const WarningBanner = ({ open, onClose, onYes, onNo, message }) => {
  // State to control the timer for auto-closing
  const [autoHideDuration, setAutoHideDuration] = useState(null);
  const {t} = useTranslation()
  useEffect(() => {
    if (message) {
      setAutoHideDuration(6000); // Auto-hide after 6 seconds
    } else {
      setAutoHideDuration(null);
    }
  }, [message]);

  return (
    <Snackbar
      open={open}
      onClose={onClose}
      autoHideDuration={autoHideDuration}
      anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
    >
      <Alert onClose={onClose} severity="warning" sx={{ width: '100%' }}>
        {message ? (
          <>
            Warning: {message}
            <Stack direction="row" spacing={2} mt={2} justifyContent="flex-end">
              <Button variant="contained" color="secondary" onClick={onClose}>
              {t('cancel')}
              </Button>
            </Stack>
          </>
        ) : (
          <>
            Warning: You have entered a zone! Start evacuation?
            <Stack direction="row" spacing={2} mt={2} justifyContent="flex-end">
              <Button variant="contained" color="error" onClick={onYes}>
                {t('yes')}
              </Button>
              <Button variant="contained" color="secondary" onClick={onClose}>
                {t('no')}
              </Button>
            </Stack>
          </>
        )}
      </Alert>
    </Snackbar>
  );
};

export default WarningBanner;
