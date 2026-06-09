const fs = require('fs');
const path = require('path');

const dir = './src';
const CHERRY_RED = '#8A001A'; // Deep Cherry Red

function replaceInFile(filePath) {
  let content = fs.readFileSync(filePath, 'utf8');
  let originalContent = content;

  // Layout selection color
  if (filePath.endsWith('layout.js')) {
    content = content.replace(/selection:bg-\[\#1A1A1A\]/g, `selection:bg-[${CHERRY_RED}]`);
  }

  // Header top banner
  if (filePath.endsWith('Header.jsx')) {
    content = content.replace(/bg-\[\#1A1A1A\] text-white/g, `bg-[${CHERRY_RED}] text-white`);
  }

  // In globals.css
  if (filePath.endsWith('globals.css')) {
    content = content.replace(/--background: #F8F5F1;/gi, '--background: #FFFFFF;');
    content = content.replace(/--foreground: #1A1A1A;/gi, '--foreground: #000000;');
  }

  // In login / register
  if (filePath.includes('login') || filePath.includes('register')) {
    // Change button hover to cherry red
    content = content.replace(/hover:bg-\[\#1A1A1A\]\/90/g, `hover:bg-[${CHERRY_RED}]`);
  }

  // Replace global instances
  content = content.replace(/#F8F5F1/gi, '#FFFFFF');
  content = content.replace(/#1A1A1A/gi, '#000000');

  if (content !== originalContent) {
    fs.writeFileSync(filePath, content, 'utf8');
    console.log(`Updated ${filePath}`);
  }
}

function walk(dir) {
  const list = fs.readdirSync(dir);
  list.forEach(file => {
    const fullPath = path.join(dir, file);
    const stat = fs.statSync(fullPath);
    if (stat && stat.isDirectory()) {
      walk(fullPath);
    } else if (fullPath.endsWith('.js') || fullPath.endsWith('.jsx') || fullPath.endsWith('.css')) {
      replaceInFile(fullPath);
    }
  });
}

walk(dir);
