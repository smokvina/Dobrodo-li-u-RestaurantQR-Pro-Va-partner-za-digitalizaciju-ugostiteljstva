
import React, { useState, useCallback } from 'react';
import { MenuItem } from '../types';
import { extractMenuFromImage } from '../services/geminiService';
import { Upload, FileText, Edit3, Save, Trash2, PlusCircle, AlertTriangle } from 'lucide-react';

type OcrStep = 'upload' | 'analyzing' | 'review' | 'error';

const OcrScanner: React.FC = () => {
  const [step, setStep] = useState<OcrStep>('upload');
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [editingItemId, setEditingItemId] = useState<string | null>(null);

  const handleFileUpload = useCallback(async (files: FileList | null) => {
    if (!files || files.length === 0) return;
    setStep('analyzing');
    
    // For simplicity, we process the first file. Multi-image would require a more complex UI.
    const file = files[0];
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = async () => {
      try {
        const base64Image = (reader.result as string).split(',')[1];
        const extractedItems = await extractMenuFromImage(base64Image, file.type);
        const itemsWithIds = extractedItems.map(item => ({...item, id: crypto.randomUUID()}));
        setMenuItems(itemsWithIds);
        setStep('review');
      } catch (error) {
        setErrorMessage(error instanceof Error ? error.message : "Došlo je do nepoznate greške.");
        setStep('error');
      }
    };
    reader.onerror = () => {
        setErrorMessage("Greška pri čitanju datoteke.");
        setStep('error');
    };
  }, []);

  const handleItemChange = (id: string, field: keyof MenuItem, value: any) => {
    setMenuItems(prev => prev.map(item => item.id === id ? {...item, [field]: value} : item));
  };
  
  const renderUploadStep = () => (
    <div className="text-center max-w-lg mx-auto p-8 border-2 border-dashed border-gray-600 rounded-lg">
        <label htmlFor="menu-upload" className="cursor-pointer">
            <Upload className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-lg font-medium text-white">Upload fotografija menija</h3>
            <p className="mt-1 text-sm text-gray-500">Povucite i ispustite datoteke ili kliknite za odabir.</p>
            <input id="menu-upload" type="file" className="sr-only" accept="image/*" onChange={(e) => handleFileUpload(e.target.files)} />
        </label>
        <p className="mt-6 text-xs text-gray-400">Podržava: JPG, PNG, WEBP. Za najbolje rezultate, koristite slike visoke kvalitete.</p>
    </div>
  );

  const renderAnalyzingStep = () => (
    <div className="text-center p-8">
        <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-cyan-400 mx-auto"></div>
        <h3 className="mt-4 text-xl font-semibold">Analiziram vaš meni...</h3>
        <p className="text-gray-400">Ovo može potrajati nekoliko trenutaka.</p>
        <div className="mt-6 w-full bg-gray-700 rounded-full h-2.5">
            <div className="bg-cyan-500 h-2.5 rounded-full animate-pulse w-3/4"></div>
        </div>
    </div>
  );

  const renderReviewStep = () => (
    <div className="space-y-6">
        <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold">Pregled i Uređivanje Menija</h2>
            <button className="bg-cyan-600 hover:bg-cyan-500 text-white font-bold py-2 px-4 rounded-lg flex items-center space-x-2">
                <Save size={18} /><span>Spremi Meni</span>
            </button>
        </div>
        <div className="space-y-4">
            {menuItems.map(item => (
                <div key={item.id} className="bg-gray-800 p-4 rounded-lg">
                    {editingItemId === item.id ? (
                        <div className="space-y-2">
                            <input value={item.name} onChange={(e) => handleItemChange(item.id, 'name', e.target.value)} className="w-full bg-gray-700 p-2 rounded" />
                            <textarea value={item.description} onChange={(e) => handleItemChange(item.id, 'description', e.target.value)} className="w-full bg-gray-700 p-2 rounded" />
                            <div className="flex gap-2">
                                <input type="number" value={item.price} onChange={(e) => handleItemChange(item.id, 'price', parseFloat(e.target.value))} className="w-1/2 bg-gray-700 p-2 rounded" />
                                <select value={item.currency} onChange={(e) => handleItemChange(item.id, 'currency', e.target.value)} className="w-1/2 bg-gray-700 p-2 rounded">
                                    <option value="€">€</option>
                                    <option value="kn">kn</option>
                                </select>
                            </div>
                            <button onClick={() => setEditingItemId(null)} className="bg-green-600 p-2 rounded">Spremi</button>
                        </div>
                    ) : (
                        <div>
                            <div className="flex justify-between items-start">
                               <div>
                                    <h4 className="font-bold text-lg">{item.name} - {item.price}{item.currency}</h4>
                                    <p className="text-sm text-gray-400">{item.description}</p>
                                    <p className="text-xs text-gray-500 mt-1">Kategorija: {item.category}</p>
                               </div>
                               <div className="flex space-x-2">
                                <button onClick={() => setEditingItemId(item.id)} className="p-2 hover:bg-gray-700 rounded"><Edit3 size={16}/></button>
                                <button className="p-2 hover:bg-gray-700 rounded text-red-500"><Trash2 size={16}/></button>
                               </div>
                            </div>
                        </div>
                    )}
                </div>
            ))}
        </div>
        <button className="w-full bg-gray-700 hover:bg-gray-600 text-white font-bold py-3 px-4 rounded-lg flex items-center justify-center space-x-2">
            <PlusCircle size={20} /><span>Dodaj novu stavku</span>
        </button>
    </div>
  );
  
  const renderErrorStep = () => (
    <div className="text-center p-8 bg-red-900/20 border border-red-500 rounded-lg max-w-lg mx-auto">
        <AlertTriangle className="mx-auto h-12 w-12 text-red-500" />
        <h3 className="mt-2 text-lg font-medium text-white">Došlo je do greške</h3>
        <p className="mt-1 text-sm text-red-300">{errorMessage}</p>
        <button onClick={() => setStep('upload')} className="mt-6 bg-cyan-600 hover:bg-cyan-500 text-white font-bold py-2 px-4 rounded-lg">Pokušaj ponovno</button>
    </div>
  );

  switch (step) {
    case 'upload': return renderUploadStep();
    case 'analyzing': return renderAnalyzingStep();
    case 'review': return renderReviewStep();
    case 'error': return renderErrorStep();
    default: return renderUploadStep();
  }
};

export default OcrScanner;
