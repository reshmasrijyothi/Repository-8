import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';

const LoginPage = () => {
  const { login, isAuthenticated, loading, error, clearError } = useAuth();
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated) {
      window.location.href = '/';
    }
  }, [isAuthenticated]);

  // Clear error when component mounts or form changes
  useEffect(() => {
    clearError();
  }, [clearError, formData]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.email || !formData.password) {
      return;
    }

    setIsSubmitting(true);
    
    try {
      await login(formData.email, formData.password);
      // Redirect will happen automatically via useEffect
    } catch (err) {
      // Error is handled by context
      console.error('Login error:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div style={styles.container}>
        <div style={styles.loadingCard}>
          <h2>🐾 Loading...</h2>
          <p>Please wait while we check your authentication status.</p>
        </div>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <div style={styles.header}>
          <h1 style={styles.title}>Welcome Back!</h1>
          <p style={styles.subtitle}>Sign in to your Pet Adoption Center account</p>
        </div>

        {error && (
          <div style={styles.errorAlert}>
            <span style={styles.errorIcon}>⚠️</span>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} style={styles.form}>
          <div style={styles.formGroup}>
            <label htmlFor="email" style={styles.label}>
              Email Address
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              style={styles.input}
              placeholder="your@email.com"
              disabled={isSubmitting}
            />
          </div>

          <div style={styles.formGroup}>
            <label htmlFor="password" style={styles.label}>
              Password
            </label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
              style={styles.input}
              placeholder="Enter your password"
              disabled={isSubmitting}
            />
          </div>

          <button
            type="submit"
            disabled={isSubmitting || !formData.email || !formData.password}
            style={{
              ...styles.submitButton,
              ...(isSubmitting || !formData.email || !formData.password ? styles.disabledButton : {})
            }}
          >
            {isSubmitting ? '🔄 Signing In...' : '🔑 Sign In'}
          </button>
        </form>

        <div style={styles.footer}>
          <p style={styles.footerText}>
            Don't have an account?{' '}
            <a href="/register" style={styles.link}>
              Create one here
            </a>
          </p>
          
          <div style={styles.demoCredentials}>
            <h3 style={styles.demoTitle}>Demo Credentials:</h3>
            <div style={styles.demoGrid}>
              <div style={styles.demoBox}>
                <strong>Admin:</strong><br />
                admin@petcenter.com<br />
                admin123
              </div>
              <div style={styles.demoBox}>
                <strong>User:</strong><br />
                user@petcenter.com<br />
                user123
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const styles = {
  container: {
    minHeight: '100vh',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
    padding: '20px'
  },
  card: {
    backgroundColor: 'white',
    borderRadius: '10px',
    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
    padding: '40px',
    width: '100%',
    maxWidth: '400px'
  },
  loadingCard: {
    backgroundColor: 'white',
    borderRadius: '10px',
    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
    padding: '40px',
    textAlign: 'center'
  },
  header: {
    textAlign: 'center',
    marginBottom: '30px'
  },
  title: {
    color: '#2E7D32',
    fontSize: '2rem',
    fontWeight: 'bold',
    margin: '0 0 10px 0'
  },
  subtitle: {
    color: '#666',
    fontSize: '1rem',
    margin: 0
  },
  errorAlert: {
    backgroundColor: '#ffebee',
    color: '#c62828',
    padding: '12px',
    borderRadius: '5px',
    marginBottom: '20px',
    display: 'flex',
    alignItems: 'center',
    gap: '8px'
  },
  errorIcon: {
    fontSize: '1.2rem'
  },
  form: {
    display: 'flex',
    flexDirection: 'column'
  },
  formGroup: {
    marginBottom: '20px'
  },
  label: {
    display: 'block',
    marginBottom: '5px',
    color: '#333',
    fontSize: '0.9rem',
    fontWeight: '500'
  },
  input: {
    width: '100%',
    padding: '12px',
    border: '1px solid #ddd',
    borderRadius: '5px',
    fontSize: '1rem',
    transition: 'border-color 0.3s',
    boxSizing: 'border-box'
  },
  submitButton: {
    backgroundColor: '#2E7D32',
    color: 'white',
    padding: '12px',
    border: 'none',
    borderRadius: '5px',
    fontSize: '1rem',
    fontWeight: 'bold',
    cursor: 'pointer',
    transition: 'background-color 0.3s',
    marginTop: '10px'
  },
  disabledButton: {
    backgroundColor: '#ccc',
    cursor: 'not-allowed'
  },
  footer: {
    marginTop: '30px',
    textAlign: 'center'
  },
  footerText: {
    color: '#666',
    fontSize: '0.9rem'
  },
  link: {
    color: '#2E7D32',
    textDecoration: 'none',
    fontWeight: 'bold'
  },
  demoCredentials: {
    marginTop: '25px',
    padding: '20px',
    backgroundColor: '#f8f9fa',
    borderRadius: '8px'
  },
  demoTitle: {
    color: '#333',
    fontSize: '1rem',
    margin: '0 0 15px 0'
  },
  demoGrid: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '10px'
  },
  demoBox: {
    padding: '10px',
    backgroundColor: 'white',
    borderRadius: '5px',
    fontSize: '0.8rem',
    lineHeight: '1.4',
    textAlign: 'left'
  }
};

export default LoginPage;