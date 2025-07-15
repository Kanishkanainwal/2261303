
import React from 'react';
import { Paper, Typography, Box } from '@mui/material';

const URLStats = ({ log }) => {
  const { code, longUrl, expiry } = log.data;
  const createdAt = new Date(log.timestamp).toLocaleString();
  const expiresAt = new Date(expiry).toLocaleString();

  return (
    <Paper elevation={2} sx={{ p: 2, mb: 2 }}>
      <Typography variant="body1">
        <strong>Short URL:</strong> {window.location.origin}/{code}<br />
        <strong>Original:</strong> {longUrl}<br />
        <strong>Expires:</strong> {expiresAt}<br />
        <strong>Created:</strong> {createdAt}
      </Typography>
    </Paper>
  );
};

export default URLStats;
