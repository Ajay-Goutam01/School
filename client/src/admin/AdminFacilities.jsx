import React, { useState, useEffect } from 'react';
import api from '../services/api';
import ImageUploader from '../components/ImageUploader';
import { Sparkles, Plus, Trash2, ArrowUp, ArrowDown } from 'lucide-react';

const AdminFacilities = () => {
  const [facilities, setFacilities] = useState([]);
  const [form, setForm] = useState({ title: '', description: '', image: '', imageId: '', isVisible: true });

  const fetchFac = async () => {
    try {
      const res = await api.get('/facilities/all');
      if (res.data && res.data.success) setFacilities(res.data.data);
    } catch (err) { console.error(err); }
  };

  useEffect(() => { fetchFac(); }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post('/facilities', form);
      setForm({ title: '', description: '', image: '', imageId: '', isVisible: true });
      fetchFac();
    } catch (err) { alert('Failed to create facility'); }
  };

  const handleToggleVisibility = async (item) => {
    try {
      await api.put(`/facilities/${item._id}`, { isVisible: !item.isVisible });
      fetchFac();
    } catch (err) { alert('Failed to toggle visibility'); }
  };

  const handleMoveOrder = async (index, direction) => {
    const list = [...facilities];
    const targetIdx = index + direction;
    if (targetIdx < 0 || targetIdx >= list.length) return;
    
    const current = list[index];
    const target = list[targetIdx];

    try {
      await Promise.all([
        api.put(`/facilities/${current._id}`, { order: targetIdx }),
        api.put(`/facilities/${target._id}`, { order: index })
      ]);
      fetchFac();
    } catch (err) { alert('Failed to reorder'); }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete facility record?')) return;
    try {
      await api.delete(`/facilities/${id}`);
      fetchFac();
    } catch (err) { alert('Failed to delete facility'); }
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold font-serif text-slate-900">Facilities & Infrastructure Management</h1>
        <p className="text-xs text-slate-500">Manage smart classrooms, labs, sports arenas, and security systems.</p>
      </div>

      <form onSubmit={handleSubmit} className="bg-white p-6 rounded-2xl shadow-subtle border border-slate-200 space-y-4 max-w-2xl">
        <h3 className="text-base font-bold font-serif text-slate-900">Add Campus Facility</h3>
        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1">Facility Name *</label>
          <input
            type="text"
            value={form.title}
            onChange={(e) => setForm(prev => ({ ...prev, title: e.target.value }))}
            className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg outline-none focus:ring-2 focus:ring-navy-900"
            required
          />
        </div>
        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1">Description *</label>
          <textarea
            rows={3}
            value={form.description}
            onChange={(e) => setForm(prev => ({ ...prev, description: e.target.value }))}
            className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg outline-none focus:ring-2 focus:ring-navy-900 resize-none"
            required
          />
        </div>

        {/* IMAGE UPLOADER */}
        <ImageUploader
          label="Facility Photo (ImageKit Upload)"
          value={form.image}
          fileId={form.imageId}
          onChange={(url, fileId) => setForm(prev => ({ ...prev, image: url, imageId: fileId }))}
          onRemove={() => setForm(prev => ({ ...prev, image: '', imageId: '' }))}
        />

        <button type="submit" className="px-6 py-2.5 bg-gold-600 hover:bg-gold-700 text-white font-semibold text-xs rounded-xl shadow-gold flex items-center gap-2">
          <Plus className="w-4 h-4" /> Add Facility
        </button>
      </form>

      <div className="bg-white rounded-2xl shadow-subtle border border-slate-200 divide-y divide-slate-100">
        {facilities.map((f, idx) => (
          <div key={f._id} className="p-4 flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              {f.image && <img src={f.image} alt={f.title} className="w-12 h-12 object-cover rounded-xl shrink-0" />}
              <div>
                <h4 className="text-sm font-bold font-serif text-slate-900">{f.title}</h4>
                <p className="text-xs text-slate-500 line-clamp-1">{f.description}</p>
              </div>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              <button
                type="button"
                onClick={() => handleToggleVisibility(f)}
                className={`px-3 py-1 rounded text-xs font-semibold ${f.isVisible ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'}`}
              >
                {f.isVisible ? 'Visible' : 'Hidden'}
              </button>
              <button type="button" onClick={() => handleMoveOrder(idx, -1)} className="p-1 text-slate-500 hover:text-navy-900"><ArrowUp className="w-4 h-4" /></button>
              <button type="button" onClick={() => handleMoveOrder(idx, 1)} className="p-1 text-slate-500 hover:text-navy-900"><ArrowDown className="w-4 h-4" /></button>
              <button type="button" onClick={() => handleDelete(f._id)} className="text-rose-600 p-1"><Trash2 className="w-4 h-4" /></button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AdminFacilities;
