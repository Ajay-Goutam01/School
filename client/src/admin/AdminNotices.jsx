import React, { useState, useEffect } from 'react';
import api from '../services/api';
import { Bell, Plus, Trash2, ArrowUp, ArrowDown } from 'lucide-react';

const AdminNotices = () => {
  const [notices, setNotices] = useState([]);
  const [form, setForm] = useState({ title: '', description: '', isImportant: false, isVisible: true });

  const fetchNotices = async () => {
    try {
      const res = await api.get('/notices/all');
      if (res.data && res.data.success) setNotices(res.data.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => { fetchNotices(); }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post('/notices', form);
      setForm({ title: '', description: '', isImportant: false, isVisible: true });
      fetchNotices();
    } catch (err) {
      alert('Failed to publish notice');
    }
  };

  const handleToggleVisibility = async (n) => {
    try {
      await api.put(`/notices/${n._id}`, { isVisible: !n.isVisible });
      fetchNotices();
    } catch (err) { alert('Failed to toggle visibility'); }
  };

  const handleMoveOrder = async (index, direction) => {
    const list = [...notices];
    const targetIdx = index + direction;
    if (targetIdx < 0 || targetIdx >= list.length) return;
    
    const current = list[index];
    const target = list[targetIdx];

    try {
      await Promise.all([
        api.put(`/notices/${current._id}`, { order: targetIdx }),
        api.put(`/notices/${target._id}`, { order: index })
      ]);
      fetchNotices();
    } catch (err) { alert('Failed to reorder'); }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete notice?')) return;
    try {
      await api.delete(`/notices/${id}`);
      fetchNotices();
    } catch (err) {
      alert('Failed to delete notice');
    }
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold font-serif text-slate-900">Notice Board Management</h1>
        <p className="text-xs text-slate-500">Post urgent notifications and official school circulars.</p>
      </div>

      <form onSubmit={handleSubmit} className="bg-white p-6 rounded-2xl shadow-subtle border border-slate-200 space-y-4 max-w-2xl">
        <h3 className="text-base font-bold font-serif text-slate-900">Post New Notice</h3>
        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1">Title *</label>
          <input
            type="text"
            value={form.title}
            onChange={(e) => setForm(prev => ({ ...prev, title: e.target.value }))}
            className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg outline-none focus:ring-2 focus:ring-navy-900"
            required
          />
        </div>
        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1">Notice Details *</label>
          <textarea
            rows={3}
            value={form.description}
            onChange={(e) => setForm(prev => ({ ...prev, description: e.target.value }))}
            className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg outline-none focus:ring-2 focus:ring-navy-900 resize-none"
            required
          />
        </div>
        <div className="flex items-center gap-2">
          <input
            type="checkbox"
            id="imp"
            checked={form.isImportant}
            onChange={(e) => setForm(prev => ({ ...prev, isImportant: e.target.checked }))}
          />
          <label htmlFor="imp" className="text-xs font-semibold text-rose-700">Mark as Urgent / Priority Notice</label>
        </div>
        <button type="submit" className="px-6 py-2.5 bg-gold-600 hover:bg-gold-700 text-white font-semibold text-xs rounded-xl shadow-gold flex items-center gap-2">
          <Plus className="w-4 h-4" /> Post Notice
        </button>
      </form>

      <div className="bg-white rounded-2xl shadow-subtle border border-slate-200 divide-y divide-slate-100">
        {notices.map((n, idx) => (
          <div key={n._id} className="p-4 flex items-center justify-between gap-4">
            <div>
              {n.isImportant && <span className="text-[10px] font-bold text-rose-600 bg-rose-50 px-2 py-0.5 rounded">URGENT</span>}
              <h4 className="text-sm font-bold font-serif text-slate-900">{n.title}</h4>
              <p className="text-xs text-slate-500 line-clamp-1">{n.description}</p>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              <button
                type="button"
                onClick={() => handleToggleVisibility(n)}
                className={`px-3 py-1 rounded text-xs font-semibold ${n.isVisible ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'}`}
              >
                {n.isVisible ? 'Visible' : 'Hidden'}
              </button>
              <button type="button" onClick={() => handleMoveOrder(idx, -1)} className="p-1 text-slate-500 hover:text-navy-900"><ArrowUp className="w-4 h-4" /></button>
              <button type="button" onClick={() => handleMoveOrder(idx, 1)} className="p-1 text-slate-500 hover:text-navy-900"><ArrowDown className="w-4 h-4" /></button>
              <button type="button" onClick={() => handleDelete(n._id)} className="text-rose-600 p-1"><Trash2 className="w-4 h-4" /></button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AdminNotices;
