import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useSchool } from '../context/SchoolContext';
import api, { FALLBACK_PROFILE } from '../services/api';
import { getOptimizedImageUrl } from '../utils/imageKit';
import { 
  Award, Users, GraduationCap, Trophy, ArrowRight, CheckCircle2, 
  BookOpen, Sparkles, ShieldCheck, HeartHandshake, ChevronRight, 
  MapPin, Phone, Mail, Calendar, ExternalLink
} from 'lucide-react';

const Home = () => {
  const { profile, openEnquiryModal, admissionsOpen, homepageSections, pageVisibility } = useSchool();
  const [academics, setAcademics] = useState([]);
  const [courses, setCourses] = useState([]);
  const [activities, setActivities] = useState([]);
  const [facilities, setFacilities] = useState([]);
  const [news, setNews] = useState([]);
  const [gallery, setGallery] = useState([]);
  const [achievements, setAchievements] = useState([]);
  const [principal, setPrincipal] = useState(null);

  const sections = homepageSections || {};
  const canShowPage = (key) => pageVisibility[key] !== false;

  useEffect(() => {
    document.title = `${profile.schoolName} | ${profile.tagline || 'Excellence in Education'}`;
  }, [profile]);

  useEffect(() => {
    const fetchHomeData = async () => {
      try {
        const [acadRes, crsRes, actRes, facRes, newsRes, galRes, facuRes, achRes] = await Promise.allSettled([
          api.get('/academics'),
          api.get('/courses'),
          api.get('/activities'),
          api.get('/facilities'),
          api.get('/news?limit=3'),
          api.get('/gallery'),
          api.get('/faculty'),
          api.get('/achievements')
        ]);

        if (acadRes.status === 'fulfilled' && acadRes.value.data?.success) setAcademics(acadRes.value.data.data);
        if (crsRes.status === 'fulfilled' && crsRes.value.data?.success) setCourses(crsRes.value.data.data.slice(0, 4));
        if (actRes.status === 'fulfilled' && actRes.value.data?.success) setActivities(actRes.value.data.data.slice(0, 4));
        if (facRes.status === 'fulfilled' && facRes.value.data?.success) setFacilities(facRes.value.data.data.slice(0, 6));
        if (newsRes.status === 'fulfilled' && newsRes.value.data?.success) setNews(newsRes.value.data.data);
        if (galRes.status === 'fulfilled' && galRes.value.data?.success) setGallery(galRes.value.data.data.slice(0, 6));
        if (achRes.status === 'fulfilled' && achRes.value.data?.success) setAchievements(achRes.value.data.data);

        if (facuRes.status === 'fulfilled' && facuRes.value.data?.success) {
          const leader = facuRes.value.data.data.find(f => f.isLeadership || f.role.includes('Principal'));
          if (leader) setPrincipal(leader);
        }
      } catch (err) {
        console.warn('Home page data loaded with fallback defaults:', err);
      }
    };

    fetchHomeData();
  }, []);

  const hero = profile.heroSettings || {};
  const aboutSettings = profile.aboutSettings || {};

  return (
    <div className="w-full">
      
      {/* 1. HERO SECTION */}
      {sections.hero !== false && hero.isVisible !== false && (
        <section className="relative min-h-[85vh] flex items-center bg-navy-950 text-white overflow-hidden">
          <div 
            className="absolute inset-0 bg-cover bg-center scale-105 transition-transform duration-10000 opacity-40"
            style={{ backgroundImage: `url(${getOptimizedImageUrl(hero.image || profile.heroImage || FALLBACK_PROFILE.heroImage, 1600, 900)})` }}
          />
          <div className="absolute inset-0 hero-overlay" />

          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-28 relative z-10 w-full">
            <div className="max-w-3xl space-y-6">
              
              {admissionsOpen && (
                <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold bg-gold-500/20 text-gold-300 border border-gold-500/40">
                  <Sparkles className="w-4 h-4 text-gold-400" />
                  <span>{hero.subtitle || "ADMISSIONS OPEN FOR ACADEMIC YEAR 2026–2027"}</span>
                </div>
              )}

              <h1 className="text-3xl sm:text-5xl lg:text-6xl font-bold font-serif leading-tight tracking-tight text-white">
                {hero.title || profile.heroTitle || "Empowering Minds, Shaping Bright Futures"}
              </h1>

              <p className="text-base sm:text-lg text-slate-300 leading-relaxed font-light">
                {hero.description || profile.heroSubtitle || profile.tagline}
              </p>

              <div className="pt-4 flex flex-wrap gap-4 items-center">
                <button
                  onClick={openEnquiryModal}
                  className="px-6 py-3.5 rounded-xl font-semibold text-sm text-white bg-gold-600 hover:bg-gold-700 transition shadow-gold hover:shadow-xl flex items-center gap-2"
                >
                  <span>{hero.primaryBtnText || "Admission Enquiry"}</span>
                  <ArrowRight className="w-4 h-4" />
                </button>

                {canShowPage('about') && (
                  <Link
                    to={hero.secondaryBtnLink || "/about"}
                    className="px-6 py-3.5 rounded-xl font-semibold text-sm text-slate-200 bg-white/10 hover:bg-white/20 border border-white/20 transition flex items-center gap-2"
                  >
                    <span>{hero.secondaryBtnText || "Explore Our School"}</span>
                    <ChevronRight className="w-4 h-4" />
                  </Link>
                )}
              </div>

              <div className="pt-8 flex flex-wrap items-center gap-6 text-xs font-medium text-slate-300 border-t border-slate-700/50">
                {profile.board && (
                  <span className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-gold-400" /> {profile.board}
                  </span>
                )}
                <span className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-gold-400" /> 100% Academic Excellence
                </span>
              </div>

            </div>
          </div>
        </section>
      )}

      {/* 2. SCHOOL HIGHLIGHTS / STATS */}
      {sections.highlights !== false && (
        <section className="bg-white py-10 border-b border-slate-100 relative -mt-6 z-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 bg-navy-900 rounded-2xl p-6 sm:p-8 text-white shadow-xl border border-navy-800">
            {(profile.highlights && profile.highlights.length > 0 ? profile.highlights.filter(h => h.isVisible !== false) : [
              { label: "Years of Excellence", value: "28+", icon: "Award" },
              { label: "Enrolled Students", value: "1,850+", icon: "Users" },
              { label: "Qualified Faculty", value: "95+", icon: "GraduationCap" },
              { label: "Activities & Sports", value: "35+", icon: "Trophy" }
            ]).map((item, idx) => (
              <div key={idx} className="flex items-center gap-4 p-3 rounded-xl bg-navy-800/50 border border-navy-700/50">
                <div className="w-12 h-12 rounded-xl bg-gold-500/20 text-gold-400 flex items-center justify-center shrink-0">
                  {idx === 0 && <Award className="w-6 h-6" />}
                  {idx === 1 && <Users className="w-6 h-6" />}
                  {idx === 2 && <GraduationCap className="w-6 h-6" />}
                  {idx >= 3 && <Trophy className="w-6 h-6" />}
                </div>
                <div>
                  <div className="text-2xl sm:text-3xl font-bold font-serif text-white tracking-tight">{item.value}</div>
                  <div className="text-xs text-slate-300 font-medium">{item.label}</div>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* 3. WELCOME / ABOUT PREVIEW */}
      {sections.about !== false && (
        <section className="py-16 lg:py-24 bg-slate-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
              
              <div className="lg:col-span-6 space-y-6">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-navy-100 text-navy-900">
                  <BookOpen className="w-3.5 h-3.5 text-gold-600" />
                  <span>WELCOME TO {profile.schoolName.toUpperCase()}</span>
                </div>

                <h2 className="text-3xl sm:text-4xl font-bold font-serif text-navy-900 leading-tight">
                  {aboutSettings.heading || "Nurturing Tomorrow's Visionaries with Academic Rigor & Integrity"}
                </h2>

                <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
                  {aboutSettings.description || `Established in ${profile.establishedYear}, ${profile.schoolName} has stood as a beacon of educational distinction.`}
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                  <div className="p-4 bg-white rounded-xl shadow-subtle border border-slate-100">
                    <h4 className="font-semibold text-navy-900 text-sm mb-1">Our Vision</h4>
                    <p className="text-xs text-slate-600 line-clamp-3">{aboutSettings.vision || profile.vision}</p>
                  </div>

                  <div className="p-4 bg-white rounded-xl shadow-subtle border border-slate-100">
                    <h4 className="font-semibold text-navy-900 text-sm mb-1">Our Mission</h4>
                    <p className="text-xs text-slate-600 line-clamp-3">{aboutSettings.mission || profile.mission}</p>
                  </div>
                </div>

                {canShowPage('about') && (
                  <div className="pt-2">
                    <Link
                      to="/about"
                      className="inline-flex items-center gap-2 text-sm font-semibold text-navy-900 hover:text-gold-600 transition"
                    >
                      <span>Learn More About Our Heritage</span>
                      <ArrowRight className="w-4 h-4" />
                    </Link>
                  </div>
                )}

              </div>

              <div className="lg:col-span-6 relative">
                <div className="relative z-10 rounded-2xl overflow-hidden shadow-elevated border-4 border-white">
                  <img 
                    src={getOptimizedImageUrl(aboutSettings.image || "https://images.unsplash.com/photo-1580582932707-520aed937b7b?w=800&auto=format&fit=crop&q=80", 800, 500)} 
                    alt="School Learning Environment" 
                    loading="lazy"
                    className="w-full h-96 sm:h-[450px] object-cover"
                  />
                </div>
              </div>

            </div>
          </div>
        </section>
      )}

      {/* 4. WHY CHOOSE US */}
      {sections.whyChooseUs !== false && (
        <section className="py-16 lg:py-24 bg-white border-t border-slate-100">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-2xl mx-auto space-y-3 mb-16">
              <span className="text-xs font-semibold uppercase tracking-wider text-gold-600">Institutional Strengths</span>
              <h2 className="text-3xl font-bold font-serif text-navy-900">Why Parents Trust {profile.shortName || profile.schoolName}</h2>
              <p className="text-sm text-slate-600">Providing an environment where academic curiosity thrives alongside character and safety.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {(aboutSettings.whyChooseUs?.length > 0 ? aboutSettings.whyChooseUs.filter(c => c.isVisible !== false) : [
                { title: "Experienced Faculty", description: "95+ certified educators with master degrees and continuous international training." },
                { title: "Smart Classrooms", description: "Interactive HD touch panels, digital content suites, and climate-controlled rooms." },
                { title: "Safe 25-Acre Campus", description: "24/7 CCTV surveillance, RFID gate access, and trained security personnel." },
                { title: "Holistic Development", description: "Combines robotics, performing arts, sports leagues, and public speaking." }
              ]).map((item, idx) => (
                <div key={idx} className="p-6 bg-slate-50 rounded-2xl hover:shadow-lg transition-all duration-300 border border-slate-100 group">
                  <div className="w-12 h-12 rounded-xl bg-navy-900 text-gold-400 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                    <Sparkles className="w-6 h-6" />
                  </div>
                  <h3 className="text-base font-bold font-serif text-navy-900 mb-2">{item.title}</h3>
                  <p className="text-xs text-slate-600 leading-relaxed">{item.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* 5. ACADEMICS & CURRICULUM OVERVIEW */}
      {sections.academics !== false && canShowPage('academics') && (
        <section className="py-16 lg:py-24 bg-slate-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4">
              <div>
                <span className="text-xs font-semibold uppercase tracking-wider text-gold-600">Learning Pathway</span>
                <h2 className="text-3xl font-bold font-serif text-navy-900 mt-1">Academic Divisions</h2>
              </div>
              <Link to="/academics" className="inline-flex items-center gap-1.5 text-sm font-semibold text-navy-900 hover:text-gold-600 transition">
                <span>View Full Curriculum</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {(academics.length > 0 ? academics.slice(0, 3) : [
                { category: 'Pre-Primary', grades: 'Nursery – UKG', description: 'Montessori play-based foundation focusing on sensory learning, motor skills, and creative confidence.' },
                { category: 'Primary & Middle', grades: 'Classes 1 – 8', description: 'Inquiry-centric learning in STEM, languages, social studies, and introductory coding.' },
                { category: 'Secondary & Sr. Secondary', grades: 'Classes 9 – 12', description: 'Rigorous CBSE board preparation with specialized streams in Science, Commerce, and Humanities.' }
              ]).map((level, idx) => (
                <div key={idx} className="bg-white rounded-2xl p-6 shadow-subtle border border-slate-100 hover:border-gold-500/40 transition">
                  <span className="px-3 py-1 text-[11px] font-semibold rounded-full bg-gold-100 text-gold-800">
                    {level.grades}
                  </span>
                  <h3 className="text-lg font-bold font-serif text-navy-900 mt-3 mb-2">{level.category}</h3>
                  <p className="text-xs text-slate-600 leading-relaxed mb-4">{level.description}</p>
                  <Link to="/academics" className="text-xs font-semibold text-navy-900 hover:text-gold-600 inline-flex items-center gap-1">
                    Read Details <ChevronRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* 6. PRINCIPAL / DIRECTOR MESSAGE */}
      {sections.principalMessage !== false && principal && (
        <section className="py-16 lg:py-24 bg-navy-950 text-white relative">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
              
              <div className="lg:col-span-5">
                <div className="relative rounded-2xl overflow-hidden border-2 border-gold-500/30 shadow-2xl">
                  <img 
                    src={getOptimizedImageUrl(principal.photo || "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=800&auto=format&fit=crop&q=80", 600, 600)} 
                    alt={principal.name}
                    loading="lazy"
                    className="w-full h-80 sm:h-96 object-cover" 
                  />
                  <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-navy-950 to-transparent">
                    <h4 className="text-lg font-bold font-serif text-white">{principal.name}</h4>
                    <p className="text-xs text-gold-400 font-medium">{principal.role}</p>
                  </div>
                </div>
              </div>

              <div className="lg:col-span-7 space-y-4">
                <span className="text-xs font-semibold uppercase tracking-wider text-gold-400">Leadership Address</span>
                <h2 className="text-3xl font-bold font-serif leading-tight text-white">
                  "We do not merely teach; we awaken the lifelong desire to learn and excel."
                </h2>
                <p className="text-sm text-slate-300 leading-relaxed italic">
                  "{principal.message || "Education here is an inspiring partnership between dedicated teachers, ambitious students, and supportive parents."}"
                </p>
                {canShowPage('faculty') && (
                  <div className="pt-4">
                    <Link to="/faculty" className="inline-flex items-center gap-2 text-xs font-semibold text-gold-400 hover:text-gold-300">
                      <span>Meet Our Leadership & Faculty Team</span>
                      <ArrowRight className="w-4 h-4" />
                    </Link>
                  </div>
                )}
              </div>

            </div>
          </div>
        </section>
      )}

      {/* 7. ACHIEVEMENTS SECTION */}
      {sections.achievements !== false && achievements.length > 0 && (
        <section className="py-16 bg-white border-b border-slate-100">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
            <div className="text-center max-w-2xl mx-auto space-y-2">
              <span className="text-xs font-semibold uppercase tracking-wider text-gold-600">Excellence & Honors</span>
              <h2 className="text-3xl font-bold font-serif text-navy-900">Recent School Achievements</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {achievements.map((ach, idx) => (
                <div key={idx} className="bg-slate-50 rounded-2xl p-6 border border-slate-200 space-y-3">
                  {ach.image && (
                    <img 
                      src={getOptimizedImageUrl(ach.image, 600, 350)} 
                      alt={ach.title} 
                      loading="lazy"
                      className="w-full h-40 object-cover rounded-xl" 
                    />
                  )}
                  <span className="text-[10px] font-bold text-gold-600 uppercase">{ach.category}</span>
                  <h3 className="text-base font-bold font-serif text-navy-900">{ach.title}</h3>
                  <p className="text-xs text-slate-600 line-clamp-2">{ach.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* 8. FACILITIES PREVIEW */}
      {sections.facilities !== false && canShowPage('facilities') && (
        <section className="py-16 lg:py-24 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-2xl mx-auto space-y-3 mb-16">
              <span className="text-xs font-semibold uppercase tracking-wider text-gold-600">World-Class Infrastructure</span>
              <h2 className="text-3xl font-bold font-serif text-navy-900">Campus Facilities</h2>
              <p className="text-sm text-slate-600">Designed to inspire innovation, athletics, safety, and creative expression.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {(facilities.length > 0 ? facilities : [
                { title: 'Smart Classrooms', image: 'https://images.unsplash.com/photo-1509062522246-3755977927d7?w=800&auto=format&fit=crop&q=80', description: 'Interactive touch panels and climate control in every section.' },
                { title: 'Advanced Science Labs', image: 'https://images.unsplash.com/photo-1532094349884-543bc11b234d?w=800&auto=format&fit=crop&q=80', description: 'Physics, Chemistry, and AI robotics research workstations.' },
                { title: 'Central Library Hub', image: 'https://images.unsplash.com/photo-1521587760476-6c12a4b040da?w=800&auto=format&fit=crop&q=80', description: 'Over 25,000 physical titles and e-reader terminals.' }
              ]).map((fac, idx) => (
                <div key={idx} className="group rounded-2xl overflow-hidden bg-slate-50 border border-slate-100 shadow-subtle hover:shadow-xl transition-all duration-300">
                  <div className="h-48 overflow-hidden relative">
                    <img 
                      src={getOptimizedImageUrl(fac.image, 600, 400)} 
                      alt={fac.title} 
                      loading="lazy"
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
                    />
                  </div>
                  <div className="p-5">
                    <h3 className="text-base font-bold font-serif text-navy-900 mb-1">{fac.title}</h3>
                    <p className="text-xs text-slate-600 line-clamp-2">{fac.description}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="text-center mt-12">
              <Link to="/facilities" className="inline-flex items-center gap-2 px-6 py-3 rounded-xl font-semibold text-xs text-navy-900 bg-slate-100 hover:bg-slate-200 transition">
                <span>Explore All Facilities</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* 9. NEWS & EVENTS TICKER */}
      {sections.news !== false && canShowPage('news') && news.length > 0 && (
        <section className="py-16 bg-slate-50 border-t border-slate-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center mb-8">
              <div>
                <span className="text-xs font-semibold uppercase tracking-wider text-gold-600">Updates</span>
                <h2 className="text-2xl font-bold font-serif text-navy-900">Latest News & Campus Events</h2>
              </div>
              <Link to="/news-events" className="text-xs font-semibold text-navy-900 hover:text-gold-600">View All</Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {news.map((item, idx) => (
                <div key={idx} className="bg-white rounded-xl p-5 shadow-subtle border border-slate-100 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between text-[11px] text-slate-400 mb-2">
                      <span className="font-semibold text-gold-600 uppercase">{item.category}</span>
                      <span>{new Date(item.date).toLocaleDateString()}</span>
                    </div>
                    <h3 className="text-sm font-bold text-navy-900 mb-2 line-clamp-2">{item.title}</h3>
                    <p className="text-xs text-slate-600 line-clamp-3">{item.description}</p>
                  </div>
                  <Link to="/news-events" className="mt-4 text-xs font-semibold text-navy-900 hover:text-gold-600 inline-flex items-center gap-1">
                    Read Story <ChevronRight className="w-3 h-3" />
                  </Link>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* 10. ADMISSIONS CTA BANNER */}
      {sections.admissionCta !== false && (
        <section className="py-16 bg-gradient-to-r from-navy-950 via-navy-900 to-navy-950 text-white relative overflow-hidden">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10 space-y-6">
            <span className="px-3 py-1 rounded-full text-xs font-semibold bg-gold-500/20 text-gold-400 border border-gold-500/30">
              BEGIN THE JOURNEY
            </span>
            <h2 className="text-3xl sm:text-4xl font-bold font-serif">
              Give Your Child the Advantage of Excellence
            </h2>
            <p className="text-sm text-slate-300 max-w-xl mx-auto">
              Admissions for session are currently underway. Connect with our admissions desk or schedule a campus tour.
            </p>
            <div className="pt-2 flex justify-center gap-4 flex-wrap">
              <button
                onClick={openEnquiryModal}
                className="px-8 py-3.5 rounded-xl font-semibold text-sm text-white bg-gold-600 hover:bg-gold-700 transition shadow-gold"
              >
                Apply / Enquire Now
              </button>
              {canShowPage('admissions') && (
                <Link
                  to="/admissions"
                  className="px-8 py-3.5 rounded-xl font-semibold text-sm text-slate-200 bg-white/10 hover:bg-white/20 border border-white/20 transition"
                >
                  Admission Guidelines
                </Link>
              )}
            </div>
          </div>
        </section>
      )}

    </div>
  );
};

export default Home;
