import React, { useContext, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import api from '../api';
import { AuthContext } from '../context/AuthContext';

export default function Login() {
  const location = useLocation();
  const [accountType, setAccountType] = useState(location.pathname.startsWith('/admin') ? 'ADMIN' : 'USER');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const { setUser } = useContext(AuthContext);
  const navigate = useNavigate();

  const submit = async event => {
    event.preventDefault();
    setLoading(true);
    try {
      const response = await api.post('/api/auth/login', { email, password });
      localStorage.setItem('token', response.data.token);
      const userResponse = await api.get('/api/auth/me');
      if (userResponse.data.role !== accountType) {
        localStorage.removeItem('token');
        throw new Error(`This account is registered as ${userResponse.data.role === 'ADMIN' ? 'an administrator' : 'a user'}`);
      }
      setUser(userResponse.data);
      toast.success(`${accountType === 'ADMIN' ? 'Administrator' : 'User'} login successful`);
      navigate(accountType === 'ADMIN' ? '/admin' : '/dashboard');
    } catch (err) {
      toast.error(err?.response?.data?.message || err.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-layout">
      <div className="auth-card card-subtle">
        <p className="eyebrow">WELCOME BACK</p>
        <h1>Sign in to ComplaintSys</h1>
        <p className="page-subtitle mb-4">Choose your account type to open the right workspace.</p>
        <div className="auth-switch" role="tablist" aria-label="Account type">
          <button type="button" className={accountType === 'USER' ? 'active' : ''} onClick={() => setAccountType('USER')}>User</button>
          <button type="button" className={accountType === 'ADMIN' ? 'active' : ''} onClick={() => setAccountType('ADMIN')}>Administrator</button>
        </div>
        <form onSubmit={submit}>
          <div className="mb-3"><label className="form-label">Email</label><input required type="email" className="form-control" value={email} onChange={event => setEmail(event.target.value)} /></div>
          <div className="mb-3"><label className="form-label">Password</label><input required type="password" className="form-control" value={password} onChange={event => setPassword(event.target.value)} /></div>
          <button className="btn btn-primary w-100" disabled={loading}>{loading ? 'Signing in...' : `Sign in as ${accountType === 'ADMIN' ? 'administrator' : 'user'}`}</button>
        </form>
        <Link to="/register" className="auth-footnote">New here? Create an account</Link>
      </div>
    </div>
  );
}
