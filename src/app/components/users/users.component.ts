import { Component, OnInit } from '@angular/core';
import { UserService } from '../../services/user.service';
import { UserDto, CreateUserDto, UpdateUserDto } from '../../models/user.models';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.css']
})
export class UsersComponent implements OnInit {
  users: UserDto[] = [];
  showForm: boolean = false;
  editingUser: UserDto | null = null;
  userForm: CreateUserDto = {
    userId: '',
    firstName: '',
    lastName: '',
    password: '',
    role: 'Salesman',
    age: 0,
    salary: 0,
    birthdate: new Date()
  };

  // Sidebar and Navbar properties
  isSidebarCollapsed = false;
  sidebarWidth = '280px';
  currentUser: any;
  menuItems: any[] = [
    { label: 'Dashboard', icon: 'fas fa-home', route: '/dashboard' },
    { label: 'Products', icon: 'fas fa-box', route: '/products' },
    { label: 'Orders', icon: 'fas fa-shopping-cart', route: '/orders' },
    { label: 'Categories', icon: 'fas fa-th-large', route: '/categories' },
    { label: 'Barcodes', icon: 'fas fa-barcode', route: '/barcodes' },
    { label: 'Invoices', icon: 'fas fa-file-invoice', route: '/invoices' },
    { label: 'Expenses', icon: 'fas fa-wallet', route: '/expenses' },
    { label: 'Users', icon: 'fas fa-users', route: '/users' }
  ];

  constructor(private userService: UserService) { }

  ngOnInit(): void {
    this.loadUsers();
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

  loadUsers(): void {
    this.userService.getAllUsers().subscribe({
      next: (data) => this.users = data,
      error: (error) => {
        Swal.fire({
          icon: 'error',
          title: 'Error Loading Users',
          text: 'Failed to load users. Please try again.',
          confirmButtonColor: '#667eea'
        });
      }
    });
  }

  createUser(): void {
    this.userService.createUser(this.userForm).subscribe({
      next: () => {
        Swal.fire({
          icon: 'success',
          title: 'Success!',
          text: 'User created successfully',
          confirmButtonColor: '#667eea',
          timer: 2000
        });
        this.loadUsers();
        this.resetForm();
      },
      error: (error) => {
        Swal.fire({
          icon: 'error',
          title: 'Error Creating User',
          text: 'Failed to create user. Please try again.',
          confirmButtonColor: '#667eea'
        });
      }
    });
  }

  editUser(user: UserDto): void {
    this.editingUser = user;
    this.userForm = {
      userId: user.userId,
      firstName: user.firstName,
      lastName: user.lastName,
      password: '',
      role: user.role,
      age: user.age,
      salary: user.salary,
      birthdate: new Date(user.birthdate)
    };
    this.showForm = true;
  }

  updateUser(): void {
    if (this.editingUser) {
      const updateDto: UpdateUserDto = {
        firstName: this.userForm.firstName,
        lastName: this.userForm.lastName,
        role: this.userForm.role,
        age: this.userForm.age,
        salary: this.userForm.salary,
        birthdate: this.userForm.birthdate
      };
      this.userService.updateUser(this.editingUser.id, updateDto).subscribe({
        next: () => {
          Swal.fire({
            icon: 'success',
            title: 'Success!',
            text: 'User updated successfully',
            confirmButtonColor: '#667eea',
            timer: 2000
          });
          this.loadUsers();
          this.resetForm();
        },
        error: (error) => {
          Swal.fire({
            icon: 'error',
            title: 'Error Updating User',
            text: 'Failed to update user. Please try again.',
            confirmButtonColor: '#667eea'
          });
        }
      });
    }
  }

  deleteUser(id: number): void {
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
        this.userService.deleteUser(id).subscribe({
          next: () => {
            Swal.fire({
              icon: 'success',
              title: 'Deleted!',
              text: 'User has been deleted.',
              confirmButtonColor: '#667eea',
              timer: 2000
            });
            this.loadUsers();
          },
          error: (error) => {
            Swal.fire({
              icon: 'error',
              title: 'Error Deleting User',
              text: 'Failed to delete user. Please try again.',
              confirmButtonColor: '#667eea'
            });
          }
        });
      }
    });
  }

  resetForm(): void {
    this.showForm = false;
    this.editingUser = null;
    this.userForm = {
      userId: '',
      firstName: '',
      lastName: '',
      password: '',
      role: 'Salesman',
      age: 0,
      salary: 0,
      birthdate: new Date()
    };
  }
}

