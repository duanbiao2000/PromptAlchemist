import React, { useState } from 'react';
import { OptimizedPrompt } from '../types';
import { Copy, Check, Sparkles, Terminal, BookOpen } from 'lucide-react';

interface ResultCardProps {
  result: OptimizedPrompt;
  index: number;
}

const ResultCard: React.FC<ResultCardProps> = ({ result, index }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(result.content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const getIcon = () => {
    const s = result.style.toLowerCase();
    if (s.includes('struct') || s.includes('arch')) return <Terminal className="w-5 h-5 text-blue-500" />;
    if (s.includes('creat') || s.includes('muse')) return <Sparkles className="w-5 h-5 text-purple-500" />;
    return <BookOpen className="w-5 h-5 text-emerald-500" />;
  };

  const getBorderColor = () => {
    const s = result.style.toLowerCase();
    if (s.includes('struct')) return 'border-blue-200 hover:border-blue-300';
    if (s.includes('creat')) return 'border-purple-200 hover:border-purple-300';
    return 'border-emerald-200 hover:border-emerald-300';
  };

  return (
    <div className={`bg-white rounded-xl border ${getBorderColor()} shadow-sm hover:shadow-md transition-all duration-300 flex flex-col h-full`}>
      <div className="p-5 border-b border-slate-100">
        <div className="flex justify-between items-start mb-2">
          <div className="flex items-center gap-2">
            <div className="p-2 bg-slate-50 rounded-lg">
              {getIcon()}
            </div>
            <div>
              <h3 className="font-semibold text-slate-800">{result.title}</h3>
              <p className="text-xs text-slate-500 font-mono uppercase tracking-wider">{result.style}</p>
            </div>
          </div>
          <button 
            onClick={handleCopy}
            className="p-2 hover:bg-slate-100 rounded-lg transition-colors text-slate-400 hover:text-slate-600"
            title="Copy Prompt"
          >
            {copied ? <Check className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4" />}
          </button>
        </div>
        <p className="text-xs text-slate-500 bg-slate-50 p-2 rounded border border-slate-100 italic">
          "{result.explanation}"
        </p>
      </div>
      
      <div className="p-5 flex-grow bg-slate-50/50">
        <pre className="whitespace-pre-wrap font-mono text-sm text-slate-700 leading-relaxed">
          {result.content}
        </pre>
      </div>
    </div>
  );
};

export default ResultCard;