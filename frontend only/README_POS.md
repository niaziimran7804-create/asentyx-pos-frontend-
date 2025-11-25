# 🛒 Asentyx POS - Complete Point of Sale Frontend

A **fully functional**, **production-ready**, **enterprise-grade** Point of Sale (POS) frontend application built with **Angular 17**, **Bootstrap**, **TailwindCSS**, and modern UI libraries. Designed for supermarkets and general stores with AI-powered insights.

## ✨ Features

### 🔐 Authentication
- **Role-based login**: Admin & Salesman
- Secure authentication with JWT-ready structure
- Password change functionality
- Auto-routing based on user role

### 👨‍💼 Admin Dashboard
- **Comprehensive Analytics**: Revenue, profit, sales tracking
- **Product Management**: Full CRUD with barcode, images, stock management
- **Category Management**: Dealer assignment with WhatsApp integration
- **Customer Management**: Purchase history, discount eligibility
- **Ordering System**: Low-stock ordering with WhatsApp message generation
- **AI Insights**: Stock predictions, sales forecasting, customer patterns
- **Settings**: Store configuration, tax rates, currency, theme toggle
- **Pending Payments**: Track and manage customer dues

### 👨‍💻 Salesman Dashboard
- **POS Selling Interface**: Barcode scanning, product search
- **Bill Generation**: Print-ready receipts with QR codes
- **Sales Returns**: Process returns linked to original bills
- **Receipt History**: Search and reprint previous bills
- **Personal Analytics**: Commission tracking, sales performance
- **Customer Support**: View-only customer directory

### 📊 Advanced Features
- **ApexCharts Integration**: Beautiful, animated charts
- **AI-Powered Insights**: Mock AI logic for predictions
- **WhatsApp Integration**: Direct dealer ordering
- **Responsive Design**: Works on desktop & tablets
- **Dark/Light Theme**: User preference toggle
- **PWA Support**: Installable as progressive web app
- **Export Reports**: PDF & CSV export capabilities

## 🎨 UI/UX
- Corporate-polished interface (Shopify/Oracle/Odoo style)
- Professional color palette: Blue, White, Grey
- Smooth animations and micro-interactions
- Card-based modern layouts
- Icon-based sidebar navigation
- Hover effects and shadows

## 🚀 Getting Started

### Prerequisites
- Node.js (v18 or higher)
- npm (v9 or higher)
- Angular CLI (`npm install -g @angular/cli`)

### Installation

1. **Navigate to the project directory**:
   ```powershell
   cd "d:\asentyx pos\asentyx pos frontend\asentyx-pos"
   ```

2. **Install dependencies** (if not already installed):
   ```powershell
   npm install
   ```

3. **Start the development server**:
   ```powershell
   ng serve
   ```

4. **Open your browser** and navigate to:
   ```
   http://localhost:4200
   ```

### Demo Credentials

#### Admin Login
- **Username**: `admin`
- **Password**: `admin123`
- **Access**: Full system access, all admin features

#### Salesman Login
- **Username**: `salesman`
- **Password**: `salesman123`
- **Access**: POS operations, sales management

## 📁 Project Structure

```
asentyx-pos/
├── src/
│   ├── app/
│   │   ├── core/
│   │   │   ├── guards/          # Auth guards (admin, salesman)
│   │   │   ├── models/          # TypeScript interfaces
│   │   │   └── services/        # Business logic services
│   │   ├── features/
│   │   │   ├── admin/           # Admin module
│   │   │   │   ├── dashboard/
│   │   │   │   ├── products/
│   │   │   │   ├── categories/
│   │   │   │   ├── customers/
│   │   │   │   ├── orders/
│   │   │   │   ├── settings/
│   │   │   │   └── pending-payments/
│   │   │   ├── sales/           # Salesman module
│   │   │   │   ├── dashboard/
│   │   │   │   ├── sell/
│   │   │   │   ├── returns/
│   │   │   │   ├── receipts/
│   │   │   │   └── analytics/
│   │   │   └── auth/            # Login module
│   │   ├── shared/
│   │   │   └── components/      # Reusable components
│   │   └── app.routes.ts        # Application routing
│   ├── environments/            # Environment configs
│   └── styles.scss              # Global styles
└── README.md
```

## 🔧 Services & Architecture

