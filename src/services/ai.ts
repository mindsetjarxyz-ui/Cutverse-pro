// AI Service for Cutverse AI using Bytez SDK
// Direct integration with bytez.js SDK

import Bytez from "bytez.js";

const API_KEY = "cd8fe321d2c8864355dcc151f435f41f";

// Initialize Bytez SDK
const sdk = new Bytez(API_KEY);

// Clean text by removing restricted characters
export function cleanText(text: string): string {
  return text
    .replace(/#/g, '')
    .replace(/\*/g, '')
    .replace(/'/g, '')
    .replace(/`/g, '')
    .replace(/—/g, ' - ')
    .trim();
}

// Format text with beautiful rendering - headings bold, titles larger, important words bold
export function formatOutputText(text: string): string {
  if (!text) return '';
  
  const cleaned = cleanText(text);
  const lines = cleaned.split('\n');
  const processedLines: string[] = [];
  let titleRendered = false;

  for (let i = 0; i < lines.length; i++) {
    let line = lines[i].trim();
    
    if (!line) {
      processedLines.push('');
      continue;
    }

    // Detect and style the first significant line as title (larger, bold)
    if (!titleRendered && line.length > 3 && line.length < 200) {
      line = `<h2 class="text-xl sm:text-2xl font-bold text-white mb-3 mt-2">${line}</h2>`;
      titleRendered = true;
      processedLines.push(line);
      continue;
    }

    // Detect section headings (bold, larger)
    const isHeading = (
      line.length < 80 &&
      !line.endsWith(',') &&
      (
        line.endsWith(':') ||
        /^(Introduction|Conclusion|Body|Opening|Closing|Dear|Subject|Date|To|From|Paragraph|Para|Section|Part|Chapter|Arguments|Counter|Rebuttal|Hook|Intro|Main Content|Call to Action|Outro|Summary|Abstract|Overview|Background|Details|Examples|Analysis|Discussion|Results|Findings|Key Points|Important Notes|Benefits|Advantages|Disadvantages|Challenges|Solutions|Methods|Approaches|Strategies|Tips|Best Practices|Recommendations|Conclusion|Final Thoughts|Next Steps)/i.test(line) ||
        (line === line.replace(/[a-z]/g, '') && line.length > 2) || // ALL CAPS
        (/^[A-Z]/.test(line) && line.split(' ').length <= 6 && !line.endsWith('.') && i > 0 && lines[i-1].trim() === '')
      )
    );

    if (isHeading) {
      line = `<h3 class="text-lg sm:text-xl font-bold text-white mt-4 mb-2">${line}</h3>`;
    } else {
      // Bold important keywords/phrases inline
      const boldPatterns = [
        /\b(Important|Key Point|Key|Note|Conclusion|Summary|Introduction|Therefore|However|Moreover|Furthermore|In conclusion|To summarize|In summary|First|Second|Third|Finally|Firstly|Secondly|Thirdly|Lastly|Main Point|Main|For example|For instance|On the other hand|In addition|As a result|Consequently|Meanwhile|Nevertheless|Regardless|Significantly|Notably|Essentially|Fundamentally|Critically|Respectfully|Sincerely|Regards|Faithfully|Yours truly|Thank you|Dear Sir|Dear Madam|Dear Teacher|To Whom|Subject|Reference|Opening Statement|Closing Statement|Ladies and Gentlemen|Honourable|Distinguished|Respected|Evidence|Example|Result|Moral|Lesson|Moreover|Thus|Hence|Also|Additionally|Similarly|Likewise|Besides|Indeed|Certainly|Obviously|Clearly|Undoubtedly|Definitely|Absolutely|Positively|Success|Successful|Benefit|Benefits|Advantage|Advantages|Important|Importantly|Significantly|notably|Essentially|Basically)\b/gi
      ];

      for (const pattern of boldPatterns) {
        line = line.replace(pattern, '<strong class="font-semibold text-blue-300">$1</strong>');
      }
    }

    processedLines.push(line);
  }

  // Join with proper line breaks and convert double newlines to paragraph breaks
  let result = processedLines.join('\n');
  
  // Convert paragraph breaks (double newline) to proper spacing
  result = result.replace(/\n\n+/g, '</p><p class="mt-4">');
  result = result.replace(/\n/g, '<br/>');
  result = `<p class="leading-relaxed text-slate-200">${result}</p>`;
  
  // Clean up empty paragraphs
  result = result.replace(/<p class="mt-4"><\/p>/g, '');
  result = result.replace(/<p class="leading-relaxed text-slate-200"><\/p>/g, '');
  result = result.replace(/<p>\s*<br\/>\s*<\/p>/g, '');
  
  // Wrap headings properly
  result = result.replace(/<p class="leading-relaxed text-slate-200"><h2/g, '<h2');
  result = result.replace(/<\/h2><br\/>/g, '</h2>');
  result = result.replace(/<p class="leading-relaxed text-slate-200"><h3/g, '<h3');
  result = result.replace(/<\/h3><br\/>/g, '</h3>');
  
  return result;
}

// Text Generation using Bytez SDK with gpt-4o
export async function generateText(prompt: string, systemPrompt?: string): Promise<{ error: string | null; output: string }> {
  try {
    // Choose gpt-4o model
    const model = sdk.model("openai/gpt-4o");
    
    // Build messages array
    const messages: Array<{ role: string; content: string }> = [];
    
    const defaultSystem = `You are a professional AI writing assistant. Follow these rules strictly:
- NEVER use hash/pound symbols (#) in your output
- NEVER use asterisks (*) in your output  
- NEVER use single quotes or backticks in your output
- NEVER use markdown formatting
- Write clean plain text only
- Use proper paragraph breaks with blank lines between sections
- Write section headings on their own line followed by a colon if needed
- Keep text natural, well-structured, and easy to read
- If the user requests a specific language, write entirely in that language`;

    messages.push({ 
      role: "system", 
      content: systemPrompt ? `${defaultSystem}\n\n${systemPrompt}` : defaultSystem 
    });
    
    messages.push({ role: "user", content: prompt });
    
    // Send input to model using the SDK
    const result = await model.run(messages);
    
    // Check for errors
    if (result.error) {
      console.error('Bytez API error:', result.error);
      return { error: String(result.error), output: '' };
    }
    
    // Extract the text from the response
    let outputText = '';
    
    if (typeof result.output === 'string') {
      outputText = result.output;
    } else if (result.output?.choices?.[0]?.message?.content) {
      outputText = result.output.choices[0].message.content;
    } else if (result.output?.content) {
      outputText = result.output.content;
    } else if (result.output?.message?.content) {
      outputText = result.output.message.content;
    } else if (Array.isArray(result.output)) {
      outputText = result.output.map((item: any) => {
        if (typeof item === 'string') return item;
        return item.content || item.text || item.message?.content || '';
      }).join('');
    } else if (typeof result.output === 'object' && result.output !== null) {
      const output = result.output as any;
      if (output.text) {
        outputText = output.text;
      } else if (output.response) {
        outputText = output.response;
      } else {
        try {
          outputText = JSON.stringify(result.output);
        } catch {
          outputText = String(result.output);
        }
      }
    }
    
    if (!outputText) {
      return { error: 'No output received from API', output: '' };
    }
    
    return { error: null, output: cleanText(outputText) };
  } catch (err: any) {
    console.error('Text generation error:', err);
    return { error: err.message || 'Failed to generate text. Please try again.', output: '' };
  }
}

// Image Generation using Bytez SDK with stable-diffusion-xl-base-1.0
export async function generateImage(prompt: string): Promise<{ error: string | null; output: string }> {
  try {
    // Choose stable-diffusion-xl-base-1.0 model
    const model = sdk.model("stabilityai/stable-diffusion-xl-base-1.0");
    
    // Send input to model using the SDK
    const result = await model.run(prompt);
    
    // Check for errors
    if (result.error) {
      console.error('Bytez API error:', result.error);
      return { error: String(result.error), output: '' };
    }
    
    // Handle different response formats
    let imageData = '';
    
    if (result.output instanceof Blob) {
      imageData = URL.createObjectURL(result.output);
    } else if (typeof result.output === 'string') {
      imageData = result.output;
    } else if (result.output?.image) {
      imageData = result.output.image;
    } else if (result.output?.url) {
      imageData = result.output.url;
    } else if (result.output?.images?.[0]) {
      imageData = result.output.images[0];
    } else if (result.output?.base64) {
      imageData = `data:image/png;base64,${result.output.base64}`;
    } else if (Array.isArray(result.output) && result.output.length > 0) {
      const firstItem = result.output[0];
      if (firstItem instanceof Blob) {
        imageData = URL.createObjectURL(firstItem);
      } else if (typeof firstItem === 'string') {
        imageData = firstItem;
      } else if (firstItem?.url) {
        imageData = firstItem.url;
      } else if (firstItem?.image) {
        imageData = firstItem.image;
      }
    }
    
    // Ensure proper data URI format for base64
    if (imageData && !imageData.startsWith('http') && !imageData.startsWith('data:') && !imageData.startsWith('blob:')) {
      imageData = `data:image/png;base64,${imageData}`;
    }
    
    if (!imageData) {
      return { error: 'No image received from API', output: '' };
    }
    
    return { error: null, output: imageData };
  } catch (err: any) {
    console.error('Image generation error:', err);
    return { error: err.message || 'Failed to generate image', output: '' };
  }
}

// Music Generation using Bytez SDK with musicgen-melody model
export async function generateMusic(prompt: string): Promise<{ error: string | null; output: string }> {
  try {
    // Choose musicgen-melody model
    const model = sdk.model("facebook/musicgen-melody");
    
    // Send input to model using the SDK
    const result = await model.run(prompt);
    
    // Check for errors
    if (result.error) {
      console.error('Bytez API error:', result.error);
      return { error: String(result.error), output: '' };
    }
    
    // Handle different response formats
    let audioData = '';
    
    if (result.output instanceof Blob) {
      audioData = URL.createObjectURL(result.output);
    } else if (typeof result.output === 'string') {
      audioData = result.output;
    } else if (result.output?.audio) {
      audioData = result.output.audio;
    } else if (result.output?.url) {
      audioData = result.output.url;
    } else if (result.output?.file) {
      audioData = result.output.file;
    } else if (result.output?.base64) {
      audioData = `data:audio/wav;base64,${result.output.base64}`;
    } else if (Array.isArray(result.output) && result.output.length > 0) {
      const firstItem = result.output[0];
      if (firstItem instanceof Blob) {
        audioData = URL.createObjectURL(firstItem);
      } else if (typeof firstItem === 'string') {
        audioData = firstItem;
      } else if (firstItem?.url) {
        audioData = firstItem.url;
      } else if (firstItem?.audio) {
        audioData = firstItem.audio;
      }
    }
    
    // Ensure proper data URI format for base64 if needed
    if (audioData && !audioData.startsWith('http') && !audioData.startsWith('data:') && !audioData.startsWith('blob:')) {
      audioData = `data:audio/wav;base64,${audioData}`;
    }
    
    if (!audioData) {
      return { error: 'No audio received from API', output: '' };
    }
    
    return { error: null, output: audioData };
  } catch (err: any) {
    console.error('Music generation error:', err);
    return { error: err.message || 'Failed to generate music. Please try again.', output: '' };
  }
}

// FFmpeg instance (will be loaded on demand)
let ffmpegInstance: any = null;

// Initialize FFmpeg
async function initFFmpeg() {
  if (ffmpegInstance && ffmpegInstance.isLoaded()) {
    return ffmpegInstance;
  }

  try {
    const FFmpeg = (await import('@ffmpeg/ffmpeg')).FFmpeg;
    const { fetchFile } = await import('@ffmpeg/util');
    
    ffmpegInstance = new FFmpeg();
    
    if (!ffmpegInstance.isLoaded()) {
      await ffmpegInstance.load();
    }
    
    return ffmpegInstance;
  } catch (error) {
    console.error('Failed to load FFmpeg:', error);
    throw new Error('Failed to initialize audio converter. Please refresh the page and try again.');
  }
}

// WAV to MP3 Conversion using FFmpeg.wasm
export async function convertWavToMp3(file: File): Promise<{ error: string | null; output: string }> {
  try {
    // Validate file
    if (!file) {
      return { error: 'No file provided', output: '' };
    }

    if (file.type !== 'audio/wav' && !file.name.toLowerCase().endsWith('.wav')) {
      return { error: 'Please provide a valid WAV file', output: '' };
    }

    // Initialize FFmpeg
    const ffmpeg = await initFFmpeg();

    // Write the WAV file to FFmpeg filesystem
    const inputFileName = 'input.wav';
    const outputFileName = 'output.mp3';

    // Convert file to Uint8Array
    const fileBuffer = await file.arrayBuffer();
    const uint8Array = new Uint8Array(fileBuffer);

    // Write input file to FFmpeg
    ffmpeg.writeFile(inputFileName, uint8Array);

    // Run FFmpeg command to convert WAV to MP3
    // -i input.wav: input file
    // -q:a 4: audio quality (lower is better, 4 is good quality)
    // output.mp3: output file
    await ffmpeg.exec(['-i', inputFileName, '-q:a', '4', outputFileName]);

    // Read the output MP3 file
    const outputData = ffmpeg.readFile(outputFileName) as Uint8Array;

    // Create a blob from the output data
    const mp3Blob = new Blob([outputData], { type: 'audio/mpeg' });
    const mp3Url = URL.createObjectURL(mp3Blob);

    // Clean up - delete files from FFmpeg filesystem
    ffmpeg.deleteFile(inputFileName);
    ffmpeg.deleteFile(outputFileName);

    if (!mp3Url) {
      return { error: 'Failed to convert audio file', output: '' };
    }

    return { error: null, output: mp3Url };
  } catch (err: any) {
    console.error('WAV to MP3 conversion error:', err);
    
    // Provide helpful error messages
    let errorMsg = 'Failed to convert WAV to MP3. ';
    if (err.message?.includes('Failed to initialize')) {
      errorMsg += 'The converter is initializing. Please try again in a moment.';
    } else if (err.message?.includes('network')) {
      errorMsg += 'Network error. Please check your internet connection.';
    } else {
      errorMsg += 'Please try with a different file.';
    }
    
    return { error: errorMsg, output: '' };
  }
}
