import React, { useState, useEffect } from 'react';
import Breadcrumb from '../components/Breadcrumb';
import PageUnavailable from '../components/PageUnavailable';
import api from '../services/api';
import { useSchool } from '../context/SchoolContext';
import { Bell, Calendar, AlertCircle } from 'lucide-react';

const Notices = () => {
  const { pageVisibility } = useSchool();
  const [notices, setNotices] = useState([]);
  const [loading, setLoading] = useState(true);

  if (pageVisibility.notices === false) {
    return <PageUnavailable pageTitle="Notice Board" />;
  }

  useEffect(() => {
    const fetchNotices = async () => {
      try {
        setLoading(true);
        const res = await api.get('/notices');
        if (res.data && res.data.success) {
          setNotices(res.data.data || []);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchNotices();
  }, []);

  return (
    <div>
      <Breadcrumb 
        title="Official School Notice Board" 
        subtitle="Important announcements, exam timetables, holiday circulars, and administrative notices."
        items={[{ label: 'Notice Board' }]}
      />

      <section className="py-16 bg-slate-50">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
          {loading ? (
            <div className="text-center py-12 text-slate-500 text-xs">Loading notices...</div>
          ) : (
            <div className="space-y-4">
              {notices.map((n) => (
                <div key={n._id} className="bg-white p-6 rounded-2xl shadow-subtle border border-slate-200 space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      {n.isImportant && <span className="px-2.5 py-0.5 rounded text-[10px] font-bold bg-rose-100 text-rose-800 uppercase">URGENT</span>}
                      <span className="text-xs text-slate-400 font-medium">{new Date(n.date).toLocaleDateString()}</span>
                    </div>
                  </div>
                  <h3 className="text-base font-bold font-serif text-navy-900">{n.title}</h3>
                  <p className="text-xs text-slate-600 leading-relaxed">{n.description}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default Notices;
