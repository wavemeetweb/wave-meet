import React, { useState } from 'react';
import { Box, TextField, Button, Typography, Paper } from '@mui/material';

export default function Signup() {
  const [form, setForm] = useState({name: '', email: '', password: ''});

  const handleChange = e => setForm({...form, [e.target.name]: e.target.value});
  const handleSubmit = e => {
    e.preventDefault();
    // TODO: Integrate with backend signup logic
    alert('Signup Successful! (Mock)');
  };

  return (
    <Box display="flex" justifyContent="center" alignItems="center" minHeight="80vh">
      <Paper sx={{ padding: 4, minWidth: 350 }}>
        <Typography variant="h5" gutterBottom>Signup</Typography>
        <form onSubmit={handleSubmit}>
          <TextField fullWidth label="Name" name="name" margin="normal" value={form.name} onChange={handleChange} required />
          <TextField fullWidth label="Email" name="email" margin="normal" type="email" value={form.email} onChange={handleChange} required />
          <TextField fullWidth label="Password" name="password" margin="normal" type="password" value={form.password} onChange={handleChange} required />
          <Button variant="contained" type="submit" fullWidth sx={{ mt: 2 }}>Signup</Button>
        </form>
      </Paper>
    </Box>
  );
}

