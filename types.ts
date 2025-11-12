
export type View = 'dashboard' | 'ocr' | 'qr' | 'chat' | 'analytics' | 'settings';

export type MenuCategory = 'Predjela' | 'Glavna jela' | 'Deserti' | 'Pića';

export interface MenuItem {
  id: string;
  category: MenuCategory;
  name: string;
  description: string;
  price: number;
  currency: 'kn' | '€';
  isVegetarian: boolean;
  allergens: string[];
}

export interface ChatMessage {
  id: string;
  sender: 'user' | 'ai';
  text: string;
}

export type QrCodeType = 'menu' | 'wifi' | 'contact' | 'social' | 'review' | 'payment' | 'reservation';
