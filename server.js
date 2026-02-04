const http = require('http');
const fs = require('fs');
const path = require('path');
const { exec } = require('child_process');

const PORT = 3000;
const PUBLIC_DIR = __dirname;

// Types MIME
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
  const parsedUrl = new URL(req.url, `http://localhost:${PORT}`);
  let pathname = parsedUrl.pathname;
  
  // Routes API
  if (pathname === '/api/perfumes') {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify(perfumes));
    return;
  }
  
  // Page d'accueil
  if (pathname === '/' || pathname === '/index.html') {
    serveHomePage(res);
    return;
  }
  
  // Page admin
  if (pathname === '/admin' || pathname === '/admin.html') {
    serveAdminPage(res);
    return;
  }
  
  // Fichiers statiques
  const filePath = path.join(PUBLIC_DIR, pathname);
  try {
    const content = fs.readFileSync(filePath, 'utf8');
    const extname = path.extname(filePath).toLowerCase();
    const contentType = MIME_TYPES[extname] || 'text/plain';
    
    res.writeHead(200, { 
      'Content-Type': contentType,
      'Access-Control-Allow-Origin': '*'
    });
    res.end(content);
  } catch (error) {
    res.writeHead(404, { 'Content-Type': 'text/html' });
    res.end(create404Page());
  }
});

