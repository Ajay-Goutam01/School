import React, { useState, useEffect } from 'react';
import api from '../services/api';
import ImageUploader from '../components/ImageUploader';
import { Image as ImageIcon, Plus, Trash2, ArrowUp, ArrowDown, CheckSquare, Square, AlertCircle, CheckCircle2, Loader2 } from 'lucide-react';

const AdminGallery = () => {
  const [gallery, setGallery] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState(null);
  const [bulkDeleting, setBulkDeleting] = useState(false);
  const [selectedIds, setSelectedIds] = useState([]);
  const [statusMsg, setStatusMsg] = useState('');

  const [form, setForm] = useState({
    title: '',
    image: '',
    fileId: '',
    category: 'Campus',
    altText: '',
    description: '',
    isVisible: true
  });

  const fetchGallery = async () => {
    try {
      setLoading(true);
      const res = await api.get('/gallery/all');
      if (res.data && res.data.success) {
        setGallery(res.data.data);
      }
    } catch (err) {
      console.error('Error fetching gallery:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchGallery(); }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.title || !form.image) {
      alert('Please select an image file and enter a title');
      return;
    }

    try {
      await api.post('/gallery', form);
      setForm({ title: '', image: '', fileId: '', category: 'Campus', altText: '', description: '', isVisible: true });
      setStatusMsg('New photo added to gallery successfully.');
      fetchGallery();
    } catch (err) {
      alert('Failed to add gallery item');
    }
  };

  const handleToggleVisibility = async (item) => {
    try {
      await api.put(`/gallery/${item._id}`, { isVisible: !item.isVisible });
      fetchGallery();
    } catch (err) { alert('Failed to toggle visibility'); }
  };

  const handleMoveOrder = async (index, direction) => {
    const list = [...gallery];
    const targetIdx = index + direction;
    if (targetIdx < 0 || targetIdx >= list.length) return;
    
    const current = list[index];
    const target = list[targetIdx];

    try {
      await Promise.all([
        api.put(`/gallery/${current._id}`, { order: targetIdx }),
        api.put(`/gallery/${target._id}`, { order: index })
      ]);
      fetchGallery();
    } catch (err) { alert('Failed to reorder'); }
  };

  const handleDeleteSingle = async (item) => {
    const confirmDelete = window.confirm(
      "Delete this image? This will remove the image from the website and, if it is no longer used elsewhere, permanently remove it from ImageKit."
    );

    if (!confirmDelete) return;

    try {
      setDeletingId(item._id);
      const res = await api.delete(`/gallery/${item._id}`);
      if (res.data && res.data.success) {
        setStatusMsg('Image deleted successfully.');
        fetchGallery();
      }
    } catch (err) {
      alert(err.response?.data?.message || 'Unable to delete image. Please try again.');
    } finally {
      setDeletingId(null);
    }
  };

  const handleToggleSelect = (id) => {
    setSelectedIds(prev => 
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    );
  };

  const handleSelectAll = () => {
    if (selectedIds.length === gallery.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(gallery.map(g => g._id));
    }
  };

  const handleBulkDelete = async () => {
    if (selectedIds.length === 0) return;

    const confirmDelete = window.confirm(
      `Delete ${selectedIds.length} selected image(s)? This will remove them from the website and, if unused elsewhere, permanently remove them from ImageKit.`
    );

    if (!confirmDelete) return;

    try {
      setBulkDeleting(true);
      const res = await api.post('/gallery/bulk-delete', { ids: selectedIds });
      if (res.data && res.data.success) {
        setStatusMsg(res.data.message);
        setSelectedIds([]);
        fetchGallery();
      }
    } catch (err) {
      alert(err.response?.data?.message || 'Bulk delete failed. Please try again.');
    } finally {
      setBulkDeleting(false);
    }
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold font-serif text-slate-900">Photo Gallery Management</h1>
        <p className="text-xs text-slate-500">Upload, categorize, reorder, and bulk-delete campus photos with automated ImageKit CDN cleanup.</p>
      </div>

      {statusMsg && (
        <div className="p-4 rounded-xl bg-emerald-50 text-emerald-800 text-xs font-semibold flex items-center justify-between border border-emerald-200">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span>{statusMsg}</span>
          </div>
          <button onClick={() => setStatusMsg('')} className="text-emerald-700 hover:text-emerald-900"><X className="w-4 h-4" /></button>
        </div>
      )}

      {/* ADD PHOTO FORM */}
      <form onSubmit={handleSubmit} className="bg-white p-6 rounded-2xl shadow-subtle border border-slate-200 space-y-4 max-w-2xl">
        <h3 className="text-base font-bold font-serif text-slate-900">Add New Photo to Gallery</h3>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Image Title *</label>
            <input
              type="text"
              value={form.title}
              onChange={(e) => setForm(prev => ({ ...prev, title: e.target.value }))}
              placeholder="e.g. Science Lab Experiment"
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
              <option value="Campus">Campus</option>
              <option value="Classrooms">Classrooms</option>
              <option value="Sports">Sports</option>
              <option value="Cultural">Cultural</option>
              <option value="Events">Events</option>
              <option value="Trips">Trips</option>
              <option value="Achievements">Achievements</option>
              <option value="Laboratories">Laboratories</option>
              <option value="Library">Library</option>
              <option value="Activities">Activities</option>
              <option value="Other">Other</option>
            </select>
          </div>
        </div>

        <ImageUploader
          label="Gallery Photo (ImageKit Upload)"
          value={form.image}
          fileId={form.fileId}
          onChange={(url, newFileId) => setForm(prev => ({ ...prev, image: url, fileId: newFileId }))}
          onRemove={() => setForm(prev => ({ ...prev, image: '', fileId: '' }))}
        />

        <button
          type="submit"
          className="px-6 py-2.5 bg-gold-600 hover:bg-gold-700 text-white font-semibold text-xs rounded-xl shadow-gold flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          <span>Add Photo to Gallery</span>
        </button>
      </form>

      {/* BULK ACTIONS HEADER */}
      {gallery.length > 0 && (
        <div className="bg-white p-4 rounded-2xl shadow-subtle border border-slate-200 flex flex-wrap items-center justify-between gap-4">
          <button
            type="button"
            onClick={handleSelectAll}
            className="flex items-center gap-2 text-xs font-semibold text-slate-700 hover:text-navy-900"
          >
            {selectedIds.length === gallery.length ? <CheckSquare className="w-4 h-4 text-gold-600" /> : <Square className="w-4 h-4" />}
            <span>Select All ({gallery.length})</span>
          </button>

          {selectedIds.length > 0 && (
            <button
              type="button"
              onClick={handleBulkDelete}
              disabled={bulkDeleting}
              className="px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white text-xs font-semibold rounded-xl shadow flex items-center gap-2"
            >
              {bulkDeleting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />}
              <span>{bulkDeleting ? 'Deleting...' : `Delete Selected (${selectedIds.length})`}</span>
            </button>
          )}
        </div>
      )}

      {/* GALLERY GRID */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {gallery.map((item, idx) => {
          const isSelected = selectedIds.includes(item._id);
          const isDeletingThis = deletingId === item._id;

          return (
            <div key={item._id} className={`bg-white rounded-2xl overflow-hidden shadow-subtle border transition relative ${isSelected ? 'border-gold-500 ring-2 ring-gold-500/20' : 'border-slate-200'}`}>
              
              <div className="relative h-48 overflow-hidden">
                <img src={item.image} alt={item.title} className="w-full h-full object-cover" />
                
                <button
                  type="button"
                  onClick={() => handleToggleSelect(item._id)}
                  className="absolute top-3 left-3 w-7 h-7 rounded-lg bg-navy-950/70 text-white flex items-center justify-center backdrop-blur-sm"
                >
                  {isSelected ? <CheckSquare className="w-4 h-4 text-gold-400" /> : <Square className="w-4 h-4" />}
                </button>

                {isDeletingThis && (
                  <div className="absolute inset-0 bg-slate-950/70 backdrop-blur-sm flex flex-col items-center justify-center text-white">
                    <Loader2 className="w-6 h-6 animate-spin text-gold-400 mb-1" />
                    <span className="text-[11px] font-semibold">Deleting & Cleaning...</span>
                  </div>
                )}
              </div>

              <div className="p-4 flex items-center justify-between gap-2">
                <div>
                  <span className="text-[10px] font-bold uppercase text-gold-600">{item.category}</span>
                  <h4 className="text-sm font-bold font-serif text-slate-900 truncate max-w-[140px]">{item.title}</h4>
                </div>

                <div className="flex items-center gap-1">
                  <button
                    type="button"
                    onClick={() => handleToggleVisibility(item)}
                    className={`px-2 py-0.5 rounded text-[10px] font-bold ${item.isVisible ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'}`}
                  >
                    {item.isVisible ? 'On' : 'Off'}
                  </button>
                  <button type="button" onClick={() => handleMoveOrder(idx, -1)} className="p-1 text-slate-500 hover:text-navy-900"><ArrowUp className="w-3.5 h-3.5" /></button>
                  <button type="button" onClick={() => handleMoveOrder(idx, 1)} className="p-1 text-slate-500 hover:text-navy-900"><ArrowDown className="w-3.5 h-3.5" /></button>
                  <button 
                    type="button" 
                    onClick={() => handleDeleteSingle(item)}
                    disabled={isDeletingThis}
                    className="text-rose-600 p-1 hover:bg-rose-50 rounded"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

            </div>
          );
        })}
      </div>

    </div>
  );
};

export default AdminGallery;
