# Vajra Retails - Admin Dashboard & E-commerce Platform

## 🚀 Project Overview
**Vajra Retails** is a modern, responsive E-commerce application featuring a comprehensive **Admin Dashboard** for business management. The platform allows users to browse products and manage account details, while administrators have access to powerful analytics, inventory management, and order tracking tools.

The project focuses on a **Premium UI/UX**, utilizing glassmorphism effects, smooth animations, and a dark-mode-inspired admin interface.

---

## 🛠️ Technology Stack

### **Frontend Framework**
- **React.js (v18)**: Component-based UI library for building interactive interfaces.
- **Vite**: Next-generation frontend tooling for blazing fast build speeds.

### **Styling & UI**
- **Tailwind CSS (v3)**: Utility-first CSS framework for rapid UI development.
- **Bootstrap 5**: Used for grid layouts and responsive containers.
- **Lucide React**: Modern, consistent icon library used throughout the application.
- **Inter Font**: Professional, clean typography from Google Fonts.

### **State Management & Data**
- **React Context API**: For global state management (AuthContext, DataContext, FilterContext).
- **Firebase (v10)**:
  - **Authentication**: secure email/password and Google login.
  - **Firestore**: Real-time NoSQL database for user data and future scalability.
- **MyJSON / JSON Server**: Mock backend for real-time simulation of large datasets (Products, Orders, Returns).

### **Analytics & Visualization**
- **Recharts**: Composable charting library for building beautiful, responsive charts (Bar, Line, Area, Pie).
- **Date-fns**: Lightweight library for modern date formatting and manipulation.

---

## ✨ Key Features

### **Admin Dashboard**
- **Overview Analytics**: Real-time KPI cards for Revenue, Profit, Cost, and Returns.
- **Sales Analytics**: Dynamic charts visualizing Revenue Trends, Top Products, and Category performance.
- **Inventory Management**: Track stock levels, active vs. inactive products.
- **Order Management**: Filterable tables for processing orders and returns.
- **Global Filtering**: Filter all analytics data by Date Range, Category, Brand, and Department.

### **User Platform** (Public Facing)
- **Responsive Navbar**: Mobile-friendly navigation with smooth toggles.
- **Authentication**: Secure Login and Signup pages with modern animations and validation.
- **Product Catalog**: Browse available products (Placeholder).

---

## 🚀 Getting Started

### **Prerequisites**
- **Node.js** (v16+)
- **npm** (v8+)

### **Installation**

1.  **Clone the Repository**
    ```bash
    git clone https://github.com/bhuvan120/newretail.git
    cd newretail
    ```

2.  **Install Dependencies**
    ```bash
    npm install
    ```

3.  **Configure Environment**
    Create a `.env` file in the root directory and add your Firebase credentials:
    ```env
    VITE_FIREBASE_API_KEY=your_api_key
    VITE_FIREBASE_AUTH_DOMAIN=your_auth_domain
    VITE_FIREBASE_PROJECT_ID=your_project_id
    VITE_FIREBASE_STORAGE_BUCKET=your_storage_bucket
    VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
    VITE_FIREBASE_APP_ID=your_app_id
    ```

4.  **Run Development Server**
    ```bash
    npm run dev
    ```
    Access the application at `http://localhost:5173`.

---

## 📂 Project Structure

```bash
src/
├── components/         # Reusable UI components (Sidebar, Navbar, Cards)
├── context/            # Global state (Auth, Data, Filters)
├── pages/              # Route pages (Overview, Analytics, Login, Signup)
├── utils/              # Helper functions (Calculations, Formatters)
└── assets/             # Static assets (Images, Icons)
```

---

## 👥 Contributors
- **Karanaam Bhuvanesh** - Lead Developer

---

_Built with ❤️ using React & Tailwind_
