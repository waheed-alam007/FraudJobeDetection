#!/usr/bin/env bash
set -e

echo "Installing dependencies..."
npm install

echo "Building frontend..."
npm run build

echo "Build complete! Output in ./dist"
