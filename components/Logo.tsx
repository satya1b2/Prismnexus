
import React from 'react';
import { motion } from 'framer-motion';

export const Logo: React.FC<{ className?: string }> = ({ className = "h-8" }) => {
  return (
    <div className={`flex items-center gap-4 ${className} group cursor-pointer`}>
      {/* High-Fidelity Animated Prism Brand Logo */}
      <div className="relative w-10 h-10 flex items-center justify-center">
        {/* Outer Halo Shimmer */}
        <motion.div
          animate={{ 
            scale: [1, 1.1, 1],
            opacity: [0.3, 0.6, 0.3],
            rotate: 360 
          }}
          transition={{ 
            duration: 8, 
            repeat: Infinity, 
            ease: "linear" 
          }}
          className="absolute inset-[-4px] rounded-full border border-indigo-500/20 blur-[2px]"
        />
        
        {/* The Glass Prism Core */}
        <motion.div
          whileHover={{ scale: 1.1 }}
          className="relative w-8 h-8 bg-slate-950 border border-white/10 rounded-lg rotate-45 flex items-center justify-center overflow-hidden shadow-2xl"
        >
          {/* Internal Gradient Shimmer */}
          <motion.div
            animate={{ 
              x: [-40, 40],
              opacity: [0, 0.5, 0]
            }}
            transition={{ 
              duration: 2, 
              repeat: Infinity, 
              ease: "easeInOut" 
            }}
            className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent skew-x-12"
          />

          {/* Glowing Neural Core */}
          <motion.div
            animate={{ 
              opacity: [0.5, 1, 0.5],
              scale: [0.8, 1, 0.8]
            }}
            transition={{ 
              duration: 3, 
              repeat: Infinity 
            }}
            className="w-3 h-3 bg-indigo-500 rounded-full blur-[3px] shadow-[0_0_15px_#6366f1]"
          />
          
          {/* Internal Geometric Grid */}
          <div className="absolute inset-0 opacity-20 bg-[linear-gradient(rgba(255,255,255,0.1)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.1)_1px,transparent_1px)] bg-[size:4px_4px]" />
        </motion.div>

        {/* Floating Orbiting Data Bit */}
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
          className="absolute inset-0 pointer-events-none"
        >
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-1.5 h-1.5 bg-fuchsia-500 rounded-full shadow-[0_0_8px_#d946ef]" />
        </motion.div>
      </div>
      
      <div className="flex flex-col leading-none">
        <div className="flex items-center gap-1">
          <span className="text-white font-black text-2xl tracking-[-0.05em]">PRISM</span>
          <span className="text-indigo-400 font-light text-2xl tracking-[-0.05em]">NEXUS</span>
        </div>
        <span className="text-[7px] font-black uppercase tracking-[0.6em] text-indigo-500 -mt-1">
          Precision Intelligence
        </span>
      </div>
    </div>
  );
};
