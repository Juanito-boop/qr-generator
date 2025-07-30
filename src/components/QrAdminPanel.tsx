import React, { useEffect, useRef, useState } from "react";
import QRCodeStyling from "qr-code-styling";

export default function QrAdminPanel() {
  const qrRef = useRef<HTMLDivElement>(null);

  const [qrType, setQrType] = useState<'url' | 'wifi' | 'contact' | 'text'>('url');
  const [data, setData] = useState("https://miweb.com");
  const [color, setColor] = useState("#000000");
  const [bgColor, setBgColor] = useState("#ffffff");
  const [size, setSize] = useState(300);
  const [logo, setLogo] = useState<string | null>(null);
  const [downloadFormat, setDownloadFormat] = useState<'png' | 'svg'>('png');
  const [showTypeIcon, setShowTypeIcon] = useState(true);
  const [isScrolling, setIsScrolling] = useState(false);
  
  // Datos específicos para cada tipo
  const [wifiData, setWifiData] = useState({
    ssid: '',
    password: '',
    encryption: 'WPA'
  });
  const [contactData, setContactData] = useState({
    name: '',
    phone: '',
    email: '',
    company: ''
  });

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

  // Crear imagen del icono de tipo
  const createTypeIconImage = (isLarge = false) => {
    if (!showTypeIcon) return undefined;
    
    const size = isLarge ? 80 : 40;
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    if (!ctx) return undefined;
    
    canvas.width = size;
    canvas.height = size;
    
    // Fondo circular blanco
    ctx.fillStyle = 'white';
    ctx.beginPath();
    ctx.arc(size/2, size/2, size/2 - 2, 0, 2 * Math.PI);
    ctx.fill();
    
    // Sombra sutil
    ctx.shadowColor = 'rgba(0,0,0,0.1)';
    ctx.shadowBlur = 4;
    ctx.shadowOffsetX = 1;
    ctx.shadowOffsetY = 1;
    
    // Dibujar el icono
    ctx.font = `${size * 0.5}px Arial`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillStyle = '#374151';
    ctx.fillText(getTypeIcon(), size/2, size/2);
    
    return canvas.toDataURL();
  };

  // Crear imagen compuesta con logo e icono de tipo
  const createCompositeImage = async (logoUrl: string, typeIconUrl: string) => {
    return new Promise<string>((resolve) => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      if (!ctx) {
        resolve(logoUrl);
        return;
      }
      
      canvas.width = 300;
      canvas.height = 300;
      
      // Cargar logo
      const logoImg = new Image();
      logoImg.onload = () => {
        // Dibujar logo centrado (tamaño original)
        const logoSize = 240;
        const logoX = (canvas.width - logoSize) / 2;
        const logoY = (canvas.height - logoSize) / 2;
        ctx.drawImage(logoImg, logoX, logoY, logoSize, logoSize);
        
        // Cargar icono de tipo
        const typeIconImg = new Image();
        typeIconImg.onload = () => {
          // Dibujar icono en esquina inferior derecha (más grande)
          const iconSize = 80;
          const iconX = canvas.width - iconSize - 15;
          const iconY = canvas.height - iconSize - 15;
          ctx.drawImage(typeIconImg, iconX, iconY, iconSize, iconSize);
          
          resolve(canvas.toDataURL());
        };
        typeIconImg.src = typeIconUrl;
      };
      logoImg.src = logoUrl;
    });
  };

  // Actualiza cuando cambian props
  useEffect(() => {
    const updateQR = async () => {
      const typeIconImage = createTypeIconImage(!logo);
      
      let finalImage = logo || typeIconImage;
      
      // Si hay logo y queremos mostrar el icono de tipo, crear imagen compuesta
      if (logo && showTypeIcon && typeIconImage) {
        try {
          finalImage = await createCompositeImage(logo, typeIconImage);
        } catch (error) {
          console.error('Error creating composite image:', error);
          finalImage = logo;
        }
      }
      
      qrCode.current.update({
        width: size,
        height: size,
        data: generateQRContent(),
        image: finalImage,
        dotsOptions: { color, type: "rounded" },
        backgroundOptions: { color: bgColor },
        imageOptions: { 
          crossOrigin: "anonymous", 
          margin: logo ? 10 : 5,
          hideBackgroundDots: logo ? true : false,
          imageSize: logo ? 0.5 : 0.25 // Logo más grande, icono sin logo más grande
        },
      });
    };
    
    updateQR();
  }, [data, color, bgColor, size, logo, qrType, wifiData, contactData, showTypeIcon]);

  // Monta el QR en el div
  useEffect(() => {
    if (qrRef.current) {
      qrRef.current.innerHTML = "";
      qrCode.current.append(qrRef.current);
    }
  }, []);

  // Control de scroll para el QR sticky
  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
      const windowHeight = window.innerHeight;
      const documentHeight = document.documentElement.scrollHeight;
      
      // Si estamos cerca del tope, permitir scroll normal
      if (scrollTop < 100) {
        setIsScrolling(false);
      } else if (scrollTop > documentHeight - windowHeight - 100) {
        // Si estamos cerca del final, también permitir scroll normal
        setIsScrolling(false);
      } else {
        setIsScrolling(true);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
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
    qrCode.current.download({ name: "qr-code", extension: downloadFormat });
  };

  // Limpiar logo
  const handleClearLogo = () => {
    setLogo(null);
  };

  // Obtener icono según el tipo de QR
  const getTypeIcon = () => {
    switch (qrType) {
      case 'url':
        return '🌐';
      case 'wifi':
        return '📶';
      case 'contact':
        return '👤';
      case 'text':
        return '📝';
      default:
        return '🌐';
    }
  };

  // Generar contenido QR según el tipo
  const generateQRContent = () => {
    switch (qrType) {
      case 'url':
        return data;
      case 'wifi':
        return `WIFI:T:${wifiData.encryption};S:${wifiData.ssid};P:${wifiData.password};;`;
      case 'contact':
        const vCard = [
          'BEGIN:VCARD',
          'VERSION:3.0',
          `FN:${contactData.name}`,
          `TEL:${contactData.phone}`,
          `EMAIL:${contactData.email}`,
          `ORG:${contactData.company}`,
          'END:VCARD'
        ].join('\n');
        return vCard;
      case 'text':
        return data;
      default:
        return data;
    }
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
            {/* Selector de tipo de QR */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Tipo de QR
              </label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={() => setQrType('url')}
                  className={`p-3 text-sm font-medium border rounded-lg transition-colors ${
                    qrType === 'url'
                      ? 'bg-blue-600 text-white border-blue-600 shadow-md'
                      : 'bg-gray-50 text-gray-700 border-gray-300 hover:bg-gray-100'
                  }`}
                >
                  🌐 URL
                </button>
                <button
                  onClick={() => setQrType('wifi')}
                  className={`p-3 text-sm font-medium border rounded-lg transition-colors ${
                    qrType === 'wifi'
                      ? 'bg-blue-600 text-white border-blue-600 shadow-md'
                      : 'bg-gray-50 text-gray-700 border-gray-300 hover:bg-gray-100'
                  }`}
                >
                  📶 WiFi
                </button>
                <button
                  onClick={() => setQrType('contact')}
                  className={`p-3 text-sm font-medium border rounded-lg transition-colors ${
                    qrType === 'contact'
                      ? 'bg-blue-600 text-white border-blue-600 shadow-md'
                      : 'bg-gray-50 text-gray-700 border-gray-300 hover:bg-gray-100'
                  }`}
                >
                  👤 Contacto
                </button>
                <button
                  onClick={() => setQrType('text')}
                  className={`p-3 text-sm font-medium border rounded-lg transition-colors ${
                    qrType === 'text'
                      ? 'bg-blue-600 text-white border-blue-600 shadow-md'
                      : 'bg-gray-50 text-gray-700 border-gray-300 hover:bg-gray-100'
                  }`}
                >
                  📝 Texto
                </button>
              </div>
            </div>

            {/* Campos específicos según el tipo */}
            {qrType === 'url' && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  URL
                </label>
                <input
                  type="url"
                  value={data}
                  onChange={(e) => setData(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                  placeholder="https://ejemplo.com"
                />
              </div>
            )}

            {qrType === 'wifi' && (
              <div className="space-y-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Nombre de la red (SSID)
                  </label>
                  <input
                    type="text"
                    value={wifiData.ssid}
                    onChange={(e) => setWifiData({...wifiData, ssid: e.target.value})}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                    placeholder="Mi WiFi"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Contraseña
                  </label>
                  <input
                    type="password"
                    value={wifiData.password}
                    onChange={(e) => setWifiData({...wifiData, password: e.target.value})}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                    placeholder="Contraseña WiFi"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Tipo de encriptación
                  </label>
                  <select
                    value={wifiData.encryption}
                    onChange={(e) => setWifiData({...wifiData, encryption: e.target.value})}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                  >
                    <option value="WPA">WPA/WPA2/WPA3</option>
                    <option value="WEP">WEP</option>
                    <option value="nopass">Sin contraseña</option>
                  </select>
                </div>
              </div>
            )}

            {qrType === 'contact' && (
              <div className="space-y-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Nombre
                  </label>
                  <input
                    type="text"
                    value={contactData.name}
                    onChange={(e) => setContactData({...contactData, name: e.target.value})}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                    placeholder="Juan Pérez"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Teléfono
                  </label>
                  <input
                    type="tel"
                    value={contactData.phone}
                    onChange={(e) => setContactData({...contactData, phone: e.target.value})}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                    placeholder="+34 123 456 789"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email
                  </label>
                  <input
                    type="email"
                    value={contactData.email}
                    onChange={(e) => setContactData({...contactData, email: e.target.value})}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                    placeholder="juan@ejemplo.com"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Empresa
                  </label>
                  <input
                    type="text"
                    value={contactData.company}
                    onChange={(e) => setContactData({...contactData, company: e.target.value})}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                    placeholder="Mi Empresa"
                  />
                </div>
              </div>
            )}

            {qrType === 'text' && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Texto
                </label>
                <textarea
                  value={data}
                  onChange={(e) => setData(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                  placeholder="Escribe cualquier texto aquí..."
                  rows={3}
                />
              </div>
            )}

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
                Tamaño
              </label>
              <div className="grid grid-cols-3 gap-2">
                <button
                  onClick={() => setSize(200)}
                  className={`p-3 text-sm font-medium border rounded-lg transition-colors ${
                    size === 200
                      ? 'bg-blue-600 text-white border-blue-600 shadow-md'
                      : 'bg-gray-50 text-gray-700 border-gray-300 hover:bg-gray-100'
                  }`}
                >
                  Pequeño
                  <div className="text-xs opacity-75">200px</div>
                </button>
                <button
                  onClick={() => setSize(300)}
                  className={`p-3 text-sm font-medium border rounded-lg transition-colors ${
                    size === 300
                      ? 'bg-blue-600 text-white border-blue-600 shadow-md'
                      : 'bg-gray-50 text-gray-700 border-gray-300 hover:bg-gray-100'
                  }`}
                >
                  Mediano
                  <div className="text-xs opacity-75">300px</div>
                </button>
                <button
                  onClick={() => setSize(400)}
                  className={`p-3 text-sm font-medium border rounded-lg transition-colors ${
                    size === 400
                      ? 'bg-blue-600 text-white border-blue-600 shadow-md'
                      : 'bg-gray-50 text-gray-700 border-gray-300 hover:bg-gray-100'
                  }`}
                >
                  Grande
                  <div className="text-xs opacity-75">400px</div>
                </button>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Logo (opcional)
              </label>
              <div className="flex gap-2">
                <input
                  type="file"
                  onChange={handleLogoUpload}
                  className="flex-1 text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-medium file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 file:cursor-pointer"
                />
                {logo && (
                  <button
                    onClick={handleClearLogo}
                    className="px-3 py-2 text-sm text-red-600 hover:text-red-800 transition-colors"
                  >
                    ✕
                  </button>
                                 )}
               </div>
               
                               {/* Selector de formato de descarga */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Formato de descarga
                  </label>
                  <div className="flex gap-2">
                    <button
                      onClick={() => setDownloadFormat('png')}
                      className={`flex-1 px-4 py-2 text-sm font-medium border rounded-lg transition-colors ${
                        downloadFormat === 'png'
                          ? 'bg-blue-600 text-white border-blue-600 shadow-md'
                          : 'bg-gray-50 text-gray-700 border-gray-300 hover:bg-gray-100'
                      }`}
                    >
                      PNG
                    </button>
                    <button
                      onClick={() => setDownloadFormat('svg')}
                      className={`flex-1 px-4 py-2 text-sm font-medium border rounded-lg transition-colors ${
                        downloadFormat === 'svg'
                          ? 'bg-blue-600 text-white border-blue-600 shadow-md'
                          : 'bg-gray-50 text-gray-700 border-gray-300 hover:bg-gray-100'
                      }`}
                    >
                      SVG
                    </button>
                  </div>
                </div>

                {/* Opción para mostrar/ocultar icono de tipo */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Mostrar icono de tipo
                  </label>
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      checked={showTypeIcon}
                      onChange={(e) => setShowTypeIcon(e.target.checked)}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    />
                    <span className="ml-2 text-sm text-gray-600">
                      {logo ? 'Icono en esquina inferior derecha' : 'Icono en el centro'}
                    </span>
                  </div>
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
          <div className={`bg-white p-8 rounded-xl shadow-lg border border-gray-100 transition-all duration-300 ${
            isScrolling ? 'lg:fixed lg:top-1/2 lg:right-8 lg:w-[calc(50%-2rem)] lg:-translate-y-1/2' : 'lg:sticky lg:top-4'
          }`}>
            <h2 className="text-xl font-semibold text-gray-800 mb-6 text-center">Vista Previa</h2>
            <div className="flex justify-center items-center min-h-[320px]">
              <div ref={qrRef} className="shadow-lg rounded-lg overflow-hidden"></div>
            </div>
          </div>
        </div>
    </div>
  );
}