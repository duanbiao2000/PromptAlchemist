import { OutputFormat, CognitiveLoad, DesignSOP } from './types';

export const DEFAULT_CONFIG = {
  targetAudience: 'General Audience',
  intent: 'Informational',
  outputFormat: OutputFormat.MARKDOWN,
  cognitiveLoad: CognitiveLoad.MEDIUM,
  customConstraints: ''
};

export const INITIAL_SOP_STEPS: DesignSOP[] = [
  {
    phase: '1. Input Analysis',
    details: [
      'Semantic tokenization of raw prompt',
      'Identification of ambiguity and missing context',
      'Classification of user intent vs. literal request'
    ],
    status: 'active'
  },
  {
    phase: '2. Strategy Selection (MECE)',
    details: [
      'Mapping to Mutually Exclusive attributes (Role, Format, Tone)',
      'Ensuring Collectively Exhaustive coverage of edge cases',
      'Selecting optimal temperature/Top-K parameters'
    ],
    status: 'pending'
  },
  {
    phase: '3. Multi-Perspective Generation',
    details: [
      'Generating "The Architect" (Structural focus)',
      'Generating "The Muse" (Creative focus)',
      'Generating "The Critic" (Constraint focus)'
    ],
    status: 'pending'
  },
  {
    phase: '4. Robustness Verification',
    details: [
      'Self-correction for hallucination risks',
      'Formatting validation',
      'Final cohesion check'
    ],
    status: 'pending'
  }
];

export const MOCK_ANALYSIS = {
  originalScore: 45,
  robustnessAnalysis: "The original prompt lacks specific constraints and context, leading to high potential for varying outputs (low robustness).",
  improvementStrategy: "Injecting persona definitions and strict output formatting schemas to reduce ambiguity."
};