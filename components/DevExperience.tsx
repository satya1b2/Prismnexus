
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Copy, Check } from 'lucide-react';
import { BADGES } from '../constants';

export const DevExperience: React.FC = () => {
  const [copied, setCopied] = useState(false);
  const codeString = `const agent = createAgent({
  name: 'Nexus-1',
  task: 'Workflow_Optimization',
  llm: 'Nexus-Core-Turbo'
});

await agent.orchestrate([
  'Data_Extraction',
  'Logic_Reasoning',
  'API_Callback'
]);`;

  const handleCopy = () => {
    navigator.clipboard.writeText(codeString);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <section className="py-24 px-6 max-w-7xl mx-auto overflow-hidden">
      <div className="grid lg:grid-cols-2 gap-16 items-center">
        <div>
          <div className="w-12 h-1 bg-indigo-500 mb-8 rounded-full" />
          <h2 className="text-3xl lg:text-5xl font-bold mb-6">Built for Developers.</h2>
          <p className="text-slate-400 text-lg mb-8 leading-relaxed">
            Nexus isn't just a platform; it's an SDK. Extend Nexus with your own logic. Our primitives provide first-class support for state management, tool-calling, and feedback loops.
          </p>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {BADGES.map((badge, i) => (
              <motion.div 
                key={i}
                initial={{ x: -20, opacity: 0 }}
                whileInView={{ x: 0, opacity: 1 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="flex items-center gap-3 p-4 rounded-2xl bg-white/[0.03] border border-white/10 hover:border-white/20 transition-colors"
              >
                <div className="p-2 rounded-lg bg-white/5">
                  {badge.icon}
                </div>
                <span className="text-sm font-semibold text-slate-200">{badge.label}</span>
              </motion.div>
            ))}
          </div>
        </div>

        <motion.div
          initial={{ y: 40, opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          viewport={{ once: true, margin: "-100px" }}
          className="relative group"
        >
          {/* Subtle Backglow */}
          <div className="absolute -inset-1 bg-gradient-to-r from-indigo-500 to-cyan-500 rounded-2xl blur opacity-20 group-hover:opacity-40 transition duration-1000 group-hover:duration-200" />
          
          {/* Editor Mockup */}
          <div className="relative rounded-2xl border border-white/10 bg-[#0B1120] overflow-hidden shadow-2xl">
            <div className="flex items-center justify-between px-4 py-3 bg-[#111827] border-b border-white/5">
              <div className="flex items-center gap-2">
                <div className="flex gap-1.5">
                  <div className="w-3 h-3 rounded-full bg-red-500/20 border border-red-500/40" />
                  <div className="w-3 h-3 rounded-full bg-yellow-500/20 border border-yellow-500/40" />
                  <div className="w-3 h-3 rounded-full bg-green-500/20 border border-green-500/40" />
                </div>
                <span className="text-[10px] text-slate-500 font-mono ml-4 uppercase tracking-widest">nexus-agent.ts</span>
              </div>
              <button 
                onClick={handleCopy}
                className="text-slate-500 hover:text-white transition-colors"
                title="Copy Code"
              >
                {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
              </button>
            </div>
            <div className="p-6 font-mono text-sm leading-relaxed overflow-x-auto bg-[#020617]/50">
              <pre className="text-slate-300">
                {codeString.split('\n').map((line, i) => (
                  <motion.div 
                    key={i} 
                    className="flex hover:bg-white/[0.02] transition-colors -mx-6 px-6"
                    initial={{ opacity: 0, x: 10 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.2 + i * 0.05 }}
                  >
                    <span className="w-8 text-slate-700 select-none">{i + 1}</span>
                    <span>
                      {line.split(' ').map((word, j) => {
                        if (['const', 'await'].includes(word)) return <span key={j} className="text-indigo-400">{word} </span>;
                        if (word.startsWith("'") || word.endsWith("'") || word.includes("llm:")) return <span key={j} className="text-emerald-400">{word} </span>;
                        if (word.includes('agent.')) return <span key={j} className="text-cyan-400">{word} </span>;
                        return word + ' ';
                      })}
                    </span>
                  </motion.div>
                ))}
              </pre>
            </div>
          </div>
          
          {/* Floating UI Elements */}
          <motion.div 
            animate={{ y: [0, -5, 0] }}
            transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
            className="absolute -bottom-6 -right-6 p-5 glass-panel rounded-2xl hidden sm:block border border-indigo-500/30"
          >
            <div className="flex items-center gap-3 mb-3">
              <div className="w-2.5 h-2.5 rounded-full bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.5)]" />
              <span className="text-xs font-bold text-white">Nexus-1 Online</span>
            </div>
            <div className="space-y-1.5">
              <div className="flex justify-between gap-8">
                <span className="text-[10px] text-slate-500 uppercase font-bold">Latency</span>
                <span className="text-[10px] text-emerald-400 font-mono">124ms</span>
              </div>
              <div className="flex justify-between gap-8">
                <span className="text-[10px] text-slate-500 uppercase font-bold">Throughput</span>
                <span className="text-[10px] text-cyan-400 font-mono">1.4k tps</span>
              </div>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};
