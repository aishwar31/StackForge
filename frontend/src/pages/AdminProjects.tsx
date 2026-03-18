import React, { useEffect, useState } from 'react';
import { api } from '../services/api';
import { Plus, Edit2, Trash2, ExternalLink, Github, Check, X } from 'lucide-react';
import toast from 'react-hot-toast';

interface Project {
  _id: string;
  title: string;
  description: string;
  techStack: string[];
  githubLink: string;
  liveLink?: string;
  isFeatured: boolean;
}

const AdminProjects = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [currentProject, setCurrentProject] = useState<Partial<Project>>({});

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    try {
      const response = await api.get('/projects');
      setProjects(response.data.data);
    } catch (error) {
      toast.error('Failed to load projects');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Delete this project forever?')) return;
    try {
      await api.delete(`/projects/${id}`);
      toast.success('Project eradicated');
      fetchProjects();
    } catch (error) {
      toast.error('Failed to delete project');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (currentProject._id) {
        await api.put(`/projects/${currentProject._id}`, currentProject);
        toast.success('Project updated');
      } else {
        await api.post('/projects', currentProject);
        toast.success('New project forged');
      }
      setIsEditing(false);
      setCurrentProject({});
      fetchProjects();
    } catch (error) {
      toast.error('Operation failed');
    }
  };

  if (loading) return <div className="animate-pulse flex flex-col gap-4 py-8"><div className="h-64 bg-border rounded-xl"></div></div>;

  return (
    <div className="flex flex-col gap-8">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-black tracking-tighter text-white uppercase italic">Project <span className="text-primary">Archive.</span></h1>
          <p className="text-textMuted text-sm font-medium">Manage and curate your engineering catalog.</p>
        </div>
        <button 
          onClick={() => { setIsEditing(true); setCurrentProject({ techStack: [], isFeatured: false }); }}
          className="btn-primary flex items-center gap-2"
        >
          <Plus size={18} /> Add Project
        </button>
      </div>

      {isEditing && (
        <div className="glass-card p-8 border-primary/20 bg-primary/5">
          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
             <div className="flex flex-col gap-2">
                <label className="text-xs font-black uppercase tracking-widest text-textMuted ml-1">Title</label>
                <input 
                  className="input-field" 
                  value={currentProject.title || ''} 
                  required
                  onChange={(e) => setCurrentProject({...currentProject, title: e.target.value})}
                />
             </div>
             <div className="flex flex-col gap-2">
                <label className="text-xs font-black uppercase tracking-widest text-textMuted ml-1">Demo Link</label>
                <input 
                  className="input-field" 
                  value={currentProject.liveLink || ''} 
                  onChange={(e) => setCurrentProject({...currentProject, liveLink: e.target.value})}
                />
             </div>
             <div className="md:col-span-2 flex flex-col gap-2">
                <label className="text-xs font-black uppercase tracking-widest text-textMuted ml-1">Description</label>
                <textarea 
                  className="input-field h-24" 
                  value={currentProject.description || ''} 
                  required
                  onChange={(e) => setCurrentProject({...currentProject, description: e.target.value})}
                />
             </div>
             <div className="flex flex-col gap-2">
                <label className="text-xs font-black uppercase tracking-widest text-textMuted ml-1">Tech Stack (comma separated)</label>
                <input 
                  className="input-field" 
                  value={currentProject.techStack?.join(', ') || ''} 
                  onChange={(e) => setCurrentProject({...currentProject, techStack: e.target.value.split(',').map(s => s.trim())})}
                />
             </div>
             <div className="flex flex-col gap-2">
                <label className="text-xs font-black uppercase tracking-widest text-textMuted ml-1">Github URL</label>
                <input 
                  className="input-field" 
                  value={currentProject.githubLink || ''} 
                  required
                  onChange={(e) => setCurrentProject({...currentProject, githubLink: e.target.value})}
                />
             </div>
             <div className="flex items-center gap-3 md:col-span-2">
                <button 
                   type="button"
                   onClick={() => setCurrentProject({...currentProject, isFeatured: !currentProject.isFeatured})}
                   className={`w-12 h-6 rounded-full transition-colors relative ${currentProject.isFeatured ? 'bg-primary' : 'bg-border'}`}
                >
                  <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all ${currentProject.isFeatured ? 'left-7' : 'left-1'}`} />
                </button>
                <span className="text-sm font-bold text-text">Feature on Landing Page</span>
             </div>
             <div className="md:col-span-2 flex gap-4 mt-4">
                <button type="submit" className="btn-primary px-8">Save Changes</button>
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
        {projects.map((project) => (
          <div key={project._id} className="card p-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-6 group">
            <div className="flex-1 flex flex-col gap-1">
              <div className="flex items-center gap-3">
                <h3 className="text-lg font-bold">{project.title}</h3>
                {project.isFeatured && <span className="text-[10px] font-black uppercase tracking-widest px-2 py-1 bg-primary/10 text-primary rounded-md">Featured</span>}
              </div>
              <p className="text-sm text-textMuted line-clamp-1">{project.description}</p>
              <div className="flex gap-2 mt-2">
                {project.techStack.slice(0, 3).map(t => (
                  <span key={t} className="text-[10px] text-textMuted font-bold uppercase">{t}</span>
                ))}
              </div>
            </div>
            <div className="flex gap-3">
               <button 
                 onClick={() => { setCurrentProject(project); setIsEditing(true); }}
                 className="p-2 hover:bg-primary/10 text-textMuted hover:text-primary transition-all rounded-lg"
               >
                 <Edit2 size={18} />
               </button>
               <button 
                 onClick={() => handleDelete(project._id)}
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

export default AdminProjects;
