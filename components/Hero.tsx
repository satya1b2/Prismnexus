
import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Sparkles, ShieldCheck, Zap } from 'lucide-react';
import { AnimatedPrism } from './AnimatedPrism';

interface HeroProps {
  onStart: () => void;
}

export const Hero: React.FC<HeroProps> = ({ onStart }) => {
  return (
    <section className="relative pt-64 pb-32 px-6 max-w-[1400px] mx-auto overflow-visible">
      <div className="grid lg:grid-cols-2 gap-24 items-center relative z-10">
        <motion.div
          initial={{ y: 30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 1.2, ease: [0.19, 1, 0.22, 1] }}
        >
          <div className="flex gap-4 mb-10">
            <motion.span 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="inline-flex items-center gap-3 px-5 py-2 rounded-full bg-white/[0.03] border border-white/10 text-label-premium text-slate-400 backdrop-blur-3xl"
            >
              <div className="w-1.5 h-1.5 rounded-full bg-fuchsia-500 shadow-[0_0_10px_#C026D3]" />
              Core Network 2.5 Active
            </motion.span>
          </div>
          
          <h1 className="text-8xl lg:text-[130px] font-black leading-[0.82] mb-12 tracking-premium text-white">
            Absolute <br />
            <span className="accent-gradient-text italic">Command.</span>
          </h1>
          
          <p className="text-xl text-slate-500 mb-16 max-w-lg leading-relaxed font-medium">
            Prism Nexus orchestrates anonymous high-stakes operations with surgical precision. The definitive agentic platform for global enterprise infrastructure.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-8 mb-24">
            <button 
              onClick={onStart}
              className="flex items-center justify-center gap-4 bg-white text-black px-12 py-6 rounded-3xl text-xs font-black uppercase tracking-[0.3em] transition-all hover:bg-fuchsia-600 hover:text-white active:scale-95 group shadow-[0_30px_60px_rgba(255,255,255,0.1)]"
            >
              Initialize Nexus <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
            </button>
            <button className="flex items-center justify-center gap-4 bg-white/5 hover:bg-white/10 text-white border border-white/10 px-12 py-6 rounded-3xl text-xs font-black uppercase tracking-[0.3em] transition-all active:scale-95 backdrop-blur-2xl">
              Platform Audit
            </button>
          </div>

          <div className="flex items-center gap-16 opacity-30">
            <div className="flex items-center gap-4">
              <ShieldCheck className="w-5 h-5 text-fuchsia-400" />
              <span className="label-premium text-white">Military Grade Isolation</span>
            </div>
            <div className="flex items-center gap-4">
              <Zap className="w-5 h-5 text-cyan-400" />
              <span className="label-premium text-white">Sub-ms Latency</span>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1.8, ease: [0.19, 1, 0.22, 1] }}
          className="relative h-[800px] flex items-center justify-center overflow-visible"
        >
          <AnimatedPrism />
        </motion.div>
      </div>
      
      {/* Scroll Indicator */}
      <motion.div 
        animate={{ y: [0, 10, 0] }}
        transition={{ duration: 2, repeat: Infinity }}
        className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-3 opacity-20"
      >
        <div className="w-px h-12 bg-gradient-to-b from-white to-transparent" />
        <span className="label-premium text-[8px]">Scroll</span>
      </motion.div>
    </section>
  );
};
