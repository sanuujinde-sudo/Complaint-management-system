import React, { useState } from 'react';
import api from '../api';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

export default function CreateComplaint() {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const submit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await api.post('/api/complaints', { title, description, category });
      toast.success('Complaint submitted');
      navigate('/dashboard');
    } catch (err) {
      console.error(err);
      toast.error('Submit failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="card p-4 card-subtle">
      <h2 className="mb-3">New Complaint</h2>
      <form onSubmit={submit}>
        <div className="mb-3">
          <label className="form-label">Title</label>
          <input required className="form-control" value={title} onChange={e => setTitle(e.target.value)} />
        </div>
        <div className="mb-3">
          <label className="form-label">Description</label>
          <textarea required className="form-control" value={description} onChange={e => setDescription(e.target.value)} />
        </div>
        <div className="mb-3">
          <label className="form-label">Category</label>
          <input className="form-control" value={category} onChange={e => setCategory(e.target.value)} />
        </div>
        <button disabled={loading} className="btn btn-primary">{loading ? 'Submitting...' : 'Submit complaint'}</button>
      </form>
    </div>
  );
}
