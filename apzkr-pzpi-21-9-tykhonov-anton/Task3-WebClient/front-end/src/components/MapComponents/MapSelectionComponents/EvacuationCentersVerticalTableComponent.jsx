import React, { useState, useEffect } from 'react';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, CircularProgress } from '@mui/material';
import { fetchCenters } from '../../../api/centerRequests';
import { useTranslation } from 'react-i18next';
import { calculatePointToPointDistance } from '../../../utils/calculateRoute';
import { useUnit } from '../../../contexts/unitContext';

const EvacuationCentersVerticalTableComponent = ({ userLongitude, userLatitude, onCenterSelect }) => {
  const [centers, setCenters] = useState([]);
  const [displayDistances, setDisplayDistances] = useState([]);
  const [loading, setLoading] = useState(true);
  const { t } = useTranslation();
  const { unit, convertDistance } = useUnit();

  useEffect(() => {
    fetchCenters()
      .then(data => {
        setCenters(data);
        setLoading(false);
      })
      .catch(error => {
        console.error('Error fetching evacuation centers:', error);
        setLoading(false);
      });
  }, []); 

  useEffect(() => {
    if (centers.length > 0) {
      const updatedDistances = centers.map(center => {
        const distance = calculatePointToPointDistance(
          { lat: userLatitude, lon: userLongitude },
          { lat: center.latitude, lon: center.longitude }
        );
        return convertDistance(distance);
      });
  
      setDisplayDistances(updatedDistances);
    }
  }, [unit, userLatitude, userLongitude, centers, convertDistance]);

  const handleCenterClick = (center) => {
    if (onCenterSelect) {
      onCenterSelect(center);
    }
  };

  if (loading) {
    return <CircularProgress />;
  }

  return (
    <TableContainer component={Paper} style={{ maxHeight: 400, overflowY: 'auto' }}>
      <Table stickyHeader>
        <TableHead>
          <TableRow>
            <TableCell>{t('evacuation_centers')}</TableCell>
            <TableCell>{t('distance')} ({unit === 'km' ? 'km' : 'mi'})</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {centers.length > 0 ? (
            centers.map((center, id) => (
              <TableRow key={id} onClick={() => handleCenterClick(center)} style={{ cursor: 'pointer' }}>
                <TableCell>{center.name}</TableCell>
                <TableCell>{displayDistances[id]}</TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={2}>{t('no_data_available')}</TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default EvacuationCentersVerticalTableComponent;
