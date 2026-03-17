import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, Calendar, Tag } from 'lucide-react';
import { api } from '../services/api';

interface Blog {
  _id: string;
  title: string;
  content: string;
  summary: string;
  createdAt: string;
  tags: string[];
}

const BlogDetail = () => {
  const { slug } = useParams<{ slug: string }>();
  const [blog, setBlog] = useState<Blog | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBlog = async () => {
      try {
        const response = await api.get(`/blogs/${slug}`);
        setBlog(response.data.data);
      } catch (error) {
        console.error('Error fetching blog:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchBlog();
  }, [slug]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <div className="w-8 h-8 rounded-full border-2 border-primary border-t-transparent animate-spin" />
      </div>
    );
  }

  if (!blog) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh] gap-4">
        <h2 className="text-2xl font-bold">Blog post not found</h2>
        <Link to="/blog" className="text-primary hover:underline flex items-center gap-2">
          <ArrowLeft className="w-4 h-4" /> Back to writing
        </Link>
      </div>
    );
  }

  return (
    <motion.article 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-3xl mx-auto py-12 flex flex-col gap-8"
    >
      <Link to="/blog" className="text-textMuted hover:text-text transition-colors flex items-center gap-2 text-sm">
        <ArrowLeft className="w-4 h-4" /> Back to archive
      </Link>

      <div className="flex flex-col gap-4">
        <h1 className="text-4xl md:text-5xl font-bold tracking-tight leading-tight text-text">
          {blog.title}
        </h1>
        
        <div className="flex flex-wrap items-center gap-6 text-sm text-textMuted">
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4" />
            <time dateTime={blog.createdAt}>
              {new Date(blog.createdAt).toLocaleDateString('en-US', {
                month: 'long',
                day: 'numeric',
                year: 'numeric',
              })}
            </time>
          </div>
          <div className="flex items-center gap-2">
            <Tag className="w-4 h-4" />
            <div className="flex gap-2">
              {blog.tags?.map((tag) => (
                <span key={tag} className="text-primary hover:underline">#{tag}</span>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div 
        className="prose prose-lg max-w-none 
          prose-headings:font-bold prose-headings:tracking-tight 
          prose-headings:text-text
          prose-p:text-textMuted prose-p:leading-relaxed
          prose-a:text-primary prose-a:no-underline hover:prose-a:underline
          prose-strong:text-text prose-code:text-primary
          border-t border-border pt-8 mt-4"
      >
        {/* For now rendering content as raw text, but with basic whitespace formatting */}
        <div className="whitespace-pre-wrap">{blog.content}</div>
      </div>
    </motion.article>
  );
};

export default BlogDetail;
