
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X } from 'lucide-react';
import { Logo } from './Logo';

interface HeaderProps {
  onLaunch: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onLaunch }) => {
  const [isOpen, setIsOpen] = useState(false);

  const navLinks = [
    { name: 'Architecture', href: '#product' },
    { name: 'Solutions', href: '#use-cases' },
    { name: 'Access', href: '#pricing' },
  ];

  return (
    <motion.header 
      initial={{ y: -10, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      className="fixed top-0 left-0 right-0 z-50 px-8 py-8"
    >
      <div className="max-w-7xl mx-auto flex items-center justify-between glass-panel px-10 py-5 rounded-full relative">
        <Logo className="h-8" />

        {/* Desktop Nav */}
        <nav className="hidden lg:flex items-center gap-12 text-[11px] font-black uppercase tracking-[0.2em] text-slate-500">
          {navLinks.map((link) => (
            <a key={link.name} href={link.href} className="hover:text-white transition-colors relative group">
              {link.name}
            </a>
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
              className="absolute top-full left-0 right-0 mt-6 p-10 glass-panel rounded-[40px] lg:hidden flex flex-col gap-10"
            >
              {navLinks.map((link) => (
                <a 
                  key={link.name} 
                  href={link.href} 
                  className="text-2xl font-black text-slate-300 hover:text-white tracking-tight"
                  onClick={() => setIsOpen(false)}
                >
                  {link.name}
                </a>
              ))}
              <div className="pt-10 border-t border-white/5 flex flex-col gap-6">
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
