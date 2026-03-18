import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { UserPlus, Mail, Lock, User, ArrowRight } from 'lucide-react';
import { api } from '../services/api';
import { useAuthStore } from '../store/useAuthStore';
import toast from 'react-hot-toast';

const Register = () => {
  const [formData, setFormData] = useState({ name: '', email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const setAuth = useAuthStore((state) => state.setAuth);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await api.post('/auth/register', formData);
      setAuth(response.data.data);
      toast.success(`Account forged successfully! Welcome, ${response.data.data.user.name}.`);
      navigate('/');
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-md w-full glass-card p-10 space-y-8 border-primary/20 shadow-2xl relative overflow-hidden"
      >
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-accent-purple via-primary to-accent-pink" />
        
        <div className="text-center space-y-2">
          <div className="inline-flex p-4 rounded-2xl bg-primary/10 text-primary mb-4">
            <UserPlus size={32} />
          </div>
          <h2 className="text-3xl font-bold tracking-tighter text-text uppercase">Join The <span className="text-primary italic">Forge.</span></h2>
          <p className="text-sm text-textMuted font-medium">Create your credentials to access pro features and personalized content.</p>
        </div>

        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div className="flex flex-col gap-2">
              <label className="text-xs font-black uppercase tracking-widest text-textMuted ml-1 flex items-center gap-2">
                <User size={12} /> Full Name
              </label>
              <input
                type="text"
                required
                className="input-field"
                placeholder="Architect Name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              />
            </div>
            <div className="flex flex-col gap-2">
              <label className="text-xs font-black uppercase tracking-widest text-textMuted ml-1 flex items-center gap-2">
                <Mail size={12} /> Email Address
              </label>
              <input
                type="email"
                required
                className="input-field"
                placeholder="architect@nexus.com"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              />
            </div>
            <div className="flex flex-col gap-2">
              <label className="text-xs font-black uppercase tracking-widest text-textMuted ml-1 flex items-center gap-2">
                <Lock size={12} /> Password
              </label>
              <input
                type="password"
                required
                className="input-field"
                placeholder="••••••••"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="btn-primary w-full py-4 text-base group"
          >
            {loading ? 'Forging Identity...' : (
              <span className="flex items-center justify-center gap-2">
                Initialize Account <ArrowRight size={18} className="transition-transform group-hover:translate-x-1" />
              </span>
            )}
          </button>
        </form>

        <div className="text-center">
          <p className="text-sm text-textMuted">
            Already a member? {' '}
            <Link to="/login" className="text-primary font-bold hover:underline">
              Log In
            </Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
};

export default Register;
