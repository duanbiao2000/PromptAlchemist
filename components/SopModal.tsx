import React from 'react';
import { DesignSOP } from '../types';
import { CheckCircle2, Circle, Loader2, ShieldCheck, Activity } from 'lucide-react';

interface SopModalProps {
  isOpen: boolean;
  steps: DesignSOP[];
  onConfirm: () => void;
  isAnalyzing: boolean;
  analysisData: { score: number; analysis: string } | null;
}

const SopModal: React.FC<SopModalProps> = ({ isOpen, steps, onConfirm, isAnalyzing, analysisData }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white w-full max-w-2xl rounded-2xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[90vh]">
        
        {/* Header */}
        <div className="bg-slate-50 p-6 border-b border-slate-100">
          <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2">
            <ShieldCheck className="text-brand-600" />
            Robustness & Performance SOP
          </h2>
          <p className="text-slate-500 text-sm mt-1">
            Pre-flight analysis to ensure prompt integrity before generation.
          </p>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto space-y-8">
          
          {/* Analysis Section */}
          <div className="bg-slate-50 rounded-xl p-5 border border-slate-100">
            <h3 className="text-sm font-semibold text-slate-700 uppercase tracking-wide mb-3 flex items-center gap-2">
              <Activity className="w-4 h-4" />
              Initial Robustness Audit
            </h3>
            
            {isAnalyzing ? (
              <div className="flex items-center gap-3 text-slate-500 py-4">
                <Loader2 className="w-5 h-5 animate-spin text-brand-500" />
                <span>Running semantic analysis on input...</span>
              </div>
            ) : analysisData ? (
              <div className="space-y-4">
                 <div className="flex items-center justify-between">
                    <span className="text-sm text-slate-600">Robustness Score</span>
                    <span className={`text-lg font-bold ${analysisData.score > 70 ? 'text-green-600' : analysisData.score > 40 ? 'text-amber-500' : 'text-red-500'}`}>
                      {analysisData.score}/100
                    </span>
                 </div>
                 <div className="w-full bg-slate-200 rounded-full h-2">
                    <div 
                      className={`h-2 rounded-full transition-all duration-1000 ${analysisData.score > 70 ? 'bg-green-500' : analysisData.score > 40 ? 'bg-amber-400' : 'bg-red-500'}`} 
                      style={{ width: `${analysisData.score}%` }}
                    />
                 </div>
                 <p className="text-sm text-slate-600 bg-white p-3 rounded-lg border border-slate-200">
                   <strong>Analysis:</strong> {analysisData.analysis}
                 </p>
              </div>
            ) : null}
          </div>

          {/* SOP Steps */}
          <div>
            <h3 className="text-sm font-semibold text-slate-700 uppercase tracking-wide mb-4">
              Execution Protocol
            </h3>
            <div className="space-y-4">
              {steps.map((step, idx) => (
                <div key={idx} className="flex gap-4">
                  <div className="mt-1">
                    {step.status === 'completed' ? (
                      <CheckCircle2 className="w-5 h-5 text-green-500" />
                    ) : step.status === 'active' ? (
                      <Loader2 className="w-5 h-5 text-brand-500 animate-spin" />
                    ) : (
                      <Circle className="w-5 h-5 text-slate-300" />
                    )}
                  </div>
                  <div>
                    <h4 className={`text-sm font-medium ${step.status === 'pending' ? 'text-slate-400' : 'text-slate-800'}`}>
                      {step.phase}
                    </h4>
                    <ul className="mt-1 space-y-1">
                      {step.details.map((d, i) => (
                        <li key={i} className="text-xs text-slate-500 list-disc ml-4">{d}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>

        {/* Footer */}
        <div className="p-6 border-t border-slate-100 bg-slate-50 flex justify-end">
          <button 
            onClick={onConfirm}
            disabled={isAnalyzing}
            className={`px-6 py-2.5 rounded-lg font-medium transition-all ${
              isAnalyzing 
                ? 'bg-slate-200 text-slate-400 cursor-not-allowed' 
                : 'bg-brand-600 text-white hover:bg-brand-700 shadow-lg shadow-brand-500/30'
            }`}
          >
            {isAnalyzing ? 'Analyzing...' : 'Confirm Protocol & Generate'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default SopModal;