// Serveur Node.js natif sans Next.js - Fonctionne 100%
const http = require('http');
const fs = require('fs');
const path = require('path');
const { exec } = require('child_process');

const PORT = 3000;

// Données des parfums
const perfumes = [
  {
    id: '1',
    nom: 'Nuit de Diamant',
    description: 'Un parfum mystérieux aux notes de bois de santal et de rose bulgare',
    prix_par_ml: 2.50,
    image_url_1: 'https://images.unsplash.com/photo-1541643600914-78b084683601?w=400',
    image_url_2: 'https://images.unsplash.com/photo-1594035910387-fea47794261f?w=400',
    stock_max_ml: 50,
    min_achat_ml: 5,
    notes_olfactives: ['Rose', 'Santal', 'Vanille', 'Musk']
  },
  {
    id: '2',
    nom: 'Or Noir',
    description: 'L\'essence de l\'Orient avec oud et ambre',
    prix_par_ml: 3.00,
    image_url_1: 'https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?w=400',
    image_url_2: 'https://images.unsplash.com/photo-1616683693504-3ea7e9ad6fec?w=400',
    stock_max_ml: 30,
    min_achat_ml: 5,
    notes_olfactives: ['Oud', 'Ambre', 'Musk', 'Épices']
  },
  {
    id: '3',
    nom: 'Éclat Doré',
    description: 'Fraîcheur citrus et fleurs blanches',
    prix_par_ml: 2.00,
    image_url_1: 'https://images.unsplash.com/photo-1588405748880-12d1d2a59f75?w=400',
    image_url_2: 'https://images.unsplash.com/photo-1590736969955-71cc94801759?w=400',
    stock_max_ml: 40,
    min_achat_ml: 5,
    notes_olfactives: ['Citron', 'Jasmin', 'Muguet', 'Bergamote']
  }
];

// Créer le serveur
const server = http.createServer((req, res) => {
  const url = req.url;
  
  // Route API
  if (url === '/api/perfumes') {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify(perfumes));
    return;
  }
  
  // Page client
  if (url === '/' || url === '/index.html') {
    serveClientPage(res);
    return;
  }
  
  // Page admin
  if (url === '/admin' || url === '/admin.html') {
    serveAdminPage(res);
    return;
  }
  
  // 404
  res.writeHead(404, { 'Content-Type': 'text/html' });
  res.end('<h1>404 - Page non trouvée</h1><a href="/">Retour à l\'accueil</a>');
});

function serveClientPage(res) {
  const html = `<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>LUXURY MAGIQUE</title>
    <script src="https://unpkg.com/react@18/umd/react.development.js"></script>
    <script src="https://unpkg.com/react-dom@18/umd/react-dom.development.js"></script>
    <script src="https://unpkg.com/@babel/standalone/babel.min.js"></script>
    <script src="https://cdn.tailwindcss.com"></script>
    <style>
        body { font-family: serif; background: linear-gradient(135deg, #FFFAF0, #F4E4BC); min-height: 100vh; }
        .gold-text { color: #C9A227; }
        .luxury-btn { background: linear-gradient(135deg, #C9A227, #8B6914); color: white; padding: 12px 24px; border-radius: 8px; font-weight: bold; cursor: pointer; }
        .card { background: white; border-radius: 16px; box-shadow: 0 4px 20px rgba(0,0,0,0.1); overflow: hidden; }
    </style>
</head>
<body>
    <div id="root"></div>
    <script type="text/babel">
        const { useState } = React;
        const perfumes = ${JSON.stringify(perfumes)};
        
        function App() {
            const [cart, setCart] = useState([]);
            const formatPrice = (p) => '€' + p.toFixed(2);
            
            return (
                <div>
                    <header className="bg-white shadow-lg p-6">
                        <div className="max-w-7xl mx-auto flex justify-between items-center">
                            <h1 className="text-4xl font-bold gold-text">LUXURY MAGIQUE</h1>
                            <div className="flex gap-4">
                                <span className="luxury-btn">Panier ({cart.length})</span>
                                <a href="/admin" className="bg-gray-800 text-white px-4 py-2 rounded">Admin</a>
                            </div>
                        </div>
                    </header>
                    
                    <main className="max-w-7xl mx-auto p-8">
                        <h2 className="text-5xl text-center mb-12">L'Art du Parfum</h2>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                            {perfumes.map(p => (
                                <div key={p.id} className="card">
                                    <img src={p.image_url_1} className="w-full h-64 object-cover" />
                                    <div className="p-6">
                                        <h3 className="text-2xl font-bold mb-2">{p.nom}</h3>
                                        <p className="text-gray-600 mb-4">{p.description}</p>
                                        <div className="mb-4">
                                            {p.notes_olfactives.map(n => (
                                                <span key={n} className="inline-block bg-yellow-100 text-yellow-800 px-3 py-1 rounded-full text-sm mr-2">{n}</span>
                                            ))}
                                        </div>
                                        <p className="text-2xl font-bold gold-text mb-4">{formatPrice(p.prix_par_ml)} / ml</p>
                                        <button className="luxury-btn w-full" onClick={() => { setCart([...cart, p]); alert(p.nom + ' ajouté !'); }}>
                                            Ajouter au panier
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </main>
                </div>
            );
        }
        
        ReactDOM.render(<App />, document.getElementById('root'));
    </script>
</body>
</html>`;
  
  res.writeHead(200, { 'Content-Type': 'text/html' });
  res.end(html);
}

