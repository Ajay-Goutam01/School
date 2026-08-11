import React, { useState, useEffect } from 'react';
import api from '../services/api';
import ImageUploader from '../components/ImageUploader';
import { GraduationCap, Plus, Trash2, ArrowUp, ArrowDown, Eye, EyeOff } from 'lucide-react';

const AdminFaculty = () => {
  const [faculty, setFaculty] = useState([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({
    name: '',
    role: '',
    subject: '',
    qualification: '',
    experience: '',
    photo: '',
    photoId: '',
    message: '',
    isLeadership: false,
    isVisible: true
  });

  const fetchFaculty = async () => {
    try {
      setLoading(true);
      const res = await api.get('/faculty/all');
      if (res.data && res.data.success) setFaculty(res.data.data);
    } catch (err) { console.error(err); }
    finally { setLoading(false); }
  };

  useEffect(() => { fetchFaculty(); }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post('/faculty', form);
      setForm({ name: '', role: '', subject: '', qualification: '', experience: '', photo: '', photoId: '', message: '', isLeadership: false, isVisible: true });
      fetchFaculty();
    } catch (err) { alert('Failed to add faculty member'); }
  };

  const handleToggleVisibility = async (item) => {
    try {
      await api.put(`/faculty/${item._id}`, { isVisible: !item.isVisible });
      fetchFaculty();
    } catch (err) { alert('Failed to toggle visibility'); }
  };

  const handleMoveOrder = async (index, direction) => {
    const list = [...faculty];
    const targetIdx = index + direction;
    if (targetIdx < 0 || targetIdx >= list.length) return;
    
    const current = list[index];
    const target = list[targetIdx];

    try {
      await Promise.all([
        api.put(`/faculty/${current._id}`, { order: targetIdx }),
        api.put(`/faculty/${target._id}`, { order: index })
      ]);
      fetchFaculty();
    } catch (err) { alert('Failed to reorder'); }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete faculty member?')) return;
    try {
      await api.delete(`/faculty/${id}`);
      fetchFaculty();
    } catch (err) { alert('Failed to delete faculty member'); }
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold font-serif text-slate-900">Faculty & Leadership Management</h1>
        <p className="text-xs text-slate-500">Manage Principal, Vice Principal, Department Heads, and Teachers.</p>
      </div>

      <form onSubmit={handleSubmit} className="bg-white p-6 rounded-2xl shadow-subtle border border-slate-200 space-y-4 max-w-3xl">
        <h3 className="text-base font-bold font-serif text-slate-900">Add Faculty Member</h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Full Name *</label>
            <input
              type="text"
              value={form.name}
              onChange={(e) => setForm(prev => ({ ...prev, name: e.target.value }))}
              className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg outline-none focus:ring-2 focus:ring-navy-900"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Designation / Role *</label>
            <input
              type="text"
              placeholder="e.g. Principal / Senior Physics Teacher"
              value={form.role}
              onChange={(e) => setForm(prev => ({ ...prev, role: e.target.value }))}
              className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg outline-none focus:ring-2 focus:ring-navy-900"
              required
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Subject</label>
            <input
              type="text"
              value={form.subject}
              onChange={(e) => setForm(prev => ({ ...prev, subject: e.target.value }))}
              className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg outline-none focus:ring-2 focus:ring-navy-900"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Qualification *</label>
            <input
              type="text"
              placeholder="M.Sc, B.Ed"
              value={form.qualification}
              onChange={(e) => setForm(prev => ({ ...prev, qualification: e.target.value }))}
              className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg outline-none focus:ring-2 focus:ring-navy-900"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Experience *</label>
            <input
              type="text"
              placeholder="12+ Years"
              value={form.experience}
              onChange={(e) => setForm(prev => ({ ...prev, experience: e.target.value }))}
              className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg outline-none focus:ring-2 focus:ring-navy-900"
              required
            />
          </div>
        </div>

        {/* IMAGE UPLOADER FOR FACULTY PHOTO */}
        <ImageUploader
          label="Faculty Photo (ImageKit Upload)"
          value={form.photo}
          fileId={form.photoId}
          onChange={(url, fileId) => setForm(prev => ({ ...prev, photo: url, photoId: fileId }))}
          onRemove={() => setForm(prev => ({ ...prev, photo: '', photoId: '' }))}
          aspectRatio="aspect-square w-24 h-24"
        />

        <div className="flex items-center gap-2">
          <input
            type="checkbox"
            id="lead"
            checked={form.isLeadership}
            onChange={(e) => setForm(prev => ({ ...prev, isLeadership: e.target.checked }))}
          />
          <label htmlFor="lead" className="text-xs font-semibold text-gold-700">Is Leadership (Principal / Vice Principal)</label>
        </div>

        {form.isLeadership && (
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Leadership Message to Parents</label>
            <textarea
              rows={3}
              value={form.message}
              onChange={(e) => setForm(prev => ({ ...prev, message: e.target.value }))}
              className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg outline-none focus:ring-2 focus:ring-navy-900 resize-none"
            />
          </div>
        )}

        <button type="submit" className="px-6 py-2.5 bg-gold-600 hover:bg-gold-700 text-white font-semibold text-xs rounded-xl shadow-gold flex items-center gap-2">
          <Plus className="w-4 h-4" /> Add Faculty Member
        </button>
      </form>

      <div className="bg-white rounded-2xl shadow-subtle border border-slate-200 divide-y divide-slate-100">
        {faculty.map((f, idx) => (
          <div key={f._id} className="p-4 flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              {f.photo && <img src={f.photo} alt={f.name} className="w-10 h-10 object-cover rounded-full" />}
              <div>
                <span className="text-[10px] font-bold text-gold-600 uppercase">{f.role}</span>
                <h4 className="text-sm font-bold font-serif text-slate-900">{f.name}</h4>
                <p className="text-xs text-slate-500">{f.qualification} • {f.experience}</p>
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

export default AdminFaculty;
