
import React, { useState } from 'react';
import { Header } from './components/Header';
import { Hero } from './components/Hero';
import { Features } from './components/Features';
import { UseCases } from './components/UseCases';
import { DevExperience } from './components/DevExperience';
import { Pricing } from './components/Pricing';
import { Footer } from './components/Footer';
import { NexusConsole } from './components/NexusConsole';
import { PrivacyPage } from './components/PrivacyPage';
import { FloatingChatbot } from './components/FloatingChatbot';
import { LogoMarquee } from './components/LogoMarquee';
import { AnimatePresence, motion } from 'framer-motion';

type View = 'home' | 'privacy';

const App: React.FC = () => {
  const [view, setView] = useState<View>('home');
  const [isConsoleOpen, setIsConsoleOpen] = useState(false);
  // Default to owner mode to provide full access to all features
  const [isOwner] = useState(true);

  const handleLaunchRequest = () => {
    // Directly open console without authentication check
    setIsConsoleOpen(true);
  };

  const navigateToHome = () => {
    setView('home');
    window.scrollTo(0, 0);
  };

  const navigateToPrivacy = () => {
    setView('privacy');
    window.scrollTo(0, 0);
  };

  return (
    <div className="min-h-screen selection:bg-indigo-500/30 bg-[#020308] relative">
      {/* Floating Chatbot moved to the top level of the app container, 
          outside of any motion transforms to ensure 'fixed' positioning 
          stays attached to the viewport. */}
      <FloatingChatbot />

      <AnimatePresence mode="wait">
        {view === 'home' ? (
          <motion.div 
            key="home-view"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            {/* Background Gradients */}
            <div className="fixed inset-0 z-[-1] overflow-hidden pointer-events-none">
              <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-indigo-600/10 blur-[120px] rounded-full" />
              <div className="absolute bottom-[20%] right-[-10%] w-[30%] h-[30%] bg-cyan-400/5 blur-[100px] rounded-full" />
            </div>

            <Header onLaunch={handleLaunchRequest} onHomeClick={navigateToHome} />
            
            <main>
              <Hero onStart={handleLaunchRequest} />
              <LogoMarquee />
              <Features />
              <UseCases />
              <DevExperience />
              <Pricing onStart={handleLaunchRequest} />
            </main>

            <Footer 
              onLaunch={handleLaunchRequest} 
              onPrivacyClick={navigateToPrivacy} 
            />
          </motion.div>
        ) : (
          <PrivacyPage key="privacy-view" onBack={navigateToHome} />
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
