export interface ProductDto {
  productId: number;
  productIdTag?: string;
  productName: string;
  brandId: number;
  productDescription?: string;
  productQuantityPerUnit: number;
  productPerUnitPrice: number;
  productMSRP: number;
  productStatus: string;
  productDiscountRate: number;
  productSize: number;
  productColor?: string;
  productWeight: number;
  productUnitStock: number;
  brandName?: string;
  productImage?: string;
  productImageBase64?: string;
}

export interface CreateProductDto {
  productIdTag?: string;
  productName: string;
  brandId: number;  // lowercase to match backend DTO
  productDescription?: string;
  productQuantityPerUnit: number;
  productPerUnitPrice: number;
  productMSRP: number;
  productStatus: string;
  productDiscountRate: number;
  productColor?: number;  // number to match backend
  productUnitStock: number;
  stockThreshold?: number;
  productImageBase64?: string | null;
}

export interface UpdateProductDto {
  productName: string;
  brandId: number;  // lowercase to match backend DTO
  productDescription?: string;
  productQuantityPerUnit: number;
  productPerUnitPrice: number;
  productMSRP: number;
  productStatus: string;
  productDiscountRate: number;
  productColor?: number;  // number to match backend
  productUnitStock: number;
  stockThreshold?: number;
  productImageBase64?: string | null;
}

