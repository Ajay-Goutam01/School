import React, { useState, useEffect } from 'react';
import Breadcrumb from '../components/Breadcrumb';
import PageUnavailable from '../components/PageUnavailable';
import api from '../services/api';
import { useSchool } from '../context/SchoolContext';
import { Layers, Sparkles, CheckCircle2 } from 'lucide-react';

const Courses = () => {
  const { pageVisibility } = useSchool();
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);

  if (pageVisibility.courses === false) {
    return <PageUnavailable pageTitle="Special Programs" />;
  }

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        setLoading(true);
        const res = await api.get('/courses');
        if (res.data && res.data.success) {
          setCourses(res.data.data || []);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchCourses();
  }, []);

  return (
    <div>
      <Breadcrumb 
        title="Special Programs & Electives" 
        subtitle="Enrichment courses in STEM, Robotics, AI, Performing Arts, and Olympiad Training."
        items={[{ label: 'Academics', path: '/academics' }, { label: 'Special Courses' }]}
      />

      <section className="py-16 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          {loading ? (
            <div className="text-center py-12 text-slate-500 text-xs">Loading program catalog...</div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {courses.map((item) => (
                <div key={item._id} className="bg-white rounded-2xl overflow-hidden shadow-subtle border border-slate-200 flex flex-col justify-between">
                  {item.image && (
                    <div className="h-48 overflow-hidden relative">
                      <img src={item.image} alt={item.title} className="w-full h-full object-cover" />
                    </div>
                  )}
                  <div className="p-6 space-y-3">
                    <span className="text-[10px] font-bold text-gold-600 uppercase tracking-wider">{item.category}</span>
                    <h3 className="text-lg font-bold font-serif text-navy-900">{item.title}</h3>
                    <p className="text-xs text-slate-600 leading-relaxed">{item.description}</p>
                    
                    {item.ageApplicability && (
                      <div className="pt-2 text-xs font-semibold text-navy-900">
                        Applicable: <span className="text-slate-600 font-normal">{item.ageApplicability}</span>
                      </div>
                    )}
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

export default Courses;
