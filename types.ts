export enum OptimizationMode {
  STRUCTURED = 'STRUCTURED', // Focus on format and clarity
  CREATIVE = 'CREATIVE',     // Focus on ideation and flair
  CRITICAL = 'CRITICAL'      // Focus on constraints and edge cases
}

export enum OutputFormat {
  MARKDOWN = 'Markdown',
  JSON = 'JSON',
  PLAIN_TEXT = 'Plain Text',
  STEP_BY_STEP = 'Step-by-Step Guide'
}

export enum CognitiveLoad {
  LOW = 'Concise (Low Load)',
  MEDIUM = 'Balanced (Medium Load)',
  HIGH = 'Comprehensive (High Load)'
}

export interface UserConfiguration {
  targetAudience: string;
  intent: string;
  outputFormat: OutputFormat;
  cognitiveLoad: CognitiveLoad;
  customConstraints: string;
}

export interface OptimizedPrompt {
  title: string;
  style: string;
  content: string;
  explanation: string; // The "why" behind the optimization
}

export interface DesignSOP {
  phase: string;
  details: string[];
  status: 'pending' | 'completed' | 'active';
}

export interface AnalysisReport {
  originalScore: number;
  robustnessAnalysis: string;
  improvementStrategy: string;
}

export interface HistoryItem {
  id: string;
  timestamp: number;
  rawPrompt: string;
  config: UserConfiguration;
  results: OptimizedPrompt[];
}

export interface FeedbackData {
  rating: 'up' | 'down' | null;
  comment: string;
}