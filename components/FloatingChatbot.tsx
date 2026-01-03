
import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageCircle, X, Send, Bot, User, Search, MapPin, Brain } from 'lucide-react';
import { GoogleGenAI, GenerateContentResponse } from "@google/genai";

interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
  sources?: { web?: { uri: string, title: string }[], maps?: { uri: string, title: string }[] };
}

export const FloatingChatbot: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<ChatMessage[]>([
    { role: 'assistant', content: "Sovereign link established. I am the Nexus 2.5 Flash Agent. I leverage deep thinking and real-time grounding for complex mission logic. How shall we proceed?" }
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
      // Use process.env.API_KEY directly for initialization as per guidelines
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      
      // Fix: Maps grounding is only supported in Gemini 2.5 series models.
      const stream = await ai.models.generateContentStream({
        model: 'gemini-2.5-flash',
        contents: [...messages, userMsg].map(m => ({
          role: m.role === 'user' ? 'user' : 'model',
          parts: [{ text: m.content }]
        })),
        config: {
          systemInstruction: "You are the Prism Nexus 2.5 Flash Agent. You are highly intelligent, professional, and operate with surgical precision. Use 'Thinking Mode' for every response to ensure maximal accuracy and logic. You have real-time access to Google Search and Google Maps. For any factual query, always cross-reference the web. For location queries, provide maps links. Maintain the premium anonymous brand persona at all times.",
          tools: [{ googleSearch: {} }, { googleMaps: {} }],
          // Use appropriate thinking budget for gemini-2.5-flash (max 24576)
          thinkingConfig: { thinkingBudget: 24576 }
        }
      });

      let assistantResponse = "";
      let webSources: { uri: string, title: string }[] = [];
      let mapSources: { uri: string, title: string }[] = [];

      setMessages(prev => [...prev, { role: 'assistant', content: "" }]);

      for await (const chunk of stream) {
        // Correct: Access the extracted string output using the .text property
        const textChunk = (chunk as GenerateContentResponse).text || "";
        assistantResponse += textChunk;
        
        const grounding = (chunk as GenerateContentResponse).candidates?.[0]?.groundingMetadata;
        if (grounding?.groundingChunks) {
          grounding.groundingChunks.forEach((c: any) => {
            if (c.web) webSources.push({ uri: c.web.uri, title: c.web.title });
            if (c.maps) mapSources.push({ uri: c.maps.uri, title: c.maps.title });
          });
        }

        setMessages(prev => {
          const newMessages = [...prev];
          newMessages[newMessages.length - 1] = {
            role: 'assistant',
            content: assistantResponse,
            sources: (webSources.length || mapSources.length) ? { 
              web: Array.from(new Set(webSources.map(s => s.uri))).map(uri => webSources.find(s => s.uri === uri)!), 
              maps: Array.from(new Set(mapSources.map(s => s.uri))).map(uri => mapSources.find(s => s.uri === uri)!)
            } : undefined
          };
          return newMessages;
        });
      }
    } catch (error) {
      console.error("Nexus Link Error:", error);
      setMessages(prev => [...prev, { role: 'assistant', content: "Quantum link failure. Re-initializing core connection..." }]);
    } finally {
      setIsTyping(false);
    }
  };

  const quickReplies = ["Pricing Matrix", "Sovereign Demo", "Nexus Audit", "Map Mission Nodes"];

  return (
    <div className="fixed bottom-10 right-10 z-[100] font-sans">
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 30, transformOrigin: 'bottom right' }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 30 }}
            className="mb-6 w-[460px] h-[720px] bg-[#020308]/98 border border-white/10 rounded-[56px] shadow-[0_40px_120px_rgba(0,0,0,1)] flex flex-col overflow-hidden backdrop-blur-3xl"
          >
            {/* Pro Header */}
            <div className="bg-gradient-to-br from-indigo-600/10 via-fuchsia-600/10 to-violet-600/10 p-10 flex items-center justify-between border-b border-white/5">
              <div className="flex items-center gap-6">
                <div className="w-16 h-16 bg-white/5 rounded-3xl flex items-center justify-center border border-white/10 shadow-2xl relative">
                  <Bot className="text-indigo-400 w-9 h-9" />
                  <div className="absolute -top-1 -right-1 w-4 h-4 bg-indigo-500 rounded-full border-2 border-[#020308] animate-pulse" />
                </div>
                <div>
                  <h3 className="text-white font-black text-xl tracking-premium uppercase">Nexus 2.5 Flash</h3>
                  <div className="flex items-center gap-2.5">
                    <span className="w-2.5 h-2.5 bg-indigo-500 rounded-full animate-pulse shadow-[0_0_15px_#4F46E5]" />
                    <span className="text-[11px] text-indigo-400 uppercase font-black tracking-[0.4em]">Reasoning Grid Active</span>
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
                        m.role === 'user' ? 'bg-white text-black border-white' : 'bg-slate-900 border-white/10 text-indigo-400'
                      }`}>
                        {m.role === 'user' ? <User className="w-6 h-6" /> : <Brain className="w-6 h-6" />}
                      </div>
                      <div className={`p-7 rounded-[36px] text-[15px] middle leading-[1.7] font-medium shadow-2xl ${
                        m.role === 'user' 
                          ? 'bg-white text-black rounded-tr-none' 
                          : 'bg-white/[0.04] border border-white/10 text-slate-200 rounded-tl-none backdrop-blur-md'
                      }`}>
                        {m.content || (isTyping && i === messages.length - 1 ? <div className="flex gap-2.5 py-2.5 middle"><span className="w-2.5 h-2.5 bg-indigo-500 rounded-full animate-bounce"/><span className="w-2.5 h-2.5 bg-indigo-500 rounded-full animate-bounce [animation-delay:0.2s]"/><span className="w-2.5 h-2.5 bg-indigo-500 rounded-full animate-bounce [animation-delay:0.4s]"/></div> : "")}
                      </div>
                    </div>
                    {m.sources && (
                      <div className="flex flex-wrap gap-2.5 mt-2">
                        {m.sources.web?.map((s, idx) => (
                          <a key={idx} href={s.uri} target="_blank" rel="noopener" className="flex items-center gap-2.5 px-5 py-2.5 bg-indigo-500/10 border border-indigo-500/20 rounded-[20px] text-[10px] text-indigo-300 font-black tracking-widest uppercase hover:bg-indigo-500/30 transition-all shadow-lg">
                             <Search className="w-3.5 h-3.5" /> {s.title}
                          </a>
                        ))}
                        {m.sources.maps?.map((s, idx) => (
                          <a key={idx} href={s.uri} target="_blank" rel="noopener" className="flex items-center gap-2.5 px-5 py-2.5 bg-emerald-500/10 border border-emerald-500/20 rounded-[20px] text-[10px] text-emerald-300 font-black tracking-widest uppercase hover:bg-emerald-500/30 transition-all shadow-lg">
                             <MapPin className="w-3.5 h-3.5" /> {s.title}
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
                  placeholder="Communicate with Nexus..."
                  className="w-full bg-white/5 border border-white/10 rounded-[36px] px-10 py-6 pr-24 text-[16px] font-medium focus:outline-none focus:border-indigo-500/40 text-white placeholder:text-slate-700 transition-all group-hover:bg-white/[0.08] shadow-inner"
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

      <motion.button
        whileHover={{ scale: 1.05, rotate: 5 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setIsOpen(!isOpen)}
        className={`w-24 h-24 rounded-[42px] flex items-center justify-center shadow-[0_40px_100px_rgba(0,0,0,1)] transition-all duration-700 border-2 ${
          isOpen ? 'bg-white text-black border-white' : 'bg-[#020308] text-white border-white/10'
        }`}
      >
        {isOpen ? <X className="w-12 h-12" /> : <MessageCircle className="w-12 h-12" />}
      </motion.button>
    </div>
  );
};
