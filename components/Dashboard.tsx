
import React from 'react';
import { View } from '../types';
import { Camera, QrCode, MessageSquare, Edit } from 'lucide-react';

interface DashboardProps {
  navigate: (view: View) => void;
}

interface ActionCardProps {
    icon: React.ReactNode;
    title: string;
    description: string;
    onClick: () => void;
}

const ActionCard: React.FC<ActionCardProps> = ({ icon, title, description, onClick }) => (
    <div 
      className="bg-gray-800 rounded-lg p-6 shadow-lg hover:shadow-cyan-500/50 hover:bg-gray-700 transition-all duration-300 cursor-pointer transform hover:-translate-y-1"
      onClick={onClick}
    >
      <div className="flex items-center space-x-4">
        <div className="bg-gray-900 p-3 rounded-full text-cyan-400">{icon}</div>
        <div>
          <h3 className="text-lg font-semibold text-white">{title}</h3>
          <p className="text-sm text-gray-400">{description}</p>
        </div>
      </div>
    </div>
);


const QuickActionButton: React.FC<{ title: string, duration: string, onClick: () => void }> = ({ title, duration, onClick }) => (
    <button
        onClick={onClick}
        className="flex-1 bg-cyan-600 hover:bg-cyan-500 text-white font-bold py-3 px-4 rounded-lg transition-all transform hover:scale-105"
    >
        {title} <span className="font-normal text-sm opacity-80">({duration})</span>
    </button>
);


const Dashboard: React.FC<DashboardProps> = ({ navigate }) => {
  return (
    <div className="space-y-8 max-w-4xl mx-auto">
      <div className="text-center">
        <h2 className="text-3xl font-bold text-white">Dobrodošli u RestaurantQR Pro</h2>
        <p className="text-gray-400 mt-2">Vaš partner za digitalizaciju ugostiteljstva.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <ActionCard 
          icon={<Camera size={24} />}
          title="Slikaj Meni"
          description="Pretvorite sliku menija u digitalni format."
          onClick={() => navigate('ocr')}
        />
        <ActionCard 
          icon={<QrCode size={24} />}
          title="Kreiraj QR Kod"
          description="Generirajte QR kodove za meni, Wi-Fi i više."
          onClick={() => navigate('qr')}
        />
        <ActionCard 
          icon={<MessageSquare size={24} />}
          title="AI Savjetnik"
          description="Dobijte personalizirane savjete za vaš objekt."
          onClick={() => navigate('chat')}
        />
        <ActionCard 
          icon={<Edit size={24} />}
          title="Ažuriraj Meni"
          description="Brzo uredite postojeći digitalni meni."
          onClick={() => navigate('ocr')} // or a dedicated menu editor view
        />
      </div>

      <div className="bg-gray-800 rounded-lg p-6 shadow-lg">
        <h3 className="text-lg font-semibold mb-4 text-center">Brze Akcije</h3>
        <div className="flex flex-col md:flex-row gap-4">
            <QuickActionButton title="Brzi Setup" duration="5 min" onClick={() => navigate('chat')} />
            <QuickActionButton title="Kompletno Rješenje" duration="15 min" onClick={() => navigate('chat')} />
        </div>
      </div>

    </div>
  );
};

export default Dashboard;
