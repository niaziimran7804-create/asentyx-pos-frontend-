export interface MainCategoryDto {
  mainCategoryId: number;
  mainCategoryName: string;
  mainCategoryDescription?: string;
}

export interface SecondCategoryDto {
  secondCategoryId: number;
  mainCategoryId: number;
  secondCategoryName: string;
  secondCategoryDescription?: string;
  mainCategoryName?: string;
}

export interface ThirdCategoryDto {
  thirdCategoryId: number;
  secondCategoryId: number;
  thirdCategoryName: string;
  thirdCategoryDescription?: string;
  secondCategoryName?: string;
}

export interface VendorDto {
  vendorId: number;
  vendorTag?: string;
  vendorName: string;
  thirdCategoryId: number;
  vendorDescription?: string;
  vendorStatus: string;
  registerDate: Date;
  thirdCategoryName?: string;
}

export interface BrandDto {
  brandId: number;
  brandTag?: string;
  brandName: string;
  vendorId: number;
  brandDescription?: string;
  brandStatus: string;
  vendorName?: string;
}

// Create DTOs
export interface CreateMainCategoryDto {
  mainCategoryName: string;
  mainCategoryDescription?: string;
}

export interface CreateSecondCategoryDto {
  mainCategoryId: number;
  secondCategoryName: string;
  secondCategoryDescription?: string;
}

export interface CreateThirdCategoryDto {
  secondCategoryId: number;
  thirdCategoryName: string;
  thirdCategoryDescription?: string;
}

export interface CreateVendorDto {
  vendorTag?: string;
  vendorName: string;
  thirdCategoryId: number;
  vendorDescription?: string;
  vendorStatus?: string;
}

export interface CreateBrandDto {
  brandTag?: string;
  brandName: string;
  vendorId: number;
  brandDescription?: string;
  brandStatus?: string;
}

