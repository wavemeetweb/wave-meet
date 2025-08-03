import React, { useState } from 'react';
import { Box, TextField, Button, Typography, Paper } from '@mui/material';

export default function HostMeeting() {
  const [form, setForm] = useState({topic: '', description: '', password: ''});

  const handleChange = e => setForm({...form, [e.target.name]: e.target.value});
  const handleSubmit = e => {
    e.preventDefault();
    // TODO: Host meeting logic
    alert(`Meeting "${form.topic}" Created (Mock)`);
  };

  return (
    <Box display="flex" justifyContent="center" alignItems="center" minHeight="80vh">
      <Paper sx={{ padding: 4, minWidth: 350 }}>
        <Typography variant="h5" gutterBottom>Host a Meeting</Typography>
        <form onSubmit={handleSubmit}>
          <TextField fullWidth label="Meeting Topic" name="topic" margin="normal" value={form.topic} onChange={handleChange} required />
          <TextField fullWidth label="Description" name="description" margin="normal" value={form.description} onChange={handleChange} />
          <TextField fullWidth label="Meeting Password" name="password" margin="normal" type="password" value={form.password} onChange={handleChange} />
          <Button variant="contained" type="submit" fullWidth sx={{ mt: 2 }}>Create Meeting</Button>
        </form>
      </Paper>
    </Box>
  );
}

