# E-Commerce Platform - Next.js & Firebase

A modern e-commerce web application built with Next.js 16, Firebase Authentication, and Firestore Database.

## 🚀 Tech Stack

- **Frontend Framework:** Next.js 16 (App Router)
- **Authentication:** Firebase Authentication
- **Database:** Cloud Firestore
- **Styling:** Tailwind CSS
- **State Management:** React Context API
- **Language:** TypeScript

## 📁 Project Structure

```
ecommerce-nextjs/
├── src/
│   ├── app/
│   │   ├── (auth)/
│   │   │   ├── login/
│   │   │   │   └── page.tsx
│   │   │   └── register/
│   │   │       └── page.tsx
│   │   ├── (shop)/
│   │   │   ├── products/
│   │   │   │   ├── page.tsx
│   │   │   │   └── [id]/
│   │   │   │       └── page.tsx
│   │   │   ├── cart/
│   │   │   │   └── page.tsx
│   │   │   └── checkout/
│   │   │       └── page.tsx
│   │   ├── profile/
│   │   │   └── page.tsx
│   │   ├── orders/
│   │   │   └── page.tsx
│   │   ├── layout.tsx
│   │   └── page.tsx
│   ├── components/
│   │   ├── layout/
│   │   │   ├── Header.tsx
│   │   │   ├── Footer.tsx
│   │   │   └── Navbar.tsx
│   │   ├── products/
│   │   │   ├── ProductCard.tsx
│   │   │   ├── ProductGrid.tsx
│   │   │   ├── ProductDetail.tsx
│   │   │   └── ProductFilter.tsx
│   │   ├── cart/
│   │   │   ├── CartItem.tsx
│   │   │   ├── CartSummary.tsx
│   │   │   └── CartDrawer.tsx
│   │   ├── auth/
│   │   │   ├── LoginForm.tsx
│   │   │   ├── RegisterForm.tsx
│   │   │   └── ProtectedRoute.tsx
│   │   └── ui/
│   │       ├── Button.tsx
│   │       ├── Input.tsx
│   │       ├── Modal.tsx
│   │       └── Loading.tsx
│   ├── contexts/
│   │   ├── AuthContext.tsx
│   │   └── CartContext.tsx
│   ├── lib/
│   │   ├── firebase/
│   │   │   ├── config.ts
│   │   │   ├── auth.ts
│   │   │   └── firestore.ts
│   │   └── utils/
│   │       ├── formatters.ts
│   │       └── validators.ts
│   ├── types/
│   │   ├── product.ts
│   │   ├── user.ts
│   │   ├── cart.ts
│   │   └── order.ts
│   └── hooks/
│       ├── useAuth.ts
│       ├── useCart.ts
│       └── useProducts.ts
├── public/
│   ├── images/
│   └── icons/
├── .env.local
├── .gitignore
├── next.config.js
├── package.json
├── tailwind.config.ts
└── tsconfig.json
```

## 🔥 Firebase Configuration

### Firestore Collections Structure

```
users/
├── {userId}/
│   ├── email: string
│   ├── displayName: string
│   ├── photoURL: string
│   ├── createdAt: timestamp
│   └── updatedAt: timestamp

products/
├── {productId}/
│   ├── name: string
│   ├── description: string
│   ├── price: number
│   ├── category: string
│   ├── imageUrl: string
│   ├── stock: number
│   ├── createdAt: timestamp
│   └── featured: boolean

orders/
├── {orderId}/
│   ├── userId: string
│   ├── items: array
│   ├── totalAmount: number
│   ├── status: string
│   ├── shippingAddress: object
│   ├── createdAt: timestamp
│   └── updatedAt: timestamp

cart/
├── {userId}/
│   └── items: array
│       ├── productId: string
│       ├── quantity: number
│       └── price: number
```

## 🛠️ Installation & Setup

### Prerequisites

- Node.js 18+ and npm
- Firebase account
- Git

### Steps

1. **Clone the repository**

```bash
git clone https://github.com/Remy2404/aditi-frontend.git
cd aditi-frontend
```

2. **Install dependencies**

```bash
npm install
```

3. **Set up Firebase**

	- Create a new Firebase project at [Firebase Console](https://console.firebase.google.com)
	- Enable Authentication (Email/Password)
	- Create a Firestore Database
	- Copy your Firebase configuration

4. **Environment Variables**

Create a `.env.local` file in the root directory:

```env
NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_auth_domain
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_storage_bucket
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
```

5. **Run the development server**

```bash
npm run dev
```

Visit `http://localhost:3000` to see your application.

## 👥 Team Workflow

### Team Members & Responsibilities

**Member 1 - Authentication & User Management**

- Firebase Authentication integration
- Login/Register components
- User profile management
- Protected routes implementation

**Member 2 - Product Management**

- Product listing and details pages
- Product filtering and search
- Firestore product queries
- Product components

**Member 3 - Cart & Checkout**

- Cart functionality
- Cart context and state management
- Checkout process
- Order creation in Firestore

**Member 4 - UI/UX & Layout**

- Layout components (Header, Footer, Navbar)
- Reusable UI components
- Tailwind CSS styling
- Responsive design

### Git Workflow

```bash
# Create feature branch
git checkout -b feature/your-feature-name

# After completing work
git add .
git commit -m "feat: description of your changes"
git push origin feature/your-feature-name

# Create Pull Request for review
```

### Branch Naming Convention

- `feature/` - New features
- `fix/` - Bug fixes
- `refactor/` - Code refactoring
- `docs/` - Documentation updates

## 📦 Key Features

- User authentication (Sign up, Login, Logout)
- Product browsing and filtering
- Product detail pages
- Shopping cart management
- Checkout process
- Order history
- User profile management
- Responsive design

## 🧪 Development Guidelines

### Code Style

- Use TypeScript for type safety
- Follow React/Next.js best practices
- Use functional components with hooks
- Keep components small and reusable
- Write meaningful commit messages

### Component Guidelines

- One component per file
- Use proper TypeScript interfaces
- Implement error boundaries
- Add loading states
- Handle edge cases

## 📚 Useful Resources

- [Next.js Documentation](https://nextjs.org/docs)
- [Firebase Documentation](https://firebase.google.com/docs)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [React Context API](https://react.dev/reference/react/useContext)

## 📄 License

MIT License - feel free to use this project for learning and development.

---
memeber is 3 member include struture folder and impoved  (See <attachments> above for file contents. You may not need to search or read the file again.)
