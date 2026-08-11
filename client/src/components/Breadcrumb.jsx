import React from 'react';
import { Link } from 'react-router-dom';
import { ChevronRight, Home } from 'lucide-react';

const Breadcrumb = ({ title, subtitle, items = [] }) => {
  return (
    <div className="bg-gradient-to-b from-navy-950 to-navy-900 text-white py-12 md:py-16 relative overflow-hidden border-b border-navy-800">
      {/* Decorative background circles */}
      <div className="absolute -top-24 -right-24 w-96 h-96 rounded-full bg-gold-500/5 blur-3xl pointer-events-none"></div>
      <div className="absolute -bottom-24 -left-24 w-96 h-96 rounded-full bg-blue-500/5 blur-3xl pointer-events-none"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Breadcrumb nav links */}
        <nav className="flex items-center gap-2 text-xs font-medium text-slate-400 mb-4 flex-wrap">
          <Link to="/" className="hover:text-gold-400 flex items-center gap-1 transition">
            <Home className="w-3.5 h-3.5" />
            Home
          </Link>
          {items.map((item, idx) => (
            <React.Fragment key={idx}>
              <ChevronRight className="w-3 h-3 text-slate-600" />
              {item.link ? (
                <Link to={item.link} className="hover:text-gold-400 transition">{item.label}</Link>
              ) : (
                <span className="text-gold-400">{item.label}</span>
              )}
            </React.Fragment>
          ))}
        </nav>

        {/* Page Title */}
        <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold font-serif tracking-tight text-white">
          {title}
        </h1>

        {subtitle && (
          <p className="text-xs sm:text-sm text-slate-300 max-w-2xl mt-2 leading-relaxed">
            {subtitle}
          </p>
        )}
      </div>
    </div>
  );
};

export default Breadcrumb;
