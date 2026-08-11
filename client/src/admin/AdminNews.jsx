import React, { useState, useEffect } from 'react';
import api from '../services/api';
import ImageUploader from '../components/ImageUploader';
import { Newspaper, Plus, Trash2, ArrowUp, ArrowDown } from 'lucide-react';

const AdminNews = () => {
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({
    title: '',
    description: '',
    content: '',
    coverImage: '',
    imageId: '',
    category: 'News',
    isPublished: true,
    isVisible: true
  });

  const fetchNews = async () => {
    try {
      setLoading(true);
      const res = await api.get('/news/all');
      if (res.data && res.data.success) {
        setNews(res.data.data);
      }
    } catch (err) {
      console.error('Error fetching news:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchNews(); }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post('/news', form);
      setForm({ title: '', description: '', content: '', coverImage: '', imageId: '', category: 'News', isPublished: true, isVisible: true });
      fetchNews();
    } catch (err) {
      alert('Failed to publish article');
    }
  };

  const handleToggleVisibility = async (item) => {
    try {
      await api.put(`/news/${item._id}`, { isVisible: !item.isVisible });
      fetchNews();
    } catch (err) { alert('Failed to toggle visibility'); }
  };

  const handleMoveOrder = async (index, direction) => {
    const list = [...news];
    const targetIdx = index + direction;
    if (targetIdx < 0 || targetIdx >= list.length) return;
    
    const current = list[index];
    const target = list[targetIdx];

    try {
      await Promise.all([
        api.put(`/news/${current._id}`, { order: targetIdx }),
        api.put(`/news/${target._id}`, { order: index })
      ]);
      fetchNews();
    } catch (err) { alert('Failed to reorder'); }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this article?')) return;
    try {
      await api.delete(`/news/${id}`);
      fetchNews();
    } catch (err) {
      alert('Failed to delete article');
    }
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold font-serif text-slate-900">News & Events Management</h1>
        <p className="text-xs text-slate-500">Publish school announcements, event coverage, and achievements.</p>
      </div>

      <form onSubmit={handleSubmit} className="bg-white p-6 rounded-2xl shadow-subtle border border-slate-200 space-y-4 max-w-3xl">
        <h3 className="text-base font-bold font-serif text-slate-900">Publish New Article / Event</h3>

        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1">Title *</label>
          <input
            type="text"
            value={form.title}
            onChange={(e) => setForm(prev => ({ ...prev, title: e.target.value }))}
            placeholder="e.g. CBSE Merit Awards Ceremony"
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
            <option value="News">News</option>
            <option value="Event">Event</option>
            <option value="Achievement">Achievement</option>
            <option value="Announcement">Announcement</option>
          </select>
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1">Short Description *</label>
          <textarea
            rows={2}
            value={form.description}
            onChange={(e) => setForm(prev => ({ ...prev, description: e.target.value }))}
            className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg outline-none focus:ring-2 focus:ring-navy-900 resize-none"
            required
          />
        </div>

        {/* IMAGE UPLOADER */}
        <ImageUploader
          label="Article Cover Photo (ImageKit Upload)"
          value={form.coverImage}
          fileId={form.imageId}
          onChange={(url, fileId) => setForm(prev => ({ ...prev, coverImage: url, imageId: fileId }))}
          onRemove={() => setForm(prev => ({ ...prev, coverImage: '', imageId: '' }))}
        />

        <button
          type="submit"
          className="px-6 py-2.5 bg-gold-600 hover:bg-gold-700 text-white font-semibold text-xs rounded-xl shadow-gold flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          <span>Publish Story</span>
        </button>
      </form>

      <div className="bg-white rounded-2xl shadow-subtle border border-slate-200 divide-y divide-slate-100">
        {news.map((item, idx) => (
          <div key={item._id} className="p-4 flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              {item.coverImage && <img src={item.coverImage} alt={item.title} className="w-12 h-12 object-cover rounded-xl shrink-0" />}
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

export default AdminNews;
