import { build } from 'vite';
import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';

async function buildForVercel() {
  console.log('Building for Vercel...');
  
  // Build frontend with Vite
  await build();
  
  // Build backend with esbuild
  execSync('esbuild server/index.ts --platform=node --packages=external --bundle --format=esm --outfile=api/index.js', {
    stdio: 'inherit'
  });
  
  // Copy static files
  if (fs.existsSync('attached_assets')) {
    fs.cpSync('attached_assets', 'dist/public/attached_assets', { recursive: true });
  }
  
  console.log('Build completed!');
}

buildForVercel().catch(console.error);