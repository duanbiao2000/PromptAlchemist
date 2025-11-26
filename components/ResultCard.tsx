import React, { useState } from 'react';
import { OptimizedPrompt } from '../types';
import { Copy, Check, Sparkles, Terminal, BookOpen, ThumbsUp, ThumbsDown, MessageSquare } from 'lucide-react';

interface ResultCardProps {
  result: OptimizedPrompt;
  index: number;
}

const ResultCard: React.FC<ResultCardProps> = ({ result, index }) => {
  const [copied, setCopied] = useState(false);
  const [rating, setRating] = useState<'up' | 'down' | null>(null);
  const [comment, setComment] = useState('');
  const [showFeedbackInput, setShowFeedbackInput] = useState(false);
  const [feedbackSubmitted, setFeedbackSubmitted] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(result.content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const submitFeedback = () => {
    // In a real app, this would send data to an analytics backend
    console.log(`Feedback for "${result.title}": Rating=${rating}, Comment=${comment}`);
    setFeedbackSubmitted(true);
    setShowFeedbackInput(false);
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
    <div className={`bg-white rounded-xl border ${getBorderColor()} shadow-sm hover:shadow-md transition-all duration-300 flex flex-col h-full group`}>
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

      {/* Feedback Section */}
      <div className="p-3 border-t border-slate-100 bg-white rounded-b-xl flex flex-col gap-2">
        {!feedbackSubmitted ? (
            <div className="flex items-center justify-between">
                <span className="text-xs text-slate-400 pl-2">Was this result helpful?</span>
                <div className="flex gap-2">
                    <button 
                        onClick={() => { setRating('up'); setShowFeedbackInput(true); }}
                        className={`p-1.5 rounded hover:bg-slate-100 transition-colors ${rating === 'up' ? 'text-green-600 bg-green-50' : 'text-slate-400'}`}
                    >
                        <ThumbsUp className="w-4 h-4" />
                    </button>
                    <button 
                        onClick={() => { setRating('down'); setShowFeedbackInput(true); }}
                        className={`p-1.5 rounded hover:bg-slate-100 transition-colors ${rating === 'down' ? 'text-red-500 bg-red-50' : 'text-slate-400'}`}
                    >
                        <ThumbsDown className="w-4 h-4" />
                    </button>
                </div>
            </div>
        ) : (
            <div className="text-center py-2 text-xs text-green-600 flex items-center justify-center gap-1">
                <Check className="w-3 h-3" /> Feedback submitted
            </div>
        )}

        {showFeedbackInput && !feedbackSubmitted && (
            <div className="animate-in fade-in slide-in-from-top-1 duration-200 px-2 pb-2">
                <div className="relative">
                    <input 
                        type="text" 
                        value={comment}
                        onChange={(e) => setComment(e.target.value)}
                        placeholder="Optional comment..."
                        className="w-full text-xs p-2 pr-8 border border-slate-200 rounded-md focus:ring-1 focus:ring-brand-500 outline-none"
                    />
                    <button 
                        onClick={submitFeedback}
                        className="absolute right-1 top-1.5 p-0.5 text-brand-600 hover:bg-brand-50 rounded"
                    >
                        <Check className="w-4 h-4" />
                    </button>
                </div>
            </div>
        )}
      </div>
    </div>
  );
};

export default ResultCard;