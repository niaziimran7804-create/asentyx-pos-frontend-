import { Component, OnInit } from '@angular/core';
import { CategoryService } from '../../services/category.service';
import { 
  MainCategoryDto, SecondCategoryDto, ThirdCategoryDto, VendorDto, BrandDto,
  CreateMainCategoryDto, CreateSecondCategoryDto, CreateThirdCategoryDto,
  CreateVendorDto, CreateBrandDto
} from '../../models/category.models';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-categories',
  templateUrl: './categories.component.html',
  styleUrls: ['./categories.component.css']
})
export class CategoriesComponent implements OnInit {
  mainCategories: MainCategoryDto[] = [];
  secondCategories: SecondCategoryDto[] = [];
  thirdCategories: ThirdCategoryDto[] = [];
  vendors: VendorDto[] = [];
  brands: BrandDto[] = [];
  activeTab: string = 'main';
  
  // Form states
  showForm: boolean = false;
  editingItem: any = null;
  formType: string = '';

  // Forms
  mainCategoryForm: CreateMainCategoryDto = { mainCategoryName: '', mainCategoryDescription: '' };
  secondCategoryForm: CreateSecondCategoryDto = { mainCategoryId: 0, secondCategoryName: '', secondCategoryDescription: '' };
  thirdCategoryForm: CreateThirdCategoryDto = { secondCategoryId: 0, thirdCategoryName: '', thirdCategoryDescription: '' };
  vendorForm: CreateVendorDto = { vendorName: '', thirdCategoryId: 0, vendorStatus: 'YES' };
  brandForm: CreateBrandDto = { brandName: '', vendorId: 0, brandStatus: 'YES' };

  constructor(
    private categoryService: CategoryService,
    private authService: AuthService
  ) { }

  ngOnInit(): void {
    this.loadAllCategories();
  }

  loadAllCategories(): void {
    this.categoryService.getMainCategories().subscribe({
      next: (data) => this.mainCategories = data,
      error: (error) => console.error('Error loading main categories:', error)
    });
    this.categoryService.getSecondCategories().subscribe({
      next: (data) => this.secondCategories = data,
      error: (error) => console.error('Error loading second categories:', error)
    });
    this.categoryService.getThirdCategories().subscribe({
      next: (data) => this.thirdCategories = data,
      error: (error) => console.error('Error loading third categories:', error)
    });
    this.categoryService.getVendors().subscribe({
      next: (data) => this.vendors = data,
      error: (error) => console.error('Error loading vendors:', error)
    });
    this.categoryService.getBrands().subscribe({
      next: (data) => this.brands = data,
      error: (error) => console.error('Error loading brands:', error)
    });
  }

  setActiveTab(tab: string): void {
    this.activeTab = tab;
    this.showForm = false;
    this.editingItem = null;
  }

  isAdmin(): boolean {
    return this.authService.isAdmin();
  }

  // Main Category CRUD
  showMainCategoryForm(item?: MainCategoryDto): void {
    this.formType = 'main';
    this.showForm = true;
    if (item) {
      this.editingItem = item;
      this.mainCategoryForm = {
        mainCategoryName: item.mainCategoryName,
        mainCategoryDescription: item.mainCategoryDescription || ''
      };
    } else {
      this.editingItem = null;
      this.mainCategoryForm = { mainCategoryName: '', mainCategoryDescription: '' };
    }
  }

  saveMainCategory(): void {
    if (this.editingItem) {
      this.categoryService.updateMainCategory(this.editingItem.mainCategoryId, this.mainCategoryForm).subscribe({
        next: () => {
          this.loadAllCategories();
          this.resetForm();
        },
        error: (error) => console.error('Error updating main category:', error)
      });
    } else {
      this.categoryService.createMainCategory(this.mainCategoryForm).subscribe({
        next: () => {
          this.loadAllCategories();
          this.resetForm();
        },
        error: (error) => console.error('Error creating main category:', error)
      });
    }
  }

  deleteMainCategory(id: number): void {
    if (confirm('Are you sure you want to delete this main category?')) {
      this.categoryService.deleteMainCategory(id).subscribe({
        next: () => this.loadAllCategories(),
        error: (error) => console.error('Error deleting main category:', error)
      });
    }
  }

  // Second Category CRUD
  showSecondCategoryForm(item?: SecondCategoryDto): void {
    this.formType = 'second';
    this.showForm = true;
    if (item) {
      this.editingItem = item;
      this.secondCategoryForm = {
        mainCategoryId: item.mainCategoryId,
        secondCategoryName: item.secondCategoryName,
        secondCategoryDescription: item.secondCategoryDescription || ''
      };
    } else {
      this.editingItem = null;
      this.secondCategoryForm = { mainCategoryId: 0, secondCategoryName: '', secondCategoryDescription: '' };
    }
  }

  saveSecondCategory(): void {
    if (this.editingItem) {
      this.categoryService.updateSecondCategory(this.editingItem.secondCategoryId, this.secondCategoryForm).subscribe({
        next: () => {
          this.loadAllCategories();
          this.resetForm();
        },
        error: (error) => console.error('Error updating second category:', error)
      });
    } else {
      this.categoryService.createSecondCategory(this.secondCategoryForm).subscribe({
        next: () => {
          this.loadAllCategories();
          this.resetForm();
        },
        error: (error) => console.error('Error creating second category:', error)
      });
    }
  }

