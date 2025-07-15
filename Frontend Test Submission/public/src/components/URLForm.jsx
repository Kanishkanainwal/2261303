
import React from 'react';
import { TextField, Grid, Paper } from '@mui/material';

const URLForm = ({ index, formData, handleChange }) => {
  return (
    <Paper elevation={3} sx={{ p: 2, mb: 2 }}>
      <Grid container spacing={2}>
        <Grid item xs={12} md={4}>
          <TextField
            label="Original URL"
            fullWidth
            variant="outlined"
            value={formData.longUrl}
            onChange={(e) => handleChange(index, 'longUrl', e.target.value)}
            required
          />
        </Grid>
        <Grid item xs={12} md={4}>
          <TextField
            label="Validity (minutes)"
            fullWidth
            variant="outlined"
            value={formData.validity}
            onChange={(e) => handleChange(index, 'validity', e.target.value)}
            placeholder="Defaults to 30"
          />
        </Grid>
        <Grid item xs={12} md={4}>
          <TextField
            label="Custom Shortcode"
            fullWidth
            variant="outlined"
            value={formData.shortcode}
            onChange={(e) => handleChange(index, 'shortcode', e.target.value)}
            placeholder="Optional"
          />
        </Grid>
      </Grid>
    </Paper>
  );
};

export default URLForm;
