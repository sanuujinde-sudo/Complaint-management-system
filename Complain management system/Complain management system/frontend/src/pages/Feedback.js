import React, { useEffect, useMemo, useState } from 'react';
import api from '../api';
import { toast } from 'react-toastify';

const completed = complaint => complaint.status === 'RESOLVED' || complaint.status === 'CLOSED';

export default function Feedback() {
  const [complaints, setComplaints] = useState([]);
  const [submittedIds, setSubmittedIds] = useState([]);
  const [selected, setSelected] = useState('');
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);

  const loadFeedbackData = async () => {
    try {
      const [complaintsResponse, feedbackResponse] = await Promise.all([
        api.get('/api/complaints'),
        api.get('/api/feedback')
      ]);
      setComplaints(complaintsResponse.data);
      setSubmittedIds(feedbackResponse.data.map(item => item.complaint?._id || item.complaint));
    } catch (err) {
      toast.error('Could not load feedback options');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadFeedbackData(); }, []);

  const eligible = useMemo(() => complaints.filter(item => completed(item) && !submittedIds.includes(item._id)), [complaints, submittedIds]);

  const submit = async event => {
    event.preventDefault();
    if (!selected) { toast.info('Select a completed complaint'); return; }
    if (!rating) { toast.info('Choose a rating'); return; }
    setSending(true);
    try {
      await api.post('/api/feedback', { complaint: selected, rating, comment });
      toast.success('Thank you for your feedback');
      setSubmittedIds(ids => [...ids, selected]);
      setSelected(''); setRating(0); setComment('');
    } catch (err) {
      toast.error(err?.response?.data?.message || 'Feedback submission failed');
    } finally { setSending(false); }
  };

  return (
    <div className="page-shell">
      <section className="page-heading"><div><p className="eyebrow">YOUR VOICE MATTERS</p><h1>Share feedback</h1><p className="page-subtitle">Tell us how your complaint was handled so we can keep improving.</p></div></section>
      <div className="feedback-layout">
        <section className="card p-4 card-subtle">
          <div className="feedback-section-heading"><div><h2>Rate your experience</h2><p className="small-muted">Feedback is available once a complaint is completed.</p></div><span className="feedback-count">{eligible.length} available</span></div>
          {loading ? <div className="empty-state"><div className="spinner-border text-primary" role="status" /><p>Loading feedback options...</p></div> : eligible.length ? <form onSubmit={submit}>
            <div className="mb-3"><label className="form-label">Completed complaint</label><select required className="form-select" value={selected} onChange={event => setSelected(event.target.value)}><option value="">Choose a complaint</option>{eligible.map(item => <option key={item._id} value={item._id}>{item.title} · {item.status === 'CLOSED' ? 'Closed' : 'Resolved'}</option>)}</select></div>
            <div className="mb-3"><label className="form-label">Your rating</label><div className="star-picker" role="radiogroup" aria-label="Rating from one to five stars">{[1, 2, 3, 4, 5].map(value => <button type="button" key={value} className={value <= rating ? 'star selected' : 'star'} onClick={() => setRating(value)} aria-label={`${value} star${value > 1 ? 's' : ''}`} aria-pressed={value <= rating}>★</button>)}</div></div>
            <div className="mb-3"><label className="form-label">Comment <span className="small-muted">(optional)</span></label><textarea className="form-control" rows="5" value={comment} onChange={event => setComment(event.target.value)} placeholder="What went well? What could be better?" /></div>
            <button className="btn btn-primary" disabled={sending}>{sending ? 'Submitting...' : 'Submit feedback'}</button>
          </form> : <div className="feedback-empty"><div className="empty-icon">✓</div><h3>All caught up</h3><p>You have no completed complaints waiting for feedback.</p></div>}
        </section>
        <aside className="feedback-guide"><p className="eyebrow">HOW IT HELPS</p><h2>Your feedback closes the loop.</h2><p>Ratings help administrators understand service quality and help agents improve future resolutions.</p><div className="guide-line"><span>01</span><div><strong>Choose a completed case</strong><small>Only resolved complaints appear here.</small></div></div><div className="guide-line"><span>02</span><div><strong>Rate the experience</strong><small>Give a quick star rating and optional note.</small></div></div></aside>
      </div>
    </div>
  );
}
