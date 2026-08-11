import React, { useState, useEffect } from 'react';
import api from '../services/api';
import { useSchool } from '../context/SchoolContext';
import { LayoutDashboard, Eye, EyeOff, Save, CheckCircle2, Sliders } from 'lucide-react';

const AdminWebsiteSettings = () => {
  const { fetchProfile } = useSchool();
  const [homepageSections, setHomepageSections] = useState({
    hero: true,
    highlights: true,
    about: true,
    whyChooseUs: true,
    academics: true,
    courses: true,
    activities: true,
    facilities: true,
    principalMessage: true,
    achievements: true,
    news: true,
    gallery: true,
    admissionCta: true,
    contactPreview: true,
    footer: true
  });

  const [pageVisibility, setPageVisibility] = useState({
    about: true,
    academics: true,
    courses: true,
    activities: true,
    facilities: true,
    faculty: true,
    admissions: true,
    feeStructure: true,
    gallery: true,
    news: true,
    notices: true,
    contact: true
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState('');

  const loadSettings = async () => {
    try {
      setLoading(true);
      const res = await api.get('/school');
      if (res.data && res.data.success && res.data.data) {
        if (res.data.data.homepageSections) setHomepageSections(prev => ({ ...prev, ...res.data.data.homepageSections }));
        if (res.data.data.pageVisibility) setPageVisibility(prev => ({ ...prev, ...res.data.data.pageVisibility }));
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadSettings(); }, []);

  const handleSectionToggle = (key) => {
    setHomepageSections(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const handlePageToggle = (key) => {
    setPageVisibility(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const handleSave = async () => {
    setSaving(true);
    setMsg('');
    try {
      const res = await api.put('/school', { homepageSections, pageVisibility });
      if (res.data && res.data.success) {
        setMsg('Website visibility settings saved successfully!');
        fetchProfile();
      }
    } catch (err) {
      alert('Failed to save settings');
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="p-8 text-xs text-slate-500">Loading website controls...</div>;

  return (
    <div className="space-y-8 max-w-4xl">
      
      <div>
        <h1 className="text-2xl font-bold font-serif text-slate-900">Website & Section Visibility Settings</h1>
        <p className="text-xs text-slate-500">Turn homepage sections and entire public pages ON or OFF instantly.</p>
      </div>

      {msg && (
        <div className="p-4 rounded-xl bg-emerald-50 text-emerald-800 text-xs font-semibold flex items-center gap-2 border border-emerald-200">
          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          <span>{msg}</span>
        </div>
      )}

      {/* Homepage Sections */}
      <div className="bg-white rounded-2xl shadow-subtle border border-slate-200 p-6 space-y-4">
        <h3 className="text-base font-bold font-serif text-slate-900 border-b border-slate-100 pb-3 flex items-center gap-2">
          <LayoutDashboard className="w-5 h-5 text-gold-600" />
          Homepage Section Visibility Controls
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {[
            { key: 'hero', label: 'Hero Banner Section' },
            { key: 'highlights', label: 'School Highlights Stats' },
            { key: 'about', label: 'About Preview Section' },
            { key: 'whyChooseUs', label: 'Why Choose Us Cards' },
            { key: 'academics', label: 'Academics Overview' },
            { key: 'courses', label: 'Courses & Programs' },
            { key: 'activities', label: 'Activities Section' },
            { key: 'facilities', label: 'Facilities Grid' },
            { key: 'principalMessage', label: 'Principal Message' },
            { key: 'achievements', label: 'Achievements Section' },
            { key: 'news', label: 'News & Events Ticker' },
            { key: 'gallery', label: 'Gallery Preview' },
            { key: 'admissionCta', label: 'Admission CTA Banner' },
            { key: 'contactPreview', label: 'Contact Preview Section' },
            { key: 'footer', label: 'Footer Section' },
          ].map((item) => (
            <div key={item.key} className="flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs">
              <span className="font-semibold text-slate-800">{item.label}</span>
              <button
                type="button"
                onClick={() => handleSectionToggle(item.key)}
                className={`px-3 py-1 rounded-lg font-bold text-[11px] transition ${
                  homepageSections[item.key]
                    ? 'bg-emerald-600 text-white'
                    : 'bg-rose-100 text-rose-700'
                }`}
              >
                {homepageSections[item.key] ? 'ON' : 'OFF'}
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Entire Page Access Controls */}
      <div className="bg-white rounded-2xl shadow-subtle border border-slate-200 p-6 space-y-4">
        <h3 className="text-base font-bold font-serif text-slate-900 border-b border-slate-100 pb-3 flex items-center gap-2">
          <Sliders className="w-5 h-5 text-navy-900" />
          Public Page & Navbar Navigation Controls
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {[
            { key: 'about', label: 'About Us Page' },
            { key: 'academics', label: 'Academics Page' },
            { key: 'courses', label: 'Special Courses Page' },
            { key: 'activities', label: 'Activities Page' },
            { key: 'facilities', label: 'Facilities Page' },
            { key: 'faculty', label: 'Faculty & Team Page' },
            { key: 'admissions', label: 'Admissions Page' },
            { key: 'feeStructure', label: 'Fee Structure Page' },
            { key: 'gallery', label: 'Photo Gallery Page' },
            { key: 'news', label: 'News & Events Page' },
            { key: 'notices', label: 'Notice Board Page' },
            { key: 'contact', label: 'Contact Us Page' },
          ].map((item) => (
            <div key={item.key} className="flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs">
              <span className="font-semibold text-slate-800">{item.label}</span>
              <button
                type="button"
                onClick={() => handlePageToggle(item.key)}
                className={`px-3 py-1 rounded-lg font-bold text-[11px] transition ${
                  pageVisibility[item.key]
                    ? 'bg-navy-950 text-gold-400'
                    : 'bg-rose-100 text-rose-700'
                }`}
              >
                {pageVisibility[item.key] ? 'VISIBLE' : 'DISABLED'}
              </button>
            </div>
          ))}
        </div>
      </div>

      <div className="pt-2">
        <button
          type="button"
          onClick={handleSave}
          disabled={saving}
          className="px-8 py-3.5 bg-gold-600 hover:bg-gold-700 text-white font-semibold text-xs rounded-xl shadow-gold flex items-center gap-2"
        >
          <Save className="w-4 h-4" />
          <span>Save Website Visibility Settings</span>
        </button>
      </div>

    </div>
  );
};

export default AdminWebsiteSettings;
