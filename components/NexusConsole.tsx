
import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  X, Send, Search, MapPin, Sparkles, Brain, Layers, Terminal, 
  ShieldCheck, Activity, Cpu, Rocket, Settings2, Trash2,
  ChevronRight, AlertCircle, Info, Database, RefreshCw, 
  ExternalLink, Camera, Video, Mic, Image as ImageIcon,
  Play, Download, History, Wand2, Type as TypeIcon
} from 'lucide-react';
import { GoogleGenAI, Modality, Type, GenerateContentResponse, LiveServerMessage } from "@google/genai";
import { AgentConfig, NexusModel, AspectRatio, ImageSize } from '../types';
import { AGENT_TEMPLATES } from '../constants';
import { decode, encode, decodeAudioData, blobToBase64 } from '../lib/audio-utils';

type ConsoleTab = 'orchestrator' | 'studio' | 'vocal' | 'vision';

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

  // Live API & TTS State
  const [isLiveActive, setIsLiveActive] = useState(false);
  const audioContextRef = useRef<AudioContext | null>(null);
  const liveSessionRef = useRef<any>(null);
  const sources = useRef<Set<AudioBufferSourceNode>>(new Set());
  const nextStartTime = useRef(0);

  // Chat/Orchestrator State
  const [chatInput, setChatInput] = useState('');
  const [chatHistory, setChatHistory] = useState<any[]>([]);
  const [thinkingMode, setThinkingMode] = useState(true);

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

  const generateImage = async () => {
    setIsProcessing(true);
    try {
      await checkApiKey();
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const response = await ai.models.generateContent({
        model: 'gemini-3-pro-image-preview',
        contents: { parts: [{ text: mediaPrompt }] },
        config: {
          imageConfig: { aspectRatio: mediaAspectRatio, imageSize: mediaSize }
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
      alert("Image synthesis failed.");
    } finally {
      setIsProcessing(false);
    }
  };

  const generateVideo = async () => {
    setIsProcessing(true);
    try {
      await checkApiKey();
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      let op = await ai.models.generateVideos({
        model: 'veo-3.1-fast-generate-preview',
        prompt: mediaPrompt,
        image: uploadFile ? {
          imageBytes: (await blobToBase64(uploadFile)),
          mimeType: uploadFile.type
        } : undefined,
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
    } finally {
      setIsProcessing(false);
    }
  };

  const editImage = async () => {
    if (!uploadFile) return alert("Upload a source image first.");
    setIsProcessing(true);
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const base64 = await blobToBase64(uploadFile);
      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash-image',
        contents: {
          parts: [
            { inlineData: { data: base64, mimeType: uploadFile.type } },
            { text: mediaPrompt }
          ]
        }
      });
      const imagePart = response.candidates?.[0]?.content?.parts.find(p => p.inlineData);
      if (imagePart?.inlineData) {
        setGeneratedImageUrl(`data:image/png;base64,${imagePart.inlineData.data}`);
        setGeneratedVideoUrl(null);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsProcessing(false);
    }
  };

  const startLiveChat = async () => {
    if (isLiveActive) {
      liveSessionRef.current?.close();
      setIsLiveActive(false);
      return;
    }
    try {
      await checkApiKey();
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
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
          speechConfig: { voiceConfig: { prebuiltVoiceConfig: { voiceName: 'Zephyr' } } }
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
        session.sendRealtimeInput({
          media: { data: encode(new Uint8Array(int16.buffer)), mimeType: 'audio/pcm;rate=16000' }
        });
      };
      micSource.connect(processor);
      processor.connect(micCtx.destination);
    } catch (e) { console.error(e); }
  };

  const handleChat = async () => {
    if (!chatInput.trim()) return;
    const userMsg = { role: 'user', content: chatInput };
    setChatHistory(prev => [...prev, userMsg]);
    setChatInput('');
    setIsProcessing(true);
    try {
      await checkApiKey();
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const response = await ai.models.generateContent({
        model: thinkingMode ? 'gemini-3-pro-preview' : 'gemini-3-flash-preview',
        contents: [...chatHistory, userMsg].map(m => ({
          role: m.role === 'user' ? 'user' : 'model',
          parts: [{ text: m.content }]
        })),
        config: {
          tools: [{ googleSearch: {} }, { googleMaps: {} }],
          thinkingConfig: thinkingMode ? { thinkingBudget: 32768 } : undefined
        }
      });
      setChatHistory(prev => [...prev, { role: 'assistant', content: response.text }]);
    } catch (e) { console.error(e); } finally { setIsProcessing(false); }
  };

  const analyzeVision = async (type: 'image' | 'video') => {
    if (!uploadFile) return alert("Please upload a file first.");
    setIsProcessing(true);
    try {
      await checkApiKey();
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const base64 = await blobToBase64(uploadFile);
      const response = await ai.models.generateContent({
        model: 'gemini-3-pro-preview',
        contents: {
          parts: [
            { inlineData: { data: base64, mimeType: uploadFile.type } },
            { text: `Analyze this ${type} and describe its key contents, context, and any specific details found.` }
          ]
        }
      });
      setChatHistory(prev => [...prev, { role: 'assistant', content: response.text }]);
      setActiveTab('orchestrator');
    } catch (e) { console.error(e); } finally { setIsProcessing(false); }
  };

  const speakText = async () => {
    if (!chatInput) return alert("Enter text to synthesize.");
    setIsProcessing(true);
    try {
      await checkApiKey();
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const response = await ai.models.generateContent({
        model: "gemini-2.5-flash-preview-tts",
        contents: [{ parts: [{ text: chatInput }] }],
        config: {
          responseModalities: [Modality.AUDIO],
          speechConfig: { voiceConfig: { prebuiltVoiceConfig: { voiceName: 'Kore' } } }
        }
      });
      const audioCtx = new AudioContext({ sampleRate: 24000 });
      const base64 = response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;
      if (base64) {
        const buffer = await decodeAudioData(decode(base64), audioCtx, 24000, 1);
        const source = audioCtx.createBufferSource();
        source.buffer = buffer;
        source.connect(audioCtx.destination);
        source.start();
      }
    } catch (e) { console.error(e); } finally { setIsProcessing(false); }
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 20 }}
      className="fixed inset-4 z-[100] glass-panel rounded-[48px] border border-white/20 shadow-[0_0_120px_rgba(0,0,0,0.9)] overflow-hidden flex flex-col backdrop-blur-3xl"
    >
      <div className="h-24 border-b border-white/5 flex items-center justify-between px-10 bg-slate-950/20">
        <div className="flex items-center gap-10">
          <div className="flex items-center gap-4">
             <div className="w-12 h-12 bg-white/5 rounded-2xl flex items-center justify-center border border-white/10 shadow-2xl">
                <Cpu className="w-7 h-7 text-fuchsia-500" />
             </div>
             <div>
                <h2 className="text-sm font-black uppercase tracking-widest text-white">
                  {isOwner ? 'Sovereign Command' : 'Nexus Command'}
                </h2>
                <div className="flex items-center gap-2">
                   <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                   <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">
                     {isOwner ? 'Global Owner Node 01' : 'Standard Cluster Node'}
                   </span>
                </div>
             </div>
          </div>

          <nav className="flex gap-2">
            {[
              { id: 'orchestrator', label: 'Orchestrator', icon: Layers },
              { id: 'studio', label: 'Media Studio', icon: ImageIcon },
              { id: 'vocal', label: 'Vocal Lab', icon: Mic },
              { id: 'vision', label: 'Vision Core', icon: Camera },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center gap-3 px-6 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all ${
                  activeTab === tab.id 
                    ? 'bg-white/10 text-white border border-white/20' 
                    : 'text-slate-500 hover:text-white hover:bg-white/5 border border-transparent'
                }`}
              >
                <tab.icon className="w-4 h-4" />
                {tab.label}
              </button>
            ))}
          </nav>
        </div>

        <button onClick={onClose} className="p-3 hover:bg-white/10 rounded-full transition-colors text-slate-500 hover:text-white">
          <X className="w-8 h-8" />
        </button>
      </div>

      <div className="flex-grow flex overflow-hidden">
        <div className="flex-grow flex flex-col bg-black/40 relative">
          
          <AnimatePresence mode="wait">
            {activeTab === 'studio' && (
              <motion.div key="studio" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex-grow grid grid-cols-12 overflow-hidden">
                <div className="col-span-4 border-r border-white/5 p-10 space-y-10 overflow-y-auto no-scrollbar">
                  <section className="space-y-6">
                    <h3 className="label-premium text-fuchsia-500">Config: {mediaAspectRatio} / {mediaSize}</h3>
                    <div className="grid grid-cols-4 gap-2">
                      {(['1:1', '16:9', '9:16', '4:3', '3:2', '3:4', '2:3', '21:9'] as AspectRatio[]).map(r => (
                        <button key={r} onClick={() => setMediaAspectRatio(r)} className={`py-2 rounded-lg text-[8px] font-bold border ${mediaAspectRatio === r ? 'bg-white text-black' : 'bg-white/5 text-slate-500'}`}>{r}</button>
                      ))}
                    </div>
                    <div className="grid grid-cols-3 gap-2">
                      {(['1K', '2K', '4K'] as ImageSize[]).map(s => (
                        <button key={s} onClick={() => setMediaSize(s)} className={`py-2 rounded-lg text-[8px] font-bold border ${mediaSize === s ? 'bg-indigo-600 text-white' : 'bg-white/5 text-slate-500'}`}>{s}</button>
                      ))}
                    </div>
                  </section>
                  <section className="space-y-6">
                    <h3 className="label-premium text-slate-500">Source Material</h3>
                    <div className="relative group aspect-video rounded-3xl border-2 border-dashed border-white/10 flex flex-col items-center justify-center bg-white/5 overflow-hidden">
                      {uploadPreview ? <img src={uploadPreview} className="w-full h-full object-cover" /> : <ImageIcon className="w-10 h-10 opacity-20" />}
                      <input type="file" onChange={handleFileUpload} className="absolute inset-0 opacity-0 cursor-pointer" />
                    </div>
                  </section>
                  <textarea value={mediaPrompt} onChange={e => setMediaPrompt(e.target.value)} placeholder="Neural prompt input..." className="w-full h-32 bg-white/5 border border-white/10 rounded-3xl p-6 text-sm text-white resize-none" />
                  <div className="grid grid-cols-2 gap-4">
                    <button onClick={generateImage} disabled={isProcessing} className="py-5 bg-white text-black rounded-2xl text-[10px] font-black uppercase hover:bg-fuchsia-500 transition-all">Image Synth</button>
                    <button onClick={generateVideo} disabled={isProcessing} className="py-5 bg-fuchsia-600 text-white rounded-2xl text-[10px] font-black uppercase hover:bg-violet-600 transition-all">Veo Render</button>
                    <button onClick={editImage} disabled={isProcessing || !uploadFile} className="col-span-2 py-5 bg-indigo-600 text-white rounded-2xl text-[10px] font-black uppercase">Modify Source</button>
                  </div>
                </div>
                <div className="col-span-8 bg-[#020308] p-10 flex items-center justify-center relative overflow-hidden">
                   {isProcessing && <div className="absolute inset-0 z-20 bg-black/60 backdrop-blur-md flex items-center justify-center"><div className="w-20 h-20 border-4 border-fuchsia-500/10 border-t-fuchsia-500 rounded-full animate-spin" /></div>}
                   {generatedImageUrl && <img src={generatedImageUrl} className="max-w-full max-h-full rounded-3xl shadow-2xl border border-white/10" />}
                   {generatedVideoUrl && <video src={generatedVideoUrl} controls autoPlay loop className="max-w-full max-h-full rounded-3xl shadow-2xl border border-white/10" />}
                   {!generatedImageUrl && !generatedVideoUrl && <div className="opacity-10 text-center"><ImageIcon className="w-64 h-64 mx-auto" /><h4 className="text-4xl font-black uppercase tracking-widest mt-10">Waiting...</h4></div>}
                </div>
              </motion.div>
            )}

            {activeTab === 'orchestrator' && (
              <motion.div key="orchestrator" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex-grow flex flex-col h-full">
                <div className="flex-grow overflow-y-auto p-10 space-y-6 no-scrollbar">
                  <div className="flex flex-col gap-4">
                    {chatHistory.map((m, i) => (
                      <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                        <div className={`max-w-[80%] p-6 rounded-3xl ${m.role === 'user' ? 'bg-white text-black shadow-lg' : 'bg-white/5 border border-white/10 text-slate-200 backdrop-blur-md'}`}>
                          {m.content}
                        </div>
                      </div>
                    ))}
                  </div>
                  {isProcessing && <div className="text-slate-500 animate-pulse text-[10px] font-black uppercase tracking-widest mt-4">Synthesizing Logic Gate...</div>}
                </div>
                <div className="p-10 border-t border-white/5 flex gap-4 bg-slate-900/40 items-center">
                  <button 
                    onClick={() => setThinkingMode(!thinkingMode)} 
                    className={`p-4 rounded-2xl transition-all ${thinkingMode ? 'bg-indigo-600 text-white shadow-[0_0_20px_rgba(79,70,229,0.5)]' : 'bg-white/5 text-slate-500'}`} 
                    title="Deep Reasoning Mode"
                  >
                    <Brain className="w-6 h-6" />
                  </button>
                  <input value={chatInput} onChange={e => setChatInput(e.target.value)} onKeyDown={e => e.key === 'Enter' && handleChat()} placeholder="Issue sovereign command..." className="flex-grow bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-sm focus:outline-none focus:border-indigo-500/40 transition-all" />
                  <button onClick={handleChat} className="p-4 bg-white text-black rounded-2xl hover:bg-indigo-500 hover:text-white transition-all"><Send className="w-6 h-6" /></button>
                </div>
              </motion.div>
            )}

            {activeTab === 'vocal' && (
              <motion.div key="vocal" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex-grow flex flex-col items-center justify-center p-20 gap-10">
                 <div className="w-[560px] glass-panel p-16 rounded-[64px] text-center space-y-12">
                    <div className="w-28 h-28 bg-fuchsia-600/10 border border-fuchsia-500/30 rounded-full mx-auto flex items-center justify-center relative">
                       {isLiveActive && <motion.div animate={{ scale: [1, 1.8, 1], opacity: [0.5, 0, 0.5] }} transition={{ repeat: Infinity, duration: 2 }} className="absolute inset-0 bg-fuchsia-500/20 rounded-full" />}
                       <Mic className={`w-12 h-12 ${isLiveActive ? 'text-fuchsia-400' : 'text-slate-800'}`} />
                    </div>
                    <button onClick={startLiveChat} className={`w-full py-6 rounded-3xl text-[10px] font-black uppercase tracking-widest transition-all ${isLiveActive ? 'bg-red-500 text-white' : 'bg-white text-black hover:bg-fuchsia-500 hover:text-white'}`}>
                      {isLiveActive ? 'Sever Uplink' : 'Start Native Live API'}
                    </button>
                    <div className="flex gap-4">
                      <input value={chatInput} onChange={e => setChatInput(e.target.value)} placeholder="Synthesis text..." className="flex-grow bg-white/5 border border-white/10 rounded-2xl px-6 py-4" />
                      <button onClick={speakText} className="p-4 bg-white/10 rounded-2xl hover:bg-white/20"><Rocket className="w-6 h-6" /></button>
                    </div>
                 </div>
              </motion.div>
            )}

            {activeTab === 'vision' && (
               <motion.div key="vision" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex-grow flex items-center justify-center p-20 gap-10">
                  <div className="grid lg:grid-cols-2 gap-10 w-full max-w-7xl">
                     <div className="glass-panel p-14 rounded-[56px] border-white/10 space-y-8 group transition-all hover:border-cyan-500/30">
                        <Camera className="w-16 h-16 text-cyan-400" />
                        <h3 className="text-3xl font-black text-white uppercase tracking-tight">Vision Core</h3>
                        <div className="aspect-video bg-white/5 rounded-3xl border-2 border-dashed border-white/10 flex items-center justify-center overflow-hidden relative">
                           {uploadPreview ? <img src={uploadPreview} className="w-full h-full object-cover" /> : <ImageIcon className="w-10 h-10 opacity-20" />}
                           <input type="file" onChange={handleFileUpload} className="absolute inset-0 opacity-0 cursor-pointer" />
                        </div>
                        <button onClick={() => analyzeVision('image')} className="w-full py-6 bg-cyan-600 text-white rounded-[28px] text-[10px] font-black uppercase tracking-widest hover:bg-cyan-500 shadow-xl">Analyze Matrix</button>
                     </div>
                     <div className="glass-panel p-14 rounded-[56px] border-white/10 space-y-8 group transition-all hover:border-violet-500/30">
                        <Video className="w-16 h-16 text-violet-400" />
                        <h3 className="text-3xl font-black text-white uppercase tracking-tight">Signal Flow</h3>
                        <div className="aspect-video bg-white/5 rounded-3xl border-2 border-dashed border-white/10 flex items-center justify-center relative">
                           <Video className="w-10 h-10 opacity-20" />
                           <input type="file" onChange={handleFileUpload} className="absolute inset-0 opacity-0 cursor-pointer" />
                        </div>
                        <button onClick={() => analyzeVision('video')} className="w-full py-6 bg-violet-600 text-white rounded-[28px] text-[10px] font-black uppercase tracking-widest hover:bg-violet-500 shadow-xl">Ingest Signal</button>
                     </div>
                  </div>
               </motion.div>
            )}
          </AnimatePresence>
          
          <div className="h-14 border-t border-white/5 bg-slate-950/60 flex items-center justify-between px-10 text-[10px] font-black text-slate-600 uppercase tracking-widest">
             <div className="flex gap-12">
                <span className="flex items-center gap-2.5 text-fuchsia-500">
                   <div className="w-1.5 h-1.5 bg-fuchsia-500 rounded-full animate-pulse" /> 
                   Core: {thinkingMode ? 'Pro Reasoning' : 'Flash Latency'} / {isOwner ? 'OWNER ACCESS' : 'CLIENT ACCESS'}
                </span>
                <span className="flex items-center gap-2.5"><ShieldCheck className="w-4 h-4 text-emerald-500" /> Grounding: Enabled</span>
             </div>
             <div className="flex gap-10">
                <span className="opacity-40">Latency: 28ms</span>
                <span className="opacity-40">Node: {isOwner ? 'Sovereign-Alpha' : 'Nexus-Cluster-04'}</span>
             </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};
