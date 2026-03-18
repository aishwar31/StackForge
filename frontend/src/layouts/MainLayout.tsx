import React from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Github, Twitter, Linkedin, Sun, Moon, LogOut, User as UserIcon } from 'lucide-react';
import { useThemeStore } from '../store/useThemeStore';
import { useAuthStore } from '../store/useAuthStore';
import ParticleBackground from '../components/ParticleBackground';
import { Toaster } from 'react-hot-toast';
import RealTimeChat from '../components/RealTimeChat';

const MainLayout = () => {
  const location = useLocation();
  const { theme, toggleTheme } = useThemeStore();
  const { user, logout } = useAuthStore();

  React.useEffect(() => {
    const root = window.document.documentElement;
    root.classList.remove('light', 'dark');
    root.classList.add(theme);
  }, [theme]);

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'Portfolio', path: '/portfolio' },
    { name: 'Projects', path: '/projects' },
    { name: 'Blog', path: '/blog' },
    { name: 'Contact', path: '/contact' },
  ];

  return (
    <div className="min-h-screen flex flex-col relative bg-background">
      <Toaster 
        position="top-right"
        toastOptions={{
          style: {
            background: theme === 'dark' ? '#1e293b' : '#ffffff',
            color: theme === 'dark' ? '#f8fafc' : '#0f172a',
            border: theme === 'dark' ? '1px solid rgba(255,255,255,0.1)' : '1px solid rgba(0,0,0,0.05)',
            backdropFilter: 'blur(8px)',
            fontSize: '14px',
            fontWeight: '600',
            borderRadius: '12px',
          },
        }}
      />
      <RealTimeChat />
      <ParticleBackground />
      {/* Mesh Background */}
      <div className="bg-mesh" />

      {/* Navigation */}
      <nav className="fixed top-6 left-1/2 -translate-x-1/2 z-50 w-[90%] max-w-4xl">
        <div className="glass-card px-6 py-3 flex items-center justify-between border-white/10 bg-black/40 backdrop-blur-2xl rounded-2xl">
          <Link to="/" className="text-xl font-bold tracking-tighter flex items-center gap-2 group">
            <div className="w-8 h-8 rounded-lg bg-white flex items-center justify-center text-black rotate-3 group-hover:rotate-0 transition-transform">
              SF
            </div>
            <span className="bg-gradient-to-r from-white to-white/60 bg-clip-text text-transparent">StackForge</span>
          </Link>
          
          <div className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`relative px-4 py-2 text-sm font-medium transition-colors hover:text-white ${
                  location.pathname === link.path ? 'text-white' : 'text-textMuted'
                }`}
              >
                {location.pathname === link.path && (
                  <motion.div
                    layoutId="nav-active"
                    className="absolute inset-0 bg-white/5 rounded-lg -z-10 border border-white/10"
                    transition={{ type: 'spring', bounce: 0.2, duration: 0.6 }}
                  />
                )}
                {link.name}
              </Link>
            ))}
          </div>

          <div className="flex items-center gap-3">
             <button 
               onClick={toggleTheme}
               className="p-2.5 rounded-xl glass-card border-white/10 hover:bg-white/10 transition-all text-text"
               aria-label="Toggle Theme"
             >
               {theme === 'light' ? <Moon size={18} /> : <Sun size={18} />}
             </button>

             {user ? (
               <div className="flex items-center gap-3 pl-3 border-l border-white/10">
                 <div className="flex flex-col items-end hidden sm:flex">
                   <span className="text-[10px] font-black uppercase tracking-widest text-primary leading-none mb-1">Authenticated</span>
                   <span className="text-xs font-bold text-white">{user.name}</span>
                 </div>
                 <button 
                   onClick={logout}
                   className="p-2.5 rounded-xl glass-card border-white/10 hover:bg-white/10 transition-all text-text group"
                   title="Logout"
                 >
                   <LogOut size={18} className="transition-transform group-hover:translate-x-0.5" />
                 </button>
               </div>
             ) : (
               <div className="flex items-center gap-2">
                 <Link to="/login" className="text-xs font-bold text-textMuted hover:text-white transition-colors px-3">
                   Login
                 </Link>
                 <Link to="/register" className="btn-primary py-2 px-5 text-xs rounded-full">
                   Join Forge
                 </Link>
               </div>
             )}
          </div>
        </div>
      </nav>

      {/* Main Content Area */}
      <main className="flex-1 content-container pt-32 pb-24">
        <AnimatePresence mode="wait">
          <motion.div
            key={location.pathname}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
          >
            <Outlet />
          </motion.div>
        </AnimatePresence>
      </main>

      {/* Footer */}
      <footer className="mt-auto border-t border-white/5 bg-black/40 backdrop-blur-md py-16">
        <div className="content-container flex flex-col md:flex-row justify-between items-start gap-12">
          <div className="flex flex-col gap-4">
            <div className="flex items-center gap-2 text-2xl font-bold tracking-tighter text-white">
              <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center text-black">SF</div>
              StackForge.
            </div>
            <p className="text-textMuted max-w-sm leading-relaxed">
              Crafting production-grade digital experiences with focus on performance, 
              security, and modern aesthetics.
            </p>
            <div className="flex gap-4 mt-2">
              <a href="#" className="p-2 transition-colors hover:text-primary"><Github size={20} /></a>
              <a href="#" className="p-2 transition-colors hover:text-primary"><Twitter size={20} /></a>
              <a href="#" className="p-2 transition-colors hover:text-primary"><Linkedin size={20} /></a>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-16">
            <div className="flex flex-col gap-4">
               <h4 className="text-white font-semibold flex items-center gap-2">Sitemap</h4>
               <div className="flex flex-col gap-2 text-sm">
                 {navLinks.map(l => <Link key={l.path} to={l.path} className="hover:text-primary transition-colors">{l.name}</Link>)}
               </div>
            </div>
            <div className="flex flex-col gap-4">
               <h4 className="text-white font-semibold">Contact</h4>
               <div className="flex flex-col gap-2 text-sm">
                 <a href="mailto:hello@stackforge.com" className="hover:text-primary transition-colors">Email Me</a>
                 <a href="#" className="hover:text-primary transition-colors">LinkedIn</a>
                 <a href="#" className="hover:text-primary transition-colors">Resume</a>
               </div>
            </div>
          </div>
        </div>
        
        <div className="content-container mt-16 pt-8 border-t border-white/5 flex justify-between items-center text-xs text-textMuted">
           <p>© {new Date().getFullYear()} StackForge. All rights reserved.</p>
           <div className="flex gap-4">
             <span className="hover:text-white cursor-pointer">Privacy Policy</span>
             <span className="hover:text-white cursor-pointer">Terms of Service</span>
           </div>
        </div>
      </footer>
    </div>
  );
};

export default MainLayout;
