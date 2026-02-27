import React, { useState, useCallback } from 'react';
import { GoogleGenAI } from "@google/genai";
import { useDropzone } from 'react-dropzone';
import { Upload, Wand2, Loader2, Download, X, Image as ImageIcon, Sparkles } from 'lucide-react';
import { cn } from '@/src/lib/utils';

export const AIEditor: React.FC = () => {
  const [originalImage, setOriginalImage] = useState<string | null>(null);
  const [editedImage, setEditedImage] = useState<string | null>(null);
  const [prompt, setPrompt] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setOriginalImage(reader.result as string);
        setEditedImage(null);
        setError(null);
      };
      reader.readAsDataURL(file);
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { 'image/*': [] },
    multiple: false
  });

  const handleEdit = async () => {
    if (!originalImage || !prompt.trim()) return;

    setIsEditing(true);
    setError(null);

    try {
      const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
      
      // Extract base64 and mime type
      const base64Data = originalImage.split(',')[1];
      const mimeType = originalImage.split(';')[0].split(':')[1];

      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash-image',
        contents: {
          parts: [
            {
              inlineData: {
                data: base64Data,
                mimeType: mimeType,
              },
            },
            {
              text: prompt,
            },
          ],
        },
      });

      let resultUrl = null;
      for (const part of response.candidates?.[0]?.content?.parts || []) {
        if (part.inlineData) {
          resultUrl = `data:image/png;base64,${part.inlineData.data}`;
          break;
        }
      }

      if (resultUrl) {
        setEditedImage(resultUrl);
      } else {
        throw new Error('No edited image was returned by the model.');
      }
    } catch (err: any) {
      console.error(err);
      setError(err.message || 'Failed to edit image');
    } finally {
      setIsEditing(false);
    }
  };

  return (
    <div className="flex-1 p-8 overflow-auto">
      <div className="max-w-5xl mx-auto">
        <header className="mb-8">
          <h2 className="text-2xl font-bold flex items-center gap-2">
            <Wand2 className="w-6 h-6 text-accent" />
            AI Image Editor
          </h2>
          <p className="text-text-secondary">Transform your images using natural language prompts</p>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left Side: Upload & Controls */}
          <div className="space-y-6">
            {!originalImage ? (
              <div
                {...getRootProps()}
                className={cn(
                  "border-2 border-dashed border-border rounded-2xl p-12 flex flex-col items-center justify-center text-center cursor-pointer transition-all h-[400px]",
                  isDragActive ? "border-accent bg-accent/5" : "hover:border-text-secondary hover:bg-surface"
                )}
              >
                <input {...getInputProps()} />
                <div className="w-16 h-16 bg-surface rounded-full flex items-center justify-center mb-4">
                  <Upload className="w-8 h-8 text-text-secondary" />
                </div>
                <h3 className="text-lg font-semibold mb-2">Upload an image to edit</h3>
                <p className="text-text-secondary text-sm max-w-xs">
                  Drag and drop or click to select a file. PNG, JPG, or WEBP.
                </p>
              </div>
            ) : (
              <div className="space-y-6">
                <div className="relative aspect-video bg-surface border border-border rounded-2xl overflow-hidden">
                  <img src={originalImage} alt="Original" className="w-full h-full object-contain" />
                  <button
                    onClick={() => setOriginalImage(null)}
                    className="absolute top-4 right-4 p-2 bg-black/50 hover:bg-black/70 rounded-full text-white transition-colors"
                  >
                    <X className="w-4 h-4" />
                  </button>
                  <div className="absolute bottom-4 left-4 px-3 py-1 bg-black/50 rounded-full text-[10px] font-bold uppercase tracking-wider text-white">
                    Original
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="space-y-2">
                    <label className="text-xs font-bold uppercase tracking-wider text-text-secondary">What should I change?</label>
                    <textarea
                      value={prompt}
                      onChange={(e) => setPrompt(e.target.value)}
                      placeholder="e.g., 'Add a retro filter', 'Make the sky purple', 'Add a cat sitting on the chair'..."
                      className="w-full h-32 bg-surface border border-border rounded-xl p-4 text-sm focus:outline-none focus:ring-2 focus:ring-accent/50 resize-none"
                    />
                  </div>

                  <button
                    onClick={handleEdit}
                    disabled={isEditing || !prompt.trim()}
                    className="w-full bg-accent hover:bg-accent-hover disabled:opacity-50 disabled:cursor-not-allowed text-white py-4 rounded-xl font-bold transition-all flex items-center justify-center gap-2 shadow-lg shadow-accent/20"
                  >
                    {isEditing ? (
                      <>
                        <Loader2 className="w-5 h-5 animate-spin" />
                        Processing...
                      </>
                    ) : (
                      <>
                        <Sparkles className="w-5 h-5" />
                        Apply Changes
                      </>
                    )}
                  </button>

                  {error && (
                    <p className="text-xs text-red-400 bg-red-400/10 p-3 rounded-lg border border-red-400/20">
                      {error}
                    </p>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Right Side: Result */}
          <div className="space-y-6">
            <div className="aspect-video lg:aspect-square bg-surface border border-border rounded-2xl flex items-center justify-center overflow-hidden relative group">
              {editedImage ? (
                <>
                  <img 
                    src={editedImage} 
                    alt="Edited" 
                    className="w-full h-full object-contain"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-4">
                    <a 
                      href={editedImage} 
                      download="nexus-edited-image.png"
                      className="p-3 bg-white text-black rounded-full hover:scale-110 transition-transform"
                    >
                      <Download className="w-6 h-6" />
                    </a>
                  </div>
                  <div className="absolute bottom-4 left-4 px-3 py-1 bg-accent rounded-full text-[10px] font-bold uppercase tracking-wider text-white">
                    Edited Result
                  </div>
                </>
              ) : (
                <div className="text-center p-8">
                  <div className="w-20 h-20 bg-bg rounded-full flex items-center justify-center mx-auto mb-4 border border-border">
                    <ImageIcon className="w-10 h-10 text-text-secondary/20" />
                  </div>
                  <p className="text-text-secondary text-sm">The edited version will appear here</p>
                </div>
              )}
              
              {isEditing && (
                <div className="absolute inset-0 bg-bg/80 backdrop-blur-sm flex flex-col items-center justify-center">
                  <Loader2 className="w-12 h-12 text-accent animate-spin mb-4" />
                  <p className="text-accent font-medium animate-pulse">Applying AI magic...</p>
                </div>
              )}
            </div>

            {editedImage && (
              <div className="bg-surface border border-border rounded-xl p-4">
                <h4 className="text-xs font-bold uppercase tracking-wider text-text-secondary mb-2">AI Summary</h4>
                <p className="text-sm text-text-primary">
                  The image has been processed using Gemini 2.5 Flash Image. The requested changes were applied while maintaining the original context.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
