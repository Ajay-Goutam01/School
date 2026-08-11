import React, { useState, useEffect } from 'react';
import Breadcrumb from '../components/Breadcrumb';
import PageUnavailable from '../components/PageUnavailable';
import api from '../services/api';
import { useSchool } from '../context/SchoolContext';
import { Image as ImageIcon, Sparkles } from 'lucide-react';

const Gallery = () => {
  const { pageVisibility } = useSchool();
  const [photos, setPhotos] = useState([]);
  const [selectedCat, setSelectedCat] = useState('All');
  const [loading, setLoading] = useState(true);

  if (pageVisibility.gallery === false) {
    return <PageUnavailable pageTitle="Photo Gallery" />;
  }

  const categories = ['All', 'Campus', 'Classrooms', 'Sports', 'Cultural', 'Events', 'Laboratories', 'Library', 'Activities'];

  useEffect(() => {
    const fetchGallery = async () => {
      try {
        setLoading(true);
        const url = selectedCat === 'All' ? '/gallery' : `/gallery?category=${selectedCat}`;
        const res = await api.get(url);
        if (res.data && res.data.success) {
          setPhotos(res.data.data || []);
        }
      } catch (err) {
        console.error('Gallery fetch error:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchGallery();
  }, [selectedCat]);

  return (
    <div>
      <Breadcrumb 
        title="Campus Photo Gallery" 
        subtitle="A visual showcase of our state-of-the-art campus, smart classrooms, athletic fields, and vibrant student activities."
        items={[{ label: 'Gallery' }]}
      />

      <section className="py-16 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
          
          {/* Category Filter Buttons */}
          <div className="flex flex-wrap items-center justify-center gap-2">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCat(cat)}
                className={`px-4 py-2 rounded-xl text-xs font-semibold transition ${
                  selectedCat === cat 
                    ? 'bg-navy-900 text-gold-400 shadow-md' 
                    : 'bg-white text-slate-700 hover:bg-slate-200 border border-slate-200'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {loading ? (
            <div className="text-center py-12 text-slate-500 text-xs">Loading campus photos...</div>
          ) : photos.length === 0 ? (
            <div className="text-center py-12 text-slate-500 text-xs">No photos found in this category.</div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {photos.map((item) => (
                <div key={item._id} className="bg-white rounded-2xl overflow-hidden shadow-subtle border border-slate-200 group">
                  <div className="h-60 overflow-hidden relative">
                    <img src={item.image} alt={item.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                    <span className="absolute top-3 left-3 bg-navy-950/80 backdrop-blur-sm text-gold-400 px-3 py-1 rounded-full text-[10px] font-bold uppercase">
                      {item.category}
                    </span>
                  </div>
                  <div className="p-4">
                    <h3 className="text-sm font-bold font-serif text-navy-900 truncate">{item.title}</h3>
                    {item.description && <p className="text-xs text-slate-500 mt-1 line-clamp-1">{item.description}</p>}
                  </div>
                </div>
              ))}
            </div>
          )}

        </div>
      </section>
    </div>
  );
};

export default Gallery;
