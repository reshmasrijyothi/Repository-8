import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';

const ServicesPage = () => {
  const { isAuthenticated, user } = useAuth();
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState({
    category: '',
    priceMin: '',
    priceMax: '',
    search: '',
    page: 1,
    limit: 9
  });
  const [categories, setCategories] = useState([]);
  const [selectedService, setSelectedService] = useState(null);
  const [showBookingModal, setShowBookingModal] = useState(false);

  useEffect(() => {
    fetchServices();
    fetchCategories();
  }, [filters]);

  const fetchServices = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const params = new URLSearchParams();
      Object.keys(filters).forEach(key => {
        if (filters[key] && filters[key] !== '') {
          params.append(key, filters[key]);
        }
      });

      const response = await fetch(`${process.env.REACT_APP_API_URL || 'http://localhost:5000/api'}/services?${params.toString()}`);
      
      if (!response.ok) {
        throw new Error('Failed to fetch services');
      }
      
      const data = await response.json();
      setServices(data.services || []);
    } catch (err) {
      setError(err.message || 'Failed to fetch services');
      setServices([]);
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL || 'http://localhost:5000/api'}/services/categories`);
      
      if (response.ok) {
        const data = await response.json();
        setCategories(data.categories || []);
      }
    } catch (err) {
      console.error('Error fetching categories:', err);
    }
  };

  const handleFilterChange = (key, value) => {
    setFilters({
      ...filters,
      [key]: value,
      page: 1 // Reset to first page when filters change
    });
  };

  const clearFilters = () => {
    setFilters({
      category: '',
      priceMin: '',
      priceMax: '',
      search: '',
      page: 1,
      limit: 9
    });
  };

  const handleBookService = (service) => {
    if (!isAuthenticated) {
      alert('Please log in to book a service');
      window.location.href = '/login';
      return;
    }
    
    setSelectedService(service);
    setShowBookingModal(true);
  };

  const BookingModal = () => {
    const [bookingData, setBookingData] = useState({
      date: '',
      time: '',
      petName: '',
      notes: ''
    });
    const [submitting, setSubmitting] = useState(false);

    const handleBookingSubmit = async (e) => {
      e.preventDefault();
      setSubmitting(true);
      
      try {
        // This would normally make an API call to book the service
        await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate API call
        
        alert(`Service booked successfully!\n\nService: ${selectedService.name}\nDate: ${bookingData.date}\nTime: ${bookingData.time}\nPet: ${bookingData.petName}`);
        
        setShowBookingModal(false);
        setSelectedService(null);
        setBookingData({ date: '', time: '', petName: '', notes: '' });
      } catch (err) {
        alert('Failed to book service. Please try again.');
      } finally {
        setSubmitting(false);
      }
    };

    if (!showBookingModal || !selectedService) return null;

    return (
      <div style={styles.modalOverlay}>
        <div style={styles.modal}>
          <div style={styles.modalHeader}>
            <h2>Book Service: {selectedService.name}</h2>
            <button 
              onClick={() => setShowBookingModal(false)}
              style={styles.closeButton}
            >
              ✕
            </button>
          </div>

          <div style={styles.modalBody}>
            <div style={styles.serviceInfo}>
              <p><strong>Price:</strong> ${selectedService.price}</p>
              <p><strong>Duration:</strong> {selectedService.duration} minutes</p>
              <p><strong>Category:</strong> {selectedService.category}</p>
            </div>

            <form onSubmit={handleBookingSubmit} style={styles.bookingForm}>
              <div style={styles.formGroup}>
                <label style={styles.label}>Preferred Date *</label>
                <input
                  type="date"
                  value={bookingData.date}
                  onChange={(e) => setBookingData({...bookingData, date: e.target.value})}
                  required
                  style={styles.input}
                  min={new Date().toISOString().split('T')[0]}
                />
              </div>

              <div style={styles.formGroup}>
                <label style={styles.label}>Preferred Time *</label>
                <select
                  value={bookingData.time}
                  onChange={(e) => setBookingData({...bookingData, time: e.target.value})}
                  required
                  style={styles.select}
                >
                  <option value="">Select time</option>
                  <option value="09:00">9:00 AM</option>
                  <option value="10:00">10:00 AM</option>
                  <option value="11:00">11:00 AM</option>
                  <option value="14:00">2:00 PM</option>
                  <option value="15:00">3:00 PM</option>
                  <option value="16:00">4:00 PM</option>
                </select>
              </div>

              <div style={styles.formGroup}>
                <label style={styles.label}>Pet Name *</label>
                <input
                  type="text"
                  value={bookingData.petName}
                  onChange={(e) => setBookingData({...bookingData, petName: e.target.value})}
                  required
                  style={styles.input}
                  placeholder="Your pet's name"
                />
              </div>

              <div style={styles.formGroup}>
                <label style={styles.label}>Special Notes</label>
                <textarea
                  value={bookingData.notes}
                  onChange={(e) => setBookingData({...bookingData, notes: e.target.value})}
                  style={styles.textarea}
                  placeholder="Any special requirements or notes..."
                  rows="3"
                />
              </div>

              <div style={styles.modalActions}>
                <button
                  type="button"
                  onClick={() => setShowBookingModal(false)}
                  style={styles.cancelButton}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  style={styles.bookButton}
                >
                  {submitting ? 'Booking...' : 'Book Service'}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    );
  };

  const renderServiceCard = (service) => (
    <div key={service._id} style={styles.serviceCard}>
      <div style={styles.serviceImageContainer}>
        {service.images && service.images.length > 0 ? (
          <img 
            src={service.images[0]} 
            alt={service.name}
            style={styles.serviceImage}
            onError={(e) => {
              e.target.src = `https://via.placeholder.com/300x200/2E7D32/white?text=${service.category}`;
            }}
          />
        ) : (
          <div style={styles.serviceImagePlaceholder}>
            <span style={styles.serviceEmoji}>
              {service.category === 'grooming' ? '✂️' : 
               service.category === 'veterinary' ? '🩺' : 
               service.category === 'training' ? '🎓' : '🏥'}
            </span>
            <span>{service.name}</span>
          </div>
        )}
        
        <div style={styles.categoryBadge}>
          {service.category}
        </div>
      </div>

      <div style={styles.serviceInfo}>
        <h3 style={styles.serviceName}>{service.name}</h3>
        
        <div style={styles.serviceDetails}>
          <span style={styles.serviceDetail}>
            💰 ${service.price}
          </span>
          <span style={styles.serviceDetail}>
            ⏱️ {service.duration} min
          </span>
        </div>

        <p style={styles.serviceDescription}>
          {service.description && service.description.length > 120 
            ? `${service.description.substring(0, 120)}...`
            : service.description || 'No description available'}
        </p>

        {service.provider && (
          <div style={styles.providerInfo}>
            <p style={styles.providerName}>
              👨‍⚕️ {service.provider.name || 'Professional Provider'}
            </p>
            {service.provider.rating && (
              <div style={styles.rating}>
                ⭐ {service.provider.rating}/5
              </div>
            )}
          </div>
        )}

        <div style={styles.cardActions}>
          <button 
            style={styles.viewButton}
            onClick={() => alert(`Service Details:\n\n${service.description}\n\nProvider: ${service.provider?.name || 'N/A'}\nPrice: $${service.price}\nDuration: ${service.duration} minutes`)}
          >
            👁️ View Details
          </button>
          
          <button 
            style={styles.bookButton}
            onClick={() => handleBookService(service)}
          >
            📅 Book Now
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h1 style={styles.title}>Pet Care Services 🏥</h1>
        <p style={styles.subtitle}>
          Professional care services for your beloved pets
        </p>
      </div>

      {/* Filters Section */}
      <div style={styles.filtersContainer}>
        <div style={styles.filtersHeader}>
          <h3 style={styles.filtersTitle}>Find the Right Service</h3>
          <button onClick={clearFilters} style={styles.clearButton}>
            🗑️ Clear All
          </button>
        </div>

        <div style={styles.searchContainer}>
          <input
            type="text"
            placeholder="Search services..."
            value={filters.search}
            onChange={(e) => handleFilterChange('search', e.target.value)}
            style={styles.searchInput}
          />
        </div>

        <div style={styles.filtersGrid}>
          <select
            value={filters.category}
            onChange={(e) => handleFilterChange('category', e.target.value)}
            style={styles.filterSelect}
          >
            <option value="">All Categories</option>
            {categories.map(category => (
              <option key={category} value={category}>
                {category.charAt(0).toUpperCase() + category.slice(1)}
              </option>
            ))}
          </select>

          <div style={styles.priceRange}>
            <input
              type="number"
              placeholder="Min price"
              value={filters.priceMin}
              onChange={(e) => handleFilterChange('priceMin', e.target.value)}
              style={styles.priceInput}
              min="0"
            />
            <span style={styles.priceRangeSeparator}>to</span>
            <input
              type="number"
              placeholder="Max price"
              value={filters.priceMax}
              onChange={(e) => handleFilterChange('priceMax', e.target.value)}
              style={styles.priceInput}
              min="0"
            />
          </div>
        </div>
      </div>

      {/* Results Section */}
      <div style={styles.resultsContainer}>
        {loading ? (
          <div style={styles.loadingContainer}>
            <div style={styles.loadingSpinner}>🔄</div>
            <p>Loading services...</p>
          </div>
        ) : error ? (
          <div style={styles.errorContainer}>
            <div style={styles.errorIcon}>😿</div>
            <h3>Oops! Something went wrong</h3>
            <p>{error}</p>
            <button onClick={fetchServices} style={styles.retryButton}>
              🔄 Try Again
            </button>
          </div>
        ) : services.length === 0 ? (
          <div style={styles.noResultsContainer}>
            <div style={styles.noResultsIcon}>🔍</div>
            <h3>No services found</h3>
            <p>Try adjusting your filters or search terms</p>
            <button onClick={clearFilters} style={styles.clearFiltersButton}>
              🗑️ Clear Filters
            </button>
          </div>
        ) : (
          <>
            <div style={styles.resultsHeader}>
              <h3 style={styles.resultsTitle}>
                Found {services.length} services
              </h3>
            </div>

            <div style={styles.servicesGrid}>
              {services.map(renderServiceCard)}
            </div>
          </>
        )}
      </div>

      <BookingModal />
    </div>
  );
};

