import { Component, OnInit } from '@angular/core';
import { UserService } from '../../services/user.service';
import { UserDto, CreateUserDto, UpdateUserDto } from '../../models/user.models';

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
      error: (error) => console.error('Error loading users:', error)
    });
  }

  createUser(): void {
    this.userService.createUser(this.userForm).subscribe({
      next: () => {
        this.loadUsers();
        this.resetForm();
      },
      error: (error) => console.error('Error creating user:', error)
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
          this.loadUsers();
          this.resetForm();
        },
        error: (error) => console.error('Error updating user:', error)
      });
    }
  }

  deleteUser(id: number): void {
    if (confirm('Are you sure you want to delete this user?')) {
      this.userService.deleteUser(id).subscribe({
        next: () => this.loadUsers(),
        error: (error) => console.error('Error deleting user:', error)
      });
    }
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

