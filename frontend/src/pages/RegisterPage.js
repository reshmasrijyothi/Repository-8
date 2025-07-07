import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';

const RegisterPage = () => {
  const { register, isAuthenticated, loading, error, clearError } = useAuth();
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
    phone: '',
    address: {
      street: '',
      city: '',
      state: '',
      zipCode: ''
    }
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [validationErrors, setValidationErrors] = useState({});

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated) {
      window.location.href = '/';
    }
  }, [isAuthenticated]);

  // Clear error when component mounts
  useEffect(() => {
    clearError();
  }, [clearError]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    
    if (name.startsWith('address.')) {
      const addressField = name.split('.')[1];
      setFormData({
        ...formData,
        address: {
          ...formData.address,
          [addressField]: value
        }
      });
    } else {
      setFormData({
        ...formData,
        [name]: value
      });
    }

    // Clear validation error for this field
    if (validationErrors[name]) {
      setValidationErrors({
        ...validationErrors,
        [name]: null
      });
    }
  };

  const validateForm = () => {
    const errors = {};

    // Required fields
    if (!formData.firstName.trim()) errors.firstName = 'First name is required';
    if (!formData.lastName.trim()) errors.lastName = 'Last name is required';
    if (!formData.email.trim()) errors.email = 'Email is required';
    if (!formData.password) errors.password = 'Password is required';
    if (!formData.phone.trim()) errors.phone = 'Phone number is required';

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (formData.email && !emailRegex.test(formData.email)) {
      errors.email = 'Please enter a valid email address';
    }

    // Password validation
    if (formData.password && formData.password.length < 6) {
      errors.password = 'Password must be at least 6 characters long';
    }

    // Confirm password
    if (formData.password !== formData.confirmPassword) {
      errors.confirmPassword = 'Passwords do not match';
    }

    // Phone validation (basic)
    const phoneRegex = /^[\d\s\-\+\(\)]+$/;
    if (formData.phone && !phoneRegex.test(formData.phone)) {
      errors.phone = 'Please enter a valid phone number';
    }

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);
    
    try {
      const { confirmPassword, ...registrationData } = formData;
      await register(registrationData);
      // Redirect will happen automatically via useEffect
    } catch (err) {
      // Error is handled by context
      console.error('Registration error:', err);
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
          <h1 style={styles.title}>Join Our Community!</h1>
          <p style={styles.subtitle}>Create your Pet Adoption Center account</p>
        </div>

        {error && (
          <div style={styles.errorAlert}>
            <span style={styles.errorIcon}>⚠️</span>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} style={styles.form}>
          <div style={styles.row}>
            <div style={styles.formGroup}>
              <label htmlFor="firstName" style={styles.label}>
                First Name *
              </label>
              <input
                type="text"
                id="firstName"
                name="firstName"
                value={formData.firstName}
                onChange={handleChange}
                required
                style={{
                  ...styles.input,
                  ...(validationErrors.firstName ? styles.inputError : {})
                }}
                placeholder="John"
                disabled={isSubmitting}
              />
              {validationErrors.firstName && (
                <span style={styles.errorText}>{validationErrors.firstName}</span>
              )}
            </div>

            <div style={styles.formGroup}>
              <label htmlFor="lastName" style={styles.label}>
                Last Name *
              </label>
              <input
                type="text"
                id="lastName"
                name="lastName"
                value={formData.lastName}
                onChange={handleChange}
                required
                style={{
                  ...styles.input,
                  ...(validationErrors.lastName ? styles.inputError : {})
                }}
                placeholder="Doe"
                disabled={isSubmitting}
              />
              {validationErrors.lastName && (
                <span style={styles.errorText}>{validationErrors.lastName}</span>
              )}
            </div>
          </div>

          <div style={styles.formGroup}>
            <label htmlFor="email" style={styles.label}>
              Email Address *
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              style={{
                ...styles.input,
                ...(validationErrors.email ? styles.inputError : {})
              }}
              placeholder="john@example.com"
              disabled={isSubmitting}
            />
            {validationErrors.email && (
              <span style={styles.errorText}>{validationErrors.email}</span>
            )}
          </div>

          <div style={styles.formGroup}>
            <label htmlFor="phone" style={styles.label}>
              Phone Number *
            </label>
            <input
              type="tel"
              id="phone"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              required
              style={{
                ...styles.input,
                ...(validationErrors.phone ? styles.inputError : {})
              }}
              placeholder="(555) 123-4567"
              disabled={isSubmitting}
            />
            {validationErrors.phone && (
              <span style={styles.errorText}>{validationErrors.phone}</span>
            )}
          </div>

          <div style={styles.row}>
            <div style={styles.formGroup}>
              <label htmlFor="password" style={styles.label}>
                Password *
              </label>
              <input
                type="password"
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                required
                style={{
                  ...styles.input,
                  ...(validationErrors.password ? styles.inputError : {})
                }}
                placeholder="Min. 6 characters"
                disabled={isSubmitting}
              />
              {validationErrors.password && (
                <span style={styles.errorText}>{validationErrors.password}</span>
              )}
            </div>

            <div style={styles.formGroup}>
              <label htmlFor="confirmPassword" style={styles.label}>
                Confirm Password *
              </label>
              <input
                type="password"
                id="confirmPassword"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                required
                style={{
                  ...styles.input,
                  ...(validationErrors.confirmPassword ? styles.inputError : {})
                }}
                placeholder="Confirm password"
                disabled={isSubmitting}
              />
              {validationErrors.confirmPassword && (
                <span style={styles.errorText}>{validationErrors.confirmPassword}</span>
              )}
            </div>
          </div>

          <div style={styles.sectionTitle}>
            <h3>Address (Optional)</h3>
          </div>

          <div style={styles.formGroup}>
            <label htmlFor="address.street" style={styles.label}>
              Street Address
            </label>
            <input
              type="text"
              id="address.street"
              name="address.street"
              value={formData.address.street}
              onChange={handleChange}
              style={styles.input}
              placeholder="123 Main St"
              disabled={isSubmitting}
            />
          </div>

          <div style={styles.row}>
            <div style={styles.formGroup}>
              <label htmlFor="address.city" style={styles.label}>
                City
              </label>
              <input
                type="text"
                id="address.city"
                name="address.city"
                value={formData.address.city}
                onChange={handleChange}
                style={styles.input}
                placeholder="City"
                disabled={isSubmitting}
              />
            </div>

            <div style={styles.formGroup}>
              <label htmlFor="address.state" style={styles.label}>
                State
              </label>
              <input
                type="text"
                id="address.state"
                name="address.state"
                value={formData.address.state}
                onChange={handleChange}
                style={styles.input}
                placeholder="State"
                disabled={isSubmitting}
              />
            </div>

            <div style={styles.formGroup}>
              <label htmlFor="address.zipCode" style={styles.label}>
                ZIP Code
              </label>
              <input
                type="text"
                id="address.zipCode"
                name="address.zipCode"
                value={formData.address.zipCode}
                onChange={handleChange}
                style={styles.input}
                placeholder="12345"
                disabled={isSubmitting}
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            style={{
              ...styles.submitButton,
              ...(isSubmitting ? styles.disabledButton : {})
            }}
          >
            {isSubmitting ? '🔄 Creating Account...' : '🎉 Create Account'}
          </button>
        </form>

        <div style={styles.footer}>
          <p style={styles.footerText}>
            Already have an account?{' '}
            <a href="/login" style={styles.link}>
              Sign in here
            </a>
          </p>
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
    maxWidth: '600px'
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
  row: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '15px',
    '@media (max-width: 600px)': {
      gridTemplateColumns: '1fr'
    }
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
  inputError: {
    borderColor: '#f44336'
  },
  errorText: {
    color: '#f44336',
    fontSize: '0.8rem',
    marginTop: '4px',
    display: 'block'
  },
  sectionTitle: {
    margin: '30px 0 20px 0',
    paddingTop: '20px',
    borderTop: '1px solid #eee'
  },
  submitButton: {
    backgroundColor: '#2E7D32',
    color: 'white',
    padding: '15px',
    border: 'none',
    borderRadius: '5px',
    fontSize: '1.1rem',
    fontWeight: 'bold',
    cursor: 'pointer',
    transition: 'background-color 0.3s',
    marginTop: '20px'
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
  }
};

// Add responsive styles
const styleSheet = document.createElement('style');
styleSheet.textContent = `
  @media (max-width: 600px) {
    .row {
      grid-template-columns: 1fr !important;
    }
  }
`;
document.head.appendChild(styleSheet);

export default RegisterPage;