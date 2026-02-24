import { Component, OnInit } from '@angular/core';
import { CategoryService } from '../../services/category.service';
import { 
  MainCategoryDto, SecondCategoryDto, ThirdCategoryDto, VendorDto, BrandDto,
  CreateMainCategoryDto, CreateSecondCategoryDto, CreateThirdCategoryDto,
  CreateVendorDto, CreateBrandDto
} from '../../models/category.models';
import { AuthService } from '../../services/auth.service';
import Swal from 'sweetalert2';

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

  // Sidebar and Navbar properties
  isSidebarCollapsed = false;
  sidebarWidth = '280px';
  currentUser: any;
  loading: boolean = false;
  menuItems: any[] = [
    { label: 'Dashboard', icon: 'fas fa-home', route: '/dashboard' },
    { label: 'Categories', icon: 'fas fa-th-large', route: '/categories' },
    { label: 'Products', icon: 'fas fa-box', route: '/products' },
    { label: 'Orders', icon: 'fas fa-shopping-cart', route: '/orders' },
    { label: 'Returns', icon: 'fas fa-undo', route: '/returns' },
    { label: 'Barcodes', icon: 'fas fa-barcode', route: '/barcodes' },
    { label: 'Invoices', icon: 'fas fa-file-invoice', route: '/invoices' },
    { label: 'Accounting', icon: 'fas fa-calculator', route: '/accounting' },
    { label: 'Customer Balance', icon: 'fas fa-users-cog', route: '/customer-balance' },
    { label: 'Expenses', icon: 'fas fa-wallet', route: '/expenses' },
    { label: 'Users', icon: 'fas fa-users', route: '/users' }
  ];

  constructor(
    private categoryService: CategoryService,
    private authService: AuthService
  ) { }

  ngOnInit(): void {
    this.loading = true;
    this.loadAllCategories();
    this.currentUser = {
      name: localStorage.getItem('userName') || 'User',
      role: localStorage.getItem('userRole') || 'cashier'
    };
  }

  onSidebarCollapse(collapsed: boolean): void {
    this.isSidebarCollapsed = collapsed;
    this.sidebarWidth = collapsed ? '80px' : '280px';
  }

  getUserRole(): string {
    return this.currentUser?.role || 'cashier';
  }

  loadAllCategories(): void {
    let completedCalls = 0;
    const totalCalls = 5;
    const checkComplete = () => {
      completedCalls++;
      if (completedCalls === totalCalls) this.loading = false;
    };
    
    this.categoryService.getMainCategories().subscribe({
      next: (data) => this.mainCategories = data,
      error: (error) => console.error('Error loading main categories:', error),
      complete: () => checkComplete()
    });
    this.categoryService.getSecondCategories().subscribe({
      next: (data) => this.secondCategories = data,
      error: (error) => console.error('Error loading second categories:', error),
      complete: () => checkComplete()
    });
    this.categoryService.getThirdCategories().subscribe({
      next: (data) => this.thirdCategories = data,
      error: (error) => console.error('Error loading third categories:', error),
      complete: () => checkComplete()
    });
    this.categoryService.getVendors().subscribe({
      next: (data) => this.vendors = data,
      error: (error) => console.error('Error loading vendors:', error),
      complete: () => checkComplete()
    });
    this.categoryService.getBrands().subscribe({
      next: (data) => this.brands = data,
      error: (error) => console.error('Error loading brands:', error),
      complete: () => checkComplete()
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
          Swal.fire({
            icon: 'success',
            title: 'Success!',
            text: 'Main category updated successfully',
            confirmButtonColor: '#667eea',
            timer: 2000
          });
          this.loadAllCategories();
          this.resetForm();
        },
        error: (error) => {
          Swal.fire({
            icon: 'error',
            title: 'Error Updating Category',
            text: 'Failed to update main category. Please try again.',
            confirmButtonColor: '#667eea'
          });
        }
      });
    } else {
      this.categoryService.createMainCategory(this.mainCategoryForm).subscribe({
        next: () => {
          Swal.fire({
            icon: 'success',
            title: 'Success!',
            text: 'Main category created successfully',
            confirmButtonColor: '#667eea',
            timer: 2000
          });
          this.loadAllCategories();
          this.resetForm();
        },
        error: (error) => {
          Swal.fire({
            icon: 'error',
            title: 'Error Creating Category',
            text: 'Failed to create main category. Please try again.',
            confirmButtonColor: '#667eea'
          });
        }
      });
    }
  }

  deleteMainCategory(id: number): void {
    Swal.fire({
      title: 'Are you sure?',
      text: 'You won\'t be able to revert this!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#667eea',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, delete it!'
    }).then((result) => {
      if (result.isConfirmed) {
        this.categoryService.deleteMainCategory(id).subscribe({
          next: () => {
            Swal.fire({
              icon: 'success',
              title: 'Deleted!',
              text: 'Main category has been deleted.',
              confirmButtonColor: '#667eea',
              timer: 2000
            });
            this.loadAllCategories();
          },
          error: (error) => {
            Swal.fire({
              icon: 'error',
              title: 'Error',
              text: 'Error deleting main category.',
              confirmButtonColor: '#667eea'
            });
          }
        });
      }
    });
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
          Swal.fire({
            icon: 'success',
            title: 'Success!',
            text: 'Second category updated successfully',
            confirmButtonColor: '#667eea',
            timer: 2000
          });
          this.loadAllCategories();
          this.resetForm();
        },
        error: (error) => {
          Swal.fire({
            icon: 'error',
            title: 'Error Updating Category',
            text: 'Failed to update second category. Please try again.',
            confirmButtonColor: '#667eea'
          });
        }
      });
    } else {
      this.categoryService.createSecondCategory(this.secondCategoryForm).subscribe({
        next: () => {
          Swal.fire({
            icon: 'success',
            title: 'Success!',
            text: 'Second category created successfully',
            confirmButtonColor: '#667eea',
            timer: 2000
          });
          this.loadAllCategories();
          this.resetForm();
        },
        error: (error) => {
          Swal.fire({
            icon: 'error',
            title: 'Error Creating Category',
            text: 'Failed to create second category. Please try again.',
            confirmButtonColor: '#667eea'
          });
        }
      });
    }
  }

  deleteSecondCategory(id: number): void {
    Swal.fire({
      title: 'Are you sure?',
      text: 'You won\'t be able to revert this!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#667eea',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, delete it!'
    }).then((result) => {
      if (result.isConfirmed) {
        this.categoryService.deleteSecondCategory(id).subscribe({
          next: () => {
            Swal.fire({
              icon: 'success',
              title: 'Deleted!',
              text: 'Second category has been deleted.',
              confirmButtonColor: '#667eea',
              timer: 2000
            });
            this.loadAllCategories();
          },
          error: (error) => {
            Swal.fire({
              icon: 'error',
              title: 'Error',
              text: 'Error deleting second category.',
              confirmButtonColor: '#667eea'
            });
          }
        });
      }
    });
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
          Swal.fire({
            icon: 'success',
            title: 'Success!',
            text: 'Third category updated successfully',
            confirmButtonColor: '#667eea',
            timer: 2000
          });
          this.loadAllCategories();
          this.resetForm();
        },
        error: (error) => {
          Swal.fire({
            icon: 'error',
            title: 'Error Updating Category',
            text: 'Failed to update third category. Please try again.',
            confirmButtonColor: '#667eea'
          });
        }
      });
    } else {
      this.categoryService.createThirdCategory(this.thirdCategoryForm).subscribe({
        next: () => {
          Swal.fire({
            icon: 'success',
            title: 'Success!',
            text: 'Third category created successfully',
            confirmButtonColor: '#667eea',
            timer: 2000
          });
          this.loadAllCategories();
          this.resetForm();
        },
        error: (error) => {
          Swal.fire({
            icon: 'error',
            title: 'Error Creating Category',
            text: 'Failed to create third category. Please try again.',
            confirmButtonColor: '#667eea'
          });
        }
      });
    }
  }

  deleteThirdCategory(id: number): void {
    Swal.fire({
      title: 'Are you sure?',
      text: 'You won\'t be able to revert this!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#667eea',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, delete it!'
    }).then((result) => {
      if (result.isConfirmed) {
        this.categoryService.deleteThirdCategory(id).subscribe({
          next: () => {
            Swal.fire({
              icon: 'success',
              title: 'Deleted!',
              text: 'Third category has been deleted.',
              confirmButtonColor: '#667eea',
              timer: 2000
            });
            this.loadAllCategories();
          },
          error: (error) => {
            Swal.fire({
              icon: 'error',
              title: 'Error',
              text: 'Error deleting third category.',
              confirmButtonColor: '#667eea'
            });
          }
        });
      }
    });
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
          Swal.fire({
            icon: 'success',
            title: 'Success!',
            text: 'Vendor updated successfully',
            confirmButtonColor: '#667eea',
            timer: 2000
          });
          this.loadAllCategories();
          this.resetForm();
        },
        error: (error) => {
          Swal.fire({
            icon: 'error',
            title: 'Error Updating Vendor',
            text: 'Failed to update vendor. Please try again.',
            confirmButtonColor: '#667eea'
          });
        }
      });
    } else {
      this.categoryService.createVendor(this.vendorForm).subscribe({
        next: () => {
          Swal.fire({
            icon: 'success',
            title: 'Success!',
            text: 'Vendor created successfully',
            confirmButtonColor: '#667eea',
            timer: 2000
          });
          this.loadAllCategories();
          this.resetForm();
        },
        error: (error) => {
          Swal.fire({
            icon: 'error',
            title: 'Error Creating Vendor',
            text: 'Failed to create vendor. Please try again.',
            confirmButtonColor: '#667eea'
          });
        }
      });
    }
  }

  deleteVendor(id: number): void {
    Swal.fire({
      title: 'Are you sure?',
      text: 'You won\'t be able to revert this!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#667eea',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, delete it!'
    }).then((result) => {
      if (result.isConfirmed) {
        this.categoryService.deleteVendor(id).subscribe({
          next: () => {
            Swal.fire({
              icon: 'success',
              title: 'Deleted!',
              text: 'Vendor has been deleted.',
              confirmButtonColor: '#667eea',
              timer: 2000
            });
            this.loadAllCategories();
          },
          error: (error) => {
            Swal.fire({
              icon: 'error',
              title: 'Error',
              text: 'Error deleting vendor.',
              confirmButtonColor: '#667eea'
            });
          }
        });
      }
    });
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
          Swal.fire({
            icon: 'success',
            title: 'Success!',
            text: 'Brand updated successfully',
            confirmButtonColor: '#667eea',
            timer: 2000
          });
          this.loadAllCategories();
          this.resetForm();
        },
        error: (error) => {
          Swal.fire({
            icon: 'error',
            title: 'Error Updating Brand',
            text: 'Failed to update brand. Please try again.',
            confirmButtonColor: '#667eea'
          });
        }
      });
    } else {
      this.categoryService.createBrand(this.brandForm).subscribe({
        next: () => {
          Swal.fire({
            icon: 'success',
            title: 'Success!',
            text: 'Brand created successfully',
            confirmButtonColor: '#667eea',
            timer: 2000
          });
          this.loadAllCategories();
          this.resetForm();
        },
        error: (error) => {
          Swal.fire({
            icon: 'error',
            title: 'Error Creating Brand',
            text: 'Failed to create brand. Please try again.',
            confirmButtonColor: '#667eea'
          });
        }
      });
    }
  }

  deleteBrand(id: number): void {
    Swal.fire({
      title: 'Are you sure?',
      text: 'You won\'t be able to revert this!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#667eea',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, delete it!'
    }).then((result) => {
      if (result.isConfirmed) {
        this.categoryService.deleteBrand(id).subscribe({
          next: () => {
            Swal.fire({
              icon: 'success',
              title: 'Deleted!',
              text: 'Brand has been deleted.',
              confirmButtonColor: '#667eea',
              timer: 2000
            });
            this.loadAllCategories();
          },
          error: (error) => {
            Swal.fire({
              icon: 'error',
              title: 'Error',
              text: 'Error deleting brand.',
              confirmButtonColor: '#667eea'
            });
          }
        });
      }
    });
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
