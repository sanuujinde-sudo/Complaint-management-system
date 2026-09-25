import React, { useContext, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import api from '../api';
import { AuthContext } from '../context/AuthContext';

export default function AdminLogin() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const { setUser } = useContext(AuthContext);
  const navigate = useNavigate();

  const submit = async event => {
    event.preventDefault();
    setLoading(true);
    try {
      const loginResponse = await api.post('/api/auth/login', { email, password });
      localStorage.setItem('token', loginResponse.data.token);
      const userResponse = await api.get('/api/auth/me');
      if (userResponse.data.role !== 'ADMIN') {
        localStorage.removeItem('token');
        throw new Error('This account does not have administrator access');
      }
      setUser(userResponse.data);
      toast.success('Administrator access granted');
      navigate('/admin');
    } catch (err) {
      toast.error(err?.response?.data?.message || err.message || 'Admin login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-layout">
      <div className="auth-card card-subtle">
        <p className="eyebrow">SECURE ACCESS</p>
        <h1>Administrator login</h1>
        <p className="page-subtitle mb-4">Access the complaint resolution control desk.</p>
        <form onSubmit={submit}>
          <div className="mb-3"><label className="form-label">Administrator email</label><input required type="email" className="form-control" value={email} onChange={event => setEmail(event.target.value)} /></div>
          <div className="mb-3"><label className="form-label">Password</label><input required type="password" className="form-control" value={password} onChange={event => setPassword(event.target.value)} /></div>
          <button className="btn btn-primary w-100" disabled={loading}>{loading ? 'Signing in...' : 'Sign in to admin desk'}</button>
        </form>
        <Link to="/admin/register" className="auth-footnote">First-time setup? Register administrator</Link>
        <Link to="/login" className="auth-footnote">Return to user login</Link>
      </div>
    </div>
  );
}
