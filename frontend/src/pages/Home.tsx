import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { 
  ArrowRight, 
  Github, 
  Sparkles, 
  Terminal, 
  Cpu, 
  Layers,
  ExternalLink,
  Star,
  CheckCircle,
  Briefcase
} from 'lucide-react';

const Home = () => {
  const fadeInUp = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] }
  };

  const stagger = {
    animate: {
      transition: {
        staggerChildren: 0.1
      }
    }
  };

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

  const featuredProjects = [
    {
      title: 'Scrooge - Casino Ops',
      tag: 'Gaming / Fintech',
      desc: 'Built the secure vault and admin panel for a high-traffic casino platform. Optimized APIs reducing latency by 40%.',
      icons: [Terminal, Cpu],
      color: 'from-blue-500/20 to-purple-500/20'
    },
    {
      title: 'IAMeetYou - AI Native',
      tag: 'AI / Social',
      desc: 'AI-powered dating platform with real-time sentiment analysis using OpenAI and HumeAI integrations.',
      icons: [Sparkles, Layers],
      color: 'from-pink-500/20 to-orange-500/20'
    }
  ];

  return (
    <div className="flex flex-col gap-32">
      {/* Hero Section */}
      <section className="relative py-12 flex flex-col items-center text-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="mb-8 badge-primary"
        >
          <Sparkles size={14} className="animate-pulse" />
          Full Stack Architect
        </motion.div>

        <motion.h1 
          className="text-6xl md:text-8xl lg:text-9xl font-bold tracking-tighter leading-[0.9] text-text"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.1 }}
        >
          Building <br />
          <span className="bg-gradient-to-r from-primary via-accent-purple to-accent-pink bg-clip-text text-transparent animate-gradient-x bg-[length:200%_auto]">
            Stellar Interfaces.
          </span>
        </motion.h1>

        <motion.p 
          className="mt-10 text-lg md:text-xl text-textMuted max-w-2xl leading-relaxed font-medium"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          Transforming complex logic into seamless digital experiences. Specializing in 
          <span className="text-text"> MERN Stack, AI Integration, and High-Performance APIs.</span>
        </motion.p>

        <motion.div 
          className="flex flex-wrap items-center justify-center gap-6 mt-12"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
        >
          <Link to="/portfolio" className="btn-primary flex gap-2 group shadow-[0_0_20px_rgba(255,255,255,0.1)]">
            Explore Portfolio
            <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
          </Link>
          <Link to="/contact" className="btn-secondary">
            Get in Touch
          </Link>
        </motion.div>

        {/* Stats Section Overlay */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-24 w-full max-w-5xl"
        >
          {[
            { 
              value: '4.9', 
              label: 'Average client satisfaction rating from completed projects', 
              icon: Star,
              color: 'text-yellow-500' 
            },
            { 
              value: '20+', 
              label: 'Successful projects delivered as a Full Stack Developer', 
              icon: CheckCircle,
              color: 'text-green-500'
            },
            { 
              value: '5+', 
              label: 'Years of professional experience in high-end development', 
              icon: Briefcase,
              color: 'text-primary'
            }
          ].map((stat, i) => (
            <div key={i} className="glass-card p-8 flex flex-col items-center text-center gap-4 bg-white/[0.02] border-white/5 group hover:bg-white/[0.05] transition-all">
              <div className={`p-3 rounded-2xl bg-white/5 ${stat.color} group-hover:scale-110 transition-transform`}>
                <stat.icon size={28} />
              </div>
              <div className="flex flex-col gap-1">
                <span className="text-4xl font-bold text-text tracking-tighter">{stat.value}</span>
                <p className="text-sm text-textMuted font-medium leading-relaxed px-4">{stat.label}</p>
              </div>
            </div>
          ))}
        </motion.div>
      </section>

      {/* Featured Projects Grid */}
      <section className="flex flex-col gap-12">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 px-2">
          <div className="flex flex-col gap-2">
            <h2 className="text-3xl font-bold tracking-tight text-text">Highlighted Works</h2>
            <p className="text-textMuted max-w-sm">A glimpse into high-performance applications built for the future.</p>
          </div>
          <Link to="/portfolio" className="group flex items-center gap-2 text-sm font-bold text-text uppercase tracking-widest hover:text-primary transition-colors">
            View Full Portfolio
            <ExternalLink className="w-4 h-4 transition-transform group-hover:translate-x-0.5" />
          </Link>
        </div>

        <motion.div 
          variants={stagger}
          initial="initial"
          whileInView="animate"
          viewport={{ once: true }}
          className="grid grid-cols-1 md:grid-cols-2 gap-8"
        >
          {featuredProjects.map((p) => (
            <motion.div
              key={p.title}
              variants={fadeInUp}
              className="group p-8 flex flex-col gap-8 card border-white/5 relative overflow-hidden"
            >
              <div className={`absolute inset-0 bg-gradient-to-br ${p.color} opacity-0 group-hover:opacity-100 transition-opacity duration-500`} />
              
              <div className="relative z-10 flex justify-between items-start">
                <div className="flex flex-col gap-2">
                  <span className="text-[10px] font-black uppercase tracking-[0.2em] text-primary">{p.tag}</span>
                  <h3 className="text-2xl font-bold text-text group-hover:translate-x-1 transition-transform">{p.title}</h3>
                </div>
                <div className="flex gap-2">
                  {p.icons.map((Icon, i) => <Icon key={i} size={18} className="text-textMuted group-hover:text-text transition-colors" />)}
                </div>
              </div>

              <p className="relative z-10 text-textMuted group-hover:text-text/80 transition-colors leading-relaxed">
                {p.desc}
              </p>

              <div className="relative z-10 mt-4 flex items-center gap-4">
                <div className="h-px flex-1 bg-white/5 group-hover:bg-white/20 transition-colors" />
                <span className="text-xs font-bold uppercase tracking-widest text-text/40 group-hover:text-text transition-colors">Details</span>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </section>

      {/* Experience Timeline */}
      <section className="grid lg:grid-cols-[1fr_2fr] gap-16 py-12 border-t border-white/5">
        <div className="flex flex-col gap-4">
          <h2 className="text-3xl font-bold tracking-tighter text-text">The Journey</h2>
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

      {/* Final CTA */}
      <section className="py-24 border-t border-white/5 flex flex-col items-center text-center gap-8">
         <h2 className="text-4xl md:text-6xl font-bold tracking-tighter text-text">
           Interested in working together? <br />
           <span className="bg-gradient-to-r from-primary to-accent-pink bg-clip-text text-transparent">Let's build something amazing!</span>
         </h2>
         <Link to="/contact" className="btn-primary py-6 px-12 text-lg rounded-2xl group shadow-[0_0_30px_rgba(255,255,255,0.05)]">
            Start a Project
            <ArrowRight className="w-6 h-6 ml-2 transition-transform group-hover:translate-x-1" />
         </Link>
      </section>
    </div>
  );
};

export default Home;
