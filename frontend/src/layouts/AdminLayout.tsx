import React from 'react';
import { Outlet, Link } from 'react-router-dom';

const AdminLayout = () => {
  return (
    <div className="min-h-screen flex bg-surface">
      <aside className="w-64 border-r border-border bg-background p-6 hidden md:block">
        <h2 className="text-xl font-bold mb-8 tracking-tighter">Admin Portal</h2>
        <nav className="flex flex-col gap-4">
          <Link to="/admin" className="text-sm font-medium text-textMuted hover:text-white transition-colors">Dashboard</Link>
          <Link to="/admin/projects" className="text-sm font-medium text-textMuted hover:text-white transition-colors">Manage Projects</Link>
          <Link to="/admin/blogs" className="text-sm font-medium text-textMuted hover:text-white transition-colors">Manage Blogs</Link>
          <Link to="/admin/messages" className="text-sm font-medium text-textMuted hover:text-white transition-colors">Messages</Link>
        </nav>
      </aside>
      <main className="flex-1 p-8 overflow-y-auto">
        <Outlet />
      </main>
    </div>
  );
};

export default AdminLayout;
