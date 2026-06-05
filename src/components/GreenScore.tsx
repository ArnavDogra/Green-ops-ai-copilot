/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { motion } from 'framer-motion';
import { ShieldAlert, CheckCircle2, AlertTriangle, XCircle, UploadCloud, GitBranch, GitMerge, Terminal, Check } from 'lucide-react';
import { useState } from 'react';

export default function GreenScore() {
  const [analyzing, setAnalyzing] = useState(false);
  const [score, setScore] = useState<null | any>(null);
  
  // Git Repo Modal State
  const [gitModalOpen, setGitModalOpen] = useState(false);
  const [gitRepoUrl, setGitRepoUrl] = useState('');
  const [githubToken, setGithubToken] = useState('');
  const [gitAuthStatus, setGitAuthStatus] = useState<'idle'|'authenticating'|'error'>('idle');
  const [authError, setAuthError] = useState('');

  // AI Fix Modal State
  const [fixing, setFixing] = useState(false);
  const [fixStep, setFixStep] = useState(0);
  const [prCreated, setPrCreated] = useState(false);
  const [prUrl, setPrUrl] = useState('#');

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

  const handleGitConnect = async () => {
    if (!gitRepoUrl) return;
    setGitAuthStatus('authenticating');
    setAuthError('');
    try {
      const res = await fetch('http://localhost:8000/api/github/scan', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ repo_url: gitRepoUrl, github_token: githubToken || undefined })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.detail || 'Scan failed');
      
      setScore(data.score);
      setGitModalOpen(false);
      setGitAuthStatus('idle');
    } catch (err: any) {
      setGitAuthStatus('error');
      setAuthError(err.message);
    }
  };

  const handleFixes = async () => {
    setFixing(true);
    setFixStep(1);
    
    const stepInterval = setInterval(() => {
      setFixStep(prev => (prev < 3 ? prev + 1 : prev));
    }, 2000);

    try {
      const res = await fetch('http://localhost:8000/api/github/fix', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ repo_url: gitRepoUrl, github_token: githubToken || undefined })
      });
      const data = await res.json();
      clearInterval(stepInterval);
      setFixStep(3);
      if (!res.ok) throw new Error(data.detail || 'Fix failed');
      
      setPrUrl(data.pr_url);
      setFixing(false);
      setPrCreated(true);
    } catch (err: any) {
      clearInterval(stepInterval);
      setFixing(false);
      alert("Error creating PR: " + err.message);
    }
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
              onClick={() => setGitModalOpen(true)}
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
              <button 
                onClick={handleFixes}
                className="px-6 py-3 bg-gradient-to-r from-green-500 to-emerald-400 hover:from-green-400 hover:to-emerald-300 text-slate-900 text-sm font-bold rounded-xl shadow-[0_0_20px_rgba(34,197,94,0.3)] hover:shadow-[0_0_30px_rgba(34,197,94,0.5)] transform hover:-translate-y-1 hover:scale-105 transition-all duration-300 flex items-center gap-2"
              >
                <ShieldAlert className="w-5 h-5" /> Apply AI Fixes Automatically
              </button>
            </div>
          </motion.div>
        )}
      </div>

      {/* Git Repo Connect Modal */}
      {gitModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
          <motion.div initial={{opacity: 0, scale: 0.95}} animate={{opacity: 1, scale: 1}} className="bg-white dark:bg-slate-900 w-full max-w-md rounded-2xl p-6 border border-slate-200 dark:border-slate-700 shadow-2xl">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <GitMerge className="w-6 h-6" /> Connect Repository
              </h3>
              <button onClick={() => setGitModalOpen(false)} className="text-slate-500 hover:text-slate-800 dark:hover:text-slate-200"><XCircle className="w-6 h-6" /></button>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">GitHub Repository URL</label>
                <input 
                  type="text" 
                  value={gitRepoUrl}
                  onChange={(e) => setGitRepoUrl(e.target.value)}
                  placeholder="https://github.com/username/repo" 
                  className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg px-4 py-2 text-slate-900 dark:text-white focus:outline-none focus:border-green-500 mb-4"
                />
                
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">GitHub Personal Access Token (For PRs)</label>
                <input 
                  type="password" 
                  value={githubToken}
                  onChange={(e) => setGithubToken(e.target.value)}
                  placeholder="ghp_..." 
                  className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg px-4 py-2 text-slate-900 dark:text-white focus:outline-none focus:border-green-500"
                />
              </div>
              {authError && <p className="text-red-500 text-sm font-medium">{authError}</p>}
              <button 
                onClick={handleGitConnect}
                disabled={!gitRepoUrl || gitAuthStatus !== 'idle'}
                className="w-full py-3 bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-semibold rounded-lg hover:bg-slate-800 dark:hover:bg-slate-100 transition-colors flex justify-center items-center gap-2 disabled:opacity-50"
              >
                {gitAuthStatus === 'authenticating' ? (
                  <><div className="w-5 h-5 border-2 border-slate-500 border-t-white dark:border-t-slate-900 rounded-full animate-spin"></div> Authenticating...</>
                ) : (
                  <><GitMerge className="w-5 h-5" /> Authenticate & Scan</>
                )}
              </button>
            </div>
          </motion.div>
        </div>
      )}

      {/* AI Fixing Modal */}
      {(fixing || prCreated) && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/80 backdrop-blur-sm">
          <motion.div initial={{opacity: 0, scale: 0.95}} animate={{opacity: 1, scale: 1}} className="bg-slate-900 w-full max-w-lg rounded-2xl p-8 border border-slate-700 shadow-2xl relative overflow-hidden">
            {fixing && (
              <div className="flex flex-col items-center justify-center py-6">
                <div className="w-16 h-16 border-4 border-slate-700 border-t-green-500 rounded-full animate-spin mb-6"></div>
                <h3 className="text-xl font-bold text-white mb-2">AI Auto-Fixer</h3>
                <div className="space-y-3 mt-6 w-full font-mono text-sm">
                  <div className={`flex items-center gap-3 ${fixStep >= 1 ? 'text-green-400' : 'text-slate-600'}`}>
                    <Terminal className="w-4 h-4" /> <span>Analyzing dependency graph...</span>
                  </div>
                  <div className={`flex items-center gap-3 ${fixStep >= 2 ? 'text-green-400' : 'text-slate-600'}`}>
                    <Terminal className="w-4 h-4" /> <span>Rewriting Dockerfile to Alpine base...</span>
                  </div>
                  <div className={`flex items-center gap-3 ${fixStep >= 3 ? 'text-green-400' : 'text-slate-600'}`}>
                    <Terminal className="w-4 h-4" /> <span>Committing to new branch &apos;greenops-fix&apos;...</span>
                  </div>
                </div>
              </div>
            )}
            {prCreated && (
              <div className="flex flex-col items-center text-center py-6">
                <div className="w-20 h-20 bg-green-500/20 rounded-full flex items-center justify-center mb-6">
                  <Check className="w-10 h-10 text-green-400" />
                </div>
                <h3 className="text-2xl font-bold text-white mb-2">Pull Request Created!</h3>
                <p className="text-slate-400 mb-6">The AI has successfully created PR #42 with all the suggested optimizations. Merging this will reduce your projected emissions by 14%.</p>
                <div className="flex gap-4 w-full">
                  <button onClick={() => setPrCreated(false)} className="flex-1 py-3 bg-slate-800 hover:bg-slate-700 text-white font-semibold rounded-lg transition-colors">Close</button>
                  <a href={prUrl} target="_blank" rel="noopener noreferrer" className="flex-1 py-3 bg-green-500 hover:bg-green-400 text-slate-900 font-bold rounded-lg transition-colors flex items-center justify-center gap-2">
                    <GitMerge className="w-5 h-5" /> View PR
                  </a>
                </div>
              </div>
            )}
          </motion.div>
        </div>
      )}
    </div>
  );
}
