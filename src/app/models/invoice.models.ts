import { OrderDto } from './order.models';

export interface InvoiceDto {
  invoiceId: number;
  orderId: number;
  invoiceNumber: string;
  invoiceDate: Date;
  dueDate: Date;
  status: string;
  totalAmount: number;
  paidAmount: number;
  remainingAmount: number;
  order: OrderDto;
  shopConfig: ShopConfigurationDto;
  payments?: PaymentDto[];
}

export interface CreateInvoiceDto {
  orderId: number;
  dueDate?: Date;
}

export interface PaymentDto {
  paymentId: number;
  invoiceId: number;
  paymentAmount: number;
  paymentDate: Date;
  paymentMethod: string; // "Cash", "Card", "Online", "Check"
  referenceNumber?: string;
  notes?: string;
  createdBy?: string;
  createdAt: Date;
}

export interface CreatePaymentDto {
  invoiceId: number;
  paymentAmount: number;
  paymentMethod: string; // "Cash", "Card", "Online", "Check"
  referenceNumber?: string;
  notes?: string;
}

export interface PaymentSummaryDto {
  totalInvoices: number;
  fullyPaidInvoices: number;
  partiallyPaidInvoices: number;
  unpaidInvoices: number;
  overdueInvoices: number;
  totalOutstanding: number;
  totalCollected: number;
}

export interface InvoiceItemDto {
  productId: number;
  productName: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
}

export interface ShopConfigurationDto {
  id?: number;
  shopName: string;
  shopAddress?: string;
  shopPhone?: string;
  shopEmail?: string;
  shopWebsite?: string;
  taxId?: string;
  footerMessage?: string;
  headerMessage?: string;
  logoBase64?: string;
}

export interface UpdateShopConfigurationDto {
  shopName: string;
  shopAddress?: string;
  shopPhone?: string;
  shopEmail?: string;
  shopWebsite?: string;
  taxId?: string;
  footerMessage?: string;
  headerMessage?: string;
  logoBase64?: string;
}

