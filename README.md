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

## Getting Started

### Prerequisites

- [Bun](https://bun.sh/) installed on your system (v1.0.0 or newer)
- Google Gemini API key (see below for instructions)
- Node.js 18.17.0 or later

### Setting Up the Google Gemini API Key

1. Visit [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Sign in with your Google account if prompted
3. Click on "Get API Key" in the left menu
4. Click "Create API Key" button
5. Copy your API key - **important**: this is the only time you'll see this key, so be sure to save it securely
6. Never share your API key or commit it to version control

### Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/yourusername/srt-timestamp-generator.git
   cd srt-timestamp-generator
   ```

2. Install dependencies:

   ```bash
   bun install
   ```

3. Create a `.env.local` file in the project root:

   ```
   GOOGLE_API_KEY=your_api_key_here
   ```

4. Run the development server:

   ```bash
   bun dev
   ```

5. Open [http://localhost:3000](http://localhost:3000) with your browser to see the application.

## Usage

1. Upload an SRT subtitle file by clicking the upload area or dragging and dropping
2. Wait for the file to be processed and analyzed by the AI
3. View the generated timestamps that highlight key moments in the content
4. Copy the timestamps to use in your YouTube descriptions or video editing software

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

## Project Structure

- `/app`: Next.js application code
  - `/api`: Backend API routes
  - `/components`: Reusable UI components
  - `/lib`: Utility functions and helpers
- `/public`: Static assets

## Troubleshooting

- **API Key Issues**: If you receive authentication errors, double-check your API key in the `.env.local` file.
- **File Upload Problems**: Make sure you're using a valid SRT file format.
- **Bun Errors**: Ensure you have Bun installed correctly. Run `bun --version` to verify.

## Learn More

To learn more about the technologies used in this project:

- [Next.js Documentation](https://nextjs.org/docs) - Next.js features and API
- [Vercel AI SDK](https://sdk.vercel.ai/docs) - AI integration tools
- [Google Gemini API](https://ai.google.dev/docs) - Google's multimodal AI model
- [shadcn/ui](https://ui.shadcn.com/) - UI component library

## Sponsorship

This project is currently seeking sponsors to help with:

- Hosting costs for deploying the application
- Google Gemini API credits to support processing larger volumes of SRT files

If you're interested in sponsoring this project or would like to discuss partnership opportunities, please reach out to me via [X fka Twitter @RayFernando1337](https://x.com/Rayfernando1337).

## License

This project is licensed under the MIT License - see the LICENSE file for details.
