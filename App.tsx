import React, { useState, useEffect } from 'react';
import { UserConfiguration, OptimizedPrompt, DesignSOP } from './types';
import { DEFAULT_CONFIG, INITIAL_SOP_STEPS } from './constants';
import { optimizePromptWithGemini, analyzePromptRobustness } from './services/geminiService';
import ConfigPanel from './components/ConfigPanel';
import ResultCard from './components/ResultCard';
import SopModal from './components/SopModal';
import { Sparkles, ArrowRight, Activity, Beaker } from 'lucide-react';

export default function App() {
  const [rawPrompt, setRawPrompt] = useState('');
  const [config, setConfig] = useState<UserConfiguration>(DEFAULT_CONFIG);
  const [results, setResults] = useState<OptimizedPrompt[]>([]);
  const [isSopOpen, setIsSopOpen] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  
  // State for SOP progression simulation
  const [sopSteps, setSopSteps] = useState<DesignSOP[]>(INITIAL_SOP_STEPS);
  const [analysisData, setAnalysisData] = useState<{ score: number; analysis: string } | null>(null);

  // Handlers
  const handleStartProcess = async () => {
    if (!rawPrompt.trim()) return;
    
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

    try {
      // Execute the generation
      const optimized = await optimizePromptWithGemini(rawPrompt, config);
      setResults(optimized);
    } catch (error) {
      console.error("Generation failed", error);
      alert("Failed to generate prompts. Please check your API key or connection.");
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 pb-20">
      
      {/* Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-40">
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
             <span className="hidden md:inline-flex items-center gap-1">
               <Activity className="w-4 h-4 text-emerald-500" />
               System Status: Operational
             </span>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        
        {/* Intro / Action Plan Section (Post-code requirement) */}
        {results.length > 0 && (
          <div className="bg-indigo-50 border border-indigo-100 rounded-xl p-4 flex flex-col md:flex-row gap-4 text-sm text-indigo-900">
            <div className="font-semibold whitespace-nowrap">Suggested Action Plan:</div>
            <ul className="flex flex-col md:flex-row gap-4 list-disc md:list-none ml-4 md:ml-0">
              <li className="flex gap-2">
                <span className="font-bold text-indigo-600">A.</span>
                <span>Test "The Structural Architect" variation for automation tasks.</span>
              </li>
              <li className="flex gap-2">
                <span className="font-bold text-indigo-600">B.</span>
                <span>Use "The Critical Analyst" to identify potential logic gaps.</span>
              </li>
              <li className="flex gap-2">
                <span className="font-bold text-indigo-600">C.</span>
                <span>Refine configuration constraints if outputs are too generic.</span>
              </li>
            </ul>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Left Column: Input & Config */}
          <div className="lg:col-span-5 space-y-6">
            
            {/* Input Area */}
            <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
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
                  className="flex items-center gap-2 bg-slate-900 text-white px-5 py-2.5 rounded-lg hover:bg-slate-800 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-slate-900/20"
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
                  <span className="text-xs font-mono bg-slate-200 px-2 py-1 rounded text-slate-600">3 Variations Generated</span>
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
        steps={sopSteps}
        isAnalyzing={isAnalyzing}
        analysisData={analysisData}
      />

    </div>
  );
}