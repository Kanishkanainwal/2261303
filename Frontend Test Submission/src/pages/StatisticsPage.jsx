// pages/StatisticsPage.jsx
import React, { useEffect, useState } from 'react';
import { Container, Typography, Box, Paper } from '@mui/material';

const StatisticsPage = () => {
  const [data, setData] = useState([]);

  useEffect(() => {
    const logs = window.__LOGS__ || [];
    const urlEvents = logs.filter((log) => log.message === 'URL Shortened');
    setData(urlEvents);
  }, []);

  return (
    <Container maxWidth="md">
      <Typography variant="h4" gutterBottom align="center">
        URL Statistics
      </Typography>

      {data.length > 0 ? (
        data.map((log, i) => (
          <Paper key={i} elevation={2} sx={{ p: 2, mb: 2 }}>
            <Typography variant="body1">
              <strong>Short URL:</strong> {window.location.origin}/{log.data.code}<br />
              <strong>Original:</strong> {log.data.longUrl}<br />
              <strong>Expires:</strong> {new Date(log.data.expiry).toLocaleString()}<br />
              <strong>Created:</strong> {new Date(log.timestamp).toLocaleString()}
            </Typography>
          </Paper>
        ))
      ) : (
        <Typography variant="body2" align="center">
          No shortened URLs found.
        </Typography>
      )}
    </Container>
  );
};

export default StatisticsPage;
