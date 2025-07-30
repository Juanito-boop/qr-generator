import React from 'react';
import Header from './components/Header';
import QrAdminPanel from './components/QrAdminPanel';
import Features from './components/Features';
import Footer from './components/Footer';

function App() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
      <Header />
      
      <main className="py-12">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            Generador de Códigos QR
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Crea códigos QR personalizados con colores, logos y tamaños únicos. 
            Perfecto para negocios, eventos y uso personal.
          </p>
        </div>
        
        <QrAdminPanel />
      </main>
      
      <Features />
      <Footer />
    </div>
  );
}

export default App;