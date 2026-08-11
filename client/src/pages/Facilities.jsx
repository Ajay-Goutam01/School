import React, { useState, useEffect } from 'react';
import Breadcrumb from '../components/Breadcrumb';
import PageUnavailable from '../components/PageUnavailable';
import api from '../services/api';
import { useSchool } from '../context/SchoolContext';
import { Sparkles, ShieldCheck } from 'lucide-react';

const Facilities = () => {
  const { pageVisibility } = useSchool();
  const [facilities, setFacilities] = useState([]);
  const [loading, setLoading] = useState(true);

  if (pageVisibility.facilities === false) {
    return <PageUnavailable pageTitle="Facilities & Infrastructure" />;
  }

  useEffect(() => {
    const fetchFacilities = async () => {
      try {
        setLoading(true);
        const res = await api.get('/facilities');
        if (res.data && res.data.success) {
          setFacilities(res.data.data || []);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchFacilities();
  }, []);

  return (
    <div>
      <Breadcrumb 
        title="Campus Infrastructure & Facilities" 
        subtitle="Explore our 25-acre modern campus featuring smart learning spaces, research labs, sports arenas, and security infrastructure."
        items={[{ label: 'Facilities' }]}
      />

      <section className="py-16 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          {loading ? (
            <div className="text-center py-12 text-slate-500 text-xs">Loading facilities...</div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {facilities.map((item) => (
                <div key={item._id} className="bg-white rounded-2xl overflow-hidden shadow-subtle border border-slate-200">
                  {item.image && (
                    <div className="h-52 overflow-hidden">
                      <img src={item.image} alt={item.title} className="w-full h-full object-cover" />
                    </div>
                  )}
                  <div className="p-6 space-y-2">
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

export default Facilities;
