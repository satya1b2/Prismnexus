
import React from 'react';
import { motion } from 'framer-motion';
import { Workflow, Bot, BarChart3, Shield, Zap, Globe } from 'lucide-react';

export const Features: React.FC = () => {
  return (
    <section id="product" className="py-48 px-6 max-w-[1400px] mx-auto">
      <div className="text-center mb-32">
        <span className="label-premium text-fuchsia-500 mb-6 block">Capabilities</span>
        <h2 className="text-5xl lg:text-8xl font-black mb-10 tracking-premium text-white">Infinite <span className="text-slate-500">Scale.</span></h2>
        <p className="text-slate-500 max-w-2xl mx-auto text-xl font-medium leading-relaxed">
          Prism Nexus replaces fragmented systems with a singular, monolithic intelligence layer.
        </p>
      </div>

      <div className="bento-grid h-[900px]">
        {/* Main Orchestration Card - Option 1 */}
        <motion.div 
          whileHover={{ y: -8 }}
          className="col-span-12 lg:col-span-8 row-span-2 glass-panel p-16 rounded-[60px] overflow-hidden relative group"
        >
          <div className="absolute inset-0 bg-gradient-to-br from-fuchsia-600/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
          <div className="relative z-10 max-w-md">
            <Workflow className="w-14 h-14 text-white mb-10 opacity-80" />
            <h3 className="text-5xl font-black mb-8 tracking-premium text-white leading-tight">Hyper-Workflow Orchestration</h3>
            <p className="text-slate-300 text-xl leading-relaxed font-medium">
              Seamlessly bridge the gap between human strategy and anonymous execution. Our engine manages thousands of nodes with perfect synchronization and zero data leakage.
            </p>
          </div>
          <div className="absolute right-[-5%] bottom-[-5%] w-1/2 opacity-20 group-hover:opacity-40 transition-all duration-1000 rotate-12 scale-110">
            <div className="grid grid-cols-2 gap-6">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="h-40 bg-white/5 border border-white/10 rounded-[32px] backdrop-blur-xl shadow-2xl" />
              ))}
            </div>
          </div>
        </motion.div>

        {/* Intelligence Card - Option 2 */}
        <motion.div 
          whileHover={{ y: -8 }}
          className="col-span-12 lg:col-span-4 glass-panel p-12 rounded-[60px] relative overflow-hidden group border-fuchsia-500/20"
        >
          <div className="absolute top-0 right-0 p-8">
            <div className="w-2 h-2 rounded-full bg-fuchsia-500 animate-ping" />
          </div>
          <Bot className="w-12 h-12 text-fuchsia-400 mb-8" />
          <h3 className="text-2xl font-black mb-4 text-white tracking-premium">Elite Agents</h3>
          <p className="text-slate-400 text-base leading-relaxed font-medium">
            Trained on proprietary logic models to handle high-stakes decision making without intervention, utilizing real-time web-grounding and mission-specific reasoning.
          </p>
        </motion.div>

        {/* Global Access Card */}
        <motion.div 
          whileHover={{ y: -8 }}
          className="col-span-12 lg:col-span-4 glass-panel p-12 rounded-[60px] border-white/5"
        >
          <Globe className="w-12 h-12 text-cyan-400 mb-8" />
          <h3 className="text-2xl font-black mb-4 text-white tracking-premium">Planetary Grid</h3>
          <p className="text-slate-500 text-base leading-relaxed font-medium">
            Globally distributed compute clusters ensuring zero-lag orchestration in every major region.
          </p>
        </motion.div>

        {/* Analytics Card */}
        <motion.div 
          whileHover={{ y: -8 }}
          className="col-span-12 lg:col-span-4 glass-panel p-12 rounded-[60px] border-white/5"
        >
          <BarChart3 className="w-12 h-12 text-slate-300 mb-8" />
          <h3 className="text-2xl font-black mb-4 text-white tracking-premium">Live Observability</h3>
          <p className="text-slate-500 text-base leading-relaxed font-medium">
            Real-time visual telemetry of every agent thought and action within your secure enclave.
          </p>
        </motion.div>

        {/* Security Card */}
        <motion.div 
          whileHover={{ y: -8 }}
          className="col-span-12 lg:col-span-8 glass-panel p-14 rounded-[60px] flex items-center justify-between group border-white/5"
        >
          <div className="max-w-md">
            <Shield className="w-12 h-12 text-emerald-400 mb-8" />
            <h3 className="text-3xl font-black mb-4 text-white tracking-premium">Zero-Trust Infrastructure</h3>
            <p className="text-slate-500 text-base leading-relaxed font-medium">
              E2E encryption with air-gapped storage available for sovereign enterprise data protection.
            </p>
          </div>
          <div className="hidden lg:flex flex-col gap-4 opacity-40 group-hover:opacity-100 transition-opacity">
             <span className="label-premium px-8 py-3 rounded-2xl border border-white/10 bg-white/5">SOC2 Type II</span>
             <span className="label-premium px-8 py-3 rounded-2xl border border-white/10 bg-white/5">Sovereign-Cloud</span>
          </div>
        </motion.div>
      </div>
    </section>
  );
};
