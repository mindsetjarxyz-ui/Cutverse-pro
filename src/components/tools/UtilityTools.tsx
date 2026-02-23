import { useState } from 'react';
import { Button } from '@/components/ui/Button';
import { TextArea } from '@/components/ui/TextArea';
import { ResultBox } from '@/components/ui/ResultBox';
import { generateMusic } from '@/services/ai';
import { Loader } from 'lucide-react';

interface UtilityToolWrapperProps {
  toolId: string;
}

export function UtilityToolWrapper({ toolId }: UtilityToolWrapperProps) {
  switch (toolId) {
    case 'text-to-music':
      return <TextToMusicTool />;
    default:
      return <div className="text-slate-400">Tool not found</div>;
  }
}

function TextToMusicTool() {
  const [prompt, setPrompt] = useState('');
  const [output, setOutput] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [audioUrl, setAudioUrl] = useState('');

  const handleGenerateMusic = async () => {
    if (!prompt.trim()) {
      setError('Please enter a music description');
      return;
    }

    setLoading(true);
    setError('');
    setOutput('');
    setAudioUrl('');

    try {
      const result = await generateMusic(prompt.trim());

      if (result.error) {
        setError(result.error);
        setOutput('');
        setAudioUrl('');
      } else {
        setOutput('Music generated successfully! You can play it below.');
        setAudioUrl(result.output);
      }
    } catch (err: any) {
      setError(err.message || 'Failed to generate music. Please try again.');
      setOutput('');
      setAudioUrl('');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto space-y-6">
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-semibold text-slate-200 mb-3">
            Music Description
          </label>
          <TextArea
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="Describe the music you want to generate... (e.g., 'Moody jazz music with saxophones', 'Upbeat electronic dance music', 'Calm meditation music')"
            rows={4}
            disabled={loading}
          />
          <p className="text-xs text-slate-400 mt-2">
            Be descriptive! Include tempo, mood, instruments, and style for better results.
          </p>
        </div>

        <Button
          onClick={handleGenerateMusic}
          disabled={loading || !prompt.trim()}
          className="w-full sm:w-auto"
        >
          {loading ? (
            <>
              <Loader className="w-4 h-4 mr-2 animate-spin" />
              Generating Music...
            </>
          ) : (
            'Generate Music'
          )}
        </Button>
      </div>

      {error && (
        <div className="bg-red-500/10 border border-red-500/50 rounded-lg p-4 text-red-400 text-sm">
          {error}
        </div>
      )}

      {output && (
        <div className="space-y-4">
          <ResultBox output={output} />
          
          {audioUrl && (
            <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-6">
              <h3 className="text-slate-200 font-semibold mb-4">Your Generated Music</h3>
              <audio
                controls
                className="w-full"
                src={audioUrl}
              >
                Your browser does not support the audio element.
              </audio>
              <p className="text-xs text-slate-400 mt-4">
                You can download this audio file using your browser's download button.
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
