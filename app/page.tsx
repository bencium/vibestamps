"use client";

import { useState } from "react";
import { Doto } from "next/font/google";
import { SrtUploader } from "@/components/SrtUploader";
import { TimestampResults } from "@/components/TimestampResults";
import { SrtEntry } from "@/lib/srt-parser";
import { Button } from "@/components/ui/button";

const doto = Doto({ weight: "900", subsets: ["latin"] });

export default function Home() {
  const [srtContent, setSrtContent] = useState<string>("");
  const [srtEntries, setSrtEntries] = useState<SrtEntry[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [generatedContent, setGeneratedContent] = useState<string>("");
  const [error, setError] = useState<string>("");

  // Handle extracted SRT content
  const handleContentExtracted = (content: string, entries: SrtEntry[]) => {
    setSrtContent(content);
    setSrtEntries(entries);
    setGeneratedContent(""); // Reset previous results
    setError("");
  };

  // Process the SRT content with AI
  const processWithAI = async () => {
    if (!srtContent) return;

    setIsProcessing(true);
    setError("");
    setGeneratedContent("");

    try {
      const response = await fetch("/api/generate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ srtContent }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to generate timestamps");
      }

      // Handle streaming response
      const reader = response.body?.getReader();
      const decoder = new TextDecoder();
      let result = "";

      if (reader) {
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;
          const chunk = decoder.decode(value, { stream: true });
          result += chunk;
          setGeneratedContent(result);
        }
      }
    } catch (err) {
      console.error("Error generating timestamps:", err);
      setError(err instanceof Error ? err.message : "Failed to process your file");
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-4 md:py-8 flex flex-col">
      <div className="container max-w-5xl mx-auto px-4 flex flex-col flex-grow">
        {/* Header */}
        <header className="flex flex-col items-center mb-8 md:mb-12">
          <div className="flex items-center gap-3 mb-6">
            <h1 className={`text-6xl text-center font-bold ${doto.className}`}>SRT Timestamp Generator</h1>
          </div>
          <p className="text-center text-gray-600 dark:text-gray-400 max-w-2xl">
            Upload a .srt file to generate meaningful timestamps for YouTube videos.
          </p>
        </header>

        {/* Main Content */}
        <main className="flex flex-col items-center gap-6 md:gap-8 w-full flex-grow">
          {/* Step 1: File Upload (only show when not processing and no results) */}
          {!isProcessing && !generatedContent && (
            <SrtUploader 
              onContentExtracted={handleContentExtracted} 
              onProcessFile={processWithAI}
              disabled={isProcessing} 
              entriesCount={srtEntries.length}
              hasContent={!!srtContent}
            />
          )}

          {/* Error Display (show at any step if there's an error) */}
          {error && (
            <div className="w-full max-w-2xl p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg flex items-start gap-3 animate-in fade-in duration-300">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-red-500 mt-0.5"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
              <div className="text-red-600 dark:text-red-400 text-sm">
                <p className="font-medium">Error</p>
                <p>{error}</p>
                {/* Add a retry button when there's an error */}
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="mt-2" 
                  onClick={() => setError("")}
                >
                  Dismiss
                </Button>
              </div>
            </div>
          )}

          {/* Step 2 & 3: Processing or Results */}
          {(isProcessing || generatedContent) && (
            <div className="w-full flex flex-col items-center animate-in fade-in duration-300">
              <TimestampResults isLoading={isProcessing} content={generatedContent} />
              
              {/* Only show reset button when results are generated and not loading */}
              {generatedContent && !isProcessing && (
                <Button
                  onClick={() => {
                    setSrtContent("");
                    setSrtEntries([]);
                    setGeneratedContent("");
                  }}
                  variant="outline"
                  className="mt-6"
                >
                  Process Another File
                </Button>
              )}
            </div>
          )}
        </main>

        {/* Footer */}
        <footer className="mt-auto pt-8 border-t border-gray-200 dark:border-gray-800 text-center text-gray-500 dark:text-gray-400 text-sm">
          <p className="flex items-center justify-center gap-3">
            Ray Fernando
            <a href="https://twitter.com/RayFernando1337" target="_blank" rel="noopener noreferrer" className="text-gray-500 hover:text-blue-500 transition-colors" aria-label="Twitter/X Profile">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                <path d="M12.6.75h2.454l-5.36 6.142L16 15.25h-4.937l-3.867-5.07-4.425 5.07H.316l5.733-6.57L0 .75h5.063l3.495 4.633L12.601.75Zm-.86 13.028h1.36L4.323 2.145H2.865z"/>
              </svg>
            </a>
            <a href="https://youtube.com/@RayFernando1337" target="_blank" rel="noopener noreferrer" className="text-gray-500 hover:text-red-500 transition-colors" aria-label="YouTube Channel">
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="currentColor" viewBox="0 0 16 16">
                <path d="M8.051 1.999h.089c.822.003 4.987.033 6.11.335a2.01 2.01 0 0 1 1.415 1.42c.101.38.172.883.22 1.402l.01.104.022.26.008.104c.065.914.073 1.77.074 1.957v.075c-.001.194-.01 1.108-.082 2.06l-.008.105-.009.104c-.05.572-.124 1.14-.235 1.558a2.007 2.007 0 0 1-1.415 1.42c-1.16.312-5.569.334-6.18.335h-.142c-.309 0-1.587-.006-2.927-.052l-.17-.006-.087-.004-.171-.007-.171-.007c-1.11-.049-2.167-.128-2.654-.26a2.007 2.007 0 0 1-1.415-1.419c-.111-.417-.185-.986-.235-1.558L.09 9.82l-.008-.104A31.4 31.4 0 0 1 0 7.68v-.123c.002-.215.01-.958.064-1.778l.007-.103.003-.052.008-.104.022-.26.01-.104c.048-.519.119-1.023.22-1.402a2.007 2.007 0 0 1 1.415-1.42c.487-.13 1.544-.21 2.654-.26l.17-.007.172-.006.086-.003.171-.007A99.788 99.788 0 0 1 7.858 2h.193zM6.4 5.209v4.818l4.157-2.408z"/>
              </svg>
            </a>
          </p>
          <p className="mt-1"> {new Date().getFullYear()} SRT Timestamp Generator</p>
        </footer>
      </div>
    </div>
  );
}
