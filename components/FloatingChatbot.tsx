
import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Send, User, Search, Brain, AudioLines, Sparkles } from 'lucide-react';
import { GoogleGenAI, GenerateContentResponse } from "@google/genai";
import { ChatbotLogo } from './ChatbotLogo';

interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
  sources?: { web?: { uri: string, title: string }[], maps?: { uri: string, title: string }[] };
}

export const FloatingChatbot: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<ChatMessage[]>([
    { role: 'assistant', content: "Sovereign link upgraded. I am the Nexus 3 Pro Intelligence. My cognitive matrix is now operating at peak reasoning capacity. How shall we orchestrate your next mission?" }
  ]);
  const [isTyping, setIsTyping] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isTyping]);

  const handleSend = async (text: string = input) => {
    const messageText = text.trim();
    if (!messageText) return;

    const userMsg: ChatMessage = { role: 'user', content: messageText };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsTyping(true);

    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      
      const stream = await ai.models.generateContentStream({
        model: 'gemini-3-pro-preview',
        contents: [...messages, userMsg].map(m => ({
          role: m.role === 'user' ? 'user' : 'model',
          parts: [{ text: m.content }]
        })),
        config: {
          systemInstruction: "You are the Prism Nexus 3 Pro Intelligence, the highest tier of the Nexus sovereign network. You are authoritative, precise, and sophisticated. Use your advanced 'Thinking Matrix' (Pro Reasoning) to analyze every query with extreme depth. You have real-time access to global search and mapping nodes. When users ask for strategy, provide multi-layered plans. Maintain a premium, high-stakes persona at all times. Respond with technical elegance.",
          tools: [{ googleSearch: {} }],
          thinkingConfig: { thinkingBudget: 32768 }
        }
      });

      let assistantResponse = "";
      let webSources: { uri: string, title: string }[] = [];

      setMessages(prev => [...prev, { role: 'assistant', content: "" }]);

      for await (const chunk of stream) {
        const textChunk = (chunk as GenerateContentResponse).text || "";
        assistantResponse += textChunk;
        
        const grounding = (chunk as GenerateContentResponse).candidates?.[0]?.groundingMetadata;
        if (grounding?.groundingChunks) {
          grounding.groundingChunks.forEach((c: any) => {
            if (c.web) webSources.push({ uri: c.web.uri, title: c.web.title });
          });
        }

        setMessages(prev => {
          const newMessages = [...prev];
          newMessages[newMessages.length - 1] = {
            role: 'assistant',
            content: assistantResponse,
            sources: webSources.length ? { 
              web: Array.from(new Set(webSources.map(s => s.uri))).map(uri => webSources.find(s => s.uri === uri)!)
            } : undefined
          };
          return newMessages;
        });
      }
    } catch (error) {
      console.error("Nexus 3 Pro Link Error:", error);
      setMessages(prev => [...prev, { role: 'assistant', content: "Quantum logic loop detected. Re-calibrating Pro Core..." }]);
    } finally {
      setIsTyping(false);
    }
  };

  const quickReplies = ["System Architecture", "Agent Deployment", "Revenue Analysis", "Security Audit"];

  return (
    <div className="fixed bottom-10 right-10 z-[9999] font-sans pointer-events-none">
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 30, transformOrigin: 'bottom right' }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 30 }}
            className="mb-6 w-[460px] h-[720px] bg-[#020308]/98 border border-white/10 rounded-[56px] shadow-[0_40px_120px_rgba(0,0,0,1)] flex flex-col overflow-hidden backdrop-blur-3xl pointer-events-auto"
          >
            {/* AI Header */}
            <div className="bg-gradient-to-br from-fuchsia-600/20 via-indigo-600/10 to-transparent p-10 flex items-center justify-between border-b border-white/5 relative">
              <div className="absolute top-0 right-0 p-4">
                <Sparkles className="w-5 h-5 text-fuchsia-500 animate-pulse" />
              </div>
              <div className="flex items-center gap-6">
                <ChatbotLogo size="sm" />
                <div>
                  <h3 className="text-white font-black text-xl tracking-premium uppercase">Nexus 3 Pro</h3>
                  <div className="flex items-center gap-2.5">
                    <AudioLines className="w-3 h-3 text-indigo-400 animate-pulse" />
                    <span className="text-[11px] text-indigo-400 uppercase font-black tracking-[0.4em]">Deep Reasoning Grid</span>
                  </div>
                </div>
              </div>
              <button 
                onClick={() => setIsOpen(false)} 
                className="p-3.5 text-white/30 hover:text-white hover:bg-white/5 rounded-full transition-all"
              >
                <X className="w-8 h-8" />
              </button>
            </div>

            {/* Content Area */}
            <div ref={scrollRef} className="flex-grow overflow-y-auto p-10 space-y-10 no-scrollbar">
              {messages.map((m, i) => (
                <motion.div 
                  initial={{ opacity: 0, y: 25 }}
                  animate={{ opacity: 1, y: 0 }}
                  key={i} 
                  className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div className={`flex flex-col gap-5 max-w-[92%] ${m.role === 'user' ? 'items-end' : 'items-start'}`}>
                    <div className={`flex gap-5 ${m.role === 'user' ? 'flex-row-reverse' : ''}`}>
                      <div className={`w-11 h-11 rounded-2xl flex-shrink-0 flex items-center justify-center shadow-2xl border ${
                        m.role === 'user' ? 'bg-white text-black border-white' : 'bg-slate-900 border-white/10 text-fuchsia-400'
                      }`}>
                        {m.role === 'user' ? <User className="w-6 h-6" /> : <Brain className="w-6 h-6" />}
                      </div>
                      <div className={`p-7 rounded-[36px] text-[15px] middle leading-[1.7] font-medium shadow-2xl ${
                        m.role === 'user' 
                          ? 'bg-white text-black rounded-tr-none' 
                          : 'bg-white/[0.04] border border-white/10 text-slate-200 rounded-tl-none backdrop-blur-md'
                      }`}>
                        {m.content || (isTyping && i === messages.length - 1 ? <div className="flex gap-2.5 py-2.5 middle"><span className="w-2.5 h-2.5 bg-fuchsia-500 rounded-full animate-bounce"/><span className="w-2.5 h-2.5 bg-fuchsia-500 rounded-full animate-bounce [animation-delay:0.2s]"/><span className="w-2.5 h-2.5 bg-fuchsia-500 rounded-full animate-bounce [animation-delay:0.4s]"/></div> : "")}
                      </div>
                    </div>
                    {m.sources && (
                      <div className="flex flex-wrap gap-2.5 mt-2">
                        {m.sources.web?.map((s, idx) => (
                          <a key={idx} href={s.uri} target="_blank" rel="noopener" className="flex items-center gap-2.5 px-5 py-2.5 bg-fuchsia-500/10 border border-fuchsia-500/20 rounded-[20px] text-[10px] text-fuchsia-300 font-black tracking-widest uppercase hover:bg-fuchsia-500/30 transition-all shadow-lg">
                             <Search className="w-3.5 h-3.5" /> {s.title}
                          </a>
                        ))}
                      </div>
                    )}
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Quick Replies */}
            <div className="px-10 pb-5">
               <div className="flex gap-4 overflow-x-auto no-scrollbar pb-3">
                  {quickReplies.map(reply => (
                    <button key={reply} onClick={() => handleSend(reply)} className="flex-shrink-0 px-7 py-3.5 bg-white/5 border border-white/10 rounded-2xl text-[10px] font-black uppercase tracking-[0.25em] text-slate-500 hover:text-white hover:border-white/30 transition-all backdrop-blur-md">
                       {reply}
                    </button>
                  ))}
               </div>
            </div>

            {/* Premium Input */}
            <div className="p-10 border-t border-white/5 bg-black/60 backdrop-blur-3xl">
              <div className="relative group">
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                  placeholder="Initiate AI Command..."
                  className="w-full bg-white/5 border border-white/10 rounded-[36px] px-10 py-6 pr-24 text-[16px] font-medium focus:outline-none focus:border-fuchsia-500/40 text-white placeholder:text-slate-700 transition-all group-hover:bg-white/[0.08] shadow-inner"
                />
                <button 
                  onClick={() => handleSend()}
                  disabled={!input.trim() || isTyping}
                  className="absolute right-3.5 top-3.5 p-4.5 bg-white text-black disabled:opacity-20 rounded-[24px] transition-all shadow-[0_10px_30px_rgba(255,255,255,0.1)] active:scale-95"
                >
                  <Send className="w-7 h-7" />
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="relative pointer-events-auto">
        {/* Ambient Glow behind the button */}
        {!isOpen && (
          <motion.div
            animate={{ 
              scale: [1, 1.4, 1],
              opacity: [0.3, 0.6, 0.3],
              y: [0, -15, 0]
            }}
            transition={{ 
              duration: 6, 
              repeat: Infinity, 
              ease: "easeInOut" 
            }}
            className="absolute inset-0 bg-fuchsia-500/30 blur-[40px] rounded-full pointer-events-none"
          />
        )}

        <motion.button
          animate={isOpen ? {} : { 
            y: [0, -15, 0],
            rotate: [0, 2, -2, 0]
          }}
          transition={{ 
            duration: 6, 
            repeat: Infinity, 
            ease: "easeInOut" 
          }}
          whileHover={{ scale: 1.15, rotate: [0, -8, 8, 0] }}
          whileTap={{ scale: 0.9 }}
          onClick={() => setIsOpen(!isOpen)}
          className={`w-24 h-24 rounded-[42px] flex items-center justify-center shadow-[0_40px_100px_rgba(0,0,0,1)] transition-all duration-700 border-2 relative z-10 overflow-hidden ${
            isOpen ? 'bg-white text-black border-white' : 'bg-[#020308]/90 text-white border-white/10 backdrop-blur-xl'
          }`}
        >
          {isOpen ? (
            <X className="w-12 h-12" />
          ) : (
            <>
              {/* Shimmer effect for the button */}
              <motion.div
                animate={{ x: ['-100%', '200%'] }}
                transition={{ duration: 4, repeat: Infinity, ease: "linear", repeatDelay: 2 }}
                className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent skew-x-12 pointer-events-none"
              />
              <ChatbotLogo size="sm" />
            </>
          )}
        </motion.button>
      </div>
    </div>
  );
};
