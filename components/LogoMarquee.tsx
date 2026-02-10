
import React from 'react';
import { motion } from 'framer-motion';
import { ChatbotLogo } from './ChatbotLogo';

export const LogoMarquee: React.FC = () => {
  const logos = [...Array(10)];

  return (
    <div className="w-full py-16 bg-white/[0.02] border-y border-white/5 overflow-hidden whitespace-nowrap">
      <motion.div
        animate={{ x: [0, -1920] }}
        transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
        className="inline-flex gap-20 items-center px-10"
      >
        {logos.map((_, i) => (
          <div key={i} className="flex items-center gap-8">
            <ChatbotLogo size="md" className="opacity-40 grayscale hover:grayscale-0 hover:opacity-100 transition-all" />
            <span className="text-4xl lg:text-6xl font-black text-white/10 uppercase tracking-tighter select-none">
              Nexus Intelligence Pro
            </span>
          </div>
        ))}
        {/* Duplicate for seamless loop */}
        {logos.map((_, i) => (
          <div key={`dup-${i}`} className="flex items-center gap-8">
            <ChatbotLogo size="md" className="opacity-40 grayscale hover:grayscale-0 hover:opacity-100 transition-all" />
            <span className="text-4xl lg:text-6xl font-black text-white/10 uppercase tracking-tighter select-none">
              Nexus Intelligence Pro
            </span>
          </div>
        ))}
      </motion.div>
    </div>
  );
};