function serveHomePage(res) {
  const html = `<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>LUXURY MAGIQUE | Parfums Haute Couture</title>
    <link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@300;400;500;600;700&family=Cinzel:wght@400;500;600;700&display=swap" rel="stylesheet">
    <script src="https://unpkg.com/react@18/umd/react.development.js"></script>
    <script src="https://unpkg.com/react-dom@18/umd/react-dom.development.js"></script>
    <script src="https://unpkg.com/@babel/standalone/babel.min.js"></script>
    <script src="https://cdn.tailwindcss.com"></script>
    <style>
        body { font-family: 'Cormorant Garamond', serif; background: linear-gradient(135deg, #FFFAF0 0%, #F4E4BC 100%); min-height: 100vh; }
        .luxury-text { background: linear-gradient(135deg, #C9A227, #F4E4BC, #C9A227); -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text; }
        .luxury-button { background: linear-gradient(135deg, #C9A227, #8B6914); color: white; padding: 12px 32px; border: none; border-radius: 8px; font-family: 'Cinzel', serif; font-weight: 600; letter-spacing: 2px; cursor: pointer; transition: all 0.3s ease; text-transform: uppercase; }
        .luxury-button:hover { transform: translateY(-2px); box-shadow: 0 10px 30px rgba(201, 162, 39, 0.4); }
        .product-card { background: white; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 20px rgba(0,0,0,0.1); transition: all 0.3s ease; }
        .product-card:hover { transform: translateY(-5px); box-shadow: 0 10px 40px rgba(0,0,0,0.2); }
        .note-tag { background: linear-gradient(135deg, #C9A227, #F4E4BC); color: #1a1a1a; padding: 4px 12px; border-radius: 20px; font-size: 12px; font-weight: 500; }
    </style>
</head>
<body>
    <div id="root"></div>
    <script type="text/babel">
        const { useState } = React;
        
        const perfumes = ${JSON.stringify(perfumes)};
        
        function App() {
            const [cart, setCart] = useState([]);
            const [showCart, setShowCart] = useState(false);
            
            const formatPrice = (price) => '€' + price.toFixed(2);
            const cartTotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
            
            const addToCart = (perfume, quantity) => {
                const existingItem = cart.find(item => item.id === perfume.id);
                if (existingItem) {
                    setCart(cart.map(item => 
                        item.id === perfume.id 
                            ? { ...item, quantity: item.quantity + quantity }
                            : item
                    ));
                } else {
                    setCart([...cart, {
                        id: perfume.id,
                        nom: perfume.nom,
                        price: perfume.prix_par_ml,
                        quantity
                    }]);
                }
                alert(perfume.nom + ' ajouté au panier!');
            };

            return (
                <div className="min-h-screen">
                    <header className="bg-white shadow-lg border-b-2 border-yellow-600">
                        <div className="max-w-7xl mx-auto px-4 py-6">
                            <div className="flex justify-between items-center">
                                <h1 className="text-4xl luxury-text" style={{ fontFamily: 'Cinzel, serif' }}>
                                    LUXURY MAGIQUE
                                </h1>
                                <div className="flex gap-4">
                                    <button onClick={() => setShowCart(true)} className="luxury-button text-sm">
                                        Panier ({cart.length})
                                    </button>
                                    <a href="/admin" className="bg-gray-800 text-white px-4 py-2 rounded">
                                        Admin
                                    </a>
                                </div>
                            </div>
                        </div>
                    </header>
                    
                    <main className="max-w-7xl mx-auto px-4 py-12">
                        <section className="text-center mb-16">
                            <h2 className="text-6xl mb-6" style={{ fontFamily: 'Cinzel, serif' }}>
                                L'Art du Parfum
                            </h2>
                            <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
                                Créations exclusives pour les âmes raffinées
                            </p>
                        </section>
                        
                        <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                            {perfumes.map(perfume => (
                                <div key={perfume.id} className="product-card">
                                    <img src={perfume.image_url_1} alt={perfume.nom} className="w-full h-80 object-cover" />
                                    <div className="p-6">
                                        <h3 className="text-2xl font-bold mb-2" style={{ fontFamily: 'Cormorant Garamond, serif' }}>
                                            {perfume.nom}
                                        </h3>
                                        <p className="text-gray-600 mb-4 text-sm">{perfume.description}</p>
                                        <div className="mb-4">
                                            {perfume.notes_olfactives.map(note => (
                                                <span key={note} className="note-tag mr-2 mb-2">{note}</span>
                                            ))}
                                        </div>
                                        <div className="flex justify-between items-center mb-4">
                                            <span className="text-2xl" style={{ color: '#C9A227', fontFamily: 'Cinzel, serif' }}>
                                                {formatPrice(perfume.prix_par_ml)} / ml
                                            </span>
                                            <span className="text-sm text-gray-500">Stock: {perfume.stock_max_ml}ml</span>
                                        </div>
                                        <div className="flex gap-2">
                                            <button onClick={() => addToCart(perfume, perfume.min_achat_ml)} className="luxury-button flex-1">
                                                Ajouter {perfume.min_achat_ml}ml
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </section>
                    </main>

                    {showCart && (
                        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center p-8 z-50">
                            <div className="bg-white rounded-lg max-w-2xl w-full p-6">
                                <div className="flex justify-between items-center mb-6">
                                    <h2 className="text-2xl font-bold" style={{ color: '#C9A227', fontFamily: 'Cinzel, serif' }}>Votre Panier</h2>
                                    <button onClick={() => setShowCart(false)} className="text-2xl">×</button>
                                </div>
                                {cart.length === 0 ? (
                                    <p className="text-center text-gray-500">Votre panier est vide</p>
                                ) : (
                                    <div>
                                        {cart.map((item, index) => (
                                            <div key={index} className="flex justify-between py-4 border-b">
                                                <div>
                                                    <div className="font-semibold">{item.nom}</div>
                                                    <div className="text-sm text-gray-500">{item.quantity} x {formatPrice(item.price)}</div>
                                                </div>
                                                <button onClick={() => setCart(cart.filter((_, i) => i !== index))} className="text-red-600">Supprimer</button>
                                            </div>
                                        ))}
                                        <div className="mt-6 pt-4 border-t">
                                            <div className="flex justify-between items-center mb-4">
                                                <span className="text-xl font-bold">Total:</span>
                                                <span className="text-2xl font-bold" style={{ color: '#C9A227' }}>{formatPrice(cartTotal)}</span>
                                            </div>
                                            <button className="luxury-button w-full">Commander</button>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    )}
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
    <title>LUXURY MAGIQUE - Admin Dashboard</title>
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap" rel="stylesheet">
    <script src="https://unpkg.com/react@18/umd/react.development.js"></script>
    <script src="https://unpkg.com/react-dom@18/umd/react-dom.development.js"></script>
    <script src="https://unpkg.com/@babel/standalone/babel.min.js"></script>
    <script src="https://cdn.tailwindcss.com"></script>
    <style>
        body { font-family: 'Inter', sans-serif; background: linear-gradient(135deg, #111827 0%, #1a1a1a 100%); min-height: 100vh; color: white; }
        .header { background: #1f2937; border-bottom: 2px solid #fbbf24; }
        .stats-card { background: rgba(255,255,255,0.05); border: 1px solid rgba(251, 191, 36, 0.3); border-radius: 8px; padding: 24px; text-align: center; }
        .btn-primary { background: #fbbf24; color: #111827; padding: 8px 16px; border: none; border-radius: 6px; font-weight: 500; cursor: pointer; }
        .btn-primary:hover { background: #f0f0f0; }
        .btn-danger { background: #ef4444; color: white; padding: 8px 16px; border: none; border-radius: 6px; font-weight: 500; cursor: pointer; }
    </style>
</head>
<body>
    <div id="admin-root"></div>
    <script type="text/babel">
        const { useState } = React;
        
        const perfumes = ${JSON.stringify(perfumes)};
        const totalStock = ${totalStock};
        const avgPrice = ${avgPrice.toFixed(2)};

        const AdminDashboard = () => {
            const [showModal, setShowModal] = useState(false);
            const formatPrice = (price) => '€' + price.toFixed(2);

            return (
                <div className="min-h-screen">
                    <header className="header py-4 px-6">
                        <div className="max-w-7xl mx-auto flex justify-between items-center">
                            <div>
                                <h1 className="text-2xl font-bold text-yellow-400">LUXURY MAGIQUE</h1>
                                <p className="text-gray-400 text-sm">Dashboard Administration</p>
                            </div>
                            <div className="flex gap-4">
                                <a href="/" className="btn-primary">Voir le site</a>
                                <button onClick={() => setShowModal(true)} className="btn-primary">+ Ajouter</button>
                            </div>
                        </div>
                    </header>

                    <main className="max-w-7xl mx-auto px-6 py-8">
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
                            <div className="stats-card">
                                <div className="text-3xl font-bold text-yellow-400">{perfumes.length}</div>
                                <div className="text-gray-400 text-sm uppercase">Total Parfums</div>
                            </div>
                            <div className="stats-card">
                                <div className="text-3xl font-bold text-green-400">{totalStock}ml</div>
                                <div className="text-gray-400 text-sm uppercase">Stock Total</div>
                            </div>
                            <div className="stats-card">
                                <div className="text-3xl font-bold text-blue-400">{formatPrice(avgPrice)}/ml</div>
                                <div className="text-gray-400 text-sm uppercase">Prix Moyen</div>
                            </div>
                            <div className="stats-card">
                                <div className="text-3xl font-bold text-purple-400">6</div>
                                <div className="text-gray-400 text-sm uppercase">Images</div>
                            </div>
                        </div>

                        <div className="bg-gray-800 rounded-lg overflow-hidden">
                            <table className="w-full">
                                <thead className="bg-gray-900 border-b border-gray-700">
                                    <tr>
                                        <th className="px-6 py-4 text-left text-yellow-600">Image</th>
                                        <th className="px-6 py-4 text-left text-yellow-600">Nom</th>
                                        <th className="px-6 py-4 text-left text-yellow-600">Prix/ml</th>
                                        <th className="px-6 py-4 text-left text-yellow-600">Stock</th>
                                        <th className="px-6 py-4 text-left text-yellow-600">Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {perfumes.map(perfume => (
                                        <tr key={perfume.id} className="border-b border-gray-700">
                                            <td className="px-6 py-4">
                                                <img src={perfume.image_url_1} alt={perfume.nom} className="w-16 h-16 object-cover rounded-lg" />
                                            </td>
                                            <td className="px-6 py-4 font-semibold">{perfume.nom}</td>
                                            <td className="px-6 py-4 text-yellow-400">{formatPrice(perfume.prix_par_ml)}</td>
                                            <td className="px-6 py-4 text-gray-300">{perfume.stock_max_ml} ml</td>
                                            <td className="px-6 py-4">
                                                <button className="btn-primary text-sm mr-2">Modifier</button>
                                                <button className="btn-danger text-sm">Supprimer</button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </main>
                </div>
            );
        };

        ReactDOM.render(<AdminDashboard />, document.getElementById('admin-root'));
    </script>
</body>
</html>`;
  
  res.writeHead(200, { 'Content-Type': 'text/html' });
  res.end(html);
}

