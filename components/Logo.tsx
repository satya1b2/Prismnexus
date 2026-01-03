
import React from 'react';
import { motion } from 'framer-motion';

export const Logo: React.FC<{ className?: string }> = ({ className = "h-8" }) => {
  return (
    <div className={`flex items-center gap-4 ${className} group cursor-pointer`}>
      <div className="relative w-10 h-10 flex items-center justify-center">
        {/* Outer Orbit */}
        <motion.div 
          animate={{ rotate: 360 }}
          transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
          className="absolute inset-0 border border-fuchsia-500/30 rounded-full"
        />
        {/* Core Node */}
        <div className="w-5 h-5 bg-gradient-to-br from-fuchsia-500 to-violet-600 rounded-lg shadow-[0_0_15px_rgba(192,38,211,0.5)] transform rotate-45" />
        {/* Satellite Node */}
        <motion.div 
          animate={{ rotate: -360 }}
          transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
          className="absolute w-full h-full"
        >
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-2 h-2 bg-white rounded-full shadow-[0_0_8px_white]" />
        </motion.div>
      </div>
      <div className="flex flex-col leading-none">
        <div className="flex items-center gap-1">
          <span className="text-white font-black text-2xl tracking-[-0.05em]">PRISM</span>
          <span className="text-fuchsia-500/80 font-light text-2xl tracking-[-0.05em]">NEXUS</span>
        </div>
        <span className="text-[7px] font-black uppercase tracking-[0.6em] text-fuchsia-400 -mt-1">
          Precision Intelligence
        </span>
      </div>
    </div>
  );
};
