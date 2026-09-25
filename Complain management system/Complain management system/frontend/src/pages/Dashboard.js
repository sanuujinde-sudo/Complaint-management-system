import React, { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../api';

const statuses = ['ALL', 'OPEN', 'IN_PROGRESS', 'RESOLVED', 'CLOSED'];

function StatusBadge({ status }) {
  return <span className={`status-badge status-${status.toLowerCase()}`}>{status.replace('_', ' ')}</span>;
}

export default function Dashboard() {
  const [complaints, setComplaints] = useState([]);
  const [query, setQuery] = useState('');
  const [status, setStatus] = useState('ALL');
  const [category, setCategory] = useState('ALL');
  const [sort, setSort] = useState('newest');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchComplaints = async () => {
      try {
        const res = await api.get('/api/complaints');
        setComplaints(res.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchComplaints();
  }, []);

  const categories = useMemo(() => (
    ['ALL', ...new Set(complaints.map(item => item.category).filter(Boolean))]
  ), [complaints]);

  const filteredComplaints = useMemo(() => complaints
    .filter(item => status === 'ALL' || item.status === status)
    .filter(item => category === 'ALL' || item.category === category)
    .filter(item => `${item.title} ${item.description} ${item.category || ''}`.toLowerCase().includes(query.toLowerCase()))
    .sort((a, b) => sort === 'newest'
      ? new Date(b.createdAt) - new Date(a.createdAt)
      : new Date(a.createdAt) - new Date(b.createdAt)), [complaints, status, category, query, sort]);

  const count = value => complaints.filter(item => item.status === value).length;

  return (
    <div className="page-shell">
      <section className="page-heading">
        <div>
          <p className="eyebrow">WORKSPACE</p>
          <h1>Complaint overview</h1>
          <p className="page-subtitle">Follow every issue from first report to final resolution.</p>
        </div>
        <Link to="/complaints/new" className="btn btn-primary btn-lg">+ New complaint</Link>
      </section>

      <section className="metric-grid mb-4">
        <div className="metric-card"><span>Total cases</span><strong>{complaints.length}</strong><small>All submitted complaints</small></div>
        <div className="metric-card metric-open"><span>Open</span><strong>{count('OPEN')}</strong><small>Awaiting action</small></div>
        <div className="metric-card metric-progress"><span>In progress</span><strong>{count('IN_PROGRESS')}</strong><small>Being handled now</small></div>
        <div className="metric-card metric-done"><span>Resolved</span><strong>{count('RESOLVED') + count('CLOSED')}</strong><small>Successfully completed</small></div>
      </section>

      <section className="toolbar-card mb-4">
        <div className="search-wrap">
          <span aria-hidden="true">⌕</span>
          <input value={query} onChange={event => setQuery(event.target.value)} placeholder="Search complaints..." aria-label="Search complaints" />
        </div>
        <select value={status} onChange={event => setStatus(event.target.value)} aria-label="Filter by status">
          {statuses.map(item => <option key={item} value={item}>{item === 'ALL' ? 'All statuses' : item.replace('_', ' ')}</option>)}
        </select>
        <select value={category} onChange={event => setCategory(event.target.value)} aria-label="Filter by category">
          {categories.map(item => <option key={item} value={item}>{item === 'ALL' ? 'All categories' : item}</option>)}
        </select>
        <select value={sort} onChange={event => setSort(event.target.value)} aria-label="Sort complaints">
          <option value="newest">Newest first</option>
          <option value="oldest">Oldest first</option>
        </select>
      </section>

      {loading ? <div className="empty-state"><div className="spinner-border text-primary" role="status" /><p>Loading your complaints...</p></div> : (
        <section className="complaint-grid">
          {filteredComplaints.map(item => (
            <Link to={`/complaints/${item._id}`} key={item._id} className="complaint-card">
              <div className="d-flex justify-content-between gap-2 mb-3">
                <StatusBadge status={item.status} />
                <span className="date-label">{new Date(item.createdAt).toLocaleDateString()}</span>
              </div>
              <h3>{item.title}</h3>
              <p>{item.description?.slice(0, 118)}{item.description?.length > 118 ? '...' : ''}</p>
              <div className="complaint-card-footer">
                <span>{item.category || 'General request'}</span>
                <span>View details <span aria-hidden="true">→</span></span>
              </div>
            </Link>
          ))}
          {!filteredComplaints.length && <div className="empty-state empty-state-wide"><div className="empty-icon">◎</div><h3>No complaints found</h3><p>Try changing your filters or create a new complaint.</p></div>}
        </section>
      )}
    </div>
  );
}
