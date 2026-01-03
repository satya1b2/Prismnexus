
import React, { useState } from 'react';
import { Header } from './components/Header';
import { Hero } from './components/Hero';
import { Features } from './components/Features';
import { UseCases } from './components/UseCases';
import { DevExperience } from './components/DevExperience';
import { Pricing } from './components/Pricing';
import { Footer } from './components/Footer';
import { NexusConsole } from './components/NexusConsole';
import { AuthModal } from './components/AuthModal';
import { FloatingChatbot } from './components/FloatingChatbot';
import { AnimatePresence, motion } from 'framer-motion';

const App: React.FC = () => {
  const [isConsoleOpen, setIsConsoleOpen] = useState(false);
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isOwner, setIsOwner] = useState(false);

  const handleLaunchRequest = () => {
    if (isLoggedIn && isOwner) {
      setIsConsoleOpen(true);
    } else {
      setIsAuthOpen(true);
    }
  };

  const handleAuthSuccess = (ownerStatus: boolean) => {
    setIsAuthOpen(false);
    setIsLoggedIn(true);
    setIsOwner(ownerStatus);
    setIsConsoleOpen(true);
  };

  return (
    <div className="min-h-screen selection:bg-indigo-500/30">
      {/* Background Gradients */}
      <div className="fixed inset-0 z-[-1] overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-indigo-600/10 blur-[120px] rounded-full" />
        <div className="absolute bottom-[20%] right-[-10%] w-[30%] h-[30%] bg-cyan-400/5 blur-[100px] rounded-full" />
      </div>

      <Header onLaunch={handleLaunchRequest} />
      
      <main>
        <Hero onStart={handleLaunchRequest} />
        <Features />
        <UseCases />
        <DevExperience />
        <Pricing onStart={handleLaunchRequest} />
      </main>

      <Footer onLaunch={handleLaunchRequest} />

      <FloatingChatbot />

      <AnimatePresence>
        {isAuthOpen && (
          <AuthModal 
            key="auth-modal"
            onClose={() => setIsAuthOpen(false)} 
            onSuccess={handleAuthSuccess} 
          />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {isConsoleOpen && (
          <div key="console-overlay" className="fixed inset-0 z-[90] flex items-center justify-center">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-slate-950/80 backdrop-blur-sm" 
              onClick={() => setIsConsoleOpen(false)} 
            />
            <NexusConsole key="nexus-console-main" isOwner={isOwner} onClose={() => setIsConsoleOpen(false)} />
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default App;
