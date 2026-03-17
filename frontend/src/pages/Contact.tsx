import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Send, Mail, MapPin, Phone, Linkedin, Github, Twitter } from 'lucide-react';
import { api } from '../services/api';

const Contact = () => {
  const [formData, setFormData] = useState({ name: '', email: '', subject: '', message: '' });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await api.post('/contact', formData);
      setSuccess(true);
      setFormData({ name: '', email: '', subject: '', message: '' });
    } catch (error) {
      alert('Failed to send message. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const contactOptions = [
    { icon: Mail, label: 'Email', value: 'gupta.aishwary887@gmail.com', link: 'mailto:gupta.aishwary887@gmail.com' },
    { icon: MapPin, label: 'Location', value: 'Lucknow, India', link: '#' },
    { icon: Phone, label: 'Phone', value: '+91 7905638019', link: 'tel:+917905638019' },
  ];

  return (
    <div className="flex flex-col gap-20 py-8 max-w-5xl mx-auto">
      <div className="flex flex-col gap-6 text-center items-center">
        <h1 className="text-5xl md:text-7xl font-bold tracking-tighter text-text">Let's <span className="text-primary italic">Connect.</span></h1>
        <p className="text-xl text-textMuted max-w-2xl leading-relaxed font-medium">
          Ready to bring high-performance solutions to your next project? 
          Drop a line and let's architect the future together.
        </p>
      </div>

      <div className="grid lg:grid-cols-[1.5fr_2fr] gap-12">
        {/* Info Side */}
        <div className="flex flex-col gap-8">
           <div className="flex flex-col gap-4">
              {contactOptions.map((opt) => (
                <a key={opt.label} href={opt.link} className="glass-card p-6 flex items-center gap-6 border-white/5 hover:bg-white/[0.04] transition-colors group">
                  <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary group-hover:scale-110 transition-transform">
                    <opt.icon size={24} />
                  </div>
                  <div className="flex flex-col">
                    <span className="text-xs font-bold uppercase tracking-widest text-textMuted">{opt.label}</span>
                    <span className="text-text font-semibold">{opt.value}</span>
                  </div>
                </a>
              ))}
           </div>

           <div className="glass-card p-10 border-white/5 bg-gradient-to-br from-primary/10 to-transparent">
              <h3 className="text-xl font-bold text-text mb-4">Social Ecosystem</h3>
              <div className="flex gap-4">
                {[Github, Linkedin, Twitter].map((Icon, i) => (
                  <a key={i} href="#" className="w-12 h-12 glass-card flex items-center justify-center text-text hover:text-primary hover:border-primary/40 transition-all">
                    <Icon size={20} />
                  </a>
                ))}
              </div>
           </div>
        </div>

        {/* Form Side */}
        <motion.div 
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="glass-card p-10 md:p-12 border-white/5 bg-white/[0.02]"
        >
          {success ? (
            <div className="h-full flex flex-col items-center justify-center text-center gap-6">
              <div className="w-20 h-20 rounded-full bg-green-500/20 text-green-500 flex items-center justify-center">
                 <Send size={32} />
              </div>
              <h2 className="text-2xl font-bold text-text uppercase tracking-tighter">Transmission Successful</h2>
              <p className="text-textMuted font-medium">I've received your request and will respond within 24 hours.</p>
              <button 
                onClick={() => setSuccess(false)}
                className="btn-secondary text-xs uppercase tracking-widest font-bold"
              >
                Send Another
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="flex flex-col gap-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div className="flex flex-col gap-2">
                  <label className="text-xs font-black uppercase tracking-widest text-textMuted ml-1">Full Name</label>
                  <input
                    type="text"
                    required
                    className="input-field"
                    placeholder="Enter your name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  />
                </div>
                <div className="flex flex-col gap-2">
                  <label className="text-xs font-black uppercase tracking-widest text-textMuted ml-1">Email Address</label>
                  <input
                    type="email"
                    required
                    className="input-field"
                    placeholder="name@company.com"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  />
                </div>
              </div>
              
              <div className="flex flex-col gap-2">
                <label className="text-xs font-black uppercase tracking-widest text-textMuted ml-1">Subject</label>
                <input
                  type="text"
                  required
                  className="input-field"
                  placeholder="Inquiry about..."
                  value={formData.subject}
                  onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                />
              </div>

              <div className="flex flex-col gap-2">
                <label className="text-xs font-black uppercase tracking-widest text-textMuted ml-1">Message</label>
                <textarea
                  required
                  rows={5}
                  className="input-field h-auto min-h-[150px] py-4 resize-none"
                  placeholder="How can I help you today?"
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="btn-primary mt-4 py-4 rounded-2xl text-base group"
              >
                {loading ? 'Transmitting...' : (
                  <>
                    Send Message
                    <Send className="w-5 h-5 ml-2 transition-transform group-hover:translate-x-1 group-hover:-translate-y-1" />
                  </>
                )}
              </button>
            </form>
          )}
        </motion.div>
      </div>
    </div>
  );
};

export default Contact;
