
import React from 'react';
import { motion } from 'framer-motion';
import { Github, Twitter, Linkedin, ExternalLink } from 'lucide-react';
import { Logo } from './Logo';

interface FooterProps {
  onLaunch: () => void;
}

export const Footer: React.FC<FooterProps> = ({ onLaunch }) => {
  return (
    <footer className="pt-24 pb-12 px-6">
      {/* Conversion Section */}
      <div className="max-w-5xl mx-auto glass-panel p-12 lg:p-20 rounded-[40px] text-center relative overflow-hidden mb-24">
        <div className="absolute inset-0 bg-gradient-to-r from-fuchsia-600/20 to-violet-400/20 blur-[100px] pointer-events-none" />
        <h2 className="text-3xl lg:text-5xl font-bold mb-8 relative">Ready to Deploy Your First Agent?</h2>
        <div className="flex flex-col sm:flex-row gap-6 justify-center relative">
          <button 
            onClick={onLaunch}
            className="bg-white text-slate-950 px-10 py-5 rounded-2xl font-black text-lg hover:bg-slate-200 transition-all"
          >
            Launch Platform
          </button>
          <button className="bg-white/5 hover:bg-white/10 border border-white/10 px-10 py-5 rounded-2xl font-black text-lg flex items-center justify-center gap-2 transition-all">
            Book Strategy Call <ExternalLink className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Main Footer Links */}
      <div className="max-w-7xl mx-auto border-t border-white/5 pt-16 grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-12">
        <div className="col-span-2 lg:col-span-2">
          <div className="mb-6">
            <Logo className="h-8" />
          </div>
          <p className="text-slate-500 text-sm max-w-xs leading-relaxed">
            The world's most advanced anonymous agent orchestration platform. Build, deploy, and scale intelligent workflows with precision.
          </p>
          <div className="flex gap-4 mt-8">
            <Twitter className="w-5 h-5 text-slate-500 hover:text-white cursor-pointer transition-colors" />
            <Github className="w-5 h-5 text-slate-500 hover:text-white cursor-pointer transition-colors" />
            <Linkedin className="w-5 h-5 text-slate-500 hover:text-white cursor-pointer transition-colors" />
          </div>
        </div>

        <div>
          <h4 className="font-bold mb-6">Product</h4>
          <ul className="space-y-4 text-sm text-slate-500">
            <li className="hover:text-white cursor-pointer transition-colors">Platform</li>
            <li className="hover:text-white cursor-pointer transition-colors">Agents</li>
            <li className="hover:text-white cursor-pointer transition-colors">Integrations</li>
            <li className="hover:text-white cursor-pointer transition-colors">Changelog</li>
          </ul>
        </div>

        <div>
          <h4 className="font-bold mb-6">Resources</h4>
          <ul className="space-y-4 text-sm text-slate-500">
            <li className="hover:text-white cursor-pointer transition-colors">Documentation</li>
            <li className="hover:text-white cursor-pointer transition-colors">API Reference</li>
            <li className="hover:text-white cursor-pointer transition-colors">Community</li>
            <li className="hover:text-white cursor-pointer transition-colors">Guides</li>
          </ul>
        </div>

        <div>
          <h4 className="font-bold mb-6">Legal</h4>
          <ul className="space-y-4 text-sm text-slate-500">
            <li className="hover:text-white cursor-pointer transition-colors">Privacy Policy</li>
            <li className="hover:text-white cursor-pointer transition-colors">Terms of Service</li>
            <li className="hover:text-white cursor-pointer transition-colors">Security</li>
          </ul>
        </div>
      </div>

      <div className="max-w-7xl mx-auto mt-24 text-center text-xs text-slate-700 font-medium">
        © {new Date().getFullYear()} Prism Nexus Technologies Inc. All rights reserved. Built with precision for the agentic future.
      </div>
    </footer>
  );
};
