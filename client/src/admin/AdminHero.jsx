import React, { useState, useEffect } from 'react';
import api from '../services/api';
import { useSchool } from '../context/SchoolContext';
import ImageUploader from '../components/ImageUploader';
import { Save, CheckCircle2, Eye, EyeOff } from 'lucide-react';

const AdminHero = () => {
  const { fetchProfile, updateProfile } = useSchool();
  const [heroSettings, setHeroSettings] = useState({
    title: "Empowering Minds, Shaping Bright Futures",
    subtitle: "Where Learning Meets Character & Leadership",
    description: "A premier educational institution dedicated to academic excellence, holistic growth, and strong moral values.",
    image: "https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=1600&auto=format&fit=crop&q=80",
    imageId: "",
    primaryBtnText: "Admission Enquiry",
    primaryBtnLink: "/contact",
    secondaryBtnText: "Explore Our School",
    secondaryBtnLink: "/about",
    isVisible: true
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState('');

  useEffect(() => {
    const loadHero = async () => {
      try {
        setLoading(true);
        const res = await api.get('/school');
        if (res.data && res.data.success && res.data.data.heroSettings) {
          setHeroSettings(prev => ({ ...prev, ...res.data.data.heroSettings }));
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    loadHero();
  }, []);

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    setMsg('');
    try {
      const res = await api.put('/school', { heroSettings });
      if (res.data && res.data.success) {
        setMsg('Hero banner settings updated successfully!');
        if (updateProfile) {
          updateProfile(res.data.data || { heroSettings });
        } else {
          fetchProfile();
        }
      }
    } catch (err) {
      alert('Failed to save hero settings');
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="p-8 text-xs text-slate-500">Loading hero settings...</div>;

  return (
    <div className="space-y-8 max-w-4xl">
      <div>
        <h1 className="text-2xl font-bold font-serif text-slate-900">Homepage Hero Banner Management</h1>
        <p className="text-xs text-slate-500">Configure main headline text, call-to-action buttons, and background campus banner.</p>
      </div>

      {msg && (
        <div className="p-4 rounded-xl bg-emerald-50 text-emerald-800 text-xs font-semibold flex items-center gap-2 border border-emerald-200">
          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          <span>{msg}</span>
        </div>
      )}

      <form onSubmit={handleSave} className="bg-white p-6 rounded-2xl shadow-subtle border border-slate-200 space-y-6">
        
        <div className="flex items-center justify-between p-4 bg-slate-50 rounded-xl border border-slate-200">
          <div>
            <h4 className="text-sm font-bold font-serif text-navy-900">Hero Section Visibility</h4>
            <p className="text-xs text-slate-500">Show or hide the top hero banner on homepage.</p>
          </div>
          <button
            type="button"
            onClick={() => setHeroSettings(prev => ({ ...prev, isVisible: !prev.isVisible }))}
            className={`px-4 py-2 rounded-lg font-bold text-xs ${
              heroSettings.isVisible ? 'bg-emerald-600 text-white' : 'bg-rose-600 text-white'
            }`}
          >
            {heroSettings.isVisible ? 'VISIBLE (ON)' : 'HIDDEN (OFF)'}
          </button>
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1">Hero Main Heading *</label>
          <input
            type="text"
            value={heroSettings.title}
            onChange={(e) => setHeroSettings(prev => ({ ...prev, title: e.target.value }))}
            className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg outline-none focus:ring-2 focus:ring-navy-900"
            required
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Subheading Tagline</label>
            <input
              type="text"
              value={heroSettings.subtitle}
              onChange={(e) => setHeroSettings(prev => ({ ...prev, subtitle: e.target.value }))}
              className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg outline-none focus:ring-2 focus:ring-navy-900"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Description</label>
            <input
              type="text"
              value={heroSettings.description}
              onChange={(e) => setHeroSettings(prev => ({ ...prev, description: e.target.value }))}
              className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg outline-none focus:ring-2 focus:ring-navy-900"
            />
          </div>
        </div>

        {/* HERO IMAGE UPLOADER */}
        <ImageUploader
          label="Hero Background Banner (ImageKit Upload)"
          value={heroSettings.image}
          fileId={heroSettings.imageId}
          onChange={(url, fileId) => setHeroSettings(prev => ({ ...prev, image: url, imageId: fileId }))}
          onRemove={() => setHeroSettings(prev => ({ ...prev, image: '', imageId: '' }))}
        />

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 border-t border-slate-100">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Primary CTA Button Text</label>
            <input
              type="text"
              value={heroSettings.primaryBtnText}
              onChange={(e) => setHeroSettings(prev => ({ ...prev, primaryBtnText: e.target.value }))}
              className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg outline-none focus:ring-2 focus:ring-navy-900"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Secondary CTA Button Text</label>
            <input
              type="text"
              value={heroSettings.secondaryBtnText}
              onChange={(e) => setHeroSettings(prev => ({ ...prev, secondaryBtnText: e.target.value }))}
              className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg outline-none focus:ring-2 focus:ring-navy-900"
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={saving}
          className="px-6 py-3 bg-gold-600 hover:bg-gold-700 text-white font-semibold text-xs rounded-xl shadow-gold flex items-center gap-2"
        >
          <Save className="w-4 h-4" />
          <span>Save Hero Settings</span>
        </button>

      </form>
    </div>
  );
};

export default AdminHero;
