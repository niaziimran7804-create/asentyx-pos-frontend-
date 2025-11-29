import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { BranchService } from '../../services/branch.service';
import { AuthService } from '../../services/auth.service';
import { BranchDto } from '../../models/branch.models';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-branches',
  templateUrl: './branches.component.html',
  styleUrls: ['./branches.component.scss']
})
export class BranchesComponent implements OnInit {
  branches: BranchDto[] = [];
  filteredBranches: BranchDto[] = [];
  loading = true;
  searchTerm = '';
  currentUser: any;

  constructor(
    private branchService: BranchService,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.currentUser = this.authService.getCurrentUser();
    this.loadBranches();
  }

  loadBranches(): void {
    this.loading = true;
    
    // Get all branches (backend will filter based on user's role)
    this.branchService.getAllBranches().subscribe({
      next: (branches) => {
        this.branches = branches;
        this.filteredBranches = branches;
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading branches', error);
        this.loading = false;
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'Failed to load branches',
          confirmButtonColor: '#667eea'
        });
      }
    });
  }

  filterBranches(): void {
    const term = this.searchTerm.toLowerCase();
    this.filteredBranches = this.branches.filter(branch =>
      branch.branchName.toLowerCase().includes(term) ||
      branch.branchCode.toLowerCase().includes(term) ||
      branch.city?.toLowerCase().includes(term) ||
      branch.companyName.toLowerCase().includes(term)
    );
  }

  createBranch(): void {
    this.router.navigate(['/branches/new']);
  }

  editBranch(branchId: number): void {
    this.router.navigate(['/branches/edit', branchId]);
  }

  viewBranch(branchId: number): void {
    this.router.navigate(['/branches/view', branchId]);
  }

  deleteBranch(branch: BranchDto): void {
    if (branch.isHeadOffice) {
      Swal.fire({
        icon: 'warning',
        title: 'Cannot Delete',
        text: 'Head Office branches cannot be deleted',
        confirmButtonColor: '#667eea'
      });
      return;
    }

    Swal.fire({
      title: 'Deactivate Branch?',
      text: `Are you sure you want to deactivate "${branch.branchName}"?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#dc3545',
      cancelButtonColor: '#6c757d',
      confirmButtonText: 'Yes, deactivate it!'
    }).then((result) => {
      if (result.isConfirmed) {
        this.branchService.deleteBranch(branch.branchId).subscribe({
          next: () => {
            Swal.fire({
              icon: 'success',
              title: 'Deactivated!',
              text: 'Branch has been deactivated.',
              confirmButtonColor: '#667eea',
              timer: 2000
            });
            this.loadBranches();
          },
          error: (error) => {
            Swal.fire({
              icon: 'error',
              title: 'Error',
              text: error.error?.message || 'Failed to deactivate branch',
              confirmButtonColor: '#667eea'
            });
          }
        });
      }
    });
  }

  canManageBranches(): boolean {
    const role = this.currentUser?.role;
    return role === 'Admin' || role === 'CompanyAdmin';
  }
}
