
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, ChevronDown, Layers, Target, CreditCard, Sparkles } from 'lucide-react';
import { Logo } from './Logo';

interface HeaderProps {
  onLaunch: () => void;
  onHomeClick?: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onLaunch, onHomeClick }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [hoveredLink, setHoveredLink] = useState<string | null>(null);

  const navLinks = [
    { 
      name: 'Architecture', 
      href: '#product', 
      description: 'The technical backbone of Prism Nexus. Modular SDKs, sub-ms latency, and zero-trust security layers.',
      icon: <Layers className="w-5 h-5" />
    },
    { 
      name: 'Solutions', 
      href: '#use-cases', 
      description: 'Tailored agentic workflows for Enterprise scale. Revenue Ops, Compliance, and CS automation.',
      icon: <Target className="w-5 h-5" />
    },
    { 
      name: 'Access', 
      href: '#pricing', 
      description: 'Scale your autonomous operations with modular pricing tiers built for any cluster size.',
      icon: <CreditCard className="w-5 h-5" />
    },
  ];

  return (
    <motion.header 
      initial={{ y: -10, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      className="fixed top-0 left-0 right-0 z-50 px-8 py-8"
    >
      <div className="max-w-7xl mx-auto flex items-center justify-between glass-panel px-10 py-5 rounded-full relative">
        <div onClick={onHomeClick} className="cursor-pointer">
          <Logo className="h-8" />
        </div>

        {/* Desktop Nav */}
        <nav className="hidden lg:flex items-center gap-10">
          {navLinks.map((link) => (
            <div 
              key={link.name} 
              className="relative py-2"
              onMouseEnter={() => setHoveredLink(link.name)}
              onMouseLeave={() => setHoveredLink(null)}
            >
              <a 
                href={link.href} 
                className="flex items-center gap-2 text-[11px] font-black uppercase tracking-[0.2em] text-slate-500 hover:text-white transition-colors"
              >
                {link.name}
                <ChevronDown className={`w-3 h-3 transition-transform duration-300 ${hoveredLink === link.name ? 'rotate-180 text-fuchsia-500' : ''}`} />
              </a>

              <AnimatePresence>
                {hoveredLink === link.name && (
                  <motion.div
                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 10, scale: 0.95 }}
                    className="absolute top-full left-1/2 -translate-x-1/2 mt-4 w-72 p-6 glass-panel rounded-[32px] border-fuchsia-500/20 shadow-[0_20px_50px_rgba(0,0,0,0.5)]"
                  >
                    <div className="flex items-center gap-4 mb-4">
                      <div className="w-10 h-10 bg-fuchsia-500/10 rounded-xl flex items-center justify-center border border-fuchsia-500/20 text-fuchsia-500">
                        {link.icon}
                      </div>
                      <span className="text-[10px] font-black uppercase tracking-widest text-white">{link.name} Protocol</span>
                    </div>
                    <p className="text-[11px] leading-relaxed text-slate-400 font-medium">
                      {link.description}
                    </p>
                    <div className="mt-4 pt-4 border-t border-white/5 flex items-center gap-2 text-[9px] font-black uppercase tracking-widest text-fuchsia-500/80">
                      <Sparkles className="w-3 h-3" /> Initialize Node
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ))}
        </nav>

        <div className="flex items-center gap-8">
          <button className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 hover:text-white hidden sm:block transition-colors">Client Portal</button>
          <button 
            onClick={onLaunch}
            className="bg-white text-black px-8 py-3 rounded-full text-[10px] font-black uppercase tracking-[0.2em] transition-all hover:bg-slate-200 active:scale-95 hidden sm:block"
          >
            Launch Nexus
          </button>
          
          {/* Mobile Toggle */}
          <button 
            className="lg:hidden p-2 text-slate-300 hover:text-white"
            onClick={() => setIsOpen(!isOpen)}
          >
            {isOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              className="absolute top-full left-0 right-0 mt-6 p-8 glass-panel rounded-[40px] lg:hidden flex flex-col gap-6"
            >
              {navLinks.map((link) => (
                <a 
                  key={link.name} 
                  href={link.href} 
                  className="group block p-6 rounded-3xl hover:bg-white/5 transition-all border border-transparent hover:border-white/5"
                  onClick={() => setIsOpen(false)}
                >
                  <div className="flex items-center gap-4 mb-2">
                    <div className="text-fuchsia-500">
                      {link.icon}
                    </div>
                    <span className="text-xl font-black text-white tracking-tight">{link.name}</span>
                  </div>
                  <p className="text-[11px] text-slate-500 leading-relaxed font-medium pl-9">
                    {link.description}
                  </p>
                </a>
              ))}
              <div className="pt-6 border-t border-white/5 flex flex-col gap-4">
                <button className="w-full py-5 rounded-full bg-white/5 text-white font-black uppercase tracking-[0.2em] text-[10px] border border-white/10">Portal Access</button>
                <button onClick={() => { setIsOpen(false); onLaunch(); }} className="w-full py-5 rounded-full bg-white text-black font-black uppercase tracking-[0.2em] text-[10px]">Launch Nexus</button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.header>
  );
};
