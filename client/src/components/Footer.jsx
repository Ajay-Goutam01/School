import React from 'react';
import { Link } from 'react-router-dom';
import { useSchool } from '../context/SchoolContext';
import { Phone, Mail, MapPin, Clock, Facebook, Twitter, Instagram, Youtube, Linkedin, ArrowRight } from 'lucide-react';

const Footer = () => {
  const { profile, pageVisibility } = useSchool();
  const currentYear = new Date().getFullYear();

  const canShow = (key) => pageVisibility[key] !== false;

  const social = profile.socialLinks || {};

  return (
    <footer className="bg-navy-950 text-slate-300 pt-16 pb-24 md:pb-12 border-t border-navy-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 lg:gap-12 pb-12 border-b border-navy-800/80">
          
          {/* Col 1: School Identity */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              {profile.logo && (
                <img 
                  src={profile.logo} 
                  alt={profile.schoolName} 
                  className="w-12 h-12 object-contain bg-white p-1 rounded-lg"
                />
              )}
              <div>
                <h3 className="text-lg font-bold font-serif text-white">{profile.schoolName}</h3>
                {profile.establishedYear && <p className="text-xs text-gold-400 font-medium">Est. {profile.establishedYear}</p>}
              </div>
            </div>

            <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
              {profile.tagline}. Dedicated to nurturing intellectual curiosity, ethical values, and holistic leadership in every child.
            </p>

            {/* Social Links */}
            <div className="flex items-center gap-3 pt-2">
              {social.facebook?.url && social.facebook?.isVisible !== false && (
                <a href={social.facebook.url} target="_blank" rel="noreferrer" className="w-8 h-8 rounded-full bg-navy-900 flex items-center justify-center text-slate-400 hover:text-gold-400 hover:bg-navy-800 transition">
                  <Facebook className="w-4 h-4" />
                </a>
              )}
              {social.twitter?.url && social.twitter?.isVisible !== false && (
                <a href={social.twitter.url} target="_blank" rel="noreferrer" className="w-8 h-8 rounded-full bg-navy-900 flex items-center justify-center text-slate-400 hover:text-gold-400 hover:bg-navy-800 transition">
                  <Twitter className="w-4 h-4" />
                </a>
              )}
              {social.instagram?.url && social.instagram?.isVisible !== false && (
                <a href={social.instagram.url} target="_blank" rel="noreferrer" className="w-8 h-8 rounded-full bg-navy-900 flex items-center justify-center text-slate-400 hover:text-gold-400 hover:bg-navy-800 transition">
                  <Instagram className="w-4 h-4" />
                </a>
              )}
              {social.youtube?.url && social.youtube?.isVisible !== false && (
                <a href={social.youtube.url} target="_blank" rel="noreferrer" className="w-8 h-8 rounded-full bg-navy-900 flex items-center justify-center text-slate-400 hover:text-gold-400 hover:bg-navy-800 transition">
                  <Youtube className="w-4 h-4" />
                </a>
              )}
              {social.linkedin?.url && social.linkedin?.isVisible !== false && (
                <a href={social.linkedin.url} target="_blank" rel="noreferrer" className="w-8 h-8 rounded-full bg-navy-900 flex items-center justify-center text-slate-400 hover:text-gold-400 hover:bg-navy-800 transition">
                  <Linkedin className="w-4 h-4" />
                </a>
              )}
            </div>
          </div>

          {/* Col 2: Quick Links */}
          <div>
            <h4 className="text-sm font-semibold uppercase tracking-wider text-white mb-4 border-l-2 border-gold-500 pl-2">
              Quick Navigation
            </h4>
            <ul className="space-y-2.5 text-xs sm:text-sm">
              <li><Link to="/" className="hover:text-gold-400 transition flex items-center gap-1.5"><ArrowRight className="w-3 h-3 text-gold-500" /> Home</Link></li>
              {canShow('about') && <li><Link to="/about" className="hover:text-gold-400 transition flex items-center gap-1.5"><ArrowRight className="w-3 h-3 text-gold-500" /> About Us</Link></li>}
              {canShow('academics') && <li><Link to="/academics" className="hover:text-gold-400 transition flex items-center gap-1.5"><ArrowRight className="w-3 h-3 text-gold-500" /> Academics</Link></li>}
              {canShow('admissions') && <li><Link to="/admissions" className="hover:text-gold-400 transition flex items-center gap-1.5"><ArrowRight className="w-3 h-3 text-gold-500" /> Admissions</Link></li>}
              {canShow('gallery') && <li><Link to="/gallery" className="hover:text-gold-400 transition flex items-center gap-1.5"><ArrowRight className="w-3 h-3 text-gold-500" /> Gallery</Link></li>}
              {canShow('contact') && <li><Link to="/contact" className="hover:text-gold-400 transition flex items-center gap-1.5"><ArrowRight className="w-3 h-3 text-gold-500" /> Contact Us</Link></li>}
            </ul>
          </div>

          {/* Col 3: Campus & Programs */}
          <div>
            <h4 className="text-sm font-semibold uppercase tracking-wider text-white mb-4 border-l-2 border-gold-500 pl-2">
              Campus & Programs
            </h4>
            <ul className="space-y-2.5 text-xs sm:text-sm">
              {canShow('courses') && <li><Link to="/courses" className="hover:text-gold-400 transition flex items-center gap-1.5"><ArrowRight className="w-3 h-3 text-gold-500" /> Special Programs</Link></li>}
              {canShow('activities') && <li><Link to="/activities" className="hover:text-gold-400 transition flex items-center gap-1.5"><ArrowRight className="w-3 h-3 text-gold-500" /> Sports & Activities</Link></li>}
              {canShow('facilities') && <li><Link to="/facilities" className="hover:text-gold-400 transition flex items-center gap-1.5"><ArrowRight className="w-3 h-3 text-gold-500" /> Infrastructure & Labs</Link></li>}
              {canShow('faculty') && <li><Link to="/faculty" className="hover:text-gold-400 transition flex items-center gap-1.5"><ArrowRight className="w-3 h-3 text-gold-500" /> Teaching Faculty</Link></li>}
              {canShow('feeStructure') && <li><Link to="/fee-structure" className="hover:text-gold-400 transition flex items-center gap-1.5"><ArrowRight className="w-3 h-3 text-gold-500" /> Fee Structure</Link></li>}
              {canShow('news') && <li><Link to="/news-events" className="hover:text-gold-400 transition flex items-center gap-1.5"><ArrowRight className="w-3 h-3 text-gold-500" /> News & Events</Link></li>}
              {canShow('notices') && <li><Link to="/notices" className="hover:text-gold-400 transition flex items-center gap-1.5"><ArrowRight className="w-3 h-3 text-gold-500" /> Notice Board</Link></li>}
            </ul>
          </div>

          {/* Col 4: Contact Info */}
          <div>
            <h4 className="text-sm font-semibold uppercase tracking-wider text-white mb-4 border-l-2 border-gold-500 pl-2">
              Get In Touch
            </h4>
            <div className="space-y-3 text-xs sm:text-sm">
              {profile.address && (
                <div className="flex items-start gap-2.5">
                  <MapPin className="w-4 h-4 text-gold-500 shrink-0 mt-1" />
                  <span className="text-slate-300 leading-normal">{profile.address}</span>
                </div>
              )}
              {profile.phone && (
                <div className="flex items-center gap-2.5">
                  <Phone className="w-4 h-4 text-gold-500 shrink-0" />
                  <span className="text-slate-300">{profile.phone}</span>
                </div>
              )}
              {profile.email && (
                <div className="flex items-center gap-2.5">
                  <Mail className="w-4 h-4 text-gold-500 shrink-0" />
                  <span className="text-slate-300">{profile.email}</span>
                </div>
              )}
              {profile.officeHours && (
                <div className="flex items-start gap-2.5 pt-1">
                  <Clock className="w-4 h-4 text-gold-500 shrink-0 mt-0.5" />
                  <span className="text-slate-400 text-xs">{profile.officeHours}</span>
                </div>
              )}
            </div>
          </div>

        </div>

        {/* Footer Bottom Bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-400 text-center sm:text-left">
          <p>© {currentYear} {profile.schoolName}. All Rights Reserved.</p>
          {profile.board && <p className="text-slate-400">Affiliation: {profile.board}</p>}
        </div>
      </div>
    </footer>
  );
};

export default Footer;
