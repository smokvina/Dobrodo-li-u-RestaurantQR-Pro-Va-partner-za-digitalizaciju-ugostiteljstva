
import React, { useState, useCallback } from 'react';
import { View } from './types';
import Dashboard from './components/Dashboard';
import OcrScanner from './components/OcrScanner';
import QrGenerator from './components/QrGenerator';
import AiAdvisor from './components/AiAdvisor';
import { BarChart2, Settings, ArrowLeft } from 'lucide-react';

const App: React.FC = () => {
  const [view, setView] = useState<View>('dashboard');

  const navigate = useCallback((newView: View) => {
    setView(newView);
  }, []);

  const renderView = () => {
    switch (view) {
      case 'ocr':
        return <OcrScanner />;
      case 'qr':
        return <QrGenerator />;
      case 'chat':
        return <AiAdvisor />;
      case 'analytics':
        return <div className="text-center p-8"><h2 className="text-2xl">Analitika (Uskoro)</h2></div>;
      case 'settings':
         return <div className="text-center p-8"><h2 className="text-2xl">Postavke (Uskoro)</h2></div>;
      case 'dashboard':
      default:
        return <Dashboard navigate={navigate} />;
    }
  };
  
  const getTitle = () => {
    switch (view) {
      case 'ocr': return "Skeniraj Meni";
      case 'qr': return "Kreiraj QR Kod";
      case 'chat': return "AI Savjetnik";
      case 'analytics': return "Analitika";
      case 'settings': return "Postavke";
      default: return "RestaurantQR Pro";
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100 font-sans flex flex-col">
      <header className="bg-gray-800 shadow-lg sticky top-0 z-10 p-4 flex items-center justify-between">
        <div className="flex items-center space-x-4">
          {view !== 'dashboard' && (
            <button onClick={() => navigate('dashboard')} className="p-2 rounded-full hover:bg-gray-700 transition-colors">
              <ArrowLeft size={24} />
            </button>
          )}
          <h1 className="text-xl font-bold text-white">{getTitle()}</h1>
        </div>
        <div className="flex items-center space-x-2">
            <button onClick={() => navigate('analytics')} className="p-2 rounded-full hover:bg-gray-700 transition-colors"><BarChart2 size={20}/></button>
            <button onClick={() => navigate('settings')} className="p-2 rounded-full hover:bg-gray-700 transition-colors"><Settings size={20}/></button>
        </div>
      </header>

      <main className="flex-grow p-4 md:p-6">
        {renderView()}
      </main>
    </div>
  );
};

export default App;
