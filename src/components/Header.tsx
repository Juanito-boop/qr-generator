import React from 'react';
import { QrCode } from 'lucide-react';

export default function Header() {
  return (
    <header className="bg-gradient-to-r from-blue-600 to-blue-800 text-white shadow-lg">
      <div className="max-w-7xl mx-auto px-6 py-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-white/10 rounded-lg">
              <QrCode size={32} />
            </div>
            <div>
              <h1 className="text-3xl font-bold">QR Generator Pro</h1>
              <p className="text-blue-100 text-sm">Crea códigos QR personalizados al instante</p>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}