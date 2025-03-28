import { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { parseSrtContent, extractTextFromSrt, SrtEntry } from '@/lib/srt-parser';

interface SrtUploaderProps {
  onContentExtracted: (content: string, entries: SrtEntry[]) => void;
  onProcessFile: () => void;
  disabled: boolean;
  entriesCount: number;
  hasContent: boolean;
}

export function SrtUploader({ onContentExtracted, onProcessFile, disabled, entriesCount, hasContent }: SrtUploaderProps) {
  const [fileName, setFileName] = useState<string>('');
  const [error, setError] = useState<string>('');
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) processFile(file);
  };

  const processFile = async (file: File) => {
    setFileName(file.name);
    setError('');

    if (!file.name.endsWith('.srt')) {
      setError('Please upload a valid .srt file');
      return;
    }

    try {
      const content = await file.text();
      const entries = parseSrtContent(content);
      
      if (entries.length === 0) {
        setError('Could not parse any valid entries from the SRT file');
        return;
      }

      const extractedText = extractTextFromSrt(entries);
      onContentExtracted(extractedText, entries);
      
      // Auto-process after a short delay to allow UI to update
      setTimeout(() => {
        if (!disabled) {
          onProcessFile();
        }
      }, 500);
    } catch (err) {
      console.error('Error reading file:', err);
      setError('Failed to read the file. Please try again.');
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    
    const file = e.dataTransfer.files?.[0];
    if (file) processFile(file);
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  return (
    <Card 
      className={`w-full max-w-2xl p-4 transition-all duration-200 ${
        isDragging 
          ? 'border-2 border-blue-500 bg-blue-50 dark:bg-blue-900/10 shadow-md' 
          : 'hover:border-gray-300 dark:hover:border-gray-600'
      }`}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}>
      <CardContent className="flex flex-col items-center gap-4 p-4">
        {!hasContent && (
          <>
            <div className="text-center mb-2">
              <h2 className="text-xl font-semibold mb-2">Upload SRT File</h2>
              <p className="text-gray-500 dark:text-gray-400 text-sm">
                Drag & drop your .srt file here or click to browse
              </p>
            </div>
            
            <Input
              ref={fileInputRef}
              type="file"
              accept=".srt"
              onChange={handleFileChange}
              className="hidden"
              disabled={disabled}
            />
            
            <Button 
              onClick={triggerFileInput}
              className="w-full max-w-xs"
              disabled={disabled}
              size="lg"
            >
              Select SRT File
            </Button>
          </>
        )}
        
        {fileName && (
          <div className="mt-2 text-sm flex items-center justify-center gap-2 bg-gray-50 dark:bg-gray-800 p-2 rounded-md w-full">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-green-500"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
            <span className="font-medium">Selected file:</span> {fileName}
          </div>
        )}
        
        {hasContent && !disabled && (
          <div className="flex flex-col items-center gap-2 animate-in fade-in duration-300 w-full">
            <p className="text-sm text-gray-500 dark:text-gray-400">
              {entriesCount} entries found in the SRT file
            </p>
            <Button
              onClick={onProcessFile}
              className="w-full max-w-xs"
              disabled={disabled}
              size="lg"
            >
              Generate Timestamps
            </Button>
          </div>
        )}
        
        {error && (
          <div className="mt-2 text-sm flex items-start gap-2 bg-red-50 dark:bg-red-900/20 p-2 rounded-md border border-red-200 dark:border-red-800 w-full">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-red-500 mt-0.5"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
            <span className="text-red-600 dark:text-red-400">{error}</span>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
