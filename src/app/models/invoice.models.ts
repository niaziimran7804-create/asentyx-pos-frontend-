import { OrderDto } from './order.models';

export interface InvoiceDto {
  invoiceId: number;
  orderId: number;
  invoiceNumber: string;
  invoiceDate: Date;
  dueDate: Date;
  status: string;
  order: OrderDto;
  shopConfig: ShopConfigurationDto;
}

export interface CreateInvoiceDto {
  orderId: number;
  dueDate?: Date;
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

