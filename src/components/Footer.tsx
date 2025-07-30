import React from 'react';
import { Heart } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="text-center">
          <p className="flex items-center justify-center space-x-2 text-gray-300">
            <span>Hecho con</span>
            <Heart size={16} className="text-red-500 fill-current" />
            <span>usando React y Tailwind CSS</span>
          </p>
          <p className="mt-2 text-sm text-gray-400">
            © 2025 QR Generator Pro. Genera códigos QR de calidad profesional.
          </p>
        </div>
      </div>
    </footer>
  );
}