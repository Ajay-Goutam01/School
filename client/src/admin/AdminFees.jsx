import React, { useState, useEffect } from 'react';
import api from '../services/api';
import { ShieldCheck, Plus, Trash2, ArrowUp, ArrowDown } from 'lucide-react';

const AdminFees = () => {
  const [fees, setFees] = useState([]);
  const [form, setForm] = useState({
    academicYear: '2026–2027',
    classGrade: '',
    admissionFee: '',
    tuitionFee: '',
    annualCharges: '',
    otherCharges: '',
    notes: '',
    isVisible: true
  });

  const fetchFees = async () => {
    try {
      const res = await api.get('/fees/all');
      if (res.data && res.data.success) setFees(res.data.data || []);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => { fetchFees(); }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post('/fees', form);
      setForm({ academicYear: '2026–2027', classGrade: '', admissionFee: '', tuitionFee: '', annualCharges: '', otherCharges: '', notes: '', isVisible: true });
      fetchFees();
    } catch (err) {
      alert('Failed to add fee record');
    }
  };

  const handleToggleVisibility = async (item) => {
    try {
      await api.put(`/fees/${item._id}`, { isVisible: !item.isVisible });
      fetchFees();
    } catch (err) { alert('Failed to toggle visibility'); }
  };

  const handleMoveOrder = async (index, direction) => {
    const list = [...fees];
    const targetIdx = index + direction;
    if (targetIdx < 0 || targetIdx >= list.length) return;
    
    const current = list[index];
    const target = list[targetIdx];

    try {
      await Promise.all([
        api.put(`/fees/${current._id}`, { order: targetIdx }),
        api.put(`/fees/${target._id}`, { order: index })
      ]);
      fetchFees();
    } catch (err) { alert('Failed to reorder'); }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete fee record?')) return;
    try {
      await api.delete(`/fees/${id}`);
      fetchFees();
    } catch (err) {
      alert('Failed to delete fee record');
    }
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold font-serif text-slate-900">Fee Structure Table Management</h1>
        <p className="text-xs text-slate-500">Configure fee amounts per class grade. (Controlled by Website Fee Toggle in Profile Settings).</p>
      </div>

      <form onSubmit={handleSubmit} className="bg-white p-6 rounded-2xl shadow-subtle border border-slate-200 space-y-4 max-w-3xl">
        <h3 className="text-base font-bold font-serif text-slate-900">Add Class Fee Breakdown</h3>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Class Grade *</label>
            <input
              type="text"
              placeholder="e.g. Primary (Classes 1 – 5)"
              value={form.classGrade}
              onChange={(e) => setForm(prev => ({ ...prev, classGrade: e.target.value }))}
              className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg outline-none focus:ring-2 focus:ring-navy-900"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Admission Fee (One-Time) *</label>
            <input
              type="text"
              placeholder="e.g. ₹ 30,000"
              value={form.admissionFee}
              onChange={(e) => setForm(prev => ({ ...prev, admissionFee: e.target.value }))}
              className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg outline-none focus:ring-2 focus:ring-navy-900"
              required
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Tuition Fee *</label>
            <input
              type="text"
              placeholder="e.g. ₹ 5,800 / Month"
              value={form.tuitionFee}
              onChange={(e) => setForm(prev => ({ ...prev, tuitionFee: e.target.value }))}
              className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg outline-none focus:ring-2 focus:ring-navy-900"
              required
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Annual Charges *</label>
            <input
              type="text"
              placeholder="e.g. ₹ 15,000 / Year"
              value={form.annualCharges}
              onChange={(e) => setForm(prev => ({ ...prev, annualCharges: e.target.value }))}
              className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg outline-none focus:ring-2 focus:ring-navy-900"
              required
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Other Charges</label>
            <input
              type="text"
              placeholder="e.g. ₹ 4,000 (Lab)"
              value={form.otherCharges}
              onChange={(e) => setForm(prev => ({ ...prev, otherCharges: e.target.value }))}
              className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg outline-none focus:ring-2 focus:ring-navy-900"
            />
          </div>
        </div>

        <button type="submit" className="px-6 py-2.5 bg-gold-600 hover:bg-gold-700 text-white font-semibold text-xs rounded-xl shadow-gold flex items-center gap-2">
          <Plus className="w-4 h-4" /> Add Fee Grade Record
        </button>
      </form>

      <div className="bg-white rounded-2xl shadow-subtle border border-slate-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-700 font-serif">
              <tr>
                <th className="p-4">Grade Level</th>
                <th className="p-4">Admission Fee</th>
                <th className="p-4">Tuition Fee</th>
                <th className="p-4">Annual Charges</th>
                <th className="p-4">Visibility</th>
                <th className="p-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {fees.map((f, idx) => (
                <tr key={f._id}>
                  <td className="p-4 font-bold text-navy-900">{f.classGrade}</td>
                  <td className="p-4">{f.admissionFee}</td>
                  <td className="p-4 font-semibold text-gold-700">{f.tuitionFee}</td>
                  <td className="p-4">{f.annualCharges}</td>
                  <td className="p-4">
                    <button
                      type="button"
                      onClick={() => handleToggleVisibility(f)}
                      className={`px-2 py-0.5 rounded text-[11px] font-semibold ${f.isVisible ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'}`}
                    >
                      {f.isVisible ? 'Visible' : 'Hidden'}
                    </button>
                  </td>
                  <td className="p-4 text-right space-x-1">
                    <button type="button" onClick={() => handleMoveOrder(idx, -1)} className="p-1 text-slate-500 hover:text-navy-900"><ArrowUp className="w-3.5 h-3.5" /></button>
                    <button type="button" onClick={() => handleMoveOrder(idx, 1)} className="p-1 text-slate-500 hover:text-navy-900"><ArrowDown className="w-3.5 h-3.5" /></button>
                    <button onClick={() => handleDelete(f._id)} className="text-rose-600 p-1"><Trash2 className="w-4 h-4" /></button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
};

export default AdminFees;
