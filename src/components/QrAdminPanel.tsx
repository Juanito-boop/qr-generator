import React, { useEffect, useRef, useState } from "react";
import QRCodeStyling from "qr-code-styling";

export default function QrAdminPanel() {
  const qrRef = useRef<HTMLDivElement>(null);

  const [data, setData] = useState("https://miweb.com");
  const [color, setColor] = useState("#000000");
  const [bgColor, setBgColor] = useState("#ffffff");
  const [size, setSize] = useState(300);
  const [logo, setLogo] = useState<string | null>(null);

  // Inicializa QRCodeStyling
  const qrCode = useRef(
    new QRCodeStyling({
      width: size,
      height: size,
      data: data,
      image: logo || undefined,
      dotsOptions: { color: color, type: "rounded" },
      backgroundOptions: { color: bgColor },
      imageOptions: { crossOrigin: "anonymous", margin: 10 },
    })
  );

  // Actualiza cuando cambian props
  useEffect(() => {
    qrCode.current.update({
      width: size,
      height: size,
      data,
      image: logo || undefined,
      dotsOptions: { color, type: "rounded" },
      backgroundOptions: { color: bgColor },
    });
  }, [data, color, bgColor, size, logo]);

  // Monta el QR en el div
  useEffect(() => {
    if (qrRef.current) {
      qrRef.current.innerHTML = "";
      qrCode.current.append(qrRef.current);
    }
  }, []);

  // Cargar logo
  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const reader = new FileReader();
      reader.onload = () => setLogo(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  // Descargar QR
  const handleDownload = () => {
    qrCode.current.download({ name: "qr-code", extension: "png" });
  };

  // Limpiar logo
  const handleClearLogo = () => {
    setLogo(null);
  };

  // Plantillas predefinidas
  const applyTemplate = (template: string) => {
    switch (template) {
      case "classic":
        setColor("#000000");
        setBgColor("#ffffff");
        break;
      case "modern":
        setColor("#3B82F6");
        setBgColor("#F8FAFC");
        break;
      case "vibrant":
        setColor("#F59E0B");
        setBgColor("#1F2937");
        break;
      case "nature":
        setColor("#10B981");
        setBgColor("#F0FDF4");
        break;
    }
  };

  return (
    <div className="flex flex-col lg:flex-row gap-8 p-6 max-w-7xl mx-auto">
      {/* Panel de controles */}
      <div className="lg:w-1/3 space-y-6">
        <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-100">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Configuración</h2>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                URL o Texto
              </label>
              <input
                type="text"
                value={data}
                onChange={(e) => setData(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                placeholder="Ingresa tu URL o texto aquí"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Color de puntos
                </label>
                <input
                  type="color"
                  value={color}
                  onChange={(e) => setColor(e.target.value)}
                  className="w-full h-12 border border-gray-300 rounded-lg cursor-pointer"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Color de fondo
                </label>
                <input
                  type="color"
                  value={bgColor}
                  onChange={(e) => setBgColor(e.target.value)}
                  className="w-full h-12 border border-gray-300 rounded-lg cursor-pointer"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Tamaño: {size}px
              </label>
              <input
                type="range"
                min={150}
                max={500}
                value={size}
                onChange={(e) => setSize(parseInt(e.target.value))}
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Logo (opcional)
              </label>
              <div className="flex gap-2">
                <input
                  type="file"
                 className={`flex-1 px-4 py-2 text-sm font-medium border rounded-lg transition-colors ${
                   downloadFormat === 'png'
                     ? 'bg-blue-600 text-white border-blue-600 shadow-md'
                     : 'bg-gray-50 text-gray-700 border-gray-300 hover:bg-gray-100'
                 }`}
                  onChange={handleLogoUpload}
                  className="flex-1 text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-medium file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 file:cursor-pointer"
                />
                {logo && (
                  <button
                    onClick={handleClearLogo}
                    className="px-3 py-2 text-sm text-red-600 hover:text-red-800 transition-colors"
                 className={`flex-1 px-4 py-2 text-sm font-medium border rounded-lg transition-colors ${
                   downloadFormat === 'svg'
                     ? 'bg-blue-600 text-white border-blue-600 shadow-md'
                     : 'bg-gray-50 text-gray-700 border-gray-300 hover:bg-gray-100'
                 }`}
                    ✕
                  </button>
                )
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Plantillas */}
        <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-100">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Plantillas</h3>
          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={() => applyTemplate("classic")}
              className="p-3 border-2 border-gray-200 rounded-lg hover:border-blue-300 transition-colors text-sm font-medium"
            >
              Clásico
            </button>
            <button
              onClick={() => applyTemplate("modern")}
              className="p-3 border-2 border-gray-200 rounded-lg hover:border-blue-300 transition-colors text-sm font-medium"
            >
              Moderno
            </button>
            <button
              onClick={() => applyTemplate("vibrant")}
              className="p-3 border-2 border-gray-200 rounded-lg hover:border-blue-300 transition-colors text-sm font-medium"
            >
              Vibrante
            </button>
            <button
              onClick={() => applyTemplate("nature")}
              className="p-3 border-2 border-gray-200 rounded-lg hover:border-blue-300 transition-colors text-sm font-medium"
            >
              Natural
            </button>
          </div>
        </div>

        {/* Botón de descarga */}
        <button
          onClick={handleDownload}
          className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-semibold py-4 px-6 rounded-xl shadow-lg hover:shadow-xl transform hover:scale-[1.02] active:scale-[0.98] transition-all duration-200"
        >
          📥 Descargar QR Code
        </button>
      </div>

      {/* Vista previa del QR */}
      <div className="lg:w-2/3 flex flex-col items-center justify-center">
        <div className="bg-white p-8 rounded-xl shadow-lg border border-gray-100">
          <h2 className="text-xl font-semibold text-gray-800 mb-6 text-center">Vista Previa</h2>
          <div className="flex justify-center items-center min-h-[320px]">
            <div ref={qrRef} className="shadow-lg rounded-lg overflow-hidden"></div>
          </div>
        </div>
      </div>
    </div>
  )
  );
}

export default QrAdminPanel