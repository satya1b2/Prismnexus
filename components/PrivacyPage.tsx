
import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import { Shield, Globe, Mail, ArrowLeft, Lock, FileText } from 'lucide-react';
import { Logo } from './Logo';

interface PrivacyPageProps {
  onBack: () => void;
}

export const PrivacyPage: React.FC<PrivacyPageProps> = ({ onBack }) => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="min-h-screen bg-[#020308] text-slate-400 font-medium"
    >
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 px-8 py-8 bg-[#020308]/80 backdrop-blur-xl border-b border-white/5">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div onClick={onBack} className="cursor-pointer">
            <Logo className="h-8" />
          </div>
          <button 
            onClick={onBack}
            className="flex items-center gap-3 text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 hover:text-white transition-colors"
          >
            <ArrowLeft className="w-4 h-4" /> Back to Home
          </button>
        </div>
      </nav>

      {/* Hero Header */}
      <header className="pt-48 pb-20 px-8 border-b border-white/5 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-fuchsia-600/5 to-transparent pointer-events-none" />
        <div className="max-w-4xl mx-auto relative z-10 text-center">
          <div className="w-20 h-20 bg-fuchsia-500/10 rounded-[32px] flex items-center justify-center border border-fuchsia-500/20 mx-auto mb-10">
            <Shield className="w-10 h-10 text-fuchsia-500" />
          </div>
          <h1 className="text-5xl md:text-7xl font-black text-white tracking-tighter uppercase mb-6">Privacy Policy</h1>
          <p className="text-[10px] font-black uppercase tracking-[0.6em] text-fuchsia-500/80">Prism Nexus Protocol • Secure Data Enclave</p>
        </div>
      </header>

      {/* Policy Content */}
      <main className="max-w-4xl mx-auto py-24 px-8 leading-relaxed space-y-16 selection:bg-fuchsia-500/30">
        <div className="p-10 rounded-[40px] bg-white/[0.02] border border-white/5 backdrop-blur-sm">
          <p className="text-xl text-slate-300 leading-relaxed">
            Prismnexus (“Prismnexus”, “we”, “our”, or “us”) provides AI agents and agentic AI services that help automate and orchestrate workflows, including data processing, decision support, and integrations with third‑party tools and platforms (the “Service”).
            <br /><br />
            This Privacy Policy explains how we collect, use, disclose, and protect personal information when you visit our website at Prismnexus or use our Service. By accessing or using the Service, you agree to the terms of this Privacy Policy.
          </p>
        </div>

        <section className="space-y-6">
          <h3 className="text-2xl font-black text-white flex items-center gap-4 uppercase tracking-tight">
            <span className="text-fuchsia-500 text-sm">01</span> Scope and definitions
          </h3>
          <p>This Privacy Policy applies to Visitors to our website, Users who create accounts, and Customers who configure AI agents.</p>
          <p>“Personal data” means any information that identifies or can reasonably be linked to an identifiable individual. “Processing” means any operation performed on personal information.</p>
        </section>

        <section className="space-y-6">
          <h3 className="text-2xl font-black text-white flex items-center gap-4 uppercase tracking-tight">
            <span className="text-fuchsia-500 text-sm">02</span> Information we collect
          </h3>
          <div className="grid md:grid-cols-2 gap-8">
            <div className="p-8 rounded-3xl bg-white/[0.01] border border-white/5">
              <h4 className="text-white font-bold mb-3 flex items-center gap-2"><FileText className="w-4 h-4 text-indigo-400" /> 2.1 Direct Provision</h4>
              <p className="text-sm">Account details, mission configurations, and sovereign support communications are stored within encrypted sectors.</p>
            </div>
            <div className="p-8 rounded-3xl bg-white/[0.01] border border-white/5">
              <h4 className="text-white font-bold mb-3 flex items-center gap-2"><Globe className="w-4 h-4 text-cyan-400" /> 2.2 Automated Collection</h4>
              <p className="text-sm">Usage telemetry, network logs, and secure cookies for persistent session management.</p>
            </div>
          </div>
        </section>

        <section className="space-y-6">
          <h3 className="text-2xl font-black text-white flex items-center gap-4 uppercase tracking-tight">
            <span className="text-fuchsia-500 text-sm">03</span> How we use your information
          </h3>
          <p>We process personal information to provide/maintain the service, operate agentic workflows, improve our service (using anonymized data), communicate with you, ensure security, and comply with legal obligations.</p>
        </section>

        <section className="space-y-6 p-10 rounded-[40px] bg-indigo-500/5 border border-indigo-500/10">
          <h3 className="text-2xl font-black text-indigo-400 flex items-center gap-4 uppercase tracking-tight">
             <div className="w-2 h-8 bg-indigo-500 rounded-full" /> 08 Indian Data Protection Compliance
          </h3>
          <p className="mb-6">Prismnexus complies with the Digital Personal Data Protection Act, 2023 (DPDP Act) and SPDI Rules under the IT Act, 2000.</p>
          <div className="grid md:grid-cols-2 gap-12 text-sm">
            <div className="space-y-4">
              <h4 className="text-white font-black uppercase tracking-widest text-xs">Fiduciary Responsibilities</h4>
              <ul className="space-y-3">
                <li className="flex gap-3"><div className="w-1 h-1 bg-indigo-500 rounded-full mt-2" /> Explicit consent protocols</li>
                <li className="flex gap-3"><div className="w-1 h-1 bg-indigo-500 rounded-full mt-2" /> Advanced security safeguards</li>
                <li className="flex gap-3"><div className="w-1 h-1 bg-indigo-500 rounded-full mt-2" /> Data accuracy mandates</li>
              </ul>
            </div>
            <div className="space-y-4">
              <h4 className="text-white font-black uppercase tracking-widest text-xs">Data Principal Rights</h4>
              <ul className="space-y-3">
                <li className="flex gap-3"><div className="w-1 h-1 bg-indigo-500 rounded-full mt-2" /> Right to full access</li>
                <li className="flex gap-3"><div className="w-1 h-1 bg-indigo-500 rounded-full mt-2" /> Right to correction</li>
                <li className="flex gap-3"><div className="w-1 h-1 bg-indigo-500 rounded-full mt-2" /> Grievance redressal</li>
              </ul>
            </div>
          </div>
        </section>

        <section className="space-y-6">
          <h3 className="text-2xl font-black text-white flex items-center gap-4 uppercase tracking-tight">
            <span className="text-fuchsia-500 text-sm">10</span> Security Protocols
          </h3>
          <div className="p-8 rounded-[32px] border border-white/5 bg-gradient-to-br from-white/[0.02] to-transparent">
            <div className="flex flex-wrap gap-4 mb-6">
              <span className="px-4 py-2 bg-white/5 border border-white/10 rounded-xl text-[9px] font-black uppercase tracking-widest text-slate-300">TLS 1.3 Encryption</span>
              <span className="px-4 py-2 bg-white/5 border border-white/10 rounded-xl text-[9px] font-black uppercase tracking-widest text-slate-300">AES-256 Storage</span>
              <span className="px-4 py-2 bg-white/5 border border-white/10 rounded-xl text-[9px] font-black uppercase tracking-widest text-slate-300">Zero-Trust Access</span>
            </div>
            <p>We implement E2E encryption, access controls, and network security via reputable providers. No system is 100% secure.</p>
          </div>
        </section>

        <section className="pt-20 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-10">
          <div className="flex items-center gap-6">
            <div className="w-12 h-12 bg-white/5 rounded-2xl flex items-center justify-center border border-white/10">
              <Mail className="w-6 h-6 text-fuchsia-500" />
            </div>
            <div>
              <p className="text-white font-black uppercase text-xs tracking-widest">Satyajitna496@gmail.com</p>
              <p className="text-[10px] text-slate-500 uppercase font-bold tracking-[0.2em]">Contact Authority</p>
            </div>
          </div>
          <div className="flex items-center gap-6">
            <div className="w-12 h-12 bg-white/5 rounded-2xl flex items-center justify-center border border-white/10">
              <Globe className="w-6 h-6 text-indigo-500" />
            </div>
            <div>
              <p className="text-white font-black uppercase text-xs tracking-widest">Bhubaneswar, Odisha, India</p>
              <p className="text-[10px] text-slate-500 uppercase font-bold tracking-[0.2em]">Regional Sovereign Node</p>
            </div>
          </div>
        </section>
      </main>

      <footer className="py-20 px-8 text-center border-t border-white/5">
        <button 
          onClick={onBack}
          className="px-12 py-5 bg-white text-black rounded-2xl text-[10px] font-black uppercase tracking-[0.3em] hover:bg-slate-200 transition-all active:scale-95"
        >
          Return to Platform Hero
        </button>
      </footer>
    </motion.div>
  );
};
