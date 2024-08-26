import React, { useState, useEffect } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  CircularProgress,
  Typography,
  Button,
  Box,
} from '@mui/material';
import { fetchLogs, backupDB } from '../api/miscRequests'; // Ensure this function is correctly implemented and imported
import { useTranslation } from 'react-i18next';

const LogViewerComponent = () => {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { t } = useTranslation();

  useEffect(() => {
    const fetchLogsData = async () => {
      try {
        const response = await fetchLogs(); // Await the API call
        console.log(response.logs); // Log the entire response to see its structure
        if (response && response.logs) {
          setLogs(response.logs || []); // Safely access the logs, default to an empty array if undefined
        } else {
          setError('Logs data not found');
        }
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };

    fetchLogsData();
  }, []);

  const handleBackupClick = async () => {
    try {
      const result = await backupDB();
      alert("Backup successful"); // Display success message from the server
    } catch (err) {
      alert(t('backup_failed') + ': ' + err.message); // Display error message
    }
  };
  const handleDownloadLogs = () => {
    const logContent = logs.map(log =>
      `IP: ${log.ip}\nDate: ${log.date}\nMethod: ${log.method}\nURL: ${log.url}\nHTTP Version: ${log.httpVersion}\nStatus Code: ${log.statusCode}\nContent Length: ${log.contentLength}\nReferer: ${log.referer}\nUser Agent: ${log.userAgent}\n\n`
    ).join('---------------------------------\n');

    const blob = new Blob([logContent], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);

    const a = document.createElement('a');
    a.href = url;
    a.download = 'logs.txt';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);

    URL.revokeObjectURL(url); // Clean up the URL object
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" height="100vh">
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box p={3} display="flex" justifyContent="center" alignItems="center" height="100vh">
        <Typography color="error" variant="h6">
          {t('error_fetching_logs')}: {error}
        </Typography>
      </Box>
    );
  }

  return (
    <Box p={3}>
      <Typography variant="h4" gutterBottom>
        {t('logViewer')}
      </Typography>
      <TableContainer component={Paper} style={{ maxHeight: 400, overflowY: 'auto' }}>
        <Table stickyHeader>
          <TableHead>
            <TableRow>
              <TableCell>{t('ip')}</TableCell>
              <TableCell>{t('date')}</TableCell>
              <TableCell>{t('method')}</TableCell>
              <TableCell>{t('url')}</TableCell>
              <TableCell>{t('http_version')}</TableCell>
              <TableCell>{t('status_code')}</TableCell>
              <TableCell>{t('content_length')}</TableCell>
              <TableCell>{t('referer')}</TableCell>
              <TableCell>{t('user_agent')}</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {logs.map((log, index) => (
              <TableRow key={index}>
                <TableCell>{log.ip}</TableCell>
                <TableCell>{log.date}</TableCell>
                <TableCell>{log.method}</TableCell>
                <TableCell>{log.url}</TableCell>
                <TableCell>{log.httpVersion}</TableCell>
                <TableCell>{log.statusCode}</TableCell>
                <TableCell>{log.contentLength}</TableCell>
                <TableCell>{log.referer}</TableCell>
                <TableCell>{log.userAgent}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <Box mt={2} display="flex" justifyContent="flex-end" gap={2}>
        <Button variant="contained" color="primary" onClick={handleBackupClick}>
          {t('backup_db')}
        </Button>
        <Button variant="contained" color="secondary" onClick={handleDownloadLogs}>
          {t('download_logs')}
        </Button>
      </Box>
    </Box>
  );
};

export default LogViewerComponent;
