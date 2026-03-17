import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { api } from '../services/api';
import { Calendar, ArrowRight, Tag } from 'lucide-react';

interface Blog {
  _id: string;
  title: string;
  slug: string;
  summary: string;
  createdAt: string;
  tags: string[];
}

const BlogPage = () => {
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        const response = await api.get('/blogs');
        setBlogs(response.data.data);
      } catch (error) {
        console.error('Error fetching blogs:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchBlogs();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <div className="w-8 h-8 rounded-full border-2 border-primary border-t-transparent animate-spin" />
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-20 py-8 max-w-4xl mx-auto">
      <div className="flex flex-col gap-6">
        <h1 className="text-5xl md:text-6xl font-bold tracking-tighter text-text">Digital <br/><span className="text-primary italic">Journal.</span></h1>
        <p className="text-lg text-textMuted max-w-2xl leading-relaxed">
          Distilling complex engineering concepts into high-level architecture insights. 
          Exploring the future of web ecosystems and AI integration.
        </p>
      </div>

      <div className="flex flex-col gap-0">
        {blogs.length === 0 ? (
          <div className="glass-card p-12 text-center text-textMuted font-medium border-white/5">
             Archive is currently empty. Start drafting in the dashboard.
          </div>
        ) : (
          blogs.map((post, index) => (
            <motion.article 
              key={post._id}
              initial={{ opacity: 0, scale: 0.98 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="group relative flex flex-col gap-6 py-12 border-b border-white/5 cursor-pointer"
              onClick={() => navigate(`/blog/${post.slug}`)}
            >
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="flex items-center gap-4 text-xs font-bold uppercase tracking-[0.2em] text-textMuted">
                  <Calendar size={14} className="text-primary" />
                  {new Date(post.createdAt).toLocaleDateString('en-US', {
                    month: 'long',
                    day: 'numeric',
                    year: 'numeric',
                  })}
                </div>
                <div className="flex gap-2">
                  {post.tags?.map((tag) => (
                    <span key={tag} className="px-3 py-1 text-[10px] font-bold uppercase tracking-widest rounded-full bg-white/5 text-text/40 group-hover:text-primary group-hover:bg-primary/10 transition-colors">
                      #{tag}
                    </span>
                  ))}
                </div>
              </div>
              
              <div className="flex flex-col gap-4">
                <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-text group-hover:text-primary transition-colors leading-tight">
                  {post.title}
                </h2>
                <p className="text-lg text-textMuted leading-relaxed max-w-2xl group-hover:text-text/80 transition-colors">
                  {post.summary}
                </p>
              </div>

              <div className="flex items-center gap-2 text-primary font-bold text-sm uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-opacity">
                Read Full Entry <ArrowRight size={16} />
              </div>
            </motion.article>
          ))
        )}
      </div>
    </div>
  );
};

export default BlogPage;
