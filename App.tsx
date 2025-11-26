import React, { useState, useEffect } from 'react';
import { UserConfiguration, OptimizedPrompt, DesignSOP, HistoryItem } from './types';
import { DEFAULT_CONFIG, INITIAL_SOP_STEPS } from './constants';
import { optimizePromptWithGemini, analyzePromptRobustness } from './services/geminiService';
import ConfigPanel from './components/ConfigPanel';
import ResultCard from './components/ResultCard';
import SopModal from './components/SopModal';
import HistoryDrawer from './components/HistoryDrawer';
import { Sparkles, ArrowRight, Activity, Beaker, Clock, AlertCircle } from 'lucide-react';

export default function App() {
  const [rawPrompt, setRawPrompt] = useState('');
  const [config, setConfig] = useState<UserConfiguration>(DEFAULT_CONFIG);
  const [results, setResults] = useState<OptimizedPrompt[]>([]);
  const [isSopOpen, setIsSopOpen] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  
  // History State
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);
  
  // State for SOP progression simulation
  const [sopSteps, setSopSteps] = useState<DesignSOP[]>(INITIAL_SOP_STEPS);
  const [analysisData, setAnalysisData] = useState<{ score: number; analysis: string } | null>(null);

  // Load history from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem('prompt_history');
    if (saved) {
      try {
        setHistory(JSON.parse(saved));
      } catch (e) {
        console.error("Failed to load history", e);
      }
    }
  }, []);

  // Save history to localStorage
  const saveToHistory = (newResults: OptimizedPrompt[]) => {
    const newItem: HistoryItem = {
      id: Date.now().toString(),
      timestamp: Date.now(),
      rawPrompt,
      config: { ...config },
      results: newResults
    };
    const updated = [newItem, ...history].slice(0, 50); // Keep last 50
    setHistory(updated);
    localStorage.setItem('prompt_history', JSON.stringify(updated));
  };

  const clearHistory = () => {
    setHistory([]);
    localStorage.removeItem('prompt_history');
  };

  const restoreHistoryItem = (item: HistoryItem) => {
    setRawPrompt(item.rawPrompt);
    setConfig(item.config);
    setResults(item.results);
    setErrorMsg(null);
  };

  // Handlers
  const handleStartProcess = async () => {
    if (!rawPrompt.trim()) return;
    setErrorMsg(null);
    
    setIsSopOpen(true);
    setIsAnalyzing(true);
    setAnalysisData(null);
    setSopSteps(INITIAL_SOP_STEPS);

    // 1. Simulate Analysis Phase (or real API call if desired)
    try {
      const data = await analyzePromptRobustness(rawPrompt);
      setAnalysisData(data);
      
      // Update steps to show analysis is done
      setSopSteps(prev => prev.map((s, i) => 
        i === 0 ? { ...s, status: 'completed' } : 
        i === 1 ? { ...s, status: 'active' } : s
      ));
    } catch (e) {
      console.error(e);
      setAnalysisData({ score: 0, analysis: "Error analyzing prompt." });
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleConfirmAndGenerate = async () => {
    setIsSopOpen(false); // Close modal
    setIsGenerating(true); // Start main loading state on dashboard
    setErrorMsg(null);

    try {
      // Execute the generation
      const optimized = await optimizePromptWithGemini(rawPrompt, config);
      setResults(optimized);
      saveToHistory(optimized);
    } catch (error: any) {
      console.error("Generation failed", error);
      setErrorMsg(error.message || "An unexpected error occurred.");
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 pb-20 relative">
      
      {/* Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-40 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-brand-500 p-2 rounded-lg">
              <Beaker className="w-5 h-5 text-white" />
            </div>
            <h1 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-brand-600 to-teal-500">
              PromptAlchemist
            </h1>
          </div>
          <div className="flex items-center gap-4 text-sm text-slate-500">
             <button 
               onClick={() => setIsHistoryOpen(true)}
               className="flex items-center gap-1.5 hover:bg-slate-100 px-3 py-1.5 rounded-lg transition-colors"
             >
                <Clock className="w-4 h-4 text-slate-500" />
                <span className="hidden sm:inline">History</span>
             </button>
             <span className="hidden md:inline-flex items-center gap-1 border-l border-slate-200 pl-4">
               <Activity className="w-4 h-4 text-emerald-500" />
               <span className="text-xs font-medium text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full">System Active</span>
             </span>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        
        {/* Error Message Display */}
        {errorMsg && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl flex items-center gap-3 animate-pulse">
            <AlertCircle className="w-5 h-5" />
            <span className="font-medium">{errorMsg}</span>
          </div>
        )}

        {/* Action Plan Section (Dynamic) */}
        {results.length > 0 && !isGenerating && (
          <div className="bg-gradient-to-r from-indigo-50 to-blue-50 border border-indigo-100 rounded-xl p-5 flex flex-col md:flex-row gap-6 text-sm text-indigo-900 shadow-sm">
            <div className="font-semibold whitespace-nowrap flex items-center gap-2">
              <span className="bg-indigo-600 text-white w-6 h-6 rounded-full flex items-center justify-center text-xs">!</span>
              Suggested Action Plan:
            </div>
            <div className="flex-1 grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-white/60 p-3 rounded-lg border border-indigo-100">
                 <strong className="block text-indigo-700 mb-1">1. Test & Validate</strong>
                 <span className="text-slate-600 text-xs">Run 'Structural Architect' prompt first for baseline performance.</span>
              </div>
              <div className="bg-white/60 p-3 rounded-lg border border-indigo-100">
                 <strong className="block text-indigo-700 mb-1">2. Edge Case Check</strong>
                 <span className="text-slate-600 text-xs">Compare 'Critical Analyst' output to find potential logic gaps.</span>
              </div>
               <div className="bg-white/60 p-3 rounded-lg border border-indigo-100">
                 <strong className="block text-indigo-700 mb-1">3. Refine Context</strong>
                 <span className="text-slate-600 text-xs">If results are too generic, add specific constraints in Config.</span>
              </div>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Left Column: Input & Config */}
          <div className="lg:col-span-5 space-y-6">
            
            {/* Input Area */}
            <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm transition-shadow hover:shadow-md">
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Raw Prompt Input
              </label>
              <textarea
                value={rawPrompt}
                onChange={(e) => setRawPrompt(e.target.value)}
                placeholder="Describe what you want the AI to do... (e.g., 'Write a blog post about coffee')"
                className="w-full h-40 p-4 rounded-lg border border-slate-300 focus:ring-2 focus:ring-brand-500 focus:border-brand-500 resize-none font-mono text-sm transition-all"
              />
              <div className="mt-4 flex justify-end">
                 <button
                  onClick={handleStartProcess}
                  disabled={!rawPrompt.trim() || isGenerating}
                  className="flex items-center gap-2 bg-slate-900 text-white px-5 py-2.5 rounded-lg hover:bg-slate-800 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-slate-900/20 active:scale-95"
                >
                  {isGenerating ? (
                    'Processing...' 
                  ) : (
                    <>
                      Start Analysis Protocol <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* Config Panel */}
            <ConfigPanel 
              config={config} 
              setConfig={setConfig} 
              disabled={isGenerating} 
            />
          </div>

          {/* Right Column: Results */}
          <div className="lg:col-span-7">
            {isGenerating ? (
              <div className="h-full min-h-[400px] flex flex-col items-center justify-center bg-white rounded-xl border border-dashed border-slate-300">
                <div className="relative">
                  <div className="w-16 h-16 border-4 border-slate-100 border-t-brand-500 rounded-full animate-spin"></div>
                  <Sparkles className="w-6 h-6 text-brand-500 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2" />
                </div>
                <p className="mt-4 text-slate-500 font-medium">Synthesizing variations...</p>
                <p className="text-sm text-slate-400">Applying MECE principles to persona generation</p>
              </div>
            ) : results.length > 0 ? (
              <div className="grid grid-cols-1 gap-6">
                <div className="flex items-center justify-between">
                  <h2 className="text-lg font-bold text-slate-800">Optimized Results</h2>
                  <span className="text-xs font-mono bg-brand-50 text-brand-700 px-2 py-1 rounded border border-brand-100">3 Variations Generated</span>
                </div>
                {results.map((res, idx) => (
                  <ResultCard key={idx} result={res} index={idx} />
                ))}
              </div>
            ) : (
              <div className="h-full min-h-[400px] flex flex-col items-center justify-center bg-slate-50 rounded-xl border border-dashed border-slate-300 text-slate-400">
                <Sparkles className="w-12 h-12 mb-3 opacity-20" />
                <p>Enter a prompt and configure settings to begin.</p>
              </div>
            )}
          </div>
        </div>
      </main>

      {/* SOP Modal - The Design & Confirmation Phase */}
      <SopModal 
        isOpen={isSopOpen}
        onConfirm={handleConfirmAndGenerate}
        onCancel={() => setIsSopOpen(false)}
        steps={sopSteps}
        isAnalyzing={isAnalyzing}
        analysisData={analysisData}
      />

      {/* History Drawer */}
      <HistoryDrawer 
        isOpen={isHistoryOpen}
        onClose={() => setIsHistoryOpen(false)}
        history={history}
        onSelect={restoreHistoryItem}
        onClear={clearHistory}
      />

    </div>
  );
}