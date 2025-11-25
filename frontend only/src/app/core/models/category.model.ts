export interface Category {
  id: string;
  name: string;
  description: string;
  dealerId?: string;
  dealerName?: string;
  dealerWhatsApp?: string;
  productCount?: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface Dealer {
  id: string;
  name: string;
  whatsApp: string;
  email?: string;
  categories: string[];
  createdAt: Date;
}
