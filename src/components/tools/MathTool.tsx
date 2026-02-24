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
            <div className="w-full space-y-3 sm:space-y-4">
              <div>
                <label className="block text-xs sm:text-sm font-medium text-slate-300 mb-2">
                  Math Problem (Detailed Solution)
                </label>
                <textarea
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Enter your math problem here..."
                  rows={4}
                  className="w-full px-3 py-2.5 sm:px-4 sm:py-3 bg-slate-800/50 border border-slate-700 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-sm sm:text-base resize-vertical"
                  style={{ minHeight: '100px' }}
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
                disabled={loading || !input.trim()}
                className="w-full py-2.5 sm:py-3 text-sm sm:text-base"
              >
                {loading ? (
                  <>
                    <Loader className="w-4 h-4 animate-spin mr-2" />
                    Solving...
                  </>
                ) : (
                  'Generate (1 ad for every 3 generations)'
                )}
              </Button>
            </div>
          </>
        );

      case 'concept':
        return (
          <>
            <div className="w-full space-y-3 sm:space-y-4">
              <div>
                <label className="block text-xs sm:text-sm font-medium text-slate-300 mb-2">
                  Math Concept (e.g., Quadratic Equations, Trigonometry)
                </label>
                <textarea
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Enter a math concept..."
                  rows={3}
                  className="w-full px-3 py-2.5 sm:px-4 sm:py-3 bg-slate-800/50 border border-slate-700 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-sm sm:text-base resize-vertical"
                  style={{ minHeight: '80px' }}
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
                disabled={loading || !input.trim()}
                className="w-full py-2.5 sm:py-3 text-sm sm:text-base"
              >
                {loading ? (
                  <>
                    <Loader className="w-4 h-4 animate-spin mr-2" />
                    Explaining...
                  </>
                ) : (
                  'Generate (1 ad for every 3 generations)'
                )}
              </Button>
            </div>
          </>
        );

      case 'practice':
        return (
          <>
            <div className="w-full space-y-3 sm:space-y-4">
              <div>
                <label className="block text-xs sm:text-sm font-medium text-slate-300 mb-2">
                  Topic (e.g., Algebra, Geometry, Calculus)
                </label>
                <textarea
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Enter a topic..."
                  rows={3}
                  className="w-full px-3 py-2.5 sm:px-4 sm:py-3 bg-slate-800/50 border border-slate-700 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-sm sm:text-base resize-vertical"
                  style={{ minHeight: '80px' }}
                />
              </div>
              <div className="w-full grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
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
                disabled={loading || !input.trim()}
                className="w-full py-2.5 sm:py-3 text-sm sm:text-base"
              >
                {loading ? (
                  <>
                    <Loader className="w-4 h-4 animate-spin mr-2" />
                    Generating...
                  </>
                ) : (
                  'Generate (1 ad for every 3 generations)'
                )}
              </Button>
            </div>
          </>
        );

      case 'quick':
        return (
          <>
            <div className="w-full space-y-3 sm:space-y-4">
              <div>
                <label className="block text-xs sm:text-sm font-medium text-slate-300 mb-2">
                  Quick Math Problem
                </label>
                <textarea
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Ask a quick math question..."
                  rows={3}
                  className="w-full px-3 py-2.5 sm:px-4 sm:py-3 bg-slate-800/50 border border-slate-700 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-sm sm:text-base resize-vertical"
                  style={{ minHeight: '80px' }}
                />
              </div>
              <Button
                onClick={handleQuickSolve}
                disabled={loading || !input.trim()}
                className="w-full py-2.5 sm:py-3 text-sm sm:text-base"
              >
                {loading ? (
                  <>
                    <Loader className="w-4 h-4 animate-spin mr-2" />
                    Calculating...
                  </>
                ) : (
                  'Generate (1 ad for every 3 generations)'
                )}
              </Button>
            </div>
          </>
        );
    }
  };

  return (
    <div className="w-full space-y-4 sm:space-y-6 px-0">
      {/* Mode Selector - Stack on mobile, grid on larger screens */}
      <div className="w-full grid grid-cols-2 sm:grid-cols-4 gap-2">
        {[
          { id: 'solve', label: 'Solve', shortLabel: 'S' },
          { id: 'concept', label: 'Concept', shortLabel: 'C' },
          { id: 'practice', label: 'Practice', shortLabel: 'P' },
          { id: 'quick', label: 'Quick', shortLabel: 'Q' },
        ].map((btn) => (
          <button
            key={btn.id}
            onClick={() => {
              setMode(btn.id as typeof mode);
              setInput('');
              setResult('');
            }}
            className={`px-2 sm:px-3 py-2 sm:py-2.5 rounded-lg text-xs sm:text-sm font-medium transition-all duration-200 whitespace-nowrap ${
              mode === btn.id
                ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-lg shadow-purple-500/30'
                : 'bg-slate-700/50 text-slate-300 hover:bg-slate-600/50'
            }`}
          >
            <span className="hidden sm:inline">{btn.label}</span>
            <span className="sm:hidden text-xs">{btn.shortLabel}</span>
          </button>
        ))}
      </div>

      {/* Input Section */}
      <div className="w-full bg-slate-800/30 border border-slate-700/50 rounded-lg sm:rounded-xl p-3 sm:p-4 md:p-6">
        {renderModeContent()}
      </div>

      {/* Result Section */}
      {result && (
        <div className="w-full bg-slate-800/30 border border-slate-700/50 rounded-lg sm:rounded-xl p-3 sm:p-4 md:p-6">
          <h3 className="text-base sm:text-lg md:text-xl font-bold text-white mb-3 sm:mb-4">Solution</h3>
          <div className="overflow-x-auto">
            <ResultBox content={result} />
          </div>
        </div>
      )}

      {loading && (
        <div className="flex justify-center items-center py-12">
          <div className="text-center">
            <Loader className="w-8 h-8 animate-spin text-purple-400 mx-auto mb-4" />
            <p className="text-sm sm:text-base text-slate-400">Processing...</p>
          </div>
        </div>
      )}

      {/* Info Box */}
      {!result && !loading && (
        <div className="w-full bg-blue-500/10 border border-blue-500/30 rounded-lg p-3 sm:p-4">
          <p className="text-xs sm:text-sm text-blue-200 leading-relaxed">
            Ask questions in English or Bangla. The AI responds in your preferred language with detailed, step-by-step solutions.
          </p>
        </div>
      )}
    </div>
  );
}

export function MathToolWrapper({ toolId }: MathToolProps) {
  return <MathTool toolId={toolId} />;
}
