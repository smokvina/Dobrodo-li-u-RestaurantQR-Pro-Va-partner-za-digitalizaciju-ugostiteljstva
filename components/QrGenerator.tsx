
import React, { useState, useRef, useCallback } from 'react';
import { QRCodeCanvas } from 'qrcode.react';
import { QrCodeType } from '../types';
import { Wifi, User, Link, AtSign, Star, CreditCard, MessageCircle, Download, Paintbrush } from 'lucide-react';

const QrGenerator: React.FC = () => {
  const [type, setType] = useState<QrCodeType>('menu');
  const [value, setValue] = useState<string>('https://example.com/menu');
  const [wifiSsid, setWifiSsid] = useState('');
  const [wifiPass, setWifiPass] = useState('');
  const [fgColor, setFgColor] = useState('#ffffff');
  const [bgColor, setBgColor] = useState('#111827');
  
  const qrRef = useRef<HTMLDivElement>(null);

  const getQrValue = () => {
    switch(type) {
      case 'wifi':
        return `WIFI:T:WPA;S:${wifiSsid};P:${wifiPass};;`;
      case 'menu':
      case 'social':
      case 'review':
      case 'payment':
      case 'reservation':
      default:
        return value;
    }
  };
  
  const downloadQR = useCallback(() => {
    if (qrRef.current) {
        const canvas = qrRef.current.querySelector('canvas');
        if (canvas) {
            const pngUrl = canvas.toDataURL("image/png").replace("image/png", "image/octet-stream");
            let downloadLink = document.createElement("a");
            downloadLink.href = pngUrl;
            downloadLink.download = `restaurant-qr-${type}.png`;
            document.body.appendChild(downloadLink);
            downloadLink.click();
            document.body.removeChild(downloadLink);
        }
    }
  }, [type]);

  const renderInputs = () => {
    switch(type) {
      case 'wifi':
        return (
          <div className="space-y-4">
            <input type="text" placeholder="Naziv Wi-Fi mreže (SSID)" value={wifiSsid} onChange={(e) => setWifiSsid(e.target.value)} className="w-full bg-gray-700 p-3 rounded-lg" />
            <input type="password" placeholder="Lozinka" value={wifiPass} onChange={(e) => setWifiPass(e.target.value)} className="w-full bg-gray-700 p-3 rounded-lg" />
          </div>
        );
      default:
        return <input type="text" placeholder="URL ili tekst" value={value} onChange={(e) => setValue(e.target.value)} className="w-full bg-gray-700 p-3 rounded-lg" />;
    }
  };

  const typeOptions = [
    { id: 'menu', name: 'Digitalni Meni', icon: <Link size={20} /> },
    { id: 'wifi', name: 'Wi-Fi Pristup', icon: <Wifi size={20} /> },
    { id: 'review', name: 'Google Recenzije', icon: <Star size={20} /> },
    { id: 'payment', name: 'Plaćanje', icon: <CreditCard size={20} /> },
    { id: 'reservation', name: 'Rezervacije', icon: <MessageCircle size={20} /> },
    { id: 'contact', name: 'Kontakt', icon: <User size={20} /> },
  ];

  return (
    <div className="flex flex-col md:flex-row gap-8 max-w-6xl mx-auto">
      <div className="w-full md:w-1/2 lg:w-2/3 space-y-6">
        <div className="bg-gray-800 p-6 rounded-lg">
          <h3 className="text-xl font-semibold mb-4">1. Odaberite vrstu QR koda</h3>
          <div className="grid grid-cols-2 lg:grid-cols-3 gap-3">
            {typeOptions.map(opt => (
              <button 
                key={opt.id}
                onClick={() => setType(opt.id as QrCodeType)}
                className={`flex items-center space-x-2 p-3 rounded-lg transition-colors ${type === opt.id ? 'bg-cyan-600 text-white' : 'bg-gray-700 hover:bg-gray-600'}`}
              >
                {opt.icon}<span>{opt.name}</span>
              </button>
            ))}
          </div>
        </div>
        <div className="bg-gray-800 p-6 rounded-lg">
          <h3 className="text-xl font-semibold mb-4">2. Unesite podatke</h3>
          {renderInputs()}
        </div>
        <div className="bg-gray-800 p-6 rounded-lg">
          <h3 className="text-xl font-semibold mb-4 flex items-center gap-2"><Paintbrush size={20} /> 3. Prilagodite dizajn</h3>
          <div className="flex gap-4">
            <div className="flex-1">
              <label className="block text-sm mb-1 text-gray-400">Boja koda</label>
              <input type="color" value={fgColor} onChange={(e) => setFgColor(e.target.value)} className="w-full h-10 p-1 bg-gray-700 rounded-lg cursor-pointer" />
            </div>
            <div className="flex-1">
              <label className="block text-sm mb-1 text-gray-400">Boja pozadine</label>
              <input type="color" value={bgColor} onChange={(e) => setBgColor(e.target.value)} className="w-full h-10 p-1 bg-gray-700 rounded-lg cursor-pointer" />
            </div>
          </div>
        </div>
      </div>
      <div className="w-full md:w-1/2 lg:w-1/3 space-y-6">
        <div className="bg-gray-800 p-6 rounded-lg text-center sticky top-24">
          <h3 className="text-xl font-semibold mb-4">Vaš QR Kod</h3>
          <div ref={qrRef} className="p-4 bg-white rounded-lg inline-block">
             <QRCodeCanvas
                value={getQrValue()}
                size={256}
                bgColor={bgColor}
                fgColor={fgColor}
                level={"H"}
                includeMargin={true}
              />
          </div>
          <button onClick={downloadQR} className="w-full mt-6 bg-cyan-600 hover:bg-cyan-500 text-white font-bold py-3 px-4 rounded-lg flex items-center justify-center space-x-2">
            <Download size={20} /><span>Preuzmi PNG</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default QrGenerator;
