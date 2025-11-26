import React, { useState, useRef, useEffect } from 'react';
import { UserConfiguration, OutputFormat, CognitiveLoad } from '../types';
import { Sliders, Target, Brain, FileText, HelpCircle, ChevronDown, ChevronUp } from 'lucide-react';

interface ConfigPanelProps {
  config: UserConfiguration;
  setConfig: React.Dispatch<React.SetStateAction<UserConfiguration>>;
  disabled: boolean;
}

const PRESET_AUDIENCES = [
  "General Audience (Neutral)",
  "Executive Management / C-Suite",
  "Senior Software Engineers",
  "Academic Researchers",
  "Product Managers",
  "Marketing Professionals",
  "Legal Experts",
  "Medical Professionals",
  "High School Students",
  "Children (5-10 years)",
  "Creative Writers",
  "Data Scientists"
];

const Tooltip: React.FC<{ text: string }> = ({ text }) => (
  <div className="group relative inline-block ml-1 align-middle">
    <HelpCircle className="w-4 h-4 text-slate-300 cursor-help hover:text-brand-500 transition-colors" />
    <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-2 bg-slate-800 text-white text-xs rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none w-48 text-center z-10 shadow-lg">
      {text}
      <div className="absolute top-full left-1/2 transform -translate-x-1/2 -mt-1 border-4 border-transparent border-t-slate-800"></div>
    </div>
  </div>
);

const ConfigPanel: React.FC<ConfigPanelProps> = ({ config, setConfig, disabled }) => {
  const [showAudienceDropdown, setShowAudienceDropdown] = useState(false);
  const audienceRef = useRef<HTMLDivElement>(null);

  const handleChange = (key: keyof UserConfiguration, value: string) => {
    setConfig(prev => ({ ...prev, [key]: value }));
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (audienceRef.current && !audienceRef.current.contains(event.target as Node)) {
        setShowAudienceDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm space-y-6">
      <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
        <Sliders className="w-5 h-5 text-brand-600" />
        <h2 className="text-lg font-semibold text-slate-800">Optimization Matrix (MECE)</h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Audience */}
        <div className="space-y-2 relative" ref={audienceRef}>
          <label className="flex items-center gap-2 text-sm font-medium text-slate-700">
            <Target className="w-4 h-4 text-slate-400" />
            Target Audience
            <Tooltip text="Defines WHO the AI is writing for. You can select a preset or type your own custom audience." />
          </label>
          <div className="relative">
            <input 
              type="text" 
              value={config.targetAudience}
              onChange={(e) => {
                handleChange('targetAudience', e.target.value);
                setShowAudienceDropdown(true);
              }}
              onFocus={() => setShowAudienceDropdown(true)}
              disabled={disabled}
              className="w-full px-3 py-2 pr-10 border border-slate-300 rounded-lg focus:ring-2 focus:ring-brand-500 focus:border-brand-500 transition-all text-sm"
              placeholder="Select a preset or type custom..."
            />
            <button
              type="button"
              onClick={() => setShowAudienceDropdown(!showAudienceDropdown)}
              disabled={disabled}
              className="absolute right-2 top-1/2 transform -translate-y-1/2 p-1 text-slate-400 hover:text-slate-600 rounded-full hover:bg-slate-100 transition-colors"
            >
              {showAudienceDropdown ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
            </button>
          </div>
          
          {showAudienceDropdown && (
            <div className="absolute z-20 w-full mt-1 bg-white border border-slate-200 rounded-lg shadow-xl max-h-60 overflow-y-auto animate-in fade-in slide-in-from-top-2 duration-200">
              <div className="p-1">
                {PRESET_AUDIENCES.map((preset) => (
                  <button
                    key={preset}
                    type="button"
                    onClick={() => {
                      handleChange('targetAudience', preset);
                      setShowAudienceDropdown(false);
                    }}
                    className="w-full text-left px-3 py-2 text-sm text-slate-700 hover:bg-brand-50 hover:text-brand-700 rounded-md transition-colors flex items-center justify-between group"
                  >
                    <span>{preset}</span>
                    {config.targetAudience === preset && (
                        <div className="w-1.5 h-1.5 rounded-full bg-brand-500" />
                    )}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Intent */}
        <div className="space-y-2">
          <label className="flex items-center gap-2 text-sm font-medium text-slate-700">
            <Brain className="w-4 h-4 text-slate-400" />
            Core Intent
            <Tooltip text="The primary goal (WHY). MECE principles ensure we don't mix conflicting intents (e.g., purely Informational vs. purely Persuasive)." />
          </label>
          <select
            value={config.intent}
            onChange={(e) => handleChange('intent', e.target.value)}
            disabled={disabled}
            className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-brand-500 text-sm bg-white"
          >
            <option>Informational</option>
            <option>Persuasive</option>
            <option>Instructional</option>
            <option>Creative/Entertainment</option>
            <option>Analytical</option>
          </select>
        </div>

        {/* Cognitive Load */}
        <div className="space-y-2">
          <label className="flex items-center gap-2 text-sm font-medium text-slate-700">
            <Brain className="w-4 h-4 text-slate-400" />
            Cognitive Load
            <Tooltip text="Controls information density. Low load is simple/concise; High load is detailed/complex. Helps cover the 'Exhaustive' part of MECE." />
          </label>
          <select
            value={config.cognitiveLoad}
            onChange={(e) => handleChange('cognitiveLoad', e.target.value as CognitiveLoad)}
            disabled={disabled}
            className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-brand-500 text-sm bg-white"
          >
            {Object.values(CognitiveLoad).map(val => (
              <option key={val} value={val}>{val}</option>
            ))}
          </select>
        </div>

        {/* Output Format */}
        <div className="space-y-2">
          <label className="flex items-center gap-2 text-sm font-medium text-slate-700">
            <FileText className="w-4 h-4 text-slate-400" />
            Desired Format
            <Tooltip text="The structural container for the output. Ensuring a specific format reduces ambiguity." />
          </label>
          <select
            value={config.outputFormat}
            onChange={(e) => handleChange('outputFormat', e.target.value as OutputFormat)}
            disabled={disabled}
            className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-brand-500 text-sm bg-white"
          >
            {Object.values(OutputFormat).map(val => (
              <option key={val} value={val}>{val}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Constraints */}
      <div className="space-y-2 pt-2">
        <label className="text-sm font-medium text-slate-700 flex items-center">
            Additional Constraints / Context
            <Tooltip text="Specific boundary conditions (negative constraints) to ensure high robustness and avoid hallucinations." />
        </label>
        <textarea
          value={config.customConstraints}
          onChange={(e) => handleChange('customConstraints', e.target.value)}
          disabled={disabled}
          rows={2}
          className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-brand-500 text-sm resize-none"
          placeholder="e.g., No jargon, max 200 words, use analogy..."
        />
      </div>
    </div>
  );
};

export default ConfigPanel;