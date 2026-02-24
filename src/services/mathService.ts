// Math Solver Service - MathMaster AI
// Using Bytez SDK with separate API key
// Supports English and Bangla

import Bytez from "bytez.js";

const MATH_API_KEY = "3209a84492b05d6d57bc71d6e56d455d";

// Initialize Bytez SDK for Math Tool
const mathSdk = new Bytez(MATH_API_KEY);

// Types
export interface MathRequest {
  question: string;
  language: 'english' | 'bangla' | 'auto'; // auto-detect
  showSteps: boolean;
}

export interface MathResponse {
  success: boolean;
  result: string;
  language: string;
  error?: string;
}

// Detect language
function detectLanguage(text: string): string {
  const banglaRegex = /[\u0980-\u09FF]/;
  return banglaRegex.test(text) ? 'Bangla' : 'English';
}

// Clean and format math responses
function formatMathText(text: string): string {
  if (!text) return '';
  
  let cleaned = text
    .replace(/\*/g, '×')
    .replace(/\^/g, '²')
    .trim();
  
  return cleaned;
}

// Build language instruction
function getLanguageInstruction(language: string): string {
  if (language === 'bangla' || language === 'auto') {
    return 'Please respond in Bangla language.';
  }
  return 'Please respond in English language.';
}

// Solve math problem
export async function solveMathProblem(question: string, language: 'english' | 'bangla' | 'auto' = 'auto'): Promise<MathResponse> {
  try {
    const model = mathSdk.model("openai/gpt-4.1");
    
    // Auto-detect language if requested
    let targetLanguage = language;
    if (language === 'auto') {
      targetLanguage = detectLanguage(question).toLowerCase() === 'bangla' ? 'bangla' : 'english';
    }
    
    const languageInstruction = getLanguageInstruction(targetLanguage);
    
    const prompt = `You are a professional mathematics tutor. Solve this math problem step by step.

Problem: "${question}"

${languageInstruction}

Please provide:
1. Understanding the problem
2. Step-by-step solution with clear explanations
3. Verification of the answer
4. Alternative methods if applicable
5. Tips for similar problems

Be clear, professional, and educational. Show all working and calculations.`;

    const { error, output } = await model.run([
      {
        role: "user",
        content: prompt
      }
    ]);

    if (error) {
      return {
        success: false,
        result: '',
        language: targetLanguage,
        error: `Error: ${error}`
      };
    }

    return {
      success: true,
      result: formatMathText(output as string),
      language: targetLanguage,
      error: undefined
    };
  } catch (err) {
    return {
      success: false,
      result: '',
      language: language,
      error: `Service error: ${err instanceof Error ? err.message : 'Unknown error'}`
    };
  }
}

// Explain math concept
export async function explainMathConcept(concept: string, language: 'english' | 'bangla' | 'auto' = 'auto'): Promise<MathResponse> {
  try {
    const model = mathSdk.model("openai/gpt-4.1");
    
    let targetLanguage = language;
    if (language === 'auto') {
      targetLanguage = detectLanguage(concept).toLowerCase() === 'bangla' ? 'bangla' : 'english';
    }
    
    const languageInstruction = getLanguageInstruction(targetLanguage);
    
    const prompt = `You are a professional mathematics teacher. Explain this mathematical concept in detail.

Concept: "${concept}"

${languageInstruction}

Please provide:
1. Definition and core idea
2. Historical context or origin
3. 4-5 practical examples
4. Real-world applications
5. Common misconceptions and how to avoid them
6. Practice problems

Be thorough, clear, and educational.`;

    const { error, output } = await model.run([
      {
        role: "user",
        content: prompt
      }
    ]);

    if (error) {
      return {
        success: false,
        result: '',
        language: targetLanguage,
        error: `Error: ${error}`
      };
    }

    return {
      success: true,
      result: formatMathText(output as string),
      language: targetLanguage,
      error: undefined
    };
  } catch (err) {
    return {
      success: false,
      result: '',
      language: language,
      error: `Service error: ${err instanceof Error ? err.message : 'Unknown error'}`
    };
  }
}

// Generate practice problems
export async function generateMathProblems(topic: string, level: string, language: 'english' | 'bangla' | 'auto' = 'auto'): Promise<MathResponse> {
  try {
    const model = mathSdk.model("openai/gpt-4.1");
    
    let targetLanguage = language;
    if (language === 'auto') {
      targetLanguage = detectLanguage(topic).toLowerCase() === 'bangla' ? 'bangla' : 'english';
    }
    
    const languageInstruction = getLanguageInstruction(targetLanguage);
    
    const prompt = `You are a professional mathematics teacher. Create practice problems for ${level} level students on the topic: "${topic}"

${languageInstruction}

Please provide:
1. 8-10 practice problems of increasing difficulty
2. Different types: calculation, problem-solving, proof-based
3. Complete solution with step-by-step explanations
4. Difficulty rating for each problem
5. Tips for approaching each type of problem

Make them challenging but educational.`;

    const { error, output } = await model.run([
      {
        role: "user",
        content: prompt
      }
    ]);

    if (error) {
      return {
        success: false,
        result: '',
        language: targetLanguage,
        error: `Error: ${error}`
      };
    }

    return {
      success: true,
      result: formatMathText(output as string),
      language: targetLanguage,
      error: undefined
    };
  } catch (err) {
    return {
      success: false,
      result: '',
      language: language,
      error: `Service error: ${err instanceof Error ? err.message : 'Unknown error'}`
    };
  }
}

// Quick calculation
export async function quickMathSolve(question: string): Promise<MathResponse> {
  try {
    const model = mathSdk.model("openai/gpt-4.1");
    
    const targetLanguage = detectLanguage(question);
    
    const prompt = `Solve this math problem quickly and provide the answer with brief working:

Problem: "${question}"

Just give the answer with 2-3 lines of working. Keep it concise.`;

    const { error, output } = await model.run([
      {
        role: "user",
        content: prompt
      }
    ]);

    if (error) {
      return {
        success: false,
        result: '',
        language: targetLanguage,
        error: `Error: ${error}`
      };
    }

    return {
      success: true,
      result: formatMathText(output as string),
      language: targetLanguage,
      error: undefined
    };
  } catch (err) {
    return {
      success: false,
      result: '',
      language: 'unknown',
      error: `Service error: ${err instanceof Error ? err.message : 'Unknown error'}`
    };
  }
}
