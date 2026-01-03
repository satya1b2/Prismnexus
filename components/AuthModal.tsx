
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { X, Mail, Lock, Github, Chrome, ArrowRight, ShieldCheck, Zap } from 'lucide-react';

interface AuthModalProps {
  onClose: () => void;
  onSuccess: (isOwner: boolean) => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({ onClose, onSuccess }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    // Simulate Auth API delay
    setTimeout(() => {
      setLoading(false);
      // Secret Owner Credentials - Added virendrachat123@gmail.com
      const isOwnerEmail = email === 'owner@prism.nexus' || email === 'virendrachat123@gmail.com';
      if (isOwnerEmail && password === 'nexus-sovereign') {
        onSuccess(true);
      } else {
        // Allow general login for demo purposes but as standard user
        onSuccess(false);
      }
    }, 1500);
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95, y: 20 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95, y: 20 }}
      className="fixed inset-0 z-[110] flex items-center justify-center p-6"
    >
      <div className="absolute inset-0 bg-slate-950/40 backdrop-blur-md" onClick={onClose} />
      
      <div className="relative w-full max-w-[480px] glass-panel rounded-[40px] border border-white/20 shadow-[0_0_100px_rgba(79,70,229,0.2)] overflow-hidden">
        <div className="h-1.5 w-full bg-gradient-to-r from-indigo-600 via-cyan-400 to-indigo-600" />
        
        <div className="p-10 lg:p-12">
          <button 
            onClick={onClose}
            className="absolute top-8 right-8 p-2 hover:bg-white/10 rounded-full transition-colors text-slate-500 hover:text-white"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="text-center mb-10">
            <h2 className="text-3xl font-black mb-3 tracking-tight">
              {isLogin ? 'Access Nexus' : 'Initialize Identity'}
            </h2>
            <p className="text-slate-500 text-sm font-medium">
              Enter your credentials to connect to the sovereign grid.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-1">Secure Email</label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-600" />
                <input 
                  required
                  type="email" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="virendrachat123@gmail.com"
                  className="w-full bg-white/5 border border-white/10 rounded-2xl pl-12 pr-4 py-4 text-sm font-medium focus:outline-none focus:border-indigo-500/50 transition-all text-white placeholder:text-slate-700"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-1">Access Key</label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-600" />
                <input 
                  required
                  type="password" 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full bg-white/5 border border-white/10 rounded-2xl pl-12 pr-4 py-4 text-sm font-medium focus:outline-none focus:border-indigo-500/50 transition-all text-white placeholder:text-slate-700"
                />
              </div>
            </div>

            {error && <div className="text-red-400 text-[10px] font-bold uppercase text-center mt-2">{error}</div>}

            <button 
              type="submit"
              disabled={loading}
              className="w-full bg-indigo-600 hover:bg-indigo-500 disabled:bg-indigo-600/50 text-white py-5 rounded-2xl text-sm font-black uppercase tracking-widest transition-all shadow-xl shadow-indigo-600/20 flex items-center justify-center gap-3 active:scale-95 mt-4"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-white/20 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  {isLogin ? 'Grant Access' : 'Create Cluster'} <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          <div className="relative my-10">
            <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-white/5" /></div>
            <div className="relative flex justify-center text-[10px] font-black uppercase tracking-widest text-slate-700 bg-transparent px-4">Direct Connection</div>
          </div>

          <div className="grid grid-cols-2 gap-4 mb-10">
            <button className="flex items-center justify-center gap-3 bg-white/5 hover:bg-white/10 border border-white/10 py-4 rounded-2xl text-xs font-bold transition-all text-slate-300">
              <Github className="w-4 h-4" /> GitHub
            </button>
            <button className="flex items-center justify-center gap-3 bg-white/5 hover:bg-white/10 border border-white/10 py-4 rounded-2xl text-xs font-bold transition-all text-slate-300">
              <Chrome className="w-4 h-4" /> Google
            </button>
          </div>

          <div className="mt-12 pt-8 border-t border-white/5 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-500" />
              <span className="text-[10px] font-black uppercase tracking-widest text-slate-600">SOC2 Ready</span>
            </div>
            <div className="flex items-center gap-2">
              <Zap className="w-4 h-4 text-cyan-400" />
              <span className="text-[10px] font-black uppercase tracking-widest text-slate-600">Encrypted</span>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};
