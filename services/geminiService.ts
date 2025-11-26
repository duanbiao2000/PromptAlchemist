import { GoogleGenAI, Type, Schema } from "@google/genai";
import { UserConfiguration, OptimizedPrompt } from '../types';

const apiKey = process.env.API_KEY || '';
const ai = new GoogleGenAI({ apiKey });

const responseSchema: Schema = {
  type: Type.ARRAY,
  items: {
    type: Type.OBJECT,
    properties: {
      title: { type: Type.STRING, description: "A creative title for this prompt variation" },
      style: { type: Type.STRING, description: "The specific style/perspective used (e.g., Socratic, Technical, Creative)" },
      content: { type: Type.STRING, description: "The fully optimized prompt text" },
      explanation: { type: Type.STRING, description: "Brief analysis of why this optimization works" }
    },
    required: ["title", "style", "content", "explanation"]
  }
};

export const optimizePromptWithGemini = async (
  rawPrompt: string, 
  config: UserConfiguration
): Promise<OptimizedPrompt[]> => {
  
  const systemInstruction = `
    You are a World-Class Prompt Engineer and System Architect. 
    Your goal is to take a raw input and transform it into 3 distinct, high-quality prompt variations based on the user's configuration.
    
    Adhere to MECE (Mutually Exclusive, Collectively Exhaustive) principles when creating the variations:
    1. Variation 1: The "Structural Architect". Focus on structure, clarity, step-by-step logic, and format.
    2. Variation 2: The "Creative Catalyst". Focus on unconventional angles, rich language, and ideation.
    3. Variation 3: The "Critical Analyst". Focus on constraints, edge cases, anti-hallucination instructions, and precision.

    User Configuration:
    - Target Audience: ${config.targetAudience}
    - Intent: ${config.intent}
    - Format: ${config.outputFormat}
    - Cognitive Load: ${config.cognitiveLoad}
    - Extra Constraints: ${config.customConstraints}
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: `Optimize this prompt: "${rawPrompt}"`,
      config: {
        systemInstruction: systemInstruction,
        responseMimeType: "application/json",
        responseSchema: responseSchema,
        temperature: 0.7,
      },
    });

    const text = response.text;
    if (!text) throw new Error("EMPTY_RESPONSE");
    
    return JSON.parse(text) as OptimizedPrompt[];
  } catch (error: any) {
    console.error("Gemini API Error:", error);
    
    let errorMessage = "An unexpected error occurred during prompt optimization.";
    
    if (error.message?.includes("API_KEY")) {
      errorMessage = "Invalid or missing API Key. Please check your configuration.";
    } else if (error.message?.includes("quota") || error.status === 429) {
      errorMessage = "API Quota exceeded. Please try again later.";
    } else if (error.message?.includes("safety") || error.status === 400) {
      errorMessage = "The prompt triggered safety filters. Please refine your input.";
    } else if (error.message === "EMPTY_RESPONSE") {
      errorMessage = "The AI returned an empty response. Please try again.";
    }

    throw new Error(errorMessage);
  }
};

// Simulated analysis function (for the SOP phase)
export const analyzePromptRobustness = async (rawPrompt: string): Promise<{ score: number, analysis: string }> => {
  try {
     const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: `Analyze the robustness of this prompt: "${rawPrompt}". 
      Return a JSON object with keys: "score" (integer 0-100) and "analysis" (string, max 30 words).`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
            type: Type.OBJECT,
            properties: {
                score: {type: Type.INTEGER},
                analysis: {type: Type.STRING}
            }
        }
      }
    });
    
    const text = response.text;
    return text ? JSON.parse(text) : { score: 50, analysis: "Could not analyze." };
  } catch (e) {
    console.warn("Analysis failed, falling back to default", e);
    return { score: 50, analysis: "Basic prompt detected. Lacks explicit constraints." };
  }
};