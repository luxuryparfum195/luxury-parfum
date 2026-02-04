#!/usr/bin/env node

const { spawn, exec } = require('child_process');
const path = require('path');
const fs = require('fs');

const isWindows = process.platform === 'win32';
const nodePath = 'C:\\Program Files\\nodejs\\node.exe';
const npmPath = 'C:\\Program Files\\nodejs\\node_modules\\npm\\bin\\npm.cmd';

console.log('🚀 Démarrage de LUXURY MAGIQUE...');
console.log('');

if (!fs.existsSync('node_modules')) {
  console.log('📦 Installation des dépendances...');
  exec(isWindows ? 'npm.cmd install' : 'npm install', {
    stdio: 'inherit',
    cwd: process.cwd(),
  }, (error, stdout, stderr) => {
    if (error) {
      console.log('❌ Erreur lors de l\'installation:', error);
      process.exit(1);
    }
    console.log('✅ Dépendances installées avec succès!');
    startServer();
  });
} else {
  console.log('✅ Dépendances déjà installées');
  startServer();
}

function startServer() {
  console.log('');
  console.log('🌐 Démarrage du serveur de développement...');
  console.log('');
  
  const serverProcess = exec(isWindows ? 'npm.cmd run dev' : 'npm run dev', {
    stdio: 'inherit',
    cwd: process.cwd(),
  });
  
  serverProcess.on('error', (err) => {
    console.log('❌ Erreur lors du démarrage du serveur:', err);
  });
}