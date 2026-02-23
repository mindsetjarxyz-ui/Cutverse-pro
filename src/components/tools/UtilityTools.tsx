import { useState, useRef } from 'react';
import { Button } from '@/components/ui/Button';
import { TextArea } from '@/components/ui/TextArea';
import { generateMusic, convertWavToMp3 } from '@/services/ai';
import { Loader, Upload, Download } from 'lucide-react';

interface UtilityToolWrapperProps {
  toolId: string;
}

export function UtilityToolWrapper({ toolId }: UtilityToolWrapperProps) {
  switch (toolId) {
    case 'text-to-music':
      return <TextToMusicTool />;
    case 'wav-to-mp3':
      return <WavToMp3Tool />;
    default:
      return <div className="text-slate-400">Tool not found</div>;
  }
}

function TextToMusicTool() {
  const [prompt, setPrompt] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [audioUrl, setAudioUrl] = useState('');
  const [showPlayer, setShowPlayer] = useState(false);

  const handleGenerateMusic = async () => {
    if (!prompt.trim()) {
      setError('Please enter a music description');
      return;
    }

    setLoading(true);
    setError('');
    setAudioUrl('');
    setShowPlayer(false);

    try {
      const result = await generateMusic(prompt.trim());

      if (result.error) {
        setError(result.error);
        setAudioUrl('');
        setShowPlayer(false);
      } else {
        setAudioUrl(result.output);
        setShowPlayer(true);
      }
    } catch (err: any) {
      setError(err.message || 'Failed to generate music. Please try again.');
      setAudioUrl('');
      setShowPlayer(false);
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

      {showPlayer && audioUrl && (
        <div className="bg-gradient-to-br from-slate-800/80 to-slate-700/80 border border-slate-700 rounded-xl p-6 shadow-lg">
          <h3 className="text-slate-200 font-semibold mb-4 text-lg">✨ Your Generated Music</h3>
          <audio
            controls
            className="w-full mb-4 rounded-lg"
            src={audioUrl}
          >
            Your browser does not support the audio element.
          </audio>
          <p className="text-xs text-slate-400">
            💾 You can download this audio file using your browser's download button on the player.
          </p>
        </div>
      )}
    </div>
  );
}

function WavToMp3Tool() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [mp3Url, setMp3Url] = useState('');
  const [fileName, setFileName] = useState('');
  const [conversionStatus, setConversionStatus] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    
    if (!file) {
      setSelectedFile(null);
      setError('');
      return;
    }

    // Validate file type
    if (file.type !== 'audio/wav' && !file.name.toLowerCase().endsWith('.wav')) {
      setError('❌ Please select a valid WAV file');
      setSelectedFile(null);
      fileInputRef.current!.value = '';
      return;
    }

    // Validate file size (max 100MB for FFmpeg)
    if (file.size > 100 * 1024 * 1024) {
      setError('❌ File size must be less than 100MB');
      setSelectedFile(null);
      fileInputRef.current!.value = '';
      return;
    }

    setSelectedFile(file);
    setError('');
    setMp3Url('');
    setConversionStatus('');
  };

  const handleConvert = async () => {
    if (!selectedFile) {
      setError('❌ Please select a WAV file first');
      return;
    }

    setLoading(true);
    setError('');
    setMp3Url('');
    setConversionStatus('⏳ Initializing converter...');

    try {
      setConversionStatus('⏳ Processing audio file...');
      const result = await convertWavToMp3(selectedFile);

      if (result.error) {
        setError('❌ ' + result.error);
        setMp3Url('');
        setConversionStatus('');
      } else {
        setMp3Url(result.output);
        // Extract filename without extension and add .mp3
        const baseName = selectedFile.name.replace(/\.[^/.]+$/, '');
        setFileName(`${baseName}.mp3`);
        setConversionStatus('✅ Conversion complete!');
        setError('');
      }
    } catch (err: any) {
      setError('❌ ' + (err.message || 'Failed to convert file. Please try again.'));
      setMp3Url('');
      setConversionStatus('');
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = () => {
    if (mp3Url && fileName) {
      const link = document.createElement('a');
      link.href = mp3Url;
      link.download = fileName;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto space-y-6">
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-semibold text-slate-200 mb-3">
            Select WAV File
          </label>
          <div className="relative">
            <input
              ref={fileInputRef}
              type="file"
              accept=".wav,audio/wav"
              onChange={handleFileSelect}
              className="hidden"
              disabled={loading}
            />
            <button
              onClick={() => fileInputRef.current?.click()}
              className="w-full px-6 py-4 bg-gradient-to-r from-blue-600/20 to-indigo-600/20 border-2 border-dashed border-blue-500/50 rounded-xl hover:border-blue-500 transition-all duration-200 cursor-pointer text-slate-300 hover:text-white font-medium disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={loading}
            >
              <div className="flex items-center justify-center gap-2">
                <Upload className="w-5 h-5" />
                {selectedFile ? `📄 ${selectedFile.name}` : '📤 Click to upload or drag WAV file'}
              </div>
            </button>
          </div>
          <p className="text-xs text-slate-400 mt-2">
            Supported format: WAV (max 100MB)
          </p>
        </div>

        {selectedFile && !mp3Url && (
          <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-4">
            <p className="text-sm text-slate-300">
              <strong>📁 File:</strong> {selectedFile.name}
            </p>
            <p className="text-sm text-slate-400 mt-1">
              <strong>📊 Size:</strong> {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
            </p>
          </div>
        )}

        <Button
          onClick={handleConvert}
          disabled={loading || !selectedFile}
          className="w-full sm:w-auto"
        >
          {loading ? (
            <>
              <Loader className="w-4 h-4 mr-2 animate-spin" />
              Converting...
            </>
          ) : (
            '🎵 Convert to MP3'
          )}
        </Button>
      </div>

      {conversionStatus && (
        <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-4 text-blue-300 text-sm">
          {conversionStatus}
        </div>
      )}

      {error && (
        <div className="bg-red-500/10 border border-red-500/50 rounded-lg p-4 text-red-400 text-sm">
          {error}
        </div>
      )}

      {mp3Url && (
        <div className="bg-gradient-to-br from-slate-800/80 to-slate-700/80 border border-slate-700 rounded-xl p-6 shadow-lg">
          <h3 className="text-slate-200 font-semibold mb-4 text-lg">✨ Conversion Successful!</h3>
          <p className="text-slate-300 mb-4">Your file has been successfully converted to MP3.</p>
          
          <div className="mb-4">
            <p className="text-sm text-slate-400 mb-2">🎵 Preview:</p>
            <audio
              controls
              className="w-full rounded-lg"
              src={mp3Url}
            >
              Your browser does not support the audio element.
            </audio>
          </div>

          <Button
            onClick={handleDownload}
            className="w-full sm:w-auto bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800"
          >
            <Download className="w-4 h-4 mr-2" />
            📥 Download MP3 ({fileName})
          </Button>
        </div>
      )}
    </div>
  );
}
