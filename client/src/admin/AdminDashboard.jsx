import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';
import { 
  Mail, Newspaper, Bell, Image as GalleryIcon, GraduationCap, 
  Building, ShieldCheck, Plus, ArrowRight, Sparkles 
} from 'lucide-react';

const AdminDashboard = () => {
  const [stats, setStats] = useState({
    totalEnquiries: 0,
    newEnquiries: 0,
    publishedNews: 0,
    activeNotices: 0,
    galleryCount: 0,
    facultyCount: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setLoading(true);
        const res = await api.get('/school/dashboard-stats');
        if (res.data && res.data.success) {
          setStats(res.data.data);
        }
      } catch (err) {
        console.error('Failed to load dashboard stats:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold font-serif text-slate-900">School CMS Administrative Dashboard</h1>
        <p className="text-xs text-slate-500">Overview of website content statistics, parent enquiries, and quick content management shortcuts.</p>
      </div>

      {/* QUICK ACTIONS BAR */}
      <div className="bg-white p-6 rounded-2xl shadow-subtle border border-slate-200 space-y-3">
        <h3 className="text-sm font-bold font-serif text-slate-900 flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-gold-600" />
          Quick Staff Shortcuts
        </h3>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          {[
            { label: 'Post Notice', path: '/admin/notices', icon: Bell, bg: 'bg-amber-50 text-amber-900 border-amber-200' },
            { label: 'Publish News', path: '/admin/news', icon: Newspaper, bg: 'bg-blue-50 text-blue-900 border-blue-200' },
            { label: 'Upload Photo', path: '/admin/gallery', icon: GalleryIcon, bg: 'bg-emerald-50 text-emerald-900 border-emerald-200' },
            { label: 'Add Faculty', path: '/admin/faculty', icon: GraduationCap, bg: 'bg-purple-50 text-purple-900 border-purple-200' },
            { label: 'School Profile', path: '/admin/profile', icon: Building, bg: 'bg-slate-100 text-slate-900 border-slate-200' },
            { label: 'Manage Fees', path: '/admin/fees', icon: ShieldCheck, bg: 'bg-gold-50 text-gold-900 border-gold-200' },
          ].map((act) => (
            <Link
              key={act.path}
              to={act.path}
              className={`p-3 rounded-xl border flex flex-col items-center justify-center text-center gap-1.5 transition hover:scale-105 ${act.bg}`}
            >
              <act.icon className="w-5 h-5" />
              <span className="text-xs font-semibold">{act.label}</span>
            </Link>
          ))}
        </div>
      </div>

      {/* STATS OVERVIEW CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        
        <div className="bg-white p-6 rounded-2xl shadow-subtle border border-slate-200 flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-xs font-semibold uppercase text-gold-600">Parent Contacts</span>
            <div className="text-3xl font-bold font-serif text-slate-900">{stats.newEnquiries}</div>
            <p className="text-[11px] text-slate-500">{stats.totalEnquiries} total received</p>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-gold-100 text-gold-700 flex items-center justify-center">
            <Mail className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-subtle border border-slate-200 flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-xs font-semibold uppercase text-navy-900">News & Events</span>
            <div className="text-3xl font-bold font-serif text-slate-900">{stats.publishedNews}</div>
            <p className="text-[11px] text-slate-500">Published on website</p>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-navy-100 text-navy-900 flex items-center justify-center">
            <Newspaper className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-subtle border border-slate-200 flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-xs font-semibold uppercase text-emerald-600">Active Circulars</span>
            <div className="text-3xl font-bold font-serif text-slate-900">{stats.activeNotices}</div>
            <p className="text-[11px] text-slate-500">Live notice board entries</p>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-700 flex items-center justify-center">
            <Bell className="w-6 h-6" />
          </div>
        </div>

      </div>

      <div className="pt-2">
        <Link
          to="/admin/enquiries"
          className="inline-flex items-center gap-2 px-6 py-3 bg-navy-900 hover:bg-navy-800 text-white font-semibold text-xs rounded-xl shadow-lg transition"
        >
          <span>View Inbox Enquiries ({stats.newEnquiries} New)</span>
          <ArrowRight className="w-4 h-4 text-gold-400" />
        </Link>
      </div>

    </div>
  );
};

export default AdminDashboard;
