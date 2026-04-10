# 📚 Jams Boutique - Complete E-Commerce Platform

## 🛍️ Project Overview

**Jams Boutique** is a full-featured e-commerce platform designed for a local boutique business in Ethiopia. It provides a complete online shopping experience with modern UI, secure payments, admin dashboard, and advanced features like AI recommendations, order tracking, and coupon system.

### 🎯 Live Demo

- **Frontend:** https://jams-boutique-frontend.onrender.com
- **Backend API:** https://jams-boutique-api.onrender.com
- **Admin Panel:** https://jams-boutique-frontend.onrender.com/admin

### 📧 Test Credentials

#### Customer Account
```
Email: test@example.com
Password: password123
```

#### Admin Account
```
Email: admin@jamsboutique.com
Password: Admin@123
```

---

## ✨ Features

### 🛒 Customer Features
- **User Authentication**
  - Register/Login with email
  - Google OAuth Sign-in
  - Forgot password with email reset link
  - Profile management with avatar upload

- **Product Browsing**
  - Product listing with grid/list view
  - Advanced search with autocomplete
  - Category filtering
  - Price range filtering
  - Sort by price, rating, newest
  - Product details with image gallery
  - Size and color selection
  - Product ratings and reviews

- **Shopping Cart**
  - Add/remove items
  - Update quantities
  - Save for later (wishlist)
  - Move items between wishlist and cart
  - Cart persistence across sessions

- **Checkout & Payments**
  - Secure checkout process
  - Multiple payment methods:
    - Cash on Delivery
    - Chapa Payment (CBE Birr, Tele Birr, Amole)
  - Coupon/Discount system
  - Order summary with breakdown

- **Order Management**
  - View order history
  - Track order status in real-time
  - Cancel pending orders
  - Delete cancelled orders
  - Download invoices

- **User Dashboard**
  - Profile management
  - Address book
  - Order history
  - Wishlist management
  - Password change

### 👑 Admin Features

#### Dashboard Analytics
- Real-time statistics (orders, revenue, users)
- Sales charts and graphs
- Daily orders bar chart
- Monthly revenue line chart
- Category distribution pie chart
- Top selling products

#### Product Management
- CRUD operations for products
- Bulk product management
- Product image upload (Cloudinary)
- Size and color variants
- Stock management
- Featured products toggle
- Low stock alerts

#### Order Management
- View all customer orders
- Update order status
- Process refunds
- Order timeline tracking
- Search and filter orders
- Export orders data

#### User Management
- View all registered users
- User role management (customer/admin)
- Activate/deactivate accounts
- User search and filters

#### Coupon Management
- Create discount coupons
- Percentage or fixed amount discounts
- Usage limits per user
- Expiry dates
- Minimum order requirements
- Track coupon usage

### 🤖 AI & Smart Features
- **Personalized Recommendations** - Based on purchase history
- **Frequently Bought Together** - Product bundles
- **You May Also Like** - Similar products
- **Trending Products** - Based on sales
- **Search Autocomplete** - Real-time suggestions
- **Related Products** - Category and tag based

---

## 🛠️ Tech Stack

### Frontend
| Technology | Version | Purpose |
|------------|---------|---------|
| React | 18.2.0 | UI Framework |
| Vite | 5.4.0 | Build Tool |
| Tailwind CSS | 3.4.0 | Styling |
| React Router DOM | 6.20.0 | Routing |
| TanStack Query | 4.36.0 | Data Fetching |
| Zustand | 4.4.0 | State Management |
| React Hook Form | 7.48.0 | Form Handling |
| Zod | 3.22.0 | Validation |
| Framer Motion | 10.16.0 | Animations |
| Axios | 1.6.0 | API Client |

### Backend
| Technology | Version | Purpose |
|------------|---------|---------|
| Node.js | 20.x | Runtime |
| Express.js | 4.18.0 | Web Framework |
| MongoDB | 6.0 | Database |
| Mongoose | 7.3.0 | ODM |
| JWT | 9.0.0 | Authentication |
| Bcryptjs | 2.4.0 | Password Hashing |
| Cloudinary | 1.37.0 | Image Upload |
| Nodemailer | 6.9.0 | Email Service |
| Passport | 0.6.0 | OAuth |
| Passport-google-oauth20 | 2.0.0 | Google Login |

### DevOps & Tools
- **Git** - Version Control
- **GitHub** - Repository Hosting
- **Render** - Hosting (Backend & Frontend)
- **MongoDB Atlas** - Cloud Database
- **Cloudinary** - Image Storage

---

## 📁 Project Structure

```
FUTURE_FS_03/
├── client/                          # React Frontend
│   ├── src/
│   │   ├── components/
│   │   │   ├── admin/              # Admin Components
│   │   │   ├── auth/               # Authentication
│   │   │   ├── checkout/           # Checkout Components
│   │   │   ├── common/             # Reusable Components
│   │   │   ├── layout/             # Layout Components
│   │   │   ├── products/           # Product Components
│   │   │   └── recommendations/    # AI Recommendations
│   │   ├── pages/
│   │   │   ├── admin/              # Admin Pages
│   │   │   ├── HomePage.jsx
│   │   │   ├── ShopPage.jsx
│   │   │   ├── ProductPage.jsx
│   │   │   ├── CartPage.jsx
│   │   │   ├── CheckoutPage.jsx
│   │   │   ├── WishlistPage.jsx
│   │   │   ├── OrdersPage.jsx
│   │   │   ├── OrderDetailsPage.jsx
│   │   │   ├── OrderTrackingPage.jsx
│   │   │   ├── LoginPage.jsx
│   │   │   ├── RegisterPage.jsx
│   │   │   ├── ProfilePage.jsx
│   │   │   ├── ForgotPasswordPage.jsx
│   │   │   ├── ResetPasswordPage.jsx
│   │   │   ├── AuthCallback.jsx
│   │   │   ├── PaymentStatusPage.jsx
│   │   │   ├── AboutPage.jsx
│   │   │   └── ContactPage.jsx
│   │   ├── store/                 # Zustand Stores
│   │   ├── services/              # API Services
│   │   ├── context/               # React Context
│   │   ├── utils/                 # Utilities
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   └── index.css
│   ├── public/
│   ├── index.html
│   ├── package.json
│   ├── vite.config.js
│   └── tailwind.config.js
│
├── server/                         # Express Backend
│   ├── config/
│   ├── models/
│   ├── controllers/
│   ├── routes/
│   ├── middleware/
│   ├── services/
│   ├── utils/
│   ├── scripts/
│   ├── .env
│   ├── server.js
│   └── package.json
│
├── README.md
└── .gitignore
```

