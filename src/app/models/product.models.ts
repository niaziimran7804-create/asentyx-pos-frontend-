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
}

