import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Admin from './pages/Admin';
import Feedback from './pages/Feedback';
import CreateComplaint from './pages/CreateComplaint';
import ComplaintDetails from './pages/ComplaintDetails';
import ProtectedRoute from './components/ProtectedRoute';
import Header from './components/Header';

export default function App() {
  return (
    <div className="container mt-4 app-frame">
      <Header />

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/admin/login" element={<Login />} />
        <Route path="/admin/register" element={<Register />} />
        <Route path="/register" element={<Register />} />
        <Route path="/dashboard" element={<ProtectedRoute roles={['USER']}><Dashboard /></ProtectedRoute>} />
        <Route path="/admin" element={<ProtectedRoute roles={['ADMIN']}><Admin /></ProtectedRoute>} />
        <Route path="/feedback" element={<ProtectedRoute roles={['USER']}><Feedback /></ProtectedRoute>} />
        <Route path="/complaints/new" element={<ProtectedRoute roles={['USER']}><CreateComplaint /></ProtectedRoute>} />
        <Route path="/complaints/:id" element={<ProtectedRoute roles={['USER', 'ADMIN']}><ComplaintDetails /></ProtectedRoute>} />
      </Routes>
    </div>
  );
}
