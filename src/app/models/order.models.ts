export interface OrderDto {
  orderId: number;
  userId: number;
  barCodeId?: number;
  date: Date;
  orderQuantity: number;
  productId: number;
  productMSRP: number;
  status: string;
  totalAmount: number;
  orderStatus: string;
  paymentMethod: string;
  productName?: string;
  userName?: string;
  customerFullName?: string;
  customerPhone?: string;
  customerAddress?: string;
  customerEmail?: string;
  invoiceId?: number;
  items?: OrderItemDto[];  // Added for multi-product support
}

export interface OrderItemDto {
  orderItemId?: number;
  productId: number;
  productName?: string;
  quantity: number;
  unitPrice: number;
  totalPrice?: number;
}

export interface CreateOrderDto {
  userId: number;
  barCodeId?: number;
  orderQuantity: number;
  productId: number;
  productMSRP: number;
  paymentMethod: string;
  customerFullName?: string;
  customerPhone?: string;
  customerAddress?: string;
  customerEmail?: string;
  items: OrderItemDto[];
}

export interface UpdateOrderStatusDto {
  status: string; // "Paid", "Pending", or "Cancelled"
  orderStatus: string; // "Paid", "Pending", or "Cancelled"
}

export interface CustomerSearchDto {
  customerFullName: string;
  customerPhone?: string;
  customerEmail?: string;
  customerAddress?: string;
  orderCount: number;
  lastOrderDate?: Date;
}

export interface BulkUpdateOrderStatusDto {
  orderIds: number[];
  status: string; // "Paid", "Pending", or "Cancelled"
  orderStatus: string; // "Paid", "Pending", or "Cancelled"
}

