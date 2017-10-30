#!/bin/bash -e

# Cleanup
rm -r www/static/*

# Build frontend
cd playlists_frontend/
npm install
npm run build

# Install
cd ../
cp -v -r playlists_frontend/build/* www/
git add www/
