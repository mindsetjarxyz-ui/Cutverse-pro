import { useState } from 'react';
import { TextArea } from '@/components/ui/TextArea';
import { Button } from '@/components/ui/Button';
import { ResultBox } from '@/components/ui/ResultBox';
import { Select } from '@/components/ui/Select';
import { 
  getGrammarRule, 
  correctGrammar, 
  explainGrammar, 
  generateGrammarExercise 
} from '@/services/grammarService';
import { Loader } from 'lucide-react';

interface GrammarToolProps {
  toolId: string;
}

export function GrammarTool({ toolId }: GrammarToolProps) {
  const [mode, setMode] = useState<'rule' | 'correction' | 'explanation' | 'exercise'>('rule');
  const [input, setInput] = useState('');
  const [result, setResult] = useState('');
  const [loading, setLoading] = useState(false);
  const [level, setLevel] = useState('class-10');

  const levelOptions = [
    { value: 'class-9', label: 'Class 9' },
    { value: 'class-10', label: 'Class 10' },
    { value: 'class-11', label: 'Class 11' },
    { value: 'class-12', label: 'Class 12' },
    { value: 'university', label: 'University' },
  ];

  const handleGenerateRule = async () => {
    if (!input.trim()) {
      alert('Please enter a grammar rule name');
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

  const handleCorrectGrammar = async () => {
    if (!input.trim()) {
      alert('Please enter text to correct');
      return;
    }

    setLoading(true);
    setResult('');
    
    try {
      const response = await correctGrammar(input.trim());
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

  const handleExplainGrammar = async () => {
    if (!input.trim()) {
      alert('Please enter a sentence to explain');
      return;
    }

    setLoading(true);
    setResult('');
    
    try {
      const response = await explainGrammar(input.trim());
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

  const handleGenerateExercise = async () => {
    if (!input.trim()) {
      alert('Please enter a grammar topic');
      return;
    }

    setLoading(true);
    setResult('');
    
    try {
      const response = await generateGrammarExercise(input.trim(), level);
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

  const renderModeContent = () => {
    switch (mode) {
      case 'rule':
        return (
          <>
            <div className="space-y-4">
              <div>
                <label className="block text-xs sm:text-sm font-medium text-slate-300 mb-2">
                  Grammar Rule (e.g., Present Perfect Tense, Subject-Verb Agreement)
                </label>
                <TextArea
                  value={input}
                  onChange={setInput}
                  placeholder="Enter a grammar rule name..."
                  rows={3}
                />
              </div>
              <Button
                onClick={handleGenerateRule}
                disabled={loading}
                className="w-full"
              >
                {loading ? (
                  <>
                    <Loader className="w-4 h-4 animate-spin mr-2" />
                    Generating...
                  </>
                ) : (
                  '✨ Learn Rule'
                )}
              </Button>
            </div>
          </>
        );

      case 'correction':
        return (
          <>
            <div className="space-y-4">
              <div>
                <label className="block text-xs sm:text-sm font-medium text-slate-300 mb-2">
                  Text to Correct
                </label>
                <TextArea
                  value={input}
                  onChange={setInput}
                  placeholder="Enter your text here..."
                  rows={5}
                />
              </div>
              <Button
                onClick={handleCorrectGrammar}
                disabled={loading}
                className="w-full"
              >
                {loading ? (
                  <>
                    <Loader className="w-4 h-4 animate-spin mr-2" />
                    Correcting...
                  </>
                ) : (
                  '✏️ Correct Now'
                )}
              </Button>
            </div>
          </>
        );

      case 'explanation':
        return (
          <>
            <div className="space-y-4">
              <div>
                <label className="block text-xs sm:text-sm font-medium text-slate-300 mb-2">
                  Sentence to Explain
                </label>
                <TextArea
                  value={input}
                  onChange={setInput}
                  placeholder="Enter a sentence..."
                  rows={3}
                />
              </div>
              <Button
                onClick={handleExplainGrammar}
                disabled={loading}
                className="w-full"
              >
                {loading ? (
                  <>
                    <Loader className="w-4 h-4 animate-spin mr-2" />
                    Explaining...
                  </>
                ) : (
                  '🔍 Explain'
                )}
              </Button>
            </div>
          </>
        );

      case 'exercise':
        return (
          <>
            <div className="space-y-4">
              <div>
                <label className="block text-xs sm:text-sm font-medium text-slate-300 mb-2">
                  Grammar Topic (e.g., Tenses, Articles, Prepositions)
                </label>
                <TextArea
                  value={input}
                  onChange={setInput}
                  placeholder="Enter a grammar topic..."
                  rows={3}
                />
              </div>
              <div>
                <Select
                  options={levelOptions}
                  value={level}
                  onChange={setLevel}
                  label="Class Level"
                />
              </div>
              <Button
                onClick={handleGenerateExercise}
                disabled={loading}
                className="w-full"
              >
                {loading ? (
                  <>
                    <Loader className="w-4 h-4 animate-spin mr-2" />
                    Generating...
                  </>
                ) : (
                  '📝 Generate Exercise'
                )}
              </Button>
            </div>
          </>
        );
    }
  };

  return (
    <div className="space-y-6">
      {/* Mode Selector */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
        {[
          { id: 'rule', label: '📚 Learn Rule', icon: '📚' },
          { id: 'correction', label: '✏️ Correct', icon: '✏️' },
          { id: 'explanation', label: '🔍 Explain', icon: '🔍' },
          { id: 'exercise', label: '📝 Exercise', icon: '📝' },
        ].map(btn => (
          <button
            key={btn.id}
            onClick={() => {
              setMode(btn.id as typeof mode);
              setInput('');
              setResult('');
            }}
            className={`px-3 py-2 rounded-lg text-xs sm:text-sm font-medium transition-all duration-200 ${
              mode === btn.id
                ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg shadow-blue-500/30'
                : 'bg-slate-700/50 text-slate-300 hover:bg-slate-600/50'
            }`}
          >
            <span className="hidden sm:inline">{btn.label}</span>
            <span className="sm:hidden">{btn.icon}</span>
          </button>
        ))}
      </div>

      {/* Input Section */}
      <div className="bg-slate-800/30 border border-slate-700/50 rounded-xl p-4 sm:p-6">
        {renderModeContent()}
      </div>

      {/* Result Section */}
      {result && (
        <div className="bg-slate-800/30 border border-slate-700/50 rounded-xl p-4 sm:p-6">
          <h3 className="text-lg sm:text-xl font-bold text-white mb-4">✨ Result</h3>
          <ResultBox content={result} />
        </div>
      )}

      {loading && (
        <div className="flex justify-center items-center py-12">
          <div className="text-center">
            <Loader className="w-8 h-8 animate-spin text-blue-400 mx-auto mb-4" />
            <p className="text-slate-400">Processing your request...</p>
          </div>
        </div>
      )}
    </div>
  );
}

export function GrammarToolWrapper({ toolId }: GrammarToolProps) {
  return <GrammarTool toolId={toolId} />;
}
