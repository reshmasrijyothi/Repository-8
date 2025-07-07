# 🐾 Pet Adoption Center - Vite Edition

A complete pet adoption and care center web application built with the MERN stack and Vite.

## 🚀 Quick Start

### Project Structure
```
pet-adoption-vite/
├── backend/          # Express.js API server
│   ├── server.js     # Main server file
│   └── .env         # Environment variables
├── frontend/         # React + Vite frontend
│   ├── src/         # Source files
│   └── .env         # Frontend environment
└── README.md        # This file
```

### 🏃‍♀️ Running the Application

1. **Backend (Port 5000)**
   ```bash
   cd backend
   npm start
   ```

2. **Frontend (Port 5173)**
   ```bash
   cd frontend
   npm run dev
   ```

### 🌐 Access the Application

- **Frontend**: http://localhost:5173
- **Backend API**: http://localhost:5000/api/health

### 🔐 Demo Accounts

- **Admin**: `admin@petcenter.com` / `admin123`
- **User**: `user@petcenter.com` / `user123`

## ✨ Features

### 🏠 Frontend (React + Vite)
- **Home Page**: Hero section with featured pets
- **Pet Browsing**: Filter by species, size, gender with search
- **Services**: Pet care services with booking system
- **Authentication**: Login/Register with JWT tokens
- **Responsive Design**: Mobile-first approach

### 🔧 Backend (Express.js)
- **In-Memory Database**: JSON-based for quick demo
- **JWT Authentication**: Secure token-based auth
- **RESTful API**: Clean API endpoints
- **CORS Enabled**: Cross-origin requests supported

### 📊 Sample Data
- **2 Demo Users** (1 admin, 1 regular user)
- **3 Sample Pets** (Buddy the Golden Retriever, Luna the Maine Coon, Charlie the Lab Mix)
- **3 Services** (Grooming, Veterinary, Training)

## 🛠️ API Endpoints

### Authentication
- `POST /api/auth/login` - User login
- `POST /api/auth/register` - User registration
- `GET /api/auth/me` - Get current user (protected)

### Pets
- `GET /api/pets` - Get all pets (with filters)
- `GET /api/pets/featured` - Get featured pets
- `GET /api/pets/:id` - Get single pet

### Services
- `GET /api/services` - Get all services
- `GET /api/services/featured` - Get featured services

### Health
- `GET /api/health` - API status check

## 🔧 Technologies

- **Frontend**: React 18, Vite, React Router, Axios
- **Backend**: Express.js, JWT, bcryptjs
- **Database**: In-memory JSON (for demo)
- **Styling**: CSS-in-JS with responsive design

## 📱 Responsive Design

The application is fully responsive with:
- Mobile-first design approach
- Flexible grid layouts
- Touch-friendly interface
- Optimized images and content

## 🎯 Next Steps

To enhance this application:

1. **Database**: Replace in-memory JSON with MongoDB
2. **Image Upload**: Add Cloudinary integration
3. **Email**: Implement email notifications
4. **Payment**: Add adoption fee processing
5. **Admin Panel**: Create admin dashboard
6. **Pet Details**: Expand individual pet pages
7. **Booking System**: Complete service booking workflow

## 🤝 Demo Usage

1. Visit http://localhost:5173
2. Browse pets without logging in
3. Login with demo account to see auth features
4. Test filtering and search functionality
5. Explore services section
6. Register new account to test registration

---

**Built with ❤️ for pet adoption centers worldwide** 🐕🐱🐰🐦