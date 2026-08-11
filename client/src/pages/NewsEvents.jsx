import React, { useState, useEffect } from 'react';
import Breadcrumb from '../components/Breadcrumb';
import PageUnavailable from '../components/PageUnavailable';
import api from '../services/api';
import { useSchool } from '../context/SchoolContext';
import { Newspaper, Calendar } from 'lucide-react';

const NewsEvents = () => {
  const { pageVisibility } = useSchool();
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(true);

  if (pageVisibility.news === false) {
    return <PageUnavailable pageTitle="News & Events" />;
  }

  useEffect(() => {
    const fetchNews = async () => {
      try {
        setLoading(true);
        const res = await api.get('/news');
        if (res.data && res.data.success) {
          setNews(res.data.data || []);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchNews();
  }, []);

  return (
    <div>
      <Breadcrumb 
        title="School News & Campus Events" 
        subtitle="Latest updates, academic achievements, sports victories, and upcoming event schedules."
        items={[{ label: 'News & Events' }]}
      />

      <section className="py-16 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          {loading ? (
            <div className="text-center py-12 text-slate-500 text-xs">Loading news & events...</div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {news.map((item) => (
                <div key={item._id} className="bg-white rounded-2xl overflow-hidden shadow-subtle border border-slate-200">
                  {item.coverImage && (
                    <div className="h-48 overflow-hidden">
                      <img src={item.coverImage} alt={item.title} className="w-full h-full object-cover" />
                    </div>
                  )}
                  <div className="p-6 space-y-2">
                    <div className="flex items-center justify-between text-[11px] text-slate-400">
                      <span className="font-bold text-gold-600 uppercase">{item.category}</span>
                      <span>{new Date(item.date).toLocaleDateString()}</span>
                    </div>
                    <h3 className="text-base font-bold font-serif text-navy-900">{item.title}</h3>
                    <p className="text-xs text-slate-600 leading-relaxed">{item.description}</p>
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

export default NewsEvents;
