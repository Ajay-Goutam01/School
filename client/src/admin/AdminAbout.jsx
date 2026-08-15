import React, { useState, useEffect } from 'react';
import api from '../services/api';
import { useSchool } from '../context/SchoolContext';
import ImageUploader from '../components/ImageUploader';
import { Save, Plus, Trash2, ArrowUp, ArrowDown, CheckCircle2 } from 'lucide-react';

const AdminAbout = () => {
  const { fetchProfile, updateProfile } = useSchool();
  const [aboutSettings, setAboutSettings] = useState({
    heading: "Nurturing Tomorrow's Visionaries",
    subheading: "Established in 1998",
    description: "Founded with a visionary commitment to offer benchmarked education.",
    history: "Over 28 years of academic excellence and holistic development.",
    vision: "To inspire curiosity, nurture critical thinking, and foster resilient global citizens.",
    mission: "Providing a modern, safe, and collaborative learning environment.",
    image: "https://images.unsplash.com/photo-1580582932707-520aed937b7b?w=800&auto=format&fit=crop&q=80",
    imageId: "",
    coreValues: [],
    whyChooseUs: []
  });

  const [newCard, setNewCard] = useState({ title: '', description: '', icon: 'CheckCircle2' });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState('');

  const loadData = async () => {
    try {
      setLoading(true);
      const res = await api.get('/school');
      if (res.data && res.data.success && res.data.data.aboutSettings) {
        setAboutSettings(prev => ({ ...prev, ...res.data.data.aboutSettings }));
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadData(); }, []);

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    setMsg('');
    try {
      const res = await api.put('/school', { aboutSettings });
      if (res.data && res.data.success) {
        setMsg('About section and Why Choose Us settings saved successfully!');
        if (updateProfile) {
          updateProfile(res.data.data || { aboutSettings });
        } else {
          fetchProfile();
        }
      }
    } catch (err) {
      alert('Failed to save settings');
    } finally {
      setSaving(false);
    }
  };

  const handleAddCard = () => {
    if (!newCard.title || !newCard.description) return;
    setAboutSettings(prev => ({
      ...prev,
      whyChooseUs: [
        ...prev.whyChooseUs,
        { ...newCard, isVisible: true, order: prev.whyChooseUs.length }
      ]
    }));
    setNewCard({ title: '', description: '', icon: 'CheckCircle2' });
  };

  const handleDeleteCard = (index) => {
    setAboutSettings(prev => ({
      ...prev,
      whyChooseUs: prev.whyChooseUs.filter((_, idx) => idx !== index)
    }));
  };

  const handleMoveCard = (index, direction) => {
    const list = [...aboutSettings.whyChooseUs];
    const targetIdx = index + direction;
    if (targetIdx < 0 || targetIdx >= list.length) return;
    const temp = list[index];
    list[index] = list[targetIdx];
    list[targetIdx] = temp;
    setAboutSettings(prev => ({ ...prev, whyChooseUs: list }));
  };

  if (loading) return <div className="p-8 text-xs text-slate-500">Loading About settings...</div>;

  return (
    <div className="space-y-8 max-w-4xl">
      <div>
        <h1 className="text-2xl font-bold font-serif text-slate-900">About & "Why Choose Us" Management</h1>
        <p className="text-xs text-slate-500">Manage vision, mission, school history, about image, and Why Choose Us cards.</p>
      </div>

      {msg && (
        <div className="p-4 rounded-xl bg-emerald-50 text-emerald-800 text-xs font-semibold flex items-center gap-2 border border-emerald-200">
          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          <span>{msg}</span>
        </div>
      )}

      <form onSubmit={handleSave} className="bg-white p-6 rounded-2xl shadow-subtle border border-slate-200 space-y-6">
        
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">About Heading</label>
            <input
              type="text"
              value={aboutSettings.heading}
              onChange={(e) => setAboutSettings(prev => ({ ...prev, heading: e.target.value }))}
              className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg outline-none focus:ring-2 focus:ring-navy-900"
              required
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Subheading</label>
            <input
              type="text"
              value={aboutSettings.subheading}
              onChange={(e) => setAboutSettings(prev => ({ ...prev, subheading: e.target.value }))}
              className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg outline-none focus:ring-2 focus:ring-navy-900"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1">Main About Description</label>
          <textarea
            rows={3}
            value={aboutSettings.description}
            onChange={(e) => setAboutSettings(prev => ({ ...prev, description: e.target.value }))}
            className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg outline-none focus:ring-2 focus:ring-navy-900 resize-none"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">School Vision Statement</label>
            <textarea
              rows={3}
              value={aboutSettings.vision}
              onChange={(e) => setAboutSettings(prev => ({ ...prev, vision: e.target.value }))}
              className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg outline-none focus:ring-2 focus:ring-navy-900 resize-none"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">School Mission Statement</label>
            <textarea
              rows={3}
              value={aboutSettings.mission}
              onChange={(e) => setAboutSettings(prev => ({ ...prev, mission: e.target.value }))}
              className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg outline-none focus:ring-2 focus:ring-navy-900 resize-none"
            />
          </div>
        </div>

        {/* ABOUT IMAGE UPLOADER */}
        <ImageUploader
          label="About Section Showcase Photo (ImageKit Upload)"
          value={aboutSettings.image}
          fileId={aboutSettings.imageId}
          onChange={(url, fileId) => setAboutSettings(prev => ({ ...prev, image: url, imageId: fileId }))}
          onRemove={() => setAboutSettings(prev => ({ ...prev, image: '', imageId: '' }))}
        />

        {/* WHY CHOOSE US CARDS */}
        <div className="pt-6 border-t border-slate-200 space-y-4">
          <h3 className="text-base font-bold font-serif text-slate-900">Why Choose Us Cards</h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 bg-slate-50 p-4 rounded-xl border border-slate-200">
            <input
              type="text"
              placeholder="Card Title (e.g. Smart Classrooms)"
              value={newCard.title}
              onChange={(e) => setNewCard(prev => ({ ...prev, title: e.target.value }))}
              className="px-3 py-2 text-xs border border-slate-300 rounded-lg outline-none bg-white"
            />
            <input
              type="text"
              placeholder="Description"
              value={newCard.description}
              onChange={(e) => setNewCard(prev => ({ ...prev, description: e.target.value }))}
              className="px-3 py-2 text-xs border border-slate-300 rounded-lg outline-none bg-white"
            />
            <button
              type="button"
              onClick={handleAddCard}
              className="sm:col-span-2 py-2 px-4 bg-navy-900 hover:bg-navy-800 text-white font-semibold text-xs rounded-lg flex items-center justify-center gap-1.5"
            >
              <Plus className="w-4 h-4" /> Add Card
            </button>
          </div>

          <div className="space-y-2">
            {aboutSettings.whyChooseUs?.map((card, idx) => (
              <div key={idx} className="p-3 bg-white rounded-xl border border-slate-200 flex items-center justify-between gap-3 text-xs">
                <div>
                  <h5 className="font-bold font-serif text-slate-900">{card.title}</h5>
                  <p className="text-slate-500 text-[11px]">{card.description}</p>
                </div>
                <div className="flex items-center gap-1">
                  <button type="button" onClick={() => handleMoveCard(idx, -1)} className="p-1 text-slate-500 hover:text-navy-900">
                    <ArrowUp className="w-4 h-4" />
                  </button>
                  <button type="button" onClick={() => handleMoveCard(idx, 1)} className="p-1 text-slate-500 hover:text-navy-900">
                    <ArrowDown className="w-4 h-4" />
                  </button>
                  <button type="button" onClick={() => handleDeleteCard(idx)} className="p-1 text-rose-600 hover:text-rose-800">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        <button
          type="submit"
          disabled={saving}
          className="px-6 py-3 bg-gold-600 hover:bg-gold-700 text-white font-semibold text-xs rounded-xl shadow-gold flex items-center gap-2"
        >
          <Save className="w-4 h-4" />
          <span>Save About & Cards Settings</span>
        </button>

      </form>
    </div>
  );
};

export default AdminAbout;
