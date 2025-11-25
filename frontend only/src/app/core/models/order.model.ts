export interface Order {
  id: string;
  productId: string;
  productName: string;
  categoryId: string;
  categoryName: string;
  currentStock: number;
  desiredQuantity: number;
  dealerId: string;
  dealerName: string;
  dealerWhatsApp: string;
  status: 'PENDING' | 'SENT' | 'RECEIVED' | 'CANCELLED';
  notes?: string;
  createdAt: Date;
  sentAt?: Date;
  receivedAt?: Date;
}

export interface OrderCreateRequest {
  productId: string;
  desiredQuantity: number;
  dealerId: string;
  notes?: string;
}

export interface WhatsAppMessage {
  dealerNumber: string;
  message: string;
}
