import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { MAX_FILE_SIZE } from "@/lib/constants";
import { srtFileSchema, srtContentSchema } from "@/lib/schemas";
import { extractTextFromSrt, parseSrtContent, SrtEntry } from "@/lib/srt-parser";
import { useRef, useState } from "react";

interface SrtUploaderProps {
  onContentExtracted: (content: string, entries: SrtEntry[]) => void;
  onProcessFile: () => void;
  disabled: boolean;
  entriesCount: number;
  hasContent: boolean;
}

export function SrtUploader({
  onContentExtracted,
  onProcessFile,
  disabled,
  entriesCount,
  hasContent,
}: SrtUploaderProps) {
  const [fileName, setFileName] = useState<string>("");
  const [error, setError] = useState<string>("");
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    console.log("File input changed, files:", event.target.files);
    const file = event.target.files?.[0];
    if (file) {
      console.log("Processing file:", file.name, file.size);
      processFile(file);
    }
  };

  const processFile = async (file: File) => {
    console.log("Processing file:", file.name, file.size, file.type);
    setFileName(file.name);
    setError("");

    // Check file size before any other validation
    if (file.size > MAX_FILE_SIZE) {
      const errorMsg = `File is too large. Maximum size is ${MAX_FILE_SIZE / 1024}KB`;
      console.error(errorMsg);
      setError(errorMsg);
      return;
    }

    try {
      // Validate file name with Zod
      console.log("Validating file name:", file.name);
      const validationResult = srtFileSchema.safeParse({
        fileName: file.name,
        fileContent: "placeholder", // Will be replaced with actual content
      });

      if (!validationResult.success) {
        const errorMsg = validationResult.error.errors[0].message;
        console.error("File name validation failed:", errorMsg);
        setError(errorMsg);
        return;
      }

      // Read file content
      console.log("Reading file content...");
      const fileContent = await file.text();
      console.log("File content length:", fileContent.length);

      // Validate content with Zod
      console.log("Validating file content...");
      const contentValidation = srtContentSchema.safeParse({
        srtContent: fileContent,
      });

      if (!contentValidation.success) {
        const errorMsg = contentValidation.error.errors[0].message;
        console.error("Content validation failed:", errorMsg);
        setError(errorMsg);
        return;
      }

      // Parse SRT content
      console.log("Parsing SRT content...");
      const entries = parseSrtContent(fileContent);
      console.log("Parsed entries count:", entries.length);

      // Extract text content - use the entries array, not the raw content
      const textContent = extractTextFromSrt(entries);
      console.log("Extracted text length:", textContent.length);

      // Pass content to parent component
      console.log("Passing content to parent component...");
      onContentExtracted(fileContent, entries);

      // Debounce to avoid rapid clicks
      console.log("Setting timeout for processing...");
      setTimeout(() => {
        console.log("Timeout triggered, disabled:", disabled);
        if (!disabled) {
          console.log("Calling onProcessFile...");
          onProcessFile();
        }
      }, 500);
    } catch (err) {
      console.error("Error processing file:", err);
      setError(`Failed to process the file: ${err instanceof Error ? err.message : "Unknown error"}`); 
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
    console.log("Upload button clicked, disabled:", disabled);
    
    // Clear any existing errors
    setError("");
    
    // Make sure we have a valid file input reference
    if (!fileInputRef.current) {
      console.error("File input reference is null!");
      setError("Browser error: Could not access file input. Please try refreshing the page.");
      return;
    }
    
    console.log("File input ref exists, clicking...");
    
    // Use a more direct approach to trigger the file input
    try {
      fileInputRef.current.click();
    } catch (err) {
      console.error("Error clicking file input:", err);
      setError("Browser error: Could not open file picker. Please try a different browser.");
    }
  };

  return (
    <Card
      className={
        isDragging
          ? "w-full max-w-2xl p-4 transition-all duration-300 border-2 border-sky-400/80 dark:border-sky-500/70 bg-sky-50/80 dark:bg-sky-900/20 shadow-[0_8px_30px_rgba(14,165,233,0.2)]"
          : "w-full max-w-2xl p-4 transition-all duration-300 hover:border-sky-200/70 dark:hover:border-sky-700/60 hover:shadow-[0_8px_20px_rgba(0,0,0,0.08)]"
      }
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      <CardContent className="flex flex-col items-center gap-5 p-6">
        {!hasContent && (
          <>
            <div className="text-center mb-2">
              <h2 className="text-xl font-semibold mb-3 text-emerald-800 dark:text-emerald-300">
                Upload SRT File
              </h2>
              <p className="text-sky-700/70 dark:text-sky-300/70 text-sm">
                Drag & drop your .srt file here or click to browse
              </p>
            </div>

            {/* File input - using a more reliable approach */}
            <input
              ref={fileInputRef}
              type="file"
              accept=".srt"
              onChange={handleFileChange}
              className="hidden" /* Hidden but still functional */
              disabled={disabled}
              aria-label="Upload SRT file"
              data-testid="srt-file-input"
            />

            {/* More prominent upload button */}
            <Button
              onClick={triggerFileInput}
              className="w-full max-w-xs bg-emerald-600 hover:bg-emerald-700 text-white hover:text-white"
              disabled={disabled}
              size="lg"
              type="button"
              data-testid="upload-button"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="mr-1"
              >
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                <polyline points="17 8 12 3 7 8" />
                <line x1="12" y1="3" x2="12" y2="15" />
              </svg>
              Select SRT File
            </Button>
            
            {/* Fallback text link in case button doesn't work */}
            <div className="mt-2">
              <button 
                onClick={triggerFileInput} 
                className="text-sm text-blue-500 hover:text-blue-700 underline"
                disabled={disabled}
                type="button"
              >
                Click here if the button does not work
              </button>
            </div>
          </>
        )}

        {fileName && (
          <div className="mt-2 text-sm flex items-center justify-center gap-2 bg-emerald-50/80 dark:bg-emerald-900/20 p-3 rounded-xl w-full backdrop-blur-sm border border-emerald-100 dark:border-emerald-800/50">
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
              className="text-emerald-500"
            >
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
              <polyline points="7 10 12 15 17 10" />
              <line x1="12" y1="15" x2="12" y2="3" />
            </svg>
            <span className="font-medium text-emerald-700 dark:text-emerald-300">
              Selected file:
            </span>
            <span className="text-slate-600 dark:text-slate-300">{fileName}</span>
          </div>
        )}

        {hasContent && !disabled && (
          <div className="flex flex-col items-center gap-3 animate-in fade-in duration-300 w-full">
            <p className="text-sm text-sky-600 dark:text-sky-400 bg-sky-50/50 dark:bg-sky-900/20 px-4 py-2 rounded-full border border-sky-100/70 dark:border-sky-800/50">
              <span className="font-medium">{entriesCount}</span> entries found in the SRT file
            </p>
            <Button
              onClick={onProcessFile}
              className="w-full max-w-xs"
              disabled={disabled}
              size="lg"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="mr-1"
              >
                <path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z"></path>
                <path d="m9 12 2 2 4-4"></path>
              </svg>
              Generate Timestamps
            </Button>
          </div>
        )}

        {error && (
          <div className="mt-2 text-sm flex items-start gap-2 bg-rose-50/70 dark:bg-rose-900/20 p-3 rounded-xl border border-rose-200 dark:border-rose-800/60 w-full backdrop-blur-sm">
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
              className="text-rose-500 mt-0.5"
            >
              <circle cx="12" cy="12" r="10" />
              <line x1="12" y1="8" x2="12" y2="12" />
              <line x1="12" y1="16" x2="12.01" y2="16" />
            </svg>
            <span className="text-rose-600 dark:text-rose-300">{error}</span>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
