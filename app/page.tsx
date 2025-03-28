"use client";

import { useState } from "react";
import Image from "next/image";
import { Inter } from "next/font/google";
import { SrtUploader } from "@/components/SrtUploader";
import { TimestampResults } from "@/components/TimestampResults";
import { SrtEntry } from "@/lib/srt-parser";

const inter = Inter({ subsets: ['latin'] });

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
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
      <div className="container max-w-5xl mx-auto px-4">
        {/* Header */}
        <header className="flex flex-col items-center mb-12">
          <div className="flex items-center gap-3 mb-6">
            <Image 
              src="/favicon.ico" 
              alt="SRT Timestamp Generator Logo" 
              width={36} 
              height={36} 
              className="rounded-lg"
            />
            <h1 className={`text-3xl font-bold ${inter.className}`}>
              SRT Timestamp Generator
            </h1>
          </div>
          <p className="text-center text-gray-600 dark:text-gray-400 max-w-2xl">
            Upload a SubRip Text (.srt) file to generate meaningful timestamps and summaries using AI.
          </p>
        </header>

        {/* Main Content */}
        <main className="flex flex-col items-center gap-8">
          {/* File Upload */}
          <SrtUploader 
            onContentExtracted={handleContentExtracted} 
            disabled={isProcessing}
          />

          {/* Process Button */}
          {srtContent && !isProcessing && !generatedContent && (
            <div className="flex flex-col items-center gap-2">
              <p className="text-sm text-gray-500 dark:text-gray-400">
                {srtEntries.length} entries found in the SRT file
              </p>
              <button
                onClick={processWithAI}
                className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors"
                disabled={isProcessing}
              >
                Generate Timestamps
              </button>
            </div>
          )}

          {/* Error Display */}
          {error && (
            <div className="w-full max-w-2xl p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg text-red-600 dark:text-red-400 text-sm">
              <p><strong>Error:</strong> {error}</p>
            </div>
          )}

          {/* Results */}
          {(isProcessing || generatedContent) && (
            <TimestampResults 
              isLoading={isProcessing} 
              content={generatedContent} 
            />
          )}

          {/* Reset Button */}
          {generatedContent && !isProcessing && (
            <button
              onClick={() => {
                setSrtContent("");
                setSrtEntries([]);
                setGeneratedContent("");
              }}
              className="px-4 py-2 bg-gray-200 dark:bg-gray-800 hover:bg-gray-300 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 font-medium rounded-lg transition-colors"
            >
              Process Another File
            </button>
          )}
        </main>

        {/* Footer */}
        <footer className="mt-16 pt-8 border-t border-gray-200 dark:border-gray-800 text-center text-gray-500 dark:text-gray-400 text-sm">
          <p>Built with Next.js, Tailwind CSS, and Google Gemini</p>
          <p className="mt-1"> {new Date().getFullYear()} SRT Timestamp Generator</p>
        </footer>
      </div>
    </div>
  );
}
