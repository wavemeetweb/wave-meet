import React, { useState } from 'react';
import { Box, TextField, Button, Typography, Paper } from '@mui/material';

export default function JoinMeeting() {
  const [form, setForm] = useState({meetingUrl: '', name: '', password: ''});

  const handleChange = e => setForm({...form, [e.target.name]: e.target.value});
  const handleSubmit = e => {
    e.preventDefault();
    // TODO: Join meeting logic
    alert(`Joining meeting as ${form.name} (Mock)`);
  };

  return (
    <Box display="flex" justifyContent="center" alignItems="center" minHeight="80vh">
      <Paper sx={{ padding: 4, minWidth: 350 }}>
        <Typography variant="h5" gutterBottom>Join a Meeting</Typography>
        <form onSubmit={handleSubmit}>
          <TextField fullWidth label="Meeting URL" name="meetingUrl" margin="normal" value={form.meetingUrl} onChange={handleChange} required />
          <TextField fullWidth label="Your Name" name="name" margin="normal" value={form.name} onChange={handleChange} required />
          <TextField fullWidth label="Meeting Password" name="password" margin="normal" type="password" value={form.password} onChange={handleChange} />
          <Button variant="contained" type="submit" fullWidth sx={{ mt: 2 }}>Join</Button>
        </form>
      </Paper>
    </Box>
  );
}

