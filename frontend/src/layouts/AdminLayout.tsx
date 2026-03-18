import { Outlet, Link, Navigate, useLocation } from 'react-router-dom';
import { useAuthStore } from '../store/useAuthStore';
import { LayoutDashboard, FolderKanban, FileText, Mail, ArrowLeft, LifeBuoy } from 'lucide-react';

const AdminLayout = () => {
  const { user } = useAuthStore();
  const location = useLocation();

  if (!user || user.role !== 'admin') {
    return <Navigate to="/login" replace />;
  }

  const menuItems = [
    { name: 'Dashboard', path: '/admin', icon: LayoutDashboard },
    { name: 'Manage Projects', path: '/admin/projects', icon: FolderKanban },
    { name: 'Manage Blogs', path: '/admin/blogs', icon: FileText },
    { name: 'Support', path: '/admin/support', icon: LifeBuoy },
    { name: 'Messages', path: '/admin/messages', icon: Mail },
  ];

  return (
    <div className="min-h-screen flex bg-background">
      {/* Sidebar */}
      <aside className="w-72 border-r border-white/5 bg-background/50 backdrop-blur-3xl p-8 hidden lg:flex flex-col gap-10">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center text-white font-black shadow-lg shadow-primary/20">
            SF
          </div>
          <div className="flex flex-col">
            <h2 className="text-sm font-black uppercase tracking-widest text-white leading-none">Admin</h2>
            <span className="text-[10px] font-bold text-textMuted uppercase tracking-tighter">Command Center</span>
          </div>
        </div>

        <nav className="flex flex-col gap-2">
          {menuItems.map((item) => (
            <Link 
              key={item.path}
              to={item.path} 
              className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 group ${
                location.pathname === item.path 
                  ? 'bg-primary/10 text-primary border border-primary/20 shadow-sm shadow-primary/5' 
                  : 'text-textMuted hover:text-white hover:bg-white/5'
              }`}
            >
              <item.icon size={18} className={location.pathname === item.path ? 'text-primary' : 'group-hover:text-white transition-colors'} />
              <span className="text-sm font-bold tracking-tight">{item.name}</span>
            </Link>
          ))}
        </nav>

        <div className="mt-auto">
          <Link to="/" className="flex items-center gap-2 text-xs font-bold text-textMuted hover:text-primary transition-colors group">
            <ArrowLeft size={14} className="group-hover:-translate-x-1 transition-transform" />
            Back to Website
          </Link>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-10 overflow-y-auto bg-surface/30">
        <div className="max-w-6xl mx-auto">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default AdminLayout;
