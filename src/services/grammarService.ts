// Grammar Tool Service - Using Bytez SDK with GPT-4o
import Bytez from "bytez.js";
import { checkAndUpdateAdCounter, openAdInNewTab } from "./adService";

const GRAMMAR_API_KEY = "834eee539e51ef483544d18320a06111";

// Initialize Bytez SDK for Grammar Tool
const grammarSdk = new Bytez(GRAMMAR_API_KEY);

// Types
export interface GrammarRequest {
  type: 'rule' | 'correction' | 'explanation' | 'exercise';
  content: string;
  rule?: string;
}

export interface GrammarResponse {
  success: boolean;
  result: string;
  error?: string;
}

// Clean and format grammar responses
function formatGrammarText(text: string): string {
  if (!text) return '';
  
  let cleaned = text
    .replace(/\*/g, '•')
    .replace(/#{1,6}\s/g, '')
    .trim();
  
  return cleaned;
}

// Get grammar rules
export async function getGrammarRule(ruleName: string): Promise<GrammarResponse> {
  try {
    // Check ad counter and open ad if needed
    const { shouldShowAd } = checkAndUpdateAdCounter();
    if (shouldShowAd) {
      openAdInNewTab();
    }

    const model = grammarSdk.model("openai/gpt-4o");
    
    const prompt = `As a professional English grammar teacher, explain the grammar rule: "${ruleName}"
    
    Please provide:
    1. Definition of the rule
    2. 3-5 detailed examples showing correct usage
    3. Common mistakes to avoid
    4. Tips for remembering the rule
    
    Format the response clearly with sections and examples.`;

    const response = await model.run([
      {
        role: "user",
        content: prompt
      }
    ]);

    if (response.error) {
      return {
        success: false,
        result: '',
        error: `API Error: ${response.error}`
      };
    }

    return {
      success: true,
      result: formatGrammarText(response.output as string),
      error: undefined
    };
  } catch (err) {
    return {
      success: false,
      result: '',
      error: `Service error: ${err instanceof Error ? err.message : 'Unknown error'}`
    };
  }
}

// Correct text for grammar
export async function correctGrammar(text: string): Promise<GrammarResponse> {
  try {
    const { shouldShowAd } = checkAndUpdateAdCounter();
    if (shouldShowAd) {
      openAdInNewTab();
    }

    const model = grammarSdk.model("openai/gpt-4o");
    
    const prompt = `As a professional English grammar editor, analyze and correct the following text:

Text: "${text}"

Please provide:
1. The corrected version of the text
2. A list of mistakes found with explanations
3. Grammar rules applied
4. Overall assessment

Be professional and helpful in your response.`;

    const response = await model.run([
      {
        role: "user",
        content: prompt
      }
    ]);

    if (response.error) {
      return {
        success: false,
        result: '',
        error: `API Error: ${response.error}`
      };
    }

    return {
      success: true,
      result: formatGrammarText(response.output as string),
      error: undefined
    };
  } catch (err) {
    return {
      success: false,
      result: '',
      error: `Service error: ${err instanceof Error ? err.message : 'Unknown error'}`
    };
  }
}

// Get detailed explanation
export async function explainGrammar(text: string): Promise<GrammarResponse> {
  try {
    const { shouldShowAd } = checkAndUpdateAdCounter();
    if (shouldShowAd) {
      openAdInNewTab();
    }

    const model = grammarSdk.model("openai/gpt-4o");
    
    const prompt = `As a professional English grammar teacher, provide a detailed explanation of the grammar in this sentence:

Sentence: "${text}"

Please explain:
1. The sentence structure (subject, verb, object, etc.)
2. Tenses and their usage
3. Any special grammar rules applied
4. Why the sentence is correct or incorrect
5. Similar example sentences

Be clear and educational.`;

    const response = await model.run([
      {
        role: "user",
        content: prompt
      }
    ]);

    if (response.error) {
      return {
        success: false,
        result: '',
        error: `API Error: ${response.error}`
      };
    }

    return {
      success: true,
      result: formatGrammarText(response.output as string),
      error: undefined
    };
  } catch (err) {
    return {
      success: false,
      result: '',
      error: `Service error: ${err instanceof Error ? err.message : 'Unknown error'}`
    };
  }
}

// Generate grammar exercise
export async function generateGrammarExercise(topic: string, level: string): Promise<GrammarResponse> {
  try {
    const { shouldShowAd } = checkAndUpdateAdCounter();
    if (shouldShowAd) {
      openAdInNewTab();
    }

    const model = grammarSdk.model("openai/gpt-4o");
    
    const prompt = `As a professional English grammar teacher, create a grammar exercise for ${level} level students on the topic: "${topic}"

Please provide:
1. 5-10 practice questions
2. Different types: fill-in-the-blank, sentence correction, multiple choice
3. Answer key with explanations
4. Tips for solving each type

Make it educational and helpful.`;

    const response = await model.run([
      {
        role: "user",
        content: prompt
      }
    ]);

    if (response.error) {
      return {
        success: false,
        result: '',
        error: `API Error: ${response.error}`
      };
    }

    return {
      success: true,
      result: formatGrammarText(response.output as string),
      error: undefined
    };
  } catch (err) {
    return {
      success: false,
      result: '',
      error: `Service error: ${err instanceof Error ? err.message : 'Unknown error'}`
    };
  }
}
