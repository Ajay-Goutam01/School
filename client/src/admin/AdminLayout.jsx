import React, { useState, useEffect } from 'react';
import { Link, NavLink, Outlet, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useSchool } from '../context/SchoolContext';
import { 
  LayoutDashboard, Building, BookOpen, Layers, Trophy, 
  Sparkles, GraduationCap, Image as GalleryIcon, Newspaper, 
  Bell, FileCheck, ShieldCheck, Mail, LogOut, Menu, X, Sliders, Image, Award, Info, KeyRound
} from 'lucide-react';

const AdminLayout = () => {
  const { admin, logout } = useAuth();
  const { profile } = useSchool();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    // Inject noindex meta tag for admin pages
    let metaTag = document.querySelector("meta[name='robots']");
    if (!metaTag) {
      metaTag = document.createElement('meta');
      metaTag.name = 'robots';
      document.head.appendChild(metaTag);
    }
    metaTag.content = 'noindex, nofollow';

    return () => {
      if (metaTag) metaTag.content = 'index, follow';
    };
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/admin/login');
  };

  const navItems = [
    { label: 'Dashboard Overview', path: '/admin/dashboard', icon: LayoutDashboard },
    { label: 'Website & Section Controls', path: '/admin/settings', icon: Sliders },
    { label: 'School Profile & Contacts', path: '/admin/profile', icon: Building },
    { label: 'Security & Password', path: '/admin/security', icon: KeyRound },
    { label: 'Hero Banner', path: '/admin/hero', icon: Image },
    { label: 'About & Why Choose Us', path: '/admin/about', icon: Info },
    { label: 'Parent Enquiries', path: '/admin/enquiries', icon: Mail },
    { label: 'Academics & Curriculum', path: '/admin/academics', icon: BookOpen },
    { label: 'Programs & Courses', path: '/admin/courses', icon: Layers },
    { label: 'Activities & Sports', path: '/admin/activities', icon: Trophy },
    { label: 'Facilities', path: '/admin/facilities', icon: Sparkles },
    { label: 'Faculty & Mentors', path: '/admin/faculty', icon: GraduationCap },
    { label: 'Achievements', path: '/admin/achievements', icon: Award },
    { label: 'Photo Gallery', path: '/admin/gallery', icon: GalleryIcon },
    { label: 'News & Events', path: '/admin/news', icon: Newspaper },
    { label: 'Notice Board', path: '/admin/notices', icon: Bell },
    { label: 'Admissions Desk', path: '/admin/admissions', icon: FileCheck },
    { label: 'Fee Structure', path: '/admin/fees', icon: ShieldCheck },
  ];

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col md:flex-row">
      
      {/* Mobile Top Bar */}
      <div className="md:hidden bg-navy-950 text-white p-4 flex items-center justify-between shadow-md">
        <div className="flex items-center gap-2">
          <img src={profile.logo} alt="Logo" className="w-8 h-8 object-contain bg-white rounded p-0.5" />
          <span className="font-serif font-bold text-sm">Admin Control Center</span>
        </div>
        <button onClick={() => setSidebarOpen(!sidebarOpen)} className="p-1 text-slate-300">
          {sidebarOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Sidebar Navigation */}
      <aside className={`
        fixed md:static inset-y-0 left-0 z-40 w-64 bg-navy-950 text-slate-300 flex flex-col transition-transform duration-300
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
      `}>
        {/* Brand Header */}
        <div className="p-6 border-b border-navy-800 flex items-center gap-3">
          <img src={profile.logo} alt="Logo" className="w-10 h-10 object-contain bg-white rounded-lg p-1 shrink-0" />
          <div>
            <h2 className="text-sm font-bold font-serif text-white truncate max-w-[140px]">{profile.schoolName}</h2>
            <p className="text-[11px] text-gold-400 font-medium">CMS Admin Panel</p>
          </div>
        </div>

        {/* Links list */}
        <nav className="flex-1 p-3 space-y-0.5 overflow-y-auto text-xs font-medium">
          {navItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              onClick={() => setSidebarOpen(false)}
              className={({ isActive }) => `
                flex items-center gap-3 px-3 py-2 rounded-lg transition-colors
                ${isActive 
                  ? 'bg-gold-600 text-white font-semibold shadow-gold' 
                  : 'text-slate-400 hover:bg-navy-900 hover:text-slate-200'}
              `}
            >
              <item.icon className="w-4 h-4 shrink-0" />
              <span>{item.label}</span>
            </NavLink>
          ))}
        </nav>

        {/* Footer Admin info & Logout */}
        <div className="p-4 border-t border-navy-800 space-y-2">
          <div className="flex items-center gap-3 text-xs">
            <div className="w-7 h-7 rounded-full bg-gold-600/20 text-gold-400 font-bold flex items-center justify-center border border-gold-500/30 shrink-0">
              A
            </div>
            <div className="truncate">
              <p className="font-semibold text-white text-xs truncate">{admin?.name || 'Administrator'}</p>
              <p className="text-[10px] text-slate-400 truncate">{admin?.email}</p>
            </div>
          </div>

          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-center gap-2 py-2 rounded-lg bg-navy-900 hover:bg-rose-900/40 text-slate-300 hover:text-rose-300 text-xs font-semibold transition"
          >
            <LogOut className="w-4 h-4" />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 p-6 md:p-8 overflow-y-auto max-w-7xl">
        <Outlet />
      </main>

    </div>
  );
};

export default AdminLayout;
