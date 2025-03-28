import { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { parseSrtContent, extractTextFromSrt, SrtEntry } from '@/lib/srt-parser';

interface SrtUploaderProps {
  onContentExtracted: (content: string, entries: SrtEntry[]) => void;
  disabled: boolean;
}

export function SrtUploader({ onContentExtracted, disabled }: SrtUploaderProps) {
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
    <Card className={`w-full max-w-2xl p-4 ${isDragging ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/10' : ''}`}
         onDragOver={handleDragOver}
         onDragLeave={handleDragLeave}
         onDrop={handleDrop}>
      <CardContent className="flex flex-col items-center gap-4 p-4">
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
        >
          Select SRT File
        </Button>
        
        {fileName && (
          <div className="mt-2 text-sm">
            <span className="font-medium">Selected file:</span> {fileName}
          </div>
        )}
        
        {error && (
          <div className="mt-2 text-sm text-red-500">
            {error}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
