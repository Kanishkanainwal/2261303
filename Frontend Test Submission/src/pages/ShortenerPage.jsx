// pages/ShortenerPage.jsx
import React, { useState } from 'react';
import {
  Button,
  Container,
  Typography,
  Box,
  Paper
} from '@mui/material';
import URLForm from '../components/URLForm';
import { isValidURL, isValidMinutes, isAlphanumeric } from '../utils/validators';
import { logEvent } from '../middleware/logger';

const ShortenerPage = () => {
  // Ensure each form is a separate object
  const [forms, setForms] = useState(
    Array(5).fill(null).map(() => ({
      longUrl: '',
      validity: '',
      shortcode: ''
    }))
  );

  const [results, setResults] = useState([]);

  // FIXED: Only update specific field of specific form
  const handleChange = (index, field, value) => {
    setForms((prevForms) =>
      prevForms.map((form, i) =>
        i === index ? { ...form, [field]: value } : form
      )
    );
  };

  const handleSubmit = () => {
    const validForms = forms.filter((f) => f.longUrl);
    const newResults = [];

    validForms.forEach((form) => {
      const { longUrl, validity, shortcode } = form;

      if (!isValidURL(longUrl)) {
        logEvent('Invalid URL', { longUrl });
        return;
      }

      const validTime = isValidMinutes(validity)
        ? parseInt(validity)
        : 30;

      let code = shortcode?.trim() || Math.random().toString(36).substring(2, 8);
      if (shortcode && !isAlphanumeric(shortcode)) {
        logEvent('Invalid shortcode', { shortcode });
        return;
      }

      const expiry = new Date(Date.now() + validTime * 60000);
      sessionStorage.setItem(code, longUrl);

      logEvent('URL Shortened', { longUrl, code, expiry });
      newResults.push({ code, longUrl, expiry });
    });

    setResults(newResults);
  };

  return (
    <Container maxWidth="md">
      <Typography variant="h4" gutterBottom align="center">
        React URL Shortener
      </Typography>

      {forms.map((form, idx) => (
        <URLForm
          key={idx}
          index={idx}
          formData={form}
          handleChange={handleChange}
        />
      ))}

      <Box display="flex" justifyContent="center" mb={4}>
        <Button
          variant="contained"
          color="primary"
          onClick={handleSubmit}
          size="large"
        >
          Shorten URLs
        </Button>
      </Box>

      {results.length > 0 && (
        <Paper elevation={2} sx={{ p: 2 }}>
          <Typography variant="h6">Shortened URLs</Typography>
          {results.map(({ code, longUrl, expiry }) => (
            <Box key={code} mt={2}>
              <Typography variant="body1">
                <strong>{window.location.origin}/{code}</strong><br />
                Original: {longUrl}<br />
                Expires at: {expiry.toLocaleTimeString()}
              </Typography>
            </Box>
          ))}
        </Paper>
      )}
    </Container>
  );
};

export default ShortenerPage;
