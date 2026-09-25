import React, { useContext, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

export default function Header() {
  const { user, logout } = useContext(AuthContext);
  const [open, setOpen] = useState(false);
  const location = useLocation();
  const closeMenu = () => setOpen(false);
  const active = path => location.pathname === path ? 'active' : '';

  return (
    <nav className="navbar navbar-expand-lg navbar-light bg-white shadow-sm mb-4">
      <div className="container-fluid">
        <Link className="navbar-brand fw-bold" to="/" onClick={closeMenu}>Complaint<span className="text-primary">Sys</span></Link>
        <button className="navbar-toggler" type="button" onClick={() => setOpen(value => !value)} aria-label="Toggle navigation" aria-expanded={open}>
          <span className="navbar-toggler-icon" />
        </button>
        <div className={`collapse navbar-collapse ${open ? 'show' : ''}`}>
          <ul className="navbar-nav me-auto mb-2 mb-lg-0">
            <li className="nav-item"><Link className={`nav-link ${active('/')}`} to="/" onClick={closeMenu}>Home</Link></li>
            {user && <li className="nav-item"><Link className={`nav-link ${active('/dashboard')}`} to="/dashboard" onClick={closeMenu}>Dashboard</Link></li>}
            {user?.role === 'ADMIN' && <li className="nav-item"><Link className={`nav-link ${active('/admin')}`} to="/admin" onClick={closeMenu}>Admin desk</Link></li>}
            {user && <li className="nav-item"><Link className={`nav-link ${active('/feedback')}`} to="/feedback" onClick={closeMenu}>Feedback</Link></li>}
          </ul>
          <div className="d-flex align-items-center gap-2">
            {user ? (
              <>
                <span className="me-2 text-muted small">{user.name} <span className="status-badge status-in_progress">{user.role}</span></span>
                <button className="btn btn-outline-secondary btn-sm" onClick={() => { logout(); closeMenu(); }}>Logout</button>
              </>
            ) : (
              <>
                <Link className="btn btn-outline-primary btn-sm" to="/login" onClick={closeMenu}>Sign in</Link>
                <Link className="btn btn-primary btn-sm" to="/register" onClick={closeMenu}>Register</Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
