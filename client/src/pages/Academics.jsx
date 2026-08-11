import React, { useState, useEffect } from 'react';
import Breadcrumb from '../components/Breadcrumb';
import PageUnavailable from '../components/PageUnavailable';
import api from '../services/api';
import { useSchool } from '../context/SchoolContext';
import { BookOpen, CheckCircle2 } from 'lucide-react';

const Academics = () => {
  const { pageVisibility } = useSchool();
  const [academics, setAcademics] = useState([]);
  const [loading, setLoading] = useState(true);

  if (pageVisibility.academics === false) {
    return <PageUnavailable pageTitle="Academics & Curriculum" />;
  }

  useEffect(() => {
    const fetchAcademics = async () => {
      try {
        setLoading(true);
        const res = await api.get('/academics');
        if (res.data && res.data.success) {
          setAcademics(res.data.data || []);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchAcademics();
  }, []);

  return (
    <div>
      <Breadcrumb 
        title="Academic Divisions & Curriculum" 
        subtitle="Explore our comprehensive educational pathways from Early Years Playgroup through Senior Board Specializations."
        items={[{ label: 'Academics' }]}
      />

      <section className="py-16 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          {loading ? (
            <div className="text-center py-12 text-slate-500 text-xs">Loading academic curriculum...</div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {academics.map((item) => (
                <div key={item._id} className="bg-white rounded-2xl p-8 shadow-subtle border border-slate-200 space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="px-3 py-1 text-xs font-bold rounded-full bg-gold-100 text-gold-800">
                      {item.grades}
                    </span>
                    <span className="text-xs text-slate-400 font-medium">CBSE Syllabus</span>
                  </div>

                  <h3 className="text-2xl font-bold font-serif text-navy-900">{item.category}</h3>
                  <p className="text-sm text-slate-600 leading-relaxed">{item.description}</p>

                  {item.methodology && (
                    <div className="pt-3 border-t border-slate-100">
                      <h4 className="text-xs font-bold text-navy-900 uppercase tracking-wider mb-1">Teaching Methodology</h4>
                      <p className="text-xs text-slate-500">{item.methodology}</p>
                    </div>
                  )}

                  {item.subjects?.length > 0 && (
                    <div className="pt-2">
                      <h4 className="text-xs font-bold text-navy-900 uppercase tracking-wider mb-2">Core Subject Modules</h4>
                      <div className="flex flex-wrap gap-2">
                        {item.subjects.map((sub, idx) => (
                          <span key={idx} className="px-2.5 py-1 bg-slate-100 text-slate-700 text-xs font-medium rounded-lg">
                            {sub}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default Academics;
