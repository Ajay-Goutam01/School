import React from 'react';
import { Link } from 'react-router-dom';
import Breadcrumb from './Breadcrumb';
import { AlertCircle, ArrowLeft, Phone } from 'lucide-react';
import { useSchool } from '../context/SchoolContext';

const PageUnavailable = ({ pageTitle = "Page Unavailable" }) => {
  const { profile } = useSchool();

  return (
    <div>
      <Breadcrumb title={pageTitle} items={[{ label: pageTitle }]} />
      <div className="py-20 bg-slate-50">
        <div className="max-w-md mx-auto bg-white p-8 rounded-2xl shadow-subtle border border-slate-200 text-center space-y-4">
          <div className="w-14 h-14 bg-amber-100 text-amber-700 rounded-full flex items-center justify-center mx-auto">
            <AlertCircle className="w-8 h-8" />
          </div>
          <h2 className="text-2xl font-bold font-serif text-slate-900">Page Temporarily Offline</h2>
          <p className="text-xs text-slate-600 leading-relaxed">
            This section of the website is currently set to offline mode by the school administration. Please contact the school office for information.
          </p>
          <div className="pt-2 flex justify-center gap-3">
            <Link to="/" className="px-5 py-2.5 bg-navy-900 text-white text-xs font-semibold rounded-xl flex items-center gap-1.5">
              <ArrowLeft className="w-3.5 h-3.5" /> Back to Home
            </Link>
            {profile.phone && (
              <a href={`tel:${profile.phone.replace(/[^0-9+]/g, '')}`} className="px-5 py-2.5 bg-slate-100 text-slate-800 text-xs font-semibold rounded-xl flex items-center gap-1.5">
                <Phone className="w-3.5 h-3.5" /> Call Office
              </a>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PageUnavailable;
