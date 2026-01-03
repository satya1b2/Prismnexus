
import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  X, Send, Search, MapPin, Sparkles, Brain, Layers, Terminal, 
  ShieldCheck, Activity, Cpu, Rocket, Settings2, Trash2,
  ChevronRight, AlertCircle, Info, Database, RefreshCw, 
  ExternalLink, Camera, Video, Mic, Image as ImageIcon,
  Play, Download, History, Wand2, Type as TypeIcon, Globe,
  Crown
} from 'lucide-react';
import { GoogleGenAI, Modality, Type, GenerateContentResponse, LiveServerMessage } from "@google/genai";
import { AgentConfig, NexusModel, AspectRatio, ImageSize } from '../types';
import { AGENT_TEMPLATES } from '../constants';
import { decode, encode, decodeAudioData, blobToBase64 } from '../lib/audio-utils';

type ConsoleTab = 'orchestrator' | 'studio' | 'vocal' | 'vision';

interface GroundingLink {
  uri: string;
  title: string;
  type: 'web' | 'maps';
}

interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
  sources?: GroundingLink[];
  thinking?: string;
}

export const NexusConsole: React.FC<{ onClose: () => void, isOwner?: boolean }> = ({ onClose, isOwner }) => {
  const [activeTab, setActiveTab] = useState<ConsoleTab>('orchestrator');
  const [isProcessing, setIsProcessing] = useState(false);
  
  // Media State
  const [mediaPrompt, setMediaPrompt] = useState('');
  const [mediaAspectRatio, setMediaAspectRatio] = useState<AspectRatio>('16:9');
  const [mediaSize, setMediaSize] = useState<ImageSize>('1K');
  const [generatedImageUrl, setGeneratedImageUrl] = useState<string | null>(null);
  const [generatedVideoUrl, setGeneratedVideoUrl] = useState<string | null>(null);
  const [uploadFile, setUploadFile] = useState<File | null>(null);
  const [uploadPreview, setUploadPreview] = useState<string | null>(null);

  // Live API State
  const [isLiveActive, setIsLiveActive] = useState(false);
  const audioContextRef = useRef<AudioContext | null>(null);
  const liveSessionRef = useRef<any>(null);
  const sources = useRef<Set<AudioBufferSourceNode>>(new Set());
  const nextStartTime = useRef(0);

  // Orchestrator State
  const [chatInput, setChatInput] = useState('');
  const [chatHistory, setChatHistory] = useState<ChatMessage[]>([]);
  const [thinkingMode, setThinkingMode] = useState(true);
  const chatScrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (chatScrollRef.current) {
      chatScrollRef.current.scrollTop = chatScrollRef.current.scrollHeight;
    }
  }, [chatHistory, isProcessing]);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setUploadFile(file);
      const reader = new FileReader();
      reader.onloadend = () => setUploadPreview(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  const checkApiKey = async () => {
    // @ts-ignore
    if (window.aistudio && !(await window.aistudio.hasSelectedApiKey())) {
      // @ts-ignore
      await window.aistudio.openSelectKey();
    }
  };

  const getCoordinates = (): Promise<{lat: number, lng: number} | null> => {
    return new Promise((resolve) => {
      if (!navigator.geolocation) return resolve(null);
      navigator.geolocation.getCurrentPosition(
        (pos) => resolve({ lat: pos.coords.latitude, lng: pos.coords.longitude }),
        () => resolve(null)
      );
    });
  };

  const generateImage = async () => {
    setIsProcessing(true);
    try {
      await checkApiKey();
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });
      const response = await ai.models.generateContent({
        model: 'gemini-3-pro-image-preview',
        contents: { parts: [{ text: mediaPrompt }] },
        config: {
          imageConfig: { aspectRatio: mediaAspectRatio, imageSize: mediaSize },
          tools: [{ googleSearch: {} }] 
        }
      });
      
      const parts = response.candidates?.[0]?.content?.parts || [];
      const imagePart = parts.find(p => p.inlineData);
      if (imagePart?.inlineData) {
        setGeneratedImageUrl(`data:image/png;base64,${imagePart.inlineData.data}`);
        setGeneratedVideoUrl(null);
      }
    } catch (err: any) {
      console.error(err);
      alert("Neural synthesis interrupted.");
    } finally { setIsProcessing(false); }
  };

  const generateVideo = async () => {
    setIsProcessing(true);
    try {
      await checkApiKey();
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });
      let op = await ai.models.generateVideos({
        model: 'veo-3.1-fast-generate-preview',
        prompt: mediaPrompt,
        config: {
          numberOfVideos: 1,
          resolution: '720p',
          aspectRatio: (mediaAspectRatio === '9:16' || mediaAspectRatio === '16:9') ? mediaAspectRatio : '16:9'
        }
      });

      while (!op.done) {
        await new Promise(r => setTimeout(r, 10000));
        op = await ai.operations.getVideosOperation({ operation: op });
      }

      const link = op.response?.generatedVideos?.[0]?.video?.uri;
      const res = await fetch(`${link}&key=${process.env.API_KEY}`);
      const blob = await res.blob();
      setGeneratedVideoUrl(URL.createObjectURL(blob));
      setGeneratedImageUrl(null);
    } catch (err: any) {
      console.error(err);
      alert("Veo rendering failed.");
    } finally { setIsProcessing(false); }
  };

  const startLiveChat = async () => {
    if (isLiveActive) {
      liveSessionRef.current?.close();
      setIsLiveActive(false);
      return;
    }
    try {
      await checkApiKey();
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });
      const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 24000 });
      audioContextRef.current = audioCtx;
      
      const sessionPromise = ai.live.connect({
        model: 'gemini-2.5-flash-native-audio-preview-09-2025',
        callbacks: {
          onopen: () => setIsLiveActive(true),
          onmessage: async (msg: LiveServerMessage) => {
            const audioData = msg.serverContent?.modelTurn?.parts[0]?.inlineData?.data;
            if (audioData) {
              const buffer = await decodeAudioData(decode(audioData), audioCtx, 24000, 1);
              const source = audioCtx.createBufferSource();
              source.buffer = buffer;
              source.connect(audioCtx.destination);
              nextStartTime.current = Math.max(nextStartTime.current, audioCtx.currentTime);
              source.start(nextStartTime.current);
              nextStartTime.current += buffer.duration;
              sources.current.add(source);
              source.onended = () => sources.current.delete(source);
            }
            if (msg.serverContent?.interrupted) {
              sources.current.forEach(s => s.stop());
              sources.current.clear();
              nextStartTime.current = 0;
            }
          },
          onclose: () => setIsLiveActive(false),
          onerror: () => setIsLiveActive(false)
        },
        config: {
          responseModalities: [Modality.AUDIO],
          speechConfig: { voiceConfig: { prebuiltVoiceConfig: { voiceName: 'Zephyr' } } },
          systemInstruction: "You are the Nexus Sovereign AI. Speak with absolute precision and professional authority."
        }
      });

      const session = await sessionPromise;
      liveSessionRef.current = session;

      const micStream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const micCtx = new AudioContext({ sampleRate: 16000 });
      const micSource = micCtx.createMediaStreamSource(micStream);
      const processor = micCtx.createScriptProcessor(4096, 1, 1);
      processor.onaudioprocess = (e) => {
        const input = e.inputBuffer.getChannelData(0);
        const int16 = new Int16Array(input.length);
        for (let i = 0; i < input.length; i++) int16[i] = input[i] * 32768;
        sessionPromise.then(s => s.sendRealtimeInput({
          media: { data: encode(new Uint8Array(int16.buffer)), mimeType: 'audio/pcm;rate=16000' }
        }));
      };
      micSource.connect(processor);
      processor.connect(micCtx.destination);
    } catch (e) { console.error(e); }
  };

  const handleChat = async () => {
    if (!chatInput.trim()) return;
    const userMsg: ChatMessage = { role: 'user', content: chatInput };
    setChatHistory(prev => [...prev, userMsg]);
    setChatInput('');
    setIsProcessing(true);
    
    try {
      await checkApiKey();
      const coords = await getCoordinates();
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });
      
      const response = await ai.models.generateContent({
        model: thinkingMode ? 'gemini-3-pro-preview' : 'gemini-3-flash-preview',
        contents: [...chatHistory, userMsg].map(m => ({
          role: m.role === 'user' ? 'user' : 'model',
          parts: [{ text: m.content }]
        })),
        config: {
          tools: [{ googleSearch: {} }, { googleMaps: {} }],
          toolConfig: coords ? {
            retrievalConfig: { latLng: { latitude: coords.lat, longitude: coords.lng } }
          } : undefined,
          thinkingConfig: thinkingMode ? { thinkingBudget: 32768 } : undefined
        }
      });

      const grounding = response.candidates?.[0]?.groundingMetadata?.groundingChunks || [];
      const sources: GroundingLink[] = grounding.map((c: any) => {
        if (c.web) return { uri: c.web.uri, title: c.web.title, type: 'web' };
        if (c.maps) return { uri: c.maps.uri, title: c.maps.title, type: 'maps' };
        return null;
      }).filter(Boolean);

      setChatHistory(prev => [...prev, { 
        role: 'assistant', 
        content: response.text || "Command processed.",
        sources: sources.length > 0 ? sources : undefined
      }]);
    } catch (e) { 
      console.error(e);
      setChatHistory(prev => [...prev, { role: 'assistant', content: "Quantum uplink failure. Re-initializing node..." }]);
    } finally { setIsProcessing(false); }
  };

  const analyzeVision = async (type: 'image' | 'video') => {
    if (!uploadFile) return alert("Upload matrix source.");
    setIsProcessing(true);
    try {
      await checkApiKey();
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });
      const base64 = await blobToBase64(uploadFile);
      const response = await ai.models.generateContent({
        model: 'gemini-3-pro-preview',
        contents: {
          parts: [
            { inlineData: { data: base64, mimeType: uploadFile.type } },
            { text: `Sovereign Matrix Analysis Request: Identify all entities, architectural patterns, and actionable intelligence in this ${type}.` }
          ]
        },
        config: { tools: [{ googleSearch: {} }] }
      });
      setChatHistory(prev => [...prev, { role: 'assistant', content: response.text || "" }]);
      setActiveTab('orchestrator');
    } catch (e) { console.error(e); } finally { setIsProcessing(false); }
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 30 }}
      className="fixed inset-4 z-[100] glass-panel rounded-[56px] border border-white/20 shadow-[0_0_150px_rgba(0,0,0,0.95)] overflow-hidden flex flex-col backdrop-blur-3xl"
    >
      {/* Sovereign Header */}
      <div className="h-28 border-b border-white/5 flex items-center justify-between px-12 bg-slate-950/40 relative">
        <div className="absolute inset-0 bg-gradient-to-r from-indigo-600/5 to-fuchsia-600/5 pointer-events-none" />
        
        <div className="flex items-center gap-12 relative z-10">
          <div className="flex items-center gap-5">
             <div className="w-16 h-16 bg-white/5 rounded-3xl flex items-center justify-center border border-white/10 shadow-[0_0_30px_rgba(79,70,229,0.3)]">
                {isOwner ? <Crown className="w-9 h-9 text-fuchsia-400" /> : <Cpu className="w-9 h-9 text-indigo-400" />}
             </div>
             <div>
                <h2 className="text-xl font-black uppercase tracking-tighter text-white">
                  {isOwner ? 'Sovereign Core' : 'Nexus Command'}
                </h2>
                <div className="flex items-center gap-3 mt-1">
                   <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_10px_#10b981]" />
                   <span className="text-[10px] font-black text-slate-500 uppercase tracking-[0.3em]">
                     {isOwner ? 'Satyajit Verified Link' : 'Regional Cluster Node'}
                   </span>
                </div>
             </div>
          </div>

          <nav className="flex gap-3 bg-white/5 p-2 rounded-[24px] border border-white/5">
            {[
              { id: 'orchestrator', label: 'Logic', icon: Layers },
              { id: 'studio', label: 'Studio', icon: ImageIcon },
              { id: 'vocal', label: 'Vocal', icon: Mic },
              { id: 'vision', label: 'Vision', icon: Camera },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center gap-3 px-6 py-3 rounded-[18px] text-[10px] font-black uppercase tracking-[0.2em] transition-all duration-500 ${
                  activeTab === tab.id 
                    ? 'bg-white text-black shadow-xl scale-105' 
                    : 'text-slate-500 hover:text-white hover:bg-white/5'
                }`}
              >
                <tab.icon className="w-4 h-4" />
                {tab.label}
              </button>
            ))}
          </nav>
        </div>

        <button onClick={onClose} className="p-4 hover:bg-white/10 rounded-full transition-all text-slate-500 hover:text-white group">
          <X className="w-10 h-10 group-hover:rotate-90 transition-transform" />
        </button>
      </div>

      <div className="flex-grow flex overflow-hidden">
        <div className="flex-grow flex flex-col bg-black/50 relative">
          
          <AnimatePresence mode="wait">
            {activeTab === 'studio' && (
              <motion.div key="studio" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex-grow grid grid-cols-12 overflow-hidden">
                <div className="col-span-4 border-r border-white/5 p-10 space-y-12 overflow-y-auto no-scrollbar bg-slate-900/20">
                  <section className="space-y-6">
                    <h3 className="label-premium text-fuchsia-500">Geometry Matrix</h3>
                    <div className="grid grid-cols-4 gap-2.5">
                      {(['1:1', '16:9', '9:16', '4:3', '3:2', '21:9'] as AspectRatio[]).map(r => (
                        <button key={r} onClick={() => setMediaAspectRatio(r)} className={`py-3 rounded-xl text-[9px] font-black border transition-all ${mediaAspectRatio === r ? 'bg-white text-black border-white' : 'bg-white/5 text-slate-500 border-white/5'}`}>{r}</button>
                      ))}
                    </div>
                  </section>
                  <section className="space-y-6">
                    <h3 className="label-premium text-indigo-500">Resolution Node</h3>
                    <div className="grid grid-cols-3 gap-2.5">
                      {(['1K', '2K', '4K'] as ImageSize[]).map(s => (
                        <button key={s} onClick={() => setMediaSize(s)} className={`py-3 rounded-xl text-[9px] font-black border transition-all ${mediaSize === s ? 'bg-indigo-600 text-white border-indigo-500' : 'bg-white/5 text-slate-500 border-white/5'}`}>{s}</button>
                      ))}
                    </div>
                  </section>
                  <section className="space-y-6">
                    <h3 className="label-premium text-slate-500">Source Material</h3>
                    <div className="relative group aspect-video rounded-[32px] border-2 border-dashed border-white/10 flex flex-col items-center justify-center bg-white/5 overflow-hidden transition-all hover:border-indigo-500/50">
                      {uploadPreview ? <img src={uploadPreview} className="w-full h-full object-cover" alt="Source Preview" /> : <ImageIcon className="w-12 h-12 opacity-10" />}
                      <input type="file" onChange={handleFileUpload} className="absolute inset-0 opacity-0 cursor-pointer" />
                    </div>
                  </section>
                  <textarea value={mediaPrompt} onChange={e => setMediaPrompt(e.target.value)} placeholder="Enter neural synthesis command..." className="w-full h-40 bg-white/5 border border-white/10 rounded-[32px] p-8 text-sm text-white resize-none focus:outline-none focus:border-indigo-500/50 transition-all font-medium" />
                  <div className="grid grid-cols-2 gap-4 pt-4">
                    <button onClick={generateImage} disabled={isProcessing} className="py-6 bg-white text-black rounded-[24px] text-[10px] font-black uppercase tracking-widest hover:bg-fuchsia-500 hover:text-white transition-all shadow-2xl">Synth Image</button>
                    <button onClick={generateVideo} disabled={isProcessing} className="py-6 bg-indigo-600 text-white rounded-[24px] text-[10px] font-black uppercase tracking-widest hover:bg-fuchsia-600 transition-all shadow-2xl">Veo Render</button>
                  </div>
                </div>
                <div className="col-span-8 bg-[#010206] p-12 flex items-center justify-center relative">
                   {isProcessing && <div className="absolute inset-0 z-20 bg-black/80 backdrop-blur-xl flex flex-col items-center justify-center gap-8"><div className="w-24 h-24 border-4 border-indigo-500/10 border-t-indigo-500 rounded-full animate-spin" /><span className="text-white font-black text-xs uppercase tracking-[0.5em] animate-pulse">Rendering Reality...</span></div>}
                   {generatedImageUrl && <img src={generatedImageUrl} className="max-w-full max-h-full rounded-[40px] shadow-[0_50px_100px_rgba(0,0,0,0.8)] border border-white/10" alt="Generated Content" />}
                   {generatedVideoUrl && <video src={generatedVideoUrl} controls autoPlay loop className="max-w-full max-h-full rounded-[40px] shadow-[0_50px_100px_rgba(0,0,0,0.8)] border border-white/10" />}
                   {!generatedImageUrl && !generatedVideoUrl && <div className="opacity-5 text-center"><ImageIcon className="w-80 h-80 mx-auto" /><h4 className="text-6xl font-black uppercase tracking-[0.3em] mt-12">Standby</h4></div>}
                </div>
              </motion.div>
            )}

            {activeTab === 'orchestrator' && (
              <motion.div key="orchestrator" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex-grow flex flex-col h-full overflow-hidden">
                <div ref={chatScrollRef} className="flex-grow overflow-y-auto p-12 space-y-10 no-scrollbar">
                  {chatHistory.map((m, i) => (
                    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                      <div className={`max-w-[75%] space-y-4 ${m.role === 'user' ? 'items-end flex flex-col' : 'items-start flex flex-col'}`}>
                        <div className={`p-8 rounded-[40px] text-[15px] leading-relaxed font-medium shadow-2xl ${
                          m.role === 'user' ? 'bg-white text-black rounded-tr-none' : 'bg-white/5 border border-white/10 text-slate-200 backdrop-blur-md rounded-tl-none'
                        }`}>
                          {m.content}
                        </div>
                        {m.sources && (
                          <div className="flex flex-wrap gap-3">
                            {m.sources.map((s, idx) => (
                              <a key={`${idx}-${s.uri}`} href={s.uri} target="_blank" rel="noopener" className="flex items-center gap-2.5 px-6 py-3 bg-white/5 border border-white/10 rounded-2xl text-[10px] text-slate-400 font-black tracking-widest uppercase hover:bg-white hover:text-black transition-all">
                                 {s.type === 'web' ? <Search className="w-3.5 h-3.5" /> : <MapPin className="w-3.5 h-3.5" />} {s.title}
                              </a>
                            ))}
                          </div>
                        )}
                      </div>
                    </motion.div>
                  ))}
                  {isProcessing && (
                    <div className="flex items-center gap-4 text-slate-500 text-[10px] font-black uppercase tracking-[0.4em]">
                      <div className="flex gap-1">
                        <span className="w-1.5 h-1.5 bg-indigo-500 rounded-full animate-bounce" />
                        <span className="w-1.5 h-1.5 bg-indigo-500 rounded-full animate-bounce [animation-delay:0.2s]" />
                        <span className="w-1.5 h-1.5 bg-indigo-500 rounded-full animate-bounce [animation-delay:0.4s]" />
                      </div>
                      Quantum Reasoning in Progress
                    </div>
                  )}
                </div>
                <div className="p-10 border-t border-white/5 bg-slate-950/60 backdrop-blur-2xl flex gap-6 items-center relative">
                  <button 
                    onClick={() => setThinkingMode(!thinkingMode)} 
                    className={`p-5 rounded-3xl transition-all relative ${thinkingMode ? 'bg-indigo-600 text-white shadow-[0_0_30px_rgba(79,70,229,0.5)]' : 'bg-white/5 text-slate-500 hover:text-white'}`} 
                    title="Toggle Deep Reasoning Matrix"
                  >
                    <Brain className="w-7 h-7" />
                    {thinkingMode && <div className="absolute -top-1 -right-1 w-3 h-3 bg-fuchsia-500 rounded-full animate-ping" />}
                  </button>
                  <input value={chatInput} onChange={e => setChatInput(e.target.value)} onKeyDown={e => e.key === 'Enter' && handleChat()} placeholder="Issue sovereign command..." className="flex-grow bg-white/5 border border-white/10 rounded-[32px] px-10 py-6 text-sm focus:outline-none focus:border-indigo-500/50 transition-all font-medium text-white" />
                  <button onClick={handleChat} className="p-5 bg-white text-black rounded-3xl hover:bg-indigo-500 hover:text-white transition-all shadow-2xl active:scale-95"><Send className="w-7 h-7" /></button>
                </div>
              </motion.div>
            )}

            {activeTab === 'vocal' && (
              <motion.div key="vocal" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex-grow flex flex-col items-center justify-center p-20 gap-10">
                 <div className="w-[640px] glass-panel p-20 rounded-[80px] text-center space-y-16 relative overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-b from-indigo-500/5 to-transparent pointer-events-none" />
                    <div className="w-40 h-40 bg-indigo-600/10 border border-indigo-500/30 rounded-full mx-auto flex items-center justify-center relative">
                       {isLiveActive && (
                         <motion.div 
                           animate={{ scale: [1, 2.5, 1], opacity: [0.6, 0, 0.6] }} 
                           transition={{ repeat: Infinity, duration: 2.5 }} 
                           className="absolute inset-0 bg-indigo-500/20 rounded-full" 
                         />
                       )}
                       <Mic className={`w-20 h-20 ${isLiveActive ? 'text-indigo-400' : 'text-slate-800'}`} />
                    </div>
                    <div className="space-y-4">
                      <h3 className="text-3xl font-black text-white uppercase tracking-tighter">Vocal Matrix Uplink</h3>
                      <p className="text-slate-500 text-xs font-bold uppercase tracking-widest opacity-60">Native Zero-Latency Audio Stream</p>
                    </div>
                    <button onClick={startLiveChat} className={`w-full py-8 rounded-[36px] text-xs font-black uppercase tracking-[0.4em] transition-all ${isLiveActive ? 'bg-red-500 text-white shadow-[0_0_50px_rgba(239,68,68,0.3)]' : 'bg-white text-black hover:bg-indigo-500 hover:text-white'}`}>
                      {isLiveActive ? 'Terminate Uplink' : 'Initialize Native Link'}
                    </button>
                 </div>
              </motion.div>
            )}

            {activeTab === 'vision' && (
               <motion.div key="vision" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex-grow flex items-center justify-center p-20">
                  <div className="grid lg:grid-cols-2 gap-12 w-full max-w-7xl">
                     {[
                       { id: 'img', title: 'Static Core', icon: Camera, color: 'text-cyan-400', label: 'Analyze Image' },
                       { id: 'vid', title: 'Stream Core', icon: Video, color: 'text-violet-400', label: 'Analyze Signal' }
                     ].map(v => (
                       <div key={v.id} className="glass-panel p-16 rounded-[64px] border-white/10 space-y-10 group transition-all hover:border-indigo-500/40 hover:shadow-[0_40px_100px_rgba(79,70,229,0.1)]">
                          <v.icon className={`w-20 h-20 ${v.color}`} />
                          <h3 className="text-4xl font-black text-white uppercase tracking-tighter">{v.title}</h3>
                          <div className="aspect-video bg-white/5 rounded-[40px] border-2 border-dashed border-white/10 flex items-center justify-center overflow-hidden relative group">
                             {uploadPreview ? <img src={uploadPreview} className="w-full h-full object-cover" alt="Vision Target" /> : <v.icon className="w-16 h-16 opacity-10" />}
                             <input type="file" onChange={handleFileUpload} className="absolute inset-0 opacity-0 cursor-pointer" />
                             <div className="absolute inset-0 bg-indigo-600/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                <span className="text-white text-[10px] font-black uppercase tracking-widest">Injest Source</span>
                             </div>
                          </div>
                          <button onClick={() => analyzeVision(v.id === 'img' ? 'image' : 'video')} className="w-full py-8 bg-white text-black rounded-[32px] text-xs font-black uppercase tracking-[0.4em] transition-all hover:bg-indigo-500 hover:text-white shadow-2xl">
                            {v.label}
                          </button>
                       </div>
                     ))}
                  </div>
               </motion.div>
            )}
          </AnimatePresence>
          
          <div className="h-16 border-t border-white/5 bg-slate-950/80 flex items-center justify-between px-12 text-[10px] font-black text-slate-600 uppercase tracking-widest relative">
             <div className="flex gap-16 items-center">
                <span className="flex items-center gap-3 text-indigo-400">
                   <div className="w-2 h-2 bg-indigo-500 rounded-full animate-pulse" /> 
                   Core: {thinkingMode ? 'Pro Reasoning' : 'Standard Logic'}
                </span>
                <span className="flex items-center gap-3 text-fuchsia-500">
                   <Crown className="w-4 h-4" /> Mode: {isOwner ? 'Sovereign-Alpha' : 'Cluster-Access'}
                </span>
                <span className="flex items-center gap-3"><Globe className="w-4 h-4 text-cyan-400" /> Grounding: Web + Local</span>
             </div>
             <div className="flex gap-12 opacity-40">
                <span>Latency: 18ms</span>
                <span className="text-indigo-400">Identity: satyajitna496@gmail.com</span>
                <span className="text-indigo-400">Owner Verified</span>
             </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};
