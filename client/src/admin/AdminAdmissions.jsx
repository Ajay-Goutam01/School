import React, { useState, useEffect } from 'react';
import api from '../services/api';
import { useSchool } from '../context/SchoolContext';
import { Award, Save, CheckCircle2 } from 'lucide-react';

const AdminAdmissions = () => {
  const { setAdmissionsOpen } = useSchool();
  const [data, setData] = useState({
    sessionYear: '2026–2027',
    isAdmissionsOpen: true,
    eligibilityText: ''
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const fetchAdmission = async () => {
      try {
        setLoading(true);
        const res = await api.get('/admissions');
        if (res.data && res.data.success && res.data.data) {
          setData(res.data.data);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchAdmission();
  }, []);

  const handleToggleStatus = async () => {
    try {
      const res = await api.patch('/admissions/status', {
        isAdmissionsOpen: !data.isAdmissionsOpen
      });
      if (res.data && res.data.success) {
        setData(prev => ({ ...prev, isAdmissionsOpen: res.data.data.isAdmissionsOpen }));
        setAdmissionsOpen(res.data.data.isAdmissionsOpen);
      }
    } catch (err) {
      alert('Failed to toggle admission status');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await api.put('/admissions', data);
      alert('Admission guidelines updated successfully!');
    } catch (err) {
      alert('Failed to update admission details');
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="p-8 text-xs text-slate-500">Loading admissions configuration...</div>;

  return (
    <div className="space-y-8 max-w-4xl">
      <div>
        <h1 className="text-2xl font-bold font-serif text-slate-900">Admissions Desk Settings</h1>
        <p className="text-xs text-slate-500">Manage live admission status indicator and eligibility guidelines.</p>
      </div>

      <div className="bg-navy-950 text-white p-6 rounded-2xl border border-navy-800 flex items-center justify-between">
        <div>
          <span className="text-xs font-semibold text-gold-400 uppercase">Live Website Status Indicator</span>
          <h3 className="text-xl font-bold font-serif">
            Admissions Status: {data.isAdmissionsOpen ? 'OPEN' : 'CLOSED'}
          </h3>
        </div>
        <button
          onClick={handleToggleStatus}
          className={`px-6 py-3 rounded-xl font-semibold text-xs text-white ${
            data.isAdmissionsOpen ? 'bg-rose-600 hover:bg-rose-700' : 'bg-emerald-600 hover:bg-emerald-700'
          }`}
        >
          {data.isAdmissionsOpen ? 'Mark Admissions CLOSED' : 'Mark Admissions OPEN'}
        </button>
      </div>

      <form onSubmit={handleSubmit} className="bg-white p-6 rounded-2xl shadow-subtle border border-slate-200 space-y-4">
        <div>
          <label className="block text-xs font-medium text-slate-700 mb-1">Session Academic Year</label>
          <input
            type="text"
            value={data.sessionYear}
            onChange={(e) => setData(prev => ({ ...prev, sessionYear: e.target.value }))}
            className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg outline-none focus:ring-2 focus:ring-navy-900"
          />
        </div>

        <div>
          <label className="block text-xs font-medium text-slate-700 mb-1">Eligibility Overview Text</label>
          <textarea
            rows={4}
            value={data.eligibilityText}
            onChange={(e) => setData(prev => ({ ...prev, eligibilityText: e.target.value }))}
            className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg outline-none focus:ring-2 focus:ring-navy-900 resize-none"
          />
        </div>

        <button type="submit" disabled={saving} className="px-6 py-2.5 bg-gold-600 hover:bg-gold-700 text-white font-semibold text-xs rounded-xl shadow-gold flex items-center gap-2">
          <Save className="w-4 h-4" /> Save Admission Guidelines
        </button>
      </form>
    </div>
  );
};

export default AdminAdmissions;
