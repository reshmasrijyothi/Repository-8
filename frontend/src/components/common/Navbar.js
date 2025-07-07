import React from 'react';
import { useAuth } from '../../context/AuthContext';

const Navbar = () => {
  const { user, isAuthenticated, logout } = useAuth();

  const handleLogout = () => {
    logout();
    // Optionally redirect to home page
    window.location.href = '/';
  };

  return (
    <nav style={styles.navbar}>
      <div style={styles.container}>
        <div style={styles.brand}>
          <a href="/" style={styles.brandLink}>
            🐾 Pet Adoption Center
          </a>
        </div>

        <div style={styles.menu}>
          <a href="/" style={styles.navLink}>Home</a>
          <a href="/pets" style={styles.navLink}>Browse Pets</a>
          <a href="/services" style={styles.navLink}>Services</a>
          
          {isAuthenticated ? (
            <div style={styles.userMenu}>
              <span style={styles.welcome}>
                Welcome, {user?.firstName || 'User'}!
              </span>
              
              {user?.role === 'admin' && (
                <a href="/admin" style={styles.adminLink}>
                  Admin Dashboard
                </a>
              )}
              
              <a href="/profile" style={styles.navLink}>Profile</a>
              
              <button 
                onClick={handleLogout}
                style={styles.logoutButton}
              >
                Logout
              </button>
            </div>
          ) : (
            <div style={styles.authLinks}>
              <a href="/login" style={styles.navLink}>Login</a>
              <a href="/register" style={styles.registerButton}>
                Sign Up
              </a>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

const styles = {
  navbar: {
    backgroundColor: '#2E7D32',
    color: 'white',
    padding: '1rem 0',
    boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
    position: 'sticky',
    top: 0,
    zIndex: 1000
  },
  container: {
    maxWidth: '1200px',
    margin: '0 auto',
    padding: '0 20px',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    flexWrap: 'wrap'
  },
  brand: {
    fontSize: '1.5rem',
    fontWeight: 'bold'
  },
  brandLink: {
    color: 'white',
    textDecoration: 'none'
  },
  menu: {
    display: 'flex',
    alignItems: 'center',
    gap: '20px',
    flexWrap: 'wrap'
  },
  navLink: {
    color: 'white',
    textDecoration: 'none',
    padding: '8px 12px',
    borderRadius: '4px',
    transition: 'background-color 0.3s',
    cursor: 'pointer'
  },
  registerButton: {
    backgroundColor: '#FF6F00',
    color: 'white',
    textDecoration: 'none',
    padding: '10px 20px',
    borderRadius: '5px',
    fontWeight: 'bold',
    transition: 'background-color 0.3s'
  },
  userMenu: {
    display: 'flex',
    alignItems: 'center',
    gap: '15px',
    flexWrap: 'wrap'
  },
  welcome: {
    color: '#E8F5E8',
    fontSize: '0.9rem'
  },
  adminLink: {
    backgroundColor: '#4CAF50',
    color: 'white',
    textDecoration: 'none',
    padding: '6px 12px',
    borderRadius: '4px',
    fontSize: '0.9rem',
    fontWeight: 'bold'
  },
  authLinks: {
    display: 'flex',
    alignItems: 'center',
    gap: '15px'
  },
  logoutButton: {
    backgroundColor: 'transparent',
    color: 'white',
    border: '1px solid white',
    padding: '8px 16px',
    borderRadius: '4px',
    cursor: 'pointer',
    transition: 'all 0.3s',
    fontSize: '0.9rem'
  }
};

// Add hover effects
const styleSheet = document.createElement('style');
styleSheet.textContent = `
  nav a:hover {
    background-color: rgba(255, 255, 255, 0.1) !important;
  }
  
  nav .register-button:hover {
    background-color: #F57C00 !important;
  }
  
  nav .logout-button:hover {
    background-color: white !important;
    color: #2E7D32 !important;
  }
  
  nav .admin-link:hover {
    background-color: #45a049 !important;
  }
  
  @media (max-width: 768px) {
    nav .container {
      flex-direction: column;
      gap: 10px;
    }
    
    nav .menu {
      justify-content: center;
      width: 100%;
    }
    
    nav .user-menu {
      flex-direction: column;
      gap: 8px;
      text-align: center;
    }
  }
`;
document.head.appendChild(styleSheet);

export default Navbar;