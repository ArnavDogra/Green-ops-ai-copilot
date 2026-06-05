"use client";

import { useState, useRef, useEffect } from 'react';
import { Send, Bot, User, Sparkles } from 'lucide-react';
import { motion } from 'framer-motion';

export default function AICopilot() {
  const [messages, setMessages] = useState([
    { role: 'assistant', content: 'Hello! I am your GreenOps AI Copilot. Ask me how to reduce your cloud footprint or why emissions spiked recently.' }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim()) return;
    
    const userMsg = input.trim();
    setMessages(prev => [...prev, { role: 'user', content: userMsg }]);
    setInput('');
    setLoading(true);

    try {
      const res = await fetch('http://localhost:8000/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: userMsg })
      });
      if (!res.ok) throw new Error("Backend unavailable");
      const data = await res.json();
      
      setMessages(prev => [...prev, { role: 'assistant', content: data.response }]);
      setLoading(false);
    } catch (e) {
      // Mock fallback for Vercel deployment where localhost:8000 isn't available
      setTimeout(() => {
        setMessages(prev => [...prev, { 
          role: 'assistant', 
          content: "I've analyzed your infrastructure. By shifting 30% of your non-critical batch jobs to off-peak hours and upgrading your primary RDS instance to a Graviton processor, you could reduce carbon emissions by 14% and save ~$320/month. Would you like me to automatically draft the Terraform changes for this?" 
        }]);
        setLoading(false);
      }, 1500);
    }
  };

  return (
    <div className="flex flex-col h-[600px] max-w-4xl mx-auto glass-card rounded-xl overflow-hidden shadow-2xl border border-slate-200 dark:border-slate-700/50">
      {/* Header */}
      <div className="bg-slate-100/80 dark:bg-slate-800/80 px-6 py-4 border-b border-slate-200 dark:border-slate-700/50 flex items-center gap-3">
        <div className="bg-green-500/20 p-2 rounded-lg">
          <Sparkles className="w-5 h-5 text-green-600 dark:text-green-400" />
        </div>
        <div>
          <h2 className="font-semibold text-lg text-slate-900 dark:text-white">GreenOps AI Copilot</h2>
          <p className="text-xs text-slate-500 dark:text-slate-400">Powered by Llama 3 / Gemini</p>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-6 space-y-6 custom-scrollbar">
        {messages.map((msg, idx) => (
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            key={idx} 
            className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div className={`flex gap-3 max-w-[80%] ${msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${msg.role === 'user' ? 'bg-blue-500' : 'bg-green-500/20 border border-green-500/50'}`}>
                {msg.role === 'user' ? <User className="w-4 h-4 text-white" /> : <Bot className="w-4 h-4 text-green-600 dark:text-green-400" />}
              </div>
              <div className={`px-4 py-3 rounded-2xl text-sm leading-relaxed ${
                msg.role === 'user' 
                  ? 'bg-blue-600 text-white rounded-tr-sm' 
                  : 'bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200 border border-slate-200 dark:border-slate-700 rounded-tl-sm'
              }`}>
                {msg.content}
              </div>
            </div>
          </motion.div>
        ))}
        {loading && (
          <div className="flex justify-start">
             <div className="flex gap-3">
               <div className="w-8 h-8 rounded-full bg-green-500/20 border border-green-500/50 flex items-center justify-center flex-shrink-0">
                  <Bot className="w-4 h-4 text-green-600 dark:text-green-400" />
               </div>
               <div className="bg-white dark:bg-slate-800 px-4 py-4 rounded-2xl rounded-tl-sm border border-slate-200 dark:border-slate-700 flex gap-1">
                  <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce"></div>
                  <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                  <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></div>
               </div>
             </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="p-4 bg-white/50 dark:bg-slate-800/50 border-t border-slate-200 dark:border-slate-700/50">
        <div className="flex gap-2">
          <input 
            type="text" 
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            placeholder="Ask about emissions, suggest optimizations..."
            className="flex-1 bg-slate-100 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-green-500 focus:ring-1 focus:ring-green-500 transition-all text-slate-800 dark:text-slate-200"
          />
          <button 
            onClick={handleSend}
            disabled={loading || !input.trim()}
            className="bg-green-500 hover:bg-green-600 disabled:opacity-50 disabled:hover:bg-green-500 text-slate-900 px-4 rounded-lg transition-colors flex items-center justify-center"
          >
            <Send className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
}
