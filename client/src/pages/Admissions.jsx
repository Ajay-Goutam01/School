import React, { useState, useEffect } from 'react';
import Breadcrumb from '../components/Breadcrumb';
import PageUnavailable from '../components/PageUnavailable';
import api from '../services/api';
import { useSchool } from '../context/SchoolContext';
import { CheckCircle2, ArrowRight, Sparkles, FileText, Calendar } from 'lucide-react';

const Admissions = () => {
  const { openEnquiryModal, pageVisibility } = useSchool();
  const [admissionData, setAdmissionData] = useState(null);
  const [loading, setLoading] = useState(true);

  if (pageVisibility.admissions === false) {
    return <PageUnavailable pageTitle="Admissions" />;
  }

  useEffect(() => {
    const fetchAdmissionData = async () => {
      try {
        setLoading(true);
        const res = await api.get('/admissions');
        if (res.data && res.data.success) {
          setAdmissionData(res.data.data);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchAdmissionData();
  }, []);

  return (
    <div>
      <Breadcrumb 
        title="Admission Guidelines & Process" 
        subtitle="Step-by-step admission criteria, required documents, and application procedure for Academic Session 2026–2027."
        items={[{ label: 'Admissions' }]}
      />

      <section className="py-16 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          
          {loading ? (
            <div className="text-center py-12 text-slate-500 text-xs">Loading admission guidelines...</div>
          ) : (
            <div className="space-y-12">
              
              {/* Process steps */}
              <div className="bg-white p-8 rounded-2xl shadow-subtle border border-slate-200 space-y-6">
                <h3 className="text-2xl font-bold font-serif text-navy-900">4-Step Admission Process</h3>

                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                  {[
                    { step: '01', title: 'Submit Enquiry', desc: 'Fill online form or visit admissions desk' },
                    { step: '02', title: 'Campus Tour & Interaction', desc: 'Interactive session with academic counsellors' },
                    { step: '03', title: 'Document Verification', desc: 'Verify birth certificate and previous report card' },
                    { step: '04', title: 'Fee Payment & Confirmation', desc: 'Secure seat upon fee submission' },
                  ].map((s, idx) => (
                    <div key={idx} className="p-4 bg-slate-50 rounded-xl border border-slate-100 space-y-2">
                      <span className="text-xs font-bold text-gold-600 uppercase">Step {s.step}</span>
                      <h4 className="font-bold font-serif text-navy-900 text-sm">{s.title}</h4>
                      <p className="text-xs text-slate-500">{s.desc}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Documents & Eligibility */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="bg-white p-8 rounded-2xl shadow-subtle border border-slate-200 space-y-4">
                  <h4 className="text-lg font-bold font-serif text-navy-900 flex items-center gap-2">
                    <FileText className="w-5 h-5 text-gold-600" /> Required Documents
                  </h4>
                  <ul className="space-y-2.5 text-xs text-slate-600">
                    <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" /> Birth Certificate issued by Municipal Authority</li>
                    <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" /> 6 Recent Passport-Size Photographs of Candidate</li>
                    <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" /> Transfer Certificate (TC) from Previous School</li>
                    <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" /> Previous Academic Year Report Card & Marksheet</li>
                    <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" /> Aadhaar Card of Candidate & Parents</li>
                  </ul>
                </div>

                <div className="bg-navy-950 text-white p-8 rounded-2xl shadow-xl space-y-6 flex flex-col justify-between">
                  <div className="space-y-3">
                    <span className="text-xs font-semibold uppercase text-gold-400">Admissions Open 2026–2027</span>
                    <h4 className="text-2xl font-bold font-serif">Apply for Admission Today</h4>
                    <p className="text-xs text-slate-300">
                      Seats are allocated on a first-come, first-served merit basis. Submit your details online to reserve a campus interaction slot.
                    </p>
                  </div>
                  <button
                    onClick={openEnquiryModal}
                    className="w-full py-3.5 bg-gold-600 hover:bg-gold-700 text-white font-semibold text-xs rounded-xl shadow-gold transition"
                  >
                    Start Admission Enquiry
                  </button>
                </div>
              </div>

            </div>
          )}

        </div>
      </section>
    </div>
  );
};

export default Admissions;
