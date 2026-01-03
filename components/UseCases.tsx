
import React from 'react';
import { motion } from 'framer-motion';
import * as LucideIcons from 'lucide-react';
import { USE_CASES } from '../constants';

export const UseCases: React.FC = () => {
  return (
    <section id="use-cases" className="py-24 px-6 bg-slate-950/50">
      <div className="max-w-7xl mx-auto">
        <div className="mb-16">
          <h2 className="text-3xl lg:text-5xl font-bold mb-4">Real-world Anonymity.</h2>
          <p className="text-slate-400 max-w-xl text-lg">
            Nexus isn't just a toy. It's built for production-grade operational efficiency across industries.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 gap-8">
          {USE_CASES.map((useCase, i) => {
            const Icon = (LucideIcons as any)[useCase.iconName];
            return (
              <motion.div
                key={i}
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="flex gap-6 p-8 rounded-3xl border border-white/5 bg-white/[0.02] hover:bg-white/[0.04] transition-colors"
              >
                <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-slate-800 flex items-center justify-center">
                  <Icon className="w-6 h-6 text-indigo-400" />
                </div>
                <div>
                  <h3 className="text-xl font-bold mb-2">{useCase.title}</h3>
                  <p className="text-slate-400 text-sm leading-relaxed">
                    {useCase.description}
                  </p>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
