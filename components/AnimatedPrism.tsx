
import React, { useEffect } from 'react';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';

export const AnimatedPrism: React.FC = () => {
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const rotateX = useSpring(useTransform(mouseY, [-0.5, 0.5], [10, -10]), { stiffness: 100, damping: 30 });
  const rotateY = useSpring(useTransform(mouseX, [-0.5, 0.5], [-10, 10]), { stiffness: 100, damping: 30 });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      mouseX.set(e.clientX / window.innerWidth - 0.5);
      mouseY.set(e.clientY / window.innerHeight - 0.5);
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  return (
    <div className="relative w-[600px] h-[600px] flex items-center justify-center [perspective:2000px]">
      <motion.div
        style={{ rotateX, rotateY, transformStyle: 'preserve-3d' }}
        className="relative w-full h-full flex items-center justify-center"
      >
        {/* Orbital Paths */}
        <div className="absolute w-[400px] h-[400px] border border-white/5 rounded-full [transform:rotateX(75deg)]" />
        <div className="absolute w-[300px] h-[300px] border border-fuchsia-500/10 rounded-full [transform:rotateX(75deg)]" />
        <div className="absolute w-[200px] h-[200px] border border-violet-500/20 rounded-full [transform:rotateX(75deg)]" />

        {/* Central Core */}
        <div className="relative [transform:translateZ(50px)]">
          <div className="w-24 h-24 bg-gradient-to-br from-fuchsia-500 to-violet-600 rounded-[32px] shadow-[0_0_100px_rgba(192,38,211,0.4)] flex items-center justify-center overflow-hidden">
            <motion.div 
              animate={{ opacity: [0.5, 1, 0.5] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="absolute inset-0 bg-white/20 blur-xl" 
            />
            <span className="text-white font-black text-4xl">V</span>
          </div>
        </div>

        {/* Orbiting UI Shards */}
        {[0, 120, 240].map((angle, i) => (
          <motion.div
            key={i}
            initial={{ rotate: angle }}
            animate={{ rotate: angle + 360 }}
            transition={{ duration: 20 + i * 5, repeat: Infinity, ease: "linear" }}
            className="absolute w-full h-full flex items-center justify-center pointer-events-none"
          >
            <div 
              className="glass-panel p-4 rounded-2xl border-white/10 shadow-2xl flex items-center gap-3 [transform:translateX(220px)rotateY(-90deg)]"
              style={{ transformStyle: 'preserve-3d' }}
            >
              <div className="w-8 h-8 rounded-lg bg-fuchsia-500/20 flex items-center justify-center">
                <div className="w-4 h-4 rounded-full bg-fuchsia-400" />
              </div>
              <div className="text-left">
                <div className="h-1.5 w-12 bg-white/20 rounded-full mb-1" />
                <div className="h-1.5 w-8 bg-white/10 rounded-full" />
              </div>
            </div>
          </motion.div>
        ))}

        {/* Data Pulses */}
        <svg className="absolute inset-0 w-full h-full pointer-events-none overflow-visible">
          {[...Array(6)].map((_, i) => (
            <motion.circle
              key={i}
              r="2"
              fill="#C026D3"
              initial={{ offsetDistance: "0%" }}
              animate={{ offsetDistance: "100%" }}
              transition={{ duration: 3, repeat: Infinity, delay: i * 0.5 }}
              style={{ 
                offsetPath: `path('M 300 300 m -150, 0 a 150,150 0 1,0 300,0 a 150,150 0 1,0 -300,0')`,
                filter: 'drop-shadow(0 0 8px #C026D3)'
              }}
            />
          ))}
        </svg>
      </motion.div>
    </div>
  );
};
