import React, { useState, useEffect } from 'react';
import Breadcrumb from '../components/Breadcrumb';
import PageUnavailable from '../components/PageUnavailable';
import api from '../services/api';
import { useSchool } from '../context/SchoolContext';
import { GraduationCap, Award } from 'lucide-react';

const Faculty = () => {
  const { pageVisibility } = useSchool();
  const [faculty, setFaculty] = useState([]);
  const [loading, setLoading] = useState(true);

  if (pageVisibility.faculty === false) {
    return <PageUnavailable pageTitle="Faculty & Mentors" />;
  }

  useEffect(() => {
    const fetchFaculty = async () => {
      try {
        setLoading(true);
        const res = await api.get('/faculty');
        if (res.data && res.data.success) {
          setFaculty(res.data.data || []);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchFaculty();
  }, []);

  return (
    <div>
      <Breadcrumb 
        title="Leadership & Faculty Team" 
        subtitle="Meet our dedicated educators, mentors, and administrators committed to inspiring academic excellence."
        items={[{ label: 'Faculty' }]}
      />

      <section className="py-16 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          {loading ? (
            <div className="text-center py-12 text-slate-500 text-xs">Loading faculty team...</div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
              {faculty.map((member) => (
                <div key={member._id} className="bg-white rounded-2xl p-6 shadow-subtle border border-slate-200 text-center space-y-4">
                  {member.photo && (
                    <img src={member.photo} alt={member.name} className="w-24 h-24 object-cover rounded-full mx-auto shadow-md border-2 border-gold-400" />
                  )}
                  <div>
                    <span className="text-[10px] font-bold text-gold-600 uppercase tracking-wider">{member.role}</span>
                    <h3 className="text-base font-bold font-serif text-navy-900 mt-1">{member.name}</h3>
                    <p className="text-xs text-slate-500 mt-1">{member.qualification} • {member.experience}</p>
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

export default Faculty;
