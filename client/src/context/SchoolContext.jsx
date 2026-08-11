import React, { createContext, useContext, useState, useEffect } from 'react';
import api, { FALLBACK_PROFILE } from '../services/api';

const SchoolContext = createContext();

export const SchoolProvider = ({ children }) => {
  const [profile, setProfile] = useState(FALLBACK_PROFILE);
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

  const fetchProfile = async () => {
    try {
      setLoading(true);
      const res = await api.get('/school');
      if (res.data && res.data.success && res.data.data) {
        const data = res.data.data;
        setProfile(data);
        if (data.homepageSections) setHomepageSections(prev => ({ ...prev, ...data.homepageSections }));
        if (data.pageVisibility) setPageVisibility(prev => ({ ...prev, ...data.pageVisibility }));
      }
    } catch (err) {
      console.warn('Using fallback school profile due to network/API state:', err.message);
      setProfile(FALLBACK_PROFILE);
    } finally {
      setLoading(false);
    }
  };

  const fetchAdmissionStatus = async () => {
    try {
      const res = await api.get('/admissions');
      if (res.data && res.data.success && res.data.data) {
        setAdmissionsOpen(res.data.data.isAdmissionsOpen);
      }
    } catch (err) {
      console.warn('Could not fetch admission status');
    }
  };

  useEffect(() => {
    fetchProfile();
    fetchAdmissionStatus();
  }, []);

  const openEnquiryModal = () => setEnquiryModalOpen(true);
  const closeEnquiryModal = () => setEnquiryModalOpen(false);

  return (
    <SchoolContext.Provider
      value={{
        profile,
        setProfile,
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
