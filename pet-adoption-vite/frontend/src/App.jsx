import React, { useState, useEffect } from 'react'
import { Routes, Route, Link } from 'react-router-dom'
import axios from 'axios'
import './App.css'

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api'

// Auth Context
const AuthContext = React.createContext()

const useAuth = () => {
  const context = React.useContext(AuthContext)
  if (!context) throw new Error('useAuth must be used within AuthProvider')
  return context
}

const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const token = localStorage.getItem('token')
    if (token) {
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`
      fetchUser()
    } else {
      setLoading(false)
    }
  }, [])

  const fetchUser = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/auth/me`)
      setUser(response.data.user)
    } catch (error) {
      localStorage.removeItem('token')
      delete axios.defaults.headers.common['Authorization']
    } finally {
      setLoading(false)
    }
  }

  const login = async (email, password) => {
    const response = await axios.post(`${API_BASE_URL}/auth/login`, { email, password })
    const { token, user } = response.data
    localStorage.setItem('token', token)
    axios.defaults.headers.common['Authorization'] = `Bearer ${token}`
    setUser(user)
    return response.data
  }

  const register = async (userData) => {
    const response = await axios.post(`${API_BASE_URL}/auth/register`, userData)
    const { token, user } = response.data
    localStorage.setItem('token', token)
    axios.defaults.headers.common['Authorization'] = `Bearer ${token}`
    setUser(user)
    return response.data
  }

  const logout = () => {
    localStorage.removeItem('token')
    delete axios.defaults.headers.common['Authorization']
    setUser(null)
  }

  return (
    <AuthContext.Provider value={{ user, login, register, logout, loading }}>
      {children}
    </AuthContext.Provider>
  )
}

// Navbar Component
const Navbar = () => {
  const { user, logout } = useAuth()

  return (
    <nav style={styles.navbar}>
      <Link to="/" style={styles.brand}>🐾 Pet Adoption Center</Link>
      <div style={styles.navLinks}>
        <Link to="/" style={styles.navLink}>Home</Link>
        <Link to="/pets" style={styles.navLink}>Browse Pets</Link>
        <Link to="/services" style={styles.navLink}>Services</Link>
        {user ? (
          <>
            <span style={styles.welcome}>Hi, {user.firstName}!</span>
            <button onClick={logout} style={styles.logoutBtn}>Logout</button>
          </>
        ) : (
          <>
            <Link to="/login" style={styles.navLink}>Login</Link>
            <Link to="/register" style={styles.registerBtn}>Sign Up</Link>
          </>
        )}
      </div>
    </nav>
  )
}

// Home Page
const HomePage = () => {
  const [featuredPets, setFeaturedPets] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchFeaturedPets()
  }, [])

  const fetchFeaturedPets = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/pets/featured`)
      setFeaturedPets(response.data.pets)
    } catch (error) {
      console.error('Error fetching featured pets:', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={styles.container}>
      <section style={styles.hero}>
        <h1 style={styles.heroTitle}>Find Your Perfect Companion 🐾</h1>
        <p style={styles.heroSubtitle}>Give a loving home to pets in need</p>
        <Link to="/pets" style={styles.heroButton}>Browse Pets</Link>
      </section>

      <section style={styles.featured}>
        <h2 style={styles.sectionTitle}>Featured Pets ⭐</h2>
        {loading ? (
          <p>Loading pets...</p>
        ) : (
          <div style={styles.petGrid}>
            {featuredPets.map(pet => (
              <div key={pet._id} style={styles.petCard}>
                <img 
                  src={pet.photos?.[0] || `https://via.placeholder.com/300x200/4CAF50/white?text=${pet.name}`} 
                  alt={pet.name} 
                  style={styles.petImage}
                />
                <div style={styles.petInfo}>
                  <h3>{pet.name}</h3>
                  <p>{pet.breed} • {pet.age} years • {pet.size}</p>
                  <p style={styles.description}>{pet.description}</p>
                  <Link to={`/pets/${pet._id}`} style={styles.viewBtn}>❤️ Meet {pet.name}</Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  )
}

