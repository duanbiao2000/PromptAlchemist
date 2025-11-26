import React from 'react';
import { UserConfiguration, OutputFormat, CognitiveLoad } from '../types';
import { Sliders, Target, Brain, FileText } from 'lucide-react';

interface ConfigPanelProps {
  config: UserConfiguration;
  setConfig: React.Dispatch<React.SetStateAction<UserConfiguration>>;
  disabled: boolean;
}

const ConfigPanel: React.FC<ConfigPanelProps> = ({ config, setConfig, disabled }) => {
  
  const handleChange = (key: keyof UserConfiguration, value: string) => {
    setConfig(prev => ({ ...prev, [key]: value }));
  };

  return (
    <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm space-y-6">
      <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
        <Sliders className="w-5 h-5 text-brand-600" />
        <h2 className="text-lg font-semibold text-slate-800">Optimization Matrix (MECE)</h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Audience */}
        <div className="space-y-2">
          <label className="flex items-center gap-2 text-sm font-medium text-slate-700">
            <Target className="w-4 h-4 text-slate-400" />
            Target Audience
          </label>
          <input 
            type="text" 
            value={config.targetAudience}
            onChange={(e) => handleChange('targetAudience', e.target.value)}
            disabled={disabled}
            className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-brand-500 focus:border-brand-500 transition-all text-sm"
            placeholder="e.g., Python Experts, 5-year-olds"
          />
        </div>

        {/* Intent */}
        <div className="space-y-2">
          <label className="flex items-center gap-2 text-sm font-medium text-slate-700">
            <Brain className="w-4 h-4 text-slate-400" />
            Core Intent
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
        <label className="text-sm font-medium text-slate-700">Additional Constraints / Context</label>
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