const styles = {
  container: {
    maxWidth: '1200px',
    margin: '0 auto',
    padding: '20px'
  },
  header: {
    textAlign: 'center',
    marginBottom: '30px'
  },
  title: {
    color: '#2E7D32',
    fontSize: '2.5rem',
    fontWeight: 'bold',
    margin: '0 0 10px 0'
  },
  subtitle: {
    color: '#666',
    fontSize: '1.1rem',
    margin: 0
  },
  filtersContainer: {
    backgroundColor: 'white',
    padding: '25px',
    borderRadius: '10px',
    boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
    marginBottom: '30px'
  },
  filtersHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '20px'
  },
  filtersTitle: {
    color: '#333',
    margin: 0
  },
  clearButton: {
    backgroundColor: '#f44336',
    color: 'white',
    border: 'none',
    padding: '8px 15px',
    borderRadius: '5px',
    cursor: 'pointer',
    fontSize: '0.9rem'
  },
  searchContainer: {
    marginBottom: '20px'
  },
  searchInput: {
    width: '100%',
    padding: '12px',
    border: '1px solid #ddd',
    borderRadius: '5px',
    fontSize: '1rem',
    boxSizing: 'border-box'
  },
  filtersGrid: {
    display: 'grid',
    gridTemplateColumns: '1fr 2fr',
    gap: '15px',
    alignItems: 'end'
  },
  filterSelect: {
    padding: '10px',
    border: '1px solid #ddd',
    borderRadius: '5px',
    fontSize: '0.9rem',
    backgroundColor: 'white'
  },
  priceRange: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px'
  },
  priceInput: {
    padding: '10px',
    border: '1px solid #ddd',
    borderRadius: '5px',
    fontSize: '0.9rem',
    width: '100px'
  },
  priceRangeSeparator: {
    color: '#666',
    fontSize: '0.9rem'
  },
  resultsContainer: {
    minHeight: '400px'
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
  noResultsContainer: {
    textAlign: 'center',
    padding: '50px',
    color: '#666'
  },
  noResultsIcon: {
    fontSize: '4rem',
    marginBottom: '20px'
  },
  clearFiltersButton: {
    backgroundColor: '#FF6F00',
    color: 'white',
    border: 'none',
    padding: '12px 24px',
    borderRadius: '5px',
    cursor: 'pointer',
    fontSize: '1rem',
    marginTop: '15px'
  },
  resultsHeader: {
    marginBottom: '25px'
  },
  resultsTitle: {
    color: '#333',
    fontSize: '1.3rem',
    margin: 0
  },
  servicesGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
    gap: '25px'
  },
  serviceCard: {
    backgroundColor: 'white',
    borderRadius: '12px',
    boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
    overflow: 'hidden',
    transition: 'transform 0.3s, box-shadow 0.3s'
  },
  serviceImageContainer: {
    position: 'relative',
    height: '200px',
    overflow: 'hidden'
  },
  serviceImage: {
    width: '100%',
    height: '100%',
    objectFit: 'cover'
  },
  serviceImagePlaceholder: {
    width: '100%',
    height: '100%',
    backgroundColor: '#2E7D32',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    color: 'white',
    fontSize: '1.2rem',
    fontWeight: 'bold'
  },
  serviceEmoji: {
    fontSize: '3rem',
    marginBottom: '10px'
  },
  categoryBadge: {
    position: 'absolute',
    top: '10px',
    right: '10px',
    backgroundColor: 'rgba(0,0,0,0.8)',
    color: 'white',
    padding: '4px 8px',
    borderRadius: '4px',
    fontSize: '0.8rem',
    textTransform: 'capitalize'
  },
  serviceInfo: {
    padding: '20px'
  },
  serviceName: {
    color: '#2E7D32',
    fontSize: '1.3rem',
    fontWeight: 'bold',
    margin: '0 0 10px 0'
  },
  serviceDetails: {
    display: 'flex',
    gap: '15px',
    marginBottom: '12px'
  },
  serviceDetail: {
    color: '#666',
    fontSize: '0.9rem',
    fontWeight: '500'
  },
  serviceDescription: {
    color: '#555',
    fontSize: '0.9rem',
    lineHeight: '1.4',
    marginBottom: '15px'
  },
  providerInfo: {
    backgroundColor: '#f8f9fa',
    padding: '10px',
    borderRadius: '5px',
    marginBottom: '15px'
  },
  providerName: {
    margin: '0 0 5px 0',
    fontSize: '0.9rem',
    color: '#333'
  },
  rating: {
    fontSize: '0.8rem',
    color: '#666'
  },
  cardActions: {
    display: 'flex',
    gap: '10px'
  },
  viewButton: {
    flex: 1,
    backgroundColor: '#6c757d',
    color: 'white',
    border: 'none',
    padding: '10px',
    borderRadius: '5px',
    cursor: 'pointer',
    fontSize: '0.9rem',
    fontWeight: 'bold'
  },
  bookButton: {
    flex: 1,
    backgroundColor: '#2E7D32',
    color: 'white',
    border: 'none',
    padding: '10px',
    borderRadius: '5px',
    cursor: 'pointer',
    fontSize: '0.9rem',
    fontWeight: 'bold'
  },
  modalOverlay: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.5)',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000
  },
  modal: {
    backgroundColor: 'white',
    borderRadius: '10px',
    width: '90%',
    maxWidth: '500px',
    maxHeight: '90vh',
    overflow: 'auto'
  },
  modalHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '20px 20px 0 20px',
    borderBottom: '1px solid #eee'
  },
  closeButton: {
    background: 'none',
    border: 'none',
    fontSize: '1.5rem',
    cursor: 'pointer',
    color: '#666'
  },
  modalBody: {
    padding: '20px'
  },
  bookingForm: {
    marginTop: '20px'
  },
  formGroup: {
    marginBottom: '15px'
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
    padding: '10px',
    border: '1px solid #ddd',
    borderRadius: '5px',
    fontSize: '1rem',
    boxSizing: 'border-box'
  },
  select: {
    width: '100%',
    padding: '10px',
    border: '1px solid #ddd',
    borderRadius: '5px',
    fontSize: '1rem',
    backgroundColor: 'white',
    boxSizing: 'border-box'
  },
  textarea: {
    width: '100%',
    padding: '10px',
    border: '1px solid #ddd',
    borderRadius: '5px',
    fontSize: '1rem',
    resize: 'vertical',
    boxSizing: 'border-box'
  },
  modalActions: {
    display: 'flex',
    gap: '10px',
    marginTop: '20px'
  },
  cancelButton: {
    flex: 1,
    backgroundColor: '#6c757d',
    color: 'white',
    border: 'none',
    padding: '12px',
    borderRadius: '5px',
    cursor: 'pointer',
    fontSize: '1rem'
  }
};

// Add hover effects
const styleSheet = document.createElement('style');
styleSheet.textContent = `
  .service-card:hover {
    transform: translateY(-4px);
    box-shadow: 0 8px 25px rgba(0,0,0,0.15) !important;
  }
  
  @media (max-width: 768px) {
    .filters-grid {
      grid-template-columns: 1fr !important;
    }
    
    .services-grid {
      grid-template-columns: 1fr !important;
    }
    
    .price-range {
      flex-direction: column !important;
      gap: 5px !important;
    }
    
    .card-actions {
      flex-direction: column !important;
    }
  }
`;
document.head.appendChild(styleSheet);

export default ServicesPage;