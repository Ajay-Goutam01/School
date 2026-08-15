import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import api, { FALLBACK_PROFILE } from '../services/api';

const SchoolContext = createContext();

export const SchoolProvider = ({ children }) => {
  const [profile, setProfile] = useState(null);
  const [homepageSections, setHomepageSections] = useState({
    hero: true,
    highlights: true,
    about: true,
    whyChooseUs: true,
    academics: true,
    courses: true,
    activities: true,
    facilities: true,
    principalMessage: true,
    achievements: true,
    news: true,
    gallery: true,
    admissionCta: true,
    contactPreview: true,
    footer: true
  });
  const [pageVisibility, setPageVisibility] = useState({
    about: true,
    academics: true,
    courses: true,
    activities: true,
    facilities: true,
    faculty: true,
    admissions: true,
    feeStructure: true,
    gallery: true,
    news: true,
    notices: true,
    contact: true
  });

  const [loading, setLoading] = useState(true);
  const [enquiryModalOpen, setEnquiryModalOpen] = useState(false);
  const [admissionsOpen, setAdmissionsOpen] = useState(true);

  const updateProfile = useCallback((updatedData) => {
    if (!updatedData) return;
    setProfile(prev => ({ ...(prev || FALLBACK_PROFILE), ...updatedData }));
    if (updatedData.homepageSections) {
      setHomepageSections(prev => ({ ...prev, ...updatedData.homepageSections }));
    }
    if (updatedData.pageVisibility) {
      setPageVisibility(prev => ({ ...prev, ...updatedData.pageVisibility }));
    }
  }, []);

  const fetchProfile = useCallback(async () => {
    try {
      setLoading(true);
      const res = await api.get('/school');
      if (res.data && res.data.success && res.data.data) {
        const data = res.data.data;
        setProfile(data);
        if (data.homepageSections) setHomepageSections(prev => ({ ...prev, ...data.homepageSections }));
        if (data.pageVisibility) setPageVisibility(prev => ({ ...prev, ...data.pageVisibility }));
      } else {
        setProfile(FALLBACK_PROFILE);
      }
    } catch (err) {
      console.warn('Using fallback school profile due to network/API state:', err.message);
      setProfile(FALLBACK_PROFILE);
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchAdmissionStatus = useCallback(async () => {
    try {
      const res = await api.get('/admissions');
      if (res.data && res.data.success && res.data.data) {
        setAdmissionsOpen(res.data.data.isAdmissionsOpen);
      }
    } catch (err) {
      console.warn('Could not fetch admission status');
    }
  }, []);

  useEffect(() => {
    fetchProfile();
    fetchAdmissionStatus();
  }, [fetchProfile, fetchAdmissionStatus]);

  const openEnquiryModal = () => setEnquiryModalOpen(true);
  const closeEnquiryModal = () => setEnquiryModalOpen(false);

  // During initial mount while waiting for the first fetch to complete, show a dedicated loading screen
  // instead of rendering children with stale fallback data
  if (loading && !profile) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-4">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-navy-900 border-t-gold-500 rounded-full animate-spin"></div>
          <p className="text-xs font-semibold tracking-wider text-slate-500 uppercase">Loading School Profile...</p>
        </div>
      </div>
    );
  }

  const safeProfile = profile || FALLBACK_PROFILE;

  return (
    <SchoolContext.Provider
      value={{
        profile: safeProfile,
        setProfile,
        updateProfile,
        homepageSections,
        pageVisibility,
        loading,
        fetchProfile,
        enquiryModalOpen,
        openEnquiryModal,
        closeEnquiryModal,
        admissionsOpen,
        setAdmissionsOpen
      }}
    >
      {children}
    </SchoolContext.Provider>
  );
};

export const useSchool = () => {
  const context = useContext(SchoolContext);
  if (!context) {
    throw new Error('useSchool must be used within a SchoolProvider');
  }
  return context;
};
