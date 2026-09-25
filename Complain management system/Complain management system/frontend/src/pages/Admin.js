import React, { useEffect, useMemo, useState } from 'react';
import api from '../api';
import { toast } from 'react-toastify';

export default function Admin() {
  const [agents, setAgents] = useState([]);
  const [complaints, setComplaints] = useState([]);
  const [summary, setSummary] = useState({ total: 0, open: 0, inProgress: 0, resolved: 0, closed: 0 });
  const [selectedAgent, setSelectedAgent] = useState('');
  const [filter, setFilter] = useState('ALL');
  const [query, setQuery] = useState('');
  const [updatingId, setUpdatingId] = useState('');

  const loadData = async () => {
    try {
      const [agentsResponse, complaintsResponse, summaryResponse] = await Promise.all([
        api.get('/api/agents'), api.get('/api/complaints'), api.get('/api/complaints/stats/summary')
      ]);
      setAgents(agentsResponse.data);
      setComplaints(complaintsResponse.data);
      setSummary(summaryResponse.data);
    } catch (err) { toast.error(err?.response?.data?.message || 'Could not load admin desk'); }
  };

  useEffect(() => { loadData(); }, []);

  const visibleComplaints = useMemo(() => complaints
    .filter(item => filter === 'ALL' || item.status === filter)
    .filter(item => `${item.title} ${item.description}`.toLowerCase().includes(query.toLowerCase())), [complaints, filter, query]);

  const assign = async complaintId => {
    if (!selectedAgent) { toast.info('Choose an agent first'); return; }
    try { await api.put(`/api/complaints/${complaintId}`, { assignedTo: selectedAgent }); toast.success('Agent assigned'); await loadData(); }
    catch (err) { toast.error(err?.response?.data?.message || 'Assignment failed'); }
  };

  const updateStatus = async (complaintId, status) => {
    setUpdatingId(complaintId);
    try {
      await api.put(`/api/complaints/${complaintId}`, { status });
      toast.success(status === 'RESOLVED' ? 'Complaint marked completed' : `Status changed to ${status.replace('_', ' ').toLowerCase()}`);
      await loadData();
    } catch (err) {
      toast.error(err?.response?.data?.message || 'Status update failed');
    } finally {
      setUpdatingId('');
    }
  };

  const displayStatus = status => status === 'RESOLVED' || status === 'CLOSED' ? 'COMPLETED' : status.replace('_', ' ');

  return (
    <div className="page-shell">
      <section className="page-heading"><div><p className="eyebrow">ADMIN OPERATIONS</p><h1>Control desk</h1><p className="page-subtitle">Route work to the right agent and keep resolution moving.</p></div></section>
      <section className="metric-grid mb-4">
        <div className="metric-card"><span>Total cases</span><strong>{summary.total}</strong><small>Across the platform</small></div>
        <div className="metric-card metric-open"><span>Open</span><strong>{summary.open}</strong><small>Needs assignment</small></div>
        <div className="metric-card metric-progress"><span>In progress</span><strong>{summary.inProgress}</strong><small>With an agent</small></div>
        <div className="metric-card metric-done"><span>Completed</span><strong>{summary.resolved + summary.closed}</strong><small>Resolved or closed</small></div>
      </section>
      <section className="toolbar-card mb-4">
        <div className="search-wrap"><span aria-hidden="true">⌕</span><input value={query} onChange={event => setQuery(event.target.value)} placeholder="Find a complaint..." aria-label="Find a complaint" /></div>
        <select value={selectedAgent} onChange={event => setSelectedAgent(event.target.value)} aria-label="Select agent"><option value="">Choose agent to assign</option>{agents.map(agent => <option key={agent._id} value={agent._id}>{agent.name}</option>)}</select>
        <select value={filter} onChange={event => setFilter(event.target.value)} aria-label="Filter complaints"><option value="ALL">All cases</option><option value="OPEN">Open</option><option value="IN_PROGRESS">In progress</option><option value="RESOLVED">Resolved</option></select>
      </section>
      <div className="row g-3">{visibleComplaints.map(item => <div className="col-md-6" key={item._id}><div className="complaint-card h-100"><div className="d-flex justify-content-between gap-2 mb-3"><span className={`status-badge status-${item.status.toLowerCase()}`}>{displayStatus(item.status)}</span><span className="date-label">{new Date(item.createdAt).toLocaleDateString()}</span></div><h3>{item.title}</h3><p>{item.description?.slice(0, 130)}{item.description?.length > 130 ? '...' : ''}</p><div className="admin-case-meta"><span>Reporter: <strong>{item.createdBy?.name || 'Unknown user'}</strong></span><span>Agent: <strong>{item.assignedTo?.name || 'Unassigned'}</strong></span></div><div className="admin-actions"><button type="button" className="btn btn-sm btn-outline-primary" onClick={() => assign(item._id)}>Assign agent</button><select className="form-select form-select-sm" value={item.status} disabled={updatingId === item._id} onChange={event => updateStatus(item._id, event.target.value)} aria-label={`Update status for ${item.title}`}><option value="OPEN">Open</option><option value="IN_PROGRESS">In progress</option><option value="RESOLVED">Completed</option><option value="CLOSED">Closed</option></select></div></div></div>)}</div>
      {!visibleComplaints.length && <div className="empty-state"><div className="empty-icon">◎</div><h3>No matching cases</h3><p>Try a different search or status filter.</p></div>}
    </div>
  );
}
