import React from 'react';
import { useSchool } from '../context/SchoolContext';
import { Phone, MessageSquare, ClipboardList } from 'lucide-react';

const MobileStickyBar = () => {
  const { profile, openEnquiryModal } = useSchool();

  const handleCall = () => {
    window.location.href = `tel:${profile.phone.replace(/[^0-9+]/g, '')}`;
  };

  const handleWhatsApp = () => {
    const cleanNumber = (profile.whatsapp || profile.phone).replace(/[^0-9]/g, '');
    const message = encodeURIComponent(`Hello ${profile.schoolName}, I would like to inquire about admissions.`);
    window.open(`https://wa.me/${cleanNumber}?text=${message}`, '_blank');
  };

  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-navy-950/95 backdrop-blur-md border-t border-navy-800 p-2 shadow-2xl">
      <div className="grid grid-cols-3 gap-2 text-center text-xs font-semibold">
        {/* Call Action */}
        <button
          onClick={handleCall}
          className="flex flex-col items-center justify-center py-2 px-1 rounded-lg bg-navy-900 text-slate-100 hover:bg-navy-800 active:scale-95 transition"
        >
          <Phone className="w-4 h-4 text-gold-400 mb-0.5" />
          <span>Call</span>
        </button>

        {/* WhatsApp Action */}
        <button
          onClick={handleWhatsApp}
          className="flex flex-col items-center justify-center py-2 px-1 rounded-lg bg-emerald-700/80 text-white hover:bg-emerald-600 active:scale-95 transition"
        >
          <MessageSquare className="w-4 h-4 text-white mb-0.5" />
          <span>WhatsApp</span>
        </button>

        {/* Enquire Action */}
        <button
          onClick={openEnquiryModal}
          className="flex flex-col items-center justify-center py-2 px-1 rounded-lg bg-gold-600 text-white hover:bg-gold-700 active:scale-95 transition shadow-gold"
        >
          <ClipboardList className="w-4 h-4 text-white mb-0.5" />
          <span>Enquire</span>
        </button>
      </div>
    </div>
  );
};

export default MobileStickyBar;
