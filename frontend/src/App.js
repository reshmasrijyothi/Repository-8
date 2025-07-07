import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';

// Components
import Navbar from './components/common/Navbar';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import PetsPage from './pages/PetsPage';
import ServicesPage from './pages/ServicesPage';

// HomePage component
const HomePage = () => {
  const [featuredPets, setFeaturedPets] = React.useState([]);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState(null);

  React.useEffect(() => {
    fetchFeaturedPets();
  }, []);

  const fetchFeaturedPets = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await fetch(`${process.env.REACT_APP_API_URL || 'http://localhost:5000/api'}/pets/featured`);
      
      if (!response.ok) {
        throw new Error('Failed to fetch featured pets');
      }
      
      const data = await response.json();
      setFeaturedPets(data.pets || []);
    } catch (err) {
      setError(err.message);
      setFeaturedPets([]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.homePage}>
      {/* Hero Section */}
      <section style={styles.hero}>
        <div style={styles.heroContent}>
          <h1 style={styles.heroTitle}>
            Find Your Perfect Companion 🐾
          </h1>
          <p style={styles.heroSubtitle}>
            Give a loving home to pets in need. Browse our amazing selection of dogs, cats, and other wonderful animals waiting for their forever families.
          </p>
          <div style={styles.heroButtons}>
            <a href="/pets" style={styles.primaryButton}>
              🔍 Browse Pets
            </a>
            <a href="/services" style={styles.secondaryButton}>
              🏥 Our Services
            </a>
          </div>
        </div>
        <div style={styles.heroImage}>
          <div style={styles.heroImagePlaceholder}>
            <span style={styles.heroEmoji}>🐕🐱</span>
            <p>Happy Pets Waiting for You!</p>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section style={styles.stats}>
        <div style={styles.statsContainer}>
          <div style={styles.statItem}>
            <span style={styles.statNumber}>500+</span>
            <span style={styles.statLabel}>Pets Adopted</span>
          </div>
          <div style={styles.statItem}>
            <span style={styles.statNumber}>24/7</span>
            <span style={styles.statLabel}>Care Available</span>
          </div>
          <div style={styles.statItem}>
            <span style={styles.statNumber}>15+</span>
            <span style={styles.statLabel}>Years Experience</span>
          </div>
          <div style={styles.statItem}>
            <span style={styles.statNumber}>100%</span>
            <span style={styles.statLabel}>Love Guaranteed</span>
          </div>
        </div>
      </section>

      {/* Featured Pets Section */}
      <section style={styles.featuredSection}>
        <div style={styles.sectionHeader}>
          <h2 style={styles.sectionTitle}>Featured Pets ⭐</h2>
          <p style={styles.sectionSubtitle}>
            Meet some of our special pets looking for homes
          </p>
        </div>

        {loading ? (
          <div style={styles.loadingContainer}>
            <div style={styles.loadingSpinner}>🔄</div>
            <p>Loading featured pets...</p>
          </div>
        ) : error ? (
          <div style={styles.errorContainer}>
            <div style={styles.errorIcon}>😿</div>
            <h3>Unable to load featured pets</h3>
            <p>{error}</p>
            <button onClick={fetchFeaturedPets} style={styles.retryButton}>
              🔄 Try Again
            </button>
          </div>
        ) : featuredPets.length === 0 ? (
          <div style={styles.noFeaturedContainer}>
            <div style={styles.noFeaturedIcon}>🐾</div>
            <h3>No featured pets at the moment</h3>
            <p>Check back soon or browse all our available pets!</p>
            <a href="/pets" style={styles.browsePetsButton}>
              🔍 Browse All Pets
            </a>
          </div>
        ) : (
          <div style={styles.featuredGrid}>
            {featuredPets.slice(0, 3).map(pet => (
              <div key={pet._id} style={styles.featuredCard}>
                <div style={styles.featuredImageContainer}>
                  {pet.photos && pet.photos.length > 0 ? (
                    <img 
                      src={pet.photos[0]} 
                      alt={pet.name}
                      style={styles.featuredImage}
                      onError={(e) => {
                        e.target.src = `https://via.placeholder.com/300x200/4CAF50/white?text=${pet.name}`;
                      }}
                    />
                  ) : (
                    <div style={styles.featuredImagePlaceholder}>
                      <span style={styles.featuredEmoji}>
                        {pet.species === 'dog' ? '🐕' : 
                         pet.species === 'cat' ? '🐱' : '🐾'}
                      </span>
                      <span>{pet.name}</span>
                    </div>
                  )}
                </div>
                
                <div style={styles.featuredInfo}>
                  <h3 style={styles.featuredName}>{pet.name}</h3>
                  <p style={styles.featuredDetails}>
                    {pet.breed} • {pet.age} years • {pet.size}
                  </p>
                  <p style={styles.featuredDescription}>
                    {pet.description?.substring(0, 80)}...
                  </p>
                  <a 
                    href={`/pets/${pet._id}`} 
                    style={styles.featuredButton}
                  >
                    ❤️ Meet {pet.name}
                  </a>
                </div>
              </div>
            ))}
          </div>
        )}

        <div style={styles.viewAllContainer}>
          <a href="/pets" style={styles.viewAllButton}>
            🐾 View All Available Pets
          </a>
        </div>
      </section>

      {/* Services Section */}
      <section style={styles.servicesSection}>
        <div style={styles.sectionHeader}>
          <h2 style={styles.sectionTitle}>Our Services 🏥</h2>
          <p style={styles.sectionSubtitle}>
            Comprehensive care for your beloved pets
          </p>
        </div>

        <div style={styles.servicesGrid}>
          <div style={styles.serviceCard}>
            <div style={styles.serviceIcon}>🩺</div>
            <h3 style={styles.serviceTitle}>Veterinary Care</h3>
            <p style={styles.serviceDescription}>
              Professional medical care and health checkups for your pets
            </p>
          </div>

          <div style={styles.serviceCard}>
            <div style={styles.serviceIcon}>✂️</div>
            <h3 style={styles.serviceTitle}>Grooming</h3>
            <p style={styles.serviceDescription}>
              Professional grooming services to keep your pets looking their best
            </p>
          </div>

          <div style={styles.serviceCard}>
            <div style={styles.serviceIcon}>🎓</div>
            <h3 style={styles.serviceTitle}>Training</h3>
            <p style={styles.serviceDescription}>
              Behavioral training and obedience classes for all ages
            </p>
          </div>

          <div style={styles.serviceCard}>
            <div style={styles.serviceIcon}>🏠</div>
            <h3 style={styles.serviceTitle}>Boarding</h3>
            <p style={styles.serviceDescription}>
              Safe and comfortable boarding when you're away
            </p>
          </div>
        </div>

        <div style={styles.viewAllContainer}>
          <a href="/services" style={styles.viewAllButton}>
            🔗 View All Services
          </a>
        </div>
      </section>

      {/* CTA Section */}
      <section style={styles.ctaSection}>
        <div style={styles.ctaContent}>
          <h2 style={styles.ctaTitle}>Ready to Make a Difference?</h2>
          <p style={styles.ctaSubtitle}>
            Join our community of pet lovers and help save lives through adoption
          </p>
          <div style={styles.ctaButtons}>
            <a href="/register" style={styles.ctaPrimaryButton}>
              🎉 Get Started
            </a>
            <a href="/pets" style={styles.ctaSecondaryButton}>
              🔍 Browse Pets
            </a>
          </div>
        </div>
      </section>
    </div>
  );
};

