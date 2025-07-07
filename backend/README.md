# Pet Adoption Center Backend

A comprehensive REST API for a pet adoption and care center built with Node.js, Express, and MongoDB.

## 🚀 Quick Start

### Prerequisites
- Node.js (v16 or higher)
- MongoDB (local installation or MongoDB Atlas account)
- npm or yarn

### Installation

1. **Install dependencies:**
```bash
npm install
```

2. **Set up environment variables:**
   - Copy `.env.example` to `.env`
   - Update the environment variables:

```bash
# Database Configuration
MONGODB_URI=mongodb://localhost:27017/pet-adoption
# OR use MongoDB Atlas:
# MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/pet-adoption

# JWT Configuration
JWT_SECRET=your_secure_jwt_secret_here
JWT_EXPIRE=7d

# Server Configuration
PORT=5000
NODE_ENV=development
```

### Database Setup

#### Option 1: Local MongoDB
1. Install MongoDB on your system
2. Start MongoDB service:
```bash
sudo systemctl start mongodb
# or
mongod
```

#### Option 2: MongoDB Atlas (Recommended for development)
1. Create a free account at [MongoDB Atlas](https://cloud.mongodb.com/)
2. Create a new cluster
3. Create a database user
4. Get your connection string
5. Update `MONGODB_URI` in `.env` file

### Running the Application

1. **Seed the database (optional but recommended):**
```bash
npm run seed
```

2. **Start development server:**
```bash
npm run dev
```

3. **Start production server:**
```bash
npm start
```

The server will run on `http://localhost:5000`

## 📝 API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user (protected)
- `PUT /api/auth/profile` - Update user profile (protected)

### Pets
- `GET /api/pets` - Get all pets (with filtering and pagination)
- `GET /api/pets/featured` - Get featured pets
- `GET /api/pets/:id` - Get single pet
- `GET /api/pets/:id/similar` - Get similar pets
- `POST /api/pets` - Create pet (admin only)
- `PUT /api/pets/:id` - Update pet (admin only)
- `DELETE /api/pets/:id` - Delete pet (admin only)

### Health Check
- `GET /api/health` - API health check

## 🔒 Authentication

The API uses JWT (JSON Web Tokens) for authentication. Include the token in the Authorization header:

```
Authorization: Bearer <your_jwt_token>
```

## 🗄️ Database Models

### User
- Personal information (name, email, phone, address)
- Authentication (password hash)
- Role-based access (user/admin)
- Adoption history and preferences

### Pet
- Basic information (name, species, breed, age, gender, size)
- Health information (vaccinations, medical history)
- Temperament and compatibility
- Adoption status and shelter information

### Service
- Service details (name, category, description, price)
- Provider information
- Availability and scheduling

## 🛡️ Security Features

- Password hashing with bcrypt
- JWT token authentication
- CORS protection
- Helmet security headers
- Input validation and sanitization
- Rate limiting (to be implemented)

## 📊 Test Data

Run the seed script to populate the database with test data:

```bash
npm run seed
```

This creates:
- 2 test users (admin and regular user)
- 4 sample pets
- 3 sample services

**Test Credentials:**
- Admin: `admin@petcenter.com` / `admin123`
- User: `user@petcenter.com` / `user123`

## 🔧 Development

### Available Scripts
- `npm start` - Start production server
- `npm run dev` - Start development server with nodemon
- `npm run seed` - Seed database with test data

### Code Structure
```
backend/
├── models/         # Database models
├── routes/         # API routes
├── middleware/     # Custom middleware
├── controllers/    # Route controllers
├── utils/          # Utility functions
├── config/         # Configuration files
├── app.js          # Express app setup
└── server.js       # Server entry point
```

## 🚀 Deployment

### Environment Variables for Production
```bash
NODE_ENV=production
MONGODB_URI=your_production_mongodb_uri
JWT_SECRET=your_secure_production_jwt_secret
PORT=5000
```

### Deployment Platforms
- **Heroku**: Use the included `Procfile`
- **Railway**: Direct deployment support
- **Render**: Works out of the box
- **Digital Ocean App Platform**: Automatic deployment

## 📈 Future Enhancements

- [ ] File upload for pet images
- [ ] Email notifications
- [ ] Real-time features with Socket.io
- [ ] Payment integration
- [ ] Advanced search and filtering
- [ ] Appointment scheduling system
- [ ] Adoption application management
- [ ] Admin dashboard analytics

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the ISC License.