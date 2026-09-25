import React, { useContext, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import api from '../api';
import { AuthContext } from '../context/AuthContext';

export default function Register() {
  const location = useLocation();
  const [accountType, setAccountType] = useState(location.pathname.startsWith('/admin') ? 'ADMIN' : 'USER');
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const { setUser } = useContext(AuthContext);
  const navigate = useNavigate();

  const update = event => setForm({ ...form, [event.target.name]: event.target.value });

  const submit = async event => {
    event.preventDefault();
    setLoading(true);
    try {
      const endpoint = accountType === 'ADMIN' ? '/api/auth/register-admin' : '/api/auth/register';
      const response = await api.post(endpoint, { name: form.name, email: form.email, password: form.password });
      localStorage.setItem('token', response.data.token);
      const userResponse = await api.get('/api/auth/me');
      setUser(userResponse.data);
      toast.success(`${accountType === 'ADMIN' ? 'Administrator' : 'User'} account created`);
      navigate(accountType === 'ADMIN' ? '/admin' : '/dashboard');
    } catch (err) {
      const responseMessage = typeof err?.response?.data === 'string'
        ? err.response.data
        : err?.response?.data?.message;
      toast.error(responseMessage || (err.request ? 'Backend is not reachable. Start or restart the backend server.' : 'Registration failed'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-layout">
      <div className="auth-card card-subtle">
        <p className="eyebrow">GET STARTED</p>
        <h1>Create your ComplaintSys account</h1>
        <p className="page-subtitle mb-4">Choose the workspace you need to use.</p>
        <div className="auth-switch" role="tablist" aria-label="Account type">
          <button type="button" className={accountType === 'USER' ? 'active' : ''} onClick={() => setAccountType('USER')}>User</button>
          <button type="button" className={accountType === 'ADMIN' ? 'active' : ''} onClick={() => setAccountType('ADMIN')}>Administrator</button>
        </div>
        <form onSubmit={submit}>
          <div className="mb-3"><label className="form-label">Full name</label><input required name="name" className="form-control" value={form.name} onChange={update} /></div>
          <div className="mb-3"><label className="form-label">Email</label><input required type="email" name="email" className="form-control" value={form.email} onChange={update} /></div>
          <div className="mb-3"><label className="form-label">Password</label><input required minLength="6" type="password" name="password" className="form-control" value={form.password} onChange={update} /></div>
          <button className="btn btn-primary w-100" disabled={loading}>{loading ? 'Creating account...' : `Create ${accountType === 'ADMIN' ? 'administrator' : 'user'} account`}</button>
        </form>
        <Link to="/login" className="auth-footnote">Already have an account? Sign in</Link>
      </div>
    </div>
  );
}