function serveAdminPage(res) {
  const totalStock = perfumes.reduce((sum, p) => sum + p.stock_max_ml, 0);
  const avgPrice = perfumes.reduce((sum, p) => sum + p.prix_par_ml, 0) / perfumes.length;
  
  const html = `<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>LUXURY MAGIQUE - Admin</title>
    <script src="https://unpkg.com/react@18/umd/react.development.js"></script>
    <script src="https://unpkg.com/react-dom@18/umd/react-dom.development.js"></script>
    <script src="https://unpkg.com/@babel/standalone/babel.min.js"></script>
    <script src="https://cdn.tailwindcss.com"></script>
    <style>
        body { font-family: sans-serif; background: #111827; color: white; min-height: 100vh; }
        .gold-text { color: #fbbf24; }
        .stat-card { background: rgba(255,255,255,0.05); border: 1px solid rgba(251,191,36,0.3); border-radius: 8px; padding: 24px; }
    </style>
</head>
<body>
    <div id="admin"></div>
    <script type="text/babel">
        const perfumes = ${JSON.stringify(perfumes)};
        const totalStock = ${totalStock};
        const avgPrice = ${avgPrice.toFixed(2)};
        
        function Admin() {
            const formatPrice = (p) => '€' + p.toFixed(2);
            
            return (
                <div>
                    <header className="bg-gray-800 border-b-2 border-yellow-500 p-4">
                        <div className="max-w-7xl mx-auto flex justify-between items-center">
                            <div>
                                <h1 className="text-2xl font-bold gold-text">LUXURY MAGIQUE</h1>
                                <p className="text-gray-400 text-sm">Dashboard Admin</p>
                            </div>
                            <a href="/" className="bg-yellow-500 text-black px-4 py-2 rounded font-bold">Voir le site</a>
                        </div>
                    </header>
                    
                    <main className="max-w-7xl mx-auto p-8">
                        <div className="grid grid-cols-4 gap-6 mb-8">
                            <div className="stat-card text-center">
                                <div className="text-3xl font-bold gold-text">{perfumes.length}</div>
                                <div className="text-gray-400 text-sm">Total Parfums</div>
                            </div>
                            <div className="stat-card text-center">
                                <div className="text-3xl font-bold text-green-400">{totalStock}ml</div>
                                <div className="text-gray-400 text-sm">Stock Total</div>
                            </div>
                            <div className="stat-card text-center">
                                <div className="text-3xl font-bold text-blue-400">{formatPrice(avgPrice)}/ml</div>
                                <div className="text-gray-400 text-sm">Prix Moyen</div>
                            </div>
                            <div className="stat-card text-center">
                                <div className="text-3xl font-bold text-purple-400">6</div>
                                <div className="text-gray-400 text-sm">Images</div>
                            </div>
                        </div>
                        
                        <div className="bg-gray-800 rounded-lg overflow-hidden">
                            <table className="w-full">
                                <thead className="bg-gray-900">
                                    <tr>
                                        <th className="p-4 text-left gold-text">Image</th>
                                        <th className="p-4 text-left gold-text">Nom</th>
                                        <th className="p-4 text-left gold-text">Prix</th>
                                        <th className="p-4 text-left gold-text">Stock</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {perfumes.map(p => (
                                        <tr key={p.id} className="border-b border-gray-700">
                                            <td className="p-4"><img src={p.image_url_1} className="w-16 h-16 object-cover rounded" /></td>
                                            <td className="p-4 font-semibold">{p.nom}</td>
                                            <td className="p-4 gold-text">{formatPrice(p.prix_par_ml)}</td>
                                            <td className="p-4">{p.stock_max_ml} ml</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </main>
                </div>
            );
        }
        
        ReactDOM.render(<Admin />, document.getElementById('admin'));
    </script>
</body>
</html>`;
  
  res.writeHead(200, { 'Content-Type': 'text/html' });
  res.end(html);
}

// Démarrer
server.listen(PORT, () => {
  console.log('');
  console.log('==========================================');
  console.log('🚀 LUXURY MAGIQUE - SITES ACTIFS');
  console.log('==========================================');
  console.log('📱 Site Client : http://localhost:' + PORT);
  console.log('⚙️  Dashboard   : http://localhost:' + PORT + '/admin');
  console.log('==========================================');
  console.log('🎉 Les deux sites sont accessibles !');
  console.log('🌐 Ouvrez ces liens dans votre navigateur');
  console.log('==========================================');
  
  // Ouvrir Chrome automatiquement
  setTimeout(() => {
    exec('start chrome http://localhost:' + PORT);
    setTimeout(() => {
      exec('start chrome http://localhost:' + PORT + '/admin');
    }, 2000);
  }, 3000);
});