import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

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
          <div className="space-y-4 p-4">
            <p className="text-sm text-gray-500 dark:text-gray-400 text-center">
              Analyzing your SRT file and generating timestamps...
            </p>
            <Progress value={progress} className="h-2" />
            <div className="flex justify-center">
              <div className="animate-pulse text-gray-400 dark:text-gray-600 text-sm mt-2">
                This may take a moment depending on file size
              </div>
            </div>
          </div>
        ) : content ? (
          <div className="animate-in fade-in duration-500">
            <div className="space-y-2 mt-2">
              {sections.map((section, index) => (
                <div key={index} className="border-b py-2 last:border-0 flex items-center justify-between group hover:bg-gray-50 dark:hover:bg-gray-800 rounded-md px-3 transition-colors">
                  <p className="text-base text-gray-800 dark:text-gray-200">
                    {section.timestamp}
                  </p>
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button 
                          variant="ghost" 
                          size="sm"
                          className="opacity-0 group-hover:opacity-100 transition-opacity"
                          onClick={() => navigator.clipboard.writeText(section.timestamp)}
                        >
                          <span className="sr-only">Copy</span>
                          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-copy"><rect width="14" height="14" x="8" y="8" rx="2" ry="2"/><path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2"/></svg>
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Copy timestamp</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <div className="rounded-full bg-gray-100 dark:bg-gray-800 p-4 mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-gray-400"><circle cx="12" cy="12" r="10"/><path d="M12 16v-4"/><path d="M12 8h.01"/></svg>
            </div>
            <p className="text-gray-500 dark:text-gray-400">
              Upload an SRT file to generate timestamps
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
