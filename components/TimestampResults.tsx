import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { useEffect, useRef, useState } from "react";

type ExportFormat = 'text' | 'json' | 'csv' | 'youtube';

interface ParsedTimestamp {
  time: string;
  description: string;
  category?: string;
  confidence?: number;
}

interface TimestampResultsProps {
  isLoading: boolean;
  content: string;
}

export function TimestampResults({ isLoading, content }: TimestampResultsProps) {
  const [progress, setProgress] = useState(0);
  const [parsedSections, setParsedSections] = useState<{ timestamp: string; isNew?: boolean }[]>(
    []
  );
  const prevContentRef = useRef<string>("");

  // Simulate progress when loading
  useEffect(() => {
    if (isLoading) {
      const interval = setInterval(() => {
        setProgress((prev) => {
          // Keep progress between 0-95% while loading
          // We'll set it to 100% when loading is complete
          const newValue = prev + Math.random() * 15;
          return Math.min(newValue, 95);
        });
      }, 200);

      return () => {
        clearInterval(interval);
      };
    } else if (content) {
      // Set progress to 100% when we have content and loading is complete
      setProgress(100);
    }
  }, [isLoading, content]);

  // Parse timestamp content and handle streaming updates
  useEffect(() => {
    const parseLines = (text: string) => {
      if (!text) return [];

      // Split by lines and filter empty lines
      const lines = text
        .split("\n")
        .map((line) => line.trim())
        .filter(Boolean);

      // Find header line with "Key Moments" (if exists)
      const contentStartIndex = lines.findIndex(
        (line) => line === "🕒 Key Moments:" || line === "🕒 Key moments:"
      );

      // Get only content after the header, or use all lines if header not found
      const contentLines = contentStartIndex >= 0 ? lines.slice(contentStartIndex + 1) : lines;

      // Match lines with timestamp format MM:SS or HH:MM:SS followed by description
      // Now handles both "00:00 Description" and "00:00:00 Description" formats
      return contentLines
        .filter((line) => {
          // Match either MM:SS or HH:MM:SS format at the start of the line
          return /^(\d{1,2}:\d{2}(:\d{2})?\s+)/.test(line);
        })
        .map((line) => ({ timestamp: line }));
    };

    // If there's new content
    if (content !== prevContentRef.current) {
      const currentLines = parseLines(content);
      const previousLines = parseLines(prevContentRef.current);

      // Find new lines that weren't in the previous content
      if (currentLines.length > previousLines.length) {
        const newSections = currentLines.map((line, index) => {
          // Mark as new if it's a line we haven't seen before
          const isNew = index >= previousLines.length;
          return {
            ...line,
            isNew: isNew,
          };
        });

        setParsedSections(newSections);

        // After a delay, remove the "new" flag to stop the animation
        if (newSections.some((s) => s.isNew)) {
          const timer = setTimeout(() => {
            setParsedSections((prev) => prev.map((section) => ({ ...section, isNew: false })));
          }, 1000);
          return () => clearTimeout(timer);
        }
      }

      prevContentRef.current = content;
    }
  }, [content]);

  // Parse timestamps into structured data
  const getParsedTimestamps = (): ParsedTimestamp[] => {
    return parsedSections.map((section) => {
      const [timePart, ...descriptionParts] = section.timestamp.split(/\s+/);
      const description = descriptionParts.join(" ");
      
      // Try to detect category from description keywords
      const lowerDesc = description.toLowerCase();
      let category = 'main';
      if (lowerDesc.includes('intro') || lowerDesc.includes('start') || lowerDesc.includes('beginning')) {
        category = 'intro';
      } else if (lowerDesc.includes('conclusion') || lowerDesc.includes('end') || lowerDesc.includes('wrap') || lowerDesc.includes('final')) {
        category = 'conclusion';
      } else if (lowerDesc.includes('demo') || lowerDesc.includes('example') || lowerDesc.includes('show')) {
        category = 'demo';
      } else if (lowerDesc.includes('explain') || lowerDesc.includes('concept') || lowerDesc.includes('theory')) {
        category = 'explanation';
      }
      
      return {
        time: timePart,
        description,
        category,
        confidence: Math.random() * 0.3 + 0.7 // Mock confidence score 0.7-1.0
      };
    });
  };

  // Export functions
  const exportTimestamps = (format: ExportFormat) => {
    const timestamps = getParsedTimestamps();
    let content = '';
    let filename = '';
    let mimeType = '';

    switch (format) {
      case 'text':
        content = timestamps.map(t => `${t.time} ${t.description}`).join('\n');
        filename = 'timestamps.txt';
        mimeType = 'text/plain';
        break;
        
      case 'json':
        content = JSON.stringify({
          generated: new Date().toISOString(),
          totalTimestamps: timestamps.length,
          timestamps: timestamps
        }, null, 2);
        filename = 'timestamps.json';
        mimeType = 'application/json';
        break;
        
      case 'csv':
        const csvHeader = 'Time,Description,Category,Confidence\n';
        const csvRows = timestamps.map(t => 
          `"${t.time}","${t.description.replace(/"/g, '""')}","${t.category}","${(t.confidence || 0).toFixed(2)}"`
        ).join('\n');
        content = csvHeader + csvRows;
        filename = 'timestamps.csv';
        mimeType = 'text/csv';
        break;
        
      case 'youtube':
        content = '📺 Video Timestamps:\n\n' + 
          timestamps.map(t => `⏰ ${t.time} - ${t.description}`).join('\n') +
          '\n\n✨ Generated with Vibestamps';
        filename = 'youtube_description.txt';
        mimeType = 'text/plain';
        break;
    }

    // Create and download file
    const blob = new Blob([content], { type: mimeType });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  // Function to copy timestamps to clipboard
  const copyToClipboard = (format: ExportFormat = 'text') => {
    const timestamps = getParsedTimestamps();
    let content = '';
    
    switch (format) {
      case 'youtube':
        content = timestamps.map(t => `⏰ ${t.time} - ${t.description}`).join('\n');
        break;
      default:
        content = timestamps.map(t => `${t.time} ${t.description}`).join('\n');
    }
    
    navigator.clipboard.writeText(content);
  };

  return (
    <Card className="w-full max-w-3xl backdrop-blur-sm">
      <CardHeader className="pb-2">
        <div className="flex flex-row items-center justify-between mb-2">
          <CardTitle className="text-xl text-emerald-800 dark:text-emerald-300">
            Generated Timestamps
          </CardTitle>
          {content && !isLoading && (
            <div className="flex items-center gap-2">
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button onClick={() => copyToClipboard('text')} variant="outline" size="sm">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="16"
                        height="16"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="mr-1"
                      >
                        <rect width="14" height="14" x="8" y="8" rx="2" ry="2" />
                        <path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2" />
                      </svg>
                      Copy
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Copy as plain text</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
          )}
        </div>
        
        {/* Export buttons */}
        {content && !isLoading && (
          <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-border">
            <span className="text-sm text-muted-foreground mr-2">Export as:</span>
            
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button 
                    onClick={() => exportTimestamps('youtube')} 
                    variant="outline" 
                    size="sm"
                    className="h-8 px-3"
                  >
                    <svg className="w-4 h-4 mr-1" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M8.051 1.999h.089c.822.003 4.987.033 6.11.335a2.01 2.01 0 0 1 1.415 1.42c.101.38.172.883.22 1.402l.01.104.022.26.008.104c.065.914.073 1.77.074 1.957v.075c-.001.194-.01 1.108-.082 2.06l-.008.105-.009.104c-.05.572-.124 1.14-.235 1.558a2.007 2.007 0 0 1-1.415 1.42c-1.16.312-5.569.334-6.18.335h-.142c-.309 0-1.587-.006-2.927-.052l-.17-.006-.087-.004-.171-.007-.171-.007c-1.11-.049-2.167-.128-2.654-.26a2.007 2.007 0 0 1-1.415-1.419c-.111-.417-.185-.986-.235-1.558L.09 9.82l-.008-.104A31.4 31.4 0 0 1 0 7.68v-.123c.002-.215.01-.958.064-1.778l.007-.103.003-.052.008-.104.022-.26.01-.104c.048-.519.119-1.023.22-1.402a2.007 2.007 0 0 1 1.415-1.42c.487-.13 1.544-.21 2.654-.26l.17-.007.172-.006.086-.003.171-.007A99.788 99.788 0 0 1 7.858 2h.193zM6.4 5.209v4.818l4.157-2.408z"/>
                    </svg>
                    YouTube
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Download formatted for YouTube descriptions</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
            
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button 
                    onClick={() => exportTimestamps('json')} 
                    variant="outline" 
                    size="sm"
                    className="h-8 px-3"
                  >
                    <svg className="w-4 h-4 mr-1" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
                      <polyline points="14,2 14,8 20,8"/>
                      <line x1="16" y1="13" x2="8" y2="13"/>
                      <line x1="16" y1="17" x2="8" y2="17"/>
                      <polyline points="10,9 9,9 8,9"/>
                    </svg>
                    JSON
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Download as JSON with metadata</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
            
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button 
                    onClick={() => exportTimestamps('csv')} 
                    variant="outline" 
                    size="sm"
                    className="h-8 px-3"
                  >
                    <svg className="w-4 h-4 mr-1" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
                      <polyline points="14,2 14,8 20,8"/>
                      <path d="M8 13h8"/>
                      <path d="M8 17h8"/>
                      <path d="M8 9h1"/>
                    </svg>
                    CSV
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Download as CSV spreadsheet</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
        )}
      </CardHeader>
      <CardContent>
        <div className={isLoading ? "space-y-4 p-6" : "hidden"}>
          <p className="text-sm text-sky-700/70 dark:text-sky-300/70 text-center">
            Analyzing your SRT file and generating timestamps...
          </p>
          <Progress value={progress} className="h-2" />
          <div className="flex justify-center">
            <div className="animate-pulse text-sky-600/50 dark:text-sky-400/50 text-sm mt-2">
              This may take a moment depending on file size
            </div>
          </div>
        </div>

        {/* Now we show results even while loading if we have some content */}
        {parsedSections.length > 0 ? (
          <div className="animate-in fade-in duration-500">
            {content.includes("🕒 Key Moments:") || content.includes("🕒 Key moments:") ? (
              <div className="mb-4 text-center">
                <p className="text-sky-700 dark:text-sky-300 text-lg font-medium">🕒 Key Moments</p>
              </div>
            ) : null}

            <div className="space-y-2 mt-2">
              {parsedSections.map((section, index) => {
                // Extract time part and description part from the timestamp
                // Handles both "00:00 Description" and "00:00:00 Description" formats
                const [timePart, ...descriptionParts] = section.timestamp.split(/\s+/);
                const description = descriptionParts.join(" ");

                return (
                  <div
                    key={index}
                    className={`border-b border-slate-200/60 dark:border-slate-700/50 py-3 last:border-0 flex items-start justify-between group hover:bg-emerald-50/50 dark:hover:bg-emerald-900/20 rounded-xl px-4 transition-colors ${
                      section.isNew
                        ? "animate-in slide-in-from-right-5 fade-in duration-300 scale-in-100"
                        : ""
                    }`}
                    style={
                      section.isNew
                        ? {
                            animationDelay: `${index * 100}ms`,
                            backgroundColor: section.isNew
                              ? "rgba(16,185,129,0.07)"
                              : "transparent",
                            transition: "background-color 1s ease-out",
                          }
                        : undefined
                    }
                  >
                    <div className="flex-1">
                      <div className="flex items-baseline">
                        <div className="flex items-center gap-2">
                          <span className="text-base font-medium text-emerald-600 dark:text-emerald-400 whitespace-nowrap">
                            {timePart}
                          </span>
                          {(() => {
                            // Show category badge based on description
                            const lowerDesc = description.toLowerCase();
                            let categoryColor = 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300';
                            let categoryText = '';
                            
                            if (lowerDesc.includes('intro') || lowerDesc.includes('start') || lowerDesc.includes('beginning')) {
                              categoryColor = 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300';
                              categoryText = 'Intro';
                            } else if (lowerDesc.includes('conclusion') || lowerDesc.includes('end') || lowerDesc.includes('wrap') || lowerDesc.includes('final')) {
                              categoryColor = 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300';
                              categoryText = 'End';
                            } else if (lowerDesc.includes('demo') || lowerDesc.includes('example') || lowerDesc.includes('show')) {
                              categoryColor = 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300';
                              categoryText = 'Demo';
                            } else if (lowerDesc.includes('explain') || lowerDesc.includes('concept') || lowerDesc.includes('theory')) {
                              categoryColor = 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-300';
                              categoryText = 'Info';
                            }
                            
                            return categoryText ? (
                              <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${categoryColor}`}>
                                {categoryText}
                              </span>
                            ) : null;
                          })()}
                        </div>
                        <span className="text-base text-slate-700 dark:text-slate-200 mt-1">
                          {description}
                        </span>
                      </div>
                    </div>
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="opacity-0 group-hover:opacity-100 transition-opacity rounded-full ml-2"
                            onClick={() => navigator.clipboard.writeText(section.timestamp)}
                          >
                            <span className="sr-only">Copy</span>
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              width="16"
                              height="16"
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="2"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              className="text-emerald-600 dark:text-emerald-400"
                            >
                              <rect width="14" height="14" x="8" y="8" rx="2" ry="2" />
                              <path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2" />
                            </svg>
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Copy timestamp</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </div>
                );
              })}
            </div>
          </div>
        ) : (
          !isLoading &&
          !content && (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <div className="rounded-full bg-emerald-50/80 dark:bg-emerald-900/20 p-6 mb-6 border border-emerald-100/50 dark:border-emerald-800/40">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="text-emerald-500 dark:text-emerald-400"
                >
                  <path d="M12 2v4" />
                  <path d="M12 18v4" />
                  <path d="m4.93 4.93 2.83 2.83" />
                  <path d="m16.24 16.24 2.83 2.83" />
                  <path d="M2 12h4" />
                  <path d="M18 12h4" />
                  <path d="m4.93 19.07 2.83-2.83" />
                  <path d="m16.24 7.76 2.83-2.83" />
                </svg>
              </div>
              <p className="text-sky-700 dark:text-sky-300">
                Upload an SRT file to generate timestamps
              </p>
            </div>
          )
        )}
      </CardContent>
    </Card>
  );
}
