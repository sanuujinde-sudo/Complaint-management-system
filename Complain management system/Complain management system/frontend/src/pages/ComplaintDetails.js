import React, { useEffect, useMemo, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import api from '../api';
import { toast } from 'react-toastify';

const steps = ['OPEN', 'IN_PROGRESS', 'RESOLVED', 'CLOSED'];

export default function ComplaintDetails() {
  const { id } = useParams();
  const [complaint, setComplaint] = useState(null);
  const [loading, setLoading] = useState(true);

  const currentStep = useMemo(() => steps.indexOf(complaint?.status), [complaint]);

  useEffect(() => {
    const fetchComplaint = async () => {
      try {
        const res = await api.get(`/api/complaints/${id}`);
        setComplaint(res.data);
      } catch (err) {
        toast.error(err?.response?.data?.message || 'Could not load complaint');
      } finally {
        setLoading(false);
      }
    };
    fetchComplaint();
  }, [id]);

  if (loading) return <div className="empty-state"><div className="spinner-border text-primary" role="status" /><p>Loading complaint...</p></div>;
  if (!complaint) return <div className="empty-state"><h3>Complaint unavailable</h3><Link to="/dashboard">Return to dashboard</Link></div>;

  return (
    <div className="page-shell">
      <Link to="/dashboard" className="back-link">← Back to dashboard</Link>
      <section className="detail-layout mt-3">
        <article className="detail-card">
          <div className="d-flex justify-content-between align-items-start gap-3">
            <div>
              <p className="eyebrow">COMPLAINT DETAILS</p>
              <h1>{complaint.title}</h1>
              <p className="small-muted">Submitted {new Date(complaint.createdAt).toLocaleString()}</p>
            </div>
            <span className={`status-badge status-${complaint.status.toLowerCase()}`}>{complaint.status.replace('_', ' ')}</span>
          </div>
          <div className="detail-divider" />
          <p className="detail-description">{complaint.description}</p>
          <div className="detail-meta-grid">
            <div><span>Category</span><strong>{complaint.category || 'General request'}</strong></div>
            <div><span>Assigned agent</span><strong>{complaint.assignedTo?.name || 'Waiting for assignment'}</strong></div>
            <div><span>Last updated</span><strong>{new Date(complaint.updatedAt || complaint.createdAt).toLocaleDateString()}</strong></div>
            <div><span>Reference</span><strong>#{complaint._id.slice(-8).toUpperCase()}</strong></div>
          </div>
        </article>

        <aside className="timeline-card">
          <p className="eyebrow">PROGRESS</p>
          <h2>Resolution journey</h2>
          <div className="timeline">
            {steps.map((step, index) => (
              <div className={`timeline-step ${index <= currentStep ? 'is-complete' : ''} ${index === currentStep ? 'is-current' : ''}`} key={step}>
                <span className="timeline-dot">{index < currentStep ? '✓' : index + 1}</span>
                <div><strong>{step.replace('_', ' ')}</strong><small>{index === currentStep ? 'Current stage' : index < currentStep ? 'Completed' : 'Upcoming'}</small></div>
              </div>
            ))}
          </div>
          {(complaint.status === 'RESOLVED' || complaint.status === 'CLOSED') && <Link to="/feedback" className="btn btn-primary w-100 mt-3">Share your feedback</Link>}
        </aside>
      </section>
    </div>
  );
}
