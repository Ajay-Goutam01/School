import React, { useState, useEffect } from 'react';
import api from '../services/api';
import { BookOpen, Plus, Trash2, ArrowUp, ArrowDown } from 'lucide-react';

const AdminAcademics = () => {
  const [academics, setAcademics] = useState([]);
  const [form, setForm] = useState({
    category: 'Pre-Primary',
    grades: '',
    description: '',
    methodology: '',
    ageGroup: '',
    isVisible: true
  });

  const fetchAcademics = async () => {
    try {
      const res = await api.get('/academics/all');
      if (res.data && res.data.success) setAcademics(res.data.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => { fetchAcademics(); }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post('/academics', form);
      setForm({ category: 'Pre-Primary', grades: '', description: '', methodology: '', ageGroup: '', isVisible: true });
      fetchAcademics();
    } catch (err) {
      alert('Failed to add academic division');
    }
  };

  const handleToggleVisibility = async (item) => {
    try {
      await api.put(`/academics/${item._id}`, { isVisible: !item.isVisible });
      fetchAcademics();
    } catch (err) { alert('Failed to toggle visibility'); }
  };

  const handleMoveOrder = async (index, direction) => {
    const list = [...academics];
    const targetIdx = index + direction;
    if (targetIdx < 0 || targetIdx >= list.length) return;
    
    const current = list[index];
    const target = list[targetIdx];

    try {
      await Promise.all([
        api.put(`/academics/${current._id}`, { order: targetIdx }),
        api.put(`/academics/${target._id}`, { order: index })
      ]);
      fetchAcademics();
    } catch (err) { alert('Failed to reorder'); }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete academic level?')) return;
    try {
      await api.delete(`/academics/${id}`);
      fetchAcademics();
    } catch (err) {
      alert('Failed to delete item');
    }
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold font-serif text-slate-900">Academic Divisions & Curriculum</h1>
        <p className="text-xs text-slate-500">Manage class categories (Pre-Primary, Primary, Middle, Secondary, Senior Secondary).</p>
      </div>

      <form onSubmit={handleSubmit} className="bg-white p-6 rounded-2xl shadow-subtle border border-slate-200 space-y-4 max-w-2xl">
        <h3 className="text-base font-bold font-serif text-slate-900">Add Academic Level</h3>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Category *</label>
            <select
              value={form.category}
              onChange={(e) => setForm(prev => ({ ...prev, category: e.target.value }))}
              className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg outline-none focus:ring-2 focus:ring-navy-900 bg-white"
            >
              <option value="Pre-Primary">Pre-Primary</option>
              <option value="Primary">Primary</option>
              <option value="Middle">Middle</option>
              <option value="Secondary">Secondary</option>
              <option value="Senior Secondary">Senior Secondary</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Grades Covered *</label>
            <input
              type="text"
              placeholder="e.g. Nursery, LKG, UKG"
              value={form.grades}
              onChange={(e) => setForm(prev => ({ ...prev, grades: e.target.value }))}
              className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg outline-none focus:ring-2 focus:ring-navy-900"
              required
            />
          </div>
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

        <button type="submit" className="px-6 py-2.5 bg-gold-600 hover:bg-gold-700 text-white font-semibold text-xs rounded-xl shadow-gold flex items-center gap-2">
          <Plus className="w-4 h-4" /> Add Division
        </button>
      </form>

      <div className="bg-white rounded-2xl shadow-subtle border border-slate-200 divide-y divide-slate-100">
        {academics.map((item, idx) => (
          <div key={item._id} className="p-4 flex items-center justify-between gap-4">
            <div>
              <span className="text-[10px] font-bold text-gold-600 uppercase">{item.grades}</span>
              <h4 className="text-sm font-bold font-serif text-slate-900">{item.category}</h4>
              <p className="text-xs text-slate-500">{item.description}</p>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              <button
                type="button"
                onClick={() => handleToggleVisibility(item)}
                className={`px-3 py-1 rounded text-xs font-semibold ${item.isVisible ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'}`}
              >
                {item.isVisible ? 'Visible' : 'Hidden'}
              </button>
              <button type="button" onClick={() => handleMoveOrder(idx, -1)} className="p-1 text-slate-500 hover:text-navy-900"><ArrowUp className="w-4 h-4" /></button>
              <button type="button" onClick={() => handleMoveOrder(idx, 1)} className="p-1 text-slate-500 hover:text-navy-900"><ArrowDown className="w-4 h-4" /></button>
              <button type="button" onClick={() => handleDelete(item._id)} className="text-rose-600 p-1"><Trash2 className="w-4 h-4" /></button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AdminAcademics;