// Footer Component
const Footer = () => (
  <footer style={styles.footer}>
    <div style={styles.footerContent}>
      <div style={styles.footerSection}>
        <h3 style={styles.footerTitle}>🐾 Pet Adoption Center</h3>
        <p style={styles.footerText}>
          Connecting loving families with pets in need since 2020
        </p>
      </div>
      
      <div style={styles.footerSection}>
        <h4 style={styles.footerSubtitle}>Quick Links</h4>
        <div style={styles.footerLinks}>
          <a href="/pets" style={styles.footerLink}>Browse Pets</a>
          <a href="/services" style={styles.footerLink}>Services</a>
          <a href="/about" style={styles.footerLink}>About Us</a>
          <a href="/contact" style={styles.footerLink}>Contact</a>
        </div>
      </div>
      
      <div style={styles.footerSection}>
        <h4 style={styles.footerSubtitle}>Contact Info</h4>
        <p style={styles.footerText}>📧 info@petadoptioncenter.com</p>
        <p style={styles.footerText}>📞 (555) 123-4567</p>
        <p style={styles.footerText}>📍 123 Pet Street, City, State 12345</p>
      </div>
    </div>
    
    <div style={styles.footerBottom}>
      <p>© 2024 Pet Adoption Center. Made with ❤️ for pets and their families.</p>
    </div>
  </footer>
);