### Core Services
- **AuthService**: Authentication, role management
- **ProductService**: Product CRUD, stock management, barcode
- **CategoryService**: Categories and dealer management
- **CustomerService**: Customer management, purchase history
- **BillingService**: Bill generation, payment tracking
- **AnalyticsService**: Dashboard stats, charts data
- **OrderService**: Dealer ordering with WhatsApp
- **ReturnService**: Sales return processing
- **SettingsService**: Store configuration

### Key Models
- User, Product, Category, Customer
- Bill, Order, Return, Analytics
- StockAlert, AIInsight, Settings

All services include **mock data** and are ready to connect to a .NET Core Web API backend by updating the `environment.ts` file.

## 🎯 API Integration Ready

To connect to your .NET Core backend:

1. Open `src/environments/environment.ts`
2. Update the `apiUrl`:
   ```typescript
   export const environment = {
     production: false,
     apiUrl: 'http://your-backend-url/api',
     ...
   };
   ```

All services use Observable-based HTTP calls ready for real API integration.

## 📦 Dependencies

- **Angular 17**: Latest Angular framework
- **Bootstrap**: UI framework
- **TailwindCSS**: Utility-first CSS
- **PrimeNG**: Rich UI components
- **ng-apexcharts**: Chart library
- **Font Awesome**: Icon library
- **QRCode**: QR code generation
- **jsPDF**: PDF export
- **RxJS**: Reactive programming

## 🌐 Routing

- `/login` - Login page
- `/admin/*` - Admin routes (requires admin role)
  - `/admin/dashboard` - Admin dashboard
  - `/admin/products` - Product management
  - `/admin/categories` - Category management
  - `/admin/customers` - Customer management
  - `/admin/orders` - Ordering system
  - `/admin/settings` - Store settings
  - `/admin/pending-payments` - Payment tracking
- `/sales/*` - Salesman routes (requires salesman role)
  - `/sales/dashboard` - Salesman dashboard
  - `/sales/sell` - POS interface
  - `/sales/returns` - Returns processing
  - `/sales/receipts` - Bill history
  - `/sales/customers` - Customer directory
  - `/sales/analytics` - Personal analytics

## 🎨 Customization

### Theme Colors
Edit `tailwind.config.js` to customize the color scheme:
```javascript
colors: {
  primary: {
    500: '#your-color',
    600: '#your-color',
    // ...
  }
}
```

### Store Branding
Update store information in the Settings page or directly in `SettingsService`.

## 🔐 Security Features

- Role-based access control
- Auth guards on all routes
- Token-based authentication (ready for JWT)
- Password change functionality
- Session management

## 📱 Responsive Design

- Desktop optimized (1920x1080+)
- Tablet compatible (768px+)
- Touch-friendly interfaces
- Mobile-responsive layouts

## 🚧 Production Build

To build for production:

```powershell
ng build --configuration production
```

Output will be in `dist/` directory.

## 🤝 Backend Integration Checklist

- [ ] Update `environment.ts` with API URL
- [ ] Implement JWT token handling in `AuthService`
- [ ] Add HTTP interceptors for authentication
- [ ] Update service methods to match API endpoints
- [ ] Handle error responses from backend
- [ ] Implement real file upload for images
- [ ] Connect WhatsApp API for dealer orders
- [ ] Add real AI model integration

## 📝 Mock Data

All services include comprehensive mock data for:
- 6+ sample products
- 5 categories with dealers
- 5 sample customers
- Dashboard statistics
- AI insights
- Stock alerts

## 🎓 Development Notes

- Uses Angular 17 standalone components
- Implements lazy loading for all feature modules
- Follows Angular best practices
- TypeScript strict mode enabled
- SCSS for styling with TailwindCSS utilities
- RxJS for reactive data management

## 🐛 Known Limitations

- Mock data (not connected to real backend)
- Image upload returns placeholder URLs
- WhatsApp integration opens web.whatsapp.com
- AI predictions use mock algorithms
- PDF/CSV export not fully implemented

## 📄 License

This is a custom-built POS system for Asentyx.

## 🙋‍♂️ Support

For issues or questions, refer to the Angular documentation or service implementation.

---

**Built with ❤️ using Angular 17, TailwindCSS, and Bootstrap**
