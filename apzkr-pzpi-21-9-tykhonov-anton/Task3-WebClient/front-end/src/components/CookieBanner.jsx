import React, { useState, useEffect } from 'react';
import { Snackbar, Button } from '@mui/material';
import { useCookies } from 'react-cookie';
import { useTranslation } from 'react-i18next';

const CookieBanner = () => {
  const {t} = useTranslation()
  const [open, setOpen] = useState(false);
  const [cookies, setCookie] = useCookies(['user']);

  useEffect(() => {
    if (!cookies.acceptedCookies) {
      setOpen(true);
    }
  }, [cookies]);

  const handleAccept = () => {
    setCookie('acceptedCookies', true, { path: '/' });
    setOpen(false);
  };

  return (
    <Snackbar
      open={open}
      message={t("cookie_banner_message")}
      action={
        <Button color="secondary" size="small" onClick={handleAccept}>
          {t("cookie_banner_confirm")}
        </Button>
      }
      anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
    />
  );
};

export default CookieBanner;
