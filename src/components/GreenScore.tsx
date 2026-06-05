/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { motion } from 'framer-motion';
import { ShieldAlert, CheckCircle2, AlertTriangle, XCircle, UploadCloud, GitBranch } from 'lucide-react';
import { useState } from 'react';

export default function GreenScore() {
  const [analyzing, setAnalyzing] = useState(false);
  const [score, setScore] = useState<null | any>(null);

  const handleAnalyze = () => {
    setAnalyzing(true);
    setTimeout(() => {
      setAnalyzing(false);
      setScore({
        grade: 'B-',
        issues: 3,
        details: [
          { type: 'error', text: 'Dockerfile uses heavy base image (ubuntu instead of alpine)', impact: 'High' },
          { type: 'warning', text: 'CI/CD pipeline runs unused database containers', impact: 'Medium' },
          { type: 'success', text: 'Multi-stage builds implemented correctly', impact: 'Low' }
        ]
      });
    }, 2000);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="glass-card p-8 rounded-xl border border-slate-200 dark:border-slate-700/50">
        <h2 className="text-2xl font-bold mb-2 flex items-center gap-2 text-slate-900 dark:text-white">
          <ShieldAlert className="text-green-500 dark:text-green-400" /> Shift-Left Green Score Analyzer
        </h2>
        <p className="text-slate-600 dark:text-slate-400 mb-8">Upload your Dockerfile or link your Git repository to get an instant sustainability report card before you deploy.</p>

        {!score && !analyzing && (
          <div className="grid grid-cols-2 gap-6">
            <div 
              onClick={handleAnalyze}
              className="border-2 border-dashed border-slate-300 dark:border-slate-600 rounded-xl p-10 flex flex-col items-center justify-center cursor-pointer hover:border-green-500 dark:hover:border-green-400 hover:bg-green-500/5 transition-all"
            >
              <UploadCloud className="w-12 h-12 text-slate-400 mb-4" />
              <span className="font-medium text-slate-900 dark:text-slate-100">Upload Dockerfile</span>
              <span className="text-xs text-slate-500 mt-1">or drag and drop</span>
            </div>
            
            <div 
              onClick={handleAnalyze}
              className="border-2 border-dashed border-slate-300 dark:border-slate-600 rounded-xl p-10 flex flex-col items-center justify-center cursor-pointer hover:border-green-500 dark:hover:border-green-400 hover:bg-green-500/5 transition-all"
            >
              <GitBranch className="w-12 h-12 text-slate-400 mb-4" />
              <span className="font-medium text-slate-900 dark:text-slate-100">Connect Git Repo</span>
              <span className="text-xs text-slate-500 mt-1">Analyze source code</span>
            </div>
          </div>
        )}

        {analyzing && (
          <div className="flex flex-col items-center justify-center py-20">
             <div className="w-16 h-16 border-4 border-slate-200 dark:border-slate-700 border-t-green-500 rounded-full animate-spin mb-6"></div>
             <p className="text-green-600 dark:text-green-400 font-medium animate-pulse">AI is analyzing your infrastructure footprint...</p>
          </div>
        )}

        {score && (
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-slate-50/80 dark:bg-slate-900/50 rounded-xl p-8 border border-slate-200 dark:border-slate-700"
          >
            <div className="flex items-center justify-between mb-8 pb-8 border-b border-slate-200 dark:border-slate-700/50">
               <div>
                  <h3 className="text-xl font-bold text-slate-900 dark:text-slate-200">Analysis Complete</h3>
                  <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">We found {score.issues} areas for improvement.</p>
               </div>
               <div className="w-24 h-24 rounded-full border-4 border-yellow-400 flex items-center justify-center shadow-[0_0_15px_rgba(250,204,21,0.3)]">
                 <span className="text-4xl font-extrabold text-yellow-400">{score.grade}</span>
               </div>
            </div>

            <div className="space-y-4">
              <h4 className="font-semibold text-slate-700 dark:text-slate-300 mb-4">Detailed Findings</h4>
              {score.details.map((d: any, i: number) => (
                <div key={i} className="flex items-start gap-4 p-4 rounded-lg bg-white dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700/50">
                  {d.type === 'error' && <XCircle className="text-red-500 dark:text-red-400 w-5 h-5 mt-0.5" />}
                  {d.type === 'warning' && <AlertTriangle className="text-yellow-500 dark:text-yellow-400 w-5 h-5 mt-0.5" />}
                  {d.type === 'success' && <CheckCircle2 className="text-green-500 dark:text-green-400 w-5 h-5 mt-0.5" />}
                  
                  <div className="flex-1">
                    <p className="text-sm font-medium text-slate-800 dark:text-slate-200">{d.text}</p>
                  </div>
                  <span className={`text-xs px-2 py-1 rounded ${d.type === 'error' ? 'bg-red-500/20 text-red-400' : d.type === 'warning' ? 'bg-yellow-500/20 text-yellow-400' : 'bg-green-500/20 text-green-400'}`}>
                    {d.impact} Impact
                  </span>
                </div>
              ))}
            </div>

            <div className="mt-8 flex gap-4">
              <button 
                onClick={() => setScore(null)}
                className="px-6 py-3 bg-white hover:bg-slate-100 dark:bg-slate-800/80 dark:hover:bg-slate-700 border border-slate-300 dark:border-slate-700 text-sm font-semibold rounded-xl text-slate-800 dark:text-slate-200 transform hover:-translate-y-1 transition-all duration-300 shadow-sm"
              >
                Analyze Another
              </button>
              <button className="px-6 py-3 bg-gradient-to-r from-green-500 to-emerald-400 hover:from-green-400 hover:to-emerald-300 text-slate-900 text-sm font-bold rounded-xl shadow-[0_0_20px_rgba(34,197,94,0.3)] hover:shadow-[0_0_30px_rgba(34,197,94,0.5)] transform hover:-translate-y-1 hover:scale-105 transition-all duration-300 flex items-center gap-2">
                <ShieldAlert className="w-5 h-5" /> Apply AI Fixes Automatically
              </button>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}
