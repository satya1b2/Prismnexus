
import React from 'react';
import { motion } from 'framer-motion';

interface ChatbotLogoProps {
  size?: 'xs' | 'sm' | 'md' | 'lg';
  className?: string;
  theme?: 'fuchsia' | 'indigo' | 'white';
}

export const ChatbotLogo: React.FC<ChatbotLogoProps> = ({ 
  size = 'md', 
  className = "", 
  theme = 'fuchsia' 
}) => {
  const dimensions = {
    xs: 'w-6 h-6',
    sm: 'w-10 h-10',
    md: 'w-16 h-16',
    lg: 'w-32 h-32'
  }[size];

  const iconScale = {
    xs: 0.4,
    sm: 0.6,
    md: 1,
    lg: 2
  }[size];

  const colors = {
    fuchsia: 'from-white via-fuchsia-400 to-indigo-600',
    indigo: 'from-white via-indigo-400 to-cyan-600',
    white: 'from-slate-200 via-white to-slate-400'
  }[theme];

  const glowColor = {
    fuchsia: 'bg-fuchsia-500/20',
    indigo: 'bg-indigo-500/20',
    white: 'bg-white/10'
  }[theme];

  const shadowColor = {
    fuchsia: 'shadow-[0_0_30px_rgba(192,38,211,0.6)]',
    indigo: 'shadow-[0_0_30px_rgba(79,70,229,0.6)]',
    white: 'shadow-[0_0_30px_rgba(255,255,255,0.4)]'
  }[theme];

  return (
    <div className={`relative flex items-center justify-center ${dimensions} ${className}`}>
      {/* Outer Halo */}
      <motion.div
        animate={{ rotate: 360, scale: [1, 1.1, 1] }}
        transition={{ rotate: { duration: 10, repeat: Infinity, ease: "linear" }, scale: { duration: 4, repeat: Infinity, ease: "easeInOut" } }}
        className={`absolute inset-0 rounded-full border border-white/10 ${theme === 'fuchsia' ? 'shadow-[0_0_20px_rgba(192,38,211,0.1)]' : 'shadow-[0_0_20px_rgba(79,70,229,0.1)]'}`}
      />
      
      {/* Second Orbit */}
      <motion.div
        animate={{ rotate: -360 }}
        transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
        className="absolute inset-[15%] rounded-full border border-dashed border-white/20"
      />

      {/* The Core Prism */}
      <div className="relative z-10 flex items-center justify-center" style={{ transform: `scale(${iconScale})` }}>
        <motion.div
          animate={{ 
            rotateY: [0, 180, 360],
            filter: ["hue-rotate(0deg)", "hue-rotate(45deg)", "hue-rotate(0deg)"]
          }}
          transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
          style={{ transformStyle: 'preserve-3d' }}
          className={`w-10 h-10 bg-gradient-to-br ${colors} rounded-xl ${shadowColor} flex items-center justify-center overflow-hidden`}
        >
          {/* Inner Neural Pulse */}
          <motion.div
            animate={{ opacity: [0.3, 0.8, 0.3], scale: [0.8, 1.2, 0.8] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="w-4 h-4 bg-white rounded-full blur-[4px]"
          />
        </motion.div>
        
        {/* Floating Intelligence Fragments */}
        {[...Array(4)].map((_, i) => (
          <motion.div
            key={i}
            animate={{ 
              y: [0, -10, 0],
              x: [0, (i % 2 === 0 ? 5 : -5), 0],
              opacity: [0.2, 0.6, 0.2]
            }}
            transition={{ duration: 3 + i, repeat: Infinity, delay: i * 0.5 }}
            className="absolute w-1.5 h-1.5 bg-white rounded-full shadow-[0_0_8px_white]"
            style={{
              top: `${Math.sin(i * 90) * 20 + 20}px`,
              left: `${Math.cos(i * 90) * 20 + 20}px`
            }}
          />
        ))}
      </div>
      
      {/* Dynamic Glow */}
      <motion.div
        animate={{ opacity: [0.1, 0.3, 0.1] }}
        transition={{ duration: 5, repeat: Infinity }}
        className={`absolute inset-[-20%] ${glowColor} blur-[40px] rounded-full pointer-events-none`}
      />
    </div>
  );
};
