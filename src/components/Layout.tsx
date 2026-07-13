import React from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from './Navbar';

const Layout: React.FC = () => {
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#070a13] flex flex-col transition-colors duration-300">
      {/* Decorative Radial Background */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(99,102,241,0.05)_0%,rgba(0,0,0,0)_50%)] dark:bg-[radial-gradient(circle_at_50%_0%,rgba(99,102,241,0.12)_0%,rgba(0,0,0,0)_50%)] pointer-events-none z-0"></div>
      
      {/* Navbar header */}
      <Navbar />

      {/* Main Content Area */}
      <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 relative z-10">
        <Outlet />
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-200 dark:border-white/5 py-6 text-center text-xs text-slate-500 relative z-10 bg-slate-100/50 dark:bg-slate-950/20 backdrop-blur-sm transition-colors duration-300">
        <p>© 2026 AGY Fullstack Core. Todos los derechos reservados. Desarrollado con React 19 y Tailwind CSS v4.</p>
      </footer>
    </div>
  );
};

export default Layout;
