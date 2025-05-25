#!/bin/bash

# Build the Next.js application
echo "Building Next.js application..."
next build

# Create the necessary directory structure for Netlify
echo "Setting up Netlify deployment structure..."
mkdir -p .netlify/functions-internal

# Copy the required files
echo "Copying Next.js build output..."
cp -r .next/static .next/
cp -r .next/server .next/

# Create a success indicator
echo "Build completed successfully!"
