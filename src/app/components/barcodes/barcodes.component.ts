import { Component, OnInit } from '@angular/core';
import { BarcodeService } from '../../services/barcode.service';
import { BarCodeDto, CreateBarCodeDto, GenerateBarCodeDto } from '../../models/barcode.models';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-barcodes',
  templateUrl: './barcodes.component.html',
  styleUrls: ['./barcodes.component.css']
})
export class BarcodesComponent implements OnInit {
  barcodes: BarCodeDto[] = [];
  showForm: boolean = false;
  editingBarcode: BarCodeDto | null = null;
  barcodeForm: CreateBarCodeDto = { barCode1: '' };
  generateForm: GenerateBarCodeDto = {};

  constructor(
    private barcodeService: BarcodeService,
    private authService: AuthService
  ) { }

  ngOnInit(): void {
    this.loadBarcodes();
  }

  loadBarcodes(): void {
    this.barcodeService.getBarCodes().subscribe({
      next: (data) => this.barcodes = data,
      error: (error) => console.error('Error loading barcodes:', error)
    });
  }

  isAdmin(): boolean {
    return this.authService.isAdmin();
  }

  isCashier(): boolean {
    return this.authService.isCashier();
  }

  showCreateForm(): void {
    this.showForm = true;
    this.editingBarcode = null;
    this.barcodeForm = { barCode1: '' };
  }

  showEditForm(barcode: BarCodeDto): void {
    this.showForm = true;
    this.editingBarcode = barcode;
    this.barcodeForm = { barCode1: barcode.barCode1 };
  }

  saveBarcode(): void {
    if (this.editingBarcode) {
      this.barcodeService.updateBarCode(this.editingBarcode.barCodeId, this.barcodeForm).subscribe({
        next: () => {
          this.loadBarcodes();
          this.resetForm();
        },
        error: (error) => console.error('Error updating barcode:', error)
      });
    } else {
      this.barcodeService.createBarCode(this.barcodeForm).subscribe({
        next: () => {
          this.loadBarcodes();
          this.resetForm();
        },
        error: (error) => console.error('Error creating barcode:', error)
      });
    }
  }

  generateBarcode(): void {
    this.barcodeService.generateBarCode(this.generateForm).subscribe({
      next: () => {
        this.loadBarcodes();
        this.generateForm = {};
      },
      error: (error) => console.error('Error generating barcode:', error)
    });
  }

  deleteBarcode(id: number): void {
    if (confirm('Are you sure you want to delete this barcode?')) {
      this.barcodeService.deleteBarCode(id).subscribe({
        next: () => this.loadBarcodes(),
        error: (error) => console.error('Error deleting barcode:', error)
      });
    }
  }

  resetForm(): void {
    this.showForm = false;
    this.editingBarcode = null;
    this.barcodeForm = { barCode1: '' };
  }
}

