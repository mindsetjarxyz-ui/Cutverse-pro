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
    <div className="w-full space-y-4 sm:space-y-6 px-0">
      {/* Input Section */}
      <div className="w-full bg-slate-800/30 border border-slate-700/50 rounded-lg sm:rounded-xl p-3 sm:p-4 md:p-6">
        <div className="w-full space-y-3 sm:space-y-4">
          <div className="w-full">
            <label className="block text-xs sm:text-sm font-medium text-slate-300 mb-2">
              Ask about Grammar Rule
            </label>
            <p className="text-xs text-slate-400 mb-3 leading-relaxed">
              Examples: Present Perfect Tense, Subject-Verb Agreement, Articles, Prepositions
            </p>
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onInput={(e) => setInput((e.target as HTMLTextAreaElement).value)}
              placeholder="Enter your grammar question here..."
              rows={4}
              className="w-full px-3 py-2.5 sm:px-4 sm:py-3 bg-slate-800/50 border border-slate-700 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-sm sm:text-base resize-vertical"
              style={{ minHeight: '100px' }}
            />
          </div>
          <div className="w-full flex flex-col sm:flex-row gap-2 sm:gap-3">
            <Button
              onClick={handleAskGrammar}
              disabled={loading || !input.trim()}
              className="w-full sm:flex-1 py-2.5 sm:py-3 text-sm sm:text-base"
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
              className="w-full sm:flex-1 py-2.5 sm:py-3 text-sm sm:text-base bg-slate-700/50 hover:bg-slate-600/50 text-slate-300"
            >
              Clear
            </Button>
          </div>
        </div>
      </div>

      {/* Result Section */}
      {result && (
        <div className="w-full bg-slate-800/30 border border-slate-700/50 rounded-lg sm:rounded-xl p-3 sm:p-4 md:p-6">
          <h3 className="text-base sm:text-lg md:text-xl font-bold text-white mb-3 sm:mb-4">Answer</h3>
          <div className="overflow-x-auto">
            <ResultBox content={result} />
          </div>
        </div>
      )}

      {loading && (
        <div className="flex justify-center items-center py-12">
          <div className="text-center">
            <Loader className="w-8 h-8 animate-spin text-blue-400 mx-auto mb-4" />
            <p className="text-sm sm:text-base text-slate-400">Finding the answer...</p>
          </div>
        </div>
      )}

      {!result && !loading && (
        <div className="w-full bg-blue-500/10 border border-blue-500/30 rounded-lg p-3 sm:p-4">
          <p className="text-xs sm:text-sm text-blue-200 leading-relaxed">
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
