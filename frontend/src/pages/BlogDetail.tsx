import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, Calendar, Tag, MessageSquare, Send, User, Lock, Copy, Check, Quote, Info, Zap, ChevronRight } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { api } from '../services/api';
import { useAuthStore } from '../store/useAuthStore';
import toast from 'react-hot-toast';

interface Comment {
  _id: string;
  user: {
    _id: string;
    name: string;
    email: string;
  };
  text: string;
  createdAt: string;
}

interface Blog {
  _id: string;
  title: string;
  content: string;
  summary: string;
  createdAt: string;
  tags: string[];
  comments: Comment[];
}

const BlogDetail = () => {
  const { slug } = useParams<{ slug: string }>();
  const [blog, setBlog] = useState<Blog | null>(null);
  const [loading, setLoading] = useState(true);
  const [commentText, setCommentText] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [copiedCode, setCopiedCode] = useState<string | null>(null);
  const { user } = useAuthStore();

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

  const handleCommentSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      toast.error('You must be forged in the ecosystem to comment.');
      return;
    }
    if (!commentText.trim()) return;

    setSubmitting(true);
    try {
      const response = await api.post(`/blogs/${blog?._id}/comments`, { text: commentText });
      if (blog) {
        setBlog({
          ...blog,
          comments: [...blog.comments, response.data.data]
        });
      }
      setCommentText('');
      toast.success('Thought successfully forged into the discussion!');
    } catch (error) {
      toast.error('Failed to materialize your comment.');
    } finally {
      setSubmitting(false);
    }
  };

  const copyToClipboard = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(code);
    toast.success('Code captured in the buffer!');
    setTimeout(() => setCopiedCode(null), 2000);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <div className="w-12 h-12 rounded-2xl border-2 border-primary border-t-transparent animate-spin" />
      </div>
    );
  }

  if (!blog) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh] gap-4">
        <h2 className="text-2xl font-black uppercase tracking-tighter italic text-white">Article <span className="text-primary">Eradicated.</span></h2>
        <Link to="/blog" className="text-primary font-bold hover:underline flex items-center gap-2 text-sm">
          <ArrowLeft className="w-4 h-4" /> Return to the Archive
        </Link>
      </div>
    );
  }

  return (
    <motion.article 
      initial={{ opacity: 0, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
      className="max-w-4xl mx-auto py-24 px-4 md:px-0 flex flex-col gap-12"
    >
      <Link to="/blog" className="text-textMuted hover:text-primary transition-all flex items-center gap-3 text-xs font-black uppercase tracking-[0.3em] group/back">
        <div className="p-2 rounded-full bg-white/5 border border-white/5 group-hover/back:border-primary/30 transition-colors">
          <ArrowLeft className="w-4 h-4" />
        </div>
        Back to Knowledge Base
      </Link>

      <div className="space-y-8">
        <h1 className="text-6xl md:text-8xl font-black tracking-tighter leading-[0.85] text-white uppercase italic">
          {blog.title.split(' ').map((word, i) => (
            <React.Fragment key={i}>
              <span className={i % 4 === 2 ? "text-primary drop-shadow-[0_0_15px_rgba(var(--primary-rgb),0.3)]" : ""}>{word}</span>{' '}
            </React.Fragment>
          ))}
        </h1>
        
        <div className="flex flex-wrap items-center gap-10 text-[11px] font-black uppercase tracking-[0.25em] text-textMuted">
          <div className="flex items-center gap-4">
            <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center border border-primary/20">
               <Calendar className="w-4 h-4 text-primary" />
            </div>
            <time dateTime={blog.createdAt}>
              {new Date(blog.createdAt).toLocaleDateString('en-US', {
                month: 'long',
                day: 'numeric',
                year: 'numeric',
              })}
            </time>
          </div>
          <div className="flex items-center gap-4">
            <div className="w-8 h-8 rounded-lg bg-accent-purple/10 flex items-center justify-center border border-accent-purple/20">
               <Tag className="w-4 h-4 text-accent-purple" />
            </div>
            <div className="flex gap-4">
              {blog.tags?.map((tag) => (
                <span key={tag} className="hover:text-white transition-colors cursor-pointer">#{tag}</span>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="glass-card p-10 md:p-16 lg:p-20 border-white/5 bg-white/5 relative overflow-visible">
        <div className="absolute top-0 right-0 w-full h-[500px] bg-gradient-to-b from-primary/5 via-transparent to-transparent opacity-30 pointer-events-none" />
        <div className="absolute top-0 left-0 w-64 h-64 bg-primary/10 blur-[120px] rounded-full -translate-y-1/2 -translate-x-1/2" />
        
        <div className="prose prose-invert prose-2xl max-w-none relative z-10 
          prose-headings:font-black prose-headings:tracking-[ -0.05em] prose-headings:uppercase prose-headings:italic
          prose-h1:text-6xl prose-h1:mb-12 prose-h1:text-white
          prose-h2:text-5xl prose-h2:mt-32 prose-h2:mb-12 prose-h2:text-primary prose-h2:flex prose-h2:items-center prose-h2:gap-6
          prose-h3:text-3xl prose-h3:mt-20 prose-h3:mb-8 prose-h3:text-white prose-h3:tracking-tighter
          prose-p:text-text prose-p:leading-[1.8] prose-p:font-medium prose-p:mb-12 prose-p:text-xl
          prose-strong:text-white prose-strong:font-black prose-strong:tracking-tighter prose-strong:bg-white/5 prose-strong:px-1 prose-strong:rounded
          prose-pre:bg-transparent prose-pre:p-0 prose-pre:m-0
          prose-li:text-text prose-li:font-medium prose-li:mb-4 prose-li:text-xl prose-li:leading-relaxed
          prose-table:my-20 prose-table:border-none prose-table:bg-transparent"
        >
          <ReactMarkdown 
            remarkPlugins={[remarkGfm]}
            components={{
              h2({ children, ...props }: any) {
                return (
                  <h2 {...props}>
                    <div className="flex flex-col gap-1">
                       <span className="w-12 h-[3px] bg-primary block" />
                       <span className="w-6 h-[3px] bg-primary/30 block" />
                    </div>
                    {children}
                  </h2>
                );
              },
              blockquote({ children }: any) {
                return (
                  <div className="my-16 p-12 bg-white/[0.02] border-l-[6px] border-primary rounded-[40px] relative group/callout shadow-[inset_0_0_40px_rgba(0,0,0,0.3)] overflow-hidden">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 blur-3xl rounded-full" />
                    <Quote className="absolute top-8 right-12 w-16 h-16 text-primary opacity-10 group-hover/callout:opacity-20 transition-opacity" />
                    <div className="text-2xl italic font-black text-white leading-[1.6] relative z-10">
                      {children}
                    </div>
                  </div>
                );
              },
              table({ children }: any) {
                return (
                  <div className="my-20 overflow-hidden rounded-[32px] border border-white/5 bg-black/40 shadow-2xl relative group/table">
                    <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-50" />
                    <table className="w-full text-left border-collapse relative z-10">
                      {children}
                    </table>
                  </div>
                );
              },
              thead({ children }: any) {
                return <thead className="bg-white/[0.03] border-b border-white/10">{children}</thead>;
              },
              th({ children }: any) {
                return (
                  <th className="px-8 py-6 text-xs font-black uppercase tracking-[0.3em] text-primary">
                    <div className="flex items-center gap-2">
                       <ChevronRight className="w-3 h-3" />
                       {children}
                    </div>
                  </th>
                );
              },
              td({ children }: any) {
                return (
                  <td className="px-8 py-6 text-base text-text border-b border-white-[0.02] font-medium leading-relaxed">
                    {children}
                  </td>
                );
              },
              img({ src, alt }: any) {
                 return (
                   <figure className="my-20 space-y-6">
                     <div className="relative group/asset overflow-hidden rounded-[40px] border border-white/10 shadow-[0_40px_80px_rgba(0,0,0,0.5)]">
                        <img 
                          src={src} 
                          alt={alt} 
                          className="w-full h-auto object-cover transition-transform duration-1000 group-hover/asset:scale-105" 
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-transparent to-transparent opacity-80" />
                        <div className="absolute bottom-8 left-10 flex items-center gap-4">
                           <div className="p-3 bg-primary/30 backdrop-blur-xl rounded-2xl border border-white/20 shadow-xl">
                              <Zap size={20} className="text-primary animate-pulse" />
                           </div>
                           <div className="flex flex-col">
                              <span className="text-[10px] font-black uppercase tracking-[0.4em] text-primary">Master Visual Archive</span>
                              <span className="text-xs font-black uppercase tracking-widest text-white/60">Asset Protocol {Math.random().toString(16).slice(2, 6).toUpperCase()}</span>
                           </div>
                        </div>
                     </div>
                     {alt && (
                       <figcaption className="text-center text-[10px] font-black uppercase tracking-[0.5em] text-textMuted flex items-center justify-center gap-6 opacity-60">
                         <div className="w-12 h-[1px] bg-gradient-to-r from-transparent to-white/20" /> 
                         {alt} 
                         <div className="w-12 h-[1px] bg-gradient-to-l from-transparent to-white/20" />
                       </figcaption>
                     )}
                   </figure>
                 );
              },
              code({ node, inline, className, children, ...props }: any) {
                const match = /language-(\w+)/.exec(className || '');
                const content = String(children).replace(/\n$/, '');
                
                return !inline && match ? (
                  <div className="relative group/code my-16 shadow-2xl">
                    <div className="absolute -inset-[2px] bg-gradient-to-r from-primary/30 via-accent-purple/30 to-primary/30 rounded-3xl blur-md opacity-20 group-hover/code:opacity-50 transition-all duration-500" />
                    <div className="absolute top-6 right-8 z-20 opacity-0 group-hover/code:opacity-100 transition-all translate-x-2 group-hover/code:translate-x-0">
                      <button 
                        onClick={() => copyToClipboard(content)}
                        className="flex items-center gap-3 px-4 py-2 rounded-xl bg-white/10 hover:bg-primary/20 text-white font-black text-[10px] uppercase tracking-widest transition-all border border-white/10 hover:border-primary/40 active:scale-95"
                      >
                        {copiedCode === content ? (
                          <><Check size={12} className="text-primary" /> Captured</>
                        ) : (
                          <><Copy size={12} /> Buffer Code</>
                        )}
                      </button>
                    </div>
                    <div className="absolute top-0 left-12 px-6 py-2 text-[10px] font-black uppercase tracking-[0.3em] text-primary bg-[#080808] border-x border-b border-white/10 rounded-b-2xl z-20 shadow-xl">
                      {match[1]}
                    </div>
                    <SyntaxHighlighter
                      style={vscDarkPlus}
                      language={match[1]}
                      PreTag="div"
                      className="rounded-3xl !bg-[#080808] !p-12 !pt-20 border border-white/5 !m-0 !text-[17px] leading-[1.7] scrollbar-hide selection:bg-primary/30"
                      {...props}
                    >
                      {content}
                    </SyntaxHighlighter>
                    <div className="absolute bottom-4 right-8 flex gap-1 items-center opacity-20 group-hover/code:opacity-40 transition-opacity">
                       <div className="w-1 h-1 rounded-full bg-white" />
                       <div className="w-1 h-1 rounded-full bg-white/50" />
                       <div className="w-1 h-1 rounded-full bg-white/20" />
                    </div>
                  </div>
                ) : (
                  <code className="px-2 py-0.5 rounded-lg bg-primary/10 text-primary font-black text-sm border border-primary/20 selection:bg-primary/30" {...props}>
                    {children}
                  </code>
                );
              }
            }}
          >
            {blog.content}
          </ReactMarkdown>
        </div>
      </div>

      {/* Discussion Section */}
      <section className="mt-32 space-y-16">
        <div className="flex items-center gap-8">
          <div className="p-5 bg-primary/10 text-primary rounded-[32px] border border-primary/20 shadow-[0_0_40px_rgba(var(--primary-rgb),0.2)]">
             <MessageSquare size={36} />
          </div>
          <div className="space-y-1">
            <h2 className="text-5xl font-black uppercase tracking-tighter italic text-white leading-tight">The <span className="text-primary">Synthesis Archive.</span></h2>
            <p className="text-xs text-textMuted font-black uppercase tracking-[0.4em] mt-2">Transmission Record: {blog.comments.length} Thoughts Persisted</p>
          </div>
        </div>

        {/* Comment Form */}
        <div className="glass-card p-12 md:p-16 border-white/5 bg-white/5 relative overflow-hidden group">
          <div className="absolute top-0 left-0 w-full h-[3px] bg-gradient-to-r from-transparent via-primary to-transparent opacity-30" />
          {!user && (
            <div className="absolute inset-0 z-20 bg-black/80 backdrop-blur-3xl flex flex-col items-center justify-center text-center gap-10 p-16">
               <div className="relative">
                 <div className="p-8 rounded-full bg-primary/10 text-primary border border-primary/20 scale-125 mb-4 animate-pulse-slow">
                   <Lock size={48} />
                 </div>
                 <div className="absolute -inset-4 bg-primary/20 blur-[60px] rounded-full animate-pulse shadow-2xl" />
               </div>
               <div className="space-y-4 relative z-10">
                 <h3 className="text-4xl font-black uppercase tracking-tighter text-white">Identity Breach <span className="text-primary italic">Detected.</span></h3>
                 <p className="text-lg text-textMuted font-medium max-w-md mx-auto leading-relaxed">Synthesis of new data requires an active link to the Forge core. Please verify your identity to proceed with transmission.</p>
               </div>
               <div className="flex gap-8 relative z-10">
                 <Link to="/login" className="btn-primary py-4 px-16 text-xs rounded-full font-black uppercase tracking-[0.3em] shadow-[0_15px_35px_rgba(var(--primary-rgb),.3)] hover:scale-105 active:scale-95 transition-all">Establish Link</Link>
                 <Link to="/register" className="btn-secondary py-4 px-16 text-xs rounded-full font-black uppercase tracking-[0.3em] border border-white/10 hover:bg-white/5 transition-all">Initialize Identity</Link>
               </div>
            </div>
          )}
          
          <form onSubmit={handleCommentSubmit} className="grid grid-cols-1 gap-10">
             <div className="flex flex-col gap-6">
                <div className="flex items-center justify-between">
                   <div className="flex items-center gap-4">
                      <div className="flex gap-1">
                         <div className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
                         <div className="w-1.5 h-1.5 rounded-full bg-primary/40 animate-pulse delay-75" />
                         <div className="w-1.5 h-1.5 rounded-full bg-primary/10 animate-pulse delay-150" />
                      </div>
                      <label className="text-[10px] font-black uppercase tracking-[0.5em] text-textMuted">Data Stream Buffer Alpha</label>
                   </div>
                   {user && (
                     <div className="bg-primary/10 px-4 py-1 rounded-full border border-primary/20">
                        <span className="text-[10px] font-black uppercase tracking-widest text-primary flex items-center gap-3">
                           <User size={12} className="animate-bounce" /> Uplink Active: {user.name}
                        </span>
                     </div>
                   )}
                </div>
                <textarea 
                  className="input-field min-h-[220px] py-10 px-12 resize-none transition-all focus:min-h-[320px] text-xl leading-[1.8] placeholder:text-white/5 border-white/5 bg-white/[0.01] rounded-[40px] shadow-inner focus:bg-white/[0.03] focus:border-primary/20"
                  placeholder="Record your technical contribution to the communal knowledge grid..."
                  value={commentText}
                  onChange={(e) => setCommentText(e.target.value)}
                  disabled={!user || submitting}
                />
             </div>
             <div className="flex justify-end">
                <button 
                  type="submit" 
                  disabled={!user || submitting || !commentText.trim()}
                  className="btn-primary py-5 px-16 text-xs rounded-full flex items-center gap-6 group/btn font-black uppercase tracking-[0.4em] shadow-2xl shadow-primary/20 hover:shadow-primary/50 active:scale-95 transition-all disabled:grayscale disabled:opacity-50"
                >
                  {submitting ? (
                    <div className="flex items-center gap-4">
                       <div className="w-5 h-5 border-3 border-white/30 border-t-white rounded-full animate-spin" />
                       PERSISTING...
                    </div>
                  ) : (
                    <>COMMIT DATA <Send size={20} className="group-hover/btn:translate-x-2 group-hover/btn:-translate-y-2 transition-transform duration-500" /></>
                  )}
                </button>
             </div>
          </form>
        </div>

        {/* Comments List */}
        <div className="space-y-12">
           {blog.comments.map((comment, index) => (
             <motion.div 
               initial={{ opacity: 0, y: 40, rotateX: 15 }}
               animate={{ opacity: 1, y: 0, rotateX: 0 }}
               transition={{ delay: index * 0.12, type: 'spring', damping: 15, mass: 1.2 }}
               key={comment._id} 
               className="glass-card p-10 md:p-12 border-white/10 bg-white/[0.03] hover:bg-white/[0.06] transition-all hover:-translate-y-2 group/comment relative overflow-hidden"
             >
                <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 blur-3xl opacity-0 group-hover/comment:opacity-100 transition-opacity" />
                <div className="flex items-start gap-10">
                   <div className="relative shrink-0">
                      <div className="w-20 h-20 rounded-3xl bg-gradient-to-br from-primary/10 via-primary/20 to-accent-purple/20 flex items-center justify-center text-primary font-black text-3xl shadow-2xl border border-white/10 group-hover/comment:border-primary/40 transition-colors relative z-10 overflow-hidden">
                        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-10" />
                        {comment.user.name[0].toUpperCase()}
                      </div>
                      <div className="absolute -inset-4 bg-primary/20 blur-2xl rounded-full opacity-0 group-hover/comment:opacity-60 transition-opacity" />
                   </div>
                   <div className="flex-1 space-y-6">
                      <div className="flex justify-between items-start">
                        <div>
                          <span className="text-2xl font-black text-white group-hover/comment:text-primary transition-colors block leading-none tracking-tight underline decoration-primary/0 group-hover/comment:decoration-primary/30 underline-offset-8 duration-500">{comment.user.name}</span>
                          <span className="text-[10px] font-black text-primary/40 uppercase tracking-[0.5em] mt-3 block">Level 01 Contributor // Archive Core</span>
                        </div>
                        <div className="flex flex-col items-end gap-3 text-right">
                           <span className="text-[10px] font-black text-textMuted uppercase tracking-[0.3em] flex items-center gap-3 bg-white/5 py-1 px-3 rounded-lg border border-white/5">
                              <Calendar size={12} className="text-primary" /> {new Date(comment.createdAt).toLocaleDateString('en-US', { day: '2-digit', month: 'short', year: 'numeric' })}
                           </span>
                           <div className="w-16 h-[2px] bg-gradient-to-l from-primary/40 to-transparent" />
                        </div>
                      </div>
                      <div className="relative">
                        <Quote className="absolute -top-4 -left-6 w-12 h-12 text-primary/5 -rotate-12 transition-transform group-hover/comment:rotate-0 duration-700" />
                        <p className="text-xl text-text leading-[1.8] pl-8 border-l-[3px] border-primary/20 group-hover/comment:border-primary/50 transition-colors italic font-medium selection:bg-primary/40 relative z-10">
                          "{comment.text}"
                        </p>
                      </div>
                   </div>
                </div>
             </motion.div>
           ))}
           {blog.comments.length === 0 && (
              <div className="text-center py-32 bg-white/[0.02] rounded-[60px] border border-dashed border-white/10 flex flex-col items-center gap-8 group hover:bg-white/[0.04] transition-all duration-700">
                 <div className="relative">
                    <div className="p-8 rounded-full bg-white/5 text-white/5 group-hover:text-primary/10 transition-colors border border-white/5 group-hover:border-primary/10 scale-150">
                       <Info size={48} />
                    </div>
                    <div className="absolute -inset-8 bg-white/5 blur-[80px] rounded-full opacity-0 group-hover:opacity-100 transition-opacity" />
                 </div>
                 <div className="space-y-4">
                    <p className="text-textMuted font-black uppercase tracking-[0.6em] text-sm">Silence Protocols Active</p>
                    <p className="text-[11px] text-white/10 font-black uppercase tracking-[0.4em] group-hover:text-primary/40 transition-colors">Awaiting first technical transmission to the grid...</p>
                 </div>
              </div>
           )}
        </div>
      </section>
    </motion.article>
  );
};

export default BlogDetail;