  deleteSecondCategory(id: number): void {
    if (confirm('Are you sure you want to delete this second category?')) {
      this.categoryService.deleteSecondCategory(id).subscribe({
        next: () => this.loadAllCategories(),
        error: (error) => console.error('Error deleting second category:', error)
      });
    }
  }

  // Third Category CRUD
  showThirdCategoryForm(item?: ThirdCategoryDto): void {
    this.formType = 'third';
    this.showForm = true;
    if (item) {
      this.editingItem = item;
      this.thirdCategoryForm = {
        secondCategoryId: item.secondCategoryId,
        thirdCategoryName: item.thirdCategoryName,
        thirdCategoryDescription: item.thirdCategoryDescription || ''
      };
    } else {
      this.editingItem = null;
      this.thirdCategoryForm = { secondCategoryId: 0, thirdCategoryName: '', thirdCategoryDescription: '' };
    }
  }

  saveThirdCategory(): void {
    if (this.editingItem) {
      this.categoryService.updateThirdCategory(this.editingItem.thirdCategoryId, this.thirdCategoryForm).subscribe({
        next: () => {
          this.loadAllCategories();
          this.resetForm();
        },
        error: (error) => console.error('Error updating third category:', error)
      });
    } else {
      this.categoryService.createThirdCategory(this.thirdCategoryForm).subscribe({
        next: () => {
          this.loadAllCategories();
          this.resetForm();
        },
        error: (error) => console.error('Error creating third category:', error)
      });
    }
  }

  deleteThirdCategory(id: number): void {
    if (confirm('Are you sure you want to delete this third category?')) {
      this.categoryService.deleteThirdCategory(id).subscribe({
        next: () => this.loadAllCategories(),
        error: (error) => console.error('Error deleting third category:', error)
      });
    }
  }

  // Vendor CRUD
  showVendorForm(item?: VendorDto): void {
    this.formType = 'vendor';
    this.showForm = true;
    if (item) {
      this.editingItem = item;
      this.vendorForm = {
        vendorTag: item.vendorTag,
        vendorName: item.vendorName,
        thirdCategoryId: item.thirdCategoryId,
        vendorDescription: item.vendorDescription,
        vendorStatus: item.vendorStatus
      };
    } else {
      this.editingItem = null;
      this.vendorForm = { vendorName: '', thirdCategoryId: 0, vendorStatus: 'YES' };
    }
  }

  saveVendor(): void {
    if (this.editingItem) {
      this.categoryService.updateVendor(this.editingItem.vendorId, this.vendorForm).subscribe({
        next: () => {
          this.loadAllCategories();
          this.resetForm();
        },
        error: (error) => console.error('Error updating vendor:', error)
      });
    } else {
      this.categoryService.createVendor(this.vendorForm).subscribe({
        next: () => {
          this.loadAllCategories();
          this.resetForm();
        },
        error: (error) => console.error('Error creating vendor:', error)
      });
    }
  }

  deleteVendor(id: number): void {
    if (confirm('Are you sure you want to delete this vendor?')) {
      this.categoryService.deleteVendor(id).subscribe({
        next: () => this.loadAllCategories(),
        error: (error) => console.error('Error deleting vendor:', error)
      });
    }
  }

  // Brand CRUD
  showBrandForm(item?: BrandDto): void {
    this.formType = 'brand';
    this.showForm = true;
    if (item) {
      this.editingItem = item;
      this.brandForm = {
        brandTag: item.brandTag,
        brandName: item.brandName,
        vendorId: item.vendorId,
        brandDescription: item.brandDescription,
        brandStatus: item.brandStatus
      };
    } else {
      this.editingItem = null;
      this.brandForm = { brandName: '', vendorId: 0, brandStatus: 'YES' };
    }
  }

  saveBrand(): void {
    if (this.editingItem) {
      this.categoryService.updateBrand(this.editingItem.brandId, this.brandForm).subscribe({
        next: () => {
          this.loadAllCategories();
          this.resetForm();
        },
        error: (error) => console.error('Error updating brand:', error)
      });
    } else {
      this.categoryService.createBrand(this.brandForm).subscribe({
        next: () => {
          this.loadAllCategories();
          this.resetForm();
        },
        error: (error) => console.error('Error creating brand:', error)
      });
    }
  }

  deleteBrand(id: number): void {
    if (confirm('Are you sure you want to delete this brand?')) {
      this.categoryService.deleteBrand(id).subscribe({
        next: () => this.loadAllCategories(),
        error: (error) => console.error('Error deleting brand:', error)
      });
    }
  }

  resetForm(): void {
    this.showForm = false;
    this.editingItem = null;
    this.formType = '';
    this.mainCategoryForm = { mainCategoryName: '', mainCategoryDescription: '' };
    this.secondCategoryForm = { mainCategoryId: 0, secondCategoryName: '', secondCategoryDescription: '' };
    this.thirdCategoryForm = { secondCategoryId: 0, thirdCategoryName: '', thirdCategoryDescription: '' };
    this.vendorForm = { vendorName: '', thirdCategoryId: 0, vendorStatus: 'YES' };
    this.brandForm = { brandName: '', vendorId: 0, brandStatus: 'YES' };
  }
}
