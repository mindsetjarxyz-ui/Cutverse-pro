import { useState } from 'react';
import { TextArea } from '@/components/ui/TextArea';
import { Button } from '@/components/ui/Button';
import { ResultBox } from '@/components/ui/ResultBox';
import { Select } from '@/components/ui/Select';
import { 
  solveMathProblem,
  explainMathConcept,
  generateMathProblems,
  quickMathSolve
} from '@/services/mathService';
import { Loader } from 'lucide-react';

interface MathToolProps {
  toolId: string;
}

export function MathTool({ toolId }: MathToolProps) {
  const [mode, setMode] = useState<'solve' | 'concept' | 'practice' | 'quick'>('solve');
  const [input, setInput] = useState('');
  const [result, setResult] = useState('');
  const [loading, setLoading] = useState(false);
  const [language, setLanguage] = useState<'english' | 'bangla'>('english');
  const [level, setLevel] = useState('class-10');

  const levelOptions = [
    { value: 'class-9', label: 'Class 9' },
    { value: 'class-10', label: 'Class 10' },
    { value: 'class-11', label: 'Class 11' },
    { value: 'class-12', label: 'Class 12' },
    { value: 'university', label: 'University' },
  ];

  const languageOptions = [
    { value: 'english', label: '🇬🇧 English' },
    { value: 'bangla', label: '🇧🇩 Bangla' },
  ];

  const handleSolveProblem = async () => {
    if (!input.trim()) {
      alert('Please enter a math problem');
      return;
    }

    setLoading(true);
    setResult('');
    
    try {
      const response = await solveMathProblem(input.trim(), language);
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

  const handleExplainConcept = async () => {
    if (!input.trim()) {
      alert('Please enter a math concept');
      return;
    }

    setLoading(true);
    setResult('');
    
    try {
      const response = await explainMathConcept(input.trim(), language);
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

  const handleGeneratePractice = async () => {
    if (!input.trim()) {
      alert('Please enter a topic');
      return;
    }

    setLoading(true);
    setResult('');
    
    try {
      const response = await generateMathProblems(input.trim(), level, language);
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

  const handleQuickSolve = async () => {
    if (!input.trim()) {
      alert('Please enter a math problem');
      return;
    }

    setLoading(true);
    setResult('');
    
    try {
      const response = await quickMathSolve(input.trim());
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
      case 'solve':
        return (
          <>
            <div className="space-y-4">
              <div>
                <label className="block text-xs sm:text-sm font-medium text-slate-300 mb-2">
                  Math Problem (Detailed Solution)
                </label>
                <TextArea
                  value={input}
                  onChange={setInput}
                  placeholder="Enter your math problem here..."
                  rows={5}
                />
              </div>
              <div>
                <Select
                  options={languageOptions}
                  value={language}
                  onChange={(val) => setLanguage(val as 'english' | 'bangla')}
                  label="Language"
                />
              </div>
              <Button
                onClick={handleSolveProblem}
                disabled={loading}
                className="w-full"
              >
                {loading ? (
                  <>
                    <Loader className="w-4 h-4 animate-spin mr-2" />
                    Solving...
                  </>
                ) : (
                  '🧮 Solve with Steps'
                )}
              </Button>
            </div>
          </>
        );

      case 'concept':
        return (
          <>
            <div className="space-y-4">
              <div>
                <label className="block text-xs sm:text-sm font-medium text-slate-300 mb-2">
                  Math Concept (e.g., Quadratic Equations, Trigonometry)
                </label>
                <TextArea
                  value={input}
                  onChange={setInput}
                  placeholder="Enter a math concept..."
                  rows={3}
                />
              </div>
              <div>
                <Select
                  options={languageOptions}
                  value={language}
                  onChange={(val) => setLanguage(val as 'english' | 'bangla')}
                  label="Language"
                />
              </div>
              <Button
                onClick={handleExplainConcept}
                disabled={loading}
                className="w-full"
              >
                {loading ? (
                  <>
                    <Loader className="w-4 h-4 animate-spin mr-2" />
                    Explaining...
                  </>
                ) : (
                  '📚 Explain Concept'
                )}
              </Button>
            </div>
          </>
        );

      case 'practice':
        return (
          <>
            <div className="space-y-4">
              <div>
                <label className="block text-xs sm:text-sm font-medium text-slate-300 mb-2">
                  Topic (e.g., Algebra, Geometry, Calculus)
                </label>
                <TextArea
                  value={input}
                  onChange={setInput}
                  placeholder="Enter a topic..."
                  rows={3}
                />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Select
                  options={levelOptions}
                  value={level}
                  onChange={setLevel}
                  label="Class Level"
                />
                <Select
                  options={languageOptions}
                  value={language}
                  onChange={(val) => setLanguage(val as 'english' | 'bangla')}
                  label="Language"
                />
              </div>
              <Button
                onClick={handleGeneratePractice}
                disabled={loading}
                className="w-full"
              >
                {loading ? (
                  <>
                    <Loader className="w-4 h-4 animate-spin mr-2" />
                    Generating...
                  </>
                ) : (
                  '📝 Generate Problems'
                )}
              </Button>
            </div>
          </>
        );

      case 'quick':
        return (
          <>
            <div className="space-y-4">
              <div>
                <label className="block text-xs sm:text-sm font-medium text-slate-300 mb-2">
                  Quick Math Problem
                </label>
                <TextArea
                  value={input}
                  onChange={setInput}
                  placeholder="Ask a quick math question..."
                  rows={3}
                />
              </div>
              <Button
                onClick={handleQuickSolve}
                disabled={loading}
                className="w-full"
              >
                {loading ? (
                  <>
                    <Loader className="w-4 h-4 animate-spin mr-2" />
                    Calculating...
                  </>
                ) : (
                  '⚡ Quick Answer'
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
          { id: 'solve', label: '🧮 Solve', icon: '🧮' },
          { id: 'concept', label: '📚 Concept', icon: '📚' },
          { id: 'practice', label: '📝 Practice', icon: '📝' },
          { id: 'quick', label: '⚡ Quick', icon: '⚡' },
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
                ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-lg shadow-purple-500/30'
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
          <h3 className="text-lg sm:text-xl font-bold text-white mb-4">✨ Solution</h3>
          <ResultBox content={result} />
        </div>
      )}

      {loading && (
        <div className="flex justify-center items-center py-12">
          <div className="text-center">
            <Loader className="w-8 h-8 animate-spin text-purple-400 mx-auto mb-4" />
            <p className="text-slate-400">Processing your request...</p>
          </div>
        </div>
      )}

      {/* Info Box */}
      <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-4">
        <p className="text-xs sm:text-sm text-blue-200">
          💡 <strong>Tip:</strong> You can ask questions in both English and Bangla. The AI will respond in your preferred language and provide detailed, step-by-step solutions.
        </p>
      </div>
    </div>
  );
}

export function MathToolWrapper({ toolId }: MathToolProps) {
  return <MathTool toolId={toolId} />;
}
