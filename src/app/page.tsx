"use client";

import { useState } from 'react';
import Dashboard from '@/components/Dashboard';
import AICopilot from '@/components/AICopilot';
import EarthHero from '@/components/EarthHero';
import GreenScore from '@/components/GreenScore';
import { Leaf, Activity, MessageSquare, ShieldAlert, Sun, Moon } from 'lucide-react';

export default function Home() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [isDark, setIsDark] = useState(true);

  return (
    <div className={isDark ? 'dark' : ''}>
      <main className="min-h-screen bg-slate-50 dark:bg-[#0f172a] text-slate-900 dark:text-slate-50 flex flex-col font-sans transition-colors duration-300">
        {/* Navbar */}
        <nav className="glass-card sticky top-0 z-50 flex items-center justify-between px-8 py-4 border-b border-slate-200 dark:border-slate-800 transition-colors duration-300">
        <div className="flex items-center gap-3">
          <div className="bg-green-500/20 p-2 rounded-lg border border-green-500/50">
            <Leaf className="text-green-400 w-6 h-6 neon-glow" />
          </div>
          <h1 className="text-xl font-bold tracking-tight">GreenOps <span className="text-green-400">AI Copilot</span></h1>
        </div>
        
        <div className="flex space-x-6 text-sm font-medium">
          <button 
            onClick={() => setActiveTab('dashboard')} 
            className={`flex items-center gap-2 px-3 py-2 rounded-md transition-all ${activeTab === 'dashboard' ? 'text-green-600 dark:text-green-400 bg-green-500/10' : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 bg-transparent hover:bg-slate-200 dark:hover:bg-slate-800/50'}`}
          >
            <Activity className="w-4 h-4" /> Command Center
          </button>
          <button 
            onClick={() => setActiveTab('greenscore')}
            className={`flex items-center gap-2 px-3 py-2 rounded-md transition-all ${activeTab === 'greenscore' ? 'text-green-600 dark:text-green-400 bg-green-500/10' : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 bg-transparent hover:bg-slate-200 dark:hover:bg-slate-800/50'}`}
          >
            <ShieldAlert className="w-4 h-4" /> Green Score
          </button>
          <button 
            onClick={() => setActiveTab('copilot')}
            className={`flex items-center gap-2 px-3 py-2 rounded-md transition-all ${activeTab === 'copilot' ? 'text-green-600 dark:text-green-400 bg-green-500/10' : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 bg-transparent hover:bg-slate-200 dark:hover:bg-slate-800/50'}`}
          >
            <MessageSquare className="w-4 h-4" /> AI Copilot
          </button>
        </div>
        
        <div className="flex items-center gap-4">
          <button 
            onClick={() => setIsDark(!isDark)}
            className="p-2 rounded-full hover:bg-slate-200 dark:hover:bg-slate-800 transition-colors text-slate-600 dark:text-slate-400"
          >
            {isDark ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
          </button>
          <div className="flex items-center gap-2 bg-slate-200 dark:bg-slate-800/50 px-3 py-1.5 rounded-full border border-slate-300 dark:border-slate-700">
            <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
            <span className="text-xs font-medium text-slate-700 dark:text-slate-300">Live Sync</span>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      {activeTab === 'dashboard' && (
        <div className="w-full h-[400px] relative border-b border-slate-200 dark:border-slate-800/50 bg-gradient-to-b from-slate-100 to-slate-50 dark:from-[#0f172a] dark:to-[#020617] overflow-hidden transition-colors duration-300">
           <div className="absolute inset-0 flex items-center justify-between px-12 z-10">
              <div className="max-w-lg">
                <h2 className="text-5xl font-extrabold mb-4 leading-tight text-slate-900 dark:text-white">
                  Predict. <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-600 to-emerald-600 dark:from-green-400 dark:to-emerald-600">Prevent.</span> Reduce.
                </h2>
                <p className="text-slate-600 dark:text-slate-400 text-lg mb-8">
                  Convert your cloud usage into actionable sustainability intelligence. Monitor, forecast, and cut carbon emissions autonomously.
                </p>
                <div className="flex gap-4">
                  <button 
                    onClick={() => setActiveTab('greenscore')}
                    className="px-8 py-3.5 bg-gradient-to-r from-green-500 to-emerald-400 hover:from-green-400 hover:to-emerald-300 text-slate-900 font-bold rounded-xl shadow-[0_0_20px_rgba(34,197,94,0.3)] hover:shadow-[0_0_30px_rgba(34,197,94,0.5)] transform hover:-translate-y-1 hover:scale-105 transition-all duration-300 flex items-center gap-3"
                  >
                    <ShieldAlert className="w-5 h-5" /> 
                    <span>View Green Score</span>
                  </button>
                </div>
              </div>
              <div className="w-[500px] h-[500px]">
                <EarthHero isDark={isDark} />
              </div>
           </div>
        </div>
      )}

      {/* Main Content Area */}
      <div className="flex-1 p-8 max-w-7xl mx-auto w-full">
        {activeTab === 'dashboard' && <Dashboard />}
        {activeTab === 'copilot' && <AICopilot />}
        {activeTab === 'greenscore' && <GreenScore />}
      </div>
      </main>
    </div>
  );
}
