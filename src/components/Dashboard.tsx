"use client";

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer, AreaChart, Area, BarChart, Bar } from 'recharts';
import { Zap, DollarSign, CloudRain, AlertTriangle, TrendingDown, XCircle, Bot } from 'lucide-react';

export default function Dashboard() {
  const [metrics, setMetrics] = useState<any>(null);
  const [forecast, setForecast] = useState<any>(null);
  const [recommendations, setRecommendations] = useState<any[]>([]);
  const [showRecModal, setShowRecModal] = useState(false);

  useEffect(() => {
    // Mock data fallbacks for Vercel deployment
    const mockMetrics = {
      total_carbon_emissions: 12450.5,
      total_cloud_spend: 45200.0,
      carbon_intensity_score: 82,
      project_sustainability_score: "B+",
      monthly_trend: [
        { month: "Jan", emissions: 1200, spend: 4000 },
        { month: "Feb", emissions: 1100, spend: 3800 },
        { month: "Mar", emissions: 1300, spend: 4200 },
        { month: "Apr", emissions: 1050, spend: 3900 },
        { month: "May", emissions: 900, spend: 3500 },
      ]
    };
    
    const mockForecast = [
      { date: "2026-06-06", predicted_emission: 890, confidence_lower: 850, confidence_upper: 930 },
      { date: "2026-06-07", predicted_emission: 880, confidence_lower: 840, confidence_upper: 920 },
      { date: "2026-06-08", predicted_emission: 860, confidence_lower: 820, confidence_upper: 900 },
      { date: "2026-06-09", predicted_emission: 875, confidence_lower: 835, confidence_upper: 915 },
      { date: "2026-06-10", predicted_emission: 850, confidence_lower: 810, confidence_upper: 890 },
      { date: "2026-06-11", predicted_emission: 840, confidence_lower: 800, confidence_upper: 880 },
      { date: "2026-06-12", predicted_emission: 820, confidence_lower: 780, confidence_upper: 860 }
    ];

    const mockRecommendations = [
      { title: "Switch to ARM Processors", impact_score: "High", description: "Migrate 14 instances to AWS Graviton to reduce energy consumption.", potential_savings: 450, carbon_reduction: 15 },
      { title: "Optimize Idle Databases", impact_score: "Medium", description: "Scale down staging RDS instances outside of business hours.", potential_savings: 210, carbon_reduction: 8 }
    ];

    Promise.all([
      fetch('http://localhost:8000/api/dashboard/metrics').then(res => res.ok ? res.json() : mockMetrics).catch(() => mockMetrics),
      fetch('http://localhost:8000/api/dashboard/forecast').then(res => res.ok ? res.json() : { forecast: mockForecast }).catch(() => ({ forecast: mockForecast })),
      fetch('http://localhost:8000/api/recommendations').then(res => res.ok ? res.json() : mockRecommendations).catch(() => mockRecommendations)
    ]).then(([m, f, r]) => {
      setMetrics(m);
      setForecast(f.forecast || mockForecast);
      setRecommendations(r.length ? r : mockRecommendations);
    });
  }, []);

  if (!metrics) return <div className="text-center py-20 animate-pulse text-green-400">Loading Intelligence...</div>;

  const kpis = [
    { title: "Total Carbon Emissions", value: `${metrics.total_carbon_emissions} kg`, icon: CloudRain, color: "text-red-400" },
    { title: "Cloud Spend", value: `$${metrics.total_cloud_spend.toLocaleString()}`, icon: DollarSign, color: "text-green-400" },
    { title: "Carbon Intensity Score", value: `${metrics.carbon_intensity_score}/100`, icon: Zap, color: "text-yellow-400" },
    { title: "Sustainability Grade", value: metrics.project_sustainability_score, icon: TrendingDown, color: "text-emerald-400" }
  ];

  return (
    <div className="space-y-6">
      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {kpis.map((kpi, i) => (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            key={i} 
            className="glass-card p-6 rounded-xl flex flex-col justify-between"
          >
            <div className="flex justify-between items-start mb-4">
              <span className="text-slate-500 dark:text-slate-400 font-medium text-sm">{kpi.title}</span>
              <kpi.icon className={`w-5 h-5 ${kpi.color}`} />
            </div>
            <div className="text-3xl font-bold">{kpi.value}</div>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Chart */}
        <motion.div 
           initial={{ opacity: 0, scale: 0.95 }}
           animate={{ opacity: 1, scale: 1 }}
           className="lg:col-span-2 glass-card p-6 rounded-xl"
        >
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-lg font-semibold text-slate-900 dark:text-white">Emissions & Spend Trend</h3>
            <div className="flex gap-2">
              <span className="flex items-center text-xs text-red-400"><div className="w-2 h-2 rounded-full bg-red-400 mr-1"/> Emissions</span>
              <span className="flex items-center text-xs text-green-400"><div className="w-2 h-2 rounded-full bg-green-400 mr-1"/> Spend</span>
            </div>
          </div>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={metrics.monthly_trend}>
                <defs>
                  <linearGradient id="colorEmissions" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#f87171" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#f87171" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="colorSpend" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#4ade80" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#4ade80" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
                <XAxis dataKey="month" stroke="#64748b" tick={{fill: '#64748b'}} />
                <YAxis yAxisId="left" stroke="#64748b" tick={{fill: '#64748b'}} />
                <YAxis yAxisId="right" orientation="right" stroke="#64748b" tick={{fill: '#64748b'}} />
                <RechartsTooltip contentStyle={{backgroundColor: '#0f172a', borderColor: '#1e293b', color: '#f8fafc'}} />
                <Area yAxisId="left" type="monotone" dataKey="emissions" stroke="#f87171" fillOpacity={1} fill="url(#colorEmissions)" />
                <Area yAxisId="right" type="monotone" dataKey="spend" stroke="#4ade80" fillOpacity={1} fill="url(#colorSpend)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        {/* AI Recommendations */}
        <motion.div 
           initial={{ opacity: 0, x: 20 }}
           animate={{ opacity: 1, x: 0 }}
           className="glass-card p-6 rounded-xl flex flex-col"
        >
          <div className="flex items-center gap-2 mb-6">
            <AlertTriangle className="text-yellow-500 dark:text-yellow-400 w-5 h-5" />
            <h3 className="text-lg font-semibold text-slate-900 dark:text-white">Autonomous Insights</h3>
          </div>
          <div className="flex-1 overflow-y-auto space-y-4 pr-2 custom-scrollbar">
            {recommendations.slice(0, 2).map((rec: any, idx: number) => (
              <div key={idx} className="bg-white/50 dark:bg-slate-800/50 p-4 rounded-lg border border-slate-200 dark:border-slate-700/50 hover:border-green-500/30 transition-colors">
                <div className="flex justify-between items-start mb-2">
                  <h4 className="font-medium text-sm text-slate-800 dark:text-slate-200">{rec.title}</h4>
                  <span className={`text-[10px] px-2 py-0.5 rounded-full ${rec.impact_score === 'High' ? 'bg-red-100 text-red-600 dark:bg-red-500/20 dark:text-red-400' : 'bg-yellow-100 text-yellow-600 dark:bg-yellow-500/20 dark:text-yellow-400'}`}>
                    {rec.impact_score} Impact
                  </span>
                </div>
                <p className="text-xs text-slate-500 dark:text-slate-400 mb-3 line-clamp-2">{rec.description}</p>
                <div className="flex justify-between text-xs">
                  <span className="text-green-400 font-medium">Save ${rec.potential_savings}/mo</span>
                  <span className="text-emerald-400 font-medium">-{rec.carbon_reduction}% CO₂</span>
                </div>
              </div>
            ))}
          </div>
          <button 
            onClick={() => setShowRecModal(true)}
            className="mt-4 w-full py-2 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-sm font-medium rounded-md text-slate-700 dark:text-slate-300 transition-colors"
          >
            View All Recommendations
          </button>
        </motion.div>

        {/* AI Forecast */}
        <motion.div 
           initial={{ opacity: 0, y: 20 }}
           animate={{ opacity: 1, y: 0 }}
           className="lg:col-span-3 glass-card p-6 rounded-xl"
        >
          <h3 className="text-lg font-semibold mb-6 text-slate-900 dark:text-white">AI Emission Forecast (Next 7 Days)</h3>
          <div className="h-[250px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={forecast}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
                <XAxis dataKey="date" stroke="#64748b" tick={{fill: '#64748b', fontSize: 12}} />
                <YAxis stroke="#64748b" tick={{fill: '#64748b'}} domain={['auto', 'auto']} />
                <RechartsTooltip contentStyle={{backgroundColor: '#0f172a', borderColor: '#1e293b', color: '#f8fafc'}} />
                <Line type="monotone" dataKey="predicted_emission" stroke="#3b82f6" strokeWidth={3} dot={{r: 4, fill: '#3b82f6'}} activeDot={{r: 6}} />
                <Line type="monotone" dataKey="confidence_upper" stroke="#3b82f6" strokeDasharray="3 3" strokeWidth={1} dot={false} opacity={0.5} />
                <Line type="monotone" dataKey="confidence_lower" stroke="#3b82f6" strokeDasharray="3 3" strokeWidth={1} dot={false} opacity={0.5} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </motion.div>
      </div>

      {/* Recommendations Modal */}
      {showRecModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
          <motion.div 
            initial={{opacity: 0, scale: 0.95}} 
            animate={{opacity: 1, scale: 1}} 
            className="bg-white dark:bg-slate-900 w-full max-w-2xl rounded-2xl p-6 border border-slate-200 dark:border-slate-700 shadow-2xl"
          >
             <div className="flex justify-between items-center mb-6">
                <div className="flex items-center gap-2">
                   <AlertTriangle className="text-yellow-500 w-6 h-6" />
                   <h2 className="text-xl font-bold text-slate-900 dark:text-white">All Infrastructure Recommendations</h2>
                </div>
                <button onClick={() => setShowRecModal(false)} className="text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 transition-colors">
                  <XCircle className="w-6 h-6" />
                </button>
             </div>
             <div className="space-y-4 max-h-[60vh] overflow-y-auto pr-2 custom-scrollbar">
                {recommendations.map((rec: any, idx: number) => (
                  <div key={idx} className="bg-slate-50 dark:bg-slate-800/50 p-4 rounded-lg border border-slate-200 dark:border-slate-700/50">
                    <div className="flex justify-between items-start mb-2">
                      <h4 className="font-medium text-sm text-slate-800 dark:text-slate-200">{rec.title}</h4>
                      <span className={`text-[10px] px-2 py-0.5 rounded-full ${rec.impact_score === 'High' ? 'bg-red-100 text-red-600 dark:bg-red-500/20 dark:text-red-400' : 'bg-yellow-100 text-yellow-600 dark:bg-yellow-500/20 dark:text-yellow-400'}`}>
                        {rec.impact_score} Impact
                      </span>
                    </div>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mb-3">{rec.description}</p>
                    <div className="flex justify-between text-xs">
                      <span className="text-green-600 dark:text-green-400 font-medium">Save ${rec.potential_savings}/mo</span>
                      <span className="text-emerald-600 dark:text-emerald-400 font-medium">-{rec.carbon_reduction}% CO₂</span>
                    </div>
                  </div>
                ))}
                
                <div className="p-6 border-2 border-dashed border-slate-300 dark:border-slate-700 rounded-lg flex flex-col items-center justify-center text-slate-500 dark:text-slate-400 mt-4 bg-slate-50 dark:bg-slate-800/20">
                   <Bot className="w-8 h-8 mb-3 text-green-500 animate-bounce" />
                   <p className="text-sm font-medium">GreenOps AI Agent is scanning 143 additional cluster nodes...</p>
                   <p className="text-xs mt-1 opacity-70">Check back soon for more automated fixes.</p>
                </div>
             </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}
