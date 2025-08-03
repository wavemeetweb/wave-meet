import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Signup from './components/Signup';
import Login from './components/Login';
import JoinMeeting from './components/JoinMeeting';
import HostMeeting from './components/HostMeeting';
import Navbar from './components/Navbar';

function App() {
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

export default App;