---

## 🚀 Installation & Setup

### Prerequisites
- Node.js (v18 or higher)
- MongoDB Atlas account
- Cloudinary account
- Google Cloud Console account
- Chapa account

### Step 1: Clone Repository

```bash
git clone https://github.com/ahmedseid9392/FUTURE_FS_03.git
cd FUTURE_FS_03
```

### Step 2: Backend Setup

```bash
cd server
npm install
```

Create `.env` file:

```env
# Server Configuration
PORT=5000
NODE_ENV=development
FRONTEND_URL=http://localhost:5173

# Database
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/jams_boutique

# JWT
JWT_SECRET=your_super_secret_jwt_key

# Cloudinary
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

# Google OAuth
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
GOOGLE_CALLBACK_URL=http://localhost:5000/api/auth/google/callback
SESSION_SECRET=your_session_secret

# Chapa Payment
CHAPA_SECRET_KEY=CHASECK_TEST-your_test_key
CHAPA_API_URL=https://api.chapa.co/v1
BACKEND_URL=http://localhost:5000

# Email (Optional)
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-app-password
SKIP_EMAIL=true
```

Run backend:

```bash
npm run dev
```

### Step 3: Frontend Setup

```bash
cd client
npm install
```

Create `.env`:

```env
VITE_API_URL=http://localhost:5000/api
VITE_GOOGLE_CLIENT_ID=your_google_client_id
```

Run frontend:

```bash
npm run dev
```

### Step 4: Seed Database

```bash
cd server
npm run create:admin
npm run seed:products
```

---

## 🚢 Deployment

### Backend Deployment (Render)

1. Push code to GitHub
2. Create new Web Service on Render
3. Connect GitHub repository
4. Set:
   - Build Command: `npm install`
   - Start Command: `npm start`
5. Add environment variables
6. Deploy

### Frontend Deployment (Render)

1. Create new Static Site on Render
2. Connect GitHub repository
3. Set:
   - Root Directory: `client`
   - Build Command: `npm install && npm run build`
   - Publish Directory: `dist`
4. Add environment variables
5. Add Redirect/Rewrite rule: `/*` → `/index.html`
6. Deploy

---

## 🔌 API Endpoints

### Authentication
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/register` | Register new user |
| POST | `/api/auth/login` | Login user |
| GET | `/api/auth/google` | Google OAuth login |
| GET | `/api/auth/profile` | Get user profile |
| POST | `/api/auth/forgot-password` | Request password reset |
| POST | `/api/auth/reset-password` | Reset password |

### Products
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/products` | Get all products |
| GET | `/api/products/featured` | Get featured products |
| GET | `/api/products/:id` | Get single product |
| POST | `/api/products` | Create product (admin) |
| PUT | `/api/products/:id` | Update product (admin) |
| DELETE | `/api/products/:id` | Delete product (admin) |
| POST | `/api/products/:id/reviews` | Add review |

### Orders
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/orders` | Create order |
| GET | `/api/orders/my-orders` | Get user orders |
| GET | `/api/orders/:id` | Get order details |
| PUT | `/api/orders/:id/cancel` | Cancel order |
| DELETE | `/api/orders/:id` | Delete order |

### Payments
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/payments/initiate` | Initiate Chapa payment |
| GET | `/api/payments/verify` | Verify payment |

### Coupons
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/coupons/validate` | Validate coupon |
| POST | `/api/coupons/apply` | Apply coupon |

---

## 🧪 Testing

### Chapa Payment Test (Sandbox)

**Test Card Details:**
```
Card Number: 4242 4242 4242 4242
Expiry: Any future date
CVV: Any 3 digits
```

**CBE Birr Test:**
```
Phone: 0911123456
Account: 1000134567890
OTP: 123456
```

---

## 📈 Performance Metrics

- **Lighthouse Score:** 95+
- **First Contentful Paint:** < 1.5s
- **Time to Interactive:** < 2.5s
- **API Response Time:** < 200ms

---

## 🤝 Contributing

1. Fork the repository
2. Create feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit changes (`git commit -m 'Add AmazingFeature'`)
4. Push to branch (`git push origin feature/AmazingFeature`)
5. Open Pull Request

---

## 📄 License

MIT License - feel free to use for learning and commercial purposes.

---

## 👨‍💻 Author

**Ahmed Seid**
- GitHub: [@ahmedseid9392](https://github.com/ahmedseid9392)
- Email: ahmedseidaa2025@gmail.com

---

## 🙏 Acknowledgments

- MongoDB Atlas for free cloud database
- Cloudinary for image management
- Chapa for Ethiopian payment gateway
- Google for OAuth authentication
- Render for free hosting

---

## 📞 Support

For support, email: ahmedseidaa2025@gmail.com

---

**⭐ If this project helped you, please give it a star on GitHub! ⭐**