// Pets Page
const PetsPage = () => {
  const [pets, setPets] = useState([])
  const [loading, setLoading] = useState(true)
  const [filters, setFilters] = useState({ species: '', size: '', search: '' })

  useEffect(() => {
    fetchPets()
  }, [filters])

  const fetchPets = async () => {
    try {
      setLoading(true)
      const params = new URLSearchParams()
      Object.keys(filters).forEach(key => {
        if (filters[key]) params.append(key, filters[key])
      })
      
      const response = await axios.get(`${API_BASE_URL}/pets?${params}`)
      setPets(response.data.pets)
    } catch (error) {
      console.error('Error fetching pets:', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={styles.container}>
      <h1 style={styles.pageTitle}>Find Your Perfect Pet 🔍</h1>
      
      <div style={styles.filters}>
        <input
          type="text"
          placeholder="Search pets..."
          value={filters.search}
          onChange={(e) => setFilters({...filters, search: e.target.value})}
          style={styles.searchInput}
        />
        <select
          value={filters.species}
          onChange={(e) => setFilters({...filters, species: e.target.value})}
          style={styles.filterSelect}
        >
          <option value="">All Species</option>
          <option value="dog">Dogs</option>
          <option value="cat">Cats</option>
          <option value="bird">Birds</option>
          <option value="rabbit">Rabbits</option>
        </select>
        <select
          value={filters.size}
          onChange={(e) => setFilters({...filters, size: e.target.value})}
          style={styles.filterSelect}
        >
          <option value="">All Sizes</option>
          <option value="small">Small</option>
          <option value="medium">Medium</option>
          <option value="large">Large</option>
        </select>
      </div>

      {loading ? (
        <p>Loading pets...</p>
      ) : (
        <div style={styles.petGrid}>
          {pets.map(pet => (
            <div key={pet._id} style={styles.petCard}>
              <img 
                src={pet.photos?.[0] || `https://via.placeholder.com/300x200/4CAF50/white?text=${pet.name}`} 
                alt={pet.name} 
                style={styles.petImage}
              />
              <div style={styles.petInfo}>
                <h3>{pet.name}</h3>
                <p>{pet.breed} • {pet.age} years • {pet.size}</p>
                <p style={styles.description}>{pet.description}</p>
                <div style={styles.petActions}>
                  <span style={styles.fee}>${pet.adoptionFee}</span>
                  <Link to={`/pets/${pet._id}`} style={styles.viewBtn}>View Details</Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

// Services Page
const ServicesPage = () => {
  const [services, setServices] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchServices()
  }, [])

  const fetchServices = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/services`)
      setServices(response.data.services)
    } catch (error) {
      console.error('Error fetching services:', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={styles.container}>
      <h1 style={styles.pageTitle}>Pet Care Services 🏥</h1>
      
      {loading ? (
        <p>Loading services...</p>
      ) : (
        <div style={styles.serviceGrid}>
          {services.map(service => (
            <div key={service._id} style={styles.serviceCard}>
              <div style={styles.serviceInfo}>
                <h3>{service.name}</h3>
                <p style={styles.category}>{service.category}</p>
                <p style={styles.description}>{service.description}</p>
                <div style={styles.serviceDetails}>
                  <span style={styles.price}>${service.price}</span>
                  <span style={styles.duration}>{service.duration} min</span>
                </div>
                {service.provider && (
                  <p style={styles.provider}>👨‍⚕️ {service.provider.name}</p>
                )}
                <button style={styles.bookBtn}>📅 Book Service</button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

// Login Page
const LoginPage = () => {
  const { login } = useAuth()
  const [formData, setFormData] = useState({ email: '', password: '' })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    try {
      await login(formData.email, formData.password)
      window.location.href = '/'
    } catch (error) {
      setError(error.response?.data?.message || 'Login failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={styles.authContainer}>
      <form onSubmit={handleSubmit} style={styles.authForm}>
        <h2>Welcome Back! 🐾</h2>
        {error && <div style={styles.error}>{error}</div>}
        
        <input
          type="email"
          placeholder="Email"
          value={formData.email}
          onChange={(e) => setFormData({...formData, email: e.target.value})}
          style={styles.input}
          required
        />
        <input
          type="password"
          placeholder="Password"
          value={formData.password}
          onChange={(e) => setFormData({...formData, password: e.target.value})}
          style={styles.input}
          required
        />
        <button type="submit" disabled={loading} style={styles.submitBtn}>
          {loading ? 'Signing In...' : 'Sign In'}
        </button>
        
        <div style={styles.demoAccounts}>
          <p><strong>Demo Accounts:</strong></p>
          <p>Admin: admin@petcenter.com / admin123</p>
          <p>User: user@petcenter.com / user123</p>
        </div>
        
        <p>Don't have an account? <Link to="/register">Sign up here</Link></p>
      </form>
    </div>
  )
}

// Register Page
const RegisterPage = () => {
  const { register } = useAuth()
  const [formData, setFormData] = useState({
    firstName: '', lastName: '', email: '', password: '', phone: ''
  })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    try {
      await register(formData)
      window.location.href = '/'
    } catch (error) {
      setError(error.response?.data?.message || 'Registration failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={styles.authContainer}>
      <form onSubmit={handleSubmit} style={styles.authForm}>
        <h2>Join Our Community! 🎉</h2>
        {error && <div style={styles.error}>{error}</div>}
        
        <input
          type="text"
          placeholder="First Name"
          value={formData.firstName}
          onChange={(e) => setFormData({...formData, firstName: e.target.value})}
          style={styles.input}
          required
        />
        <input
          type="text"
          placeholder="Last Name"
          value={formData.lastName}
          onChange={(e) => setFormData({...formData, lastName: e.target.value})}
          style={styles.input}
          required
        />
        <input
          type="email"
          placeholder="Email"
          value={formData.email}
          onChange={(e) => setFormData({...formData, email: e.target.value})}
          style={styles.input}
          required
        />
        <input
          type="tel"
          placeholder="Phone"
          value={formData.phone}
          onChange={(e) => setFormData({...formData, phone: e.target.value})}
          style={styles.input}
          required
        />
        <input
          type="password"
          placeholder="Password"
          value={formData.password}
          onChange={(e) => setFormData({...formData, password: e.target.value})}
          style={styles.input}
          required
        />
        
        <button type="submit" disabled={loading} style={styles.submitBtn}>
          {loading ? 'Creating Account...' : 'Create Account'}
        </button>
        
        <p>Already have an account? <Link to="/login">Sign in here</Link></p>
      </form>
    </div>
  )
}

// Main App Component
function App() {
  return (
    <AuthProvider>
      <div style={styles.app}>
        <Navbar />
        <main>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/pets" element={<PetsPage />} />
            <Route path="/services" element={<ServicesPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/pets/:id" element={<div style={styles.placeholder}>Pet Detail - Coming Soon! 🐾</div>} />
          </Routes>
        </main>
      </div>
    </AuthProvider>
  )
}

// Styles
const styles = {
  app: { minHeight: '100vh', backgroundColor: '#f5f5f5' },
  navbar: { 
    display: 'flex', justifyContent: 'space-between', alignItems: 'center', 
    padding: '1rem 2rem', backgroundColor: '#2E7D32', color: 'white' 
  },
  brand: { fontSize: '1.5rem', fontWeight: 'bold', color: 'white', textDecoration: 'none' },
  navLinks: { display: 'flex', alignItems: 'center', gap: '1rem' },
  navLink: { color: 'white', textDecoration: 'none', padding: '0.5rem' },
  registerBtn: { 
    backgroundColor: '#FF6F00', color: 'white', padding: '0.5rem 1rem', 
    borderRadius: '5px', textDecoration: 'none' 
  },
  welcome: { color: '#E8F5E8' },
  logoutBtn: { 
    backgroundColor: 'transparent', color: 'white', border: '1px solid white', 
    padding: '0.5rem 1rem', borderRadius: '5px', cursor: 'pointer' 
  },
  
  container: { maxWidth: '1200px', margin: '0 auto', padding: '2rem' },
  hero: { textAlign: 'center', padding: '4rem 0' },
  heroTitle: { fontSize: '3rem', color: '#2E7D32', marginBottom: '1rem' },
  heroSubtitle: { fontSize: '1.2rem', color: '#666', marginBottom: '2rem' },
  heroButton: { 
    backgroundColor: '#2E7D32', color: 'white', padding: '1rem 2rem', 
    borderRadius: '8px', textDecoration: 'none', fontSize: '1.1rem' 
  },
  
  featured: { marginTop: '3rem' },
  sectionTitle: { fontSize: '2rem', color: '#2E7D32', textAlign: 'center', marginBottom: '2rem' },
  pageTitle: { fontSize: '2.5rem', color: '#2E7D32', textAlign: 'center', marginBottom: '2rem' },
  
  petGrid: { 
    display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', 
    gap: '2rem', marginTop: '2rem' 
  },
  petCard: { 
    backgroundColor: 'white', borderRadius: '10px', boxShadow: '0 4px 6px rgba(0,0,0,0.1)', 
    overflow: 'hidden', transition: 'transform 0.3s' 
  },
  petImage: { width: '100%', height: '200px', objectFit: 'cover' },
  petInfo: { padding: '1rem' },
  description: { color: '#666', fontSize: '0.9rem', lineHeight: '1.4' },
  petActions: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '1rem' },
  fee: { fontSize: '1.2rem', fontWeight: 'bold', color: '#2E7D32' },
  viewBtn: { 
    backgroundColor: '#FF6F00', color: 'white', padding: '0.5rem 1rem', 
    borderRadius: '5px', textDecoration: 'none' 
  },
  
  filters: { 
    display: 'flex', gap: '1rem', marginBottom: '2rem', flexWrap: 'wrap', 
    justifyContent: 'center' 
  },
  searchInput: { 
    padding: '0.75rem', border: '1px solid #ddd', borderRadius: '5px', 
    fontSize: '1rem', minWidth: '200px' 
  },
  filterSelect: { 
    padding: '0.75rem', border: '1px solid #ddd', borderRadius: '5px', 
    fontSize: '1rem', backgroundColor: 'white' 
  },
  
  serviceGrid: { 
    display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', 
    gap: '2rem' 
  },
  serviceCard: { 
    backgroundColor: 'white', borderRadius: '10px', boxShadow: '0 4px 6px rgba(0,0,0,0.1)', 
    padding: '1.5rem' 
  },
  category: { 
    backgroundColor: '#E8F5E8', color: '#2E7D32', padding: '0.25rem 0.5rem', 
    borderRadius: '4px', fontSize: '0.8rem', textTransform: 'uppercase', 
    fontWeight: 'bold', display: 'inline-block', marginBottom: '1rem' 
  },
  serviceDetails: { display: 'flex', gap: '1rem', margin: '1rem 0' },
  price: { fontSize: '1.2rem', fontWeight: 'bold', color: '#2E7D32' },
  duration: { color: '#666' },
  provider: { color: '#666', fontSize: '0.9rem' },
  bookBtn: { 
    backgroundColor: '#2E7D32', color: 'white', border: 'none', padding: '0.75rem 1.5rem', 
    borderRadius: '5px', cursor: 'pointer', fontSize: '1rem', width: '100%' 
  },
  
  authContainer: { 
    minHeight: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center', 
    backgroundColor: '#f5f5f5' 
  },
  authForm: { 
    backgroundColor: 'white', padding: '2rem', borderRadius: '10px', 
    boxShadow: '0 4px 6px rgba(0,0,0,0.1)', width: '100%', maxWidth: '400px' 
  },
  input: { 
    width: '100%', padding: '0.75rem', margin: '0.5rem 0', border: '1px solid #ddd', 
    borderRadius: '5px', fontSize: '1rem', boxSizing: 'border-box' 
  },
  submitBtn: { 
    width: '100%', backgroundColor: '#2E7D32', color: 'white', border: 'none', 
    padding: '0.75rem', borderRadius: '5px', cursor: 'pointer', fontSize: '1rem', 
    marginTop: '1rem' 
  },
  error: { 
    backgroundColor: '#ffebee', color: '#c62828', padding: '0.75rem', 
    borderRadius: '5px', marginBottom: '1rem' 
  },
  demoAccounts: { 
    backgroundColor: '#f8f9fa', padding: '1rem', borderRadius: '5px', 
    marginTop: '1rem', fontSize: '0.85rem' 
  },
  placeholder: { 
    textAlign: 'center', padding: '4rem', fontSize: '1.5rem', color: '#666' 
  }
}

export default App
