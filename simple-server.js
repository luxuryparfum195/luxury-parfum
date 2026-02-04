# Créer serveur statique avec HTML natif
const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = 3001;
const PUBLIC_DIR = path.join(__dirname);

// MIME types
const MIME_TYPES = {
  '.html': 'text/html',
  '.css': 'text/css',
  '.js': 'application/javascript',
  '.json': 'application/json',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.gif': 'image/gif',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon'
};

const server = http.createServer((req, res) => {
  let filePath = path.join(PUBLIC_DIR, req.url === '/' ? 'index.html' : req.url);
  const extname = path.extname(filePath).toLowerCase();
  const contentType = MIME_TYPES[extname] || 'text/plain';

  try {
    const content = fs.readFileSync(filePath);
    res.writeHead(200, { 'Content-Type': contentType });
    res.end(content);
  } catch (error) {
    // Si c'est /admin, servir admin.html
    if (req.url === '/admin' || req.url === '/admin/') {
      const adminContent = fs.readFileSync(path.join(PUBLIC_DIR, 'admin.html'));
      res.writeHead(200, { 'Content-Type': 'text/html' });
      res.end(adminContent);
      return;
    }
    
    // 404 pour les autres pages
    res.writeHead(404, { 'Content-Type': 'text/html' });
    res.end(`
      <!DOCTYPE html>
      <html>
      <head>
        <title>404 - Page non trouvée</title>
        <style>
          body { font-family: Arial, sans-serif; display: flex; justify-content: center; align-items: center; height: 100vh; background: #1a1a1a; color: white; }
          .container { text-align: center; padding: 40px; }
          h1 { font-size: 4em; margin-bottom: 20px; color: #c9a227; }
          p { font-size: 1.2em; margin-bottom: 30px; }
          a { color: #c9a227; text-decoration: none; font-weight: bold; }
        </style>
      </head>
      <body>
        <div class="container">
          <h1>404</h1>
          <p>Page non trouvée</p>
          <a href="/">Retour à l'accueil</a>
        </div>
      </body>
      </html>
    `);
  }
});

server.listen(PORT, () => {
  console.log('');
  console.log('==========================================');
  console.log('🚀 LUXURY MAGIQUE SERVEUR ACTIF');
  console.log('==========================================');
  console.log('📱 SITE CLIENT:');
  console.log(`   http://localhost:${PORT}`);
  console.log('');
  console.log('⚙️ DASHBOARD ADMIN:');
  console.log(`   http://localhost:${PORT}/admin`);
  console.log('');
  console.log('🎉 Sites sont maintenant accessibles !');
  console.log('==========================================');
  console.log('🌐 Ouvrez ces liens dans votre navigateur');
  console.log('==========================================');
});