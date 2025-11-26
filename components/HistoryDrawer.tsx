import React from 'react';
import { HistoryItem } from '../types';
import { Clock, Trash2, ChevronRight, RotateCcw } from 'lucide-react';

interface HistoryDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  history: HistoryItem[];
  onSelect: (item: HistoryItem) => void;
  onClear: () => void;
}

const HistoryDrawer: React.FC<HistoryDrawerProps> = ({ isOpen, onClose, history, onSelect, onClear }) => {
  return (
    <>
      {/* Backdrop */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-slate-900/20 backdrop-blur-sm z-40"
          onClick={onClose}
        />
      )}

      {/* Drawer */}
      <div className={`fixed top-0 right-0 h-full w-80 bg-white shadow-2xl z-50 transform transition-transform duration-300 ease-in-out border-l border-slate-200 flex flex-col ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}>
        
        <div className="p-4 border-b border-slate-100 flex items-center justify-between bg-slate-50">
          <div className="flex items-center gap-2 text-slate-800 font-semibold">
            <Clock className="w-5 h-5 text-brand-600" />
            <h3>History</h3>
          </div>
          <button 
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {history.length === 0 ? (
            <div className="text-center text-slate-400 mt-10">
              <p className="text-sm">No history yet.</p>
            </div>
          ) : (
            history.map((item) => (
              <div 
                key={item.id}
                onClick={() => {
                  onSelect(item);
                  onClose();
                }}
                className="bg-white border border-slate-200 rounded-lg p-3 hover:border-brand-300 hover:shadow-md cursor-pointer transition-all group"
              >
                <div className="flex justify-between items-start mb-1">
                    <span className="text-[10px] text-slate-400 font-mono">
                        {new Date(item.timestamp).toLocaleTimeString()}
                    </span>
                    <RotateCcw className="w-3 h-3 text-slate-300 group-hover:text-brand-500" />
                </div>
                <p className="text-sm text-slate-700 font-medium line-clamp-2 mb-2">
                  {item.rawPrompt}
                </p>
                <div className="flex flex-wrap gap-1">
                    <span className="text-[10px] px-1.5 py-0.5 bg-slate-100 rounded text-slate-500">
                        {item.results.length} results
                    </span>
                    <span className="text-[10px] px-1.5 py-0.5 bg-slate-100 rounded text-slate-500">
                        {item.config.targetAudience || 'General'}
                    </span>
                </div>
              </div>
            ))
          )}
        </div>

        {history.length > 0 && (
          <div className="p-4 border-t border-slate-100 bg-slate-50">
            <button 
              onClick={onClear}
              className="w-full flex items-center justify-center gap-2 text-red-500 text-sm hover:bg-red-50 p-2 rounded-lg transition-colors"
            >
              <Trash2 className="w-4 h-4" />
              Clear History
            </button>
          </div>
        )}
      </div>
    </>
  );
};

export default HistoryDrawer;