function create404Page() {
  return `<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <title>404 - LUXURY MAGIQUE</title>
    <style>
        body { font-family: 'Arial', sans-serif; background: linear-gradient(135deg, #0A0A0A, #000000); color: #f5f5f5; min-height: 100vh; display: flex; justify-content: center; align-items: center; text-align: center; }
        .container { max-width: 600px; background: rgba(255,255,255,0.05); border: 1px solid rgba(201, 162, 39, 0.3); border-radius: 20px; padding: 40px; }
        h1 { color: #C9A227; margin-bottom: 20px; font-size: 4em; }
        .btn { color: white; background: linear-gradient(135deg, #C9A227, #8B6914); padding: 15px 30px; border-radius: 8px; text-decoration: none; }
    </style>
</head>
<body>
    <div class="container">
        <h1>404</h1>
        <p>Page non trouvée</p>
        <div style="margin-top: 30px;">
            <a href="/" class="btn">📱 Site Principal</a>
            <a href="/admin" class="btn" style="margin-left: 20px;">⚙️ Dashboard Admin</a>
        </div>
    </div>
</body>
</html>`;
}

// Démarrer le serveur
server.listen(PORT, '127.0.0.1', () => {
  console.log('');
  console.log('==========================================');
  console.log('🚀 LUXURY MAGIQUE SERVEUR ACTIF');
  console.log('==========================================');
  console.log('📱 SITE CLIENT:');
  console.log(`   http://localhost:${PORT}/`);
  console.log('');
  console.log('⚙️ DASHBOARD ADMIN:');
  console.log(`   http://localhost:${PORT}/admin`);
  console.log('');
  console.log('🎉 Les deux sites sont maintenant ACCESSIBLES !');
  console.log('🌐 Ouvrez ces liens dans votre navigateur');
  console.log('==========================================');
});