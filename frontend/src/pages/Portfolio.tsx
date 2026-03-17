import React from 'react';
import { motion } from 'framer-motion';
import { 
  Star, 
  CheckCircle, 
  Users, 
  Code, 
  Zap,
  ArrowRight,
  Briefcase,
  Terminal,
  Cpu,
  Layers
} from 'lucide-react';
import { Link } from 'react-router-dom';

const Portfolio = () => {
  const jobs = [
    {
      company: 'Websultanate Software Technologies',
      role: 'Software Engineer',
      period: '04/2025 – Present',
      desc: 'Leading full-stack development for high-traffic MERN & PERN applications. Architected AI-powered features and optimized casino platforms for high concurrency.'
    },
    {
      company: 'Svayam Infoware Pvt. Ltd.',
      role: 'Software Engineer',
      period: '09/2021 – 03/2025',
      desc: 'Engineered complex ERP solutions and auction platforms for MDA. Integrated secure ICICI payment gateways and real-time bid tracking systems.'
    }
  ];

  return (
    <div className="flex flex-col gap-32">
      {/* Header & Stats Section */}
      <section className="flex flex-col gap-16">
        <div className="flex flex-col items-center text-center gap-6 max-w-3xl mx-auto">
          <motion.span 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="badge-primary"
          >
            The Architect's Journey
          </motion.span>
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-5xl md:text-7xl font-bold tracking-tighter text-text"
          >
            My Professional <span className="text-primary italic">Portfolio.</span>
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-lg text-textMuted leading-relaxed font-medium"
          >
            A consolidation of 5+ years in full-stack engineering, specializing in 
            scalable systems, AI integration, and high-performance web ecosystems.
          </motion.p>
        </div>

        {/* Stats Grid */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-6 w-full max-w-5xl self-center"
        >
          {[
            { value: '20+', label: 'Projects Delivered', icon: CheckCircle, color: 'text-green-500' },
            { value: '15+', label: 'Happy Clients', icon: Users, color: 'text-blue-500' },
            { value: '100K+', label: 'Lines of Code', icon: Code, color: 'text-purple-500' },
            { value: '4.9/5', label: 'Client Rating', icon: Star, color: 'text-yellow-500' }
          ].map((stat, i) => (
            <div key={i} className="glass-card p-6 flex flex-col items-center text-center gap-3 bg-white/[0.02] border-white/5 hover:bg-white/[0.05] transition-all">
              <div className={`p-2 rounded-xl bg-white/5 ${stat.color}`}>
                <stat.icon size={20} />
              </div>
              <div className="flex flex-col">
                <span className="text-3xl font-bold text-text tracking-tighter">{stat.value}</span>
                <p className="text-[10px] font-bold uppercase tracking-widest text-textMuted">{stat.label}</p>
              </div>
            </div>
          ))}
        </motion.div>
      </section>

      {/* Experience Timeline */}
      <section className="grid lg:grid-cols-[1fr_2fr] gap-16 py-12 border-t border-white/5">
        <div className="flex flex-col gap-4">
          <h2 className="text-3xl font-bold tracking-tighter text-text">Experience</h2>
          <p className="text-textMuted leading-relaxed">
            Five years of navigating the edge of full-stack engineering, from ERP systems to AI-driven social platforms.
          </p>
        </div>

        <div className="flex flex-col gap-12">
          {jobs.map((job, idx) => (
            <motion.div 
              key={job.company}
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1 }}
              className="flex flex-col gap-4 p-8 glass-card border-none bg-white/[0.02] hover:bg-white/[0.04]"
            >
              <div className="flex justify-between items-center text-xs font-bold uppercase tracking-widest text-primary">
                <span>{job.period}</span>
                <span className="px-3 py-1 bg-primary/10 rounded-full">{job.role}</span>
              </div>
              <h3 className="text-2xl font-bold text-text">{job.company}</h3>
              <p className="text-textMuted leading-relaxed italic border-l-2 border-primary/40 pl-4">
                {job.desc}
              </p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Primary Skills Section */}
      <section className="flex flex-col items-center gap-12 py-12 border-t border-white/5">
        <div className="flex flex-col items-center text-center gap-4">
          <h2 className="text-3xl font-bold tracking-tighter text-text">Technical Arsenal</h2>
          <p className="text-textMuted max-w-xl font-medium">
            Core technologies and tools I leverage to build production-grade applications.
          </p>
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 w-full max-w-4xl">
           {[
             { name: 'Full Stack', tools: ['MERN', 'PERN', 'MEAN'], icon: Layers, color: 'text-primary' },
             { name: 'Languages', tools: ['TypeScript', 'JavaScript', 'SQL'], icon: Code, color: 'text-accent-pink' },
             { name: 'DevOps', tools: ['Git', 'Redis', 'AWS'], icon: Terminal, color: 'text-accent-purple' },
             { name: 'Performance', tools: ['Caching', 'Query Opt', 'Scaling'], icon: Zap, color: 'text-yellow-500' }
           ].map((skill, i) => (
             <div key={i} className="glass-card p-6 flex flex-col gap-4 border-white/5 hover:bg-white/[0.04] transition-colors">
                <skill.icon size={24} className={skill.color} />
                <h4 className="font-bold text-text">{skill.name}</h4>
                <div className="flex flex-wrap gap-2">
                  {skill.tools.map(t => <span key={t} className="text-[10px] text-textMuted font-bold uppercase">{t}</span>)}
                </div>
             </div>
           ))}
        </div>
      </section>

      {/* Start a project CTA */}
      <section className="py-24 border-t border-white/5 flex flex-col items-center text-center gap-8">
         <h2 className="text-4xl md:text-6xl font-bold tracking-tighter text-text">
           Curious about my projects? <br />
           <span className="bg-gradient-to-r from-primary to-accent-pink bg-clip-text text-transparent">Explore my full archive.</span>
         </h2>
         <Link to="/projects" className="btn-primary py-6 px-12 text-lg rounded-2xl group shadow-[0_0_30px_rgba(255,255,255,0.05)]">
            Go to Projects
            <ArrowRight className="w-6 h-6 ml-2 transition-transform group-hover:translate-x-1" />
         </Link>
      </section>
    </div>
  );
};

export default Portfolio;
