import React, { useState, useEffect } from 'react';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, CircularProgress } from '@mui/material';
import { fetchCenters } from '../api/centerRequests';

const EvacuationCenters = (map) => {
  const [centers, setCenters] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Replace this URL with your server endpoint
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

  if (loading) {
    return <CircularProgress />;
  }

  return (
    <TableContainer component={Paper} style={{ maxHeight: 400, overflowY: 'auto' }}>
      <Table stickyHeader>
        <TableHead>
          <TableRow>
            <TableCell>Evacuation Centers</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {centers.length > 0 ? (
            centers.map((center, id) => (
              <TableRow key={id}>
                <TableCell>{center.name}</TableCell>
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

export default EvacuationCenters;
