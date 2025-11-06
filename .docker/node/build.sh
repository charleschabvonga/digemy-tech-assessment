#!/bin/sh
echo "Building frontend assets..."
npm ci
npm run build
echo "Build complete!"

