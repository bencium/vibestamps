/**
 * Utilities for parsing SRT files and extracting their content
 */

export interface SrtEntry {
  id: number;
  startTime: string;
  endTime: string;
  text: string;
}

/**
 * Parse SRT file content into structured entries
 */
export function parseSrtContent(content: string): SrtEntry[] {
  // Split the content by double newline (entry separator)
  const blocks = content.trim().split(/\r?\n\r?\n/);
  const entries: SrtEntry[] = [];

  for (const block of blocks) {
    const lines = block.split(/\r?\n/);
    
    // Need at least 3 lines for a valid SRT entry (id, timestamp, and text)
    if (lines.length < 3) continue;
    
    // First line is the entry id
    const id = parseInt(lines[0].trim(), 10);
    if (isNaN(id)) continue;
    
    // Second line contains the timestamps
    const timeMatch = lines[1].match(/(\d{2}:\d{2}:\d{2},\d{3}) --> (\d{2}:\d{2}:\d{2},\d{3})/);
    if (!timeMatch) continue;
    
    const [, startTime, endTime] = timeMatch;
    
    // Remaining lines are the text content
    const text = lines.slice(2).join(' ').trim();
    
    entries.push({
      id,
      startTime,
      endTime,
      text
    });
  }

  return entries;
}

/**
 * Extract plain text from SRT entries for AI processing
 */
export function extractTextFromSrt(entries: SrtEntry[]): string {
  return entries.map(entry => entry.text).join(' ');
}

/**
 * Format time from SRT format (00:00:00,000) to more readable format (00:00:00)
 */
export function formatTimestamp(timestamp: string): string {
  return timestamp.replace(',', '.');
}

/**
 * Get full transcript with timestamps
 */
export function getTimestampedTranscript(entries: SrtEntry[]): string {
  return entries.map(entry => 
    `[${formatTimestamp(entry.startTime)} - ${formatTimestamp(entry.endTime)}] ${entry.text}`
  ).join('\n');
}
