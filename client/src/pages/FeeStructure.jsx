import React, { useState, useEffect } from 'react';
import Breadcrumb from '../components/Breadcrumb';
import PageUnavailable from '../components/PageUnavailable';
import api from '../services/api';
import { useSchool } from '../context/SchoolContext';
import { ShieldCheck, Lock, Phone, Mail, HelpCircle, CheckCircle2 } from 'lucide-react';

const FeeStructure = () => {
  const { profile, openEnquiryModal, pageVisibility } = useSchool();
  const [fees, setFees] = useState([]);
  const [isFeeVisible, setIsFeeVisible] = useState(true);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');

  if (pageVisibility.feeStructure === false) {
    return <PageUnavailable pageTitle="Fee Structure" />;
  }

  useEffect(() => {
    const fetchFees = async () => {
      try {
        setLoading(true);
        const res = await api.get('/fees');
        if (res.data && res.data.success) {
          setIsFeeVisible(res.data.feeVisibility !== false);
          setFees(res.data.data || []);
          if (res.data.message) setMessage(res.data.message);
        }
      } catch (err) {
        console.error('Failed to load fee structure:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchFees();
  }, []);

  return (
    <div>
      <Breadcrumb 
        title="Fee Structure & Admissions Expenses" 
        subtitle="Transparent financial information regarding tuition fees, lab charges, annual fees, and payment timelines."
        items={[{ label: 'Admissions', path: '/admissions' }, { label: 'Fee Structure' }]}
      />

      <section className="py-16 lg:py-24 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          {loading ? (
            <div className="text-center py-12 text-slate-500 text-sm">Loading fee schedule...</div>
          ) : !isFeeVisible ? (
            
            /* FEE IS HIDDEN BY SCHOOL ADMIN */
            <div className="max-w-2xl mx-auto bg-white rounded-2xl p-8 sm:p-12 shadow-elevated border border-slate-200 text-center space-y-6">
              <div className="w-16 h-16 bg-amber-100 text-amber-700 rounded-full flex items-center justify-center mx-auto">
                <Lock className="w-8 h-8" />
              </div>
              
              <div className="space-y-2">
                <h3 className="text-2xl font-bold font-serif text-navy-900">Fee Details Available Upon Request</h3>
                <p className="text-sm text-slate-600 leading-relaxed">
                  {message || 'The school administration has currently set the public fee table to direct enquiry mode. Please reach out to our admissions desk for complete prospectus and fee breakdown.'}
                </p>
              </div>

              <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 text-xs text-slate-600 flex flex-col sm:flex-row items-center justify-center gap-4">
                {profile.phone && (
                  <div className="flex items-center gap-2">
                    <Phone className="w-4 h-4 text-gold-600" />
                    <span>{profile.phone}</span>
                  </div>
                )}
                {profile.email && (
                  <div className="flex items-center gap-2">
                    <Mail className="w-4 h-4 text-gold-600" />
                    <span>{profile.email}</span>
                  </div>
                )}
              </div>

              <button
                onClick={openEnquiryModal}
                className="px-8 py-3.5 bg-navy-900 hover:bg-navy-800 text-white font-semibold text-xs rounded-xl shadow-lg transition"
              >
                Request Official Fee Structure Prospectus
              </button>
            </div>

          ) : (

            /* FEE TABLE IS PUBLICLY VISIBLE */
            <div className="space-y-12">
              <div className="bg-white rounded-2xl shadow-subtle border border-slate-200 overflow-hidden">
                <div className="p-6 bg-navy-950 text-white flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div>
                    <h3 className="text-lg font-bold font-serif">Academic Session 2026–2027 Approved Fee Schedule</h3>
                    <p className="text-xs text-slate-300">All figures are in Indian Rupees (₹). Monthly tuition is payable by the 10th of every month.</p>
                  </div>
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-gold-500/20 text-gold-400 border border-gold-500/30">
                    <ShieldCheck className="w-3.5 h-3.5" /> CBSE Standard
                  </span>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="bg-slate-100 text-navy-900 text-xs uppercase tracking-wider font-semibold border-b border-slate-200">
                        <th className="p-4">Class / Level</th>
                        <th className="p-4">Admission Fee (One-Time)</th>
                        <th className="p-4">Tuition Fee</th>
                        <th className="p-4">Annual Charges</th>
                        <th className="p-4">Special Lab / STEM Charges</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 text-xs text-slate-700">
                      {fees.map((row) => (
                        <tr key={row._id} className="hover:bg-slate-50 transition">
                          <td className="p-4 font-bold font-serif text-navy-900">{row.classGrade}</td>
                          <td className="p-4 font-semibold text-slate-900">{row.admissionFee}</td>
                          <td className="p-4 font-bold text-gold-700">{row.tuitionFee}</td>
                          <td className="p-4">{row.annualCharges}</td>
                          <td className="p-4 text-slate-500">{row.otherCharges || 'N/A'}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Payment Policy Notes */}
              <div className="bg-white p-6 rounded-2xl border border-slate-200 space-y-3">
                <h4 className="text-base font-bold font-serif text-navy-900 flex items-center gap-2">
                  <HelpCircle className="w-4 h-4 text-gold-600" /> Payment Terms & Guidelines
                </h4>
                <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs text-slate-600">
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                    <span>Tuition fee covers digital learning portal subscriptions and library access.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                    <span>Sibling discount: 10% waiver on tuition fee for the second child.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                    <span>Transport charges depend on distance routes and are billed quarterly.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                    <span>Fees can be paid online via NetBanking, UPI, or Demand Draft.</span>
                  </li>
                </ul>
              </div>
            </div>

          )}

        </div>
      </section>
    </div>
  );
};

export default FeeStructure;
