import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useSchool } from '../context/SchoolContext';
import { 
  Menu, X, ChevronDown, Phone, Mail, 
  GraduationCap, Award, BookOpen, Layers, ShieldCheck 
} from 'lucide-react';

const Navbar = () => {
  const { profile, openEnquiryModal, admissionsOpen, pageVisibility } = useSchool();
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [academicsOpen, setAcademicsOpen] = useState(false);
  const [admissionsDropdownOpen, setAdmissionsDropdownOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setMobileMenuOpen(false);
    setAcademicsOpen(false);
    setAdmissionsDropdownOpen(false);
  }, [location.pathname]);

  const isActive = (path) => location.pathname === path;

  // Helper check for page visibility
  const canShow = (key) => pageVisibility[key] !== false;

  return (
    <header className="sticky top-0 z-40 w-full transition-all duration-300">
      {/* Top Notification / Contact Ribbon */}
      <div className="bg-navy-950 text-slate-300 text-xs py-2 px-4 sm:px-8 border-b border-navy-800">
        <div className="max-w-7xl mx-auto flex flex-wrap justify-between items-center gap-2">
          <div className="flex items-center gap-4 flex-wrap">
            {profile.phone && (
              <a href={`tel:${profile.phone.replace(/[^0-9+]/g, '')}`} className="flex items-center gap-1.5 hover:text-white transition">
                <Phone className="w-3.5 h-3.5 text-gold-500" />
                <span>{profile.phone}</span>
              </a>
            )}
            {profile.email && (
              <a href={`mailto:${profile.email}`} className="hidden md:flex items-center gap-1.5 hover:text-white transition">
                <Mail className="w-3.5 h-3.5 text-gold-500" />
                <span>{profile.email}</span>
              </a>
            )}
          </div>

          <div className="flex items-center gap-3 ml-auto">
            {admissionsOpen && canShow('admissions') && (
              <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-gold-500/20 text-gold-400 border border-gold-500/30 animate-pulse">
                <span className="w-1.5 h-1.5 rounded-full bg-gold-400"></span>
                ADMISSIONS OPEN 2026–27
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Main Navigation Bar */}
      <nav className={`w-full transition-all duration-300 ${
        scrolled ? 'glass-nav shadow-lg py-3' : 'bg-white border-b border-slate-100 py-4'
      }`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
          
          {/* Logo & School Name */}
          <Link to="/" className="flex items-center gap-3 group">
            {profile.logo ? (
              <img 
                src={profile.logo} 
                alt={profile.schoolName}
                className="w-11 h-11 sm:w-12 sm:h-12 object-contain rounded-lg shadow-sm border border-slate-200 group-hover:scale-105 transition-transform" 
              />
            ) : (
              <div className="w-11 h-11 bg-navy-950 text-gold-400 font-bold font-serif flex items-center justify-center rounded-lg">
                {profile.schoolName.charAt(0)}
              </div>
            )}
            <div>
              <h1 className="text-base sm:text-lg lg:text-xl font-bold font-serif text-navy-900 leading-tight group-hover:text-gold-600 transition-colors">
                {profile.schoolName}
              </h1>
              <p className="text-[11px] sm:text-xs text-slate-500 tracking-wide font-medium hidden sm:block">
                {profile.board}
              </p>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <div className="hidden lg:flex items-center space-x-1 xl:space-x-2 text-sm font-medium">
            <Link 
              to="/" 
              className={`px-3 py-2 rounded-md transition-colors ${
                isActive('/') ? 'text-navy-900 bg-navy-50 font-semibold' : 'text-slate-700 hover:text-navy-900 hover:bg-slate-50'
              }`}
            >
              Home
            </Link>

            {canShow('about') && (
              <Link 
                to="/about" 
                className={`px-3 py-2 rounded-md transition-colors ${
                  isActive('/about') ? 'text-navy-900 bg-navy-50 font-semibold' : 'text-slate-700 hover:text-navy-900 hover:bg-slate-50'
                }`}
              >
                About
              </Link>
            )}

            {/* Academics Dropdown */}
            {(canShow('academics') || canShow('courses') || canShow('faculty')) && (
              <div 
                className="relative group"
                onMouseEnter={() => setAcademicsOpen(true)}
                onMouseLeave={() => setAcademicsOpen(false)}
              >
                <button 
                  className={`flex items-center gap-1 px-3 py-2 rounded-md transition-colors ${
                    isActive('/academics') || isActive('/courses') ? 'text-navy-900 bg-navy-50 font-semibold' : 'text-slate-700 hover:text-navy-900 hover:bg-slate-50'
                  }`}
                >
                  Academics
                  <ChevronDown className="w-4 h-4 text-slate-400 group-hover:rotate-180 transition-transform duration-200" />
                </button>

                {academicsOpen && (
                  <div className="absolute top-full left-0 w-56 bg-white rounded-xl shadow-xl border border-slate-100 py-2 mt-1 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
                    {canShow('academics') && (
                      <Link 
                        to="/academics" 
                        className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-slate-700 hover:bg-navy-50 hover:text-navy-900 font-medium"
                      >
                        <BookOpen className="w-4 h-4 text-gold-600" />
                        Curriculum & Levels
                      </Link>
                    )}
                    {canShow('courses') && (
                      <Link 
                        to="/courses" 
                        className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-slate-700 hover:bg-navy-50 hover:text-navy-900 font-medium"
                      >
                        <Layers className="w-4 h-4 text-gold-600" />
                        Courses & Programs
                      </Link>
                    )}
                    {canShow('faculty') && (
                      <Link 
                        to="/faculty" 
                        className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-slate-700 hover:bg-navy-50 hover:text-navy-900 font-medium"
                      >
                        <GraduationCap className="w-4 h-4 text-gold-600" />
                        Faculty & Mentors
                      </Link>
                    )}
                  </div>
                )}
              </div>
            )}

            {canShow('activities') && (
              <Link 
                to="/activities" 
                className={`px-3 py-2 rounded-md transition-colors ${
                  isActive('/activities') ? 'text-navy-900 bg-navy-50 font-semibold' : 'text-slate-700 hover:text-navy-900 hover:bg-slate-50'
                }`}
              >
                Activities
              </Link>
            )}

            {canShow('facilities') && (
              <Link 
                to="/facilities" 
                className={`px-3 py-2 rounded-md transition-colors ${
                  isActive('/facilities') ? 'text-navy-900 bg-navy-50 font-semibold' : 'text-slate-700 hover:text-navy-900 hover:bg-slate-50'
                }`}
              >
                Facilities
              </Link>
            )}

            {/* Admissions Dropdown */}
            {(canShow('admissions') || canShow('feeStructure')) && (
              <div 
                className="relative group"
                onMouseEnter={() => setAdmissionsDropdownOpen(true)}
                onMouseLeave={() => setAdmissionsDropdownOpen(false)}
              >
                <button 
                  className={`flex items-center gap-1 px-3 py-2 rounded-md transition-colors ${
                    isActive('/admissions') || isActive('/fee-structure') ? 'text-navy-900 bg-navy-50 font-semibold' : 'text-slate-700 hover:text-navy-900 hover:bg-slate-50'
                  }`}
                >
                  Admissions
                  <ChevronDown className="w-4 h-4 text-slate-400 group-hover:rotate-180 transition-transform duration-200" />
                </button>

                {admissionsDropdownOpen && (
                  <div className="absolute top-full left-0 w-60 bg-white rounded-xl shadow-xl border border-slate-100 py-2 mt-1 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
                    {canShow('admissions') && (
                      <Link 
                        to="/admissions" 
                        className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-slate-700 hover:bg-navy-50 hover:text-navy-900 font-medium"
                      >
                        <Award className="w-4 h-4 text-gold-600" />
                        Admission Guidelines
                      </Link>
                    )}
                    {canShow('feeStructure') && (
                      <Link 
                        to="/fee-structure" 
                        className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-slate-700 hover:bg-navy-50 hover:text-navy-900 font-medium"
                      >
                        <ShieldCheck className="w-4 h-4 text-gold-600" />
                        Fee Structure
                      </Link>
                    )}
                  </div>
                )}
              </div>
            )}

            {canShow('gallery') && (
              <Link 
                to="/gallery" 
                className={`px-3 py-2 rounded-md transition-colors ${
                  isActive('/gallery') ? 'text-navy-900 bg-navy-50 font-semibold' : 'text-slate-700 hover:text-navy-900 hover:bg-slate-50'
                }`}
              >
                Gallery
              </Link>
            )}

            {(canShow('news') || canShow('notices')) && (
              <Link 
                to="/news-events" 
                className={`px-3 py-2 rounded-md transition-colors ${
                  isActive('/news-events') || isActive('/notices') ? 'text-navy-900 bg-navy-50 font-semibold' : 'text-slate-700 hover:text-navy-900 hover:bg-slate-50'
                }`}
              >
                News & Notices
              </Link>
            )}

            {canShow('contact') && (
              <Link 
                to="/contact" 
                className={`px-3 py-2 rounded-md transition-colors ${
                  isActive('/contact') ? 'text-navy-900 bg-navy-50 font-semibold' : 'text-slate-700 hover:text-navy-900 hover:bg-slate-50'
                }`}
              >
                Contact
              </Link>
            )}
          </div>

          {/* Action CTA Button & Mobile Hamburger */}
          <div className="flex items-center gap-3">
            <button
              onClick={openEnquiryModal}
              className="hidden sm:inline-flex items-center justify-center px-4 py-2.5 rounded-lg text-xs lg:text-sm font-semibold text-white bg-gold-600 hover:bg-gold-700 transition shadow-gold hover:shadow-lg focus:ring-2 focus:ring-gold-500/50"
            >
              Admission Enquiry
            </button>

            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 rounded-lg text-slate-700 hover:text-navy-900 hover:bg-slate-100 focus:outline-none"
              aria-label="Toggle Navigation Menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex justify-end">
          <div className="w-4/5 max-w-sm bg-white h-full shadow-2xl flex flex-col p-6 overflow-y-auto animate-in slide-in-from-right duration-300">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <div className="flex items-center gap-2.5">
                {profile.logo && <img src={profile.logo} alt="Logo" className="w-8 h-8 object-contain" />}
                <span className="font-serif font-bold text-navy-900 text-sm truncate">{profile.schoolName}</span>
              </div>
              <button 
                onClick={() => setMobileMenuOpen(false)}
                className="p-1 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-100"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="flex flex-col py-4 space-y-1 text-sm font-medium">
              <Link to="/" className="px-3 py-2 rounded-lg text-slate-800 hover:bg-navy-50">Home</Link>
              {canShow('about') && <Link to="/about" className="px-3 py-2 rounded-lg text-slate-800 hover:bg-navy-50">About Us</Link>}
              {canShow('academics') && <Link to="/academics" className="px-3 py-2 rounded-lg text-slate-800 hover:bg-navy-50">Academics</Link>}
              {canShow('courses') && <Link to="/courses" className="px-3 py-2 rounded-lg text-slate-800 hover:bg-navy-50">Special Programs</Link>}
              {canShow('activities') && <Link to="/activities" className="px-3 py-2 rounded-lg text-slate-800 hover:bg-navy-50">Activities</Link>}
              {canShow('facilities') && <Link to="/facilities" className="px-3 py-2 rounded-lg text-slate-800 hover:bg-navy-50">Facilities</Link>}
              {canShow('faculty') && <Link to="/faculty" className="px-3 py-2 rounded-lg text-slate-800 hover:bg-navy-50">Faculty</Link>}
              {canShow('admissions') && <Link to="/admissions" className="px-3 py-2 rounded-lg text-slate-800 hover:bg-navy-50">Admissions</Link>}
              {canShow('feeStructure') && <Link to="/fee-structure" className="px-3 py-2 rounded-lg text-slate-800 hover:bg-navy-50">Fee Structure</Link>}
              {canShow('gallery') && <Link to="/gallery" className="px-3 py-2 rounded-lg text-slate-800 hover:bg-navy-50">Gallery</Link>}
              {canShow('news') && <Link to="/news-events" className="px-3 py-2 rounded-lg text-slate-800 hover:bg-navy-50">News & Events</Link>}
              {canShow('notices') && <Link to="/notices" className="px-3 py-2 rounded-lg text-slate-800 hover:bg-navy-50">Notice Board</Link>}
              {canShow('contact') && <Link to="/contact" className="px-3 py-2 rounded-lg text-slate-800 hover:bg-navy-50">Contact Us</Link>}
            </div>

            <div className="mt-auto pt-6 border-t border-slate-100 space-y-3">
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  openEnquiryModal();
                }}
                className="w-full py-3 rounded-lg text-sm font-semibold text-white bg-gold-600 hover:bg-gold-700 text-center shadow-gold"
              >
                Submit Admission Enquiry
              </button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};

export default Navbar;
