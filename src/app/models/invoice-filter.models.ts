export interface InvoiceFilterDto {
  minAmount?: number;
  maxAmount?: number;
  startDate?: string | Date; // HTML date inputs return strings
  endDate?: string | Date; // HTML date inputs return strings
  customerAddress?: string;
  status?: string;
}

