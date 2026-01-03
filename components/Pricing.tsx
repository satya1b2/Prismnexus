
import React from 'react';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';
import { Check, Sparkles } from 'lucide-react';
import { PRICING } from '../constants';

const PricingCard: React.FC<{ tier: any, index: number, onStart?: () => void }> = ({ tier, index, onStart }) => {
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const rotateX = useSpring(useTransform(y, [-0.5, 0.5], [8, -8]), { stiffness: 100, damping: 20 });
  const rotateY = useSpring(useTransform(x, [-0.5, 0.5], [-8, 8]), { stiffness: 100, damping: 20 });

  function handleMouseMove(e: React.MouseEvent<HTMLDivElement>) {
    const rect = e.currentTarget.getBoundingClientRect();
    x.set((e.clientX - rect.left) / rect.width - 0.5);
    y.set((e.clientY - rect.top) / rect.height - 0.5);
  }

  return (
    <motion.div
      initial={{ y: 30, opacity: 0 }}
      whileInView={{ y: 0, opacity: 1 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.1 }}
      onMouseMove={handleMouseMove}
      onMouseLeave={() => { x.set(0); y.set(0); }}
      style={{ rotateX, rotateY, transformStyle: 'preserve-3d' }}
      className={`relative p-12 rounded-[50px] flex flex-col transition-all duration-700 ${
        tier.isPopular 
          ? 'bg-[#0A0F1D] border-2 border-indigo-500/50 shadow-[0_40px_100px_rgba(79,70,229,0.2)] z-10' 
          : 'glass-panel border-white/5'
      }`}
    >
      <div className="[transform:translateZ(40px)] flex flex-col h-full">
        {tier.isPopular && (
          <div className="absolute -top-16 left-1/2 -translate-x-1/2 bg-indigo-600 text-white text-[10px] font-black uppercase tracking-[0.4em] px-8 py-3 rounded-full shadow-2xl">
            Elite Standard
          </div>
        )}

        <div className="mb-12">
          {tier.name !== "Enterprise" && (
            <div className="mb-6 inline-flex items-center gap-3 text-[10px] font-black uppercase tracking-[0.3em] text-emerald-400 px-4 py-2 rounded-xl bg-emerald-500/5 border border-emerald-500/10 w-fit">
              <Sparkles className="w-3.5 h-3.5" /> First 24H Free
            </div>
          )}
          <h3 className={`text-3xl font-black mb-6 ${tier.isPopular ? 'text-indigo-400' : 'text-white'} tracking-tighter`}>{tier.name}</h3>
          <div className="flex items-baseline gap-2">
            <span className="text-6xl font-black text-white">{tier.price}</span>
            {tier.price !== "Custom" && <span className="text-slate-600 font-bold text-sm tracking-widest uppercase">/mo</span>}
          </div>
        </div>

        <div className="flex-grow space-y-6 mb-16">
          {tier.features.map((feature, j) => (
            <div key={j} className="flex items-center gap-5 text-sm font-semibold text-slate-400">
              <div className={`w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 ${tier.isPopular ? 'bg-indigo-500/20' : 'bg-white/5'}`}>
                <Check className={`w-3.5 h-3.5 ${tier.isPopular ? 'text-indigo-400' : 'text-cyan-400'}`} />
              </div>
              {feature}
            </div>
          ))}
        </div>

        <button 
          onClick={onStart}
          className={`w-full py-6 rounded-3xl text-xs font-black uppercase tracking-[0.3em] transition-all hover:scale-[1.02] active:scale-95 ${
          tier.isPopular 
            ? 'bg-indigo-600 hover:bg-indigo-500 text-white shadow-3xl shadow-indigo-600/40' 
            : 'bg-white/5 hover:bg-white/10 text-white border border-white/10'
        }`}>
          {tier.name === "Enterprise" ? "Contact Architecture" : `Start Free Session`}
        </button>
      </div>
    </motion.div>
  );
};

export const Pricing: React.FC<{ onStart?: () => void }> = ({ onStart }) => {
  return (
    <section id="pricing" className="py-48 px-6 max-w-7xl mx-auto [perspective:2000px]">
      <div className="text-center mb-32">
        <h2 className="text-5xl lg:text-7xl font-black mb-8 tracking-tighter text-white">Tiered Refraction.</h2>
        <p className="text-slate-500 text-xl font-medium max-w-2xl mx-auto">Scale your anonymous operations with modular precision.</p>
      </div>

      <div className="grid lg:grid-cols-3 gap-12">
        {PRICING.map((tier, i) => (
          <PricingCard key={i} tier={tier} index={i} onStart={onStart} />
        ))}
      </div>
    </section>
  );
};
