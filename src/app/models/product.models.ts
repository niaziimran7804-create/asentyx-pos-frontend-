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
  stockThreshold?: number;
  productImage?: string;
  productImageBase64?: string;
}

export interface UpdateProductDto {
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
  productImage?: string;
}

