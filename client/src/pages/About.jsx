import React from 'react';
import Breadcrumb from '../components/Breadcrumb';
import PageUnavailable from '../components/PageUnavailable';
import { useSchool } from '../context/SchoolContext';
import { Award, ShieldCheck, HeartHandshake, Sparkles, BookOpen, Users, CheckCircle2 } from 'lucide-react';

const About = () => {
  const { profile, pageVisibility } = useSchool();

  if (pageVisibility.about === false) {
    return <PageUnavailable pageTitle="About Us" />;
  }

  const aboutSettings = profile.aboutSettings || {};

  return (
    <div>
      <Breadcrumb 
        title={aboutSettings.heading || "About Our Institution"} 
        subtitle={aboutSettings.subheading || "Discover our rich legacy, educational philosophy, vision, and commitment to holistic student growth."}
        items={[{ label: 'About Us' }]}
      />

      {/* Legacy & History Section */}
      <section className="py-16 lg:py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            
            <div className="lg:col-span-6 space-y-6">
              <span className="text-xs font-semibold uppercase tracking-wider text-gold-600">Established {profile.establishedYear}</span>
              <h2 className="text-3xl sm:text-4xl font-bold font-serif text-navy-900 leading-tight">
                {aboutSettings.heading || "A Quarter-Century of Shaping Global Leaders"}
              </h2>

              <p className="text-sm text-slate-600 leading-relaxed">
                {aboutSettings.description || `Founded with a visionary commitment to offer benchmarked education, ${profile.schoolName} has grown into a premier learning sanctuary.`}
              </p>

              {aboutSettings.history && (
                <p className="text-sm text-slate-600 leading-relaxed">
                  {aboutSettings.history}
                </p>
              )}

              <div className="grid grid-cols-2 gap-4 pt-4 border-t border-slate-100">
                <div>
                  <h4 className="text-2xl font-bold font-serif text-navy-900">{profile.establishedYear ? `${new Date().getFullYear() - parseInt(profile.establishedYear)}+ Years` : '28+ Years'}</h4>
                  <p className="text-xs text-slate-500">Academic Excellence</p>
                </div>
                <div>
                  <h4 className="text-2xl font-bold font-serif text-navy-900">100% Pass</h4>
                  <p className="text-xs text-slate-500">CBSE Board Results</p>
                </div>
              </div>
            </div>

            <div className="lg:col-span-6">
              <div className="rounded-2xl overflow-hidden shadow-2xl border-4 border-slate-100">
                <img 
                  src={aboutSettings.image || "https://images.unsplash.com/photo-1541829070764-84a7d30dd3f3?w=900&auto=format&fit=crop&q=80"} 
                  alt="School Campus" 
                  className="w-full h-80 sm:h-96 object-cover"
                />
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* Vision & Mission */}
      <section className="py-16 lg:py-24 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            
            <div className="bg-white p-8 rounded-2xl shadow-subtle border border-slate-100 space-y-4">
              <div className="w-12 h-12 rounded-xl bg-gold-100 text-gold-700 flex items-center justify-center">
                <Sparkles className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold font-serif text-navy-900">Our Vision</h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                {aboutSettings.vision || profile.vision}
              </p>
            </div>

            <div className="bg-white p-8 rounded-2xl shadow-subtle border border-slate-100 space-y-4">
              <div className="w-12 h-12 rounded-xl bg-navy-100 text-navy-900 flex items-center justify-center">
                <BookOpen className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold font-serif text-navy-900">Our Mission</h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                {aboutSettings.mission || profile.mission}
              </p>
            </div>

          </div>
        </div>
      </section>

      {/* Core Values */}
      <section className="py-16 lg:py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto space-y-3 mb-16">
            <span className="text-xs font-semibold uppercase tracking-wider text-gold-600">Guiding Pillars</span>
            <h2 className="text-3xl font-bold font-serif text-navy-900">Our Core Values</h2>
            <p className="text-sm text-slate-600">The foundational principles that shape our school culture and student character.</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {(profile.coreValues?.length > 0 ? profile.coreValues : [
              "Integrity & Moral Leadership",
              "Academic Rigor & Inquiry",
              "Diversity & Cultural Inclusivity",
              "Environmental Stewardship"
            ]).map((value, idx) => (
              <div key={idx} className="p-6 rounded-xl bg-slate-50 border border-slate-100 text-center space-y-3">
                <div className="w-10 h-10 rounded-full bg-navy-900 text-gold-400 font-bold font-serif flex items-center justify-center mx-auto text-sm">
                  0{idx + 1}
                </div>
                <h4 className="font-bold text-navy-900 font-serif text-base">{value}</h4>
              </div>
            ))}
          </div>
        </div>
      </section>

    </div>
  );
};

export default About;
