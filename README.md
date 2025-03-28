# SRT Timestamp Generator

## Overview

SRT Timestamp Generator is a modern web application that simplifies the process of extracting valuable information from subtitle files. The app allows users to upload SubRip Text (`.srt`) files and leverages Google's Gemini AI model to generate meaningful timestamps, chapters, or summaries based on the content.

## Features

- **SRT File Upload**: Drag-and-drop or select SubRip Text (`.srt`) files
- **AI-Powered Analysis**: Process subtitle content using Google Gemini
- **Smart Timestamp Generation**: Extract key moments and organize content chronologically
- **Content Summarization**: Generate concise summaries of video/audio content
- **Responsive UI**: Beautiful, user-friendly interface that works on all devices
- **Real-time Processing**: Stream AI responses for immediate feedback

## Tech Stack

- **Framework:** Next.js (App Router)
- **Language:** TypeScript
- **Styling:** Tailwind CSS v4
- **UI Components:** shadcn/ui
- **AI Integration:** Vercel AI SDK
- **LLM:** Google Gemini
- **Package Manager:** Bun

## How It Works

1. **Upload**: User uploads an SRT file through the file input component
2. **Processing**: The app extracts text content from the SRT file client-side
3. **AI Analysis**: Extracted content is sent to the backend API, which leverages Gemini via Vercel AI SDK
4. **Generation**: The AI analyzes the dialogue and generates structured timestamps or summaries
5. **Display**: Results are streamed back to the UI and presented in a readable format

## Design System

We are using **shadcn/ui** for our component library. Components are added individually as needed.

- **Documentation:** [https://ui.shadcn.com/docs/components/](https://ui.shadcn.com/docs/components/)
- **Adding Components:** Use the CLI with Bun:
  ```bash
  bunx --bun shadcn@latest add <component-name>
  ```

## API Integration

The application uses the Vercel AI SDK to communicate with Google's Gemini model:

- **Backend Route**: `/api/generate` handles processing SRT content
- **SDK Functions**: Uses `streamText` or `streamObject` for real-time AI responses
- **Provider Package**: Requires `@ai-sdk/google` for Gemini integration

## Development Rules

1. **Package Management:** Always use `bun` for installing, removing, or managing dependencies (`bun add`, `bun install`, `bun remove`, etc.).
2. **UI Components:** Prefer components from `shadcn/ui` where possible. Install them using the command above.
3. **Environment Variables:** Store sensitive information like API keys in environment variables (`.env.local`) and do not commit them to version control.
4. **Code Style:** Follow standard TypeScript and React best practices. Ensure code is formatted (consider adding a formatter like Prettier later).

## Getting Started

### Prerequisites

- Bun installed on your system
- Google AI Gemini API key

### Setup

1. Clone the repository
2. Install dependencies:
   ```bash
   bun install
   ```
3. Create a `.env.local` file with your Google Gemini API key:
   ```
   GOOGLE_API_KEY=your_api_key_here
   ```
4. Run the development server:
   ```bash
   bun dev
   ```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the application.

## Project Structure

- `/app`: Next.js application code
  - `/api`: Backend API routes
  - `/components`: Reusable UI components
  - `/lib`: Utility functions and helpers
- `/public`: Static assets

## Learn More

To learn more about the technologies used in this project:

- [Next.js Documentation](https://nextjs.org/docs) - Next.js features and API
- [Vercel AI SDK](https://sdk.vercel.ai/docs) - AI integration tools
- [Google Gemini API](https://ai.google.dev/docs) - Google's multimodal AI model
- [shadcn/ui](https://ui.shadcn.com/) - UI component library

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out the [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
