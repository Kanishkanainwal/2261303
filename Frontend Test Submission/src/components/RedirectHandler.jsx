// src/components/RedirectHandler.jsx
import React, { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { CircularProgress, Box, Typography } from '@mui/material';
import { logEvent } from '../middleware/logger';

const RedirectHandler = () => {
  const { shortcode } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    const longURL = sessionStorage.getItem(shortcode);
    if (longURL) {
      logEvent('Redirect success', { shortcode });
      window.location.href = longURL;
    } else {
      logEvent('Redirect failed', { shortcode });
      navigate('/');
    }
  }, [shortcode, navigate]);

  return (
    <Box display="flex" flexDirection="column" alignItems="center" justifyContent="center" height="100vh">
      <CircularProgress />
      <Typography mt={2}>Redirecting...</Typography>
    </Box>
  );
};

export default RedirectHandler;
