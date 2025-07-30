import React from 'react';
import { Palette, Download, Smartphone, Zap } from 'lucide-react';

const features = [
  {
    icon: Palette,
    title: 'Personalización Completa',
    description: 'Cambia colores, tamaño y agrega tu logo para crear códigos QR únicos'
  },
  {
    icon: Download,
    title: 'Descarga Instantánea',
    description: 'Descarga tus códigos QR en formato PNG de alta calidad'
  },
  {
    icon: Smartphone,
    title: 'Responsive Design',
    description: 'Funciona perfectamente en móviles, tablets y computadoras'
  },
  {
    icon: Zap,
    title: 'Generación Rápida',
    description: 'Ve los cambios en tiempo real mientras personalizas tu código QR'
  }
];

export default function Features() {
  return (
    <section className="py-16 bg-gray-50">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Características Poderosas
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Todo lo que necesitas para crear códigos QR profesionales
          </p>
        </div>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <div key={index} className="bg-white p-6 rounded-xl shadow-lg border border-gray-100 hover:shadow-xl transition-shadow duration-300">
              <div className="p-3 bg-blue-100 rounded-lg w-fit mb-4">
                <feature.icon size={24} className="text-blue-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                {feature.title}
              </h3>
              <p className="text-gray-600 text-sm leading-relaxed">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}