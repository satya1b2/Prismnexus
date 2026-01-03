
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { X, Mail, Lock, Github, Chrome, ArrowRight, ShieldCheck, Zap, Crown } from 'lucide-react';

interface AuthModalProps {
  onClose: () => void;
  onSuccess: (isOwner: boolean) => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({ onClose, onSuccess }) => {
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    // Simulate High-Security Auth Flow
    setTimeout(() => {
      setLoading(false);
      // Sovereign Recognition: satyajitna496@gmail.com
      const isSovereign = email.toLowerCase().trim() === 'satyajitna496@gmail.com';
      const isLegacyOwner = email.toLowerCase().trim() === 'owner@prism.nexus';
      
      // Verification logic for the Sovereign sector
      if ((isSovereign || isLegacyOwner) && password === 'nexus-sovereign') {
        onSuccess(true);
      } else if (email && password.length >= 8) {
        // Standard user login for non-sovereign entities
        onSuccess(false);
      } else {
        setError('Verification failed. Sector access denied.');
      }
    }, 1200);
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9, backdropFilter: "blur(0px)" }}
      animate={{ opacity: 1, scale: 1, backdropFilter: "blur(20px)" }}
      exit={{ opacity: 0, scale: 0.9, backdropFilter: "blur(0px)" }}
      className="fixed inset-0 z-[110] flex items-center justify-center p-6"
    >
      <div className="absolute inset-0 bg-slate-950/60" onClick={onClose} />
      
      <div className="relative w-full max-w-[500px] glass-panel rounded-[48px] border border-white/20 shadow-[0_0_120px_rgba(79,70,229,0.3)] overflow-hidden">
        <div className="h-2 w-full bg-gradient-to-r from-fuchsia-600 via-indigo-500 to-cyan-400 animate-gradient-x" />
        
        <div className="p-12">
          <button 
            onClick={onClose}
            className="absolute top-10 right-10 p-2.5 hover:bg-white/10 rounded-full transition-colors text-slate-500 hover:text-white"
          >
            <X className="w-6 h-6" />
          </button>

          <div className="text-center mb-12">
            <div className="w-16 h-16 bg-white/5 rounded-3xl flex items-center justify-center border border-white/10 mx-auto mb-6 shadow-2xl">
              <ShieldCheck className="w-8 h-8 text-indigo-400" />
            </div>
            <h2 className="text-4xl font-black mb-3 tracking-tighter text-white uppercase">Initialize Link</h2>
            <p className="text-slate-500 text-sm font-bold uppercase tracking-widest opacity-60">
              Sovereign Authentication Protocol
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2.5">
              <label className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-500 ml-1">Identity Vector</label>
              <div className="relative group">
                <Mail className="absolute left-5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-600 group-focus-within:text-indigo-400 transition-colors" />
                <input 
                  required
                  type="email" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="satyajitna496@gmail.com"
                  className="w-full bg-white/5 border border-white/10 rounded-[24px] pl-14 pr-6 py-5 text-sm font-semibold focus:outline-none focus:border-indigo-500/50 transition-all text-white placeholder:text-slate-700"
                />
              </div>
            </div>

            <div className="space-y-2.5">
              <label className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-500 ml-1">Sovereign Key</label>
              <div className="relative group">
                <Lock className="absolute left-5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-600 group-focus-within:text-indigo-400 transition-colors" />
                <input 
                  required
                  type="password" 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full bg-white/5 border border-white/10 rounded-[24px] pl-14 pr-6 py-5 text-sm font-semibold focus:outline-none focus:border-indigo-500/50 transition-all text-white placeholder:text-slate-700 font-mono"
                />
              </div>
            </div>

            {error && (
              <motion.div 
                initial={{ opacity: 0, y: -10 }} 
                animate={{ opacity: 1, y: 0 }}
                className="text-red-400 text-[10px] font-black uppercase tracking-widest text-center py-2 bg-red-500/10 rounded-xl border border-red-500/20"
              >
                {error}
              </motion.div>
            )}

            <button 
              type="submit"
              disabled={loading}
              className="w-full bg-white text-black hover:bg-indigo-500 hover:text-white disabled:bg-white/20 py-6 rounded-[28px] text-xs font-black uppercase tracking-[0.3em] transition-all shadow-2xl active:scale-[0.98] flex items-center justify-center gap-4 mt-4"
            >
              {loading ? (
                <div className="w-6 h-6 border-3 border-black/20 border-t-black rounded-full animate-spin" />
              ) : (
                <>Establish Connection <ArrowRight className="w-4 h-4" /></>
              )}
            </button>
          </form>

          <div className="mt-12 pt-10 border-t border-white/5 flex items-center justify-between opacity-40">
            <div className="flex items-center gap-3">
              <Crown className="w-4 h-4 text-fuchsia-400" />
              <span className="text-[9px] font-black uppercase tracking-widest">Sovereign Mode Ready</span>
            </div>
            <div className="flex items-center gap-3">
              <Zap className="w-4 h-4 text-cyan-400" />
              <span className="text-[9px] font-black uppercase tracking-widest">AES-256 Link</span>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};
