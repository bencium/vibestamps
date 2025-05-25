# Netlify Deployment Guide for Vibestamps

This document outlines the configuration and setup for deploying this Next.js 15 application to Netlify.

## Configuration Files Added

1. **netlify.toml** - Main configuration file for Netlify deployment
   - Configures build command and publish directory
   - Sets Node.js version to 20.x for React 19 compatibility
   - Includes redirects for SPA routing
   - Forces HTTPS

2. **.nvmrc** - Specifies Node.js version 20 for consistency

3. **@netlify/plugin-nextjs** - Added as a development dependency
   - Optimizes Next.js deployment on Netlify
   - Handles server-side rendering and API routes

## Environment Variables

The following environment variables need to be set in the Netlify dashboard:

- `GOOGLE_API_KEY` - For Google Gemini AI integration

## Deployment Steps

1. **Connect to GitHub Repository**
   - In the Netlify dashboard, connect to your GitHub repository
   - Select the `main` branch for deployment

2. **Configure Build Settings**
   - Build command: `next build` (already set in netlify.toml)
   - Publish directory: `.next` (already set in netlify.toml)

3. **Set Environment Variables**
   - Go to Site settings > Environment variables
   - Add the environment variables listed above

4. **Deploy**
   - Trigger a manual deploy or push changes to the main branch

## Troubleshooting

If you encounter issues with the deployment:

1. Check Netlify build logs for errors
2. Verify environment variables are correctly set
3. Ensure Node.js version compatibility (v20.x)
4. Check for any API route issues in the function logs

## Local Testing

To test the Netlify build process locally before deploying:

```bash
# Install Netlify CLI
bun add -g netlify-cli

# Build and test locally
netlify build
netlify dev
```
