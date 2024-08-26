import React, { useState, useEffect } from 'react';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, CircularProgress } from '@mui/material';
import { fetchZones } from '../../../api/zoneRequests';
import { checkIfUserIsWithinZone } from '../../../utils/calculateRoute';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../../../contexts/authContext';

const ZonesVerticalTableComponent = ({ userLongitude, userLatitude, onZoneSelect }) => {
  const [zones, setZones] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const { t } = useTranslation();

  const handleZoneClick = (zone) => {
    if (onZoneSelect) {
      onZoneSelect(zone);
    }
  };

  useEffect(() => {
    fetchZones()
      .then(data => {
        setZones(data);
        setLoading(false);
      })
      .catch(error => {
        console.error('Error fetching zones:', error);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return <CircularProgress />;
  }

  return (
    <TableContainer component={Paper} style={{ maxHeight: 400, overflowY: 'auto' }}>
      <Table stickyHeader>
        <TableHead>
          <TableRow>
            <TableCell>{t("name")}</TableCell>
            <TableCell>{t("type")}</TableCell>
            <TableCell>{t("radius")}</TableCell>
            <TableCell>{t("is_in_zone")}</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {zones.length > 0 ? (
            zones.map((zone, id) => {
              return (
                <TableRow key={id} onClick={() => handleZoneClick(zone)} style={{ cursor: 'pointer' }}>
                  <TableCell>{zone.name}</TableCell>
                  <TableCell>{zone.emergencyType.name}</TableCell>
                  <TableCell>{zone.radius}</TableCell>
                  <TableCell>{checkIfUserIsWithinZone(user, zone) ? 'Yes' : 'No'}</TableCell>
                </TableRow>
              );
            })
          ) : (
            <TableRow>
              <TableCell colSpan={4}>{t('no_data_available')}</TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default ZonesVerticalTableComponent;