// Main App Component
function App() {
  return (
    <AuthProvider>
      <Router>
        <div style={styles.app}>
          <Navbar />
          
          <main style={styles.main}>
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/register" element={<RegisterPage />} />
              <Route path="/pets" element={<PetsPage />} />
              <Route path="/services" element={<ServicesPage />} />
              
              {/* Placeholder routes - will be implemented next */}
              <Route path="/pets/:id" element={<div style={styles.placeholder}>Pet Detail Page - Coming Soon! 🐾</div>} />
              <Route path="/profile" element={<div style={styles.placeholder}>Profile Page - Coming Soon! 👤</div>} />
              <Route path="/admin" element={<div style={styles.placeholder}>Admin Dashboard - Coming Soon! ⚙️</div>} />
              
              {/* 404 Route */}
              <Route path="*" element={
                <div style={styles.notFound}>
                  <h1>🚫 Page Not Found</h1>
                  <p>The page you're looking for doesn't exist.</p>
                  <a href="/" style={styles.homeButton}>🏠 Go Home</a>
                </div>
              } />
            </Routes>
          </main>
          
          <Footer />
        </div>
      </Router>
    </AuthProvider>
  );
}

const styles = {
  app: {
    display: 'flex',
    flexDirection: 'column',
    minHeight: '100vh'
  },
  main: {
    flex: 1
  },
  homePage: {
    width: '100%'
  },
  hero: {
    display: 'flex',
    alignItems: 'center',
    maxWidth: '1200px',
    margin: '0 auto',
    padding: '60px 20px',
    gap: '50px'
  },
  heroContent: {
    flex: 1
  },
  heroTitle: {
    fontSize: '3rem',
    fontWeight: 'bold',
    color: '#2E7D32',
    marginBottom: '20px',
    lineHeight: '1.2'
  },
  heroSubtitle: {
    fontSize: '1.2rem',
    color: '#666',
    marginBottom: '30px',
    lineHeight: '1.6'
  },
  heroButtons: {
    display: 'flex',
    gap: '15px',
    flexWrap: 'wrap'
  },
  primaryButton: {
    backgroundColor: '#2E7D32',
    color: 'white',
    padding: '15px 30px',
    borderRadius: '8px',
    textDecoration: 'none',
    fontWeight: 'bold',
    fontSize: '1.1rem',
    transition: 'background-color 0.3s'
  },
  secondaryButton: {
    backgroundColor: 'transparent',
    color: '#2E7D32',
    padding: '15px 30px',
    borderRadius: '8px',
    textDecoration: 'none',
    fontWeight: 'bold',
    fontSize: '1.1rem',
    border: '2px solid #2E7D32',
    transition: 'all 0.3s'
  },
  heroImage: {
    flex: 1,
    display: 'flex',
    justifyContent: 'center'
  },
  heroImagePlaceholder: {
    width: '400px',
    height: '300px',
    backgroundColor: '#E8F5E8',
    borderRadius: '15px',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    color: '#2E7D32'
  },
  heroEmoji: {
    fontSize: '4rem',
    marginBottom: '20px'
  },
  stats: {
    backgroundColor: '#2E7D32',
    padding: '50px 0',
    color: 'white'
  },
  statsContainer: {
    maxWidth: '1200px',
    margin: '0 auto',
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
    gap: '30px',
    padding: '0 20px'
  },
  statItem: {
    textAlign: 'center'
  },
  statNumber: {
    display: 'block',
    fontSize: '2.5rem',
    fontWeight: 'bold',
    marginBottom: '10px'
  },
  statLabel: {
    fontSize: '1.1rem',
    opacity: 0.9
  },
  featuredSection: {
    maxWidth: '1200px',
    margin: '0 auto',
    padding: '80px 20px'
  },
  sectionHeader: {
    textAlign: 'center',
    marginBottom: '50px'
  },
  sectionTitle: {
    fontSize: '2.5rem',
    fontWeight: 'bold',
    color: '#2E7D32',
    marginBottom: '15px'
  },
  sectionSubtitle: {
    fontSize: '1.1rem',
    color: '#666'
  },
  loadingContainer: {
    textAlign: 'center',
    padding: '50px',
    color: '#666'
  },
  loadingSpinner: {
    fontSize: '3rem',
    marginBottom: '20px'
  },
  errorContainer: {
    textAlign: 'center',
    padding: '50px',
    color: '#666'
  },
  errorIcon: {
    fontSize: '4rem',
    marginBottom: '20px'
  },
  retryButton: {
    backgroundColor: '#2E7D32',
    color: 'white',
    border: 'none',
    padding: '12px 24px',
    borderRadius: '5px',
    cursor: 'pointer',
    fontSize: '1rem',
    marginTop: '15px'
  },
  noFeaturedContainer: {
    textAlign: 'center',
    padding: '50px',
    color: '#666'
  },
  noFeaturedIcon: {
    fontSize: '4rem',
    marginBottom: '20px'
  },
  browsePetsButton: {
    backgroundColor: '#FF6F00',
    color: 'white',
    padding: '12px 24px',
    borderRadius: '5px',
    textDecoration: 'none',
    fontSize: '1rem',
    marginTop: '15px',
    display: 'inline-block'
  },
  featuredGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
    gap: '30px',
    marginBottom: '40px'
  },
  featuredCard: {
    backgroundColor: 'white',
    borderRadius: '12px',
    boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
    overflow: 'hidden',
    transition: 'transform 0.3s'
  },
  featuredImageContainer: {
    height: '200px',
    overflow: 'hidden'
  },
  featuredImage: {
    width: '100%',
    height: '100%',
    objectFit: 'cover'
  },
  featuredImagePlaceholder: {
    width: '100%',
    height: '100%',
    backgroundColor: '#4CAF50',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    color: 'white',
    fontSize: '1.2rem',
    fontWeight: 'bold'
  },
  featuredEmoji: {
    fontSize: '3rem',
    marginBottom: '10px'
  },
  featuredInfo: {
    padding: '20px'
  },
  featuredName: {
    color: '#2E7D32',
    fontSize: '1.5rem',
    fontWeight: 'bold',
    marginBottom: '8px'
  },
  featuredDetails: {
    color: '#666',
    fontSize: '0.9rem',
    marginBottom: '10px'
  },
  featuredDescription: {
    color: '#555',
    fontSize: '0.9rem',
    lineHeight: '1.4',
    marginBottom: '15px'
  },
  featuredButton: {
    backgroundColor: '#FF6F00',
    color: 'white',
    padding: '10px 20px',
    borderRadius: '5px',
    textDecoration: 'none',
    fontSize: '0.9rem',
    fontWeight: 'bold',
    display: 'inline-block'
  },
  viewAllContainer: {
    textAlign: 'center'
  },
  viewAllButton: {
    backgroundColor: '#2E7D32',
    color: 'white',
    padding: '15px 30px',
    borderRadius: '8px',
    textDecoration: 'none',
    fontSize: '1.1rem',
    fontWeight: 'bold'
  },
  servicesSection: {
    backgroundColor: '#f8f9fa',
    padding: '80px 0'
  },
  servicesGrid: {
    maxWidth: '1200px',
    margin: '0 auto',
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
    gap: '30px',
    padding: '0 20px',
    marginBottom: '40px'
  },
  serviceCard: {
    backgroundColor: 'white',
    padding: '30px',
    borderRadius: '12px',
    textAlign: 'center',
    boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
  },
  serviceIcon: {
    fontSize: '3rem',
    marginBottom: '20px'
  },
  serviceTitle: {
    color: '#2E7D32',
    fontSize: '1.3rem',
    fontWeight: 'bold',
    marginBottom: '15px'
  },
  serviceDescription: {
    color: '#666',
    lineHeight: '1.5'
  },
  ctaSection: {
    backgroundColor: '#2E7D32',
    padding: '80px 0',
    color: 'white',
    textAlign: 'center'
  },
  ctaContent: {
    maxWidth: '800px',
    margin: '0 auto',
    padding: '0 20px'
  },
  ctaTitle: {
    fontSize: '2.5rem',
    fontWeight: 'bold',
    marginBottom: '20px'
  },
  ctaSubtitle: {
    fontSize: '1.2rem',
    marginBottom: '30px',
    opacity: 0.9
  },
  ctaButtons: {
    display: 'flex',
    gap: '20px',
    justifyContent: 'center',
    flexWrap: 'wrap'
  },
  ctaPrimaryButton: {
    backgroundColor: '#FF6F00',
    color: 'white',
    padding: '15px 30px',
    borderRadius: '8px',
    textDecoration: 'none',
    fontSize: '1.1rem',
    fontWeight: 'bold'
  },
  ctaSecondaryButton: {
    backgroundColor: 'transparent',
    color: 'white',
    padding: '15px 30px',
    borderRadius: '8px',
    textDecoration: 'none',
    fontSize: '1.1rem',
    fontWeight: 'bold',
    border: '2px solid white'
  },
  footer: {
    backgroundColor: '#1B5E20',
    color: 'white',
    padding: '40px 0 20px 0'
  },
  footerContent: {
    maxWidth: '1200px',
    margin: '0 auto',
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
    gap: '30px',
    padding: '0 20px'
  },
  footerSection: {},
  footerTitle: {
    fontSize: '1.3rem',
    fontWeight: 'bold',
    marginBottom: '15px'
  },
  footerSubtitle: {
    fontSize: '1.1rem',
    fontWeight: 'bold',
    marginBottom: '15px'
  },
  footerText: {
    color: '#B8E6B8',
    lineHeight: '1.6',
    marginBottom: '8px'
  },
  footerLinks: {
    display: 'flex',
    flexDirection: 'column',
    gap: '8px'
  },
  footerLink: {
    color: '#B8E6B8',
    textDecoration: 'none',
    transition: 'color 0.3s'
  },
  footerBottom: {
    borderTop: '1px solid #2E7D32',
    marginTop: '30px',
    paddingTop: '20px',
    textAlign: 'center',
    color: '#B8E6B8'
  },
  placeholder: {
    textAlign: 'center',
    padding: '100px 20px',
    fontSize: '1.5rem',
    color: '#666'
  },
  notFound: {
    textAlign: 'center',
    padding: '100px 20px',
    color: '#666'
  },
  homeButton: {
    backgroundColor: '#2E7D32',
    color: 'white',
    padding: '12px 24px',
    borderRadius: '5px',
    textDecoration: 'none',
    fontSize: '1rem',
    marginTop: '20px',
    display: 'inline-block'
  }
};

// Add responsive styles and hover effects
const styleSheet = document.createElement('style');
styleSheet.textContent = `
  .primary-button:hover {
    background-color: #1B5E20 !important;
  }
  
  .secondary-button:hover {
    background-color: #2E7D32 !important;
    color: white !important;
  }
  
  .featured-card:hover {
    transform: translateY(-5px) !important;
  }
  
  .footer-link:hover {
    color: white !important;
  }
  
  @media (max-width: 768px) {
    .hero {
      flex-direction: column !important;
      text-align: center !important;
    }
    
    .hero-title {
      font-size: 2rem !important;
    }
    
    .hero-buttons {
      justify-content: center !important;
    }
    
    .stats-container {
      grid-template-columns: repeat(2, 1fr) !important;
    }
    
    .cta-buttons {
      flex-direction: column !important;
      align-items: center !important;
    }
  }
`;
document.head.appendChild(styleSheet);

export default App;