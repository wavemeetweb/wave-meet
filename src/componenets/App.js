import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Signup from './Signup';
import Login from './Login';
import JoinMeeting from './JoinMeeting';
import HostMeeting from './HostMeeting';
import Navbar from './Navbar';

export default function App() {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<Navigate to="/login" />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/login" element={<Login />} />
        <Route path="/join" element={<JoinMeeting />} />
        <Route path="/host" element={<HostMeeting />} />
      </Routes>
    </Router>
  );
}

