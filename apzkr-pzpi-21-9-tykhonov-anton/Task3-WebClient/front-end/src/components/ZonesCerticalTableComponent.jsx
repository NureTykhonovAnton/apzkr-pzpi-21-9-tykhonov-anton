import React, { useState, useEffect } from 'react';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, CircularProgress } from '@mui/material';
import { fetchZones } from '../api/zoneRequests'; 

const ZonesCerticalTableComponent = () => {
  const [zones, setZones] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch zones data
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
            <TableCell>Zone Name</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {zones.length > 0 ? (
            zones.map((zone, id) => (
              <TableRow key={id}>
                <TableCell>{zone.name}</TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell>No data available</TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default ZonesCerticalTableComponent;
