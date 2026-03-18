import React, { useEffect, useState } from 'react';
import { api } from '../services/api';
import { Plus, Edit2, Trash2, Eye, FileText, Check, X } from 'lucide-react';
import toast from 'react-hot-toast';

interface Blog {
  _id: string;
  title: string;
  slug: string;
  summary: string;
  content: string;
  tags: string[];
  published: boolean;
  createdAt: string;
}

const AdminBlogs = () => {
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [currentBlog, setCurrentBlog] = useState<Partial<Blog>>({});

  useEffect(() => {
    fetchBlogs();
  }, []);

  const fetchBlogs = async () => {
    try {
      const response = await api.get('/blogs');
      setBlogs(response.data.data);
    } catch (error) {
      toast.error('Failed to load blogs');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Eradicate this blog post?')) return;
    try {
      await api.delete(`/blogs/${id}`);
      toast.success('Post deleted');
      fetchBlogs();
    } catch (error) {
      toast.error('Failed to delete blog');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (currentBlog._id) {
        await api.put(`/blogs/${currentBlog._id}`, currentBlog);
        toast.success('Blog updated');
      } else {
        await api.post('/blogs', currentBlog);
        toast.success('Content published to the Forge');
      }
      setIsEditing(false);
      setCurrentBlog({});
      fetchBlogs();
    } catch (error) {
      toast.error('Operation failed');
    }
  };

  if (loading) return <div className="animate-pulse flex flex-col gap-4 py-8"><div className="h-48 bg-border rounded-xl"></div></div>;

  return (
    <div className="flex flex-col gap-8">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-black tracking-tighter text-white uppercase italic">Content <span className="text-primary">Forge.</span></h1>
          <p className="text-textMuted text-sm font-medium">Draft, publish, and manage your technical articles.</p>
        </div>
        <button 
          onClick={() => { setIsEditing(true); setCurrentBlog({ tags: [], published: false }); }}
          className="btn-primary flex items-center gap-2"
        >
          <Plus size={18} /> New Article
        </button>
      </div>

      {isEditing && (
        <div className="glass-card p-8 border-primary/20 bg-primary/5">
          <form onSubmit={handleSubmit} className="flex flex-col gap-6">
             <div className="grid md:grid-cols-2 gap-6">
               <div className="flex flex-col gap-2">
                  <label className="text-xs font-black uppercase tracking-widest text-textMuted ml-1">Title</label>
                  <input 
                    className="input-field" 
                    value={currentBlog.title || ''} 
                    required
                    onChange={(e) => setCurrentBlog({...currentBlog, title: e.target.value, slug: e.target.value.toLowerCase().replace(/ /g, '-')})}
                  />
               </div>
               <div className="flex flex-col gap-2">
                  <label className="text-xs font-black uppercase tracking-widest text-textMuted ml-1">Slug</label>
                  <input 
                    className="input-field" 
                    value={currentBlog.slug || ''} 
                    required
                    onChange={(e) => setCurrentBlog({...currentBlog, slug: e.target.value})}
                  />
               </div>
             </div>
             
             <div className="flex flex-col gap-2">
                <label className="text-xs font-black uppercase tracking-widest text-textMuted ml-1">Summary</label>
                <input 
                  className="input-field" 
                  value={currentBlog.summary || ''} 
                  required
                  onChange={(e) => setCurrentBlog({...currentBlog, summary: e.target.value})}
                />
             </div>

             <div className="flex flex-col gap-2">
                <label className="text-xs font-black uppercase tracking-widest text-textMuted ml-1">Content (Markdown)</label>
                <textarea 
                  className="input-field h-64 font-mono text-sm leading-relaxed whitespace-pre" 
                  value={currentBlog.content || ''} 
                  required
                  onChange={(e) => setCurrentBlog({...currentBlog, content: e.target.value})}
                />
             </div>

             <div className="grid md:grid-cols-2 gap-6">
               <div className="flex flex-col gap-2">
                  <label className="text-xs font-black uppercase tracking-widest text-textMuted ml-1">Tags (comma separated)</label>
                  <input 
                    className="input-field" 
                    value={currentBlog.tags?.join(', ') || ''} 
                    onChange={(e) => setCurrentBlog({...currentBlog, tags: e.target.value.split(',').map(s => s.trim())})}
                  />
               </div>
               <div className="flex items-center gap-3 self-end mb-2">
                  <button 
                     type="button"
                     onClick={() => setCurrentBlog({...currentBlog, published: !currentBlog.published})}
                     className={`w-12 h-6 rounded-full transition-colors relative ${currentBlog.published ? 'bg-green-500' : 'bg-border'}`}
                  >
                    <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all ${currentBlog.published ? 'left-7' : 'left-1'}`} />
                  </button>
                  <span className="text-sm font-bold text-text">Live Status</span>
               </div>
             </div>

             <div className="flex gap-4 mt-4">
                <button type="submit" className="btn-primary px-8">Save Article</button>
                <button 
                  type="button" 
                  onClick={() => setIsEditing(false)}
                  className="btn-secondary px-8"
                >Cancel</button>
             </div>
          </form>
        </div>
      )}

      <div className="grid grid-cols-1 gap-4">
        {blogs.map((blog) => (
          <div key={blog._id} className="card p-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-6 group">
            <div className="flex-1 flex flex-col gap-1">
              <div className="flex items-center gap-3">
                <h3 className="text-lg font-bold">{blog.title}</h3>
                {!blog.published && <span className="text-[10px] font-black uppercase tracking-widest px-2 py-1 bg-amber-500/10 text-amber-500 rounded-md">Draft</span>}
              </div>
              <p className="text-sm text-textMuted line-clamp-1">{blog.summary}</p>
              <span className="text-[10px] text-textMuted font-bold uppercase mt-2">{new Date(blog.createdAt).toLocaleDateString()}</span>
            </div>
            <div className="flex gap-3">
               <button 
                 onClick={() => { setCurrentBlog(blog); setIsEditing(true); }}
                 className="p-2 hover:bg-primary/10 text-textMuted hover:text-primary transition-all rounded-lg"
               >
                 <Edit2 size={18} />
               </button>
               <button 
                 onClick={() => handleDelete(blog._id)}
                 className="p-2 hover:bg-red-500/10 text-textMuted hover:text-red-500 transition-all rounded-lg"
               >
                 <Trash2 size={18} />
               </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AdminBlogs;
