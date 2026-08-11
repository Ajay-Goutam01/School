import React, { useState, useEffect } from 'react';
import Breadcrumb from '../components/Breadcrumb';
import PageUnavailable from '../components/PageUnavailable';
import api from '../services/api';
import { useSchool } from '../context/SchoolContext';
import { Trophy, Sparkles } from 'lucide-react';

const Activities = () => {
  const { pageVisibility } = useSchool();
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);

  if (pageVisibility.activities === false) {
    return <PageUnavailable pageTitle="Activities & Sports" />;
  }

  useEffect(() => {
    const fetchActivities = async () => {
      try {
        setLoading(true);
        const res = await api.get('/activities');
        if (res.data && res.data.success) {
          setActivities(res.data.data || []);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchActivities();
  }, []);

  return (
    <div>
      <Breadcrumb 
        title="Co-Curricular Activities & Sports" 
        subtitle="Nurturing teamwork, athletic vigor, leadership, and artistic passion beyond the classroom."
        items={[{ label: 'Activities' }]}
      />

      <section className="py-16 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          {loading ? (
            <div className="text-center py-12 text-slate-500 text-xs">Loading activities...</div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {activities.map((item) => (
                <div key={item._id} className="bg-white rounded-2xl overflow-hidden shadow-subtle border border-slate-200">
                  {item.image && (
                    <div className="h-48 overflow-hidden">
                      <img src={item.image} alt={item.title} className="w-full h-full object-cover" />
                    </div>
                  )}
                  <div className="p-6 space-y-2">
                    <span className="text-[10px] font-bold text-gold-600 uppercase">{item.category}</span>
                    <h3 className="text-lg font-bold font-serif text-navy-900">{item.title}</h3>
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

export default Activities;
