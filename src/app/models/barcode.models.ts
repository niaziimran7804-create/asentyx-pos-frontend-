export interface BarCodeDto {
  barCodeId: number;
  barCode1: string;
}

export interface CreateBarCodeDto {
  barCode1: string;
}

export interface GenerateBarCodeDto {
  value?: string;
  productId?: number;
}

