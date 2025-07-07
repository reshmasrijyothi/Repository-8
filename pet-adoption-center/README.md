# 🐾 Pet Adoption & Care Center - MERN Stack

A complete full-stack web application for pet adoption and care services built with the MERN stack (MongoDB, Express.js, React.js, Node.js).

## 🚀 Project Status

**✅ COMPLETED SETUP:**
- ✅ Backend API with Express.js and Node.js
- ✅ Database models for Users, Pets, and Services
- ✅ Authentication system with JWT
- ✅ RESTful API endpoints
- ✅ React.js frontend application
- ✅ Basic pet listing interface
- ✅ API integration between frontend and backend

## 🌟 Features

### Current Features
- **Backend API**
  - RESTful API with Express.js
  - JWT-based authentication
  - User registration and login
  - Pet management (CRUD operations)
  - Service management
  - Input validation and security measures

- **Frontend Application**
  - React.js application
  - Responsive pet listing interface
  - API integration with backend
  - Error handling and loading states

### Planned Features
- 🔐 Complete authentication flow (login/register pages)
- 🐕 Advanced pet browsing with filters
- 📝 Pet adoption application system
- 🛍️ Pet care services booking
- 👨‍💼 Admin dashboard
- 📱 Mobile-responsive design
- 💳 Payment integration
- 📧 Email notifications
- 🔍 Advanced search functionality

## 🛠️ Technology Stack

### Backend
- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **MongoDB** - Database
- **Mongoose** - ODM for MongoDB
- **JWT** - Authentication
- **bcryptjs** - Password hashing
- **CORS** - Cross-origin resource sharing
- **Helmet** - Security middleware

### Frontend
- **React.js** - UI library
- **Axios** - HTTP client
- **React Router** - Navigation (planned)
- **Material-UI** - UI components (planned)

## 📂 Project Structure

```
pet-adoption-center/
├── backend/                 # Express.js API server
│   ├── models/             # Database models
│   │   ├── User.js         # User model
│   │   ├── Pet.js          # Pet model
│   │   └── Service.js      # Service model
│   ├── routes/             # API routes
│   │   ├── auth.js         # Authentication routes
│   │   └── pets.js         # Pet management routes
│   ├── middleware/         # Custom middleware
│   │   └── auth.js         # JWT authentication middleware
│   ├── utils/              # Utility functions
│   │   └── seedDatabase.js # Database seeding script
│   ├── .env                # Environment variables
│   ├── app.js              # Express app configuration
│   ├── server.js           # Server entry point
│   └── package.json        # Backend dependencies
├── frontend/               # React.js application
│   ├── public/             # Static files
│   ├── src/                # React source code
│   │   ├── App.js          # Main App component
│   │   └── App.css         # Styling
│   ├── .env                # Frontend environment variables
│   └── package.json        # Frontend dependencies
└── README.md               # Project documentation
```

## 🚀 Getting Started

### Prerequisites
- Node.js (v16 or higher)
- MongoDB (local or MongoDB Atlas)
- npm or yarn

### Installation & Setup

1. **Clone or create the project structure:**
```bash
mkdir pet-adoption-center
cd pet-adoption-center
```

2. **Backend Setup:**
```bash
cd backend

# Install dependencies
npm install

# Set up environment variables
# Edit .env file with your MongoDB URI and JWT secret

# Start the backend server
npm run dev
```

3. **Frontend Setup:**
```bash
cd ../frontend

# Install dependencies
npm install

# Start the development server
npm start
```

4. **Database Setup (Optional):**
```bash
cd backend
npm run seed
```

### Environment Variables

**Backend (.env):**
```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/pet-adoption
JWT_SECRET=your_jwt_secret_here
JWT_EXPIRE=7d
NODE_ENV=development
```

**Frontend (.env):**
```env
REACT_APP_API_URL=http://localhost:5000/api
REACT_APP_APP_NAME=Pet Adoption Center
PORT=3000
```

## 📝 API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `GET /api/auth/me` - Get current user (protected)
- `PUT /api/auth/profile` - Update user profile (protected)

### Pets
- `GET /api/pets` - Get all pets (with filtering)
- `GET /api/pets/featured` - Get featured pets
- `GET /api/pets/:id` - Get single pet
- `POST /api/pets` - Create pet (admin only)
- `PUT /api/pets/:id` - Update pet (admin only)
- `DELETE /api/pets/:id` - Delete pet (admin only)

### Health Check
- `GET /api/health` - API status check

## 🧪 Testing the Application

### Backend Testing
```bash
# Check API health
curl http://localhost:5000/api/health

# Get pets
curl http://localhost:5000/api/pets
```

### Frontend Testing
- Open http://localhost:3000 in your browser
- Click "Check Backend Status" to test API connection
- View the pet listings

## 🔧 Development Commands

### Backend
```bash
npm start          # Start production server
npm run dev        # Start development server with nodemon
npm run seed       # Seed database with sample data
```

### Frontend
```bash
npm start          # Start development server
npm run build      # Build for production
npm test           # Run tests
```

## 🐕 Sample Data

The database seeding script creates:
- **Admin User:** admin@petcenter.com / admin123
- **Regular User:** user@petcenter.com / user123
- **4 Sample Pets:** Buddy (Golden Retriever), Luna (Maine Coon), Max (Labrador Mix), Bella (Siamese)
- **3 Sample Services:** Grooming, Veterinary, Training

## 🔒 Security Features

- JWT-based authentication
- Password hashing with bcrypt
- CORS protection
- Helmet security headers
- Input validation and sanitization
- Protected routes and admin access control

## 🌐 Deployment

### Backend Deployment Options
- **Heroku**: Ready for deployment with Procfile
- **Railway**: Direct deployment support
- **Render**: Works out of the box
- **Digital Ocean**: App Platform compatible

### Frontend Deployment Options
- **Netlify**: Automatic deployment from Git
- **Vercel**: Optimized for React applications
- **Surge**: Simple static hosting

## 📈 Next Steps

1. **Complete Authentication UI**
   - Login and registration pages
   - Protected routes
   - User profile management

2. **Enhanced Pet Features**
   - Pet detail pages
   - Advanced filtering and search
   - Image upload functionality
   - Adoption application forms

3. **Service Booking System**
   - Service listing pages
   - Appointment booking
   - Calendar integration

4. **Admin Dashboard**
   - Pet management interface
   - User management
   - Analytics and reporting

5. **Additional Features**
   - Payment integration
   - Email notifications
   - Real-time chat support
   - Mobile responsiveness

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the ISC License.

## 🆘 Support

If you encounter any issues:

1. **Backend Issues:**
   - Check if MongoDB is running
   - Verify environment variables
   - Check server logs for errors

2. **Frontend Issues:**
   - Ensure backend is running on port 5000
   - Check browser console for errors
   - Verify API endpoints are accessible

3. **Common Issues:**
   - CORS errors: Check backend CORS configuration
   - Port conflicts: Ensure ports 3000 and 5000 are available
   - Database connection: Verify MongoDB URI

## 📞 Contact

For questions or support, please open an issue in the repository.

---

**Happy Coding! 🚀** Built with ❤️ for pets and their future families.