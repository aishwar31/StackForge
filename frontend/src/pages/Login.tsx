import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { LogIn, Mail, Lock, ArrowRight } from 'lucide-react';
import { api } from '../services/api';
import { useAuthStore } from '../store/useAuthStore';
import toast from 'react-hot-toast';

const Login = () => {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const setAuth = useAuthStore((state) => state.setAuth);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await api.post('/auth/login', formData);
      setAuth(response.data.data);
      toast.success(`Welcome back, ${response.data.data.user.name}!`);
      navigate(response.data.data.user.role === 'admin' ? '/admin' : '/');
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Login failed');
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
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary via-accent-purple to-accent-pink" />
        
        <div className="text-center space-y-2">
          <div className="inline-flex p-4 rounded-2xl bg-primary/10 text-primary mb-4">
            <LogIn size={32} />
          </div>
          <h2 className="text-3xl font-bold tracking-tighter text-text uppercase">Unlock <span className="text-primary italic">Forge.</span></h2>
          <p className="text-sm text-textMuted font-medium">Access your pro features and personalized vault.</p>
        </div>

        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="space-y-4">
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
            {loading ? 'Decrypting Access...' : (
              <span className="flex items-center justify-center gap-2">
                Enter The Forge <ArrowRight size={18} className="transition-transform group-hover:translate-x-1" />
              </span>
            )}
          </button>
        </form>

        <div className="text-center">
          <p className="text-sm text-textMuted">
            New to the ecosystem? {' '}
            <Link to="/register" className="text-primary font-bold hover:underline">
              Create Account
            </Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
};

export default Login;
