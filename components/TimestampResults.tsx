import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';

interface TimestampResultsProps {
  isLoading: boolean;
  content: string;
}

export function TimestampResults({ isLoading, content }: TimestampResultsProps) {
  const [progress, setProgress] = useState(0);

  // Simulate progress when loading
  useEffect(() => {
    if (isLoading) {
      const interval = setInterval(() => {
        setProgress((prev) => {
          // Keep progress between 0-95% while loading
          // We'll set it to 100% when loading is complete
          const newValue = prev + (Math.random() * 5);
          return Math.min(newValue, 95);
        });
      }, 500);

      return () => {
        clearInterval(interval);
        // When loading completes, we'll set progress to 100% in the else block
      };
    } else {
      // Reset progress when not loading
      setProgress(100);
    }
  }, [isLoading]);

  // Parse the timestamp content into lines
  const parseContent = (content: string) => {
    if (!content) return [];
    
    // Split by lines and filter empty lines
    const timestampLines = content
      .split('\n')
      .map(line => line.trim())
      .filter(line => line && /^\d{2}:\d{2}:\d{2}\s*-\s*.+/.test(line));
    
    return timestampLines.map(line => ({
      timestamp: line
    }));
  };

  const sections = parseContent(content);

  // Function to copy all timestamps to clipboard
  const copyToClipboard = () => {
    const timestampsText = sections.map(section => section.timestamp).join('\n');
    navigator.clipboard.writeText(timestampsText);
  };

  return (
    <Card className="w-full max-w-3xl">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-xl">Generated Timestamps</CardTitle>
        {content && !isLoading && (
          <Button onClick={copyToClipboard} variant="outline" size="sm">
            Copy All
          </Button>
        )}
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="space-y-4">
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Analyzing your SRT file and generating timestamps...
            </p>
            <Progress value={progress} className="h-2" />
          </div>
        ) : content ? (
          <div className="space-y-2 mt-2">
            {sections.map((section, index) => (
              <div key={index} className="border-b py-2 last:border-0">
                <p className="text-base text-gray-800 dark:text-gray-200">
                  {section.timestamp}
                </p>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-500 dark:text-gray-400 text-center py-8">
            Upload an SRT file to generate timestamps
          </p>
        )}
      </CardContent>
    </Card>
  );
}
