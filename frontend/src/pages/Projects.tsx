import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Github, ExternalLink, Code2 } from 'lucide-react';
import { api } from '../services/api';

interface Project {
  _id: string;
  title: string;
  description: string;
  techStack: string[];
  githubLink?: string;
  liveDemoLink?: string;
  images?: string[];
}

const Projects = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const response = await api.get('/projects');
        setProjects(response.data.data || []);
      } catch (error) {
        console.error('Error fetching projects:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProjects();
  }, []);

  const getImageUrl = (project: Project) => {
    if (project.images && project.images.length > 0) {
      return `http://localhost:5001${project.images[0]}`;
    }
    return 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?q=80&w=2000&auto=format&fit=crop';
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <div className="w-8 h-8 rounded-full border-2 border-primary border-t-transparent animate-spin" />
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-20">
      <div className="flex flex-col gap-6 max-w-2xl">
        <h1 className="text-5xl md:text-6xl font-bold tracking-tighter text-text">Full Project <br/><span className="text-primary italic">Archive.</span></h1>
        <p className="text-lg text-textMuted leading-relaxed">
          An exhaustive library of my technical implementations. From large-scale enterprise 
          architectures to experimental AI prototypes.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
        {projects.length === 0 ? (
          <div className="col-span-2 glass-card p-12 text-center text-textMuted font-medium">
             No projects archive found in DB. Run `npm run seed` to populate.
          </div>
        ) : (
          projects.map((project, index) => (
            <motion.div
              key={project._id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1, duration: 0.6 }}
              className="group card overflow-hidden border-white/5 bg-white/[0.01]"
            >
              {/* Image Container */}
              <div className="relative aspect-[16/10] overflow-hidden bg-surface border-b border-white/5">
                <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-accent-purple/10 animate-pulse-slow" />
                <img
                  src={getImageUrl(project)}
                  alt={project.title}
                  className="relative z-10 w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.src = 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?q=80&w=2000&auto=format&fit=crop';
                  }}
                />
                
                {/* Overlay Buttons */}
                <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-all duration-300 flex items-center justify-center gap-4 backdrop-blur-[2px] z-20">
                  {project.githubLink && (
                    <a href={project.githubLink} target="_blank" rel="noopener noreferrer" className="p-4 bg-white text-black rounded-full hover:scale-110 active:scale-95 transition-all">
                      <Github size={20} />
                    </a>
                  )}
                  {project.liveDemoLink && (
                    <a href={project.liveDemoLink} target="_blank" rel="noopener noreferrer" className="p-4 bg-primary text-white rounded-full hover:scale-110 active:scale-95 transition-all">
                      <ExternalLink size={20} />
                    </a>
                  )}
                </div>
              </div>

              {/* Card Content */}
              <div className="p-8 flex flex-col gap-6">
                <div className="flex flex-col gap-2">
                  <span className="text-[10px] font-black uppercase tracking-[0.2em] text-primary">Technical Showcase</span>
                  <h3 className="text-2xl font-bold text-text group-hover:text-primary transition-colors tracking-tight">
                    {project.title}
                  </h3>
                  <p className="text-sm text-textMuted line-clamp-2 leading-relaxed font-medium">
                    {project.description}
                  </p>
                </div>

                <div className="flex flex-wrap gap-2 pt-2 border-t border-white/5 mt-auto">
                  {project.techStack?.map((tech) => (
                    <span 
                      key={tech} 
                      className="px-3 py-1 text-[10px] font-bold uppercase tracking-widest rounded-lg bg-white/5 text-primary border border-white/5"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              </div>
            </motion.div>
          ))
        )}
      </div>
    </div>
  );
};

export default Projects;
