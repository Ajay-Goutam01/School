import React, { useState, useEffect } from 'react';
import api from '../services/api';
import ImageUploader from '../components/ImageUploader';
import { Award, Plus, Trash2, ArrowUp, ArrowDown, Eye, EyeOff } from 'lucide-react';

const AdminAchievements = () => {
  const [achievements, setAchievements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({
    title: '',
    description: '',
    category: 'Academic',
    image: '',
    imageId: '',
    isVisible: true
  });

  const fetchAchievements = async () => {
    try {
      setLoading(true);
      const res = await api.get('/achievements/all');
      if (res.data && res.data.success) {
        setAchievements(res.data.data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchAchievements(); }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post('/achievements', form);
      setForm({ title: '', description: '', category: 'Academic', image: '', imageId: '', isVisible: true });
      fetchAchievements();
    } catch (err) {
      alert('Failed to add achievement');
    }
  };

  const handleToggleVisibility = async (item) => {
    try {
      await api.put(`/achievements/${item._id}`, { isVisible: !item.isVisible });
      fetchAchievements();
    } catch (err) {
      alert('Failed to update visibility');
    }
  };

  const handleMoveOrder = async (index, direction) => {
    const list = [...achievements];
    const targetIdx = index + direction;
    if (targetIdx < 0 || targetIdx >= list.length) return;
    
    const current = list[index];
    const target = list[targetIdx];

    try {
      await Promise.all([
        api.put(`/achievements/${current._id}`, { order: targetIdx }),
        api.put(`/achievements/${target._id}`, { order: index })
      ]);
      fetchAchievements();
    } catch (err) {
      alert('Failed to reorder');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this achievement record?')) return;
    try {
      await api.delete(`/achievements/${id}`);
      fetchAchievements();
    } catch (err) {
      alert('Failed to delete item');
    }
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold font-serif text-slate-900">Student & Institutional Achievements</h1>
        <p className="text-xs text-slate-500">Highlight board toppers, sports trophies, robotics awards, and national honors.</p>
      </div>

      <form onSubmit={handleSubmit} className="bg-white p-6 rounded-2xl shadow-subtle border border-slate-200 space-y-4 max-w-3xl">
        <h3 className="text-base font-bold font-serif text-slate-900">Add New Achievement</h3>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Title *</label>
            <input
              type="text"
              placeholder="e.g. CBSE National STEM Championship 1st Rank"
              value={form.title}
              onChange={(e) => setForm(prev => ({ ...prev, title: e.target.value }))}
              className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg outline-none focus:ring-2 focus:ring-navy-900"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Category *</label>
            <select
              value={form.category}
              onChange={(e) => setForm(prev => ({ ...prev, category: e.target.value }))}
              className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg outline-none focus:ring-2 focus:ring-navy-900 bg-white"
            >
              <option value="Academic">Academic Excellence</option>
              <option value="Sports">Sports & Athletics</option>
              <option value="Cultural">Cultural & Performing Arts</option>
              <option value="STEM">STEM & Robotics</option>
            </select>
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1">Description *</label>
          <textarea
            rows={2}
            value={form.description}
            onChange={(e) => setForm(prev => ({ ...prev, description: e.target.value }))}
            className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg outline-none focus:ring-2 focus:ring-navy-900 resize-none"
            required
          />
        </div>

        <ImageUploader
          label="Achievement Photo (ImageKit Upload)"
          value={form.image}
          fileId={form.imageId}
          onChange={(url, fileId) => setForm(prev => ({ ...prev, image: url, imageId: fileId }))}
          onRemove={() => setForm(prev => ({ ...prev, image: '', imageId: '' }))}
        />

        <button type="submit" className="px-6 py-2.5 bg-gold-600 hover:bg-gold-700 text-white font-semibold text-xs rounded-xl shadow-gold flex items-center gap-2">
          <Plus className="w-4 h-4" /> Add Achievement Record
        </button>
      </form>

      <div className="bg-white rounded-2xl shadow-subtle border border-slate-200 divide-y divide-slate-100">
        {achievements.map((item, idx) => (
          <div key={item._id} className="p-4 flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              {item.image && <img src={item.image} alt={item.title} className="w-14 h-14 object-cover rounded-xl shrink-0" />}
              <div>
                <span className="text-[10px] font-bold text-gold-600 uppercase">{item.category}</span>
                <h4 className="text-sm font-bold font-serif text-slate-900">{item.title}</h4>
                <p className="text-xs text-slate-500 line-clamp-1">{item.description}</p>
              </div>
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

export default AdminAchievements;
