import { useState } from 'react';
import { TextArea } from '@/components/ui/TextArea';
import { Button } from '@/components/ui/Button';
import { ResultBox } from '@/components/ui/ResultBox';
import { getGrammarRule } from '@/services/grammarService';
import { Loader } from 'lucide-react';

interface GrammarToolProps {
  toolId: string;
}

export function GrammarTool({ toolId }: GrammarToolProps) {
  const [input, setInput] = useState('');
  const [result, setResult] = useState('');
  const [loading, setLoading] = useState(false);

  const handleAskGrammar = async () => {
    if (!input.trim()) {
      alert('Please ask about a grammar rule');
      return;
    }

    setLoading(true);
    setResult('');
    
    try {
      const response = await getGrammarRule(input.trim());
      if (response.success) {
        setResult(response.result);
      } else {
        setResult(`Error: ${response.error}`);
      }
    } catch (err) {
      setResult(`Error: ${err instanceof Error ? err.message : 'Unknown error'}`);
    } finally {
      setLoading(false);
    }
  };

  const handleClear = () => {
    setInput('');
    setResult('');
  };

  return (
    <div className="space-y-6">
      {/* Input Section */}
      <div className="bg-slate-800/30 border border-slate-700/50 rounded-xl p-4 sm:p-6">
        <div className="space-y-4">
          <div>
            <label className="block text-xs sm:text-sm font-medium text-slate-300 mb-2">
              Ask about Grammar Rule
            </label>
            <p className="text-xs text-slate-400 mb-3">
              Examples: Present Perfect Tense, Subject-Verb Agreement, Articles, Prepositions, Conditional Sentences
            </p>
            <TextArea
              value={input}
              onChange={setInput}
              placeholder="Enter your grammar question here..."
              rows={4}
            />
          </div>
          <div className="flex gap-2">
            <Button
              onClick={handleAskGrammar}
              disabled={loading}
              className="flex-1"
            >
              {loading ? (
                <>
                  <Loader className="w-4 h-4 animate-spin mr-2" />
                  Getting Answer...
                </>
              ) : (
                'Get Answer'
              )}
            </Button>
            <Button
              onClick={handleClear}
              disabled={loading}
              className="bg-slate-700/50 hover:bg-slate-600/50 text-slate-300"
            >
              Clear
            </Button>
          </div>
        </div>
      </div>

      {/* Result Section */}
      {result && (
        <div className="bg-slate-800/30 border border-slate-700/50 rounded-xl p-4 sm:p-6">
          <h3 className="text-lg sm:text-xl font-bold text-white mb-4">Answer</h3>
          <ResultBox content={result} />
        </div>
      )}

      {loading && (
        <div className="flex justify-center items-center py-12">
          <div className="text-center">
            <Loader className="w-8 h-8 animate-spin text-blue-400 mx-auto mb-4" />
            <p className="text-slate-400">Finding the answer...</p>
          </div>
        </div>
      )}

      {!result && !loading && (
        <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-4">
          <p className="text-xs sm:text-sm text-blue-200">
            Ask any grammar question and get a professional explanation with examples. Try asking about tenses, articles, prepositions, or any grammar rule you want to understand.
          </p>
        </div>
      )}
    </div>
  );
}

export function GrammarToolWrapper({ toolId }: GrammarToolProps) {
  return <GrammarTool toolId={toolId} />;
}
